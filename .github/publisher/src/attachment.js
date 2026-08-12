import path from 'node:path';
import { ATTACHMENT_TYPES } from './constants.js';
import { fail } from './errors.js';

const zipTypes = new Set(['.pptx', '.xlsx', '.docx']);

export function inspectAttachment(bytes, file) {
  const extension = path.extname(file).toLowerCase();
  const mimeType = ATTACHMENT_TYPES[extension];
  if (!mimeType) fail('ATTACHMENT_TYPE_UNSUPPORTED', 'Unsupported attachment extension', { path: file });
  if (bytes.length === 0) fail('ATTACHMENT_EMPTY', 'Attachment must not be empty', { path: file });
  if (zipTypes.has(extension)) {
    if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b || ![0x03, 0x05, 0x07].includes(bytes[2])) fail('ATTACHMENT_STRUCTURE_INVALID', 'Office Open XML attachment must be a ZIP container', { path: file });
  } else if (extension === '.pdf') {
    if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') fail('ATTACHMENT_STRUCTURE_INVALID', 'PDF signature is invalid', { path: file });
  } else if (extension === '.ipynb') {
    let value;
    try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { fail('ATTACHMENT_STRUCTURE_INVALID', 'Notebook must be valid UTF-8 JSON', { path: file }); }
    if (!value || typeof value !== 'object' || !Array.isArray(value.cells) || typeof value.metadata !== 'object' || typeof value.nbformat !== 'number') fail('ATTACHMENT_STRUCTURE_INVALID', 'Notebook structure is invalid', { path: file });
  } else if (extension === '.py') {
    try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { fail('ATTACHMENT_STRUCTURE_INVALID', 'Python source must be valid UTF-8', { path: file }); }
  }
  return Object.freeze({ extension: extension.slice(1), mimeType });
}
