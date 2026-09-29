import { execFileSync } from 'node:child_process';
import YAML from 'yaml';
import { fail } from './errors.js';

const slugSource = '[a-z0-9]+(?:-[a-z0-9]+)*';
const courseBranchPattern = new RegExp(`^courses/(${slugSource})$`);
const contributionBranchPattern = new RegExp(`^course/(${slugSource})/(${slugSource})$`);
const shaPattern = /^[a-f0-9]{40}$/;

function courseSlug(branch) {
  const match = courseBranchPattern.exec(branch);
  if (!match) fail('COURSE_BRANCH_INVALID', 'Course branch must be named courses/<lowercase-kebab-slug>');
  return match[1];
}

function contributionCourseSlug(branch) {
  const match = contributionBranchPattern.exec(branch);
  if (!match) fail('CONTRIBUTION_BRANCH_INVALID', 'Contribution branch must be named course/<course-slug>/<lowercase-kebab-work-slug>');
  return match[1];
}

function revision(value, name) {
  if (!shaPattern.test(value)) fail('COURSE_REVISION_INVALID', `Pull request ${name} revision must be a full Git commit SHA`);
  return value;
}

function git(root, args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    fail('COURSE_LINEAGE_INVALID', 'Contribution history must contain a merge-base course manifest matching the target course');
  }
}

function isCurrentIndentationRepair({ root, head, base, mergeBase, source, expectedSlug }) {
  if (mergeBase !== base) return false;
  try {
    const document = YAML.parseDocument(source, { prettyErrors: false });
    if (!document.errors.length || document.errors.some((error) => error.code !== 'BAD_INDENT')) return false;
    if (!YAML.isMap(document.contents)) return false;
    const slugEntries = document.contents.items.filter((item) => YAML.isScalar(item.key) && item.key.value === 'slug');
    if (slugEntries.length !== 1 || document.get('slug') !== expectedSlug) return false;
    // A repair cannot establish a new course identity from malformed history.
    const parent = git(root, ['rev-parse', `${mergeBase}^1`]);
    const previous = YAML.parse(git(root, ['show', `${parent}:course.yaml`]), { prettyErrors: false });
    const repairedSource = git(root, ['show', `${head}:course.yaml`]);
    const repaired = YAML.parse(repairedSource, { prettyErrors: false });
    const historicalLines = source.split(/\r?\n/);
    const repairedLines = repairedSource.split(/\r?\n/);
    if (historicalLines.length !== repairedLines.length) return false;
    // Prove that indentation alone repairs the historical document. Other
    // candidate edits cannot hide a malformed value or ambiguous identity.
    const correctedSource = historicalLines.map((line, index) =>
      line.trimStart() === repairedLines[index].trimStart() ? repairedLines[index] : line).join('\n');
    const corrected = YAML.parse(correctedSource, { prettyErrors: false });
    return previous?.slug === expectedSlug && repaired?.slug === expectedSlug && corrected?.slug === expectedSlug;
  } catch {
    return false;
  }
}

export function verifyCourseLineage({ root, headSha, baseSha, expectedSlug }) {
  const head = revision(headSha, 'head');
  const base = revision(baseSha, 'base');
  const mergeBase = git(root, ['merge-base', head, base]);
  if (!shaPattern.test(mergeBase)) fail('COURSE_LINEAGE_INVALID', 'Contribution history must resolve to one Git merge base');
  const source = git(root, ['show', `${mergeBase}:course.yaml`]);
  let manifest;
  try {
    manifest = YAML.parse(source, { prettyErrors: false });
  } catch {
    if (isCurrentIndentationRepair({ root, head, base, mergeBase, source, expectedSlug })) return;
    fail('COURSE_LINEAGE_INVALID', 'Contribution merge-base course manifest must be valid YAML');
  }
  if (!manifest || typeof manifest !== 'object' || manifest.slug !== expectedSlug) {
    fail('COURSE_LINEAGE_INVALID', 'Contribution merge-base course manifest must match the target course');
  }
}

export function resolveCourseBranch({ eventName, refName = '', headRef = '', baseRef = '', headSha = '', baseSha = '', root = process.cwd() } = {}) {
  if (eventName === 'push') {
    courseSlug(refName);
    return refName;
  }
  if (eventName !== 'pull_request') fail('COURSE_EVENT_INVALID', 'Course branch policy supports only pull_request and push events');
  const expectedSlug = courseSlug(baseRef);
  const actualSlug = contributionCourseSlug(headRef);
  if (actualSlug !== expectedSlug) fail('COURSE_TARGET_MISMATCH', 'Contribution branch course slug must match the pull request target course');
  verifyCourseLineage({ root, headSha, baseSha, expectedSlug });
  return baseRef;
}
