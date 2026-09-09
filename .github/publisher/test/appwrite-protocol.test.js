import assert from 'node:assert/strict';
import test from 'node:test';
import { collectRows, createAdapterFromServices } from '../src/appwrite.js';
import { checksum } from '../src/models.js';
import { loadConfig } from '../src/config.js';
import { fakeServices, publicationConfig, resourceFixture } from './appwrite-fixtures.js';

test('SDK adapter preflight uses resource GETs only and checks source fixed ceiling independently of lower effective limit', async () => {
  for (const limit of [10485760, 100]) {
    const services = fakeServices(); const adapter = createAdapterFromServices({ ...services, config: { ...publicationConfig, COURSE_ATTACHMENT_MAX_BYTES: limit } });
    await adapter.preflight();
    assert.equal(services.state.events.length, 9);
    assert.ok(services.state.events.every((event) => ['tables.getTable', 'storage.getBucket'].includes(event.method)));
  }
});

test('legacy Markdown/media storage switches are preserved without inventing new rollout requirements', async () => {
  const fixture = resourceFixture();
  for (const key of ['markdown-files', 'media-files']) Object.assign(fixture.buckets[key], { compression: 'gzip', encryption: false, antivirus: false, transformations: true });
  const original = structuredClone(fixture); const services = fakeServices(fixture);
  await createAdapterFromServices(services).preflight();
  assert.deepEqual(fixture, original);
  assert.ok(services.state.events.every((event) => ['tables.getTable', 'storage.getBucket'].includes(event.method)));
});

test('resource preflight fails closed for malformed permissions, identities, bounds, schema, indexes and private-read failures', async () => {
  const mutations = [
    (f) => { f.tables.materials.$id = 'wrong'; }, (f) => { f.tables.materials.databaseId = 'wrong'; },
    (f) => { f.tables.courses.enabled = false; }, (f) => { f.tables.materials.rowSecurity = false; },
    (f) => { f.tables.materials.columns.pop(); }, (f) => { f.tables.attachments.columns.at(-1).required = true; },
    (f) => { f.tables.bundles.columns[0].array = true; }, (f) => { f.tables.bundles.columns[0].size = 63; },
    (f) => { f.tables.bundles.columns[0].status = 'processing'; }, (f) => { f.tables.bundles.columns.push(f.tables.bundles.columns[0]); },
    (f) => { f.tables.bundles.columns.find((c) => c.key === 'sizeBytes').max = 30000001; },
    (f) => { f.tables.bundles.columns.find((c) => c.key === 'sourceTotalBytes').max = 31457280; },
    (f) => { f.tables.bundles.columns.find((c) => c.key === 'attachmentCount').max = 11; },
    (f) => { f.tables.bundles.indexes[0].columns = ['fileId']; }, (f) => { f.tables.bundles.indexes[0].lengths = [1]; },
    (f) => { f.buckets['source-files'].maximumFileSize = 15728640; },
    (f) => { f.buckets['zip-files'].maximumFileSize = 30000001; }, (f) => { f.buckets['zip-files'].fileSecurity = false; },
    (f) => { f.buckets['zip-files'].allowedFileExtensions.push('pdf'); }, (f) => { f.buckets['zip-files'].compression = 'gzip'; },
    (f) => { f.buckets['zip-files'].transformations = true; }, (f) => { f.buckets['zip-files'].antivirus = false; },
    (f) => { f.buckets['media-files'].maximumFileSize = 5242881; },
  ];
  for (const value of [null, undefined, '', {}, ['read("any")'], ['create("any")']]) {
    mutations.push((f) => { f.tables.attachments.$permissions = value; }, (f) => { f.buckets['zip-files'].$permissions = value; });
  }
  for (const mutate of mutations) {
    const fixture = resourceFixture(); mutate(fixture); const services = fakeServices(fixture);
    await assert.rejects(() => createAdapterFromServices(services).preflight(), (error) => error.code === 'RESOURCE_CONTRACT_MISMATCH');
    assert.ok(services.state.events.every((event) => ['tables.getTable', 'storage.getBucket'].includes(event.method)));
  }
  for (const code of [401, 403, 404, 500, undefined]) {
    const services = fakeServices(); services.state.fault = () => { throw Object.assign(Error('raw provider secret'), { code }); };
    await assert.rejects(() => createAdapterFromServices(services).preflight(), (error) => error.code === 'PREFLIGHT_INCONCLUSIVE' && !error.message.includes('raw provider'));
  }
});

