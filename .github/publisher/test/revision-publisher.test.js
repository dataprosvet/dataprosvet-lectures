import assert from 'node:assert/strict';
import test from 'node:test';
import { attachmentSourceFileId, buildAttachmentBundle } from '../src/attachment-bundle.js';
import { checksum, canonicalJson, effectivePublic } from '../src/models.js';
import { publicationResourceDigest } from '../src/publication-readiness.js';
import { publishRevisionPlan } from '../src/revision-publisher.js';
import { PublisherError } from '../src/errors.js';
import { createAdapterFromServices } from '../src/appwrite.js';
import { publishPlan } from '../src/publisher.js';
import { fakeServices } from './appwrite-fixtures.js';
import { materialContentFileId } from '../src/content-identity.js';

const config = Object.freeze({ APPWRITE_ENDPOINT: 'https://example.invalid/v1', APPWRITE_PROJECT_ID: 'project', APPWRITE_DATABASE_ID: 'database', APPWRITE_COURSES_TABLE_ID: 'courses', APPWRITE_MATERIALS_TABLE_ID: 'materials', APPWRITE_ASSETS_TABLE_ID: 'assets', APPWRITE_ATTACHMENTS_TABLE_ID: 'attachments', APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID: 'bundles', APPWRITE_MARKDOWN_BUCKET_ID: 'markdown-files', APPWRITE_MEDIA_BUCKET_ID: 'media-files', APPWRITE_ATTACHMENTS_BUCKET_ID: 'source-files', APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID: 'zip-files', COURSE_ATTACHMENT_MAX_BYTES: 10485760 });
const sha = 'a'.repeat(40);
const permission = (readable) => readable ? ['read("any")'] : [];
async function fixturePlan(definitions = [{ slug: 'intro', files: { first: 'first', second: 'second' } }], courseChanges = {}) {
  const course = { slug: 'fixture-course', title: 'Fixture', description: 'Description', lifecycleStatus: 'published', availability: 'available', sortOrder: 1, publicRead: true, ...courseChanges };
  const prepared = new Map(); const materials = [];
  for (const [index, definition] of definitions.entries()) {
    const material = { kind: 'lecture', slug: definition.slug, title: definition.slug, summary: 'Summary', lifecycleStatus: definition.lifecycleStatus ?? 'published', availability: definition.availability ?? 'available', sortOrder: index + 1, content: null, briefContent: null, assets: [], resourceKey: `${course.slug}/lecture/${definition.slug}` };
    material.publicRead = effectivePublic(course, material);
    material.attachments = Object.entries(definition.files ?? {}).map(([key, body], sortOrder) => {
      const bytes = Buffer.from(body); const file = `attachments/${definition.slug}/${key}.py`;
      prepared.set(`attachment:${file}`, bytes);
      const attachment = { key, title: key, file, fileName: `${key}.py`, mimeType: 'text/x-python', sizeBytes: bytes.length, sortOrder, checksum: checksum(bytes), publicRead: material.publicRead };
      return { ...attachment, fileId: attachmentSourceFileId(material.resourceKey, attachment) };
    });
    const bundle = await buildAttachmentBundle(material.resourceKey, material.attachments, (attachment) => prepared.get(`attachment:${attachment.file}`));
    material.attachmentsRevision = bundle.attachmentsRevision; material.bundle = bundle.descriptor;
    if (bundle.bytes) prepared.set(`bundle:${material.resourceKey}`, bundle.bytes);
    materials.push(material);
  }
  const unsigned = { version: 2, maxAttachmentBytes: 10485760, course, materials, summary: {} };
  return { plan: { ...unsigned, digest: checksum(canonicalJson(unsigned)) }, prepared };
}

