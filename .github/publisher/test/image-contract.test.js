import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectImage } from '../src/image.js';
import { IMAGE_TYPES, LIMITS } from '../src/constants.js';

function png(size) {
  const bytes = Buffer.alloc(size);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
  bytes.writeUInt32BE(1, 16); bytes.writeUInt32BE(1, 20);
  return bytes;
}
test('media contract accepts exactly 5 MiB and rejects one byte more', () => {
  assert.equal(LIMITS.maxImageBytes, 5 * 1024 * 1024);
  assert.equal(inspectImage(png(5 * 1024 * 1024), 'assets/image.png').mimeType, 'image/png');
  assert.throws(() => inspectImage(png(5 * 1024 * 1024 + 1), 'assets/image.png'), { code: 'IMAGE_TOO_LARGE' });
});
test('WebP is rejected by extension and by signature, including renamed files', () => {
  assert.deepEqual(Object.keys(IMAGE_TYPES).sort(), ['.jpeg', '.jpg', '.png']);
  const bytes = Buffer.alloc(30);
  bytes.write('RIFF', 0); bytes.write('WEBP', 8); bytes.write('VP8X', 12);
  for (const name of ['image.webp', 'image.WEBP', 'image.png', 'image.jpg']) {
    assert.throws(() => inspectImage(bytes, `assets/${name}`), { code: 'IMAGE_INVALID' });
  }
  assert.throws(() => inspectImage(png(24), 'assets/image.webp'), { code: 'IMAGE_INVALID' });
});
