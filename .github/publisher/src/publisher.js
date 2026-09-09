import fs from 'node:fs/promises';
import path from 'node:path';
import { createAdapter } from './appwrite.js';
import { fail } from './errors.js';
import { applyMarkdownRewrites } from './markdown.js';
import { canonicalJson, checksum } from './models.js';
import { materialContentFileId } from './content-identity.js';
import { attachmentSourceFileId, buildAttachmentBundle, readAttachmentSource } from './attachment-bundle.js';
import { parseAttachmentLimit } from './config.js';

import { assertPublicationReadiness, readPublicationReadiness } from './publication-readiness.js';
import { publishRevisionPlan } from './revision-publisher.js';

const locks = new Map();
const downloadable = (material) => material.attachments ?? [];
function withCourseLock(slug, action) {
  const previous = locks.get(slug) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(action);
  locks.set(slug, next);
  next.finally(() => { if (locks.get(slug) === next) locks.delete(slug); }).catch(() => undefined);
  return next;
}
async function bytes(root, relative) { return fs.readFile(path.resolve(root, relative)); }
export async function preparePublicationFiles(plan, root, bundleOptions) {
  const prepared = new Map();
  const maxAttachmentBytes = parseAttachmentLimit(plan.maxAttachmentBytes);
  for (const material of plan.materials) {
    if (material.content) {
      const sourceBytes = await bytes(root, material.content.path);
      if (checksum(sourceBytes) !== material.content.sourceChecksum) fail('MARKDOWN_SOURCE_CHANGED', 'Authored Markdown differs from the validated publication plan', { path: material.content.path });
      let source;
      try { source = new TextDecoder('utf-8', { fatal: true }).decode(sourceBytes); } catch { fail('MARKDOWN_UTF8_INVALID', 'Markdown must be valid UTF-8', { path: material.content.path }); }
      const uploadBytes = Buffer.from(applyMarkdownRewrites(source, material.content.rewrites ?? []));
      const transformedChecksum = checksum(uploadBytes);
      if (transformedChecksum !== material.content.checksum || materialContentFileId(material.resourceKey, 'markdown', transformedChecksum) !== material.content.fileId) fail('MARKDOWN_INTEGRITY_MISMATCH', 'Prepared Markdown differs from the validated transformed content', { path: material.content.path });
      prepared.set(`markdown:${material.content.path}`, uploadBytes);
    }
    if (material.briefContent) {
      const sourceBytes = await bytes(root, material.briefContent.path);
      if (checksum(sourceBytes) !== material.briefContent.sourceChecksum) fail('MARKDOWN_SOURCE_CHANGED', 'Authored concise Markdown differs from the validated publication plan', { path: material.briefContent.path });
      let source;
      try { source = new TextDecoder('utf-8', { fatal: true }).decode(sourceBytes); } catch { fail('MARKDOWN_UTF8_INVALID', 'Concise Markdown must be valid UTF-8', { path: material.briefContent.path }); }
      const uploadBytes = Buffer.from(applyMarkdownRewrites(source, material.briefContent.rewrites ?? []));
      const digest = checksum(uploadBytes);
      if (digest !== material.briefContent.checksum || materialContentFileId(material.resourceKey, 'brief-markdown', digest) !== material.briefContent.fileId) fail('MARKDOWN_INTEGRITY_MISMATCH', 'Prepared concise Markdown differs from the publication plan', { path: material.briefContent.path });
      prepared.set(`markdown:${material.briefContent.path}`, uploadBytes);
    }
    for (const asset of material.assets) {
      const assetBytes = await bytes(root, asset.file);
      const assetChecksum = checksum(assetBytes);
      if (assetChecksum !== asset.checksum || materialContentFileId(material.resourceKey, 'asset', assetChecksum) !== asset.fileId) fail('ASSET_INTEGRITY_MISMATCH', 'Asset differs from the validated publication plan', { path: asset.file });
      prepared.set(`asset:${asset.file}`, assetBytes);
    }
    for (const attachment of downloadable(material)) {
      const attachmentBytes = await readAttachmentSource(root, attachment.file, maxAttachmentBytes);
      const digest = checksum(attachmentBytes);
      if (digest !== attachment.checksum || attachmentSourceFileId(material.resourceKey, attachment) !== attachment.fileId || attachmentBytes.length !== attachment.sizeBytes) fail('ATTACHMENT_INTEGRITY_MISMATCH', 'Download attachment differs from the publication plan', { path: attachment.file });
      prepared.set(`attachment:${attachment.file}`, attachmentBytes);
    }
    if (plan.version === 2 || downloadable(material).length) {
      const bundle = await buildAttachmentBundle(material.resourceKey, downloadable(material), (attachment) => prepared.get(`attachment:${attachment.file}`), bundleOptions);
      if (bundle.attachmentsRevision !== material.attachmentsRevision || canonicalJson(bundle.descriptor) !== canonicalJson(material.bundle)) fail('ATTACHMENT_BUNDLE_INTEGRITY_MISMATCH', 'Prepared attachment revision or ZIP differs from the publication plan', { path: material.resourceKey });
      if (bundle.bytes) prepared.set(`bundle:${material.resourceKey}`, bundle.bytes);
    }
  }
  return prepared;
}
export async function publishPlan(plan, { adapter, root = process.cwd(), bundleOptions, adapterFactory = createAdapter, readiness, sourceGuard, env = process.env } = {}) {
  if (plan?.version !== 2) fail('PUBLICATION_PLAN_INVALID', 'Only a fresh validated revision plan is supported');
  const approved = assertPublicationReadiness(readiness ?? readPublicationReadiness(env), plan.course?.slug);
  return withCourseLock(plan.course.slug, () => publishRevisionPlan(plan, {
    adapter, adapterFactory, root, bundleOptions, readiness: approved, sourceGuard, env,
    prepareFiles: preparePublicationFiles,
  }));
}
export async function publishCourse(plan, options) { return publishPlan(plan, options); }
