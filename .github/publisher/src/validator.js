import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import Ajv2020 from 'ajv/dist/2020.js';
import YAML from 'yaml';
import { AVAILABILITY_STATUSES, LIFECYCLE_STATUSES, LIMITS, MATERIAL_KINDS, UNREFERENCED_ASSET_POLICY } from './constants.js';
import { fail, PublisherError } from './errors.js';
import { canonicalJson, checksum, effectivePublic, stableId } from './models.js';
import { inspectImage } from './image.js';

const exec = promisify(execFile);
const githubSecretPattern = /gh[opsu]_[A-Za-z0-9_]{20,}/i;
const appwriteLiteralPattern = /APPWRITE_API_KEY\s*[=:]\s*["']?(?!\$|process\.env)([A-Za-z0-9._-]{20,})/i;
const directAppwritePattern = /(?:appwrite\.io|appwrite\.wholedata\.ru|\/v1\/storage\/buckets\/)/i;
const rawHtmlPattern = /<\/?[a-z][^>]*>/i;
const attachmentImagePattern = /!\[[^\]\r\n]*\]\(attachment:([a-z0-9]+(?:-[a-z0-9]+)*)\)/g;
const attachmentTokenPattern = /attachment:[a-z0-9]+(?:-[a-z0-9]+)*/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function containsForbiddenSecret(source) {
  return githubSecretPattern.test(source) || appwriteLiteralPattern.test(source);
}

