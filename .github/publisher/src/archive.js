import { createGunzip, inflateRawSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';
import { SaxesParser } from 'saxes';
import { fail, PublisherError } from './errors.js';

// Format recognition only: no entry is extracted to disk or executed. Payload
// checksums are outside this contract. Budgets apply before mandatory checks finish.
export const ARCHIVE_LIMITS = Object.freeze({
  maxEntries: 10_000,
  maxHeaderBytes: 2 * 1024 * 1024,
  maxInflatedHeaderBytes: 1024 * 1024,
  maxGzipInputBytes: 1024 * 1024,
  maxXmlElements: 10_000,
  maxXmlDepth: 16,
  maxXmlAttributesPerElement: 32,
  maxXmlParseMilliseconds: 1000,
});

const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function invalid(file, reason) { fail('ATTACHMENT_STRUCTURE_INVALID', reason, { path: file }); }
function budget(file) { fail('ATTACHMENT_INSPECTION_LIMIT', 'Archive inspection budget exceeded', { path: file }); }
function bounds(bytes, offset, length, file) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset + length > bytes.length) invalid(file, 'Archive header or data range is truncated');
}
function counter(file) {
  let entries = 0; let headerBytes = 0;
  return (size) => {
    entries += 1; headerBytes += size;
    if (entries > ARCHIVE_LIMITS.maxEntries || headerBytes > ARCHIVE_LIMITS.maxHeaderBytes) budget(file);
  };
}
function uint64(bytes, offset, file) {
  const value = bytes.readBigUInt64LE(offset);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) invalid(file, 'Archive offset is out of range');
  return Number(value);
}

// APPNOTE: validate the central directory against local records without inflating
// file contents. Split archives / ZIP64 cannot be verified by this bounded reader.
export function inspectZip(bytes, file) {
  const count = counter(file); let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
    if (bytes.readUInt32LE(offset) === 0x06054b50 && offset + 22 + bytes.readUInt16LE(offset + 20) === bytes.length) { end = offset; break; }
  }
  if (end < 0) invalid(file, 'ZIP end of central directory is missing or truncated');
  const entries = bytes.readUInt16LE(end + 10); const size = bytes.readUInt32LE(end + 12); const start = bytes.readUInt32LE(end + 16);
  if (entries > ARCHIVE_LIMITS.maxEntries || size > ARCHIVE_LIMITS.maxHeaderBytes) budget(file);
  if (bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6) || bytes.readUInt16LE(end + 8) !== entries || entries === 0xffff || start === 0xffffffff || size === 0xffffffff) invalid(file, 'Split or ZIP64 archive headers are not supported');
  bounds(bytes, start, size, file);
  if (start + size !== end || (!entries && (start || size))) invalid(file, 'ZIP central directory range is invalid');
  const records = new Map(); const ranges = []; let offset = start;
  for (let index = 0; index < entries; index += 1) {
    bounds(bytes, offset, 46, file);
    if (bytes.readUInt32LE(offset) !== 0x02014b50) invalid(file, 'ZIP central directory signature is invalid');
    const flags = bytes.readUInt16LE(offset + 8); const method = bytes.readUInt16LE(offset + 10);
    const packedSize = bytes.readUInt32LE(offset + 20); const unpackedSize = bytes.readUInt32LE(offset + 24);
    const nameSize = bytes.readUInt16LE(offset + 28); const extraSize = bytes.readUInt16LE(offset + 30); const commentSize = bytes.readUInt16LE(offset + 32);
    const local = bytes.readUInt32LE(offset + 42); const recordSize = 46 + nameSize + extraSize + commentSize;
    bounds(bytes, offset, recordSize, file);
    if (!nameSize || offset + recordSize > end || bytes.readUInt16LE(offset + 34) || [packedSize, unpackedSize, local].includes(0xffffffff)) invalid(file, 'ZIP directory entry is invalid');
    const nameBytes = bytes.subarray(offset + 46, offset + 46 + nameSize); const name = nameBytes.toString('utf8');
    bounds(bytes, local, 30, file);
    if (bytes.readUInt32LE(local) !== 0x04034b50 || bytes.readUInt16LE(local + 6) !== flags || bytes.readUInt16LE(local + 8) !== method || bytes.readUInt16LE(local + 26) !== nameSize) invalid(file, 'ZIP local header disagrees with its directory');
    const localSize = 30 + nameSize + bytes.readUInt16LE(local + 28); count(recordSize + localSize);
    bounds(bytes, local, localSize + packedSize, file);
    if (!bytes.subarray(local + 30, local + 30 + nameSize).equals(nameBytes)) invalid(file, 'ZIP local filename disagrees with its directory');
    if (!(flags & 8) && (bytes.readUInt32LE(local + 18) !== packedSize || bytes.readUInt32LE(local + 22) !== unpackedSize || bytes.readUInt32LE(local + 14) !== bytes.readUInt32LE(offset + 16))) invalid(file, 'ZIP local sizes or checksum disagree with its directory');
    let dataEnd = local + localSize + packedSize;
    if (flags & 8) {
      bounds(bytes, dataEnd, 12, file);
      if (bytes.readUInt32LE(dataEnd) === 0x08074b50) dataEnd += 4;
      bounds(bytes, dataEnd, 12, file);
      if (bytes.readUInt32LE(dataEnd) !== bytes.readUInt32LE(offset + 16) || bytes.readUInt32LE(dataEnd + 4) !== packedSize || bytes.readUInt32LE(dataEnd + 8) !== unpackedSize) invalid(file, 'ZIP data descriptor disagrees with its directory');
      dataEnd += 12;
    }
    if (dataEnd > start || records.has(name)) invalid(file, 'ZIP entries overlap the directory or have duplicate names');
    ranges.push([local, dataEnd]);
    records.set(name, { flags, method, unpackedSize, checksum: bytes.readUInt32LE(offset + 16), data: bytes.subarray(local + localSize, local + localSize + packedSize) });
    offset += recordSize;
  }
  if (offset !== end) invalid(file, 'ZIP directory entry count is inconsistent');
  ranges.sort((a, b) => a[0] - b[0]);
  for (let index = 0; index < ranges.length; index += 1) {
    if (ranges[index][0] !== (index ? ranges[index - 1][1] : 0)) invalid(file, 'ZIP local entry layout is inconsistent');
  }
  if (ranges.length && ranges.at(-1)[1] !== start) invalid(file, 'ZIP local entries do not end at the directory');
  return records;
}

