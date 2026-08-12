import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import Ajv2020 from 'ajv/dist/2020.js';
import YAML from 'yaml';
import { AVAILABILITY_STATUSES, DEFAULT_MAX_ATTACHMENT_BYTES, LIFECYCLE_STATUSES, LIMITS, MATERIAL_KINDS } from './constants.js';
import { fail, PublisherError } from './errors.js';
import { canonicalJson, checksum, effectivePublic, stableId } from './models.js';
import { inspectImage } from './image.js';
import { inspectAttachment } from './attachment.js';
import { buildAssetIndex, normalizedAssetPath, transformMarkdown } from './markdown.js';

const exec = promisify(execFile);
const githubSecretPattern = /gh[opsu]_[A-Za-z0-9_]{20,}/i;
const appwriteLiteralPattern = /APPWRITE_API_KEY\s*[=:]\s*["']?(?!\$|process\.env)([A-Za-z0-9._-]{20,})/i;
const directAppwritePattern = /(?:appwrite\.io|appwrite\.wholedata\.ru|\/v1\/storage\/buckets\/)/i;
const rawHtmlPattern = /<\/?[a-z][^>]*>/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedTrackedRoots = new Set([
  '.gitignore',
  '.gitattributes',
  'README.md',
  'course.yaml',
  'course.yaml.example',
  'lectures',
  'lecture-notes',
  'seminars',
  'homeworks',
  'assets',
  'lectures-teacher',
  'attachments',
  'openspec',
  '.github',
]);
const gitLfsPointerPrefix = 'version https://git-lfs.github.com/spec/v1\n';

export function containsForbiddenSecret(source) {
  return githubSecretPattern.test(source) || appwriteLiteralPattern.test(source);
}

function validRelative(file, prefix) {
  return typeof file === 'string' && file.startsWith(`${prefix}/`) && !path.isAbsolute(file) && !file.split('/').includes('..') && !file.includes('\\') && !/[\0\r\n]/.test(file);
}
function branchSlug(branch) {
  const match = /^courses\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(branch);
  if (!match) fail('BRANCH_INVALID', 'Branch must be named courses/<lowercase-kebab-slug>');
  return match[1];
}
async function trackedPaths(root) {
  try {
    const { stdout } = await exec('git', ['ls-files', '-z', '--stage'], { cwd: root, maxBuffer: 2 * 1024 * 1024 });
    return stdout.split('\0').filter(Boolean).map((entry) => {
      const [meta, file] = entry.split('\t');
      return { file, mode: meta.split(' ')[0] };
    });
  } catch (error) { fail('TREE_UNAVAILABLE', 'Unable to inspect the tracked Git tree'); }
}
export async function inspectTree(root) {
  const entries = await trackedPaths(root);
  const seen = new Set();
  for (const { file, mode } of entries) {
    const identity = file?.normalize('NFC').toLowerCase();
    if (!file || path.isAbsolute(file) || file.includes('\\') || /[\0\r\n]/.test(file) || file.split('/').includes('..') || seen.has(identity)) fail('TREE_UNSAFE', 'Unsafe, duplicate, Unicode-normalized, or case-colliding tracked path', { path: file });
    seen.add(identity);
    if (mode === '160000') fail('TREE_UNSAFE', 'Git submodules are not allowed', { path: file });
    if (!['100644', '100755'].includes(mode)) fail('TREE_UNSAFE', 'Unsupported tracked file mode', { path: file });
    if (mode === '100755') fail('TREE_UNSAFE', 'Executable tracked files are not allowed', { path: file });
    const rootName = file.split('/')[0];
    if (!allowedTrackedRoots.has(rootName)) fail('TREE_UNDOCUMENTED', 'Tracked path is outside the documented repository contract', { path: file });
    const stat = await fs.lstat(path.join(root, file));
    if (stat.isSymbolicLink()) fail('TREE_UNSAFE', 'Symbolic links are not allowed', { path: file });
  }
  return new Set(entries.map(({ file }) => file));
}
async function readFile(root, relative, maxBytes, encoding = undefined) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(`${path.resolve(root)}${path.sep}`)) fail('PATH_INVALID', 'Path escapes repository root', { path: relative });
  const stat = await fs.lstat(target).catch(() => fail('FILE_MISSING', 'Declared file is missing', { path: relative }));
  if (!stat.isFile() || stat.isSymbolicLink()) fail('FILE_INVALID', 'Declared path must be a regular file', { path: relative });
  if (stat.size > maxBytes) fail('FILE_TOO_LARGE', `File exceeds ${maxBytes} bytes`, { path: relative });
  const data = await fs.readFile(target);
  if (data.length < 1024 && data.toString('utf8').startsWith(gitLfsPointerPrefix)) fail('LFS_POINTER_UNRESOLVED', 'Git LFS object was not materialized before validation', { path: relative });
  return encoding ? new TextDecoder(encoding, { fatal: true }).decode(data) : data;
}
async function scanTrackedSecrets(root, tree) {
  for (const relative of tree) {
    const isCourseInput = relative === 'course.yaml' || /^(lectures|lecture-notes|seminars|homeworks)\/.+\.md$/i.test(relative);
    if (!isCourseInput) continue;
    const bytes = await readFile(root, relative, 1024 * 1024).catch(() => null);
    if (!bytes) continue;
    const source = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    if (containsForbiddenSecret(source)) fail('SECRET_PATTERN', 'Tracked source contains a forbidden credential pattern', { path: relative });
  }
}
function assertSchema(manifest, schema) {
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  if (!validate(manifest)) fail('MANIFEST_SCHEMA_INVALID', validate.errors.map((e) => `${e.instancePath || '/'} ${e.message}`).join('; '));
}
function unique(values, description) {
  if (new Set(values).size !== values.length) fail('MANIFEST_DUPLICATE', `Duplicate ${description}`);
}
function fileHash(bytes) { return checksum(bytes); }
function validateMarkdownSource(markdown, relativePath) {
  if (rawHtmlPattern.test(markdown)) fail('MARKDOWN_HTML_FORBIDDEN', 'Raw HTML is forbidden', { path: relativePath });
  if (directAppwritePattern.test(markdown)) fail('MARKDOWN_APPWRITE_REFERENCE', 'Direct Appwrite references are forbidden', { path: relativePath });
}
function normalizeMaterial(course, kind, material, markdown, assets) {
  const publicRead = effectivePublic(course, material);
  return Object.freeze({ ...material, kind, publicRead, content: markdown, assets, resourceKey: `${course.slug}/${kind}/${material.slug}` });
}
export async function validateCourse({ root = process.cwd(), branch, schema, allowUntracked = false, maxAttachmentBytes = Number(process.env.COURSE_ATTACHMENT_MAX_BYTES ?? DEFAULT_MAX_ATTACHMENT_BYTES) } = {}) {
  if (!Number.isSafeInteger(maxAttachmentBytes) || maxAttachmentBytes <= 0) fail('CONFIG_INVALID', 'Invalid COURSE_ATTACHMENT_MAX_BYTES');
  const tree = await inspectTree(root);
  await scanTrackedSecrets(root, tree);
  if (!allowUntracked && !tree.has('course.yaml')) fail('MANIFEST_MISSING', 'Exactly one tracked course.yaml is required');
  if (tree.has('course.yaml.example') && tree.has('course.yaml') === false) fail('MANIFEST_MISSING', 'course.yaml.example is a template and cannot be published');
  const source = await readFile(root, 'course.yaml', 64 * 1024, 'utf-8').catch((error) => { if (error instanceof PublisherError) throw error; fail('MANIFEST_INVALID', 'course.yaml must be valid UTF-8'); });
  if (containsForbiddenSecret(source)) fail('SECRET_PATTERN', 'Tracked source contains a forbidden credential pattern', { path: 'course.yaml' });
  const manifest = YAML.parse(source, { prettyErrors: false });
  if (!manifest || typeof manifest !== 'object') fail('MANIFEST_YAML_INVALID', 'course.yaml must contain an object');
  assertSchema(manifest, schema);
  const expectedSlug = branchSlug(branch);
  if (manifest.slug !== expectedSlug || !slugPattern.test(manifest.slug)) fail('IDENTITY_MISMATCH', 'Manifest slug must equal the course branch suffix');
  const materials = MATERIAL_KINDS.flatMap((kind) => manifest.materials[`${kind}s`].map((material) => ({ kind, material })));
  unique(materials.map(({ material }) => material.slug), 'material slug');
  unique(materials.map(({ material }) => material.sortOrder), 'material sortOrder');
  const undeclaredContent = new Set([...tree].filter((item) => /^(lectures|lecture-notes|seminars|homeworks)\/.+\.md$/i.test(item) && !item.endsWith('/.gitkeep')));
  const assetIndex = buildAssetIndex(tree);
  const declaredAssets = new Set();
  const declaredAttachments = new Set();
  const attachmentOwners = new Map();
  const normalized = [];
  for (const { kind, material } of materials) {
    if (!LIFECYCLE_STATUSES.includes(material.lifecycleStatus) || !AVAILABILITY_STATUSES.includes(material.availability)) fail('STATUS_INVALID', 'Unsupported status');
    if (kind !== 'lecture' && material.briefMarkdown) fail('BRIEF_KIND_INVALID', 'Only lectures may declare briefMarkdown');
    let content = null; let briefContent = null; let effectiveAssetInputs = [];
    const explicitAssets = material.assets ?? [];
    const processMarkdown = async (relative, expectedRoot, assetDeclarations) => {
      if (!validRelative(relative, expectedRoot) || !relative.endsWith('.md')) fail('MARKDOWN_PATH_INVALID', `Markdown path must be under ${expectedRoot}/`, { path: relative });
      const expectedName = `${String(material.sortOrder).padStart(3, '0')}_${material.slug}.md`;
      if (path.basename(relative) !== expectedName) fail('MARKDOWN_FILENAME_INVALID', `Markdown filename must be ${expectedName}`, { path: relative });
      if (!tree.has(relative)) fail('FILE_UNTRACKED', 'Markdown must be tracked', { path: relative });
      const markdownBytes = await readFile(root, relative, LIMITS.maxMarkdownBytes);
      let markdown;
      try { markdown = new TextDecoder('utf-8', { fatal: true }).decode(markdownBytes); } catch { fail('MARKDOWN_UTF8_INVALID', 'Markdown must be UTF-8', { path: relative }); }
      if (/<!--\s*(?:teacher|instructor|timing|facilitation)\b/i.test(markdown)) fail('TEACHER_MARKER_FORBIDDEN', 'Student Markdown contains a teacher-only marker', { path: relative });
      if (containsForbiddenSecret(markdown)) fail('SECRET_PATTERN', 'Tracked source contains a forbidden credential pattern', { path: relative });
      validateMarkdownSource(markdown, relative);
      const transformed = transformMarkdown({ source: markdown, markdownPath: relative, assetIndex, explicitAssets: assetDeclarations });
      const transformedBytes = Buffer.from(transformed.markdown);
      if (transformedBytes.length > LIMITS.maxMarkdownBytes) fail('FILE_TOO_LARGE', `Transformed Markdown exceeds ${LIMITS.maxMarkdownBytes} bytes`, { path: relative });
      const sourceChecksum = fileHash(markdownBytes); const transformedChecksum = fileHash(transformedBytes);
      undeclaredContent.delete(relative);
      return { content: Object.freeze({ path: relative, sourceChecksum, checksum: transformedChecksum, fileId: stableId('md', transformedChecksum), rewrites: transformed.rewrites }), assets: transformed.assets };
    };
    if (material.markdown) {
      const result = await processMarkdown(material.markdown, `${kind}s`, explicitAssets);
      content = result.content; effectiveAssetInputs.push(...result.assets);
    }
    if (material.briefMarkdown) {
      const result = await processMarkdown(material.briefMarkdown, 'lecture-notes', explicitAssets);
      briefContent = result.content; effectiveAssetInputs.push(...result.assets);
    }
    if (!material.markdown && !material.briefMarkdown && explicitAssets.length) {
      fail('ATTACHMENT_UNREFERENCED', 'A material without Markdown cannot use attachment declarations');
    }
    if (effectiveAssetInputs.length > LIMITS.maxAssetsPerMaterial) fail('MANIFEST_LIMIT', `Material exceeds ${LIMITS.maxAssetsPerMaterial} effective assets`, { path: material.markdown });
    unique(effectiveAssetInputs.map((asset) => asset.key), `asset key in ${material.slug}`);
    unique(effectiveAssetInputs.map((asset) => normalizedAssetPath(asset.file).toLowerCase()), `asset path in ${material.slug}`);
    const assets = [];
    for (const asset of effectiveAssetInputs) {
      if (!validRelative(asset.file, 'assets') || !tree.has(asset.file)) fail('ASSET_PATH_INVALID', 'Asset must be a tracked file under assets/', { path: asset.file });
      const bytes = await readFile(root, asset.file, LIMITS.maxImageBytes); const info = inspectImage(bytes, asset.file);
      declaredAssets.add(asset.file);
      assets.push(Object.freeze({ ...asset, ...info, checksum: fileHash(bytes), fileId: stableId('asset', fileHash(bytes)), publicRead: effectivePublic(manifest, material) }));
    }
    const downloadable = [];
    const attachmentDeclarations = material.attachments ?? [];
    if (attachmentDeclarations.length > LIMITS.maxAttachmentsPerMaterial) fail('MANIFEST_LIMIT', `Material exceeds ${LIMITS.maxAttachmentsPerMaterial} downloadable attachments`);
    unique(attachmentDeclarations.map((item) => item.key), `attachment key in ${material.slug}`);
    unique(attachmentDeclarations.map((item) => item.sortOrder), `attachment sortOrder in ${material.slug}`);
    for (const item of attachmentDeclarations) {
      if (!validRelative(item.file, 'attachments') || !tree.has(item.file)) fail('ATTACHMENT_PATH_INVALID', 'Attachment must be a tracked file under attachments/', { path: item.file });
      const identity = item.file.normalize('NFC').toLowerCase();
      if (attachmentOwners.has(identity)) fail('ATTACHMENT_OWNERSHIP_AMBIGUOUS', 'Attachment file is declared by more than one material', { path: item.file });
      attachmentOwners.set(identity, material.slug);
      const attachmentBytes = await readFile(root, item.file, maxAttachmentBytes);
      const info = inspectAttachment(attachmentBytes, item.file);
      const digest = fileHash(attachmentBytes);
      declaredAttachments.add(item.file);
      downloadable.push(Object.freeze({ ...item, fileName: path.basename(item.file), ...info, sizeBytes: attachmentBytes.length, checksum: digest, fileId: stableId('att', digest), publicRead: effectivePublic(manifest, material) }));
    }
    normalized.push(Object.freeze({ ...normalizeMaterial(manifest, kind, { ...material, assets: undefined, attachments: undefined, briefMarkdown: undefined }, content, assets), briefContent, attachments: downloadable.sort((a, b) => a.sortOrder - b.sortOrder || a.key.localeCompare(b.key)) }));
  }
  if (undeclaredContent.size) fail('UNDECLARED_CONTENT', 'Undeclared Markdown exists in a content directory', { path: [...undeclaredContent].sort()[0] });
  const undeclaredAsset = [...tree].find((item) => item.startsWith('assets/') && !item.endsWith('/.gitkeep') && !declaredAssets.has(item));
  if (undeclaredAsset) fail('UNDECLARED_ASSET', 'Undeclared asset exists in assets/', { path: undeclaredAsset });
  const undeclaredAttachment = [...tree].find((item) => item.startsWith('attachments/') && !item.endsWith('/.gitkeep') && !declaredAttachments.has(item));
  if (undeclaredAttachment) fail('UNDECLARED_ATTACHMENT', 'Undeclared file exists in attachments/', { path: undeclaredAttachment });
  const sorted = normalized.sort((a, b) => a.sortOrder - b.sortOrder || a.resourceKey.localeCompare(b.resourceKey));
  const plan = {
    version: 1,
    course: { ...manifest, publicRead: manifest.lifecycleStatus === 'published', materials: undefined },
    materials: sorted,
    summary: {
      transformations: sorted.filter((item) => item.content).map((item) => ({
        markdown: item.content.path,
        checksum: item.content.checksum,
        assets: item.assets.filter((asset) => asset.generated).map(({ file, key }) => ({ file, key })),
      })),
      attachments: sorted.flatMap((item) => item.attachments.map(({ key, file, checksum, fileId }) => ({ material: item.resourceKey, key, file, checksum, fileId }))),
    },
  };
  return Object.freeze({ ...plan, digest: crypto.createHash('sha256').update(canonicalJson(plan)).digest('hex') });
}
