import fs from 'node:fs/promises';
import path from 'node:path';
import { createAdapter } from './appwrite.js';
import { PublisherError, fail } from './errors.js';
import { applyMarkdownRewrites } from './markdown.js';
import { checksum, stableId } from './models.js';

const locks = new Map();
const downloadable = (material) => material.attachments ?? [];
function withCourseLock(slug, action) {
  const previous = locks.get(slug) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(action);
  locks.set(slug, next);
  next.finally(() => { if (locks.get(slug) === next) locks.delete(slug); }).catch(() => undefined);
  return next;
}
function publishedAt(target, existing) { return target.lifecycleStatus === 'published' ? existing?.publishedAt ?? new Date().toISOString() : null; }
function rowCourse(course, existing) { return { slug: course.slug, title: course.title, description: course.description, lifecycleStatus: course.lifecycleStatus, availability: course.availability, sortOrder: course.sortOrder, publishedAt: publishedAt(course, existing) }; }
function rowMaterial(courseId, material, existing) { return { courseId, kind: material.kind, slug: material.slug, title: material.title, summary: material.summary, contentFileId: material.content?.fileId ?? null, briefContentFileId: material.briefContent?.fileId ?? null, lifecycleStatus: material.lifecycleStatus, availability: material.availability, sortOrder: material.sortOrder, publishedAt: publishedAt(material, existing) }; }
function rowAsset(materialId, asset) { return { materialId, key: asset.key, fileId: asset.fileId, alt: asset.alt, mimeType: asset.mimeType, width: asset.width, height: asset.height }; }
function rowAttachment(materialId, attachment) { return { materialId, key: attachment.key, title: attachment.title, fileId: attachment.fileId, fileName: attachment.fileName, mimeType: attachment.mimeType, sizeBytes: attachment.sizeBytes, sortOrder: attachment.sortOrder }; }

export async function buildDiff(adapter, plan) {
  const course = await adapter.findCourse(plan.course.slug);
  const materials = course ? await adapter.listMaterials(course.$id) : [];
  const desired = new Map(plan.materials.map((material) => [`${material.kind}/${material.slug}`, material]));
  return { course, materials, create: plan.materials.filter((item) => !materials.some((row) => row.kind === item.kind && row.slug === item.slug)).length, update: plan.materials.filter((item) => materials.some((row) => row.kind === item.kind && row.slug === item.slug)).length, archive: materials.filter((row) => !desired.has(`${row.kind}/${row.slug}`)) };
}

