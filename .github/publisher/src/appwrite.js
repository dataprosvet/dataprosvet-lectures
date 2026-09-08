import { Client, ID, Permission, Query, Role, Storage, TablesDB } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { loadConfig } from './config.js';
import { fail, PublisherError } from './errors.js';
import { checksum } from './models.js';
import { LIMITS } from './constants.js';
import { verifyResourceContract } from './resource-contract.js';
import { assertFields, assertPermissions } from './revision-publisher.js';

const privatePermissions = Object.freeze([]);
const publicRead = Object.freeze([Permission.read(Role.any())]);
const rowPageSize = 100;
const validId = (value) => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(value);
export function permissions(readable) { return readable ? publicRead : privatePermissions; }

export function assertContentAddressedFileCompatible(existing, bytes) {
  if (existing.sizeOriginal !== bytes.length) fail('FILE_ID_COLLISION', 'Existing content-addressed file metadata differs');
}

export async function collectRows(fetchPage, queries = [], pageSize = rowPageSize) {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) fail('APPWRITE_PAGINATION_INVALID', 'Invalid row page budget');
  const rows = []; const seen = new Set(); let cursor;
  while (true) {
    const pageQueries = [...queries, Query.limit(pageSize), ...(cursor ? [Query.cursorAfter(cursor)] : [])];
    const result = await fetchPage(pageQueries); const page = result?.rows;
    if (!Array.isArray(page) || page.length > pageSize || rows.length + page.length > 100000 || page.some((row) => !validId(row?.$id) || seen.has(row.$id)) || new Set(page.map((row) => row.$id)).size !== page.length) fail('APPWRITE_PAGINATION_INVALID', 'Incomplete or ambiguous Appwrite row inventory');
    for (const row of page) { rows.push(row); seen.add(row.$id); }
    if (page.length < pageSize) return rows;
    cursor = page.at(-1).$id;
  }
}

function bytesOf(body) {
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (ArrayBuffer.isView(body)) return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  fail('PUBLICATION_STATE_MISMATCH', 'File response is not binary');
}
function verifyBytes(bytes, expected) {
  if (!Number.isSafeInteger(expected?.sizeBytes) || expected.sizeBytes < 1 || expected.sizeBytes > LIMITS.maxAttachmentBundleBytes || !/^[a-f0-9]{64}$/.test(expected.sha256) || bytes.length !== expected.sizeBytes || checksum(bytes) !== expected.sha256) fail('PUBLICATION_STATE_MISMATCH', 'File bytes differ from the complete validated plan');
}

// Construction does not contact Appwrite. The dispatcher validates default-deny
// readiness and the current source fence before constructing this adapter.
export function createAdapter({ env = process.env } = {}) {
  const config = loadConfig({ env, requireKey: true, requireBundles: true });
  const client = new Client().setEndpoint(config.APPWRITE_ENDPOINT).setProject(config.APPWRITE_PROJECT_ID).setKey(config.APPWRITE_API_KEY);
  const anonymous = new Client().setEndpoint(config.APPWRITE_ENDPOINT).setProject(config.APPWRITE_PROJECT_ID);
  return createAdapterFromServices({ config, tables: new TablesDB(client), storage: new Storage(client), anonymousTables: new TablesDB(anonymous), anonymousStorage: new Storage(anonymous) });
}

