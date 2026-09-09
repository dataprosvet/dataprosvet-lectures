import { fail } from './errors.js';
import { DEFAULT_MAX_ATTACHMENT_BYTES } from './constants.js';

const REQUIRED_PUBLIC = Object.freeze([
  'APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_DATABASE_ID',
  'APPWRITE_COURSES_TABLE_ID', 'APPWRITE_MATERIALS_TABLE_ID', 'APPWRITE_ASSETS_TABLE_ID',
  'APPWRITE_MARKDOWN_BUCKET_ID', 'APPWRITE_MEDIA_BUCKET_ID',
  'APPWRITE_ATTACHMENTS_TABLE_ID', 'APPWRITE_ATTACHMENTS_BUCKET_ID',
]);

function read(name, env, required = true, maxLength = 255) {
  const value = env[name];
  if (required && (typeof value !== 'string' || !value || value.length > maxLength || /\s/.test(value))) fail('CONFIG_INVALID', `Invalid ${name}`);
  return value;
}

export function parseAttachmentLimit(value) {
  if (value === undefined || value === null || value === '') return DEFAULT_MAX_ATTACHMENT_BYTES;
  if ((typeof value !== 'string' || !/^[0-9]+$/.test(value)) && typeof value !== 'number') fail('CONFIG_INVALID', 'Invalid COURSE_ATTACHMENT_MAX_BYTES');
  const limit = Number(value);
  if (!Number.isSafeInteger(limit) || limit <= 0 || limit > DEFAULT_MAX_ATTACHMENT_BYTES) fail('CONFIG_INVALID', 'Invalid COURSE_ATTACHMENT_MAX_BYTES');
  return limit;
}

export function loadConfig({ env = process.env, requireKey = false, requireBundles = false } = {}) {
  const config = Object.fromEntries(REQUIRED_PUBLIC.map((name) => [name, read(name, env)]));
  if (requireBundles) {
    for (const key of ['APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID', 'APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID']) config[key] = read(key, env);
    for (const [key, value] of Object.entries(config)) if (key !== 'APPWRITE_ENDPOINT' && !/^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(value)) fail('CONFIG_INVALID', `Invalid ${key}`);
    let endpoint; try { endpoint = new URL(config.APPWRITE_ENDPOINT); } catch { fail('CONFIG_INVALID', 'Invalid APPWRITE_ENDPOINT'); }
    if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || !endpoint.pathname.endsWith('/v1')) fail('CONFIG_INVALID', 'Invalid APPWRITE_ENDPOINT');
    for (const suffix of ['_TABLE_ID', '_BUCKET_ID']) {
      const values = Object.entries(config).filter(([key]) => key.endsWith(suffix)).map(([, value]) => value);
      if (new Set(values).size !== values.length) fail('CONFIG_INVALID', 'Publication resources must have distinct identities');
    }
  }
  config.APPWRITE_API_KEY = read('APPWRITE_API_KEY', env, requireKey, 4096);
  config.COURSE_ATTACHMENT_MAX_BYTES = parseAttachmentLimit(env.COURSE_ATTACHMENT_MAX_BYTES);
  if (config.APPWRITE_API_KEY && config.APPWRITE_API_KEY.length < 20) fail('CONFIG_INVALID', 'Invalid APPWRITE_API_KEY');
  return Object.freeze(config);
}
