import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checksum, stableId } from '../src/models.js';
import { buildDiff, publishPlan } from '../src/publisher.js';

const config = Object.freeze({
  APPWRITE_COURSES_TABLE_ID: 'courses',
  APPWRITE_MATERIALS_TABLE_ID: 'materials',
  APPWRITE_ASSETS_TABLE_ID: 'material_assets',
  APPWRITE_ATTACHMENTS_TABLE_ID: 'material_attachments',
  APPWRITE_MARKDOWN_BUCKET_ID: 'course-markdown',
  APPWRITE_MEDIA_BUCKET_ID: 'course-media',
  APPWRITE_ATTACHMENTS_BUCKET_ID: 'course-attachments',
});
function desired({ courseStatus = 'published', courseAvailability = 'available', materialStatus = 'published', materialAvailability = 'available', content = null, briefContent = null, attachments = [] } = {}) {
  return {
    course: { slug: 'fixture-course', title: 'Fixture', description: 'Description', lifecycleStatus: courseStatus, availability: courseAvailability, sortOrder: 1 },
    materials: [{ kind: 'lecture', slug: 'intro', title: 'Intro', summary: 'Summary', lifecycleStatus: materialStatus, availability: materialAvailability, sortOrder: 1, publicRead: courseStatus === 'published' && courseAvailability === 'available' && materialStatus === 'published' && materialAvailability === 'available', content, briefContent, assets: [], attachments, resourceKey: 'fixture-course/lecture/intro' }],
  };
}
function memoryAdapter({ course = null, materials = [], failUpload = false } = {}) {
  const state = { course, materials: [...materials], assets: [], attachments: [], files: new Map(), events: [], next: 1, verified: 0 };
  return {
    config, state,
    async findCourse(slug) { return state.course?.slug === slug ? state.course : null; },
    async listMaterials(courseId) { return state.materials.filter((row) => row.courseId === courseId); },
    async findMaterial(courseId, kind, slug) { return state.materials.find((row) => row.courseId === courseId && row.kind === kind && row.slug === slug) ?? null; },
    async findAsset(materialId, key) { return state.assets.find((row) => row.materialId === materialId && row.key === key) ?? null; },
    async listAssets(materialId) { return state.assets.filter((row) => row.materialId === materialId); },
    async findAttachment(materialId, key) { return state.attachments.find((row) => row.materialId === materialId && row.key === key) ?? null; },
    async listAttachments(materialId) { return state.attachments.filter((row) => row.materialId === materialId); },
    async getFile(bucket, id) { return state.files.get(`${bucket}/${id}`) ?? null; },
    async putFile(bucket, id, bytes, name) {
      state.events.push(`file:private:${id}`);
      if (failUpload) { const error = new Error('provider leaked secret-key'); error.code = 500; throw error; }
      const key = `${bucket}/${id}`; const existing = state.files.get(key);
      if (existing) return existing;
      const file = { $id: id, name, sizeOriginal: bytes.length, $permissions: [] }; state.files.set(key, file); return file;
    },
    async setFilePermissions(bucket, id, readable) { state.events.push(`file:${readable ? 'public' : 'private'}:${id}`); state.files.get(`${bucket}/${id}`).$permissions = readable ? ['read("any")'] : []; },
    async upsertRow(table, rowId, data, readable) {
      const row = { $id: rowId ?? `${table}-${state.next++}`, ...data, $permissions: readable ? ['read("any")'] : [] };
      state.events.push(`${table}:${readable ? 'public' : 'private'}:${row.slug ?? row.key}`);
      if (table === 'courses') state.course = row;
      if (table === 'materials') { const index = state.materials.findIndex((item) => item.$id === row.$id); if (index < 0) state.materials.push(row); else state.materials[index] = row; }
      if (table === 'material_assets') { const index = state.assets.findIndex((item) => item.$id === row.$id); if (index < 0) state.assets.push(row); else state.assets[index] = row; }
      if (table === 'material_attachments') { const index = state.attachments.findIndex((item) => item.$id === row.$id); if (index < 0) state.attachments.push(row); else state.attachments[index] = row; }
      return row;
    },
    async archiveRow(_table, row) { row.lifecycleStatus = 'archived'; row.availability = 'inDevelopment'; row.$permissions = []; state.events.push(`archive:${row.slug}`); },
    async removeRow(table, id) {
      state.events.push(`${table}:remove:${id}`);
      if (table === 'material_assets') state.assets = state.assets.filter((row) => row.$id !== id);
      if (table === 'material_attachments') state.attachments = state.attachments.filter((row) => row.$id !== id);
    },
    async verifyFinal() { state.events.push('verify'); state.verified += 1; },
  };
}
async function courseRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'publisher-reconcile-'));
  await mkdir(path.join(root, 'lectures')); await mkdir(path.join(root, 'assets'));
  await writeFile(path.join(root, 'lectures/001_intro.md'), '# Intro\n');
  return root;
}

