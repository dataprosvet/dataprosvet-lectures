import { Client, ID, Permission, Query, Role, Storage, TablesDB } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { loadConfig } from './config.js';
import { fail } from './errors.js';

const privatePermissions = Object.freeze([]);
const publicRead = Object.freeze([Permission.read(Role.any())]);

export function permissions(publiclyReadable) { return publiclyReadable ? publicRead : privatePermissions; }

export function assertContentAddressedFileCompatible(existing, bytes) {
  // The Storage ID is derived from the bytes, while the uploaded name is only
  // descriptive metadata. A path rename must therefore be allowed to reuse the
  // same immutable object.
  if (existing.sizeOriginal !== bytes.length) fail('FILE_ID_COLLISION', 'Existing content-addressed file metadata differs');
}

export function createAdapter({ env = process.env } = {}) {
  const config = loadConfig({ env, requireKey: true });
  const client = new Client().setEndpoint(config.APPWRITE_ENDPOINT).setProject(config.APPWRITE_PROJECT_ID).setKey(config.APPWRITE_API_KEY);
  const tables = new TablesDB(client); const storage = new Storage(client);
  const anonymousClient = new Client().setEndpoint(config.APPWRITE_ENDPOINT).setProject(config.APPWRITE_PROJECT_ID);
  const anonymousTables = new TablesDB(anonymousClient); const anonymousStorage = new Storage(anonymousClient);
  const listOneWith = async (service, tableId, queries, label) => {
    const result = await service.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId, queries, total: false });
    if (result.rows.length > 1) fail('APPWRITE_AMBIGUOUS', `Multiple ${label} rows match a stable key`);
    return result.rows[0] ?? null;
  };
  const listOne = (tableId, queries, label) => listOneWith(tables, tableId, queries, label);
  const assertPermission = (resource, readable, label) => {
    const actual = resource.$permissions ?? [];
    const expected = permissions(readable);
    if (actual.length !== expected.length || expected.some((item) => !actual.includes(item))) fail('FINAL_STATE_MISMATCH', `${label} permissions differ from the publication plan`);
  };
  const assertFields = (row, expected, label) => {
    for (const [key, value] of Object.entries(expected)) if ((row?.[key] ?? null) !== (value ?? null)) fail('FINAL_STATE_MISMATCH', `${label} field ${key} differs from the publication plan`);
  };
  const expectAnonymousFile = async (bucketId, fileId, readable, label) => {
    try {
      const body = await anonymousStorage.getFileView({ bucketId, fileId });
      if (!readable || body.byteLength === 0) fail('ANONYMOUS_ACCESS_MISMATCH', `${label} anonymous file access differs from the publication plan`);
    } catch (error) {
      if (error instanceof Error && error.name === 'PublisherError') throw error;
      if (readable) fail('ANONYMOUS_ACCESS_MISMATCH', `${label} must be anonymously readable`);
    }
  };
  const expectDenied = async (action, cleanup, label) => {
    try {
      const resource = await action();
      if (cleanup) await cleanup(resource).catch(() => undefined);
      fail('ANONYMOUS_WRITE_ALLOWED', `${label} unexpectedly allowed an anonymous write`);
    } catch (error) {
      if (error instanceof Error && error.name === 'PublisherError') throw error;
      if (![401, 403].includes(Number(error?.code))) fail('PREFLIGHT_INCONCLUSIVE', `${label} did not prove anonymous write denial`);
    }
  };
  return Object.freeze({
    config,
    async preflight(plan) {
      await listOne(config.APPWRITE_COURSES_TABLE_ID, [Query.equal('slug', plan.course.slug)], 'course');
      await listOneWith(anonymousTables, config.APPWRITE_COURSES_TABLE_ID, [Query.equal('slug', plan.course.slug)], 'anonymous course');
      const probeId = `preflight-${Date.now().toString(36)}`;
      await expectDenied(
        () => anonymousTables.createRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_COURSES_TABLE_ID, rowId: probeId, data: { slug: probeId, title: 'Preflight', description: 'Anonymous write denial probe', lifecycleStatus: 'draft', availability: 'inDevelopment', sortOrder: 999999, publishedAt: null } }),
        (row) => tables.deleteRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_COURSES_TABLE_ID, rowId: row.$id }),
        'Course table',
      );
      await expectDenied(
        () => anonymousStorage.createFile({ bucketId: config.APPWRITE_MARKDOWN_BUCKET_ID, fileId: probeId, file: InputFile.fromPlainText('preflight', 'preflight.txt') }),
        (file) => storage.deleteFile({ bucketId: config.APPWRITE_MARKDOWN_BUCKET_ID, fileId: file.$id }),
        'Markdown bucket',
      );
    },
    async findCourse(slug) { return listOne(config.APPWRITE_COURSES_TABLE_ID, [Query.equal('slug', slug)], 'course'); },
    async findMaterial(courseId, kind, slug) { return listOne(config.APPWRITE_MATERIALS_TABLE_ID, [Query.equal('courseId', courseId), Query.equal('kind', kind), Query.equal('slug', slug)], 'material'); },
    async listMaterials(courseId) { return (await tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_MATERIALS_TABLE_ID, queries: [Query.equal('courseId', courseId)] })).rows; },
    async findAsset(materialId, key) { return listOne(config.APPWRITE_ASSETS_TABLE_ID, [Query.equal('materialId', materialId), Query.equal('key', key)], 'asset'); },
    async listAssets(materialId) { return (await tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_ASSETS_TABLE_ID, queries: [Query.equal('materialId', materialId)] })).rows; },
    async findAttachment(materialId, key) { return listOne(config.APPWRITE_ATTACHMENTS_TABLE_ID, [Query.equal('materialId', materialId), Query.equal('key', key)], 'download attachment'); },
    async listAttachments(materialId) { return (await tables.listRows({ databaseId: config.APPWRITE_DATABASE_ID, tableId: config.APPWRITE_ATTACHMENTS_TABLE_ID, queries: [Query.equal('materialId', materialId), Query.orderAsc('sortOrder')], total: false })).rows; },
    async getFile(bucketId, fileId) { try { return await storage.getFile({ bucketId, fileId }); } catch { return null; } },
    async putFile(bucketId, fileId, bytes, name, readable) {
      const existing = await this.getFile(bucketId, fileId);
      if (existing) {
        assertContentAddressedFileCompatible(existing, bytes);
        return existing;
      }
      return storage.createFile({ bucketId, fileId: fileId || ID.unique(), file: InputFile.fromBuffer(bytes, name), permissions: permissions(readable) });
    },
    async setFilePermissions(bucketId, fileId, readable) { return storage.updateFile({ bucketId, fileId, permissions: permissions(readable) }); },
    async upsertRow(tableId, rowId, data, readable) {
      const args = { databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId, data, permissions: permissions(readable) };
      return rowId ? tables.updateRow(args) : tables.createRow({ ...args, rowId: ID.unique() });
    },
    async archiveRow(tableId, row) { return tables.updateRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId: row.$id, data: { lifecycleStatus: 'archived', availability: 'inDevelopment' }, permissions: privatePermissions }); },
    async removeRow(tableId, rowId) { return tables.deleteRow({ databaseId: config.APPWRITE_DATABASE_ID, tableId, rowId }); },
    async verifyFinal(plan) {
      const course = await this.findCourse(plan.course.slug);
      if (!course) fail('FINAL_STATE_MISMATCH', 'Course row is missing after publication');
      const courseFields = { slug: plan.course.slug, title: plan.course.title, description: plan.course.description, lifecycleStatus: plan.course.lifecycleStatus, availability: plan.course.availability, sortOrder: plan.course.sortOrder };
      assertFields(course, courseFields, 'Course');
      const courseReadable = plan.course.lifecycleStatus === 'published';
      assertPermission(course, courseReadable, 'Course');
      const anonymousCourse = await listOneWith(anonymousTables, config.APPWRITE_COURSES_TABLE_ID, [Query.equal('slug', plan.course.slug)], 'anonymous course');
      if (Boolean(anonymousCourse) !== courseReadable) fail('ANONYMOUS_ACCESS_MISMATCH', 'Course anonymous visibility differs from the publication plan');
      const rows = await this.listMaterials(course.$id);
      const desiredKeys = new Set(plan.materials.map((material) => `${material.kind}/${material.slug}`));
      for (const material of plan.materials) {
        const row = rows.find((item) => item.kind === material.kind && item.slug === material.slug);
        if (!row) fail('FINAL_STATE_MISMATCH', `Material ${material.resourceKey} is missing after publication`);
        const rowFields = { courseId: course.$id, kind: material.kind, slug: material.slug, title: material.title, summary: material.summary, contentFileId: material.content?.fileId ?? null, briefContentFileId: material.briefContent?.fileId ?? null, lifecycleStatus: material.lifecycleStatus, availability: material.availability, sortOrder: material.sortOrder };
        assertFields(row, rowFields, `Material ${material.resourceKey}`);
        const metadataReadable = courseReadable && material.lifecycleStatus === 'published';
        assertPermission(row, metadataReadable, `Material ${material.resourceKey}`);
        const anonymousMaterial = await listOneWith(anonymousTables, config.APPWRITE_MATERIALS_TABLE_ID, [Query.equal('courseId', course.$id), Query.equal('kind', material.kind), Query.equal('slug', material.slug)], `anonymous material ${material.resourceKey}`);
        if (Boolean(anonymousMaterial) !== metadataReadable) fail('ANONYMOUS_ACCESS_MISMATCH', `Material ${material.resourceKey} anonymous visibility differs from the publication plan`);
        if (material.content) {
          const file = await this.getFile(config.APPWRITE_MARKDOWN_BUCKET_ID, material.content.fileId);
          if (!file) fail('FINAL_STATE_MISMATCH', `Markdown for ${material.resourceKey} is missing after publication`);
          assertPermission(file, material.publicRead, `Markdown for ${material.resourceKey}`);
          await expectAnonymousFile(config.APPWRITE_MARKDOWN_BUCKET_ID, material.content.fileId, material.publicRead, `Markdown for ${material.resourceKey}`);
        }
        if (material.briefContent) {
          const file = await this.getFile(config.APPWRITE_MARKDOWN_BUCKET_ID, material.briefContent.fileId);
          if (!file) fail('FINAL_STATE_MISMATCH', `Concise Markdown for ${material.resourceKey} is missing after publication`);
          assertPermission(file, material.publicRead, `Concise Markdown for ${material.resourceKey}`);
          await expectAnonymousFile(config.APPWRITE_MARKDOWN_BUCKET_ID, material.briefContent.fileId, material.publicRead, `Concise Markdown for ${material.resourceKey}`);
        }
        const assets = await this.listAssets(row.$id);
        if (assets.length !== material.assets.length) fail('FINAL_STATE_MISMATCH', `Attachment mappings for ${material.resourceKey} differ from the publication plan`);
        for (const asset of material.assets) {
          const assetRow = assets.find((item) => item.key === asset.key);
          if (!assetRow) fail('FINAL_STATE_MISMATCH', `Attachment ${material.resourceKey}/${asset.key} is missing after publication`);
          assertFields(assetRow, { materialId: row.$id, key: asset.key, fileId: asset.fileId, alt: asset.alt, mimeType: asset.mimeType, width: asset.width, height: asset.height }, `Attachment ${material.resourceKey}/${asset.key}`);
          assertPermission(assetRow, metadataReadable, `Attachment ${material.resourceKey}/${asset.key}`);
          const anonymousAsset = await listOneWith(anonymousTables, config.APPWRITE_ASSETS_TABLE_ID, [Query.equal('materialId', row.$id), Query.equal('key', asset.key)], `anonymous attachment ${material.resourceKey}/${asset.key}`);
          if (Boolean(anonymousAsset) !== metadataReadable) fail('ANONYMOUS_ACCESS_MISMATCH', `Attachment ${material.resourceKey}/${asset.key} anonymous visibility differs from the publication plan`);
          const file = await this.getFile(config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId);
          if (!file) fail('FINAL_STATE_MISMATCH', `Attachment file ${material.resourceKey}/${asset.key} is missing after publication`);
          assertPermission(file, material.publicRead, `Attachment file ${material.resourceKey}/${asset.key}`);
          await expectAnonymousFile(config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, material.publicRead, `Attachment file ${material.resourceKey}/${asset.key}`);
        }
        const attachments = await this.listAttachments(row.$id);
        if (attachments.length !== material.attachments.length) fail('FINAL_STATE_MISMATCH', `Download attachment mappings for ${material.resourceKey} differ from the publication plan`);
        for (const attachment of material.attachments) {
          const attachmentRow = attachments.find((item) => item.key === attachment.key);
          if (!attachmentRow) fail('FINAL_STATE_MISMATCH', `Download attachment ${material.resourceKey}/${attachment.key} is missing`);
          assertFields(attachmentRow, { materialId: row.$id, key: attachment.key, title: attachment.title, fileId: attachment.fileId, fileName: attachment.fileName, mimeType: attachment.mimeType, sizeBytes: attachment.sizeBytes, sortOrder: attachment.sortOrder }, `Download attachment ${material.resourceKey}/${attachment.key}`);
          assertPermission(attachmentRow, metadataReadable, `Download attachment ${material.resourceKey}/${attachment.key}`);
          const file = await this.getFile(config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId);
          if (!file || file.sizeOriginal !== attachment.sizeBytes) fail('FINAL_STATE_MISMATCH', `Download attachment file ${material.resourceKey}/${attachment.key} is missing or has wrong size`);
          assertPermission(file, material.publicRead, `Download attachment file ${material.resourceKey}/${attachment.key}`);
          await expectAnonymousFile(config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId, material.publicRead, `Download attachment file ${material.resourceKey}/${attachment.key}`);
        }
      }
      for (const omitted of rows.filter((row) => !desiredKeys.has(`${row.kind}/${row.slug}`))) {
        if (omitted.lifecycleStatus !== 'archived') fail('FINAL_STATE_MISMATCH', `Omitted material ${omitted.kind}/${omitted.slug} is not archived`);
        assertPermission(omitted, false, `Omitted material ${omitted.kind}/${omitted.slug}`);
        const anonymousMaterial = await listOneWith(anonymousTables, config.APPWRITE_MATERIALS_TABLE_ID, [Query.equal('courseId', course.$id), Query.equal('kind', omitted.kind), Query.equal('slug', omitted.slug)], `anonymous omitted material ${omitted.kind}/${omitted.slug}`);
        if (anonymousMaterial) fail('ANONYMOUS_ACCESS_MISMATCH', `Omitted material ${omitted.kind}/${omitted.slug} remains anonymously visible`);
        if (omitted.contentFileId) {
          const file = await this.getFile(config.APPWRITE_MARKDOWN_BUCKET_ID, omitted.contentFileId);
          if (!file) fail('FINAL_STATE_MISMATCH', `Omitted Markdown ${omitted.kind}/${omitted.slug} is missing`);
          assertPermission(file, false, `Omitted Markdown ${omitted.kind}/${omitted.slug}`);
          await expectAnonymousFile(config.APPWRITE_MARKDOWN_BUCKET_ID, omitted.contentFileId, false, `Omitted Markdown ${omitted.kind}/${omitted.slug}`);
        }
        if (omitted.briefContentFileId) {
          const file = await this.getFile(config.APPWRITE_MARKDOWN_BUCKET_ID, omitted.briefContentFileId);
          if (file) { assertPermission(file, false, `Omitted concise Markdown ${omitted.kind}/${omitted.slug}`); await expectAnonymousFile(config.APPWRITE_MARKDOWN_BUCKET_ID, omitted.briefContentFileId, false, `Omitted concise Markdown ${omitted.kind}/${omitted.slug}`); }
        }
        for (const asset of await this.listAssets(omitted.$id)) {
          assertPermission(asset, false, `Omitted attachment ${omitted.kind}/${omitted.slug}/${asset.key}`);
          const file = await this.getFile(config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId);
          if (!file) fail('FINAL_STATE_MISMATCH', `Omitted attachment file ${omitted.kind}/${omitted.slug}/${asset.key} is missing`);
          assertPermission(file, false, `Omitted attachment file ${omitted.kind}/${omitted.slug}/${asset.key}`);
          await expectAnonymousFile(config.APPWRITE_MEDIA_BUCKET_ID, asset.fileId, false, `Omitted attachment file ${omitted.kind}/${omitted.slug}/${asset.key}`);
        }
        for (const attachment of await this.listAttachments(omitted.$id)) {
          assertPermission(attachment, false, `Omitted download attachment ${omitted.kind}/${omitted.slug}/${attachment.key}`);
          const file = await this.getFile(config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId);
          if (file) { assertPermission(file, false, `Omitted download attachment file ${omitted.kind}/${omitted.slug}/${attachment.key}`); await expectAnonymousFile(config.APPWRITE_ATTACHMENTS_BUCKET_ID, attachment.fileId, false, `Omitted download attachment file ${omitted.kind}/${omitted.slug}/${attachment.key}`); }
        }
      }
    },
  });
}
