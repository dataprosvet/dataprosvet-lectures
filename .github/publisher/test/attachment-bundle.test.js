import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { Readable } from 'node:stream';
import test from 'node:test';
import { ATTACHMENT_TYPES, DEFAULT_MAX_ATTACHMENT_BYTES, LIMITS } from '../src/constants.js';
import { attachmentEntryPath, attachmentRevisionManifest, attachmentSourceFileId, buildAttachmentBundle, planAttachmentBundle } from '../src/attachment-bundle.js';
import { checksum } from '../src/models.js';
import { crc32 } from '../src/archive.js';
import { inspectAttachment } from '../src/attachment.js';
import { archiveFixtures, officeFixture } from './archive-fixtures.js';

const materialKey = 'fixture-course/lecture/intro';
function item(key = 'code', bytes = Buffer.from('print(1)\n'), { fileName = 'Код.py', sortOrder = 1 } = {}) {
  const suffix = Object.keys(ATTACHMENT_TYPES).sort((a, b) => b.length - a.length).find((extension) => fileName.toLowerCase().endsWith(extension));
  return { key, fileName, file: `attachments/${key}/${fileName}`, mimeType: ATTACHMENT_TYPES[suffix], sortOrder, sizeBytes: bytes.length, checksum: checksum(bytes) };
}
function assertStoreContents(bytes, expected) {
  const eocd = bytes.length - 22;
  assert.equal(bytes.readUInt32LE(eocd), 0x06054b50);
  assert.equal(bytes.readUInt16LE(eocd + 4), 0);
  assert.equal(bytes.readUInt16LE(eocd + 6), 0);
  assert.equal(bytes.readUInt16LE(eocd + 8), expected.length);
  assert.equal(bytes.readUInt16LE(eocd + 10), expected.length);
  assert.equal(bytes.readUInt16LE(eocd + 20), 0);
  let local = 0; let central = bytes.readUInt32LE(eocd + 16);
  const centralStart = central;
  for (const [name, source] of expected) {
    const nameBytes = Buffer.from(name);
    assert.equal(bytes.readUInt32LE(local), 0x04034b50);
    assert.equal(bytes.readUInt16LE(local + 4), 20);
    assert.equal(bytes.readUInt16LE(local + 6), 0x800); // UTF-8 only; no data descriptor.
    assert.equal(bytes.readUInt16LE(local + 8), 0); // STORE.
    assert.equal(bytes.readUInt16LE(local + 10), 0);
    assert.equal(bytes.readUInt16LE(local + 12), 33); // 1980-01-01.
    assert.equal(bytes.readUInt32LE(local + 14), crc32(source));
    assert.equal(bytes.readUInt32LE(local + 18), source.length);
    assert.equal(bytes.readUInt32LE(local + 22), source.length);
    assert.equal(bytes.readUInt16LE(local + 26), nameBytes.length);
    assert.equal(bytes.readUInt16LE(local + 28), 0);
    assert.deepEqual(bytes.subarray(local + 30, local + 30 + nameBytes.length), nameBytes);
    assert.deepEqual(bytes.subarray(local + 30 + nameBytes.length, local + 30 + nameBytes.length + source.length), source);
    assert.equal(bytes.readUInt32LE(central), 0x02014b50);
    assert.equal(bytes.readUInt16LE(central + 4), 0x033f); // Fixed UNIX platform/version.
    assert.equal(bytes.readUInt16LE(central + 6), 20);
    assert.equal(bytes.readUInt16LE(central + 8), 0x800);
    assert.equal(bytes.readUInt16LE(central + 10), 0);
    assert.equal(bytes.readUInt16LE(central + 12), 0);
    assert.equal(bytes.readUInt16LE(central + 14), 33);
    assert.equal(bytes.readUInt32LE(central + 16), crc32(source));
    assert.equal(bytes.readUInt32LE(central + 20), source.length);
    assert.equal(bytes.readUInt32LE(central + 24), source.length);
    assert.equal(bytes.readUInt16LE(central + 28), nameBytes.length);
    assert.equal(bytes.readUInt16LE(central + 30), 0); // No UT or ZIP64 extra fields.
    assert.equal(bytes.readUInt16LE(central + 32), 0);
    assert.equal(bytes.readUInt16LE(central + 34), 0);
    assert.equal(bytes.readUInt16LE(central + 36), 0);
    assert.equal(bytes.readUInt32LE(central + 38), (0o100644 << 16) >>> 0);
    assert.equal(bytes.readUInt32LE(central + 42), local);
    assert.deepEqual(bytes.subarray(central + 46, central + 46 + nameBytes.length), nameBytes);
    local += 30 + nameBytes.length + source.length;
    central += 46 + nameBytes.length;
  }
  assert.equal(local, centralStart);
  assert.equal(central, eocd);
  assert.equal(bytes.readUInt32LE(eocd + 12), eocd - centralStart);
}

