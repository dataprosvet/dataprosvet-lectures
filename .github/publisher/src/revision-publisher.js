import { canonicalJson, checksum, effectivePublic } from './models.js';
import { fail, PublisherError } from './errors.js';
import { assertPublicationReadiness, assertResourceApproval } from './publication-readiness.js';
import { createSourceGuard } from './source-guard.js';
import { MATERIAL_KINDS } from './constants.js';

export function assertFields(actual, expected, label) {
  for (const [key, value] of Object.entries(expected)) if ((actual?.[key] ?? null) !== (value ?? null)) fail('PUBLICATION_STATE_MISMATCH', `${label}: field ${key} differs`);
}
export function assertPermissions(row, readable, label) {
  const expected = readable ? ['read("any")'] : [];
  if (!Array.isArray(row?.$permissions) || canonicalJson([...row.$permissions].sort()) !== canonicalJson(expected)) fail('PUBLICATION_STATE_MISMATCH', `${label}: permissions differ`);
}
const publishedAt = (value, previous) => value.lifecycleStatus === 'published' ? previous?.publishedAt ?? new Date().toISOString() : null;
const courseFields = (value, previous) => ({ slug: value.slug, title: value.title, description: value.description, lifecycleStatus: value.lifecycleStatus, availability: value.availability, sortOrder: value.sortOrder, publishedAt: publishedAt(value, previous) });
const materialFields = (courseId, value, previous, revision) => ({ courseId, kind: value.kind, slug: value.slug, title: value.title, summary: value.summary, contentFileId: value.content?.fileId ?? null, briefContentFileId: value.briefContent?.fileId ?? null, lifecycleStatus: value.lifecycleStatus, availability: value.availability, sortOrder: value.sortOrder, publishedAt: publishedAt(value, previous), attachmentsRevision: revision });
const assetFields = (materialId, value) => ({ materialId, key: value.key, fileId: value.fileId, alt: value.alt, mimeType: value.mimeType, width: value.width, height: value.height });
const attachmentFields = (materialId, value, revision) => ({ materialId, key: value.key, title: value.title, fileId: value.fileId, fileName: value.fileName, mimeType: value.mimeType, sizeBytes: value.sizeBytes, sortOrder: value.sortOrder, sha256: value.checksum, attachmentsRevision: revision });
const bundleFields = (materialId, value, sourceCommit) => ({ materialId, ...value, sourceCommit });
const identity = (file) => `${file.bucket}/${file.id}`;
function one(rows, predicate, label) { const found = rows.filter(predicate); if (found.length > 1) fail('PUBLICATION_STATE_MISMATCH', `Ambiguous ${label}`); return found[0]; }
function immutable(value) { if (value && typeof value === 'object') { Object.values(value).forEach(immutable); Object.freeze(value); } return value; }
const validId = (value) => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,35}$/.test(value);
const validKey = (value) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
function validPermissions(value) { return Array.isArray(value) && (value.length === 0 || value.length === 1 && value[0] === 'read("any")'); }

export function assertInventory(inventory) {
  const materialIds = new Set();
  for (const kind of ['materials', 'assets', 'attachments', 'bundles']) {
    const rows = inventory?.[kind];
    if (!Array.isArray(rows) || rows.length > 100000) fail('PUBLICATION_INVENTORY_INVALID', 'Complete publication inventory is required');
    const ids = new Set(); const keys = new Set();
    for (const row of rows) {
      if (!validId(row?.$id) || ids.has(row.$id) || !validPermissions(row.$permissions)) fail('PUBLICATION_INVENTORY_INVALID', 'Invalid inventory identity or permissions');
      ids.add(row.$id);
      if (kind === 'materials') {
        if (!validId(row.courseId) || !MATERIAL_KINDS.includes(row.kind) || !validKey(row.slug) || [row.contentFileId, row.briefContentFileId].some((id) => id != null && !validId(id))) fail('PUBLICATION_INVENTORY_INVALID', 'Invalid material ownership');
        materialIds.add(row.$id);
      } else if (!materialIds.has(row.materialId) || !validId(row.fileId) || kind !== 'bundles' && !validKey(row.key)) fail('PUBLICATION_INVENTORY_INVALID', 'Invalid resource ownership');
      const key = kind === 'materials' ? `${row.courseId}/${row.kind}/${row.slug}` : `${row.materialId}/${kind === 'bundles' ? 'bundle' : row.key}`;
      if (keys.has(key)) fail('PUBLICATION_INVENTORY_INVALID', 'Duplicate inventory mapping');
      keys.add(key);
    }
  }
}

