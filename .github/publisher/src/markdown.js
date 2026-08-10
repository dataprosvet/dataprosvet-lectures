import crypto from 'node:crypto';
import path from 'node:path';
import { IMAGE_TYPES } from './constants.js';
import { fail } from './errors.js';

const attachmentKeyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const attachmentTokenPattern = /attachment:[a-z0-9]+(?:-[a-z0-9]+)*/g;

function folded(value) { return value.normalize('NFC').toLowerCase(); }
function escaped(source, index) {
  let slashes = 0;
  for (let cursor = index - 1; cursor >= 0 && source[cursor] === '\\'; cursor -= 1) slashes += 1;
  return slashes % 2 === 1;
}
function imageExtension(relative) { return Boolean(IMAGE_TYPES[path.posix.extname(relative).toLowerCase()]); }

export function normalizedAssetPath(relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || /[\0\r\n]/.test(relative) || path.posix.isAbsolute(relative)) {
    fail('ASSET_PATH_INVALID', 'Asset path must be a safe repository-relative POSIX path', { path: relative });
  }
  const normalized = path.posix.normalize(relative.normalize('NFC'));
  if (normalized === 'assets' || !normalized.startsWith('assets/') || normalized.split('/').includes('..')) {
    fail('ASSET_PATH_INVALID', 'Asset path must resolve inside assets/', { path: relative });
  }
  return normalized;
}

export function generatedAssetKey(relative) {
  return `asset-${crypto.createHash('sha256').update(normalizedAssetPath(relative)).digest('hex').slice(0, 24)}`;
}

export function buildAssetIndex(paths) {
  const assets = [...paths].filter((item) => item.startsWith('assets/') && !item.endsWith('/.gitkeep'));
  const byNormalized = new Map(); const byBasename = new Map();
  for (const original of assets) {
    const normalized = normalizedAssetPath(original);
    const identity = folded(normalized);
    if (byNormalized.has(identity)) fail('TREE_UNSAFE', 'Asset paths collide after Unicode and case normalization', { path: original });
    byNormalized.set(identity, original);
    const basename = folded(path.posix.basename(normalized));
    const matches = byBasename.get(basename) ?? [];
    matches.push(original); byBasename.set(basename, matches);
  }
  return Object.freeze({ assets: Object.freeze(assets.sort()), byNormalized, byBasename });
}

