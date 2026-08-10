import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import { applyMarkdownRewrites, buildAssetIndex, generatedAssetKey, transformMarkdown } from '../src/markdown.js';

function transform(source, assets, explicitAssets = []) {
  return transformMarkdown({ source, markdownPath: 'lectures/001_intro.md', assetIndex: buildAssetIndex(new Set(assets)), explicitAssets });
}

test('transforms root, basename, aliased, relative, Unicode, and percent-encoded images', () => {
  const files = ['assets/diagram.png', 'assets/Схемы/Pasted image 20260810.png'];
  const source = [
    '![[assets/diagram.png|Pipeline]]',
    '![[diagram.png]]',
    '![Русская схема](../assets/%D0%A1%D1%85%D0%B5%D0%BC%D1%8B/Pasted%20image%2020260810.png)',
  ].join('\n');
  const result = transform(source, files);
  const diagramKey = generatedAssetKey('assets/diagram.png');
  const unicodeKey = generatedAssetKey('assets/Схемы/Pasted image 20260810.png');
  assert.equal(result.markdown, [
    `![Pipeline](attachment:${diagramKey})`,
    `![diagram](attachment:${diagramKey})`,
    `![Русская схема](attachment:${unicodeKey})`,
  ].join('\n'));
  assert.equal(result.assets.length, 2);
  assert.deepEqual(result.assets.map(({ file, alt, generated }) => ({ file, alt, generated })), [
    { file: 'assets/diagram.png', alt: 'Pipeline', generated: true },
    { file: 'assets/Схемы/Pasted image 20260810.png', alt: 'Русская схема', generated: true },
  ]);
});

test('preserves untouched bytes, CRLF, escaped examples, code spans, fences, formulas, and links', () => {
  const source = [
    '# Заголовок',
    '',
    '\\![[assets/diagram.png]] and `![[assets/missing.png]]` and `attachment:example`',
    '```md',
    '![[assets/missing.png]]',
    '```',
    '$x = 1$ [link](https://example.com)',
    '![[assets/diagram.png|Diagram]] tail',
    '',
  ].join('\r\n');
  const result = transform(source, ['assets/diagram.png']);
  const expected = source.replace('![[assets/diagram.png|Diagram]]', `![Diagram](attachment:${generatedAssetKey('assets/diagram.png')})`);
  assert.equal(result.markdown, expected);
  assert.equal(applyMarkdownRewrites(source, result.rewrites), expected);
});

test('keeps explicit attachment compatibility and supports mixed generated references', () => {
  const explicit = { key: 'legacy', file: 'assets/legacy.png', alt: 'Legacy' };
  const source = '![Legacy](attachment:legacy)\n![[assets/new.png]]';
  const result = transform(source, ['assets/legacy.png', 'assets/new.png'], [explicit]);
  assert.match(result.markdown, /^!\[Legacy\]\(attachment:legacy\)$/m);
  assert.match(result.markdown, new RegExp(`attachment:${generatedAssetKey('assets/new.png')}`));
  assert.deepEqual(result.assets.map(({ key, generated }) => ({ key, generated })), [
    { key: 'legacy', generated: false },
    { key: generatedAssetKey('assets/new.png'), generated: true },
  ]);
});

test('generated key is path-stable and uses the documented path digest', () => {
  const relative = 'assets/Схема.png';
  assert.equal(generatedAssetKey(relative), `asset-${crypto.createHash('sha256').update(relative.normalize('NFC')).digest('hex').slice(0, 24)}`);
  assert.equal(generatedAssetKey(relative), generatedAssetKey(relative));
  assert.notEqual(generatedAssetKey(relative), generatedAssetKey('assets/renamed.png'));
});

test('rejects ambiguous, escaping, remote, malformed, unsupported, and orphan compatibility targets', () => {
  assert.throws(() => transform('![[diagram.png]]', ['assets/a/diagram.png', 'assets/b/diagram.png']), (error) => error.code === 'ATTACHMENT_AMBIGUOUS');
  assert.throws(() => transform('![x](../../secret.png)', []), (error) => error.code === 'ASSET_PATH_INVALID');
  assert.throws(() => transform('![x](https://example.com/x.png)', []), (error) => error.code === 'IMAGE_REMOTE_FORBIDDEN');
  assert.throws(() => transform('![[assets/image.png?raw=1]]', ['assets/image.png']), (error) => error.code === 'IMAGE_TARGET_INVALID');
  assert.throws(() => transform('![x](../assets/%ZZ.png)', []), (error) => error.code === 'IMAGE_TARGET_INVALID');
  assert.throws(() => transform('![[assets/note.pdf]]', ['assets/note.pdf']), (error) => error.code === 'IMAGE_REFERENCE_UNSUPPORTED');
  assert.throws(() => transform('# no image', ['assets/legacy.png'], [{ key: 'legacy', file: 'assets/legacy.png', alt: 'Legacy' }]), (error) => error.code === 'ATTACHMENT_UNREFERENCED');
});

test('rejects normalized path and generated-explicit key collisions', () => {
  assert.throws(() => buildAssetIndex(new Set(['assets/é.png', 'assets/é.png'])), (error) => error.code === 'TREE_UNSAFE');
  const file = 'assets/diagram.png';
  assert.throws(
    () => transform(`![Legacy](attachment:${generatedAssetKey(file)})\n![[${file}]]`, [file], [{ key: generatedAssetKey(file), file, alt: 'Legacy' }]),
    (error) => error.code === 'ATTACHMENT_KEY_COLLISION',
  );
});
