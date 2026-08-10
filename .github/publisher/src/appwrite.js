import { Client, ID, Permission, Query, Role, Storage, TablesDB } from 'node-appwrite';
import { InputFile } from 'node-appwrite/dist/inputFile.js';
import { loadConfig } from './config.js';
import { fail } from './errors.js';

const privatePermissions = Object.freeze([]);
const publicRead = Object.freeze([Permission.read(Role.any())]);

export function permissions(publiclyReadable) { return publiclyReadable ? publicRead : privatePermissions; }

export function createAdapter({ env = process.env } = {}) {
  const config = loadConfig({ env, requireKey: true });
  const client = new Client().setEndpoint(config.APPWRITE_ENDPOINT).setProject(config.APPWRITE_PROJECT_ID).setKey(config.APPWRITE_API_KEY);
  const tables = new TablesDB(client); const storage = new Storage(client);
  const listOne = async (tableId, queries, label) => {
    const result = await tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId, queries, total: false });
    if (result.rows.length > 1) fail('APPWRITE_AMBIGUOUS', `Multiple ${label} rows match a stable key`);
    return result.rows[0] ?? null;
  };
  return Object.freeze({
    config,
    async findCourse(slug) { return listOne(config.APPWRITE_COURSES_TABLE_ID, [Query.equal('slug', slug)], 'course'); },
    async findMaterial(courseId, kind, slug) { return listOne(config.APPWRITE_MATERIALS_TABLE_ID, [Query.equal('courseId', courseId), Query.equal('kind', kind), Query.equal('slug', slug)], 'material'); },
    async listMaterials(courseId) { return (await tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_MATERIALS_TABLE_ID, queries: [Query.equal('courseId', courseId)] })).rows; },
    async findAsset(materialId, key) { return listOne(config.APPWRITE_ASSETS_TABLE_ID, [Query.equal('materialId', materialId), Query.equal('key', key)], 'asset'); },
    async listAssets(materialId) { return (await tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_ASSETS_TABLE_ID, queries: [Query.equal('materialId', materialId)] })).rows; },
    async getFile(bucketId, fileId) { try { return await storage.getFile({ bucketId, fileId }); } catch { return null; } },
    async putFile(bucketId, fileId, bytes, name, readable) {
      const existing = await this.getFile(bucketId, fileId);
      if (existing) {
        if (existing.name !== name || existing.sizeOriginal !== bytes.length) fail('FILE_ID_COLLISION', 'Existing content-addressed file metadata differs');
        return existing;
      }
      return storage.createFile({ bucketId, fileId: fileId || ID.unique(), file: InputFile.fromBuffer(bytes, name), permissions: permissions(readable) });
    },
    async setFilePermissions(bucketId, fileId, readable) { return storage.updateFile({ bucketId, fileId, permissions: permissions(readable) }); },
    async upsertRow(tableId, rowId, data, readable) {
      const args = { databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId, data, permissions: permissions(readable) };
      return rowId ? tables.updateRow(args) : tables.createRow({ ...args, rowId: ID.unique() });
    },
    async archiveRow(tableId, row) { return tables.updateRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId: row.$id, data: { lifecycleStatus: 'archived', availability: 'inDevelopment' }, permissions: privatePermissions }); },
    async removeRow(tableId, rowId) { return tables.deleteRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId }); },
    async verifyAnonymous() { return true; },
  });
}
