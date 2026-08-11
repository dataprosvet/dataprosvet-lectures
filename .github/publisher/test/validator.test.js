import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { generatedAssetKey } from '../src/markdown.js';
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
function png(width = 1, height = 1, marker = 0) {
  const bytes = Buffer.alloc(25); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes); bytes.writeUInt32BE(width, 16); bytes.writeUInt32BE(height, 20); bytes[24] = marker; return bytes;
}

test('empty draft plan is deterministic and contains no materials', async () => {
  const root = await fixture();
  const first = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  const second = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  assert.deepEqual(first, second);
  assert.equal(first.materials.length, 0);
  assert.match(first.digest, /^[a-f0-9]{64}$/);
});

test('tracked support paths are accepted and excluded from the publication plan', async () => {
  const plan = await validateCourse({
    root: await fixture(emptyCourse(), {
      '.gitattributes': '*.png filter=lfs diff=lfs merge=lfs -text\n',
      'lectures-teacher/001_teacher.md': '# Teacher-only marker\n',
      'attachments/slides.pptx': 'repository-only marker\n',
      'openspec/config.yaml': 'schema: spec-driven\n',
    }),
    branch: 'courses/fixture-course',
    schema,
  });
  assert.equal(plan.materials.length, 0);
  assert.doesNotMatch(JSON.stringify(plan), /Teacher-only marker|repository-only marker|spec-driven|slides\.pptx/);
});

test('unknown and tracked source roots remain rejected', async () => {
  await reject(emptyCourse(), { 'notes/private.md': '# Unknown' }, 'TREE_UNDOCUMENTED');
  await reject(emptyCourse(), { 'sources/book.pdf': 'local source' }, 'TREE_UNDOCUMENTED');
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
  assert.deepEqual({ ...plan.materials[0].assets[0], checksum: undefined, fileId: undefined }, { key: 'diagram', file: 'assets/diagram.png', alt: 'Diagram', generated: false, mimeType: 'image/png', width: 2, height: 3, checksum: undefined, fileId: undefined, publicRead: false });
});

test('explicit compatibility assets accept tracked Unicode paths with spaces', async () => {
  const course = emptyCourse(); const lecture = material('lecture', 1);
  lecture.assets.push({ key: 'diagram', file: 'assets/Схема 1.png', alt: 'Схема' }); course.materials.lectures.push(lecture);
  const plan = await validateCourse({ root: await fixture(course, { 'lectures/001_lecture-1.md': '![Схема](attachment:diagram)', 'assets/Схема 1.png': png() }), branch: 'courses/fixture-course', schema });
  assert.equal(plan.materials[0].assets[0].file, 'assets/Схема 1.png');
  assert.equal(plan.materials[0].assets[0].generated, false);
});

test('omitted assets generate a body-free deterministic transformed plan', async () => {
  const course = emptyCourse(); const lecture = material('lecture', 1); delete lecture.assets; course.materials.lectures.push(lecture);
  const markdown = '# Lecture\n\n![[assets/Схема 1.png|Пайплайн]]\n';
  const root = await fixture(course, { 'lectures/001_lecture-1.md': markdown, 'assets/Схема 1.png': png(2, 3) });
  const before = execFileSync('git', ['status', '--porcelain=v1'], { cwd: root, encoding: 'utf8' });
  const first = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  const second = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  const content = first.materials[0].content; const asset = first.materials[0].assets[0];
  assert.deepEqual(first, second);
  assert.equal(asset.key, generatedAssetKey('assets/Схема 1.png'));
  assert.equal(asset.generated, true);
  assert.equal(asset.alt, 'Пайплайн');
  assert.notEqual(content.sourceChecksum, content.checksum);
  assert.match(content.fileId, /^md[a-f0-9]+$/);
  assert.equal(content.rewrites.length, 1);
  assert.deepEqual(first.summary.transformations[0].assets, [{ file: 'assets/Схема 1.png', key: asset.key }]);
  const serialized = JSON.stringify(first);
  assert.doesNotMatch(serialized, /# Lecture|!\[\[/);
  assert.equal(execFileSync('git', ['status', '--porcelain=v1'], { cwd: root, encoding: 'utf8' }), before);
});

test('generated key survives image replacement while media identity changes', async () => {
  const course = emptyCourse(); const lecture = material('lecture', 1); delete lecture.assets; course.materials.lectures.push(lecture);
  const root = await fixture(course, { 'lectures/001_lecture-1.md': '![[image.png]]', 'assets/image.png': png(1, 1, 1) });
  const first = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  await writeFile(path.join(root, 'assets/image.png'), png(1, 1, 2));
  const second = await validateCourse({ root, branch: 'courses/fixture-course', schema });
  assert.equal(first.materials[0].assets[0].key, second.materials[0].assets[0].key);
  assert.notEqual(first.materials[0].assets[0].checksum, second.materials[0].assets[0].checksum);
  assert.notEqual(first.materials[0].assets[0].fileId, second.materials[0].assets[0].fileId);
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

test('unmaterialized Git LFS publication input is rejected explicitly', async () => {
  const course = emptyCourse(); const lecture = material('lecture', 1);
  lecture.assets.push({ key: 'diagram', file: 'assets/diagram.png', alt: 'Diagram' }); course.materials.lectures.push(lecture);
  const pointer = 'version https://git-lfs.github.com/spec/v1\noid sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef\nsize 12345\n';
  await reject(course, { 'lectures/001_lecture-1.md': '![Diagram](attachment:diagram)', 'assets/diagram.png': pointer }, 'LFS_POINTER_UNRESOLVED');
});
