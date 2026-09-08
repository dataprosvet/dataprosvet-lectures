import assert from 'node:assert/strict';
import test from 'node:test';
import { assertPublicationReadiness, assertResourceApproval, publicationResourceDigest, readPublicationReadiness } from '../src/publication-readiness.js';
import { assertWriterWorkflow, createSourceGuard } from '../src/source-guard.js';

const sourceCommit = 'a'.repeat(40);
const treeSha = 'b'.repeat(40);
const branch = 'courses/fixture-course';
const readiness = () => ({ enabled: true, protocol: 'attachments-v1', singleWriterConfirmed: true, auditDigest: 'c'.repeat(64), resourceDigest: 'd'.repeat(64), publisherTreeSha: treeSha, courseBranches: [branch] });
const env = () => ({ GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'dataprosvet/dataprosvet-lectures', GITHUB_EVENT_NAME: 'push', COURSE_BRANCH: branch, GITHUB_REF: `refs/heads/${branch}`, GITHUB_WORKFLOW_REF: `dataprosvet/dataprosvet-lectures/.github/workflows/publish-course.yml@refs/heads/${branch}`, COURSE_PUBLICATION_ROLLOUT: 'attachments-v1', GITHUB_SHA: sourceCommit, GITHUB_TOKEN: 'fixture-only-token' });
const workflow = `permissions:\n  contents: read\njobs:\n  deploy:\n    environment: appwrite\n    if: github.event_name == 'push' && needs.validate.outputs.course_branch == github.ref_name && vars.COURSE_PUBLICATION_ROLLOUT == 'attachments-v1'\n    concurrency:\n      group: course-\${{ needs.validate.outputs.course_branch }}\n      cancel-in-progress: false\n`;
function fakeGithub(overrides = {}) {
  const calls = [];
  const ref = { ref: `refs/heads/${branch}`, object: { type: 'commit', sha: sourceCommit } };
  const payloads = {
    'matching-refs/heads/courses/': [ref],
    [`commits/${sourceCommit}`]: { tree: { sha: 'e'.repeat(40) } },
    [`trees/${'e'.repeat(40)}`]: { truncated: false, tree: [{ path: '.github', type: 'tree', sha: treeSha }] },
    [`ref/heads/${branch}`]: ref,
    ...overrides,
  };
  return {
    calls,
    async fetchImpl(url, options) {
      assert.equal(options.method, 'GET'); assert.equal(options.redirect, 'error');
      assert.equal(new URL(url).origin, 'https://api.github.com');
      assert.equal(options.headers.Authorization, 'Bearer fixture-only-token');
      const suffix = url.split('/git/')[1]; calls.push(suffix);
      if (!Object.hasOwn(payloads, suffix)) throw Error('Unexpected fake-only request');
      const payload = payloads[suffix];
      if (payload instanceof Error) throw payload;
      return { status: 200, headers: new Headers(), text: async () => JSON.stringify(payload) };
    },
  };
}
const guardOptions = (fake, changes = {}) => ({ root: '/not-read-in-fixture', courseSlug: 'fixture-course', env: env(), readiness: readiness(), readHead: async () => sourceCommit, readDirty: async () => '', readWorkflow: async () => workflow, fetchImpl: fake.fetchImpl, ...changes });

test('readiness is default-denied and every required approval is explicit', () => {
  assert.deepEqual(readPublicationReadiness({}), { enabled: false });
  assert.throws(() => assertPublicationReadiness(readPublicationReadiness({}), 'fixture-course'), (error) => error.code === 'PUBLICATION_READINESS_REQUIRED');
  assert.equal(assertPublicationReadiness(readiness(), 'fixture-course').enabled, true);
  for (const key of ['enabled', 'protocol', 'singleWriterConfirmed', 'auditDigest', 'resourceDigest', 'publisherTreeSha', 'courseBranches']) {
    const candidate = readiness(); delete candidate[key];
    assert.throws(() => assertPublicationReadiness(candidate, 'fixture-course'), (error) => error.code === 'PUBLICATION_READINESS_REQUIRED');
  }
  for (const changes of [{ enabled: 'true' }, { singleWriterConfirmed: 'true' }, { auditDigest: 'bad' }, { resourceDigest: 'bad' }, { publisherTreeSha: 'bad' }, { courseBranches: [] }, { courseBranches: [branch, branch] }, { courseBranches: ['courses/other'] }, { courseBranches: ['courses/../other'] }]) assert.throws(() => assertPublicationReadiness({ ...readiness(), ...changes }, 'fixture-course'), (error) => error.code === 'PUBLICATION_READINESS_REQUIRED');
  for (const source of ['{', 'x'.repeat(16385)]) assert.throws(() => readPublicationReadiness({ COURSE_PUBLICATION_READINESS: source }), (error) => error.code === 'PUBLICATION_READINESS_REQUIRED');
});

