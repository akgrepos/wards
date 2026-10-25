// npm run pr:tier [-- --base origin/main] [--label]
// Sets this pull request's release tier by comparing it with its base: tier-0, tier-1, tier-2 or app (see tier-rules.mjs).
// Writes the tier and the reasons to the job summary (when run in CI) and prints them. With --label (CI) it also puts the
// label on the pull request. Fails only when a tier-2 card lacks a matching Checked stamp or carry.
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadContent } from './load.mjs';
import { splitContent } from './split.mjs';
import { fingerprint } from './fingerprint.mjs';
import { classifyCard, gateCard, highest } from './tier-rules.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const git = (args, opts = {}) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...opts });

const composed = (dir) => { const c = loadContent(dir, { includeExamples: true }); return { content: c, split: splitContent(c) }; };

function composedAt(ref) {
  const tmp = mkdtempSync(join(tmpdir(), 'wards-base-'));
  try {
    const tar = execFileSync('git', ['archive', ref, 'content'], { cwd: root, maxBuffer: 256 * 1024 * 1024 });
    execFileSync('tar', ['-x', '-C', tmp], { input: tar });
    return composed(tmp);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

// Files that are neither content nor plain documentation count as app (code, styles, build, CI, dependencies).
const isContent = (f) => f.startsWith('content/');
const isDoc = (f) => f.startsWith('docs/') || /^[A-Za-z-]+\.md$/.test(f);

export function changedFiles(base) {
  const tracked = git(['diff', '--name-only', base]).split('\n');
  const untracked = git(['ls-files', '--others', '--exclude-standard']).split('\n');
  return [...new Set([...tracked, ...untracked].filter(Boolean))];
}

export function tierReport(baseRef) {
  const base = git(['merge-base', baseRef, 'HEAD']).trim();
  const files = changedFiles(base);
  const appFiles = files.filter((f) => !isContent(f) && !isDoc(f));
  const lines = [], tiers = [];
  const failures = [];

  if (files.some(isContent)) {
    const before = composedAt(base), after = composed(root);
    const ids = new Set([...Object.keys(before.split.cards), ...Object.keys(after.split.cards)]);
    const byId = Object.fromEntries(after.content.cards.map((c) => [c.id, c]));
    for (const id of [...ids].sort()) {
      const r = classifyCard(before.split.cards[id], after.split.cards[id]);
      if (!r) continue;
      tiers.push(r.tier);
      let gate = '';
      if (r.tier === 'tier-2') {
        const g = gateCard(byId[id], fingerprint(after.split.cards[id]), before.content.unchecked);
        gate = g.ok ? ` — ok: ${g.note}` : ` — **MISSING EVIDENCE: ${g.note}**`;
        if (!g.ok) failures.push(id);
      }
      lines.push(`- \`${id}\`: ${r.tier} (${r.reasons.join('; ')})${gate}`);
    }
  }
  if (appFiles.length) tiers.push('app');

  const cardTier = highest(tiers.filter((t) => t !== 'app'));
  const labels = [...(tiers.some((t) => t !== 'app') ? [cardTier] : []), ...(appFiles.length ? ['app'] : [])];
  if (!labels.length) labels.push('tier-0'); // documentation only
  const verdict = appFiles.length && cardTier !== 'tier-0' ? `${cardTier} + app` : appFiles.length ? 'app' : cardTier;

  const text = [
    `## Release tier: ${verdict}`,
    '',
    appFiles.length ? `App code changed (${appFiles.length} file${appFiles.length === 1 ? '' : 's'}), so the app checks apply.\n` : '',
    lines.length ? `Cards:\n${lines.join('\n')}\n` : files.some(isContent) ? 'No card text or clinical data changed.\n' : 'No card content changed.\n',
    failures.length ? `**Fails:** ${failures.length} tier-2 card${failures.length === 1 ? '' : 's'} without a matching Checked stamp or carry (${failures.join(', ')}). After the Opus check run \`npm run checked:stamp -- <card-id>\`; if nothing clinical changed run \`npm run checked:carry -- <card-id> "<reason>"\`.\n` : '',
    '_How this works: tier 2 is a changed fingerprint (a dose, number, threshold, drug fact, or a citation on a line with a number or dose) or a new card; new cards always get tier 2. There is no care-word list, so a care-changing claim with no number change (for example a deleted "not") stays tier 1._',
  ].filter((x) => x !== '').join('\n');
  return { labels, text, ok: !failures.length };
}

const ALL_LABELS = ['tier-0', 'tier-1', 'tier-2', 'app'];
const COLORS = { 'tier-0': 'c2e0c6', 'tier-1': 'fef2c0', 'tier-2': 'f9d0c4', app: 'bfd4f2' };

function applyLabels(labels) {
  const pr = process.env.PR_NUMBER;
  if (!pr) { console.warn('No PR_NUMBER, so no label was applied.'); return; }
  try {
    for (const l of ALL_LABELS) execFileSync('gh', ['label', 'create', l, '--color', COLORS[l], '--description', 'Release tier (npm run pr:tier)', '--force'], { cwd: root, stdio: 'ignore' });
    const args = ['pr', 'edit', pr];
    for (const l of ALL_LABELS) args.push(labels.includes(l) ? '--add-label' : '--remove-label', l);
    execFileSync('gh', args, { cwd: root, stdio: 'ignore' });
  } catch { console.warn('Could not put the label on the pull request (no permission, for example a Dependabot PR). The tier above still applies.'); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'origin/main';
  const { labels, text, ok } = tierReport(base);
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  if (args.includes('--label')) applyLabels(labels);
  process.exit(ok ? 0 : 1);
}