test('reconciliation reuses stable row and file IDs on same-plan retry', async () => {
  const adapter = memoryAdapter(); const plan = desired({ content: { path: 'lectures/001_intro.md', fileId: 'md-content' } });
  const root = await courseRoot();
  await publishPlan(plan, { adapter, root });
  const ids = [adapter.state.course.$id, adapter.state.materials[0].$id];
  await publishPlan(plan, { adapter, root });
  assert.deepEqual([adapter.state.course.$id, adapter.state.materials[0].$id], ids);
  assert.equal(adapter.state.materials.length, 1);
  assert.equal(adapter.state.files.size, 1);
  assert.equal(adapter.state.verified, 2);
});

test('public permission ordering exposes file, material, then course', async () => {
  const adapter = memoryAdapter(); const plan = desired({ content: { path: 'lectures/001_intro.md', fileId: 'md-content' } });
  await publishPlan(plan, { adapter, root: await courseRoot() });
  const events = adapter.state.events;
  assert.ok(events.indexOf('file:public:md-content') < events.lastIndexOf('materials:public:intro'));
  assert.ok(events.lastIndexOf('materials:public:intro') < events.lastIndexOf('courses:public:fixture-course'));
  assert.equal(events.at(-1), 'verify');
});

test('omitted material is archived and diff reports create/update/archive counts', async () => {
  const oldCourse = { $id: 'course-1', slug: 'fixture-course' };
  const old = { $id: 'material-old', courseId: 'course-1', kind: 'seminar', slug: 'old', lifecycleStatus: 'published', availability: 'available' };
  const adapter = memoryAdapter({ course: oldCourse, materials: [old] });
  const diff = await buildDiff(adapter, desired());
  assert.deepEqual({ create: diff.create, update: diff.update, archive: diff.archive.length }, { create: 1, update: 0, archive: 1 });
  await publishPlan(desired(), { adapter });
  assert.equal(old.lifecycleStatus, 'archived');
  assert.ok(adapter.state.events.includes('archive:old'));
});

test('locking an omitted material revokes its attachment row and file', async () => {
  const oldCourse = { $id: 'course-1', slug: 'fixture-course', title: 'Fixture', description: 'Description', lifecycleStatus: 'published', availability: 'available', sortOrder: 1 };
  const old = { $id: 'material-old', courseId: 'course-1', kind: 'lecture', slug: 'old', title: 'Old', summary: 'Old', contentFileId: null, lifecycleStatus: 'published', availability: 'available', sortOrder: 2 };
  const adapter = memoryAdapter({ course: oldCourse, materials: [old] });
  adapter.state.assets.push({ $id: 'asset-old', materialId: 'material-old', key: 'diagram', fileId: 'media-old', alt: 'Old', mimeType: 'image/png', width: 1, height: 1, $permissions: ['read("any")'] });
  adapter.state.files.set('course-media/media-old', { $id: 'media-old', $permissions: ['read("any")'] });
  await publishPlan(desired(), { adapter });
  assert.deepEqual(adapter.state.assets[0].$permissions, []);
  assert.deepEqual(adapter.state.files.get('course-media/media-old').$permissions, []);
  assert.ok(adapter.state.events.includes('file:private:media-old'));
});

test('removing reading declarations nulls references and revokes prior file access', async () => {
  const oldCourse = { $id: 'course-1', slug: 'fixture-course', title: 'Fixture', description: 'Description', lifecycleStatus: 'published', availability: 'available', sortOrder: 1 };
  const old = { $id: 'material-1', courseId: 'course-1', kind: 'lecture', slug: 'intro', title: 'Intro', summary: 'Summary', contentFileId: 'md-primary', briefContentFileId: 'md-brief', lifecycleStatus: 'published', availability: 'available', sortOrder: 1 };
  const adapter = memoryAdapter({ course: oldCourse, materials: [old] });
  adapter.state.files.set('course-markdown/md-primary', { $id: 'md-primary', $permissions: ['read("any")'] });
  adapter.state.files.set('course-markdown/md-brief', { $id: 'md-brief', $permissions: ['read("any")'] });

  await publishPlan(desired(), { adapter });

  assert.equal(adapter.state.materials[0].contentFileId, null);
  assert.equal(adapter.state.materials[0].briefContentFileId, null);
  assert.deepEqual(adapter.state.materials[0].$permissions, ['read("any")']);
  assert.deepEqual(adapter.state.files.get('course-markdown/md-primary').$permissions, []);
  assert.deepEqual(adapter.state.files.get('course-markdown/md-brief').$permissions, []);
  assert.ok(adapter.state.events.includes('file:private:md-primary'));
  assert.ok(adapter.state.events.includes('file:private:md-brief'));
});

