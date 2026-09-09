import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const publisherSha = '0f334e52bdbf42548f2c611c0610ce1b75aba669';

test('reusable workflow separates course data from the immutable publisher and scopes the secret to deploy', async () => {
  const source = await readFile(path.join(root, '.github/workflows/reusable-publish-course.yml'), 'utf8');
  const validate = source.slice(source.indexOf('  validate:'), source.indexOf('  deploy:'));
  const deploy = source.slice(source.indexOf('  deploy:'));
  assert.equal([...source.matchAll(new RegExp(`ref: ${publisherSha}`, 'g'))].length, 2);
  assert.equal([...source.matchAll(/^\s+path: course-source$/gm)].length, 2);
  assert.equal([...source.matchAll(/^\s+path: publisher-baseline$/gm)].length, 2);
  assert.match(source, /repository: dataprosvet\/dataprosvet-lectures/);
  assert.match(source, /environment: appwrite/);
  assert.match(source, /cancel-in-progress: false/);
  assert.match(source, /COURSE_PUBLISHER_SHA: 0f334e52/);
  assert.doesNotMatch(validate, /secrets\.|APPWRITE_API_KEY/);
  assert.match(deploy, /APPWRITE_API_KEY: \$\{\{ secrets\.APPWRITE_API_KEY \}\}/);
  assert.doesNotMatch(source, /secrets: inherit/);
});