function validRelative(file, prefix) {
  return typeof file === 'string' && file.startsWith(`${prefix}/`) && !path.isAbsolute(file) && !file.split('/').includes('..') && !file.includes('\\');
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
    if (!file || path.isAbsolute(file) || file.split('/').includes('..') || seen.has(file.toLowerCase())) fail('TREE_UNSAFE', 'Unsafe, duplicate, or case-colliding tracked path', { path: file });
    seen.add(file.toLowerCase());
    if (mode === '160000') fail('TREE_UNSAFE', 'Git submodules are not allowed', { path: file });
    if (!['100644', '100755'].includes(mode)) fail('TREE_UNSAFE', 'Unsupported tracked file mode', { path: file });
    if (mode === '100755') fail('TREE_UNSAFE', 'Executable tracked files are not allowed', { path: file });
    const rootName = file.split('/')[0];
    if (!['.gitignore', 'README.md', 'course.yaml', 'course.yaml.example', 'lectures', 'seminars', 'homeworks', 'assets', '.github'].includes(rootName)) fail('TREE_UNDOCUMENTED', 'Tracked path is outside the documented repository contract', { path: file });
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
  return encoding ? new TextDecoder(encoding, { fatal: true }).decode(data) : data;
}
async function scanTrackedSecrets(root, tree) {
  for (const relative of tree) {
    const isCourseInput = relative === 'course.yaml' || /^(lectures|seminars|homeworks)\/.+\.md$/i.test(relative);
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
function parseReferences(markdown, relativePath) {
  if (rawHtmlPattern.test(markdown)) fail('MARKDOWN_HTML_FORBIDDEN', 'Raw HTML is forbidden', { path: relativePath });
  if (directAppwritePattern.test(markdown)) fail('MARKDOWN_APPWRITE_REFERENCE', 'Direct Appwrite references are forbidden', { path: relativePath });
  const references = [...markdown.matchAll(attachmentImagePattern)].map((match) => match[1]);
  if (attachmentTokenPattern.test(markdown.replace(attachmentImagePattern, ''))) fail('ATTACHMENT_SYNTAX_INVALID', 'Attachments must use Markdown image syntax ![alt](attachment:key)', { path: relativePath });
  return references;
}
function normalizeMaterial(course, kind, material, markdown, assets) {
  const publicRead = effectivePublic(course, material);
  return Object.freeze({ ...material, kind, publicRead, content: markdown, assets, resourceKey: `${course.slug}/${kind}/${material.slug}` });
}
export async function validateCourse({ root = process.cwd(), branch, schema, allowUntracked = false } = {}) {
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
  const undeclaredContent = new Set([...tree].filter((item) => /^(lectures|seminars|homeworks)\/.+\.md$/i.test(item) && !item.endsWith('/.gitkeep')));
  const declaredAssets = new Set();
  const normalized = [];
  for (const { kind, material } of materials) {
    if (!LIFECYCLE_STATUSES.includes(material.lifecycleStatus) || !AVAILABILITY_STATUSES.includes(material.availability)) fail('STATUS_INVALID', 'Unsupported status');
    const isAvailable = material.lifecycleStatus === 'published' && material.availability === 'available';
    if (isAvailable && !material.markdown) fail('MARKDOWN_REQUIRED', 'Published available material requires Markdown');
    let markdown = null; let markdownHash = null; let references = [];
    if (material.markdown) {
      if (!validRelative(material.markdown, `${kind}s`) || !material.markdown.endsWith('.md')) fail('MARKDOWN_PATH_INVALID', 'Markdown path must be in its matching content directory', { path: material.markdown });
      const expectedName = `${String(material.sortOrder).padStart(3, '0')}_${material.slug}.md`;
      if (path.basename(material.markdown) !== expectedName) fail('MARKDOWN_FILENAME_INVALID', `Markdown filename must be ${expectedName}`, { path: material.markdown });
      if (!tree.has(material.markdown)) fail('FILE_UNTRACKED', 'Markdown must be tracked', { path: material.markdown });
      markdown = await readFile(root, material.markdown, LIMITS.maxMarkdownBytes, 'utf-8').catch((error) => { if (error instanceof PublisherError) throw error; fail('MARKDOWN_UTF8_INVALID', 'Markdown must be UTF-8', { path: material.markdown }); });
      if (containsForbiddenSecret(markdown)) fail('SECRET_PATTERN', 'Tracked source contains a forbidden credential pattern', { path: material.markdown });
      references = parseReferences(markdown, material.markdown); markdownHash = fileHash(Buffer.from(markdown)); undeclaredContent.delete(material.markdown);
    }
    unique(material.assets.map((asset) => asset.key), `asset key in ${material.slug}`);
    const assetKeys = new Set(material.assets.map((asset) => asset.key));
    for (const reference of references) if (!assetKeys.has(reference)) fail('ATTACHMENT_UNRESOLVED', `Unknown attachment key ${reference}`, { path: material.markdown });
    const assets = [];
    for (const asset of material.assets) {
      if (!validRelative(asset.file, 'assets') || !tree.has(asset.file)) fail('ASSET_PATH_INVALID', 'Asset must be a tracked file under assets/', { path: asset.file });
      const bytes = await readFile(root, asset.file, LIMITS.maxImageBytes); const info = inspectImage(bytes, asset.file);
      declaredAssets.add(asset.file);
      if (!references.includes(asset.key) && UNREFERENCED_ASSET_POLICY === 'error') fail('ATTACHMENT_UNREFERENCED', `Declared attachment ${asset.key} is not referenced`, { path: asset.file });
      assets.push(Object.freeze({ ...asset, ...info, checksum: fileHash(bytes), fileId: stableId('asset', fileHash(bytes)), publicRead: effectivePublic(manifest, material) }));
    }
    normalized.push(normalizeMaterial(manifest, kind, material, markdown ? { path: material.markdown, checksum: markdownHash, fileId: stableId('md', markdownHash) } : null, assets));
  }
  if (undeclaredContent.size) fail('UNDECLARED_CONTENT', 'Undeclared Markdown exists in a content directory', { path: [...undeclaredContent].sort()[0] });
  const undeclaredAsset = [...tree].find((item) => item.startsWith('assets/') && !item.endsWith('/.gitkeep') && !declaredAssets.has(item));
  if (undeclaredAsset) fail('UNDECLARED_ASSET', 'Undeclared asset exists in assets/', { path: undeclaredAsset });
  const plan = { version: 1, course: { ...manifest, publicRead: manifest.lifecycleStatus === 'published', materials: undefined }, materials: normalized.sort((a, b) => a.sortOrder - b.sortOrder || a.resourceKey.localeCompare(b.resourceKey)) };
  return Object.freeze({ ...plan, digest: crypto.createHash('sha256').update(canonicalJson(plan)).digest('hex') });
}
