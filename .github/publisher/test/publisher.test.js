import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Query } from 'node-appwrite';
import { loadConfig } from '../src/config.js';
import { canonicalJson, checksum, effectivePublic, stableId } from '../src/models.js';
import { inspectImage } from '../src/image.js';
import { inspectAttachment } from '../src/attachment.js';
import { PublisherError } from '../src/errors.js';
import { containsForbiddenSecret } from '../src/validator.js';
import { publishCourse } from '../src/publisher.js';
import { assertContentAddressedFileCompatible, collectRows } from '../src/appwrite.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('config keeps public values separate and requires the key only for publication', () => {
  const env = Object.fromEntries(['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_DATABASE_ID', 'APPWRITE_COURSES_TABLE_ID', 'APPWRITE_MATERIALS_TABLE_ID', 'APPWRITE_ASSETS_TABLE_ID', 'APPWRITE_MARKDOWN_BUCKET_ID', 'APPWRITE_MEDIA_BUCKET_ID', 'APPWRITE_ATTACHMENTS_TABLE_ID', 'APPWRITE_ATTACHMENTS_BUCKET_ID'].map((name) => [name, 'value']));
  assert.equal(loadConfig({ env }).APPWRITE_API_KEY, undefined);
  assert.equal(loadConfig({ env }).COURSE_ATTACHMENT_MAX_BYTES, 15728640);
  assert.throws(() => loadConfig({ env, requireKey: true }), /APPWRITE_API_KEY/);
  assert.equal(loadConfig({ env: { ...env, APPWRITE_API_KEY: 'k'.repeat(512) }, requireKey: true }).APPWRITE_API_KEY.length, 512);
});

test('canonical plans and content-addressed IDs are deterministic', () => {
  assert.equal(canonicalJson({ b: 1, a: [true] }), canonicalJson({ a: [true], b: 1 }));
  assert.equal(stableId('md', 'abcdef'.repeat(12)), stableId('md', 'abcdef'.repeat(12)));
  assert.equal(effectivePublic({ lifecycleStatus: 'published', availability: 'available' }, { lifecycleStatus: 'published', availability: 'available' }), true);
  assert.equal(effectivePublic({ lifecycleStatus: 'draft', availability: 'available' }, { lifecycleStatus: 'published', availability: 'available' }), false);
});

test('content-addressed files survive a path rename when bytes are unchanged', () => {
  const bytes = Buffer.from('same-image-bytes');
  assert.doesNotThrow(() => assertContentAddressedFileCompatible({ name: 'assets/old.png', sizeOriginal: bytes.length }, bytes));
  assert.throws(() => assertContentAddressedFileCompatible({ name: 'assets/old.png', sizeOriginal: bytes.length + 1 }, bytes), /metadata differs/);
});

test('Appwrite pagination includes course materials beyond the first 25 rows', async () => {
  const previousRows = [
    'random-experiments-events-combinatorics',
    ...Array.from({ length: 7 }, (_, index) => `archived-lecture-${index + 2}`),
  ];
  const addedRows = [
    ...Array.from({ length: 7 }, (_, index) => `renamed-lecture-${index + 2}`),
    ...Array.from({ length: 10 }, (_, index) => `seminar-${index + 1}`),
    'mathematical-expectation',
    ...Array.from({ length: 6 }, (_, index) => `seminar-${index + 12}`),
  ];
  const providerRows = [...previousRows, ...addedRows].map((slug, index) => ({ $id: `row-${index + 1}`, slug }));
  const calls = [];
  const rows = await collectRows(async (queries) => {
    calls.push(queries);
    const cursorQuery = queries.map((query) => JSON.parse(query)).find((query) => query.method === 'cursorAfter');
    const cursorIndex = cursorQuery ? providerRows.findIndex((row) => row.$id === cursorQuery.values[0]) : -1;
    return { rows: providerRows.slice(cursorIndex + 1, cursorIndex + 26) };
  }, [Query.equal('courseId', 'course-1')], 25);

  assert.equal(providerRows.length, 32);
  assert.equal(calls.length, 2);
  assert.equal(JSON.parse(calls[0].at(-1)).method, 'limit');
  assert.equal(JSON.parse(calls[1].at(-1)).method, 'cursorAfter');
  assert.equal(JSON.parse(calls[1].at(-1)).values[0], 'row-25');
  assert.equal(rows.find((row) => row.slug === 'mathematical-expectation').$id, 'row-26');
});

