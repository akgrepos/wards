// npm run changelog [-- --dry-run]
// Rebuilds the automatic part of CHANGELOG.md from the titles of merged pull requests (newest first, grouped by day).
// Nothing is typed by hand: write a clear, plain-language PR title. Older hand-written entries below the
// "auto:end" marker are kept as they are. Needs the GitHub CLI (`gh`) signed in.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const START = '<!-- auto:start -->';
const END = '<!-- auto:end -->';
const FROM = /<!-- auto-from: (\S+) -->/;

/** Pure part: PRs [{number,title,mergedAt}] -> markdown lines, newest first, one heading per day. */
export function render(prs, from) {
  const keep = prs.filter((p) => p.mergedAt > from).sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));
  const out = [];
  let day = '';
  for (const p of keep) {
    const d = p.mergedAt.slice(0, 10).replace(/-/g, '.');
    if (d !== day) { out.push('', `## ${d}`, ''); day = d; }
    out.push(`- ${p.title.trim()} (#${p.number})`);
  }
  return out.join('\n');
}

/** Pure part: swaps the text between the markers. */
export function splice(file, body) {
  const a = file.indexOf(START);
  const b = file.indexOf(END);
  if (a < 0 || b < a) throw new Error('CHANGELOG.md is missing the auto:start / auto:end markers.');
  return file.slice(0, a + START.length) + body + '\n' + file.slice(b);
}

function main() {
  const dry = process.argv.includes('--dry-run');
  const file = readFileSync('CHANGELOG.md', 'utf8');
  const from = file.match(FROM)?.[1];
  if (!from) throw new Error('CHANGELOG.md is missing the auto-from marker.');
  const json = execFileSync('gh', ['pr', 'list', '--state', 'merged', '--base', 'main', '--limit', '1000', '--json', 'number,title,mergedAt'], { encoding: 'utf8' });
  const next = splice(file, render(JSON.parse(json), from));
  if (dry) { console.log(next); return; }
  writeFileSync('CHANGELOG.md', next);
  console.log('CHANGELOG.md updated from merged pull requests.');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
