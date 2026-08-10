import crypto from 'node:crypto';

export function checksum(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

export function stableId(prefix, digest) {
  return `${prefix}${digest.slice(0, 35 - prefix.length)}`;
}

export function effectivePublic(course, material) {
  return course.lifecycleStatus === 'published' && course.availability === 'available'
    && material.lifecycleStatus === 'published' && material.availability === 'available';
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
