import { deflateRawSync, gzipSync } from 'node:zlib';
import { crc32 } from '../src/archive.js';

export function zipFixture(files = { 'readme.txt': Buffer.from('download only\n') }, { deflate = false, dataDescriptor = false } = {}) {
  const local = []; const directory = []; let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const nameBytes = Buffer.from(name); const bytes = Buffer.from(content); const crc = crc32(bytes); const packed = deflate ? deflateRawSync(bytes) : bytes;
    const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4);
    header.writeUInt16LE(dataDescriptor ? 8 : 0, 6); header.writeUInt16LE(deflate ? 8 : 0, 8); header.writeUInt16LE(nameBytes.length, 26);
    if (!dataDescriptor) { header.writeUInt32LE(crc, 14); header.writeUInt32LE(packed.length, 18); header.writeUInt32LE(bytes.length, 22); }
    const descriptor = Buffer.alloc(dataDescriptor ? 16 : 0);
    if (dataDescriptor) { descriptor.writeUInt32LE(0x08074b50); descriptor.writeUInt32LE(crc, 4); descriptor.writeUInt32LE(packed.length, 8); descriptor.writeUInt32LE(bytes.length, 12); }
    local.push(header, nameBytes, packed, descriptor);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(dataDescriptor ? 8 : 0, 8); central.writeUInt16LE(deflate ? 8 : 0, 10);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(bytes.length, 24); central.writeUInt16LE(nameBytes.length, 28); central.writeUInt32LE(offset, 42);
    directory.push(central, nameBytes); offset += header.length + nameBytes.length + packed.length + descriptor.length;
  }
  const body = Buffer.concat(local); const central = Buffer.concat(directory); const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(directory.length / 2, 8); end.writeUInt16LE(directory.length / 2, 10);
  end.writeUInt32LE(central.length, 12); end.writeUInt32LE(body.length, 16);
  return Buffer.concat([body, central, end]);
}
export function officeFixture(extension, options) {
  const formats = {
    pptx: ['ppt/presentation.xml', 'presentationml.presentation'],
    xlsx: ['xl/workbook.xml', 'spreadsheetml.sheet'],
    docx: ['word/document.xml', 'wordprocessingml.document'],
  };
  const [part, type] = formats[extension];
  return zipFixture({ '[Content_Types].xml': `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/${part}" ContentType="application/vnd.openxmlformats-officedocument.${type}.main+xml"/></Types>`, [part]: '<document/>' }, options);
}
export function tarHeaderFixture({ name = 'readme.txt', size = 14, type = '0', magic = 'ustar\x0000', base256 = false } = {}) {
  const header = Buffer.alloc(512); header.write(name); header.write('0000644\0', 100); header.write('0000000\0', 108); header.write('0000000\0', 116);
  header.write(`${size.toString(8).padStart(11, '0')}\0`, 124);
  if (base256) { header.fill(0, 124, 136); header[124] = 0x80; header.writeBigUInt64BE(BigInt(size), 128); }
  header.write('00000000000\0', 136); header.fill(32, 148, 156); header.write(type, 156); header.write(magic, 257, 'latin1');
  const sum = header.reduce((a, b) => a + b, 0); header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
  return header;
}
export function tarFixture(content = Buffer.from('download only\n'), options = {}) {
  const bytes = Buffer.from(content); return Buffer.concat([tarHeaderFixture({ ...options, size: bytes.length }), bytes, Buffer.alloc((512 - bytes.length % 512) % 512 + 1024)]);
}
export function sevenZipFixture(next = Buffer.from([1, 0])) {
  const header = Buffer.alloc(32); Buffer.from('377abcaf271c', 'hex').copy(header); header[7] = 4;
  header.writeBigUInt64LE(BigInt(next.length), 20); header.writeUInt32LE(crc32(next), 28); header.writeUInt32LE(crc32(header.subarray(12)), 8);
  return Buffer.concat([header, next]);
}
function rar4Header(type, flags, body = Buffer.alloc(0)) {
  const header = Buffer.alloc(7 + body.length); header[2] = type; header.writeUInt16LE(flags, 3); header.writeUInt16LE(header.length, 5); body.copy(header, 7);
  header.writeUInt16LE(crc32(header.subarray(2)) & 0xffff); return header;
}
export function rar4Fixture() {
  const content = Buffer.from('download only\n'); const name = Buffer.from('readme.txt'); const fields = Buffer.alloc(25);
  fields.writeUInt32LE(content.length, 0); fields.writeUInt32LE(content.length, 4); fields[8] = 3; fields.writeUInt32LE(crc32(content), 9); fields[17] = 20; fields[18] = 0x30; fields.writeUInt16LE(name.length, 19); fields.writeUInt32LE(0x81a4, 21);
  return Buffer.concat([Buffer.from('526172211a0700', 'hex'), rar4Header(0x73, 0, Buffer.alloc(6)), rar4Header(0x74, 0x8000, Buffer.concat([fields, name])), content, rar4Header(0x7b, 0)]);
}
export function vint(value) {
  const bytes = []; do { bytes.push((value & 0x7f) | (value > 127 ? 0x80 : 0)); value = Math.floor(value / 128); } while (value);
  return Buffer.from(bytes);
}
function rar5Header(fields) {
  const body = Buffer.concat([vint(fields.length), fields]); const crc = Buffer.alloc(4); crc.writeUInt32LE(crc32(body)); return Buffer.concat([crc, body]);
}
export function rar5Fixture() {
  const content = Buffer.from('download only\n'); const name = Buffer.from('readme.txt');
  return Buffer.concat([Buffer.from('526172211a070100', 'hex'), rar5Header(Buffer.from([1, 0, 0])), rar5Header(Buffer.concat([Buffer.from([2, 2, content.length, 0, content.length, 0, 0, 1, name.length]), name])), content, rar5Header(Buffer.from([5, 0, 0]))]);
}
export const archiveFixtures = () => ({
  'zip': zipFixture(),
  // Independent libarchive/bsdtar 7zip output containing readme.txt, not a mock header.
  '7z': Buffer.from('N3q8ryccAAOP+hX8GQAAAAAAAABsAAAAAAAAACxHn6kAIhvK5wBLyKT1mImBrBdI1FSKX/9mpAAAAQQGAAEJGQAHCwEAASMDAQEFXQAAgAAMDgAICgEkxTZBAAAFAREXAHIAZQBhAGQAbQBlAC4AdAB4AHQAAAAUCgEAUL0tgLI+3QESCgEAUL0tgLI+3QETCgEAFekvgLI+3QEVBgEAIICkgQAA', 'base64'),
  'tar.gz': gzipSync(tarFixture()), 'tar': tarFixture(), 'rar': rar5Fixture(),
});
