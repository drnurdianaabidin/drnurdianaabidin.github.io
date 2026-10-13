// Prepares photos before they are published.
//
// For every photo in src/content:
//   - removes hidden information stored in the file, including the GPS
//     location where it was taken, the camera details and the date
//   - turns it the right way up
//   - shrinks very large photos to 2400 pixels on the longest side, which
//     is plenty for the website and keeps the project small
//
// Photos that are already clean and small are left alone.
// Run it with:  npm run photos

import { readdir, writeFile, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../src/content/', import.meta.url));
const MAX = 2400;
const PHOTO = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);
const UNSUPPORTED = new Set(['.heic', '.heif']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let cleaned = 0;
let checked = 0;
const problems = [];

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  const name = relative(process.cwd(), file);
  if (UNSUPPORTED.has(ext)) {
    problems.push(`${name} is an iPhone HEIC photo. Please save it as a JPEG first (see HOW-TO-UPDATE.md).`);
    continue;
  }
  if (!PHOTO.has(ext)) continue;
  checked++;

  const input = await readFile(file);
  let meta;
  try {
    meta = await sharp(input).metadata();
  } catch {
    problems.push(`${name} could not be read as a photo. It may be damaged.`);
    continue;
  }

  const hasHiddenData = Boolean(meta.exif || meta.xmp || meta.iptc);
  const tooBig = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX;
  if (!hasHiddenData && !tooBig) continue;

  let image = sharp(input).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true });
  if (ext === '.png') image = image.png({ compressionLevel: 9 });
  else if (ext === '.webp') image = image.webp({ quality: 88 });
  else if (ext === '.tif' || ext === '.tiff') image = image.tiff({ quality: 88 });
  else image = image.jpeg({ quality: 88, mozjpeg: true });

  // sharp leaves out all hidden information unless asked to keep it.
  await writeFile(file, await image.toBuffer());
  cleaned++;
  const what = [hasHiddenData && 'removed location and camera details', tooBig && `resized to ${MAX} pixels`]
    .filter(Boolean)
    .join(', ');
  console.log(`  ${name}: ${what}`);
}

console.log(`Photos checked: ${checked}. Photos cleaned: ${cleaned}.`);
if (problems.length) {
  console.log('\nPlease fix these before publishing:');
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
}
