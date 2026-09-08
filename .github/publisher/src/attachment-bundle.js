import yazl from 'yazl';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ATTACHMENT_TYPES, DEFAULT_MAX_ATTACHMENT_BYTES, LIMITS } from './constants.js';
import { fail, PublisherError } from './errors.js';
import { canonicalJson, checksum, stableId } from './models.js';

export const ATTACHMENTS_FORMAT_VERSION = 1;
const materialPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\/(lecture|seminar|homework)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sha256Pattern = /^[a-f0-9]{64}$/;
const suffixes = Object.keys(ATTACHMENT_TYPES).sort((a, b) => b.length - a.length);

function assertMaterial(materialKey) {
  if (typeof materialKey !== 'string' || !materialPattern.test(materialKey)) fail('ATTACHMENT_IDENTITY_INVALID', 'A canonical course/kind/material identity is required');
}

export function attachmentEntryPath(attachment) {
  const { key, fileName } = attachment;
  if (typeof key !== 'string' || key.length > 80 || !keyPattern.test(key) || typeof fileName !== 'string' || !fileName || fileName === '.' || fileName === '..' || /[\\/\x00-\x1f\x7f:]/.test(fileName) || Buffer.from(fileName, 'utf8').toString('utf8') !== fileName) {
    fail('ATTACHMENT_PATH_INVALID', 'ZIP entry requires a safe key and original basename', { path: attachment.file });
  }
  const entryPath = `${key}/${fileName}`;
  if (Buffer.byteLength(entryPath, 'utf8') > LIMITS.maxAttachmentEntryPathBytes) fail('ATTACHMENT_PATH_INVALID', `ZIP entry path exceeds ${LIMITS.maxAttachmentEntryPathBytes} UTF-8 bytes`, { path: attachment.file });
  return entryPath;
}

export function attachmentRevisionManifest(materialKey, attachments) {
  assertMaterial(materialKey);
  if (!Array.isArray(attachments) || attachments.length > LIMITS.maxAttachmentsPerMaterial) fail('MANIFEST_LIMIT', `Material ${materialKey} exceeds ${LIMITS.maxAttachmentsPerMaterial} downloadable attachments`, { path: materialKey });
  const keys = new Set(); const orders = new Set();
  for (const attachment of attachments) {
    attachmentEntryPath(attachment);
    const extension = suffixes.find((suffix) => attachment.fileName.toLowerCase().endsWith(suffix));
    if (!extension || attachment.mimeType !== ATTACHMENT_TYPES[extension] || !sha256Pattern.test(attachment.checksum) || !Number.isSafeInteger(attachment.sizeBytes) || attachment.sizeBytes <= 0 || attachment.sizeBytes > DEFAULT_MAX_ATTACHMENT_BYTES || !Number.isSafeInteger(attachment.sortOrder) || attachment.sortOrder < 0) {
      fail('ATTACHMENT_METADATA_INVALID', `Invalid attachment metadata for material ${materialKey}`, { path: attachment.file });
    }
    if (keys.has(attachment.key) || orders.has(attachment.sortOrder)) fail('MANIFEST_DUPLICATE', `Duplicate attachment key or sortOrder in ${materialKey}`, { path: materialKey });
    keys.add(attachment.key); orders.add(attachment.sortOrder);
  }
  return Object.freeze({
    formatVersion: ATTACHMENTS_FORMAT_VERSION,
    materialKey,
    attachments: Object.freeze([...attachments].sort((a, b) => a.sortOrder - b.sortOrder).map(({ key, fileName, mimeType, sizeBytes, sortOrder, checksum: sha256 }) => Object.freeze({ key, fileName, mimeType, sizeBytes, sortOrder, sha256 }))),
  });
}

export function attachmentSourceFileId(materialKey, attachment) {
  assertMaterial(materialKey);
  return stableId('att', checksum(canonicalJson({ formatVersion: ATTACHMENTS_FORMAT_VERSION, materialKey, key: attachment.key, sha256: attachment.checksum })));
}

