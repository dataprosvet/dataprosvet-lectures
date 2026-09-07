import { ATTACHMENT_TYPES } from './constants.js';
import { fail } from './errors.js';
import { inspect7z, inspectOffice, inspectRar, inspectTar, inspectTarGzip, inspectZip } from './archive.js';

const zipTypes = new Set(['.pptx', '.xlsx', '.docx']);
const suffixes = Object.keys(ATTACHMENT_TYPES).sort((a, b) => b.length - a.length);

export function inspectAttachment(bytes, file) {
  const extension = suffixes.find((suffix) => file.toLowerCase().endsWith(suffix));
  const mimeType = ATTACHMENT_TYPES[extension];
  if (!mimeType) fail('ATTACHMENT_TYPE_UNSUPPORTED', 'Unsupported attachment extension', { path: file });
  if (bytes.length === 0) fail('ATTACHMENT_EMPTY', 'Attachment must not be empty', { path: file });
  if (zipTypes.has(extension)) {
    inspectOffice(bytes, file, extension);
  } else if (extension === '.pdf') {
    if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') fail('ATTACHMENT_STRUCTURE_INVALID', 'PDF signature is invalid', { path: file });
  } else if (extension === '.ipynb') {
    let value;
    try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { fail('ATTACHMENT_STRUCTURE_INVALID', 'Notebook must be valid UTF-8 JSON', { path: file }); }
    if (!value || typeof value !== 'object' || !Array.isArray(value.cells) || typeof value.metadata !== 'object' || typeof value.nbformat !== 'number') fail('ATTACHMENT_STRUCTURE_INVALID', 'Notebook structure is invalid', { path: file });
  } else if (extension === '.py') {
    try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { fail('ATTACHMENT_STRUCTURE_INVALID', 'Python source must be valid UTF-8', { path: file }); }
  } else if (extension === '.zip') {
    inspectZip(bytes, file);
  } else if (extension === '.7z') {
    inspect7z(bytes, file);
  } else if (extension === '.tar') {
    inspectTar(bytes, file);
  } else if (extension === '.rar') {
    inspectRar(bytes, file);
  } else if (extension === '.tar.gz') {
    return inspectTarGzip(bytes, file).then(() => Object.freeze({ extension: 'tar.gz', mimeType }));
  }
  return Object.freeze({ extension: extension.slice(1), mimeType });
}
