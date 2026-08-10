import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { validateCourse } from '../src/validator.js';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(await readFile(path.resolve(packageRoot, '../schemas/course.schema.json'), 'utf8'));
const emptyCourse = () => ({
  schemaVersion: 1,
  slug: 'fixture-course',
  title: 'Fixture course',
  description: 'Fixture course description.',
  lifecycleStatus: 'draft',
  availability: 'inDevelopment',
  sortOrder: 1,
  materials: { lectures: [], seminars: [], homeworks: [] },
});
const material = (kind, order, status = ['draft', 'inDevelopment']) => ({
  slug: `${kind}-${order}`,
  title: `${kind} ${order}`,
  summary: `${kind} summary`,
  lifecycleStatus: status[0],
  availability: status[1],
  sortOrder: order,
  markdown: `${kind}s/${String(order).padStart(3, '0')}_${kind}-${order}.md`,
  assets: [],
});
async function fixture(course = emptyCourse(), files = {}, setup) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'publisher-validator-'));
  execFileSync('git', ['init', '-q'], { cwd: root });
  for (const directory of ['lectures', 'seminars', 'homeworks', 'assets']) await mkdir(path.join(root, directory));
  await writeFile(path.join(root, 'course.yaml'), YAML.stringify(course));
  for (const [relative, body] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, relative)), { recursive: true });
    await writeFile(path.join(root, relative), body);
  }
  if (setup) await setup(root);
  execFileSync('git', ['add', '-A'], { cwd: root });
  return root;
}
async function reject(course, files, code, setup) {
  const root = await fixture(course, files, setup);
  await assert.rejects(() => validateCourse({ root, branch: 'courses/fixture-course', schema }), (error) => error.code === code);
}

test('empty draft plan is deterministic and contains no materials', async () => {
  const root = await fixture();
  const first = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  const second = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  assert.deepEqual(first, second);
  assert.equal(first.materials.length, 0);
  assert.match(first.digest, /^[a-f0-9]{64}$/);
});

test('all material kinds and effective status combinations normalize in sort order', async () => {
  const course = emptyCourse();
  course.lifecycleStatus = 'published'; course.availability = 'available';
  course.materials.lectures.push(material('lecture', 3, ['published', 'available']));
  course.materials.seminars.push(material('seminar', 2, ['published', 'temporarilyUnavailable']));
  course.materials.homeworks.push(material('homework', 1, ['archived', 'inDevelopment']));
  const files = Object.fromEntries([
    ['lectures/003_lecture-3.md', '# Lecture'],
    ['seminars/002_seminar-2.md', '# Seminar'],
    ['homeworks/001_homework-1.md', '# Homework'],
  ]);
  const plan = await validateCourse({ root: await fixture(course, files), branch: 'courses/fixture-course', schema });
  assert.deepEqual(plan.materials.map(({ kind, publicRead }) => [kind, publicRead]), [['homework', false], ['seminar', false], ['lecture', true]]);
});

test('attachment references resolve to inspected image metadata', async () => {
  const course = emptyCourse(); const lecture = material('lecture', 1);
  lecture.assets.push({ key: 'diagram', file: 'assets/diagram.png', alt: 'Diagram' }); course.materials.lectures.push(lecture);
  const png = Buffer.alloc(24); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png); png.writeUInt32BE(2, 16); png.writeUInt32BE(3, 20);
  const plan = await validateCourse({ root: await fixture(course, { 'lectures/001_lecture-1.md': '![Diagram](attachment:diagram)', 'assets/diagram.png': png }), branch: 'courses/fixture-course', schema });
  assert.deepEqual({ ...plan.materials[0].assets[0], checksum: undefined, fileId: undefined }, { key: 'diagram', file: 'assets/diagram.png', alt: 'Diagram', mimeType: 'image/png', width: 2, height: 3, checksum: undefined, fileId: undefined, publicRead: false });
});

test('malformed YAML and branch identity mismatch are rejected', async () => {
  const root = await fixture(); await writeFile(path.join(root, 'course.yaml'), ': bad: ['); execFileSync('git', ['add', 'course.yaml'], { cwd: root });
  await assert.rejects(() => validateCourse({ root, branch: 'courses/fixture-course', schema }));
  await reject({ ...emptyCourse(), slug: 'other-course' }, {}, 'IDENTITY_MISMATCH');
});

test('duplicate identity and missing or unresolved content are rejected', async () => {
  const duplicate = emptyCourse(); duplicate.materials.lectures.push(material('lecture', 1), { ...material('lecture', 2), slug: 'lecture-1' });
  await reject(duplicate, { 'lectures/001_lecture-1.md': '# One', 'lectures/002_lecture-2.md': '# Two' }, 'MANIFEST_DUPLICATE');
  const missing = emptyCourse(); missing.materials.lectures.push(material('lecture', 1));
  await reject(missing, {}, 'FILE_UNTRACKED');
  const unresolved = emptyCourse(); unresolved.materials.lectures.push(material('lecture', 1));
  await reject(unresolved, { 'lectures/001_lecture-1.md': '![Missing](attachment:missing)' }, 'ATTACHMENT_UNRESOLVED');
  await reject(unresolved, { 'lectures/001_lecture-1.md': 'attachment:missing' }, 'ATTACHMENT_SYNTAX_INVALID');
});

test('unsafe tree, raw HTML, invalid UTF-8, and credentials are rejected', async () => {
  await reject(emptyCourse(), {}, 'TREE_UNSAFE', (root) => symlink('../course.yaml', path.join(root, 'assets/unsafe.png')));
  const html = emptyCourse(); html.materials.lectures.push(material('lecture', 1));
  await reject(html, { 'lectures/001_lecture-1.md': '<script>bad</script>' }, 'MARKDOWN_HTML_FORBIDDEN');
  await reject(html, { 'lectures/001_lecture-1.md': Buffer.from([0xc3, 0x28]) }, 'MARKDOWN_UTF8_INVALID');
  await reject(html, { 'lectures/001_lecture-1.md': 'ghp_abcdefghijklmnopqrstuvwxyz0123456789' }, 'SECRET_PATTERN');
});

test('undeclared, unreferenced, and MIME-mismatched assets are rejected', async () => {
  const png = Buffer.alloc(24); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png); png.writeUInt32BE(1, 16); png.writeUInt32BE(1, 20);
  await reject(emptyCourse(), { 'assets/orphan.png': png }, 'UNDECLARED_ASSET');
  const unreferenced = emptyCourse(); const lecture = material('lecture', 1); lecture.assets.push({ key: 'diagram', file: 'assets/diagram.png', alt: 'Diagram' }); unreferenced.materials.lectures.push(lecture);
  await reject(unreferenced, { 'lectures/001_lecture-1.md': '# No reference', 'assets/diagram.png': png }, 'ATTACHMENT_UNREFERENCED');
  await reject(unreferenced, { 'lectures/001_lecture-1.md': '![Diagram](attachment:diagram)', 'assets/diagram.png': Buffer.from('not an image') }, 'IMAGE_INVALID');
});