function memoryAdapter() {
  const state = { tables: Object.fromEntries(['courses', 'materials', 'assets', 'attachments', 'bundles'].map((table) => [table, new Map()])), files: new Map(), events: [], stage: '', fault: null, next: 1 };
  const rows = (table) => [...state.tables[table].values()].map((row) => structuredClone(row));
  const event = (type, data = {}) => { state.events.push({ stage: state.stage, type, ...data }); if (state.fault?.(type, data, state)) throw Error('simulated private provider failure'); };
  const get = (table, id) => { const row = state.tables[table].get(id); if (!row) throw Object.assign(Error('missing'), { code: 404 }); return row; };
  return {
    state, config,
    async preflight() { event('read-preflight'); },
    async inventory() { return { materials: rows('materials'), assets: rows('assets'), attachments: rows('attachments'), bundles: rows('bundles') }; },
    async findCourse(slug) { return rows('courses').find((row) => row.slug === slug) ?? null; },
    async getRow(table, id) { return structuredClone(get(table, id)); },
    async listAssets(materialId) { return rows('assets').filter((row) => row.materialId === materialId); },
    async listAttachments(materialId) { return rows('attachments').filter((row) => row.materialId === materialId); },
    async listBundles(materialId) { return rows('bundles').filter((row) => row.materialId === materialId); },
    async getFile(bucket, id) { const file = state.files.get(`${bucket}/${id}`); return file ? { $id: id, sizeOriginal: file.bytes.length, $permissions: [...file.$permissions] } : null; },
    async putFile(bucket, id, bytes, name, readable) {
      event('create-or-reuse-file', { bucket, id });
      const key = `${bucket}/${id}`; const previous = state.files.get(key);
      if (previous) { assert.deepEqual(previous.bytes, bytes); return previous; }
      const file = { $id: id, bytes: Buffer.from(bytes), name, $permissions: permission(readable) }; state.files.set(key, file); return file;
    },
    async verifyFile(bucket, id, expected, readable) {
      event('verify-file', { bucket, id });
      const file = state.files.get(`${bucket}/${id}`);
      assert.ok(file); assert.equal(file.bytes.length, expected.sizeBytes); assert.equal(checksum(file.bytes), expected.sha256);
      if (readable !== undefined) assert.deepEqual(file.$permissions, permission(readable));
    },
    async expectAnonymousFile(bucket, id, readable, expected) {
      event('anonymous-file', { bucket, id, readable });
      const file = state.files.get(`${bucket}/${id}`);
      assert.equal(Boolean(file?.$permissions.includes('read("any")')), readable);
      if (readable && expected) { assert.equal(file.bytes.length, expected.sizeBytes); assert.equal(checksum(file.bytes), expected.sha256); }
    },
    async setFilePermissions(bucket, id, readable) { event('file-permission', { bucket, id, readable }); state.files.get(`${bucket}/${id}`).$permissions = permission(readable); },
    async setRowPermissions(table, id, readable) { event('row-permission', { table, id, readable }); get(table, id).$permissions = permission(readable); },
    async upsertRow(table, id, data, readable) {
      event('row-upsert', { table, id, readable, revision: data.attachmentsRevision });
      const rowId = id ?? `${table}-${state.next++}`;
      const row = { ...state.tables[table].get(rowId), $id: rowId, ...data, $permissions: permission(readable) };
      state.tables[table].set(rowId, row); return structuredClone(row);
    },
    async archiveRow(table, row) { event('archive-row', { table, id: row.$id }); Object.assign(get(table, row.$id), { lifecycleStatus: 'archived', availability: 'inDevelopment', $permissions: [] }); },
    async expectAnonymousRow(table, id, readable, expected = {}) {
      event('anonymous-row', { table, id, readable });
      const row = state.tables[table].get(id); assert.equal(Boolean(row?.$permissions.includes('read("any")')), readable);
      if (readable) for (const [key, value] of Object.entries(expected)) assert.equal(row[key], value);
    },
  };
}

function options(adapter, fixture, onFence = () => {}) {
  return {
    adapter,
    adapterFactory: () => { throw Error('Real adapters are forbidden in these fixtures'); },
    readiness: { enabled: true, protocol: 'attachments-v1', singleWriterConfirmed: true, auditDigest: 'c'.repeat(64), resourceDigest: publicationResourceDigest(config), publisherTreeSha: 'b'.repeat(40), courseBranches: [`courses/${fixture.plan.course.slug}`] },
    prepareFiles: async () => fixture.prepared,
    sourceGuard: { sourceCommit: sha, courseSlug: fixture.plan.course.slug, async assertCurrent(stage) { adapter.state.stage = stage; adapter.state.events.push({ type: 'fence', stage }); await onFence(stage); } },
  };
}
const publish = (adapter, fixture, onFence) => publishRevisionPlan(fixture.plan, options(adapter, fixture, onFence));
const mutateEvents = (events) => events.filter((event) => ['create-or-reuse-file', 'file-permission', 'row-permission', 'row-upsert', 'archive-row'].includes(event.type));

