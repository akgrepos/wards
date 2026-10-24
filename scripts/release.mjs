// npm run release -- [--card <id>] [<pr-number>]
// Version and changelog are automatic now, so there is nothing to bump. This does the two chores that are left:
//  --card <id>   lists the card in docs/REVIEW-QUEUE.md "Not yet independently reviewed" (commit the change yourself).
//  <pr-number>   turns on auto-merge for the PR (rebase method): it merges itself as soon as the required checks pass.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const ci = args.indexOf('--card');
const card = ci >= 0 ? args.splice(ci, 2)[1] : null;
const pr = args.find((a) => /^\d+$/.test(a));
if (!card && !pr) { console.error('Usage: npm run release -- [--card <id>] [<pr-number>]'); process.exit(1); }

if (card) {
  const file = 'docs/REVIEW-QUEUE.md';
  const text = readFileSync(file, 'utf8');
  const head = '## Not yet independently reviewed';
  const start = text.indexOf(head);
  const end = text.indexOf('\n## ', start + head.length);
  const section = text.slice(start, end < 0 ? undefined : end);
  if ([card, card.replace(/^[a-z]+-/, '').replace(/-/g, ' ')].some((k) => section.toLowerCase().includes(k.toLowerCase()))) console.log(`Card "${card}" is already in the review queue.`);
  else {
    // The queue is one long bullet; add the card as a new bullet at the end of the section.
    const body = section.replace(/\s+$/, '') + `\n- ${card} (add its verification note)\n`;
    writeFileSync(file, text.slice(0, start) + body + (end < 0 ? '' : text.slice(end)));
    console.log(`Added "${card}" to ${file}.`);
  }
}
if (pr) {
  execFileSync('gh', ['pr', 'merge', pr, '--rebase', '--auto'], { stdio: 'inherit' });
  console.log(`Auto-merge is on for PR ${pr}: it merges when the checks pass. Then: npm run wait-live -- ${pr}`);
}
