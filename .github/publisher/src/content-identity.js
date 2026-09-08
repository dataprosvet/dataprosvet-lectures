import { canonicalJson, checksum, stableId } from './models.js';
import { fail } from './errors.js';

// Per-course serialization cannot safely revoke globally deduplicated objects.
// Scope every revocable Markdown/image identity without changing source bytes,
// manifest declarations, asset keys or the attachment-revision format.
export function materialContentFileId(materialKey, role, sha256) {
  if (typeof materialKey !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*\/(?:lecture|seminar|homework)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(materialKey) || !['markdown', 'brief-markdown', 'asset'].includes(role) || !/^[a-f0-9]{64}$/.test(sha256)) fail('CONTENT_IDENTITY_INVALID', 'A material-scoped content identity is required');
  return stableId(role === 'asset' ? 'asset' : 'md', checksum(canonicalJson({ formatVersion: 1, materialKey, role, sha256 })));
}
