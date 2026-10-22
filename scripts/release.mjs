// npm run release -- [--card <id>] [--dry-run] "<plain-language changelog line>"
// Bumps src/version.ts to the next YYYY.MM.DD[.n] for today (from origin/main's version), prepends the matching
// CHANGELOG.md entry, and with --card adds the card to docs/REVIEW-QUEUE.md "Not yet independently reviewed".
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 1) && true : false; };
const dry = flag('--dry-run');
const ci = args.indexOf('--card');
const card = ci >= 0 ? args.splice(ci, 2)[1] : null;
const line = args.join(' ').trim();
if (!line) { console.error('Usage: npm run release -- [--card <id>] [--dry-run] "<changelog line>"'); process.exit(1); }

const sh = (c) => execSync(c, { encoding: 'utf8' });
try { sh('git fetch origin main --quiet'); } catch { console.error('Warning: could not fetch origin/main; using the last fetched copy.'); }
const current = sh('git show origin/main:src/version.ts').match(/'(\d{4}\.\d{2}\.\d{2}(?:\.\d+)?)'/)[1];
const d = new Date();
const today = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
const [base, n] = [current.split('.').slice(0, 3).join('.'), Number(current.split('.')[3] ?? 1)];
const next = base === today ? `${today}.${n + 1}` : today;

const vf = 'src/version.ts';
const cl = 'CHANGELOG.md';
const ver = readFileSync(vf, 'utf8').replace(/APP_VERSION = '[^']*'/, `APP_VERSION = '${next}'`);
const log = readFileSync(cl, 'utf8').replace(/^## /m, `## ${next}\n\n${line}\n\n## `);
let rq = null;
if (card) {
  const text = readFileSync('docs/REVIEW-QUEUE.md', 'utf8');
  const head = '## Not yet independently reviewed';
  const start = text.indexOf(head);
  const end = text.indexOf('\n## ', start + head.length);
  const section = text.slice(start, end < 0 ? undefined : end);
  if ([card, card.replace(/^[a-z]+-/, '').replace(/-/g, ' ')].some((k) => section.toLowerCase().includes(k.toLowerCase()))) console.log(`Card "${card}" is already in the review queue.`);
  else {
    // The queue is one long bullet; add the card as a new bullet at the end of the section.
    const body = section.replace(/\s+$/, '') + `\n- ${card} (added by release ${next}; add its verification note)\n`;
    rq = text.slice(0, start) + body + (end < 0 ? '' : text.slice(end));
  }
}
console.log(`Version: ${current} (origin/main) -> ${next}\nCHANGELOG entry:\n## ${next}\n\n${line}${rq ? `\nREVIEW-QUEUE: add "${card}"` : ''}`);
if (dry) { console.log('(dry run: no files changed)'); process.exit(0); }
writeFileSync(vf, ver); writeFileSync(cl, log); if (rq) writeFileSync('docs/REVIEW-QUEUE.md', rq);
console.log('Files updated.');
