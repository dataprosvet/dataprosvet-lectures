import { fail } from './errors.js';

const REQUIRED_PUBLIC = Object.freeze([
  'APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_DATABASE_ID',
  'APPWRITE_COURSES_TABLE_ID', 'APPWRITE_MATERIALS_TABLE_ID', 'APPWRITE_ASSETS_TABLE_ID',
  'APPWRITE_MARKDOWN_BUCKET_ID', 'APPWRITE_MEDIA_BUCKET_ID',
]);

function read(name, env, required = true) {
  const value = env[name];
  if (required && (!value || value.length > 255 || /\s/.test(value))) fail('CONFIG_INVALID', `Invalid ${name}`);
  return value;
}

export function loadConfig({ env = process.env, requireKey = false } = {}) {
  const config = Object.fromEntries(REQUIRED_PUBLIC.map((name) => [name, read(name, env)]));
  config.APPWRITE_API_KEY = read('APPWRITE_API_KEY', env, requireKey);
  if (config.APPWRITE_API_KEY && config.APPWRITE_API_KEY.length < 20) fail('CONFIG_INVALID', 'Invalid APPWRITE_API_KEY');
  return Object.freeze(config);
}