test('empty revision has no ZIP, source read, or writer; single attachment always has ZIP', async () => {
  const unexpected = () => { throw Error('must not be called'); };
  const empty = await buildAttachmentBundle(materialKey, [], unexpected, { createZipFile: unexpected });
  assert.equal(empty.bytes, null); assert.equal(empty.descriptor, null);
  assert.match(empty.attachmentsRevision, /^[a-f0-9]{64}$/);
  const source = Buffer.from('print(1)\n'); const attachment = item('code', source);
  const single = await buildAttachmentBundle(materialKey, [attachment], () => source);
  assert.equal(single.descriptor.attachmentCount, 1);
  assert.equal(single.descriptor.sourceTotalBytes, source.length);
  assert.equal(single.descriptor.sha256, checksum(single.bytes));
  assert.equal(single.descriptor.sha256, '84d2e990de1dab50dfc535c977a1560a06501e0324d252aa6c80d6dfeba42736');
  assertStoreContents(single.bytes, [['code/Код.py', source]]);
});

test('canonical revision uses ordered metadata/source checksums, not file path, title, clock or provenance', () => {
  const first = item('first', Buffer.from('first'), { sortOrder: 1 });
  const second = item('second', Buffer.from('second'), { sortOrder: 2 });
  const revision = (identity, list) => planAttachmentBundle(identity, list).attachmentsRevision;
  const expected = revision(materialKey, [first, second]);
  assert.equal(expected, revision(materialKey, [second, first]));
  assert.equal(expected, revision(materialKey, [{ ...first, file: '/tmp/another-copy.py', title: 'Another title', sourceCommit: 'a'.repeat(40), mtime: Date.now() }, second]));
  for (const changed of [
    [first],
    [{ ...first, sortOrder: 3 }, second],
    [{ ...first, checksum: checksum('other') }, second],
    [{ ...first, sizeBytes: first.sizeBytes + 1 }, second],
    [{ ...first, key: 'renamed' }, second],
    [{ ...first, fileName: 'other.py' }, second],
    [{ ...first, fileName: 'other.pdf', mimeType: 'application/pdf' }, second],
  ]) assert.notEqual(expected, revision(materialKey, changed));
  assert.notEqual(expected, revision('another-course/lecture/intro', [first, second]));
  assert.notEqual(attachmentSourceFileId(materialKey, first), attachmentSourceFileId('fixture-course/lecture/other', first));
  assert.notEqual(attachmentSourceFileId(materialKey, first), attachmentSourceFileId(materialKey, { ...first, key: 'other' }));
  assert.notEqual(attachmentSourceFileId(materialKey, first), attachmentSourceFileId(materialKey, { ...first, checksum: checksum('other') }));
  assert.ok(attachmentSourceFileId(materialKey, first).length <= LIMITS.maxFileIdLength);
  assert.equal(attachmentRevisionManifest(materialKey, [first]).formatVersion, 1);
});

test('ten entries retain sort order, duplicate basenames, Unicode, exact bytes and deterministic headers', async () => {
  const sources = Array.from({ length: 10 }, (_, index) => Buffer.from(`print(${index})\r\n`));
  const attachments = sources.map((bytes, index) => item(`file-${index}`, bytes, { sortOrder: index }));
  const read = (attachment) => sources[attachment.sortOrder];
  const first = await buildAttachmentBundle(materialKey, [...attachments].reverse(), read);
  const second = await buildAttachmentBundle(materialKey, attachments, read);
  assert.deepEqual(first, second);
  assertStoreContents(first.bytes, attachments.map((attachment, index) => [`${attachment.key}/Код.py`, sources[index]]));
  const otherMaterial = await buildAttachmentBundle('fixture-course/lecture/other', attachments, read);
  assert.deepEqual(first.bytes, otherMaterial.bytes);
  assert.notEqual(first.descriptor.fileId, otherMaterial.descriptor.fileId);
});

