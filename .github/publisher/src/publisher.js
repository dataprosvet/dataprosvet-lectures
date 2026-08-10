import fs from 'node:fs/promises';
import path from 'node:path';
import { createAdapter } from './appwrite.js';
import { PublisherError, fail } from './errors.js';

const locks = new Map();
function withCourseLock(slug, action) {
  const previous = locks.get(slug) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(action);
  locks.set(slug, next.finally(() => { if (locks.get(slug) === next) locks.delete(slug); }));
  return next;
}
function publishedAt(target, existing) { return target.lifecycleStatus === 'published' ? existing?.publishedAt ?? new Date().toISOString() : null; }
function rowCourse(course, existing) { return { slug: course.slug, title: course.title, description: course.description, lifecycleStatus: course.lifecycleStatus, availability: course.availability, sortOrder: course.sortOrder, publishedAt: publishedAt(course, existing) }; }
function rowMaterial(courseId, material, existing) { return { courseId, kind: material.kind, slug: material.slug, title: material.title, summary: material.summary, contentFileId: material.content?.fileId ?? null, lifecycleStatus: material.lifecycleStatus, availability: material.availability, sortOrder: material.sortOrder, publishedAt: publishedAt(material, existing) }; }

export async function buildDiff(adapter, plan) {
  const course = await adapter.findCourse(plan.course.slug);
  const materials = course ? await adapter.listMaterials(course.$id) : [];
  const desired = new Map(plan.materials.map((material) => [`${material.kind}/${material.slug}`, material]));
  return { course, materials, create: plan.materials.filter((item) => !materials.some((row) => row.kind === item.kind && row.slug === item.slug)).length, update: plan.materials.filter((item) => materials.some((row) => row.kind === item.kind && row.slug === item.slug)).length, archive: materials.filter((row) => !desired.has(`${row.kind}/${row.slug}`)) };
}

async function bytes(root, relative) { return fs.readFile(path.resolve(root, relative)); }
async function lockExisting(adapter, diff) {
  if (diff.course) await adapter.upsertRow(adapter.config.APPWRITE_COURSES_TABLE_ID, diff.course.$id, rowCourse({ ...diff.course, lifecycleStatus: 'draft', availability: 'inDevelopment' }, diff.course), false);
  for (const material of diff.materials) {
    await adapter.upsertRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, material.$id, rowMaterial(material.courseId, { ...material, lifecycleStatus: 'draft', availability: 'inDevelopment' }, material), false);
    if (material.contentFileId) await adapter.setFilePermissions(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.contentFileId, false);
  }
}
async function uploadFiles(adapter, plan, root) {
  for (const material of plan.materials) {
    if (material.content) await adapter.putFile(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.content.fileId, await bytes(root, material.content.path), material.content.path, false);
    for (const asset of material.assets) await adapter.putFile(adapter.config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, await bytes(root, asset.file), asset.file, false);
  }
}
export async function publishPlan(plan, { adapter = createAdapter(), root = process.cwd() } = {}) {
  return withCourseLock(plan.course.slug, async () => {
    try {
      const diff = await buildDiff(adapter, plan); await lockExisting(adapter, diff); await uploadFiles(adapter, plan, root);
      const course = await adapter.upsertRow(adapter.config.APPWRITE_COURSES_TABLE_ID, diff.course?.$id, rowCourse(plan.course, diff.course), false);
      const seen = new Set();
      for (const material of plan.materials) {
        const previous = diff.materials.find((row) => row.kind === material.kind && row.slug === material.slug);
        const row = await adapter.upsertRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, previous?.$id, rowMaterial(course.$id, material, previous), false);
        seen.add(row.$id);
        const oldAssets = previous ? await adapter.listAssets(previous.$id) : [];
        for (const asset of material.assets) await adapter.upsertRow(adapter.config.APPWRITE_ASSETS_TABLE_ID, (await adapter.findAsset(row.$id, asset.key))?.$id, { materialId: row.$id, key: asset.key, fileId: asset.fileId, alt: asset.alt, mimeType: asset.mimeType, width: asset.width, height: asset.height }, false);
        for (const oldAsset of oldAssets.filter((asset) => !material.assets.some((item) => item.key === asset.key))) { await adapter.setFilePermissions(adapter.config.APPWRITE_MEDIA_BUCKET_ID, oldAsset.fileId, false); await adapter.removeRow(adapter.config.APPWRITE_ASSETS_TABLE_ID, oldAsset.$id); }
        if (material.publicRead) {
          if (material.content) await adapter.setFilePermissions(adapter.config.APPWRITE_MARKDOWN_BUCKET_ID, material.content.fileId, true);
          for (const asset of material.assets) await adapter.setFilePermissions(adapter.config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, true);
        }
        await adapter.upsertRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, row.$id, rowMaterial(course.$id, material, previous), material.lifecycleStatus === 'published');
      }
      for (const omitted of diff.archive) await adapter.archiveRow(adapter.config.APPWRITE_MATERIALS_TABLE_ID, omitted);
      await adapter.upsertRow(adapter.config.APPWRITE_COURSES_TABLE_ID, course.$id, rowCourse(plan.course, diff.course), plan.course.lifecycleStatus === 'published');
      await adapter.verifyAnonymous(plan); return diff;
    } catch (error) { if (error instanceof PublisherError) throw error; fail('PUBLISH_FAILED', 'Publication failed in a recoverable fail-closed stage'); }
  });
}
export async function publishCourse(plan) { return publishPlan(plan); }
