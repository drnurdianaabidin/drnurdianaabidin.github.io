// Saves your changes and publishes them in one go.
//
//   npm run publish
//
// It asks for a short note describing what you changed, then:
//   1. cleans your photos (removes location data, shrinks large ones)
//   2. checks file sizes
//   3. builds the site to make sure there are no mistakes
//   4. saves the changes with your note and sends them to GitHub
// GitHub then rebuilds the live site, which takes about two minutes.

import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';

const run = (cmd, args, quiet = false) =>
  spawnSync(cmd, args, { stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8', shell: process.platform === 'win32' });

function stop(message) {
  console.log(`\n${message}\nNothing has been published.`);
  process.exit(1);
}

const status = run('git', ['status', '--porcelain'], true);
if (status.status !== 0) stop('This folder is not connected to GitHub yet. See HOW-TO-UPDATE.md, section "Setting up your computer".');
if (!status.stdout.trim()) {
  console.log('There are no changes to publish.');
  process.exit(0);
}

let note = process.argv.slice(2).join(' ').trim();
if (!note) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  note = (await rl.question('In a few words, what did you change? ')).trim();
  rl.close();
}
if (!note) note = 'Update website';

console.log('\n1 of 4  Cleaning photos');
if (run('node', ['scripts/prepare-photos.mjs']).status !== 0) stop('A photo needs attention (see above).');

console.log('\n2 of 4  Checking file sizes');
if (run('node', ['scripts/check-files.mjs']).status !== 0) stop('A file is too large (see above).');

console.log('\n3 of 4  Building the site to check for mistakes');
const build = run('npx', ['astro', 'build'], true);
if (build.status !== 0) {
  const output = `${build.stdout}\n${build.stderr}`;
  const lines = output.split('\n').filter((l) => /error|missing|needs|not one of|not recognised|could not/i.test(l));
  console.log(lines.slice(0, 12).join('\n') || output.slice(-2000));
  stop('The site could not be built. The message above explains what to fix.');
}
console.log('  The site builds without problems.');

console.log('\n4 of 4  Saving and sending to GitHub');
if (run('git', ['add', '-A']).status !== 0) stop('Could not prepare the changes.');
if (run('git', ['commit', '-m', note], true).status !== 0) stop('Could not save the changes.');
const push = run('git', ['push']);
if (push.status !== 0) stop('Saved on your computer, but could not send to GitHub. Check your internet connection and run npm run publish again.');

console.log('\nDone. Your changes are on GitHub. The live site updates in about two minutes.');