test('fake publication verifies private complete set, grants files, activates material last, exposes course last', async () => {
  const adapter = memoryAdapter(); const fixture = await fixturePlan();
  await publish(adapter, fixture);
  const events = adapter.state.events;
  const firstGrant = events.findIndex((event) => event.stage === 'grant-current-files' && event.type === 'file-permission');
  const activation = events.findIndex((event) => event.stage === 'activate-material-revision' && event.type === 'row-upsert');
  const courseExposure = events.findIndex((event) => event.stage === 'expose-course-last' && event.type === 'row-permission');
  const lastStagingWrite = events.findLastIndex((event) => event.stage === 'stage-resource-row' && event.type === 'row-upsert');
  assert.ok(lastStagingWrite >= 0 && firstGrant > lastStagingWrite);
  assert.equal(events.slice(lastStagingWrite + 1, firstGrant).filter((event) => event.type === 'verify-file').length, 3);
  assert.ok(activation > firstGrant); assert.ok(courseExposure > activation);
  assert.equal(adapter.state.tables.materials.values().next().value.attachmentsRevision, fixture.plan.materials[0].attachmentsRevision);
  assert.equal(adapter.state.tables.bundles.size, 1);
  assert.equal(adapter.state.files.size, 3);
  assert.equal(mutateEvents(events).at(-1).stage, 'expose-course-last');
});

test('retry is idempotent and never deletes old files or retired metadata', async () => {
  const adapter = memoryAdapter(); const first = await fixturePlan(); await publish(adapter, first);
  const materialId = [...adapter.state.tables.materials.keys()][0];
  const firstIds = [...adapter.state.files.keys()]; const bundleRowId = [...adapter.state.tables.bundles.keys()][0];
  await publish(adapter, first);
  assert.equal([...adapter.state.tables.materials.keys()][0], materialId);
  assert.deepEqual([...adapter.state.files.keys()], firstIds);
  const changed = await fixturePlan([{ slug: 'intro', files: { second: 'new second' } }]); await publish(adapter, changed);
  assert.equal([...adapter.state.tables.bundles.keys()][0], bundleRowId);
  for (const id of firstIds) { assert.ok(adapter.state.files.has(id)); assert.deepEqual(adapter.state.files.get(id).$permissions, []); }
  assert.equal(adapter.state.tables.attachments.size, 2);
  const retired = [...adapter.state.tables.attachments.values()].find((row) => row.key === 'first');
  assert.deepEqual(retired.$permissions, []);
  assert.notEqual(retired.attachmentsRevision, changed.plan.materials[0].attachmentsRevision);
});

test('all old files including omitted materials lose access before any course or material hide', async () => {
  const adapter = memoryAdapter(); const original = await fixturePlan([{ slug: 'intro', files: { first: 'first' } }, { slug: 'omitted', files: { second: 'second' } }]);
  await publish(adapter, original); const oldFiles = [...adapter.state.files.keys()]; adapter.state.events.length = 0;
  const changed = await fixturePlan([{ slug: 'intro', files: {} }], { availability: 'temporarilyUnavailable' });
  await publish(adapter, changed);
  const events = adapter.state.events;
  const firstHide = events.findIndex((event) => ['hide-course', 'hide-materials'].includes(event.stage));
  for (const file of oldFiles) {
    const [bucket, id] = file.split('/');
    assert.ok(events.findIndex((event) => event.type === 'file-permission' && event.bucket === bucket && event.id === id && event.readable === false) < firstHide);
    assert.deepEqual(adapter.state.files.get(file).$permissions, []);
  }
  const omitted = [...adapter.state.tables.materials.values()].find((row) => row.slug === 'omitted');
  assert.equal(omitted.lifecycleStatus, 'archived'); assert.deepEqual(omitted.$permissions, []);
  const intro = [...adapter.state.tables.materials.values()].find((row) => row.slug === 'intro');
  assert.equal(intro.attachmentsRevision, changed.plan.materials[0].attachmentsRevision);
  assert.deepEqual([...adapter.state.tables.bundles.values()].find((row) => row.materialId === intro.$id).$permissions, []);
});

