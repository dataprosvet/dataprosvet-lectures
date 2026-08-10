import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatError, log } from './logger.js';
import { validateCourse } from './validator.js';
import { publishCourse } from './publisher.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const schema = JSON.parse(await fs.readFile(path.resolve(directory, '../../schemas/course.schema.json'), 'utf8'));
const [command] = process.argv.slice(2);
try {
  const input = { root: process.env.COURSE_ROOT || process.cwd(), branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '', schema };
  const plan = await validateCourse(input);
  if (command === 'validate') { log('validate', 'Validated course', { course: plan.course.slug, digest: plan.digest }); process.stdout.write(`${JSON.stringify(plan)}\n`); }
  else if (command === 'publish') { await publishCourse(plan); log('publish', 'Publication completed', { course: plan.course.slug, digest: plan.digest }); }
  else throw new Error('Usage: validate or publish');
} catch (error) { process.stderr.write(`${JSON.stringify(formatError(error))}\n`); process.exitCode = 1; }
