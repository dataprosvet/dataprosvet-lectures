import path from 'node:path';
import { IMAGE_TYPES, LIMITS } from './constants.js';
import { fail } from './errors.js';

function png(bytes) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return null;
  return { mimeType: 'image/png', width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}
function jpeg(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  for (let offset = 2; offset + 9 < bytes.length;) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1]; const size = bytes.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { mimeType: 'image/jpeg', height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    offset += 2 + size;
  }
  return null;
}
export function inspectImage(bytes, relativePath) {
  if (bytes.length > LIMITS.maxImageBytes) fail('IMAGE_TOO_LARGE', `Image exceeds ${LIMITS.maxImageBytes} bytes`, { path: relativePath });
  const expected = IMAGE_TYPES[path.extname(relativePath).toLowerCase()];
  const found = png(bytes) ?? jpeg(bytes);
  if (!expected || !found || found.mimeType !== expected) fail('IMAGE_INVALID', 'Image extension and signature must agree', { path: relativePath });
  if (!found.width || !found.height || found.width > LIMITS.maxImageWidth || found.height > LIMITS.maxImageHeight || found.width * found.height > LIMITS.maxImagePixels) fail('IMAGE_DIMENSIONS_INVALID', 'Image dimensions exceed limits', { path: relativePath });
  return found;
}
