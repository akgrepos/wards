// node scripts/content/compose-diff.mjs <base-ref>
// Lists the cards whose final content (the card plus every data item it uses, which is what the phone downloads for it)
// differs between <base-ref> and this checkout. A dose edit therefore lists every card that inserts that dose.
// In CI the list goes to the job summary; elsewhere it is printed.
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent } from './load.mjs';
import { splitContent } from './split.mjs';

const base = process.argv[2] ?? 'origin/main';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const composed = (dir) => splitContent(loadContent(dir, { includeExamples: false })).cards;

const tmp = mkdtempSync(join(tmpdir(), 'wards-base-'));
let before;
try {
  // Only content/ is needed from the base version.
  const tar = execFileSync('git', ['archive', base, 'content'], { cwd: root, maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', tmp], { input: tar });
  before = composed(tmp);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
const after = composed(root);

const changed = [], added = [], removed = [];
for (const id of Object.keys(after)) {
  if (!before[id]) added.push(id);
  else if (JSON.stringify(before[id]) !== JSON.stringify(after[id])) changed.push(id);
}
for (const id of Object.keys(before)) if (!after[id]) removed.push(id);

const list = (title, ids) => (ids.length ? `**${title} (${ids.length})**\n${ids.sort().map((i) => `- ${i}`).join('\n')}\n` : '');
const text = changed.length + added.length + removed.length
  ? `## Cards whose content changed versus ${base}\n\n${list('Changed', changed)}\n${list('New', added)}\n${list('Removed', removed)}`
  : `## Cards whose content changed versus ${base}\n\nNone.\n`;
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
