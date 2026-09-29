import { fail } from './errors.js';

// The whole TEST instance is API-owned. Production Git publishing is unchanged.
export function assertGitPublicationTarget(config) {
  let endpoint;
  try { endpoint = new URL(config.APPWRITE_ENDPOINT); }
  catch { fail('CONFIG_INVALID', 'Invalid APPWRITE_ENDPOINT'); }
  if (endpoint.hostname.toLowerCase().replace(/\.$/, '') === 'test.appwrite.dataprosvet.ru') {
    fail('PUBLICATION_TARGET_FENCED', 'TEST Appwrite is owned by the publication API; Git publication is disabled');
  }
}
