import { fail } from './errors.js';
import { ATTACHMENT_TYPES, DEFAULT_MAX_ATTACHMENT_BYTES, IMAGE_TYPES, LIMITS } from './constants.js';
import { canonicalJson } from './models.js';

function requireContract(valid, label) { if (!valid) fail('RESOURCE_CONTRACT_MISMATCH', `Read-only resource contract differs: ${label}`); }
const equal = (left, right) => canonicalJson(left) === canonicalJson(right);
function column(table, key, type, required, size) {
  const found = table.columns?.filter((item) => item.key === key);
  requireContract(Array.isArray(found) && found.length === 1, `column ${key}`);
  const item = found[0];
  requireContract((item.type === type || type === 'varchar' && item.type === 'string') && item.status === 'available' && item.required === required && item.array === false && item.default == null && (size === undefined || item.size === size), `column ${key}`);
  return item;
}
function index(table, key, type, keys, { noPrefix = false } = {}) {
  const found = table.indexes?.filter((item) => item.key === key);
  requireContract(Array.isArray(found) && found.length === 1, `index ${key}`);
  const item = found[0]; const orders = item.orders ?? keys.map(() => 'ASC');
  requireContract(item.type === type && item.status === 'available' && equal(item.columns ?? item.attributes, keys) && Array.isArray(orders) && equal(orders.map((value) => typeof value === 'string' ? value.toUpperCase() : value), keys.map(() => 'ASC')), `index ${key}`);
  if (noPrefix) requireContract(item.lengths === undefined || equal(item.lengths, keys.map(() => 0)) || equal(item.lengths, keys.map(() => null)), `index ${key} prefix`);
}

// Only GET operations. Never provision resources, change their limits, or test
// anonymous writes by creating/deleting probe objects during publication.
export async function verifyResourceContract({ config, tables, storage }) {
  const resources = {};
  for (const key of ['COURSES', 'MATERIALS', 'ASSETS', 'ATTACHMENTS', 'ATTACHMENT_BUNDLES']) {
    const id = config[`APPWRITE_${key}_TABLE_ID`];
    const table = await tables.getTable({ databaseId: config.APPWRITE_DATABASE_ID, tableId: id });
    requireContract(table?.$id === id && table.databaseId === config.APPWRITE_DATABASE_ID && table.enabled === true && table.rowSecurity === true && equal(table.$permissions, []), `${key} identity/security`);
    resources[key] = table;
  }
  column(resources.MATERIALS, 'briefContentFileId', 'varchar', false, 64);
  column(resources.MATERIALS, 'attachmentsRevision', 'varchar', false, 64);
  for (const [key, size] of [['materialId', 64], ['key', 128], ['title', 512], ['fileId', 64], ['fileName', 255], ['mimeType', 128]]) column(resources.ATTACHMENTS, key, 'varchar', true, size);
  column(resources.ATTACHMENTS, 'sizeBytes', 'bigint', true);
  column(resources.ATTACHMENTS, 'sortOrder', 'integer', true);
  for (const key of ['attachmentsRevision', 'sha256']) column(resources.ATTACHMENTS, key, 'varchar', false, 64);
  index(resources.ATTACHMENTS, 'attachments_material_key_unique', 'unique', ['materialId', 'key']);
  index(resources.ATTACHMENTS, 'attachments_material_list', 'key', ['materialId', 'sortOrder']);
  const bundles = resources.ATTACHMENT_BUNDLES;
  for (const key of ['materialId', 'attachmentsRevision', 'fileId', 'sha256']) column(bundles, key, 'varchar', true, 64);
  column(bundles, 'fileName', 'varchar', true, 255);
  column(bundles, 'mimeType', 'varchar', true, 128);
  column(bundles, 'sourceCommit', 'varchar', false, 40);
  for (const key of ['sizeBytes', 'sourceTotalBytes', 'attachmentCount']) {
    const item = column(bundles, key, 'integer', true);
    requireContract(item.min === 1 && item.max === (key === 'attachmentCount' ? LIMITS.maxAttachmentsPerMaterial : LIMITS.maxAttachmentBundleBytes), `bundle ${key} bounds`);
  }
  index(bundles, 'bundles_material_unique', 'unique', ['materialId'], { noPrefix: true });
  for (const [key, limit, extensions] of [
    ['MARKDOWN', LIMITS.maxMarkdownBytes, ['md']],
    ['MEDIA', LIMITS.maxImageBytes, Object.keys(IMAGE_TYPES).map((suffix) => suffix.slice(1))],
    ['ATTACHMENTS', DEFAULT_MAX_ATTACHMENT_BYTES, Object.keys(ATTACHMENT_TYPES).map((suffix) => suffix.slice(suffix.lastIndexOf('.') + 1))],
    ['ATTACHMENT_BUNDLES', LIMITS.maxAttachmentBundleBytes, ['zip']],
  ]) {
    const id = config[`APPWRITE_${key}_BUCKET_ID`];
    const bucket = await storage.getBucket({ bucketId: id });
    requireContract(bucket?.$id === id && bucket.enabled === true && bucket.fileSecurity === true && equal(bucket.$permissions, []), `${key} identity/security`);
    requireContract(bucket.maximumFileSize === limit && Array.isArray(bucket.allowedFileExtensions) && equal([...bucket.allowedFileExtensions].sort(), extensions.sort()), `${key} bounds/extensions`);
    if (key === 'ATTACHMENTS' || key === 'ATTACHMENT_BUNDLES') requireContract(bucket.compression === 'none' && bucket.encryption === true && bucket.antivirus === true && bucket.transformations === false, `${key} storage policy`);
  }
}
