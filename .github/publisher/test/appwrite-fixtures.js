import assert from 'node:assert/strict';

export const publicationConfig = Object.freeze({ APPWRITE_ENDPOINT: 'https://example.invalid/v1', APPWRITE_PROJECT_ID: 'project', APPWRITE_DATABASE_ID: 'database', APPWRITE_COURSES_TABLE_ID: 'courses', APPWRITE_MATERIALS_TABLE_ID: 'materials', APPWRITE_ASSETS_TABLE_ID: 'assets', APPWRITE_ATTACHMENTS_TABLE_ID: 'attachments', APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID: 'bundles', APPWRITE_MARKDOWN_BUCKET_ID: 'markdown-files', APPWRITE_MEDIA_BUCKET_ID: 'media-files', APPWRITE_ATTACHMENTS_BUCKET_ID: 'source-files', APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID: 'zip-files', COURSE_ATTACHMENT_MAX_BYTES: 10485760 });
const column = (key, type, required, size) => ({ key, type, required, ...(size === undefined ? {} : { size }), status: 'available', array: false, default: null });
const index = (key, type, columns) => ({ key, type, columns, orders: columns.map(() => 'ASC'), lengths: columns.map(() => 0), status: 'available' });
export function resourceFixture() {
  const tables = Object.fromEntries(['courses', 'materials', 'assets', 'attachments', 'bundles'].map((id) => [id, { $id: id, databaseId: 'database', enabled: true, rowSecurity: true, $permissions: [], columns: [], indexes: [] }]));
  tables.materials.columns.push(column('briefContentFileId', 'varchar', false, 64), column('attachmentsRevision', 'varchar', false, 64));
  tables.attachments.columns.push(...[['materialId', 64], ['key', 128], ['title', 512], ['fileId', 64], ['fileName', 255], ['mimeType', 128]].map(([key, size]) => column(key, 'varchar', true, size)), column('sizeBytes', 'bigint', true), column('sortOrder', 'integer', true), column('attachmentsRevision', 'varchar', false, 64), column('sha256', 'varchar', false, 64));
  tables.attachments.indexes.push(index('attachments_material_key_unique', 'unique', ['materialId', 'key']), index('attachments_material_list', 'key', ['materialId', 'sortOrder']));
  tables.bundles.columns.push(...['materialId', 'attachmentsRevision', 'fileId', 'sha256'].map((key) => column(key, 'varchar', true, 64)), column('fileName', 'varchar', true, 255), column('mimeType', 'varchar', true, 128), column('sourceCommit', 'varchar', false, 40), ...['sizeBytes', 'sourceTotalBytes', 'attachmentCount'].map((key) => ({ ...column(key, 'integer', true), min: 1, max: key === 'attachmentCount' ? 10 : 30000000 })));
  tables.bundles.indexes.push(index('bundles_material_unique', 'unique', ['materialId']));
  const buckets = Object.fromEntries([
    ['markdown-files', 262144, ['md']], ['media-files', 5242880, ['png', 'jpg', 'jpeg']],
    ['source-files', 10485760, ['pdf', 'pptx', 'xlsx', 'docx', 'ipynb', 'py', 'zip', '7z', 'gz', 'tar', 'rar']],
    ['zip-files', 30000000, ['zip']],
  ].map(([id, maximumFileSize, allowedFileExtensions]) => [id, { $id: id, enabled: true, fileSecurity: true, $permissions: [], maximumFileSize, allowedFileExtensions, compression: 'none', encryption: true, antivirus: true, transformations: false }]));
  return { tables, buckets };
}