test('equal source bytes in different materials have independently revocable IDs', async () => {
  const adapter = memoryAdapter(); const first = await fixturePlan([{ slug: 'first', files: { code: 'same bytes' } }, { slug: 'second', files: { code: 'same bytes' } }]);
  await publish(adapter, first);
  const [left, right] = first.plan.materials.map((material) => material.attachments[0].fileId);
  assert.notEqual(left, right);
  const changed = await fixturePlan([{ slug: 'first', availability: 'temporarilyUnavailable', files: { code: 'same bytes' } }, { slug: 'second', files: { code: 'same bytes' } }]);
  await publish(adapter, changed);
  assert.deepEqual(adapter.state.files.get(`source-files/${left}`).$permissions, []);
  assert.deepEqual(adapter.state.files.get(`source-files/${right}`).$permissions, ['read("any")']);
});

test('legacy shared ownership blocks before private uploads or permission changes', async () => {
  const adapter = memoryAdapter(); const fixture = await fixturePlan(); await publish(adapter, fixture);
  const materialId = [...adapter.state.tables.materials.keys()][0];
  const attachment = [...adapter.state.tables.attachments.values()][0];
  adapter.state.tables.attachments.set('foreign-attachment', { ...attachment, $id: 'foreign-attachment', materialId: 'another-material' });
  adapter.state.tables.materials.set('another-material', { $id: 'another-material', courseId: 'another-course', kind: 'lecture', slug: 'foreign', $permissions: ['read("any")'] });
  adapter.state.events.length = 0;
  await assert.rejects(() => publish(adapter, fixture), (error) => error.code === 'PUBLICATION_OWNERSHIP_AMBIGUOUS');
  assert.equal(mutateEvents(adapter.state.events).length, 0);
  assert.equal(adapter.state.tables.materials.get(materialId).attachmentsRevision, fixture.plan.materials[0].attachmentsRevision);
});

test('failure before active revision cannot announce a partial replacement; current retry repairs it', async () => {
  for (const failureStage of ['upload-private-files', 'revoke-files-before-hide', 'hide-course', 'stage-resource-row', 'verify-staged-revision', 'grant-current-files', 'grant-current-rows', 'activate-material-revision']) {
    const adapter = memoryAdapter(); const original = await fixturePlan(); await publish(adapter, original);
    const originalFiles = [...adapter.state.files.keys()];
    const materialId = [...adapter.state.tables.materials.keys()][0];
    const changed = await fixturePlan([{ slug: 'intro', files: { third: 'third' } }]);
    let failed = false;
    adapter.state.fault = (type, _data, state) => {
      // Read-back verification intentionally has no mutation fence. The fake
      // therefore observes its first file read after the final staging write.
      const matches = failureStage === 'verify-staged-revision'
        ? type === 'verify-file' && state.stage === 'stage-resource-row'
        : state.stage === failureStage;
      if (!failed && matches) { failed = true; return true; }
      return false;
    };
    await assert.rejects(() => publish(adapter, changed), (error) => error.code === 'PUBLISH_FAILED', failureStage);
    assert.equal(failed, true, failureStage);
    assert.equal(adapter.state.tables.materials.get(materialId).attachmentsRevision, original.plan.materials[0].attachmentsRevision, failureStage);
    for (const key of originalFiles) assert.ok(adapter.state.files.has(key));
    adapter.state.fault = null; await publish(adapter, changed);
    assert.equal(adapter.state.tables.materials.get(materialId).attachmentsRevision, changed.plan.materials[0].attachmentsRevision);
  }
});

test('stale run cannot mutate after lock or revoke/promote fences, and an old retry cannot overwrite new state', async () => {
  const stale = () => { throw new PublisherError('STALE_PUBLICATION_SOURCE', 'fixture branch advanced'); };
  const adapter = memoryAdapter(); const original = await fixturePlan();
  await assert.rejects(() => publish(adapter, original, stale), (error) => error.code === 'STALE_PUBLICATION_SOURCE');
  assert.equal(mutateEvents(adapter.state.events).length, 0);
  await publish(adapter, original);
  const changed = await fixturePlan([{ slug: 'intro', files: { third: 'third' } }]);
  for (const stop of ['revoke-files-before-hide', 'activate-material-revision']) {
    await assert.rejects(() => publish(adapter, changed, (stage) => { if (stage === stop) stale(); }), (error) => error.code === 'STALE_PUBLICATION_SOURCE');
    assert.equal([...adapter.state.tables.materials.values()][0].attachmentsRevision, original.plan.materials[0].attachmentsRevision);
  }
  await publish(adapter, changed); adapter.state.events.length = 0;
  await assert.rejects(() => publish(adapter, original, stale), (error) => error.code === 'STALE_PUBLICATION_SOURCE');
  assert.equal(mutateEvents(adapter.state.events).length, 0);
  assert.equal([...adapter.state.tables.materials.values()][0].attachmentsRevision, changed.plan.materials[0].attachmentsRevision);
});