test('resource evidence binds exact public IDs and effective limits, never API keys', () => {
  const config = { APPWRITE_ENDPOINT: 'https://example.invalid/v1', APPWRITE_PROJECT_ID: 'project', APPWRITE_DATABASE_ID: 'database', APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID: 'bundle-table', APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID: 'bundle-bucket', COURSE_ATTACHMENT_MAX_BYTES: 10485760 };
  const approved = { ...readiness(), resourceDigest: publicationResourceDigest(config) };
  assert.doesNotThrow(() => assertResourceApproval(approved, config));
  assert.equal(publicationResourceDigest(config), publicationResourceDigest({ ...config, APPWRITE_API_KEY: 'fixture-value-not-an-api-key' }));
  for (const changed of [{ APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID: 'other' }, { APPWRITE_PROJECT_ID: 'other' }, { COURSE_ATTACHMENT_MAX_BYTES: 1 }]) assert.throws(() => assertResourceApproval(approved, { ...config, ...changed }), (error) => error.code === 'PUBLICATION_READINESS_REQUIRED');
});

test('source guard uses only fake GETs and detects branch advance on a later fence', async () => {
  const fake = fakeGithub(); const guard = await createSourceGuard(guardOptions(fake));
  await guard.assertCurrent('after-course-lock'); await guard.assertCurrent('before-revoke');
  assert.equal(guard.sourceCommit, sourceCommit);
  assert.deepEqual(fake.calls, ['matching-refs/heads/courses/', `commits/${sourceCommit}`, `trees/${'e'.repeat(40)}`, `ref/heads/${branch}`, `ref/heads/${branch}`]);
  const stale = fakeGithub({ [`ref/heads/${branch}`]: { ref: `refs/heads/${branch}`, object: { type: 'commit', sha: 'f'.repeat(40) } } });
  const staleGuard = await createSourceGuard(guardOptions(stale));
  await assert.rejects(() => staleGuard.assertCurrent('before-promote'), (error) => error.code === 'STALE_PUBLICATION_SOURCE');
});

test('unapproved entrypoints, wrong checkout and missing concurrency fail before any network read', async () => {
  for (const changes of [{ GITHUB_ACTIONS: 'false' }, { GITHUB_EVENT_NAME: 'workflow_dispatch' }, { GITHUB_REPOSITORY: 'other/repo' }, { GITHUB_REF: 'refs/heads/master' }, { GITHUB_WORKFLOW_REF: 'other-workflow' }, { COURSE_PUBLICATION_ROLLOUT: '' }, { GITHUB_SHA: 'bad' }, { GITHUB_TOKEN: '' }]) {
    const fake = fakeGithub();
    await assert.rejects(() => createSourceGuard(guardOptions(fake, { env: { ...env(), ...changes } })), (error) => error.code === 'WRITER_POLICY_MISMATCH');
    assert.equal(fake.calls.length, 0);
  }
  const fake = fakeGithub();
  await assert.rejects(() => createSourceGuard(guardOptions(fake, { readHead: async () => 'f'.repeat(40) })), (error) => error.code === 'STALE_PUBLICATION_SOURCE');
  assert.equal(fake.calls.length, 0);
  await assert.rejects(() => createSourceGuard(guardOptions(fake, { readDirty: async () => ' M course.yaml\n' })), (error) => error.code === 'STALE_PUBLICATION_SOURCE');
  await assert.rejects(() => createSourceGuard(guardOptions(fake, { courseSlug: 'another-course' })), (error) => error.code === 'WRITER_POLICY_MISMATCH');
  assert.equal(fake.calls.length, 0);
  for (const bad of [workflow.replace('cancel-in-progress: false', 'cancel-in-progress: true'), workflow.replace('environment: appwrite', 'environment: production'), workflow.replace('group: course-', 'group: other-'), workflow.replace('vars.COURSE_PUBLICATION_ROLLOUT', 'vars.WRONG'), workflow.replace('if: ', 'if: always() || ')]) assert.throws(() => assertWriterWorkflow(bad), (error) => error.code === 'WRITER_POLICY_MISMATCH');
});

test('incomplete known-writer inventory, old baseline and denied reads fail closed', async () => {
  for (const overrides of [
    { 'matching-refs/heads/courses/': [] },
    { 'matching-refs/heads/courses/': [{ ref: 'refs/heads/courses/other', object: { type: 'commit', sha: sourceCommit } }] },
    { 'matching-refs/heads/courses/': [{ ref: `refs/tags//${branch}`, object: { type: 'commit', sha: sourceCommit } }] },
    { [`commits/${sourceCommit}`]: { tree: {} } },
    { [`trees/${'e'.repeat(40)}`]: { truncated: true, tree: [] } },
    { [`trees/${'e'.repeat(40)}`]: { truncated: false, tree: [{ path: '.github', type: 'tree', sha: 'f'.repeat(40) }] } },
    { 'matching-refs/heads/courses/': Error('provider response must not escape') },
  ]) {
    const fake = fakeGithub(overrides); const guard = await createSourceGuard(guardOptions(fake));
    await assert.rejects(() => guard.assertCurrent(), (error) => { assert.ok(['WRITER_POLICY_INCONCLUSIVE', 'WRITER_POLICY_MISMATCH'].includes(error.code)); assert.doesNotMatch(error.message, /provider response/); return true; });
  }
  for (const status of [401, 403, 404, 500]) {
    const guard = await createSourceGuard(guardOptions(fakeGithub(), { fetchImpl: async () => ({ status, headers: new Headers() }) }));
    await assert.rejects(() => guard.assertCurrent(), (error) => error.code === 'WRITER_POLICY_INCONCLUSIVE');
  }
});