test('image signature must match extension and dimensions', () => {
  const png = Buffer.alloc(24); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png); png.writeUInt32BE(1, 16); png.writeUInt32BE(1, 20);
  assert.deepEqual(inspectImage(png, 'assets/pixel.png'), { mimeType: 'image/png', width: 1, height: 1 });
  assert.throws(() => inspectImage(png, 'assets/pixel.jpg'), /signature/);
  const oversizedDimensions = Buffer.from(png); oversizedDimensions.writeUInt32BE(5000, 16);
  assert.throws(() => inspectImage(oversizedDimensions, 'assets/wide.png'), /dimensions/);
  const oversizedFile = Buffer.alloc(5 * 1024 * 1024 + 1); png.copy(oversizedFile);
  assert.throws(() => inspectImage(oversizedFile, 'assets/large.png'), /exceeds/);
});

test('download attachment formats are structurally inspected without execution', () => {
  const zip = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  for (const extension of ['pptx', 'xlsx', 'docx']) {
    assert.equal(inspectAttachment(zip, `attachments/file.${extension}`).extension, extension);
  }
  assert.equal(inspectAttachment(Buffer.from('%PDF-1.7\n'), 'attachments/file.PDF').extension, 'pdf');
  assert.equal(inspectAttachment(Buffer.from('{"cells":[],"metadata":{},"nbformat":4}'), 'attachments/file.ipynb').extension, 'ipynb');
  assert.equal(inspectAttachment(Buffer.from('print("inert")\n'), 'attachments/file.py').extension, 'py');
  assert.throws(() => inspectAttachment(Buffer.from('legacy'), 'attachments/file.doc'), /Unsupported/);
  assert.throws(() => inspectAttachment(Buffer.from('legacy'), 'attachments/file.xls'), /Unsupported/);
  assert.throws(() => inspectAttachment(Buffer.from('not pdf'), 'attachments/file.pdf'), /signature/);
});

test('validator diagnostics retain a bounded public error type', () => {
  const error = new PublisherError('MARKDOWN_FILENAME_INVALID', 'Markdown filename must match metadata');
  assert.equal(error.code, 'MARKDOWN_FILENAME_INVALID');
});

test('secret scanner allows references but rejects literal credentials', () => {
  assert.equal(containsForbiddenSecret('APPWRITE_API_KEY: ${{ secrets.APPWRITE_API_KEY }}'), false);
  assert.equal(containsForbiddenSecret("env.APPWRITE_API_KEY = process.env.APPWRITE_API_KEY"), false);
  assert.equal(containsForbiddenSecret('APPWRITE_API_KEY=standard_abcdefghijklmnopqrstuvwxyz0123456789'), true);
  assert.equal(containsForbiddenSecret('ghp_abcdefghijklmnopqrstuvwxyz0123456789'), true);
});