test('malformed ownership inventory cannot be treated as empty or trigger any mutation', async () => {
  for (const change of [
    (a) => { a.inventory = async () => ({}); },
    (a) => { a.state.tables.materials.set('broken', { $id: 'broken', kind: 'lecture', slug: 'broken', $permissions: [] }); },
    (a) => { a.state.tables.attachments.set('orphan', { $id: 'orphan', materialId: 'missing', fileId: 'file', key: 'code', $permissions: [] }); },
    (a) => { a.state.tables.materials.set('bad', { $id: 'bad', courseId: 'course', kind: 'lecture', slug: 'bad', $permissions: null }); },
  ]) {
    const adapter = memoryAdapter(); change(adapter); const fixture = await fixturePlan();
    await assert.rejects(() => publish(adapter, fixture), (error) => error.code === 'PUBLICATION_INVENTORY_INVALID');
    assert.equal(mutateEvents(adapter.state.events).length, 0);
  }
});

test('private readback mismatch prevents granting files and switching active revision', async () => {
  const adapter = memoryAdapter(); const original = await fixturePlan(); await publish(adapter, original);
  const materialId = [...adapter.state.tables.materials.keys()][0];
  const changed = await fixturePlan([{ slug: 'intro', files: { third: 'third' } }]);
  const getRow = adapter.getRow.bind(adapter);
  adapter.getRow = async (table, id) => { const row = await getRow(table, id); return table === 'bundles' ? { ...row, attachmentCount: row.attachmentCount + 1 } : row; };
  adapter.state.events.length = 0;
  await assert.rejects(() => publish(adapter, changed), (error) => error.code === 'PUBLICATION_STATE_MISMATCH');
  assert.equal(adapter.state.tables.materials.get(materialId).attachmentsRevision, original.plan.materials[0].attachmentsRevision);
  assert.ok(!mutateEvents(adapter.state.events).some((event) => event.readable));
});

test('unknown acknowledgements after actual mutations retain files and next fresh plan revokes public candidates', async () => {
  for (const stop of ['upload-private-files', 'stage-resource-row', 'grant-current-files', 'grant-current-rows', 'activate-material-revision', 'expose-course-last']) {
    const adapter = memoryAdapter(); const original = await fixturePlan(); await publish(adapter, original);
    const originalFiles = [...adapter.state.files.keys()];
    const replacement = await fixturePlan([{ slug: 'intro', files: { replacement: 'replacement' } }]);
    let failed = false;
    for (const method of ['putFile', 'setFilePermissions', 'setRowPermissions', 'upsertRow']) {
      const action = adapter[method].bind(adapter);
      adapter[method] = async (...args) => {
        const result = await action(...args);
        if (!failed && adapter.state.stage === stop) { failed = true; throw Error('provider committed but acknowledgement was lost'); }
        return result;
      };
    }
    await assert.rejects(() => publish(adapter, replacement), (error) => error.code === 'PUBLISH_FAILED', stop);
    assert.equal(failed, true, stop);
    for (const key of originalFiles) assert.ok(adapter.state.files.has(key));
    const candidates = [...adapter.state.files.keys()].filter((key) => !originalFiles.includes(key));
    const fresh = await fixturePlan([{ slug: 'intro', files: {} }]);
    await publish(adapter, fresh);
    for (const key of [...originalFiles, ...candidates]) assert.deepEqual(adapter.state.files.get(key).$permissions, [], `${stop}: ${key}`);
    assert.equal([...adapter.state.tables.materials.values()][0].attachmentsRevision, fresh.plan.materials[0].attachmentsRevision);
  }
});

test('new dispatcher serializes same-course fake publications and prevents a course-mismatched fence', async () => {
  const adapter = memoryAdapter(); const fixture = await fixturePlan([{ slug: 'intro', files: {} }]);
  let active = 0; let peak = 0;
  adapter.preflight = async () => { active += 1; peak = Math.max(peak, active); await new Promise((resolve) => setTimeout(resolve, 5)); active -= 1; };
  await Promise.all([publishPlan(fixture.plan, options(adapter, fixture)), publishPlan(fixture.plan, options(adapter, fixture))]);
  assert.equal(peak, 1);
  const candidate = options(adapter, fixture); candidate.sourceGuard.courseSlug = 'another-course'; adapter.state.events.length = 0;
  await assert.rejects(() => publishPlan(fixture.plan, candidate), (error) => error.code === 'WRITER_POLICY_MISMATCH');
  assert.equal(adapter.state.events.length, 0);
});

