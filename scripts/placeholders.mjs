// Lists every piece of placeholder text still on the site, that is, any
// text inside [[double square brackets]], with the file and line number.
// Run it with:  npm run placeholders

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const TEXT = new Set(['.md', '.yaml', '.yml']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let count = 0;
const byFile = new Map();
for await (const file of walk('src')) {
  if (!TEXT.has(extname(file))) continue;
  const lines = (await readFile(file, 'utf8')).split(/\r?\n/);
  lines.forEach((line, i) => {
    const found = line.match(/\[\[([\s\S]*?)\]\]|\[\[.*$/g);
    if (!found) return;
    const name = relative(process.cwd(), file);
    if (!byFile.has(name)) byFile.set(name, []);
    for (const f of found) {
      count++;
      const text = f.replace(/^\[\[|\]\]$/g, '');
      byFile.get(name).push(`line ${i + 1}: ${text.length > 70 ? text.slice(0, 67) + '...' : text}`);
    }
  });
}

if (count === 0) {
  console.log('No placeholder text left. You can set highlightPlaceholders to false in src/settings.yaml.');
} else {
  console.log(`${count} placeholder${count === 1 ? '' : 's'} still to replace:\n`);
  for (const [file, items] of byFile) {
    console.log(file);
    for (const item of items) console.log(`  ${item}`);
    console.log('');
  }
}
