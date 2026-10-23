// Checks that every file in the built app (dist/) is saved for offline use by the service worker.
// Without this, a file that grows past the size limit (or a new file type) would quietly stop working offline.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';

// Files that are deliberately not in the offline list.
const EXEMPT = [
  /^sw\.js$/, /^workbox-[\w-]+\.js$/, // the service worker itself
  /^startup\//, // launch screens: iOS keeps its own copy
  /\.map$/,
];

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [relative(dist, p).split('\\').join('/')];
  });
}

const sw = readFileSync(join(dist, 'sw.js'), 'utf8');
const precached = new Set([...sw.matchAll(/url:\s*"([^"]+)"/g)].map((m) => m[1]));
const missing = files(dist).filter((f) => !EXEMPT.some((r) => r.test(f)) && !precached.has(f));

// Each card is its own file (cards/<id>.json); the app fetches it when the card opens, so every one must be saved.
const cardFiles = files(dist).filter((f) => /^cards\/.+\.json$/.test(f));
if (!cardFiles.length) missing.push('cards/*.json (no card files were built)');

if (missing.length) {
  console.error(`These built files are not saved for offline use:\n${missing.map((f) => `  - ${f}`).join('\n')}`);
  console.error('Add their type to workbox.globPatterns or raise maximumFileSizeToCacheInBytes in vite.config.ts.');
  process.exit(1);
}
console.log(`Offline check passed: all ${precached.size} files (including ${cardFiles.length} card files) are saved for offline use.`);
