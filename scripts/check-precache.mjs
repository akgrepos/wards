// Checks that every file in the built app (dist/) is saved for offline use by the service worker.
// Without this, a file that grows past the size limit (or a new file type) would quietly stop working offline.
import { appendFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
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
// Size alarm: past this much offline download, it is time to split the install into tiers (docs in the rebuild plan).
const LIMIT_MB = 15;
const totalMB = [...precached].reduce((n, f) => n + (statSync(join(dist, f), { throwIfNoEntry: false })?.size ?? 0), 0) / 1024 / 1024;
console.log(`Offline download: ${totalMB.toFixed(1)} MB of ${LIMIT_MB} MB.`);
if (totalMB > LIMIT_MB) {
  const msg = `The offline download is ${totalMB.toFixed(1)} MB, over the ${LIMIT_MB} MB alarm. Time to plan the tiered install.`;
  console.log(`::warning title=Offline size::${msg}`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `**Warning:** ${msg}\n`);
}
console.log(`Offline check passed: all ${precached.size} files (including ${cardFiles.length} card files) are saved for offline use.`);
