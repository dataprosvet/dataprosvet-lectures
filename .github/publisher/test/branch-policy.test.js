import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { resolveCourseBranch } from '../src/branch-policy.js';

function git(root, ...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

async function repository() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'course-branch-policy-'));
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'ci@example.test');
  git(root, 'config', 'user.name', 'CI Test');
  await writeFile(path.join(root, 'README.md'), 'baseline\n');
  git(root, 'add', 'README.md'); git(root, 'commit', '-qm', 'baseline');
  return root;
}

async function commit(root, file, content, message) {
  await writeFile(path.join(root, file), content);
  git(root, 'add', file); git(root, 'commit', '-qm', message);
  return git(root, 'rev-parse', 'HEAD');
}

function pullRequest(root, headSha, baseSha, overrides = {}) {
  return resolveCourseBranch({
    eventName: 'pull_request', root, headSha, baseSha,
    headRef: 'course/probability-theory/lecture-fixes',
    baseRef: 'courses/probability-theory',
    ...overrides,
  });
}

test('push policy accepts only an exact permanent course branch', () => {
  assert.equal(resolveCourseBranch({ eventName: 'push', refName: 'courses/probability-theory' }), 'courses/probability-theory');
  for (const refName of ['courses/probability-theory/draft', 'course/probability-theory/draft', 'courses/Probability-Theory', 'master']) {
    assert.throws(() => resolveCourseBranch({ eventName: 'push', refName }), (error) => error.code === 'COURSE_BRANCH_INVALID');
  }
});

test('pull request policy rejects malformed, mismatched, and incomplete inputs before lineage', () => {
  const sha = 'a'.repeat(40);
  assert.throws(() => pullRequest('.', sha, sha, { headRef: 'zasukhin-teorver' }), (error) => error.code === 'CONTRIBUTION_BRANCH_INVALID');
  assert.throws(() => pullRequest('.', sha, sha, { headRef: 'course/linear-algebra/topic' }), (error) => error.code === 'COURSE_TARGET_MISMATCH');
  assert.throws(() => pullRequest('.', sha, sha, { headRef: 'course/probability-theory/topic/more' }), (error) => error.code === 'CONTRIBUTION_BRANCH_INVALID');
  assert.throws(() => pullRequest('.', '', sha), (error) => error.code === 'COURSE_REVISION_INVALID');
  assert.throws(() => resolveCourseBranch({ eventName: 'workflow_dispatch' }), (error) => error.code === 'COURSE_EVENT_INVALID');
});

test('lineage remains valid when the target advances after branching', async () => {
  const root = await repository();
  git(root, 'switch', '-qc', 'courses/probability-theory');
  await commit(root, 'course.yaml', 'slug: probability-theory\n', 'course');
  git(root, 'switch', '-qc', 'course/probability-theory/lecture-fixes');
  const headSha = await commit(root, 'lecture.md', '# Lecture\n', 'lecture');
  git(root, 'switch', '-q', 'courses/probability-theory');
  const baseSha = await commit(root, 'notice.md', 'target advanced\n', 'advance target');
  assert.equal(pullRequest(root, headSha, baseSha), 'courses/probability-theory');
});

test('lineage rejects a matching name created before the course existed', async () => {
  const root = await repository(); const common = git(root, 'rev-parse', 'HEAD');
  git(root, 'switch', '-qc', 'course/probability-theory/lecture-fixes', common);
  const headSha = await commit(root, 'lecture.md', '# Lecture\n', 'lecture');
  git(root, 'switch', '-qc', 'courses/probability-theory', common);
  const baseSha = await commit(root, 'course.yaml', 'slug: probability-theory\n', 'course');
  assert.throws(() => pullRequest(root, headSha, baseSha), (error) => error.code === 'COURSE_LINEAGE_INVALID');
});

test('lineage rejects another course and malformed historical manifests', async () => {
  for (const manifest of ['slug: linear-algebra\n', ': invalid: [']) {
    const root = await repository();
    git(root, 'switch', '-qc', 'courses/probability-theory');
    await commit(root, 'course.yaml', manifest, 'course');
    git(root, 'switch', '-qc', 'course/probability-theory/lecture-fixes');
    const headSha = await commit(root, 'lecture.md', '# Lecture\n', 'lecture');
    git(root, 'switch', '-q', 'courses/probability-theory');
    const baseSha = await commit(root, 'notice.md', 'target\n', 'target');
    assert.throws(() => pullRequest(root, headSha, baseSha), (error) => error.code === 'COURSE_LINEAGE_INVALID');
  }
});

test('lineage accepts a contribution after it incorporates the intended target', async () => {
  const root = await repository(); const common = git(root, 'rev-parse', 'HEAD');
  git(root, 'switch', '-qc', 'course/probability-theory/lecture-fixes', common);
  await commit(root, 'lecture.md', '# Lecture\n', 'lecture');
  git(root, 'switch', '-qc', 'courses/probability-theory', common);
  const baseSha = await commit(root, 'course.yaml', 'slug: probability-theory\n', 'course');
  git(root, 'switch', '-q', 'course/probability-theory/lecture-fixes');
  git(root, 'merge', '-qm', 'incorporate course', 'courses/probability-theory');
  const headSha = git(root, 'rev-parse', 'HEAD');
  assert.equal(pullRequest(root, headSha, baseSha), 'courses/probability-theory');
});

test('lineage fails closed when required Git history is unavailable', async () => {
  const root = await repository();
  assert.throws(() => pullRequest(root, 'a'.repeat(40), 'b'.repeat(40)), (error) => error.code === 'COURSE_LINEAGE_INVALID');
});
