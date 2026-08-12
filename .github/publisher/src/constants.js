export const LIMITS = Object.freeze({
  maxTitleLength: 160,
  maxDescriptionLength: 4000,
  maxSummaryLength: 1000,
  maxMaterialsPerKind: 200,
  maxAssetsPerMaterial: 50,
  maxMarkdownBytes: 256 * 1024,
  maxImageBytes: 5 * 1024 * 1024,
  maxImageWidth: 4096,
  maxImageHeight: 4096,
  maxImagePixels: 16_000_000,
  maxAttachmentsPerMaterial: 100,
  maxFileIdLength: 36,
});

export const DEFAULT_MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
export const ATTACHMENT_TYPES = Object.freeze({
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ipynb': 'application/x-ipynb+json',
  '.py': 'text/x-python',
});

export const LIFECYCLE_STATUSES = Object.freeze(['draft', 'published', 'archived']);
export const AVAILABILITY_STATUSES = Object.freeze(['inDevelopment', 'available', 'temporarilyUnavailable']);
export const MATERIAL_KINDS = Object.freeze(['lecture', 'seminar', 'homework']);
export const IMAGE_TYPES = Object.freeze({
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
});
export const UNREFERENCED_ASSET_POLICY = 'error';
export const SLUG_PATTERN = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
export const ATTACHMENT_KEY_PATTERN = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
