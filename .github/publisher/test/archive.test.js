import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { inspectAttachment } from '../src/attachment.js';
import { ARCHIVE_LIMITS, crc32 } from '../src/archive.js';
import { archiveFixtures, officeFixture, rar4Fixture, rar5Fixture, sevenZipFixture, tarFixture, tarHeaderFixture, zipFixture } from './archive-fixtures.js';

async function rejects(bytes, file, code = 'ATTACHMENT_STRUCTURE_INVALID') {
  await assert.rejects(async () => inspectAttachment(bytes, `attachments/${file}`), (error) => error.code === code && error.details.path === `attachments/${file}`);
}
test('CRC32 matches the published check value', () => {
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});
test('all five archive formats and uppercase suffixes preserve bytes and normalized MIME', async () => {
  const mime = { zip: 'application/zip', '7z': 'application/x-7z-compressed', 'tar.gz': 'application/gzip', tar: 'application/x-tar', rar: 'application/vnd.rar' };
  for (const [extension, bytes] of Object.entries(archiveFixtures())) {
    const original = Buffer.from(bytes);
    assert.deepEqual(await inspectAttachment(bytes, `attachments/Материалы.${extension.toUpperCase()}`), { extension, mimeType: mime[extension] });
    assert.deepEqual(bytes, original);
    await rejects(bytes, 'materials.gz', 'ATTACHMENT_TYPE_UNSUPPORTED');
    await rejects(Buffer.alloc(0), `empty.${extension}`, 'ATTACHMENT_EMPTY');
    await rejects(bytes.subarray(0, 10), `truncated.${extension}`);
  }
});
test('ZIP requires a consistent central directory and local records, not just magic', async () => {
  await rejects(Buffer.from('504b0304', 'hex'), 'fake.zip');
  await rejects(Buffer.concat([zipFixture(), Buffer.from('extra')]), 'trailing.zip');
  const badOffset = zipFixture(); badOffset.writeUInt32LE(999, badOffset.length - 6); await rejects(badOffset, 'offset.zip');
  const badName = zipFixture(); badName[30] ^= 1; await rejects(badName, 'name.zip');
  const badSize = zipFixture(); badSize.writeUInt32LE(99, 18); await rejects(badSize, 'size.zip');
  assert.equal((await inspectAttachment(zipFixture({}), 'empty.zip')).extension, 'zip');
});
test('ZIP directory budget rejects excessive records before parsing them', async () => {
  const bytes = zipFixture({}); bytes.writeUInt16LE(ARCHIVE_LIMITS.maxEntries + 1, 8); bytes.writeUInt16LE(ARCHIVE_LIMITS.maxEntries + 1, 10);
  await rejects(bytes, 'many.zip', 'ATTACHMENT_INSPECTION_LIMIT');
});
test('ZIP supports deflated entries and checks data descriptors without extracting payloads', async () => {
  const bytes = zipFixture(undefined, { deflate: true, dataDescriptor: true });
  assert.equal((await inspectAttachment(bytes, 'deflate.zip')).extension, 'zip');
  const descriptor = bytes.indexOf(Buffer.from('504b0708', 'hex')); bytes[descriptor + 4] ^= 1;
  await rejects(bytes, 'descriptor.zip');
});
test('Office ZIP content types match the declared Office format', async () => {
  for (const extension of ['pptx', 'xlsx', 'docx']) {
    for (const options of [{}, { deflate: true }, { deflate: true, dataDescriptor: true }]) assert.equal((await inspectAttachment(officeFixture(extension, options), `file.${extension}`)).extension, extension);
  }
  await rejects(officeFixture('docx'), 'wrong.pptx');
  await rejects(zipFixture(), 'missing.docx');
});

const officeNamespace = 'http://schemas.openxmlformats.org/package/2006/content-types';
const officeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';
const overrideAttributes = `PartName="/word/document.xml" ContentType="${officeType}"`;
const officeXmlFixture = (xml) => zipFixture({ '[Content_Types].xml': xml, 'word/document.xml': '<document/>' });

test('Office content types recognize namespace prefixes and explicit end tags', async () => {
  for (const xml of [
    `<Types xmlns="${officeNamespace}"><Override ${overrideAttributes}></Override></Types>`,
    `<ct:Types xmlns:ct="${officeNamespace}"><ct:Override ${overrideAttributes}/></ct:Types>`,
    `<Types xmlns="${officeNamespace}"><!-- comment --><![CDATA[ignored]]><Override ${overrideAttributes}/></Types>`,
  ]) assert.equal((await inspectAttachment(officeXmlFixture(xml), 'document.docx')).extension, 'docx');
});