test('workflow has the required branch and credential boundaries', async () => {
  const workflow = await readFile(path.join(root, '.github/workflows/publish-course.yml'), 'utf8');
  const deploy = workflow.slice(workflow.indexOf('  deploy:'));
  const validate = workflow.slice(workflow.indexOf('  validate:'), workflow.indexOf('  deploy:'));
  assert.equal([...workflow.matchAll(/branches: \["courses\/\*"\]/g)].length, 2);
  assert.doesNotMatch(workflow, /courses\/\*\*/);
  assert.match(workflow, /id: branch-policy/);
  assert.match(workflow, /COURSE_HEAD_SHA: \$\{\{ github\.event\.pull_request\.head\.sha \}\}/);
  assert.match(workflow, /COURSE_BASE_SHA: \$\{\{ github\.event\.pull_request\.base\.sha \}\}/);
  assert.match(workflow, /COURSE_BRANCH: \$\{\{ steps\.branch-policy\.outputs\.course_branch \}\}/);
  assert.match(workflow, /name: validate/);
  assert.match(workflow, /if: github\.event_name == 'push' && needs\.validate\.outputs\.course_branch == github\.ref_name/);
  assert.match(workflow, /environment: appwrite/);
  assert.match(workflow, /APPWRITE_API_KEY: \$\{\{ secrets\.APPWRITE_API_KEY \}\}/);
  assert.equal([...workflow.matchAll(/uses: actions\/(?:checkout|setup-node)@([a-f0-9]+)/g)].every((match) => match[1].length === 40), true);
  assert.equal([...workflow.matchAll(/with: \{[^}\n]*lfs: true[^}\n]*\}/g)].length, 2);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.doesNotMatch(validate, /secrets\.|APPWRITE_API_KEY/);
  assert.doesNotMatch(validate, /github\.head_ref \|\| github\.ref_name/);
  assert.doesNotMatch(deploy, /cache:|actions\/(?:cache|upload-artifact|download-artifact)@/);
  assert.doesNotMatch(workflow, /actions\/(?:upload-artifact|download-artifact)@/);
  assert.doesNotMatch(deploy, /run:.*\$\{\{ github\.(?:ref_name|head_ref) \}\}/);
});