test('all eleven validated source formats are copied inertly without recompression', async () => {
  const fixtures = { ...archiveFixtures(), pptx: officeFixture('pptx'), xlsx: officeFixture('xlsx'), docx: officeFixture('docx'), pdf: Buffer.from('%PDF-1.7\n'), ipynb: Buffer.from('{"cells":[],"metadata":{},"nbformat":4}'), py: Buffer.from('raise Exception("must never execute")\n') };
  assert.equal(Object.keys(fixtures).length, 11);
  for (const [extension, bytes] of Object.entries(fixtures)) {
    const attachment = item('inert', bytes, { fileName: `Оригинал.${extension}` });
    await inspectAttachment(bytes, attachment.file);
    const built = await buildAttachmentBundle(materialKey, [attachment], () => bytes);
    assertStoreContents(built.bytes, [[`inert/Оригинал.${extension}`, bytes]]);
  }
});

test('ZIP checksum is identical across process timezone and locale', () => {
  const moduleUrl = new URL('../src/attachment-bundle.js', import.meta.url).href;
  const script = `import {buildAttachmentBundle} from ${JSON.stringify(moduleUrl)}; import {createHash} from 'node:crypto'; const bytes=Buffer.from('print(1)\\n'); const result=await buildAttachmentBundle('fixture-course/lecture/intro',[{key:'code',fileName:'Код.py',mimeType:'text/x-python',sizeBytes:bytes.length,sortOrder:1,checksum:createHash('sha256').update(bytes).digest('hex')}],()=>bytes); process.stdout.write(result.descriptor.sha256);`;
  const run = (TZ, LANG) => execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', env: { ...process.env, TZ, LANG }, timeout: 10000 });
  assert.equal(run('UTC', 'C'), run('Pacific/Honolulu', 'ru_RU.UTF-8'));
  assert.equal(run('UTC', 'C'), run('Asia/Tokyo', 'en_US.UTF-8'));
});

test('ZIP at exactly 30,000,000 bytes is accepted; plus one and source-only budgets reject before writer', async () => {
  const prototype = [0, 1, 2].map((index) => item(`file-${index}`, Buffer.from('x'), { fileName: 'code.py', sortOrder: index }));
  const overhead = planAttachmentBundle(materialKey, prototype).zipSizeBytes - 3;
  const sizes = [10_000_000, 10_000_000, LIMITS.maxAttachmentBundleBytes - overhead - 20_000_000];
  const sources = sizes.map((size) => Buffer.alloc(size, 0x61));
  const attachments = sources.map((bytes, index) => item(`file-${index}`, bytes, { fileName: 'code.py', sortOrder: index }));
  const zip = await buildAttachmentBundle(materialKey, attachments, (attachment) => sources[attachment.sortOrder]);
  assert.equal(zip.bytes.length, 30_000_000);
  assert.equal(zip.descriptor.sizeBytes, 30_000_000);
  assertStoreContents(zip.bytes, attachments.map((attachment, index) => [`${attachment.key}/code.py`, sources[index]]));
  for (const extra of [1, overhead]) {
    let reads = 0; let writers = 0;
    const overflow = attachments.map((attachment, index) => index === 2 ? { ...attachment, sizeBytes: attachment.sizeBytes + extra } : attachment);
    await assert.rejects(() => buildAttachmentBundle(materialKey, overflow, () => { reads += 1; }, { createZipFile: () => { writers += 1; } }), (error) => {
      assert.equal(error.code, 'ATTACHMENT_BUNDLE_TOO_LARGE');
      assert.equal(error.details.path, materialKey);
      assert.equal(error.details.actualBytes, 30_000_000 + extra);
      assert.equal(error.details.limitBytes, 30_000_000);
      assert.match(error.message, /30000000 bytes/);
      return true;
    });
    assert.equal(reads, 0); assert.equal(writers, 0);
  }
});

test('10 x 10 MiB source set is rejected before reading sources or constructing ZIP', async () => {
  const attachments = Array.from({ length: 10 }, (_, index) => ({ ...item(`file-${index}`, Buffer.from('x'), { sortOrder: index }), sizeBytes: DEFAULT_MAX_ATTACHMENT_BYTES }));
  let calls = 0; const unexpected = () => { calls += 1; throw Error('must not be called'); };
  await assert.rejects(() => buildAttachmentBundle(materialKey, attachments, unexpected, { createZipFile: unexpected }), (error) => error.code === 'ATTACHMENT_BUNDLE_TOO_LARGE' && error.details.actualBytes === 104857600);
  assert.equal(calls, 0);
});