function currentFileRefs(inventory, config) {
  const files = [];
  for (const material of inventory.materials) for (const id of [material.contentFileId, material.briefContentFileId].filter(Boolean)) files.push({ bucket: config.APPWRITE_MARKDOWN_BUCKET_ID, id, owner: material.$id });
  for (const [rows, bucket] of [[inventory.assets, config.APPWRITE_MEDIA_BUCKET_ID], [inventory.attachments, config.APPWRITE_ATTACHMENTS_BUCKET_ID], [inventory.bundles, config.APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID]]) for (const row of rows) files.push({ bucket, id: row.fileId, owner: row.materialId });
  return files;
}

export async function publishRevisionPlan(input, { adapter, adapterFactory, readiness, sourceGuard, env, root, prepareFiles, bundleOptions }) {
  readiness = assertPublicationReadiness(readiness, input?.course?.slug);
  const plan = immutable(structuredClone(input));
  const { digest, ...unsigned } = plan;
  if (plan.version !== 2 || checksum(canonicalJson(unsigned)) !== digest || plan.materials.some((material) => material.resourceKey !== `${plan.course.slug}/${material.kind}/${material.slug}` || material.publicRead !== effectivePublic(plan.course, material))) fail('PUBLICATION_PLAN_INVALID', 'Only a fresh complete validated revision plan may be published');
  let stage = 'prepare-local-files';
  try {
    const prepared = await prepareFiles(plan, root, bundleOptions);
    const guard = sourceGuard ?? await createSourceGuard({ root, readiness, courseSlug: plan.course.slug, env });
    if (!guard || guard.courseSlug !== plan.course.slug || !/^[a-f0-9]{40}$/.test(guard.sourceCommit) || typeof guard.assertCurrent !== 'function') fail('WRITER_POLICY_MISMATCH', 'A current course-bound source fence is required');
    stage = 'source-fence'; await guard.assertCurrent(stage);
    adapter ??= adapterFactory({ env, requireBundles: true });
    const config = adapter.config;
    assertResourceApproval(readiness, config);
    if (plan.maxAttachmentBytes !== config.COURSE_ATTACHMENT_MAX_BYTES) fail('PUBLICATION_PLAN_INVALID', 'Validated and configured attachment limits differ');
    stage = 'read-only-preflight'; await adapter.preflight(plan);
    const inventory = await adapter.inventory();
    assertInventory(inventory);
    const previousCourse = await adapter.findCourse(plan.course.slug);
    if (previousCourse && (!validId(previousCourse.$id) || previousCourse.slug !== plan.course.slug || !validPermissions(previousCourse.$permissions))) fail('PUBLICATION_INVENTORY_INVALID', 'Invalid course identity or permissions');
    const previousMaterials = previousCourse ? inventory.materials.filter((row) => row.courseId === previousCourse.$id) : [];
    const owners = new Map(); const oldRefs = currentFileRefs(inventory, config);
    const addOwner = (file) => { const key = identity(file); const set = owners.get(key) ?? new Set(); set.add(file.owner); owners.set(key, set); };
    oldRefs.forEach(addOwner);
    const files = []; const materialFiles = new Map();
    for (const material of plan.materials) {
      const previous = one(previousMaterials, (row) => row.kind === material.kind && row.slug === material.slug, material.resourceKey);
      const owner = previous?.$id ?? material.resourceKey;
      const ownFiles = [];
      const add = (bucket, id, bytes, name) => { const file = { bucket, id, bytes, name, owner, readable: material.publicRead, sizeBytes: bytes.length, sha256: checksum(bytes) }; files.push(file); ownFiles.push(file); addOwner(file); };
      for (const content of [material.content, material.briefContent].filter(Boolean)) add(config.APPWRITE_MARKDOWN_BUCKET_ID, content.fileId, prepared.get(`markdown:${content.path}`), content.path);
      for (const asset of material.assets) add(config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, prepared.get(`asset:${asset.file}`), asset.file);
      for (const attachment of material.attachments) add(config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId, prepared.get(`attachment:${attachment.file}`), attachment.fileName);
      if (material.bundle) add(config.APPWRITE_ATTACHMENT_BUNDLES_BUCKET_ID, material.bundle.fileId, prepared.get(`bundle:${material.resourceKey}`), material.bundle.fileName);
      materialFiles.set(material.resourceKey, ownFiles);
    }
    const affectedOwners = new Set(previousMaterials.map((row) => row.$id));
    const revoked = new Map([...oldRefs.filter((file) => affectedOwners.has(file.owner)), ...files].map((file) => [identity(file), file]));
    for (const file of revoked.values()) if (owners.get(identity(file))?.size !== 1) fail('PUBLICATION_OWNERSHIP_AMBIGUOUS', 'A file has multiple material owners; reviewed migration is required before any writes');
    const mutate = async (nextStage, action) => { stage = nextStage; await guard.assertCurrent(stage); return action(); };
    stage = 'upload-private-files';
    for (const file of files) {
      await mutate('upload-private-files', () => adapter.putFile(file.bucket, file.id, file.bytes, file.name, false));
      await adapter.verifyFile(file.bucket, file.id, file);
    }
    // Revoke every referenced object before hiding its course, including
    // omitted/archived material rows and public candidates left by a retry.
    for (const file of revoked.values()) {
      if (await adapter.getFile(file.bucket, file.id)) await mutate('revoke-files-before-hide', () => adapter.setFilePermissions(file.bucket, file.id, false));
      await adapter.expectAnonymousFile(file.bucket, file.id, false);
    }
    if (previousCourse) await mutate('hide-course', () => adapter.setRowPermissions(config.APPWRITE_COURSES_TABLE_ID, previousCourse.$id, false));
    for (const previous of previousMaterials) await mutate('hide-materials', () => adapter.setRowPermissions(config.APPWRITE_MATERIALS_TABLE_ID, previous.$id, false));
    for (const [rows, table] of [[inventory.assets, config.APPWRITE_ASSETS_TABLE_ID], [inventory.attachments, config.APPWRITE_ATTACHMENTS_TABLE_ID], [inventory.bundles, config.APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID]]) for (const row of rows.filter((item) => affectedOwners.has(item.materialId))) await mutate('hide-resource-rows', () => adapter.setRowPermissions(table, row.$id, false));
    const course = await mutate('stage-course', () => adapter.upsertRow(config.APPWRITE_COURSES_TABLE_ID, previousCourse?.$id, courseFields(plan.course, previousCourse), false));
    const staged = [];
    for (const material of plan.materials) {
      const previous = one(previousMaterials, (row) => row.kind === material.kind && row.slug === material.slug, material.resourceKey);
      const row = await mutate('stage-material', () => adapter.upsertRow(config.APPWRITE_MATERIALS_TABLE_ID, previous?.$id, materialFields(course.$id, material, previous, previous?.attachmentsRevision ?? null), false));
      const resourceRows = [];
      for (const [values, table, previousRows, fields] of [
        [material.assets, config.APPWRITE_ASSETS_TABLE_ID, inventory.assets, (value) => assetFields(row.$id, value)],
        [material.attachments, config.APPWRITE_ATTACHMENTS_TABLE_ID, inventory.attachments, (value) => attachmentFields(row.$id, value, material.attachmentsRevision)],
        [material.bundle ? [material.bundle] : [], config.APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID, inventory.bundles, (value) => bundleFields(row.$id, value, guard.sourceCommit)],
      ]) for (const value of values) {
        const previousResource = one(previousRows, (item) => item.materialId === row.$id && (table === config.APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID || item.key === value.key), 'resource mapping');
        const data = fields(value);
        const resource = await mutate('stage-resource-row', () => adapter.upsertRow(table, previousResource?.$id, data, false));
        resourceRows.push({ table, id: resource.$id, data });
      }
      staged.push({ material, previous, row, resourceRows });
    }
    const omitted = previousMaterials.filter((row) => !staged.some((item) => item.row.$id === row.$id));
    for (const row of omitted) await mutate('archive-omitted', () => adapter.archiveRow(config.APPWRITE_MATERIALS_TABLE_ID, row));
    const verifyRows = async (item, final) => {
      const label = item.material.resourceKey;
      const metadataReadable = final && plan.course.lifecycleStatus === 'published' && item.material.lifecycleStatus === 'published';
      const row = await adapter.getRow(config.APPWRITE_MATERIALS_TABLE_ID, item.row.$id);
      assertFields(row, materialFields(course.$id, item.material, item.row, final ? item.material.attachmentsRevision : item.previous?.attachmentsRevision ?? null), label);
      assertPermissions(row, metadataReadable, label);
      for (const resource of item.resourceRows) {
        const actual = await adapter.getRow(resource.table, resource.id);
        assertFields(actual, resource.data, label); assertPermissions(actual, final && item.material.publicRead, label);
        if (final) await adapter.expectAnonymousRow(resource.table, resource.id, item.material.publicRead, resource.data);
      }
      for (const [rows, table] of [[await adapter.listAssets(item.row.$id), config.APPWRITE_ASSETS_TABLE_ID], [await adapter.listAttachments(item.row.$id), config.APPWRITE_ATTACHMENTS_TABLE_ID], [await adapter.listBundles(item.row.$id), config.APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID]]) {
        for (const old of rows.filter((row) => !item.resourceRows.some((resource) => resource.table === table && resource.id === row.$id))) {
          assertPermissions(old, false, label);
          if (table !== config.APPWRITE_ASSETS_TABLE_ID && old.attachmentsRevision === item.material.attachmentsRevision) fail('PUBLICATION_STATE_MISMATCH', `${label}: unexpected row in active revision`);
          if (final) await adapter.expectAnonymousRow(table, old.$id, false);
        }
      }
      for (const file of materialFiles.get(label)) {
        await adapter.verifyFile(file.bucket, file.id, file, final && item.material.publicRead);
        if (final) await adapter.expectAnonymousFile(file.bucket, file.id, item.material.publicRead, file);
      }
      if (final) await adapter.expectAnonymousRow(config.APPWRITE_MATERIALS_TABLE_ID, item.row.$id, metadataReadable, { attachmentsRevision: item.material.attachmentsRevision });
    };
    stage = 'verify-staged-revision';
    for (const item of staged) await verifyRows(item, false);
    for (const item of staged) {
      for (const file of materialFiles.get(item.material.resourceKey)) if (item.material.publicRead) await mutate('grant-current-files', () => adapter.setFilePermissions(file.bucket, file.id, true));
      for (const resource of item.resourceRows) if (item.material.publicRead) await mutate('grant-current-rows', () => adapter.setRowPermissions(resource.table, resource.id, true));
      const metadataReadable = plan.course.lifecycleStatus === 'published' && item.material.lifecycleStatus === 'published';
      await mutate('activate-material-revision', () => adapter.upsertRow(config.APPWRITE_MATERIALS_TABLE_ID, item.row.$id, materialFields(course.$id, item.material, item.row, item.material.attachmentsRevision), metadataReadable));
    }
    await mutate('expose-course-last', () => adapter.setRowPermissions(config.APPWRITE_COURSES_TABLE_ID, course.$id, plan.course.lifecycleStatus === 'published'));
    stage = 'verify-final-revision';
    assertFields(await adapter.findCourse(plan.course.slug), courseFields(plan.course, course), 'course');
    await adapter.expectAnonymousRow(config.APPWRITE_COURSES_TABLE_ID, course.$id, plan.course.lifecycleStatus === 'published');
    for (const item of staged) await verifyRows(item, true);
    const activeFiles = new Set(files.filter((file) => file.readable).map(identity));
    for (const file of revoked.values()) if (!activeFiles.has(identity(file))) await adapter.expectAnonymousFile(file.bucket, file.id, false);
    for (const row of omitted) {
      const actual = await adapter.getRow(config.APPWRITE_MATERIALS_TABLE_ID, row.$id);
      assertFields(actual, { lifecycleStatus: 'archived', availability: 'inDevelopment' }, 'omitted material'); assertPermissions(actual, false, 'omitted material');
      await adapter.expectAnonymousRow(config.APPWRITE_MATERIALS_TABLE_ID, row.$id, false);
      for (const [rows, table] of [[inventory.assets, config.APPWRITE_ASSETS_TABLE_ID], [inventory.attachments, config.APPWRITE_ATTACHMENTS_TABLE_ID], [inventory.bundles, config.APPWRITE_ATTACHMENT_BUNDLES_TABLE_ID]]) {
        for (const resource of rows.filter((item) => item.materialId === row.$id)) {
          assertPermissions(await adapter.getRow(table, resource.$id), false, 'omitted resource');
          await adapter.expectAnonymousRow(table, resource.$id, false);
        }
      }
    }
    return { course, materials: staged.map((item) => item.row.$id), sourceCommit: guard.sourceCommit, digest: plan.digest };
  } catch (error) {
    if (error instanceof PublisherError) throw error;
    fail('PUBLISH_FAILED', `Publication failed during ${stage}; preserve private objects and retry only the current approved course revision`);
  }
}