export async function readAttachmentSource(root, relative, maxBytes = DEFAULT_MAX_ATTACHMENT_BYTES) {
  if (typeof relative !== 'string' || !relative.startsWith('attachments/') || /[\\\x00-\x1f\x7f]/.test(relative) || relative.split('/').some((part) => !part || part === '.' || part === '..')) fail('ATTACHMENT_PATH_INVALID', 'Attachment must be a safe path under attachments/', { path: relative });
  const canonicalRoot = await fs.realpath(root);
  const target = path.resolve(root, relative);
  const canonicalTarget = await fs.realpath(target).catch(() => fail('FILE_MISSING', 'Declared attachment is missing', { path: relative }));
  if (!canonicalTarget.startsWith(`${canonicalRoot}${path.sep}`)) fail('ATTACHMENT_PATH_INVALID', 'Attachment escapes repository root', { path: relative });
  const stat = await fs.lstat(target);
  if (!stat.isFile() || stat.isSymbolicLink()) fail('FILE_INVALID', 'Declared attachment must be a regular file', { path: relative });
  if (stat.size > maxBytes) fail('FILE_TOO_LARGE', `Attachment exceeds ${maxBytes} bytes`, { path: relative });
  const bytes = await fs.readFile(target);
  if (bytes.length > maxBytes) fail('FILE_TOO_LARGE', `Attachment exceeds ${maxBytes} bytes`, { path: relative });
  if (bytes.length < 1024 && bytes.toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1\n')) fail('LFS_POINTER_UNRESOLVED', 'Git LFS object was not materialized before validation', { path: relative });
  return bytes;
}

function exceeds(materialKey, actualBytes, category) {
  fail('ATTACHMENT_BUNDLE_TOO_LARGE', `Material ${materialKey}: ${category} ${actualBytes} bytes exceeds ${LIMITS.maxAttachmentBundleBytes} bytes; revise source files or their sizes`, { path: materialKey, actualBytes, limitBytes: LIMITS.maxAttachmentBundleBytes });
}

export function planAttachmentBundle(materialKey, attachments) {
  const manifest = attachmentRevisionManifest(materialKey, attachments);
  const attachmentsRevision = checksum(canonicalJson(manifest));
  const sourceTotalBytes = manifest.attachments.reduce((sum, item) => sum + item.sizeBytes, 0);
  if (sourceTotalBytes > LIMITS.maxAttachmentBundleBytes) exceeds(materialKey, sourceTotalBytes, 'source total');
  // addBuffer + STORE + DOS-only timestamps use no descriptors or extras.
  const zipSizeBytes = attachments.length === 0 ? 0 : 22 + manifest.attachments.reduce((sum, item) => sum + item.sizeBytes + 76 + 2 * Buffer.byteLength(attachmentEntryPath(item), 'utf8'), 0);
  if (zipSizeBytes > LIMITS.maxAttachmentBundleBytes) exceeds(materialKey, zipSizeBytes, 'planned ZIP including headers');
  return Object.freeze({ manifest, attachmentsRevision, sourceTotalBytes, zipSizeBytes });
}

export async function buildAttachmentBundle(materialKey, attachments, readSource, { createZipFile = () => new yazl.ZipFile() } = {}) {
  const planned = planAttachmentBundle(materialKey, attachments);
  if (attachments.length === 0) return Object.freeze({ attachmentsRevision: planned.attachmentsRevision, descriptor: null, bytes: null });
  const sourceByKey = new Map(attachments.map((item) => [item.key, item]));
  const inputs = [];
  for (const item of planned.manifest.attachments) {
    const original = sourceByKey.get(item.key);
    const bytes = await readSource(original);
    if (!Buffer.isBuffer(bytes) || bytes.length !== item.sizeBytes || checksum(bytes) !== item.sha256) fail('ATTACHMENT_INTEGRITY_MISMATCH', 'Download attachment differs from the publication plan', { path: original.file });
    inputs.push({ entryPath: attachmentEntryPath(item), bytes });
  }
  let zip;
  try {
    zip = createZipFile();
    zip.on('error', (error) => zip.outputStream.destroy(error));
    const chunks = []; let total = 0;
    const collect = (async () => {
      for await (const chunk of zip.outputStream) {
        total += chunk.length;
        if (total > LIMITS.maxAttachmentBundleBytes) exceeds(materialKey, total, 'finished ZIP');
        chunks.push(chunk);
      }
      if (total !== planned.zipSizeBytes) fail('ATTACHMENT_BUNDLE_INTEGRITY_MISMATCH', `Material ${materialKey}: finished ZIP size ${total} bytes differs from planned ${planned.zipSizeBytes} bytes`, { path: materialKey });
      return Buffer.concat(chunks, total);
    })();
    // Observe failures immediately, even when a synchronous writer call fails.
    collect.catch(() => undefined);
    for (const input of inputs) zip.addBuffer(input.bytes, input.entryPath, { compress: false, mtime: new Date(1980, 0, 1, 0, 0, 0), mode: 0o100644, forceDosTimestamp: true, forceZip64Format: false, fileComment: '' });
    zip.end({ forceZip64Format: false, comment: '' });
    const bytes = await collect;
    const sha256 = checksum(bytes);
    const descriptor = Object.freeze({
      attachmentsRevision: planned.attachmentsRevision,
      fileId: stableId('zip', checksum(canonicalJson({ formatVersion: ATTACHMENTS_FORMAT_VERSION, materialKey, attachmentsRevision: planned.attachmentsRevision, sha256 }))),
      fileName: `${materialKey.split('/').at(-1)}-attachments.zip`,
      mimeType: 'application/zip', sizeBytes: bytes.length, sha256,
      attachmentCount: attachments.length, sourceTotalBytes: planned.sourceTotalBytes,
    });
    return Object.freeze({ attachmentsRevision: planned.attachmentsRevision, descriptor, bytes });
  } catch (error) {
    zip?.outputStream?.destroy();
    if (error instanceof PublisherError) throw error;
    fail('ATTACHMENT_BUNDLE_BUILD_FAILED', `Unable to build the complete ZIP for material ${materialKey}`, { path: materialKey });
  }
}
