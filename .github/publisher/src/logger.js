import { PublisherError } from './errors.js';

function safe(value) {
  return String(value ?? '')
    .replaceAll(/(APPWRITE_API_KEY|gh[opsu]_[A-Za-z0-9_]+|[A-Za-z0-9]{20,})/g, '[redacted]')
    .slice(0, 500);
}

export function log(stage, message, fields = {}) {
  process.stdout.write(`${JSON.stringify({ stage, message: safe(message), ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, safe(value)])) })}\n`);
}

export function formatError(error) {
  if (error instanceof PublisherError) {
    return { code: error.code, message: safe(error.message), path: error.details.path ? safe(error.details.path) : undefined };
  }
  return { code: 'UNEXPECTED', message: 'Publisher failed; inspect the bounded workflow stage output.' };
}