test('count, unsafe entry paths, UTF-8 byte budget and metadata fail closed', () => {
  const attachment = item();
  assert.throws(() => planAttachmentBundle(materialKey, Array.from({ length: 11 }, (_, index) => ({ ...attachment, key: `key-${index}`, sortOrder: index }))), (error) => error.code === 'MANIFEST_LIMIT');
  for (const fileName of ['', '.', '..', '../file.py', 'sub/file.py', 'sub\\file.py', 'C:file.py', 'nul\0.py', 'line\n.py', '\ud800.py']) {
    assert.throws(() => attachmentEntryPath({ ...attachment, fileName }), (error) => error.code === 'ATTACHMENT_PATH_INVALID');
  }
  for (const key of ['..', 'a/b', 'a\\b', 'UPPER', 'key:stream']) assert.throws(() => attachmentEntryPath({ ...attachment, key }), (error) => error.code === 'ATTACHMENT_PATH_INVALID');
  const prefixBytes = Buffer.byteLength('code/.py');
  assert.equal(Buffer.byteLength(attachmentEntryPath({ ...attachment, fileName: `${'x'.repeat(2048 - prefixBytes)}.py` })), 2048);
  assert.throws(() => attachmentEntryPath({ ...attachment, fileName: `${'я'.repeat(1024)}.py` }), (error) => error.code === 'ATTACHMENT_PATH_INVALID');
  for (const change of [{ sizeBytes: 0 }, { sizeBytes: DEFAULT_MAX_ATTACHMENT_BYTES + 1 }, { sizeBytes: 1.5 }, { mimeType: 'application/pdf' }, { checksum: 'not-a-hash' }, { sortOrder: -1 }]) assert.throws(() => planAttachmentBundle(materialKey, [{ ...attachment, ...change }]), (error) => error.code === 'ATTACHMENT_METADATA_INVALID');
  assert.throws(() => planAttachmentBundle(materialKey, [attachment, attachment]), (error) => error.code === 'MANIFEST_DUPLICATE');
});

test('source drift fails before writer; writer throw/error/truncated result is rejected safely', async () => {
  const source = Buffer.from('print(1)\n'); const attachment = item('code', source);
  for (const changed of [Buffer.from('print(2)\n'), Buffer.from('longer changed bytes')]) {
    let writers = 0;
    await assert.rejects(() => buildAttachmentBundle(materialKey, [attachment], () => changed, { createZipFile: () => { writers += 1; } }), (error) => error.code === 'ATTACHMENT_INTEGRITY_MISMATCH');
    assert.equal(writers, 0);
  }
  for (const behavior of ['throw', 'error', 'truncated']) {
    const createZipFile = () => {
      const zip = new EventEmitter(); zip.outputStream = new Readable({ read() {} });
      zip.addBuffer = () => { if (behavior === 'throw') throw Error('private implementation detail'); };
      zip.end = () => { if (behavior === 'error') zip.emit('error', Error('private implementation detail')); else { zip.outputStream.push('invalid'); zip.outputStream.push(null); } };
      return zip;
    };
    await assert.rejects(() => buildAttachmentBundle(materialKey, [attachment], () => source, { createZipFile }), (error) => {
      assert.ok(['ATTACHMENT_BUNDLE_BUILD_FAILED', 'ATTACHMENT_BUNDLE_INTEGRITY_MISMATCH'].includes(error.code));
      assert.doesNotMatch(error.message, /private implementation detail/);
      return true;
    });
  }
});

test('actual writer output cannot exceed 30,000,000 bytes even if the planned input fits', async () => {
  const source = Buffer.from('print(1)\n');
  const createZipFile = () => {
    const zip = new EventEmitter(); zip.outputStream = new Readable({ read() {} });
    zip.addBuffer = () => {};
    zip.end = () => { zip.outputStream.push(Buffer.alloc(30_000_001)); zip.outputStream.push(null); };
    return zip;
  };
  await assert.rejects(() => buildAttachmentBundle(materialKey, [item('code', source)], () => source, { createZipFile }), (error) => error.code === 'ATTACHMENT_BUNDLE_TOO_LARGE' && error.details.actualBytes === 30_000_001 && error.details.limitBytes === 30_000_000);
});