function decodeTarget(raw, markdownPath) {
  let decoded;
  try { decoded = decodeURIComponent(raw); } catch { fail('IMAGE_TARGET_INVALID', 'Image target contains malformed percent encoding', { path: markdownPath }); }
  if (!decoded || decoded.includes('\\') || /[\0\r\n?#]/.test(decoded)) fail('IMAGE_TARGET_INVALID', 'Image target contains unsupported path syntax', { path: markdownPath });
  return decoded.normalize('NFC');
}

function exactAsset(index, candidate, markdownPath) {
  const normalized = normalizedAssetPath(candidate);
  const original = index.byNormalized.get(folded(normalized));
  if (!original || original.normalize('NFC') !== normalized) fail('ATTACHMENT_UNRESOLVED', `Image target does not resolve exactly to a tracked asset: ${candidate}`, { path: markdownPath });
  if (!imageExtension(original)) fail('IMAGE_REFERENCE_UNSUPPORTED', 'Only PNG, JPEG, and WebP image attachments are supported', { path: markdownPath });
  return original;
}

function resolveObsidian(raw, markdownPath, index) {
  const target = decodeTarget(raw.trim(), markdownPath);
  if (target.includes('/')) return exactAsset(index, target, markdownPath);
  const matches = (index.byBasename.get(folded(target)) ?? []).filter((item) => path.posix.basename(item).normalize('NFC') === target);
  if (matches.length === 0) fail('ATTACHMENT_UNRESOLVED', `Obsidian image target does not resolve to a tracked asset: ${target}`, { path: markdownPath });
  if (matches.length > 1) fail('ATTACHMENT_AMBIGUOUS', `Obsidian image target ${target} is ambiguous: ${matches.join(', ')}`, { path: markdownPath });
  if (!imageExtension(matches[0])) fail('IMAGE_REFERENCE_UNSUPPORTED', 'Only PNG, JPEG, and WebP image attachments are supported', { path: markdownPath });
  return matches[0];
}

function resolveMarkdown(raw, markdownPath, index) {
  const target = decodeTarget(raw.trim(), markdownPath);
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) fail('IMAGE_REMOTE_FORBIDDEN', 'Remote and provider image targets are forbidden', { path: markdownPath });
  if (path.posix.isAbsolute(target)) fail('ASSET_PATH_INVALID', 'Image target must be repository-relative', { path: markdownPath });
  return exactAsset(index, path.posix.join(path.posix.dirname(markdownPath), target), markdownPath);
}

function filenameAlt(relative) {
  const stem = path.posix.basename(relative, path.posix.extname(relative)).trim();
  return stem || 'Image';
}
function markdownAlt(value) { return value.replaceAll(/\\([\\\[\]])/g, '$1').trim(); }
function safeAlt(value, fallback) { return (value?.trim() || fallback).replaceAll('[', '\\[').replaceAll(']', '\\]'); }

function markCode(source) {
  const mask = new Uint8Array(source.length);
  let offset = 0; let fence = null;
  for (const line of source.match(/.*(?:\r\n|\n|\r|$)/g) ?? []) {
    if (!line) continue;
    const content = line.replace(/[\r\n]+$/, '');
    const marker = /^(?: {0,3})(`{3,}|~{3,})/.exec(content)?.[1];
    const wasFenced = Boolean(fence);
    if (!fence && marker) fence = { char: marker[0], length: marker.length };
    if (fence) mask.fill(1, offset, offset + line.length);
    if (wasFenced && fence && marker && marker[0] === fence.char && marker.length >= fence.length && /^ {0,3}[`~]+\s*$/.test(content)) fence = null;
    if (!fence) {
      for (let cursor = 0; cursor < content.length;) {
        if (content[cursor] !== '`' || escaped(content, cursor)) { cursor += 1; continue; }
        let run = 1; while (content[cursor + run] === '`') run += 1;
        const delimiter = '`'.repeat(run); const close = content.indexOf(delimiter, cursor + run);
        if (close < 0) { cursor += run; continue; }
        mask.fill(1, offset + cursor, offset + close + run); cursor = close + run;
      }
    }
    offset += line.length;
  }
  return mask;
}

function closingBracket(source, start, closeChar) {
  for (let cursor = start; cursor < source.length; cursor += 1) if (source[cursor] === closeChar && !escaped(source, cursor)) return cursor;
  return -1;
}

function markdownDestination(source, open) {
  let depth = 1;
  for (let cursor = open + 1; cursor < source.length; cursor += 1) {
    if (source[cursor] === '\n' || source[cursor] === '\r') return null;
    if (escaped(source, cursor)) continue;
    if (source[cursor] === '(') depth += 1;
    if (source[cursor] === ')' && --depth === 0) return { end: cursor + 1, body: source.slice(open + 1, cursor).trim() };
  }
  return null;
}

function parseMarkdownBody(body, markdownPath) {
  if (!body) fail('IMAGE_TARGET_INVALID', 'Markdown image target is empty', { path: markdownPath });
  if (body.startsWith('<')) {
    const close = body.indexOf('>');
    if (close < 0 || body.slice(close + 1).trim()) fail('IMAGE_TARGET_INVALID', 'Markdown image target has unsupported title syntax', { path: markdownPath });
    return body.slice(1, close);
  }
  if (/\s/.test(body)) fail('IMAGE_TARGET_INVALID', 'Markdown image paths containing spaces must use percent encoding or angle brackets', { path: markdownPath });
  return body.replaceAll(/\\([()])/g, '$1');
}

export function applyMarkdownRewrites(source, rewrites) {
  let cursor = 0; let output = '';
  for (const rewrite of rewrites) {
    if (!Number.isInteger(rewrite.start) || !Number.isInteger(rewrite.end) || rewrite.start < cursor || rewrite.end <= rewrite.start || rewrite.end > source.length) fail('MARKDOWN_REWRITE_INVALID', 'Markdown rewrite spans are invalid');
    output += source.slice(cursor, rewrite.start);
    output += `![${safeAlt(rewrite.alt, 'Image')}](attachment:${rewrite.key})`;
    cursor = rewrite.end;
  }
  return output + source.slice(cursor);
}

