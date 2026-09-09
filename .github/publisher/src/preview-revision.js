import { canonicalJson, checksum } from './models.js';
import { fail } from './errors.js';

const shaPattern = /^[a-f0-9]{40}$/;
const runNumberPattern = /^[1-9][0-9]{0,19}$/;

export function derivePreviewRevision({ sourceCommit, planDigest, runId, runAttempt }) {
  if (!shaPattern.test(sourceCommit) || !/^[a-f0-9]{64}$/.test(planDigest) || !runNumberPattern.test(runId) || !runNumberPattern.test(runAttempt)) {
    fail('PREVIEW_REVISION_INVALID', 'Preview revision inputs must identify one immutable GitHub Actions publication attempt');
  }
  return checksum(canonicalJson({ sourceCommit, planDigest, runId, runAttempt }));
}