test('real adapter paths run complete protocol against fake SDK services with no probes or deletes', async () => {
  const services = fakeServices(); const adapter = createAdapterFromServices(services);
  const run = (fixture) => publishRevisionPlan(fixture.plan, { ...options({ state: services.state }, fixture), adapter });
  const original = await fixturePlan(); await run(original); const originals = [...services.state.files.keys()];
  await run(original);
  await run(await fixturePlan([{ slug: 'intro', files: { third: 'third' } }]));
  for (const key of originals) assert.deepEqual(services.state.files.get(key).$permissions, []);
  const material = [...services.state.tables.materials.values()][0];
  const bundle = [...services.state.tables.bundles.values()][0];
  assert.equal(material.attachmentsRevision, bundle.attachmentsRevision);
  assert.equal(bundle.sourceCommit, sha);
  assert.deepEqual(bundle.$permissions, ['read("any")']);
  assert.ok(!services.state.events.some((event) => event.method?.startsWith('FORBIDDEN')));
});

test('simultaneous first publications of two courses cannot share revocable Markdown, brief or asset objects', async () => {
  const addContent = async (slug, availability = 'available') => {
    const fixture = await fixturePlan([{ slug: 'intro', files: {} }], { slug, availability });
    const material = fixture.plan.materials[0];
    const body = Buffer.from('same markdown and brief bytes'); const assetBytes = Buffer.from('same image bytes');
    for (const [property, file, role] of [['content', 'lectures/001_intro.md', 'markdown'], ['briefContent', 'lecture-notes/001_intro.md', 'brief-markdown']]) {
      material[property] = { path: file, checksum: checksum(body), sourceChecksum: checksum(body), rewrites: [], fileId: materialContentFileId(material.resourceKey, role, checksum(body)) };
      fixture.prepared.set(`markdown:${file}`, body);
    }
    material.assets = [{ key: 'shared', file: 'assets/shared.png', alt: 'Image', mimeType: 'image/png', width: 1, height: 1, checksum: checksum(assetBytes), fileId: materialContentFileId(material.resourceKey, 'asset', checksum(assetBytes)) }];
    fixture.prepared.set('asset:assets/shared.png', assetBytes);
    const { digest, ...unsigned } = fixture.plan; fixture.plan.digest = checksum(canonicalJson(unsigned));
    return fixture;
  };
  const adapter = memoryAdapter(); const left = await addContent('left-course'); const right = await addContent('right-course');
  const inventory = adapter.inventory.bind(adapter); let arrivals = 0; let release;
  const bothRead = new Promise((resolve) => { release = resolve; });
  adapter.inventory = async () => { const snapshot = await inventory(); if (++arrivals === 2) release(); await bothRead; return snapshot; };
  await Promise.all([publish(adapter, left), publish(adapter, right)]);
  assert.equal(adapter.state.files.size, 6);
  adapter.inventory = inventory;
  await publish(adapter, await addContent('left-course', 'temporarilyUnavailable'));
  const material = right.plan.materials[0];
  for (const id of [material.content.fileId, material.briefContent.fileId]) assert.deepEqual(adapter.state.files.get(`markdown-files/${id}`).$permissions, ['read("any")']);
  assert.deepEqual(adapter.state.files.get(`media-files/${material.assets[0].fileId}`).$permissions, ['read("any")']);
});

test('final verification also rejects public metadata belonging to omitted materials', async () => {
  const adapter = memoryAdapter(); const original = await fixturePlan(); await publish(adapter, original);
  const setRowPermissions = adapter.setRowPermissions.bind(adapter);
  adapter.setRowPermissions = (table, id, readable) => ['attachments', 'bundles'].includes(table) && !readable ? Promise.resolve() : setRowPermissions(table, id, readable);
  const empty = await fixturePlan([]);
  await assert.rejects(() => publish(adapter, empty), (error) => error.code === 'PUBLICATION_STATE_MISMATCH');
});