// Tests supply every SDK service, including both anonymous readers, explicitly.
// This seam never substitutes real services when a fake is absent.
export function createAdapterFromServices({ config, tables, storage, anonymousTables, anonymousStorage }) {
  if (!config || !tables || !storage || !anonymousTables || !anonymousStorage) fail('CONFIG_INVALID', 'All publication SDK services are required');
  const listAll = (tableId, queries = []) => collectRows((pageQueries) => tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId, queries: pageQueries, total: false, ttl: 0 }), queries);
  const listOne = async (tableId, queries) => {
    const rows = await listAll(tableId, queries);
    if (rows.length > 1) fail('APPWRITE_AMBIGUOUS', 'Multiple rows match a stable publication key');
    return rows[0] ?? null;
  };
  const getRow = async (service, tableId, rowId) => {
    const row = await service.getRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId });
    if (row?.$id !== rowId) fail('PUBLICATION_STATE_MISMATCH', 'Row identity differs');
    return row;
  };
  const getFile = async (bucketId, fileId) => {
    try {
      const file = await storage.getFile({ bucketId, fileId });
      if (file?.$id !== fileId || file.bucketId !== bucketId) fail('PUBLICATION_STATE_MISMATCH', 'File identity differs');
      return file;
    } catch (error) { if (error?.code === 404) return null; throw error; }
  };
  const verifyFile = async (bucketId, fileId, expected, readable) => {
    const file = await getFile(bucketId, fileId);
    if (!file || file.sizeOriginal !== expected.sizeBytes) fail('PUBLICATION_STATE_MISMATCH', 'File metadata differs');
    if (readable !== undefined) assertPermissions(file, readable, 'file');
    verifyBytes(bytesOf(await storage.getFileDownload({ bucketId, fileId })), expected);
  };
  const expectAnonymousFile = async (bucketId, fileId, readable, expected) => {
    let body;
    try { body = await anonymousStorage.getFileDownload({ bucketId, fileId }); }
    catch (error) {
      if (!readable && [401, 403, 404].includes(error?.code)) return;
      fail('ANONYMOUS_ACCESS_MISMATCH', 'Anonymous file read did not prove the expected access');
    }
    if (!readable) fail('ANONYMOUS_ACCESS_MISMATCH', 'Retired or private file is anonymously readable');
    verifyBytes(bytesOf(body), expected);
  };
  return Object.freeze({
    config,
    async preflight() {
      try { await verifyResourceContract({ config, tables, storage }); }
      catch (error) { if (error instanceof PublisherError) throw error; fail('PREFLIGHT_INCONCLUSIVE', 'Resource read scopes or responses did not prove the reviewed contract'); }
    },
    async inventory() {
      const [materials, assets, attachments, bundles] = await Promise.all(['MATERIALS', 'ASSETS', 'ATTACHMENTS', 'ATTACHMENT_BUNDLES'].map((key) => listAll(config[`APPWRITE_${key}_TABLE_ID`])));
      return { materials, assets, attachments, bundles };
    },
    async findCourse(slug) { return listOne(config.APPWRITE_COURSES_TABLE_ID, [Query.equal('slug', slug)]); },
    async getRow(tableId, rowId) { return getRow(tables, tableId, rowId); },
    async listAssets(materialId) { return listAll(config.APPWRITE_ASSETS_TABLE_ID, [Query.equal('materialId', materialId)]); },
    async listAttachments(materialId) { return listAll(config.APPWRITE_ATTACHMENTS_TABLE_ID, [Query.equal('materialId', materialId)]); },
    async listBundles(materialId) { return listAll(config.APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID, [Query.equal('materialId', materialId)]); },
    getFile, verifyFile, expectAnonymousFile,
    async putFile(bucketId, fileId, bytes, name, readable) {
      if (readable !== false) fail('PUBLICATION_PLAN_INVALID', 'Files must be prepared privately');
      const expected = { sizeBytes: bytes.length, sha256: checksum(bytes) };
      if (await getFile(bucketId, fileId)) { await verifyFile(bucketId, fileId, expected); return; }
      await storage.createFile({ bucketId, fileId, file: InputFile.fromBuffer(bytes, name), permissions: privatePermissions });
      await verifyFile(bucketId, fileId, expected, false);
    },
    async setFilePermissions(bucketId, fileId, readable) { return storage.updateFile({ bucketId, fileId, permissions: permissions(readable) }); },
    async setRowPermissions(tableId, rowId, readable) { return tables.updateRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId, data: {}, permissions: permissions(readable) }); },
    async upsertRow(tableId, rowId, data, readable) {
      const args = { databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId, data, permissions: permissions(readable) };
      return rowId ? tables.updateRow(args) : tables.createRow({ ...args, rowId: ID.unique() });
    },
    async archiveRow(tableId, row) { return tables.updateRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId: row.$id, data: { lifecycleStatus: 'archived', availability: 'inDevelopment' }, permissions: privatePermissions }); },
    async expectAnonymousRow(tableId, rowId, readable, expected = {}) {
      let row;
      try { row = await getRow(anonymousTables, tableId, rowId); }
      catch (error) {
        if (!readable && [401, 403, 404].includes(error?.code)) return;
        if (error instanceof PublisherError) throw error;
        fail('ANONYMOUS_ACCESS_MISMATCH', 'Anonymous row read did not prove the expected access');
      }
      if (!readable) fail('ANONYMOUS_ACCESS_MISMATCH', 'Private metadata is anonymously readable');
      assertFields(row, expected, 'anonymous row'); assertPermissions(row, true, 'anonymous row');
    },
  });
}
