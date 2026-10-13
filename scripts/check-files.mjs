// Checks file sizes against the GitHub Pages limits before building.
//   - no single file may be larger than 100 MB (GitHub refuses it)
//   - videos stored in the project should stay under about 10 MB
//   - the whole published site must stay under 1 GB
// Run it with:  npm run check

import { readdir, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const MB = 1024 * 1024;
const folders = ['src', 'public'];
const VIDEO = new Set(['.mp4', '.webm', '.m4v', '.mov']);

async function* walk(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let total = 0;
const errors = [];
const warnings = [];

for (const folder of folders) {
  for await (const file of walk(folder)) {
    const { size } = await stat(file);
    total += size;
    const name = relative(process.cwd(), file);
    const ext = extname(file).toLowerCase();
    if (size > 95 * MB) {
      errors.push(`${name} is ${(size / MB).toFixed(0)} MB. GitHub does not accept files over 100 MB. Upload it to YouTube or Vimeo instead and paste the link.`);
    } else if (ext === '.mov') {
      errors.push(`${name} is a .mov file. Please convert it to a compressed MP4, or upload it to YouTube or Vimeo.`);
    } else if (VIDEO.has(ext) && size > 10 * MB) {
      warnings.push(`${name} is ${(size / MB).toFixed(0)} MB. Videos over about 10 MB are better on YouTube or Vimeo.`);
    } else if (!VIDEO.has(ext) && size > 20 * MB) {
      warnings.push(`${name} is ${(size / MB).toFixed(0)} MB, which is large for a website.`);
    }
  }
}

if (total > 900 * MB) {
  errors.push(`The project files add up to ${(total / MB).toFixed(0)} MB. GitHub Pages sites must stay under 1 GB. Move some videos to YouTube or Vimeo.`);
} else if (total > 600 * MB) {
  warnings.push(`The project files add up to ${(total / MB).toFixed(0)} MB. The limit is 1 GB, so keep an eye on large files.`);
}

for (const w of warnings) console.log(`Note: ${w}`);
if (errors.length) {
  console.log('\nPlease fix these before publishing:');
  for (const e of errors) console.log(`  - ${e}`);
  process.exitCode = 1;
} else {
  console.log(`File sizes are fine (${(total / MB).toFixed(1)} MB in total).`);
}
