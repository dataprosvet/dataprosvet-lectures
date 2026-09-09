import { fail } from './errors.js';
import { canonicalJson, checksum } from './models.js';

export const PUBLICATION_PROTOCOL = 'attachments-v1';
export const CANONICAL_REPOSITORY = 'dataprosvet/dataprosvet-lectures';
export const WRITER_WORKFLOW = '.github/workflows/publish-course.yml';
export const REUSABLE_WRITER_WORKFLOW = '.github/workflows/reusable-publish-course.yml';
const digest = /^[a-f0-9]{64}$/;
const sha = /^[a-f0-9]{40}$/;
const branch = /^courses\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const resourceKeys = ['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_DATABASE_ID', 'APPWRITE_COURSES_TABLE_ID', 'APPWRITE_MATERIALS_TABLE_ID', 'APPWRITE_ASSETS_TABLE_ID', 'APPWRITE_MARKDOWN_BUCKET_ID', 'APPWRITE_MEDIA_BUCKET_ID', 'APPWRITE_ATTACHMENTS_TABLE_ID', 'APPWRITE_ATTACHMENTS_BUCKET_ID', 'APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID', 'APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID'];

export function readPublicationReadiness(env = process.env) {
  const source = env.COURSE_PUBLICATION_READINESS;
  if (!source) return Object.freeze({ enabled: false });
  if (typeof source !== 'string' || source.length > 16384) fail('PUBLICATION_READINESS_REQUIRED', 'Invalid publication readiness evidence');
  try { return JSON.parse(source); } catch { fail('PUBLICATION_READINESS_REQUIRED', 'Invalid publication readiness evidence'); }
}

export function assertPublicationReadiness(readiness, courseSlug) {
  if (!readiness || readiness.enabled !== true || readiness.protocol !== PUBLICATION_PROTOCOL || readiness.singleWriterConfirmed !== true || !digest.test(readiness.auditDigest) || !digest.test(readiness.resourceDigest) || !sha.test(readiness.publisherTreeSha) || !sha.test(readiness.publisherCommitSha) || !sha.test(readiness.writerWorkflowSha) || !Array.isArray(readiness.courseBranches) || readiness.courseBranches.length === 0 || readiness.courseBranches.length > 100 || readiness.courseBranches.some((item) => typeof item !== 'string' || !branch.test(item)) || new Set(readiness.courseBranches).size !== readiness.courseBranches.length || !readiness.courseBranches.includes(`courses/${courseSlug}`)) {
    fail('PUBLICATION_READINESS_REQUIRED', 'Publication remains disabled until reviewed audit, resource, baseline and single-writer approvals are supplied');
  }
  return Object.freeze({ ...readiness, courseBranches: Object.freeze([...readiness.courseBranches].sort()) });
}

export function publicationResourceDigest(config) {
  return checksum(canonicalJson({ protocol: PUBLICATION_PROTOCOL, resources: Object.fromEntries(resourceKeys.map((key) => [key, config[key]])), sourceLimit: config.COURSE_ATTACHMENT_MAX_BYTES, bundleLimit: 30_000_000 }));
}

export function assertResourceApproval(readiness, config) {
  if (readiness.resourceDigest !== publicationResourceDigest(config)) fail('PUBLICATION_READINESS_REQUIRED', 'Configured resource identities or limits differ from reviewed readiness evidence');
}
