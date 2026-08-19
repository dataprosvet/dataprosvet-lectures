import fs from 'node:fs';
import { resolveCourseBranch } from './branch-policy.js';
import { formatError } from './logger.js';

try {
  const courseBranch = resolveCourseBranch({
    eventName: process.env.COURSE_EVENT_NAME || '',
    refName: process.env.COURSE_REF_NAME || '',
    headRef: process.env.COURSE_HEAD_REF || '',
    baseRef: process.env.COURSE_BASE_REF || '',
    headSha: process.env.COURSE_HEAD_SHA || '',
    baseSha: process.env.COURSE_BASE_SHA || '',
    root: process.env.COURSE_ROOT || process.cwd(),
  });
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `course_branch=${courseBranch}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({ stage: 'branch-policy', courseBranch })}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify(formatError(error))}\n`);
  process.exitCode = 1;
}