test('SDK file create/reuse verifies exact bytes, never overwrites a same-sized collision and treats only 404 as missing', async () => {
  const services = fakeServices(); const adapter = createAdapterFromServices(services); const bytes = Buffer.from('abc');
  await adapter.putFile('source-files', 'source-one', bytes, 'one.py', false);
  await adapter.putFile('source-files', 'source-one', bytes, 'renamed.py', false);
  assert.equal(services.state.events.filter((event) => event.method === 'storage.createFile').length, 1);
  services.state.files.get('source-files/source-one').bytes = Buffer.from('def');
  await assert.rejects(() => adapter.putFile('source-files', 'source-one', bytes, 'one.py', false), (error) => error.code === 'PUBLICATION_STATE_MISMATCH');
  assert.equal(services.state.events.filter((event) => event.method === 'storage.createFile').length, 1);
  for (const code of [401, 403, 500, undefined]) {
    services.state.fault = (method) => { if (method === 'storage.getFile') throw Object.assign(Error('fake failure'), { code }); };
    await assert.rejects(() => adapter.putFile('source-files', 'missing', bytes, 'one.py', false));
  }
  assert.equal(services.state.events.filter((event) => event.method === 'storage.createFile').length, 1);
});

test('anonymous denied verification accepts only definite HTTP denials, never network failures or corrupt public bytes', async () => {
  const services = fakeServices(); const adapter = createAdapterFromServices(services); const bytes = Buffer.from('abc'); const expected = { sizeBytes: 3, sha256: checksum(bytes) };
  for (const code of [401, 403, 404]) {
    services.state.fault = () => { throw Object.assign(Error('provider raw'), { code }); };
    await adapter.expectAnonymousFile('source-files', 'one', false);
    await adapter.expectAnonymousRow('materials', 'one', false);
  }
  for (const code of [500, 429, undefined, '404']) {
    services.state.fault = () => { throw Object.assign(Error('provider raw'), { code }); };
    await assert.rejects(() => adapter.expectAnonymousFile('source-files', 'one', false), (error) => error.code === 'ANONYMOUS_ACCESS_MISMATCH');
    await assert.rejects(() => adapter.expectAnonymousRow('materials', 'one', false), (error) => error.code === 'ANONYMOUS_ACCESS_MISMATCH');
  }
  services.state.fault = null;
  services.state.files.set('source-files/one', { bytes, $permissions: ['read("any")'] });
  await assert.rejects(() => adapter.expectAnonymousFile('source-files', 'one', false), (error) => error.code === 'ANONYMOUS_ACCESS_MISMATCH');
  await adapter.expectAnonymousFile('source-files', 'one', true, expected);
  services.state.files.get('source-files/one').bytes = Buffer.from('bad');
  await assert.rejects(() => adapter.expectAnonymousFile('source-files', 'one', true, expected), (error) => error.code === 'PUBLICATION_STATE_MISMATCH');
});

test('read pagination rejects missing/wrong lists, duplicates, repeated cursors and overfull pages', async () => {
  for (const result of [undefined, {}, { rows: null }, { rows: {} }, { rows: [{ $id: 'same' }, { $id: 'same' }] }, { rows: [{ $id: '../bad' }] }, { rows: [{ $id: 'a' }, { $id: 'b' }, { $id: 'c' }] }]) await assert.rejects(() => collectRows(async () => result, [], 2), (error) => error.code === 'APPWRITE_PAGINATION_INVALID');
  await assert.rejects(() => collectRows(async () => ({ rows: [{ $id: 'a' }, { $id: 'b' }] }), [], 2), (error) => error.code === 'APPWRITE_PAGINATION_INVALID');
});

test('production config requires exact non-overlapping bundle resources and safe endpoint before SDK construction', () => {
  const env = { ...publicationConfig, COURSE_ATTACHMENT_MAX_BYTES: '10485760', APPWRITE_API_KEY: 'fixture-only-value-long-enough' };
  assert.equal(loadConfig({ env, requireKey: true, requireBundles: true }).APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID, 'bundles');
  for (const changes of [{ APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID: undefined }, { APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID: undefined }, { APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID: 'source-files' }, { APPWRITE_ENDPOINT: 'http://example.invalid/v1' }, { APPWRITE_ENDPOINT: 'https://user:password@example.invalid/v1' }, { APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID: '../wrong' }]) assert.throws(() => loadConfig({ env: { ...env, ...changes }, requireKey: true, requireBundles: true }), (error) => error.code === 'CONFIG_INVALID');
});
