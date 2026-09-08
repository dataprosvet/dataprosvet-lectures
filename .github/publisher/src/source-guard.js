import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import YAML from 'yaml';
import { fail, PublisherError } from './errors.js';
import { CANONICAL_REPOSITORY, PUBLICATION_PROTOCOL, WRITER_WORKFLOW } from './publication-readiness.js';

const exec = promisify(execFile);
const shaPattern = /^[a-f0-9]{40}$/;
export const WRITER_JOB_CONDITION = "github.event_name == 'push' && needs.validate.outputs.course_branch == github.ref_name && vars.COURSE_PUBLICATION_ROLLOUT == 'attachments-v1'";

export function assertWriterWorkflow(source) {
  const workflow = YAML.parse(source);
  const job = workflow?.jobs?.deploy;
  if (workflow?.permissions?.contents !== 'read' || job?.environment !== 'appwrite' || job?.concurrency?.group !== 'course-${{ needs.validate.outputs.course_branch }}' || job?.concurrency?.['cancel-in-progress'] !== false || job?.if !== WRITER_JOB_CONDITION) fail('WRITER_POLICY_MISMATCH', 'Publisher workflow does not enforce the reviewed environment, rollout and course concurrency policy');
}

export async function createSourceGuard({ root, readiness, courseSlug, env = process.env, fetchImpl = fetch, readHead = async () => (await exec('git', ['rev-parse', 'HEAD'], { cwd: root })).stdout.trim(), readDirty = async () => (await exec('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: root })).stdout, readWorkflow = () => fs.readFile(path.join(root, WRITER_WORKFLOW), 'utf8') }) {
  const branch = env.COURSE_BRANCH;
  if (env.GITHUB_ACTIONS !== 'true' || env.GITHUB_REPOSITORY !== CANONICAL_REPOSITORY || env.GITHUB_EVENT_NAME !== 'push' || branch !== `courses/${courseSlug}` || !readiness.courseBranches.includes(branch) || env.GITHUB_REF !== `refs/heads/${branch}` || env.GITHUB_WORKFLOW_REF !== `${CANONICAL_REPOSITORY}/${WRITER_WORKFLOW}@refs/heads/${branch}` || env.COURSE_PUBLICATION_ROLLOUT !== PUBLICATION_PROTOCOL || !shaPattern.test(env.GITHUB_SHA) || !env.GITHUB_TOKEN) fail('WRITER_POLICY_MISMATCH', 'Only the approved serialized course workflow may publish');
  const sourceCommit = env.GITHUB_SHA;
  if (await readHead() !== sourceCommit) fail('STALE_PUBLICATION_SOURCE', 'Checked-out source differs from the authorized workflow revision');
  if (await readDirty() !== '') fail('STALE_PUBLICATION_SOURCE', 'Tracked source differs from the checked-out workflow revision');
  assertWriterWorkflow(await readWorkflow());
  const read = async (suffix) => {
    try {
      const response = await fetchImpl(`https://api.github.com/repos/${CANONICAL_REPOSITORY}/git/${suffix}`, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(15000), headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' } });
      if (response.status !== 200 || response.headers.get('link')) fail('WRITER_POLICY_INCONCLUSIVE', 'Unable to verify complete publisher source inventory');
      const source = await response.text();
      if (source.length > 2 * 1024 * 1024) fail('WRITER_POLICY_INCONCLUSIVE', 'Publisher source inventory exceeds its read budget');
      return JSON.parse(source);
    } catch (error) {
      if (error instanceof PublisherError) throw error;
      fail('WRITER_POLICY_INCONCLUSIVE', 'Unable to verify publisher source state');
    }
  };
  let inventoryChecked = false;
  return Object.freeze({
    sourceCommit,
    courseSlug,
    async assertCurrent() {
      if (!inventoryChecked) {
        const refs = await read('matching-refs/heads/courses/');
        if (!Array.isArray(refs) || refs.length !== readiness.courseBranches.length || refs.some((ref) => typeof ref?.ref !== 'string' || !ref.ref.startsWith('refs/heads/') || !readiness.courseBranches.includes(ref.ref.slice('refs/heads/'.length)) || ref.object?.type !== 'commit' || !shaPattern.test(ref.object?.sha)) || new Set(refs.map((ref) => ref.ref)).size !== refs.length) fail('WRITER_POLICY_MISMATCH', 'Known course branches differ from reviewed writer inventory');
        for (const ref of refs) {
          const commit = await read(`commits/${ref.object.sha}`);
          if (!shaPattern.test(commit.tree?.sha)) fail('WRITER_POLICY_INCONCLUSIVE', 'Invalid publisher commit tree');
          const tree = await read(`trees/${commit.tree.sha}`);
          if (tree.truncated !== false || !Array.isArray(tree.tree) || tree.tree.filter((entry) => entry.path === '.github' && entry.type === 'tree' && entry.sha === readiness.publisherTreeSha).length !== 1) fail('WRITER_POLICY_MISMATCH', 'A known course branch still has a different publisher baseline');
        }
        inventoryChecked = true;
      }
      const ref = await read(`ref/heads/${branch}`);
      if (ref.ref !== `refs/heads/${branch}` || ref.object?.type !== 'commit' || ref.object.sha !== sourceCommit) fail('STALE_PUBLICATION_SOURCE', 'Course branch advanced; this run must not revoke or promote content');
    },
  });
}
