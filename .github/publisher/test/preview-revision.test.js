import assert from 'node:assert/strict';
import test from 'node:test';
import { derivePreviewRevision } from '../src/preview-revision.js';

const input = { sourceCommit: 'a'.repeat(40), planDigest: 'b'.repeat(64), runId: '123', runAttempt: '2' };

test('preview revision is deterministic and identifies one workflow attempt', () => {
  assert.equal(derivePreviewRevision(input), derivePreviewRevision(input));
  assert.notEqual(derivePreviewRevision(input), derivePreviewRevision({ ...input, runAttempt: '3' }));
  assert.notEqual(derivePreviewRevision(input), derivePreviewRevision({ ...input, planDigest: 'c'.repeat(64) }));
});

test('preview revision rejects ambiguous inputs', () => {
  for (const changes of [{ sourceCommit: 'bad' }, { planDigest: 'bad' }, { runId: '0' }, { runAttempt: '' }]) {
    assert.throws(() => derivePreviewRevision({ ...input, ...changes }), (error) => error.code === 'PREVIEW_REVISION_INVALID');
  }
});