test('removing attachment declarations revokes files before mappings and preserves material', async () => {
  const oldCourse = { $id: 'course-1', slug: 'fixture-course', title: 'Fixture', description: 'Description', lifecycleStatus: 'published', availability: 'available', sortOrder: 1 };
  const old = { $id: 'material-1', courseId: 'course-1', kind: 'lecture', slug: 'intro', title: 'Intro', summary: 'Summary', contentFileId: null, briefContentFileId: null, lifecycleStatus: 'published', availability: 'available', sortOrder: 1 };
  const adapter = memoryAdapter({ course: oldCourse, materials: [old] });
  adapter.state.attachments.push({ $id: 'attachment-old', materialId: 'material-1', key: 'slides', title: 'Slides', fileId: 'att-old', fileName: 'slides.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', sizeBytes: 10, sortOrder: 1, $permissions: ['read("any")'] });
  adapter.state.files.set('course-attachments/att-old', { $id: 'att-old', $permissions: ['read("any")'] });

  await publishPlan(desired(), { adapter });

  assert.equal(adapter.state.attachments.length, 0);
  assert.equal(adapter.state.materials.length, 1);
  assert.equal(adapter.state.materials[0].lifecycleStatus, 'published');
  assert.deepEqual(adapter.state.files.get('course-attachments/att-old').$permissions, []);
  assert.ok(adapter.state.events.indexOf('file:private:att-old') < adapter.state.events.indexOf('material_attachments:remove:attachment-old'));
});

test('partial upload failure remains locked and emits bounded secret-free recovery', async () => {
  const existing = { $id: 'course-1', slug: 'fixture-course', title: 'Old', description: 'Old', lifecycleStatus: 'published', availability: 'available', sortOrder: 1 };
  const adapter = memoryAdapter({ course: existing, failUpload: true });
  const root = await courseRoot();
  await assert.rejects(() => publishPlan(desired({ content: { path: 'lectures/001_intro.md', fileId: 'md-content' } }), { adapter, root }), (error) => {
    assert.equal(error.code, 'PUBLISH_FAILED');
    assert.match(error.message, /upload-private-files.*provider code 500.*retry the same commit/);
    assert.doesNotMatch(error.message, /secret-key/);
    return true;
  });
  assert.deepEqual(adapter.state.course.$permissions, []);
  assert.equal(adapter.state.course.lifecycleStatus, 'draft');
});

test('same-course publications are serialized', async () => {
  let active = 0; let peak = 0;
  const adapter = memoryAdapter();
  adapter.preflight = async () => { active += 1; peak = Math.max(peak, active); await new Promise((resolve) => setTimeout(resolve, 10)); active -= 1; };
  await Promise.all([publishPlan(desired(), { adapter }), publishPlan(desired(), { adapter })]);
  assert.equal(peak, 1);
});

test('generated attachment mappings are idempotent and renamed mappings retire safely', async () => {
  const root = await courseRoot(); const oldBytes = Buffer.from('old-image'); const newBytes = Buffer.from('new-image');
  await writeFile(path.join(root, 'assets/old.png'), oldBytes); await writeFile(path.join(root, 'assets/new.png'), newBytes);
  const asset = (key, file, body) => ({ key, file, alt: key, generated: true, mimeType: 'image/png', width: 1, height: 1, checksum: checksum(body), fileId: stableId('asset', checksum(body)), publicRead: true });
  const first = desired(); first.materials[0].assets = [asset('asset-old', 'assets/old.png', oldBytes)];
  const adapter = memoryAdapter(); await publishPlan(first, { adapter, root }); await publishPlan(first, { adapter, root });
  assert.equal(adapter.state.assets.length, 1);
  const oldFileId = first.materials[0].assets[0].fileId;
  const second = desired(); second.materials[0].assets = [asset('asset-new', 'assets/new.png', newBytes)];
  await publishPlan(second, { adapter, root });
  assert.deepEqual(adapter.state.assets.map((item) => item.key), ['asset-new']);
  assert.deepEqual(adapter.state.files.get(`course-media/${oldFileId}`).$permissions, []);
  assert.ok(adapter.state.events.includes(`file:private:${oldFileId}`));
});