export function fakeServices(resources = resourceFixture()) {
  const state = { resources, tables: Object.fromEntries(Object.keys(resources.tables).map((id) => [id, new Map()])), files: new Map(), events: [], stage: '', fault: null };
  const event = (method, args) => { state.events.push({ method, stage: state.stage, ...args }); state.fault?.(method, args); };
  const missing = () => { throw Object.assign(Error('fake-only missing resource'), { code: 404 }); };
  const row = (tableId, rowId) => state.tables[tableId]?.get(rowId) ?? missing();
  const file = (bucketId, fileId) => state.files.get(`${bucketId}/${fileId}`) ?? missing();
  const publicOnly = (resource) => { if (!resource.$permissions.includes('read("any")')) missing(); return structuredClone(resource); };
  const getFile = ({ bucketId, fileId }) => { const value = file(bucketId, fileId); return { $id: fileId, bucketId, sizeOriginal: value.bytes.length, $permissions: [...value.$permissions] }; };
  const tables = {
    async getTable(args) { event('tables.getTable', args); assert.equal(args.databaseId, 'database'); return structuredClone(resources.tables[args.tableId]); },
    async listRows(args) {
      event('tables.listRows', args); assert.equal(args.total, false); assert.equal(args.ttl, 0);
      let rows = [...state.tables[args.tableId].values()]; let limit = 25;
      for (const query of args.queries.map(JSON.parse)) {
        if (query.method === 'equal') rows = rows.filter((item) => query.values.includes(item[query.attribute]));
        if (query.method === 'cursorAfter') rows = rows.slice(rows.findIndex((item) => item.$id === query.values[0]) + 1);
        if (query.method === 'limit') limit = query.values[0];
      }
      return { rows: structuredClone(rows.slice(0, limit)) };
    },
    async getRow(args) { event('tables.getRow', args); return structuredClone(row(args.tableId, args.rowId)); },
    async createRow(args) { event('tables.createRow', args); assert.ok(!state.tables[args.tableId].has(args.rowId)); const value = { $id: args.rowId, ...args.data, $permissions: args.permissions }; state.tables[args.tableId].set(args.rowId, value); return structuredClone(value); },
    async updateRow(args) { event('tables.updateRow', args); const value = row(args.tableId, args.rowId); Object.assign(value, args.data, { $permissions: args.permissions }); return structuredClone(value); },
    async deleteRow(args) { event('FORBIDDEN.tables.deleteRow', args); throw Error('Deletion is forbidden in protocol fixtures'); },
  };
  const storage = {
    async getBucket(args) { event('storage.getBucket', args); return structuredClone(resources.buckets[args.bucketId]); },
    async getFile(args) { event('storage.getFile', args); return getFile(args); },
    async getFileDownload(args) { event('storage.getFileDownload', args); return Buffer.from(file(args.bucketId, args.fileId).bytes); },
    async createFile(args) { event('storage.createFile', { bucketId: args.bucketId, fileId: args.fileId, permissions: args.permissions }); assert.ok(!state.files.has(`${args.bucketId}/${args.fileId}`)); state.files.set(`${args.bucketId}/${args.fileId}`, { bytes: Buffer.from(await args.file.slice(0, await args.file.size())), $permissions: [...args.permissions] }); return getFile(args); },
    async updateFile(args) { event('storage.updateFile', args); file(args.bucketId, args.fileId).$permissions = [...args.permissions]; return getFile(args); },
    async deleteFile(args) { event('FORBIDDEN.storage.deleteFile', args); throw Error('Deletion is forbidden in protocol fixtures'); },
  };
  const anonymousTables = {
    async getRow(args) { event('anonymousTables.getRow', args); return publicOnly(row(args.tableId, args.rowId)); },
    async createRow(args) { event('FORBIDDEN.anonymousTables.createRow', args); throw Error('Anonymous write probes are forbidden'); },
  };
  const anonymousStorage = {
    async getFileDownload(args) { event('anonymousStorage.getFileDownload', args); const value = file(args.bucketId, args.fileId); publicOnly(value); return Buffer.from(value.bytes); },
    async createFile(args) { event('FORBIDDEN.anonymousStorage.createFile', args); throw Error('Anonymous write probes are forbidden'); },
  };
  return { config: publicationConfig, state, tables, storage, anonymousTables, anonymousStorage };
}