export function transformMarkdown({ source, markdownPath, assetIndex, explicitAssets = [] }) {
  const mask = markCode(source); const rewrites = []; const recognizedSpans = []; const generatedByPath = new Map(); const explicitByKey = new Map(); const explicitUse = new Set();
  for (const asset of explicitAssets) {
    if (explicitByKey.has(asset.key)) fail('MANIFEST_DUPLICATE', 'Duplicate explicit asset key', { path: markdownPath });
    explicitByKey.set(asset.key, asset);
  }
  const occupiedKeys = new Set(explicitByKey.keys());
  const addGenerated = (file, alt, start, end) => {
    const normalized = normalizedAssetPath(file); let asset = generatedByPath.get(normalized);
    if (!asset) {
      const key = generatedAssetKey(normalized);
      if (occupiedKeys.has(key)) fail('ATTACHMENT_KEY_COLLISION', `Generated attachment key collides with another key: ${key}`, { path: markdownPath });
      occupiedKeys.add(key); asset = { key, file, alt: alt || filenameAlt(file), generated: true }; generatedByPath.set(normalized, asset);
    } else if (alt && asset.alt === filenameAlt(file)) asset.alt = alt;
    rewrites.push({ start, end, key: asset.key, alt: alt || filenameAlt(file) });
    recognizedSpans.push({ start, end });
  };

  for (let cursor = 0; cursor < source.length;) {
    if (mask[cursor] || source[cursor] !== '!' || escaped(source, cursor)) { cursor += 1; continue; }
    if (source.startsWith('![[', cursor)) {
      const close = source.indexOf(']]', cursor + 3);
      if (close < 0 || source.slice(cursor, close).includes('\n') || source.slice(cursor, close).includes('\r')) fail('IMAGE_TARGET_INVALID', 'Obsidian image embed is not closed on one line', { path: markdownPath });
      const body = source.slice(cursor + 3, close); const split = body.indexOf('|');
      const target = (split < 0 ? body : body.slice(0, split)).trim(); const alias = split < 0 ? '' : body.slice(split + 1).trim();
      const file = resolveObsidian(target, markdownPath, assetIndex);
      addGenerated(file, alias, cursor, close + 2); cursor = close + 2; continue;
    }
    if (!source.startsWith('![', cursor)) { cursor += 1; continue; }
    const altEnd = closingBracket(source, cursor + 2, ']');
    if (altEnd < 0 || source[altEnd + 1] !== '(') { cursor += 1; continue; }
    const destination = markdownDestination(source, altEnd + 1);
    if (!destination) fail('IMAGE_TARGET_INVALID', 'Markdown image target is malformed', { path: markdownPath });
    const target = parseMarkdownBody(destination.body, markdownPath); const alt = markdownAlt(source.slice(cursor + 2, altEnd));
    if (target.startsWith('attachment:')) {
      const key = target.slice('attachment:'.length);
      if (!attachmentKeyPattern.test(key) || !explicitByKey.has(key)) fail('ATTACHMENT_UNRESOLVED', `Unknown attachment key ${key}`, { path: markdownPath });
      explicitUse.add(key); recognizedSpans.push({ start: cursor, end: destination.end }); cursor = destination.end; continue;
    }
    const file = resolveMarkdown(target, markdownPath, assetIndex);
    addGenerated(file, alt, cursor, destination.end); cursor = destination.end;
  }

  const residual = source.split('').map((character, index) => mask[index] ? ' ' : character);
  for (const span of recognizedSpans) residual.fill(' ', span.start, span.end);
  for (const match of residual.join('').matchAll(attachmentTokenPattern)) fail('ATTACHMENT_SYNTAX_INVALID', 'Attachments must use supported Markdown image syntax', { path: markdownPath });
  for (const asset of explicitAssets) if (!explicitUse.has(asset.key)) fail('ATTACHMENT_UNREFERENCED', `Declared attachment ${asset.key} is not referenced`, { path: asset.file });

  const assets = [...explicitAssets.map((asset) => ({ ...asset, generated: false })), ...generatedByPath.values()];
  return Object.freeze({ markdown: applyMarkdownRewrites(source, rewrites), rewrites: Object.freeze(rewrites), assets: Object.freeze(assets), mappings: Object.freeze(assets.filter((asset) => asset.generated).map(({ file, key }) => ({ file, key }))) });
}