test('Office XML supports UTF-16LE and UTF-16BE and validates encoding declarations', async () => {
  for (const encoding of ['utf-16le', 'utf-16be']) {
    const xml = `<?xml version="1.0" encoding="UTF-16"?><Types xmlns="${officeNamespace}"><Override ${overrideAttributes}/></Types>`;
    const body = Buffer.from(xml, 'utf16le'); if (encoding === 'utf-16be') body.swap16();
    const bom = Buffer.from(encoding === 'utf-16le' ? [0xff, 0xfe] : [0xfe, 0xff]);
    assert.equal((await inspectAttachment(officeXmlFixture(Buffer.concat([bom, body])), 'document.docx')).extension, 'docx');
  }
  await rejects(officeXmlFixture(`<?xml version="1.0" encoding="UTF-16"?><Types xmlns="${officeNamespace}"><Override ${overrideAttributes}/></Types>`), 'encoding.docx');
});

test('Office XML rejects spoofed comments, CDATA, wrong namespaces, DTD and malformed XML', async () => {
  for (const xml of [
    `<Types xmlns="${officeNamespace}"><!-- <Override ${overrideAttributes}/> --></Types>`,
    `<Types xmlns="${officeNamespace}"><![CDATA[<Override ${overrideAttributes}/>]]></Types>`,
    `<Types xmlns="wrong"><Override ${overrideAttributes}/></Types>`,
    `<Types xmlns="${officeNamespace}"><ct:Override xmlns:ct="wrong" ${overrideAttributes}/></Types>`,
    `<Types xmlns="${officeNamespace}"><Other><Override ${overrideAttributes}/></Other></Types>`,
    `<!DOCTYPE Types SYSTEM "https://example.invalid/types.dtd"><Types xmlns="${officeNamespace}"><Override ${overrideAttributes}/></Types>`,
    `<!DOCTYPE Types [<!ENTITY part "/word/document.xml">]><Types xmlns="${officeNamespace}"><Override PartName="&part;" ContentType="${officeType}"/></Types>`,
    `<Types xmlns="${officeNamespace}"><Override PartName="&unknown;" ContentType="${officeType}"/></Types>`,
    `<Types xmlns="${officeNamespace}"><Override ${overrideAttributes}></Types>`,
    `<Types xmlns="${officeNamespace}"><Override ${overrideAttributes}/></Types><second/>`,
    `<Types xmlns="${officeNamespace}"><Override ${overrideAttributes} PartName="/other"/></Types>`,
  ]) await rejects(officeXmlFixture(xml), 'spoofed.docx');
});

test('Office XML budgets limit elements, depth, attributes and inflated input', async () => {
  for (const xml of [
    `<Types xmlns="${officeNamespace}">${'<Default/>'.repeat(ARCHIVE_LIMITS.maxXmlElements)}</Types>`,
    `<Types xmlns="${officeNamespace}">${'<nested>'.repeat(ARCHIVE_LIMITS.maxXmlDepth)}${'</nested>'.repeat(ARCHIVE_LIMITS.maxXmlDepth)}</Types>`,
    `<Types xmlns="${officeNamespace}"><Override ${Array.from({ length: ARCHIVE_LIMITS.maxXmlAttributesPerElement + 1 }, (_, i) => `a${i}="value"`).join(' ')}/></Types>`,
    ' '.repeat(ARCHIVE_LIMITS.maxInflatedHeaderBytes + 1),
  ]) await rejects(officeXmlFixture(xml), 'budget.docx', 'ATTACHMENT_INSPECTION_LIMIT');
});