async function bytes(root, relative) { return fs.readFile(path.resolve(root, relative)); }
async function prepareUploads(plan, root) {
  const prepared = new Map();
  for (const material of plan.materials) {
    if (material.content) {
      const sourceBytes = await bytes(root, material.content.path);
      let uploadBytes = sourceBytes;
      if (material.content.sourceChecksum || material.content.checksum) {
        if (checksum(sourceBytes) !== material.content.sourceChecksum) fail('MARKDOWN_SOURCE_CHANGED', 'Authored Markdown differs from the validated publication plan', { path: material.content.path });
        let source;
        try { source = new TextDecoder('utf-8', { fatal: true }).decode(sourceBytes); } catch { fail('MARKDOWN_UTF8_INVALID', 'Markdown must be valid UTF-8', { path: material.content.path }); }
        uploadBytes = Buffer.from(applyMarkdownRewrites(source, material.content.rewrites ?? []));
        const transformedChecksum = checksum(uploadBytes);
        if (transformedChecksum !== material.content.checksum || stableId('md', transformedChecksum) !== material.content.fileId) fail('MARKDOWN_INTEGRITY_MISMATCH', 'Prepared Markdown differs from the validated transformed content', { path: material.content.path });
      }
      prepared.set(`markdown:${material.content.path}`, uploadBytes);
    }
    if (material.briefContent) {
      const sourceBytes = await bytes(root, material.briefContent.path);
      if (checksum(sourceBytes) !== material.briefContent.sourceChecksum) fail('MARKDOWN_SOURCE_CHANGED', 'Authored concise Markdown differs from the validated publication plan', { path: material.briefContent.path });
      let source;
      try { source = new TextDecoder('utf-8', { fatal: true }).decode(sourceBytes); } catch { fail('MARKDOWN_UTF8_INVALID', 'Concise Markdown must be valid UTF-8', { path: material.briefContent.path }); }
      const uploadBytes = Buffer.from(applyMarkdownRewrites(source, material.briefContent.rewrites ?? []));
      const digest = checksum(uploadBytes);
      if (digest !== material.briefContent.checksum || stableId('md', digest) !== material.briefContent.fileId) fail('MARKDOWN_INTEGRITY_MISMATCH', 'Prepared concise Markdown differs from the publication plan', { path: material.briefContent.path });
      prepared.set(`markdown:${material.briefContent.path}`, uploadBytes);
    }
    for (const asset of material.assets) {
      const assetBytes = await bytes(root, asset.file);
      if (asset.checksum) {
        const assetChecksum = checksum(assetBytes);
        if (assetChecksum !== asset.checksum || stableId('asset', assetChecksum) !== asset.fileId) fail('ASSET_INTEGRITY_MISMATCH', 'Asset differs from the validated publication plan', { path: asset.file });
      }
      prepared.set(`asset:${asset.file}`, assetBytes);
    }
    for (const attachment of downloadable(material)) {
      const attachmentBytes = await bytes(root, attachment.file);
      const digest = checksum(attachmentBytes);
      if (digest !== attachment.checksum || stableId('att', digest) !== attachment.fileId || attachmentBytes.length !== attachment.sizeBytes) fail('ATTACHMENT_INTEGRITY_MISMATCH', 'Download attachment differs from the publication plan', { path: attachment.file });
      prepared.set(`attachment:${attachment.file}`, attachmentBytes);
    }
  }
  return prepared;
}
async function lockExisting(adapter, diff) {
  if (diff.course) await adapter.upsertRow(adapter.config.APPWRITE_COURSES_TABLE_ID, diff.course.$id, rowCourse({ ...diff.course, lifecycleStatus: 'draft', availability: 'inDevelopment' }, diff.course), false);
  for (const material of diff.materials) {
    await adapter.upsertRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, material.$id, rowMaterial(material.courseId, { ...material, lifecycleStatus: 'draft', availability: 'inDevelopment' }, material), false);
    if (material.contentFileId) await adapter.setFilePermissions(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.contentFileId, false);
    if (material.briefContentFileId) await adapter.setFilePermissions(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.briefContentFileId, false);
    for (const asset of await adapter.listAssets(material.$id)) {
      await adapter.setFilePermissions(adapter.config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, false);
      await adapter.upsertRow(adapter.config.APPWRITE_ASSETS_TABLE_ID, asset.$id, rowAsset(material.$id, asset), false);
    }
    for (const attachment of adapter.listAttachments ? await adapter.listAttachments(material.$id) : []) {
      await adapter.setFilePermissions(adapter.config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId, false);
      await adapter.upsertRow(adapter.config.APPWRITE_ATTACHMENTS_TABLE_ID, attachment.$id, rowAttachment(material.$id, attachment), false);
    }
  }
}
async function uploadFiles(adapter, plan, prepared) {
  for (const material of plan.materials) {
    if (material.content) await adapter.putFile(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.content.fileId, prepared.get(`markdown:${material.content.path}`), material.content.path, false);
    if (material.briefContent) await adapter.putFile(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.briefContent.fileId, prepared.get(`markdown:${material.briefContent.path}`), material.briefContent.path, false);
    for (const asset of material.assets) await adapter.putFile(adapter.config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, prepared.get(`asset:${asset.file}`), asset.file, false);
    for (const attachment of downloadable(material)) await adapter.putFile(adapter.config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId, prepared.get(`attachment:${attachment.file}`), attachment.fileName, false);
  }
}
export async function publishPlan(plan, { adapter = createAdapter(), root = process.cwd() } = {}) {
  return withCourseLock(plan.course.slug, async () => {
    let stage = 'prepare-local-files';
    try {
      const prepared = await prepareUploads(plan, root);
      stage = 'preflight';
      if (adapter.preflight) await adapter.preflight(plan);
      stage = 'read-current-state';
      const diff = await buildDiff(adapter, plan);
      stage = 'lock-current-state'; await lockExisting(adapter, diff);
      stage = 'upload-private-files'; await uploadFiles(adapter, plan, prepared);
      stage = 'write-private-rows';
      const course = await adapter.upsertRow(adapter.config.APPWRITE_COURSES_TABLE_ID, diff.course?.$id, rowCourse(plan.course, diff.course), false);
      const seen = new Set();
      for (const material of plan.materials) {
        const previous = diff.materials.find((row) => row.kind === material.kind && row.slug === material.slug);
        const row = await adapter.upsertRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, previous?.$id, rowMaterial(course.$id, material, previous), false);
        seen.add(row.$id);
        const oldAssets = previous ? await adapter.listAssets(previous.$id) : [];
        const oldAttachments = previous && adapter.listAttachments ? await adapter.listAttachments(previous.$id) : [];
        for (const asset of material.assets) await adapter.upsertRow(adapter.config.APPWRITE_ASSETS_TABLE_ID, (await adapter.findAsset(row.$id, asset.key))?.$id, rowAsset(row.$id, asset), false);
        for (const oldAsset of oldAssets.filter((asset) => !material.assets.some((item) => item.key === asset.key))) { await adapter.setFilePermissions(adapter.config.APPWRITE_MEDIA_BUCKET_ID, oldAsset.fileId, false); await adapter.removeRow(adapter.config.APPWRITE_ASSETS_TABLE_ID, oldAsset.$id); }
        for (const attachment of downloadable(material)) await adapter.upsertRow(adapter.config.APPWRITE_ATTACHMENTS_TABLE_ID, (await adapter.findAttachment(row.$id, attachment.key))?.$id, rowAttachment(row.$id, attachment), false);
        for (const oldAttachment of oldAttachments.filter((old) => !downloadable(material).some((item) => item.key === old.key))) { await adapter.setFilePermissions(adapter.config.APPWRITE_ATTACHMENTS_BUCKET_ID, oldAttachment.fileId, false); await adapter.removeRow(adapter.config.APPWRITE_ATTACHMENTS_TABLE_ID, oldAttachment.$id); }
        if (material.publicRead) {
          if (material.content) await adapter.setFilePermissions(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.content.fileId, true);
          if (material.briefContent) await adapter.setFilePermissions(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.briefContent.fileId, true);
          for (const asset of material.assets) await adapter.setFilePermissions(adapter.config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, true);
          for (const attachment of downloadable(material)) await adapter.setFilePermissions(adapter.config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId, true);
        }
        const metadataReadable = plan.course.lifecycleStatus === 'published' && material.lifecycleStatus === 'published';
        for (const asset of material.assets) {
          const assetRow = await adapter.findAsset(row.$id, asset.key);
          await adapter.upsertRow(adapter.config.APPWRITE_ASSETS_TABLE_ID, assetRow.$id, rowAsset(row.$id, asset), metadataReadable);
        }
        for (const attachment of downloadable(material)) {
          const attachmentRow = await adapter.findAttachment(row.$id, attachment.key);
          await adapter.upsertRow(adapter.config.APPWRITE_ATTACHMENTS_TABLE_ID, attachmentRow.$id, rowAttachment(row.$id, attachment), metadataReadable);
        }
        await adapter.upsertRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, row.$id, rowMaterial(course.$id, material, previous), metadataReadable);
      }
      stage = 'archive-omitted-content';
      for (const omitted of diff.archive) await adapter.archiveRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, omitted);
      stage = 'expose-course';
      await adapter.upsertRow(adapter.config.APPWRITE_COURSES_TABLE_ID, course.$id, rowCourse(plan.course, diff.course), plan.course.lifecycleStatus === 'published');
      stage = 'verify-final-state';
      await adapter.verifyFinal(plan); return diff;
    } catch (error) {
      if (error instanceof PublisherError) throw error;
      const providerCode = typeof error?.code === 'number' || typeof error?.code === 'string' ? ` (provider code ${String(error.code).slice(0, 40)})` : '';
      fail('PUBLISH_FAILED', `Publication failed during ${stage}${providerCode}; retry the same commit after correction`);
    }
  });
}
export async function publishCourse(plan, options) { return publishPlan(plan, options); }
