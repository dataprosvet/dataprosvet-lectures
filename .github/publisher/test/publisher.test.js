import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../src/config.js';
import { canonicalJson, effectivePublic, stableId } from '../src/models.js';
import { inspectImage } from '../src/image.js';
import { PublisherError } from '../src/errors.js';
import { containsForbiddenSecret } from '../src/validator.js';
import { publishCourse } from '../src/publisher.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('config keeps public values separate and requires the key only for publication', () => {
  const env = Object.fromEntries(['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_DATABASE_ID', 'APPWRITE_COURSES_TABLE_ID', 'APPWRITE_MATERIALS_TABLE_ID', 'APPWRITE_ASSETS_TABLE_ID', 'APPWRITE_MARKDOWN_BUCKET_ID', 'APPWRITE_MEDIA_BUCKET_ID'].map((name) => [name, 'value']));
  assert.equal(loadConfig({ env }).APPWRITE_API_KEY, undefined);
  assert.throws(() => loadConfig({ env, requireKey: true }), /APPWRITE_API_KEY/);
  assert.equal(loadConfig({ env: { ...env, APPWRITE_API_KEY: 'k'.repeat(512) }, requireKey: true }).APPWRITE_API_KEY.length, 512);
});

test('canonical plans and content-addressed IDs are deterministic', () => {
  assert.equal(canonicalJson({ b: 1, a: [true] }), canonicalJson({ a: [true], b: 1 }));
  assert.equal(stableId('md', 'abcdef'.repeat(12)), stableId('md', 'abcdef'.repeat(12)));
  assert.equal(effectivePublic({ lifecycleStatus: 'published', availability: 'available' }, { lifecycleStatus: 'published', availability: 'available' }), true);
  assert.equal(effectivePublic({ lifecycleStatus: 'draft', availability: 'available' }, { lifecycleStatus: 'published', availability: 'available' }), false);
});

test('image signature must match extension and dimensions', () => {
  const png = Buffer.alloc(24); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png); png.writeUInt32BE(1, 16); png.writeUInt32BE(1, 20);
  assert.deepEqual(inspectImage(png, 'assets/pixel.png'), { mimeType: 'image/png', width: 1, height: 1 });
  assert.throws(() => inspectImage(png, 'assets/pixel.jpg'), /signature/);
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
  assert.match(workflow, /branches: \["courses\/\*\*"\]/);
  assert.match(workflow, /if: github\.event_name == 'push'/);
  assert.match(workflow, /environment: appwrite/);
  assert.match(workflow, /APPWRITE_API_KEY: \$\{\{ secrets\.APPWRITE_API_KEY \}\}/);
  assert.equal([...workflow.matchAll(/uses: actions\/(?:checkout|setup-node)@([a-f0-9]+)/g)].every((match) => match[1].length === 40), true);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.doesNotMatch(validate, /secrets\.|APPWRITE_API_KEY/);
  assert.doesNotMatch(deploy, /cache:|actions\/(?:cache|upload-artifact|download-artifact)@/);
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
      APPWRITE_ASSETS_TABLE_ID: 'assets',
      APPWRITE_MARKDOWN_BUCKET_ID: 'markdown',
      APPWRITE_MEDIA_BUCKET_ID: 'media',
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
  assert.deepEqual({ ...calls[0], body: undefined }, { bucket: 'markdown', id: 'md-test', body: undefined, name: 'lectures/001_introduction.md' });
  assert.match(calls[0].body, /^# Publisher acceptance/m);
});