test('publisher reads files from the explicit course root', async () => {
  const courseRoot = await mkdtemp(path.join(os.tmpdir(), 'publisher-root-'));
  await mkdir(path.join(courseRoot, 'lectures'));
  await writeFile(path.join(courseRoot, 'lectures/001_introduction.md'), '# Publisher acceptance\n');
  const calls = [];
  const adapter = {
    config: {
      APPWRITE_COURSES_TABLE_ID: 'courses',
      APPWRITE_MATERIALS_TABLE_ID: 'materials',
      APPWRITE_ASSETS_TABLE_ID: 'material_assets',
      APPWRITE_MARKDOWN_BUCKET_ID: 'course-markdown',
      APPWRITE_MEDIA_BUCKET_ID: 'course-media',
    },
    async findCourse() { return null; },
    async listMaterials() { return []; },
    async putFile(bucket, id, bytes, name) { calls.push({ bucket, id, body: bytes.toString(), name }); },
    async upsertRow(table, rowId, data) { return { $id: rowId ?? `${table}-1`, ...data }; },
    async verifyFinal() {},
  };
  const plan = {
    course: { slug: 'publisher-acceptance-v6', title: 'Course', description: 'Course', lifecycleStatus: 'draft', availability: 'inDevelopment', sortOrder: 1 },
    materials: [{ kind: 'lecture', slug: 'introduction', title: 'Introduction', summary: 'Summary', lifecycleStatus: 'draft', availability: 'inDevelopment', sortOrder: 1, content: { path: 'lectures/001_introduction.md', fileId: 'md-test' }, assets: [] }],
  };
  await publishCourse(plan, { adapter, root: courseRoot });
  assert.equal(calls.length, 1);
  assert.deepEqual({ ...calls[0], body: undefined }, { bucket: 'course-markdown', id: 'md-test', body: undefined, name: 'lectures/001_introduction.md' });
  assert.match(calls[0].body, /^# Publisher acceptance/m);
});

test('publisher uploads the validated transformed Markdown copy without modifying source', async () => {
  const courseRoot = await mkdtemp(path.join(os.tmpdir(), 'publisher-transform-'));
  await mkdir(path.join(courseRoot, 'lectures'));
  const source = '![[assets/diagram.png|Diagram]]\n'; const replacement = '![Diagram](attachment:asset-0123456789abcdef01234567)\n';
  const markdownPath = 'lectures/001_introduction.md'; await writeFile(path.join(courseRoot, markdownPath), source);
  const calls = [];
  const adapter = {
    config: { APPWRITE_COURSES_TABLE_ID: 'courses', APPWRITE_MATERIALS_TABLE_ID: 'materials', APPWRITE_ASSETS_TABLE_ID: 'material_assets', APPWRITE_MARKDOWN_BUCKET_ID: 'course-markdown', APPWRITE_MEDIA_BUCKET_ID: 'course-media' },
    async findCourse() { return null; }, async listMaterials() { return []; },
    async putFile(bucket, id, body) { calls.push({ bucket, id, body: body.toString() }); },
    async upsertRow(table, rowId, data) { return { $id: rowId ?? `${table}-1`, ...data }; }, async verifyFinal() {},
  };
  const transformedChecksum = checksum(Buffer.from(replacement));
  const plan = {
    course: { slug: 'publisher-transform', title: 'Course', description: 'Course', lifecycleStatus: 'draft', availability: 'inDevelopment', sortOrder: 1 },
    materials: [{ kind: 'lecture', slug: 'introduction', title: 'Introduction', summary: 'Summary', lifecycleStatus: 'draft', availability: 'inDevelopment', sortOrder: 1, content: { path: markdownPath, sourceChecksum: checksum(Buffer.from(source)), checksum: transformedChecksum, fileId: stableId('md', transformedChecksum), rewrites: [{ start: 0, end: source.trimEnd().length, key: 'asset-0123456789abcdef01234567', alt: 'Diagram' }] }, assets: [] }],
  };
  await publishCourse(plan, { adapter, root: courseRoot });
  assert.equal(calls[0].body, replacement);
  assert.equal(await readFile(path.join(courseRoot, markdownPath), 'utf8'), source);
});

test('publisher rejects source drift before contacting Appwrite', async () => {
  const courseRoot = await mkdtemp(path.join(os.tmpdir(), 'publisher-integrity-'));
  await mkdir(path.join(courseRoot, 'lectures')); await writeFile(path.join(courseRoot, 'lectures/001_intro.md'), '# Changed\n');
  let providerCalls = 0;
  const adapter = { config: {}, async findCourse() { providerCalls += 1; return null; } };
  const plan = { course: { slug: 'fixture-course' }, materials: [{ content: { path: 'lectures/001_intro.md', sourceChecksum: checksum(Buffer.from('# Original\n')), checksum: checksum(Buffer.from('# Original\n')), fileId: stableId('md', checksum(Buffer.from('# Original\n'))), rewrites: [] }, assets: [] }] };
  await assert.rejects(() => publishCourse(plan, { adapter, root: courseRoot }), (error) => error.code === 'MARKDOWN_SOURCE_CHANGED');
  assert.equal(providerCalls, 0);
});

test('publisher rejects transformed checksum drift before contacting Appwrite', async () => {
  const courseRoot = await mkdtemp(path.join(os.tmpdir(), 'publisher-transform-integrity-'));
  await mkdir(path.join(courseRoot, 'lectures')); const source = '![[assets/image.png]]\n';
  await writeFile(path.join(courseRoot, 'lectures/001_intro.md'), source);
  let providerCalls = 0; const adapter = { config: {}, async findCourse() { providerCalls += 1; return null; } };
  const wrong = checksum(Buffer.from('wrong'));
  const plan = { course: { slug: 'fixture-course' }, materials: [{ content: { path: 'lectures/001_intro.md', sourceChecksum: checksum(Buffer.from(source)), checksum: wrong, fileId: stableId('md', wrong), rewrites: [{ start: 0, end: source.trimEnd().length, key: 'asset-0123456789abcdef01234567', alt: 'Image' }] }, assets: [] }] };
  await assert.rejects(() => publishCourse(plan, { adapter, root: courseRoot }), (error) => error.code === 'MARKDOWN_INTEGRITY_MISMATCH');
  assert.equal(providerCalls, 0);
});