const officeParts = Object.freeze({
  '.pptx': ['ppt/presentation.xml', 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'],
  '.xlsx': ['xl/workbook.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'],
  '.docx': ['word/document.xml', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'],
});
const contentTypesNamespace = 'http://schemas.openxmlformats.org/package/2006/content-types';

function decodeContentTypes(xml, file) {
  let encoding = 'utf-8';
  if ((xml[0] === 0xff && xml[1] === 0xfe) || (xml[0] === 0x3c && xml[1] === 0)) encoding = 'utf-16le';
  else if ((xml[0] === 0xfe && xml[1] === 0xff) || (xml[0] === 0 && xml[1] === 0x3c)) encoding = 'utf-16be';
  try { return { source: new TextDecoder(encoding, { fatal: true }).decode(xml), encoding }; }
  catch { invalid(file, 'Office content types must be valid UTF-8 or UTF-16 XML'); }
}

function inspectContentTypes(xml, file, part, type) {
  const { source, encoding } = decodeContentTypes(xml, file);
  const parser = new SaxesParser({ xmlns: true });
  let depth = 0; let elements = 0; let attributes = 0; let matched = false;
  const started = performance.now();
  parser.on('error', () => invalid(file, 'Office content types XML is malformed'));
  parser.on('doctype', () => invalid(file, 'Office content types must not declare a DTD or entities'));
  parser.on('xmldecl', (declaration) => {
    const declared = declaration.encoding?.toLowerCase();
    if (declared && declared !== encoding && !(declared === 'utf-16' && encoding.startsWith('utf-16'))) invalid(file, 'Office content types encoding declaration disagrees with its bytes');
  });
  parser.on('opentagstart', () => { attributes = 0; });
  parser.on('attribute', () => {
    attributes += 1;
    if (attributes > ARCHIVE_LIMITS.maxXmlAttributesPerElement) budget(file);
  });
  parser.on('opentag', (tag) => {
    depth += 1; elements += 1;
    if (depth > ARCHIVE_LIMITS.maxXmlDepth || elements > ARCHIVE_LIMITS.maxXmlElements) budget(file);
    if (depth === 1 && (tag.uri !== contentTypesNamespace || tag.local !== 'Types')) invalid(file, 'Office content types must have the OPC Types root');
    if (depth === 2 && tag.uri === contentTypesNamespace && tag.local === 'Override' && tag.attributes.PartName?.uri === '' && tag.attributes.ContentType?.uri === '' && tag.attributes.PartName.value === `/${part}` && tag.attributes.ContentType.value === type) matched = true;
  });
  parser.on('closetag', () => { depth -= 1; });
  // Fixed chunks bound work between deadline checks. SAX events ignore comments
  // and CDATA, do not build a DOM, and never resolve external/custom entities.
  for (let offset = 0; offset < source.length; offset += 4096) {
    if (performance.now() - started > ARCHIVE_LIMITS.maxXmlParseMilliseconds) budget(file);
    parser.write(source.slice(offset, offset + 4096));
  }
  parser.close();
  if (performance.now() - started > ARCHIVE_LIMITS.maxXmlParseMilliseconds) budget(file);
  if (!matched) invalid(file, 'Office content types do not match the attachment extension');
}

export function inspectOffice(bytes, file, extension) {
  const entries = inspectZip(bytes, file); const types = entries.get('[Content_Types].xml'); const [part, type] = officeParts[extension];
  if (!types || !entries.has(part) || (types.flags & 1) || ![0, 8].includes(types.method)) invalid(file, 'Office ZIP is missing readable content types or its expected document part');
  if (types.unpackedSize > ARCHIVE_LIMITS.maxInflatedHeaderBytes) budget(file);
  let xml;
  try {
    xml = types.method === 0 ? types.data : inflateRawSync(types.data, { maxOutputLength: ARCHIVE_LIMITS.maxInflatedHeaderBytes });
    if (xml.length !== types.unpackedSize || crc32(xml) !== types.checksum) invalid(file, 'Office content types checksum or size is invalid');
  } catch (error) {
    if (error instanceof PublisherError) throw error;
    if (error.code === 'ERR_BUFFER_TOO_LARGE') budget(file);
    invalid(file, 'Office content types cannot be read');
  }
  inspectContentTypes(xml, file, part, type);
}

function tarNumber(bytes, file) {
  if (bytes[0] & 0x80) {
    if (bytes[0] & 0x40) invalid(file, 'Negative TAR size is invalid');
    let value = BigInt(bytes[0] & 0x7f);
    for (const byte of bytes.subarray(1)) value = (value << 8n) | BigInt(byte);
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) invalid(file, 'TAR size is out of range');
    return Number(value);
  }
  const text = bytes.toString('ascii').replace(/\0.*$/, '').trim();
  if (!/^[0-7]+$/.test(text)) invalid(file, 'TAR numeric header field is invalid');
  return Number.parseInt(text, 8);
}
function tarHeader(header, file) {
  const expected = tarNumber(header.subarray(148, 156), file);
  let unsigned = 0; let signed = 0;
  for (let index = 0; index < 512; index += 1) {
    const value = index >= 148 && index < 156 ? 32 : header[index];
    unsigned += value; signed += value > 127 ? value - 256 : value;
  }
  if (expected !== unsigned && expected !== signed) invalid(file, 'TAR header checksum is invalid');
  const magic = header.subarray(257, 265).toString('latin1');
  if (!header.subarray(0, 100).some((byte) => byte !== 0) || !['\0'.repeat(8), 'ustar\x0000', 'ustar  \0'].includes(magic)) invalid(file, 'TAR header name or format is invalid');
  const type = header[156];
  if (![0, ...Buffer.from('01234567xgLK')].includes(type)) invalid(file, 'TAR entry type is not supported by the header validator');
  return { size: tarNumber(header.subarray(124, 136), file), metadata: Buffer.from('xgLK').includes(type) };
}
function checkTar(bytes, file, prefix) {
  const count = counter(file); let offset = 0;
  while (offset + 512 <= bytes.length) {
    const header = bytes.subarray(offset, offset + 512); count(512);
    if (header.every((byte) => byte === 0)) {
      if (offset + 1024 > bytes.length) return false;
      if (!bytes.subarray(offset + 512, offset + 1024).every((byte) => byte === 0)) invalid(file, 'TAR end marker is invalid');
      if (!prefix && !bytes.subarray(offset + 1024).every((byte) => byte === 0)) invalid(file, 'TAR has data after its end marker');
      return true;
    }
    const { size, metadata } = tarHeader(header, file);
    if (prefix && !metadata) return true;
    offset += 512 + Math.ceil(size / 512) * 512;
    if (prefix && offset + 512 > ARCHIVE_LIMITS.maxInflatedHeaderBytes) budget(file);
  }
  return false;
}
export function inspectTar(bytes, file) {
  if (bytes.length % 512 !== 0 || !checkTar(bytes, file, false)) invalid(file, 'TAR body or end marker is truncated');
}

// Read only enough gzip output to recognize the first ordinary TAR header after
// optional pax/GNU metadata (or an empty TAR end marker). Stop before file data.
// Later payload integrity is intentionally not guaranteed by format recognition.
export async function inspectTarGzip(bytes, file) {
  if (bytes.length < 18 || bytes[0] !== 31 || bytes[1] !== 139 || bytes[2] !== 8 || (bytes[3] & 0xe0)) invalid(file, 'GZIP header is invalid or truncated');
  const gunzip = createGunzip({ chunkSize: 512 }); let output = Buffer.alloc(0); let inputOffset = 0;
  try {
    // Feed small bounded chunks with backpressure; never queue the entire payload.
    const feed = () => {
      while (inputOffset < bytes.length && inputOffset < ARCHIVE_LIMITS.maxGzipInputBytes) {
        const end = Math.min(inputOffset + 1024, bytes.length, ARCHIVE_LIMITS.maxGzipInputBytes);
        const chunk = bytes.subarray(inputOffset, end); inputOffset = end;
        if (!gunzip.write(chunk)) return;
      }
      gunzip.end(); // If input was capped, a missing TAR header becomes a budget error.
    };
    gunzip.on('drain', feed); feed();
    for await (const chunk of gunzip) {
      const remaining = ARCHIVE_LIMITS.maxInflatedHeaderBytes - output.length;
      output = Buffer.concat([output, chunk.subarray(0, remaining)]);
      if (checkTar(output, file, true)) return;
      if (chunk.length >= remaining) budget(file);
    }
    if (inputOffset < bytes.length && inputOffset >= ARCHIVE_LIMITS.maxGzipInputBytes) budget(file);
    invalid(file, 'GZIP does not contain a complete TAR header');
  } catch (error) {
    if (error instanceof PublisherError) throw error;
    if (inputOffset < bytes.length && inputOffset >= ARCHIVE_LIMITS.maxGzipInputBytes) budget(file);
    invalid(file, 'GZIP stream or TAR header is invalid or truncated');
  } finally { gunzip.destroy(); }
}

export function inspect7z(bytes, file) {
  bounds(bytes, 0, 32, file);
  if (!bytes.subarray(0, 6).equals(Buffer.from('377abcaf271c', 'hex')) || bytes[6] !== 0 || crc32(bytes.subarray(12, 32)) !== bytes.readUInt32LE(8)) invalid(file, '7z signature or start header checksum is invalid');
  const start = 32 + uint64(bytes, 12, file); const size = uint64(bytes, 20, file);
  if (size > ARCHIVE_LIMITS.maxHeaderBytes) budget(file);
  bounds(bytes, start, size, file);
  if (start + size !== bytes.length || (!size && start !== 32) || crc32(bytes.subarray(start)) !== bytes.readUInt32LE(28)) invalid(file, '7z next header range or checksum is invalid');
  if (size && (size < 2 || ![1, 0x17].includes(bytes[start]) || bytes.at(-1) !== 0)) invalid(file, '7z next header type or end marker is invalid');
}

function rarVint(bytes, state, end, file) {
  let value = 0n;
  for (let index = 0; index < 10; index += 1) {
    if (state.offset >= end) invalid(file, 'RAR variable integer is truncated');
    const byte = bytes[state.offset++]; value |= BigInt(byte & 0x7f) << BigInt(index * 7);
    if (!(byte & 0x80)) {
      if (value > BigInt(Number.MAX_SAFE_INTEGER)) invalid(file, 'RAR integer is out of range');
      return Number(value);
    }
  }
  invalid(file, 'RAR variable integer is too long');
}
function inspectRar5(bytes, file) {
  const count = counter(file); let offset = 8; let main = false;
  while (offset < bytes.length) {
    bounds(bytes, offset, 7, file); const state = { offset: offset + 4 };
    const size = rarVint(bytes, state, Math.min(offset + 7, bytes.length), file); const end = state.offset + size;
    count(end - offset); bounds(bytes, state.offset, size, file);
    if (crc32(bytes.subarray(offset + 4, end)) !== bytes.readUInt32LE(offset)) invalid(file, 'RAR5 header checksum is invalid');
    const type = rarVint(bytes, state, end, file); const flags = rarVint(bytes, state, end, file);
    const extraSize = flags & 1 ? rarVint(bytes, state, end, file) : 0;
    const dataSize = flags & 2 ? rarVint(bytes, state, end, file) : 0; const fieldsEnd = end - extraSize;
    if (state.offset > fieldsEnd || (!main && type !== 1)) invalid(file, 'RAR5 main or extra header is invalid');
    if (type === 1) {
      if (main) invalid(file, 'RAR5 main header is duplicated');
      const archiveFlags = rarVint(bytes, state, fieldsEnd, file);
      if (archiveFlags & 2) rarVint(bytes, state, fieldsEnd, file);
      main = true;
    } else if (type === 2 || type === 3) {
      const fileFlags = rarVint(bytes, state, fieldsEnd, file);
      rarVint(bytes, state, fieldsEnd, file); rarVint(bytes, state, fieldsEnd, file);
      state.offset += (fileFlags & 2 ? 4 : 0) + (fileFlags & 4 ? 4 : 0);
      rarVint(bytes, state, fieldsEnd, file); rarVint(bytes, state, fieldsEnd, file);
      const nameSize = rarVint(bytes, state, fieldsEnd, file);
      if (!nameSize || state.offset + nameSize > fieldsEnd) invalid(file, 'RAR5 file name is truncated');
    } else if (type === 5) {
      rarVint(bytes, state, fieldsEnd, file);
      if (dataSize) invalid(file, 'RAR5 end header is inconsistent');
      // RAR5 explicitly permits external signatures and other bytes after ENDARC.
      return;
    } else if (!(flags & 4)) invalid(file, 'RAR5 header type cannot be inspected');
    bounds(bytes, end, dataSize, file); offset = end + dataSize;
  }
  invalid(file, 'RAR5 end header is missing');
}
function inspectRar4(bytes, file) {
  const count = counter(file); let offset = 7; let main = false;
  while (offset < bytes.length) {
    bounds(bytes, offset, 7, file);
    const type = bytes[offset + 2]; const flags = bytes.readUInt16LE(offset + 3); const size = bytes.readUInt16LE(offset + 5);
    count(size); bounds(bytes, offset, size, file);
    if (size < 7 || (crc32(bytes.subarray(offset + 2, offset + size)) & 0xffff) !== bytes.readUInt16LE(offset)) invalid(file, 'RAR4 header size or checksum is invalid');
    if (!main && type !== 0x73) invalid(file, 'RAR4 main header is missing');
    let dataSize = 0;
    if (flags & 0x8000) {
      if (size < 11) invalid(file, 'RAR4 long header is truncated');
      dataSize = bytes.readUInt32LE(offset + 7);
    }
    if (type === 0x73) {
      if (main || size < 13 || (flags & 0x80)) invalid(file, 'RAR4 main header cannot be inspected');
      main = true;
    } else if (type === 0x74 || type === 0x7a) {
      const fixedSize = flags & 0x100 ? 40 : 32;
      if (size < fixedSize || bytes.readUInt16LE(offset + 26) + fixedSize > size || !bytes.readUInt16LE(offset + 26)) invalid(file, 'RAR4 file header is truncated');
      dataSize = bytes.readUInt32LE(offset + 7);
      if (flags & 0x100) dataSize += bytes.readUInt32LE(offset + 32) * 2 ** 32;
    } else if (type === 0x7b) {
      const minimum = 7 + (flags & 2 ? 4 : 0) + (flags & 4 ? 7 : 0) + (flags & 8 ? 2 : 0);
      if (offset + size !== bytes.length || dataSize || size < minimum) invalid(file, 'RAR4 end header is inconsistent');
      return;
    } else if (type < 0x75 || type > 0x7a) invalid(file, 'RAR4 header type is invalid');
    bounds(bytes, offset + size, dataSize, file); offset += size + dataSize;
  }
  invalid(file, 'RAR4 end header is missing');
}
export function inspectRar(bytes, file) {
  if (bytes.subarray(0, 8).equals(Buffer.from('526172211a070100', 'hex'))) inspectRar5(bytes, file);
  else if (bytes.subarray(0, 7).equals(Buffer.from('526172211a0700', 'hex'))) inspectRar4(bytes, file);
  else invalid(file, 'RAR signature is invalid');
}