test('Office XML adversarial 1 MiB input terminates within a bounded process deadline', () => {
  // A separate process makes a future CPU regression fail instead of hanging CI.
  // Repeated unterminated tags made the former regex scan quadratically.
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { inspectAttachment } from './src/attachment.js';
    import { zipFixture } from './test/archive-fixtures.js';
    const xml = '<Override '.repeat(Math.floor(1024 * 1024 / 10));
    const bytes = zipFixture({ '[Content_Types].xml': xml, 'word/document.xml': '<document/>' });
    assert.throws(() => inspectAttachment(bytes, 'adversarial.docx'), (error) => error.code === 'ATTACHMENT_STRUCTURE_INVALID');
  `], { cwd: new URL('..', import.meta.url), encoding: 'utf8', timeout: 5000 });
  assert.equal(result.error, undefined, 'XML inspection exceeded the process deadline');
  assert.equal(result.status, 0, result.stderr);
});
test('7z start and next header checksums and bounds are checked', async () => {
  const badStart = sevenZipFixture(); badStart[12] ^= 1; await rejects(badStart, 'start.7z');
  const badNext = sevenZipFixture(); badNext[32] ^= 1; await rejects(badNext, 'next.7z');
  await rejects(sevenZipFixture().subarray(0, 33), 'short.7z');
  await rejects(sevenZipFixture(Buffer.from([0x99, 0])), 'type.7z');
  const oversized = sevenZipFixture(); oversized.writeBigUInt64LE(BigInt(ARCHIVE_LIMITS.maxHeaderBytes + 1), 20); oversized.writeUInt32LE(crc32(oversized.subarray(12, 32)), 8);
  await rejects(oversized, 'budget.7z', 'ATTACHMENT_INSPECTION_LIMIT');
});
test('TAR accepts POSIX, GNU, V7 and base-256 sizes with valid checksums', async () => {
  for (const options of [{}, { magic: 'ustar  \0' }, { magic: '\0'.repeat(8) }, { base256: true }]) assert.equal((await inspectAttachment(tarFixture('file', options), 'file.tar')).extension, 'tar');
  assert.equal((await inspectAttachment(Buffer.alloc(1024), 'empty.tar')).extension, 'tar');
  const badChecksum = tarFixture(); badChecksum[1] ^= 1; await rejects(badChecksum, 'checksum.tar');
  await rejects(tarFixture().subarray(0, 1024), 'truncated.tar');
  await rejects(Buffer.from('ustar'), 'magic.tar');
  const many = Buffer.concat([Buffer.concat(Array.from({ length: ARCHIVE_LIMITS.maxEntries + 1 }, () => tarHeaderFixture({ size: 0 }))), Buffer.alloc(1024)]);
  await rejects(many, 'budget.tar', 'ATTACHMENT_INSPECTION_LIMIT');
});
test('TAR.GZ recognizes TAR after pax metadata and rejects other gzip content', async () => {
  const pax = Buffer.concat([tarHeaderFixture({ name: 'PaxHeader', type: 'x', size: 11 }), Buffer.from('11 uid=123\n'), Buffer.alloc(512 - 11), tarFixture()]);
  assert.equal((await inspectAttachment(gzipSync(pax), 'file.TAR.GZ')).extension, 'tar.gz');
  await rejects(gzipSync(Buffer.from('ordinary gzip data')), 'ordinary.tar.gz');
  await rejects(gzipSync(Buffer.alloc(100)), 'short.tar.gz');
  const broken = gzipSync(tarFixture()); broken[3] = 0xe0; await rejects(broken, 'flags.tar.gz');
  await rejects(gzipSync(tarFixture()).subarray(0, 12), 'truncated.tar.gz');
});
test('TAR.GZ fails excessive metadata output and gzip header input budgets', async () => {
  const body = Buffer.concat([tarHeaderFixture({ type: 'x', size: ARCHIVE_LIMITS.maxInflatedHeaderBytes }), Buffer.alloc(ARCHIVE_LIMITS.maxInflatedHeaderBytes), tarFixture()]);
  await rejects(gzipSync(body), 'metadata-bomb.tar.gz', 'ATTACHMENT_INSPECTION_LIMIT');
  const header = Buffer.from('1f8b0808000000000003', 'hex');
  const name = Buffer.alloc(ARCHIVE_LIMITS.maxGzipInputBytes + 1, 65);
  await rejects(Buffer.concat([header, name, Buffer.alloc(1), gzipSync(tarFixture()).subarray(10)]), 'name-budget.tar.gz', 'ATTACHMENT_INSPECTION_LIMIT');
});
test('TAR.GZ does not expand an ordinary file payload after format recognition', async () => {
  // A valid payload larger than the prefix budget must not require inflation.
  const compressed = gzipSync(tarFixture(Buffer.alloc(2 * 1024 * 1024)));
  assert.equal((await inspectAttachment(compressed, 'bounded.tar.gz')).extension, 'tar.gz');
});
test('RAR4 and RAR5 validate main, file, end headers and their checksums', async () => {
  for (const bytes of [rar4Fixture(), rar5Fixture()]) {
    assert.equal((await inspectAttachment(bytes, 'file.rar')).extension, 'rar');
    await rejects(bytes.subarray(0, bytes.length - 1), 'truncated.rar');
    const corrupt = Buffer.from(bytes); corrupt[10] ^= 1; await rejects(corrupt, 'checksum.rar');
  }
  assert.equal((await inspectAttachment(Buffer.concat([rar5Fixture(), Buffer.from('external signature')]), 'signed.rar')).extension, 'rar');
});
