// The Checked stamp and its fingerprint (docs/CARD-WRITING-CHEATSHEET.md, "Checked").
//   npm run checked:stamp -- <card-id> [--scope "doses and numbers"] [--read <dose-id>=<read>[@<source-id>] …]  [--open <dose-id>,…]
//       The Opus check's last step. Writes `checked: { date: today, by: opus, scope, fingerprint }`, removes the card from
//       content/unchecked.txt, and for each --read updates that dose's `verification` to what Opus read.
//   npm run checked:carry -- <card-id> "<reason>"
//       For a change judged not to need a re-check: keeps the stamp's date, by and scope, writes the new fingerprint and
//       records the reason (`carried`) in the stamp.
// checkFingerprints() is what content:check (and so CI) uses: a stamped card whose fingerprint no longer matches fails.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadContent } from './load.mjs';
import { splitContent } from './split.mjs';
import { fingerprint } from './fingerprint.mjs';
import { checkVerification, VERIFICATION_READS } from './verification.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
// The owner's local date, not UTC.
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

// Errors for stamped cards whose clinical content changed since the stamp (or whose stamp has no fingerprint).
export function checkFingerprints(content) {
  const split = splitContent(content);
  const out = [];
  for (const c of content.cards) {
    if (!c.checked || c.example) continue;
    const now = fingerprint(split.cards[c.id]);
    const then = c.checked.fingerprint;
    if (!then) out.push(`${c.file}: the checked stamp has no fingerprint; run: npm run checked:stamp -- ${c.id}  (or checked:carry if nothing clinical changed)`);
    else if (then !== now) out.push(`${c.file}: the card's clinical content (doses, numbers, thresholds, drug facts or their citations) changed since it was checked (stamp ${then}, now ${now}). Get the Opus check and run: npm run checked:stamp -- ${c.id}  — or, if the change needs no re-check: npm run checked:carry -- ${c.id} "<reason>"`);
  }
  return out;
}

// ---- editing the card's front matter (text edits, so nothing else in the file moves) ----

const q = (s) => JSON.stringify(String(s));
const stampLine = ({ date, by, scope, fingerprint: fp, carried }) =>
  `checked: { date: ${date}, by: ${by}, scope: ${q(scope)}, fingerprint: "${fp}"${carried ? `, carried: ${q(carried)}` : ''} }`;

export function setCheckedLine(src, stamp) {
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error('The card has no front matter.');
  let head = fm[1];
  const line = stampLine(stamp);
  if (/^checked:/m.test(head)) {
    if (/^checked:\s*$/m.test(head)) throw new Error('The card\'s checked stamp is written over several lines; put it on one line first.');
    head = head.replace(/^checked:.*$/m, () => line);
  } else if (/^related:/m.test(head)) head = head.replace(/^related:/m, () => `${line}\nrelated:`);
  else head = `${head}\n${line}`;
  return `---\n${head}\n---\n${src.slice(fm[0].length)}`;
}

// Replaces a dose file's `verification:` block (the keys must be source, read, date).
export function setVerification(src, v) {
  const block = `verification:\n${v.source ? `  source: ${v.source}\n` : ''}  read: ${v.read}\n  date: ${v.date}\n`;
  const re = /^verification:\n(?:[ \t]+.*\n?)*/m;
  const withNl = src.endsWith('\n') ? src : src + '\n';
  return re.test(withNl) ? withNl.replace(re, () => block) : withNl + block;
}

// The card's doses that still say `not-verified` and that this stamp neither updates (--read with a real state) nor names as left
// open (--open). A stamp must not sit on top of doses nobody read.
export function unsettledDoses(doses, reads, open) {
  const settled = new Set([...reads.filter((r) => !/^[a-z0-9-]+=not-verified\b/.test(r)).map((r) => r.split('=')[0]), ...open]);
  return Object.entries(doses ?? {}).filter(([id, d]) => d.verification?.read === 'not-verified' && !settled.has(id)).map(([id]) => id).sort();
}

function die(msg) { console.error(msg); process.exit(1); }

function parseArgs(argv) {
  const pos = [], reads = [], open = [];
  let scope;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--scope') scope = argv[++i];
    else if (argv[i] === '--read') reads.push(argv[++i]);
    else if (argv[i] === '--open') open.push(...argv[++i].split(',').filter(Boolean));
    else pos.push(argv[i]);
  }
  return { pos, reads, scope, open };
}

function load(id) {
  const content = loadContent(root, { includeExamples: true }); // same content as content:check, so the fingerprints agree
  const card = content.cards.find((c) => c.id === id);
  if (!card) die(`No card called "${id}".`);
  const payload = splitContent(content).cards[id];
  return { content, card, payload, fp: fingerprint(payload) };
}

function removeFromUnchecked(id) {
  const f = join(root, 'content/unchecked.txt');
  if (!existsSync(f)) return;
  const lines = readFileSync(f, 'utf8').split('\n');
  const kept = lines.filter((l) => l.replace(/#.*/, '').trim() !== id);
  if (kept.length !== lines.length) writeFileSync(f, kept.join('\n'));
}

export function stamp(id, { scope = 'doses and numbers', reads = [], open = [] } = {}) {
  const { content, card, payload, fp } = load(id);
  for (const o of open) if (!payload.data.dose?.[o]) die(`--open: the card does not use a dose called "${o}".`);
  const unsettled = unsettledDoses(payload.data.dose, reads, open);
  if (unsettled.length) die(`Not stamped: ${unsettled.length} of this card's doses still say "not-verified": ${unsettled.join(', ')}.\nPass what Opus really read for each: --read <dose-id>=<read>@<source-id>, or name the ones left open on purpose: --open <dose-id>,<dose-id> (they stay not-verified and the stamp scope says so).`);
  if (open.length) scope = `${scope}. Doses left not-verified: ${open.join(", ")}`;
  const file = join(root, card.file);
  // Dose verification upkeep: the doses Opus read now say so (checked before anything is written).
  const edits = [];
  for (const r of reads) {
    const m = r.match(/^([a-z0-9-]+)=([a-z-]+)(?:@([a-z0-9-]+))?$/);
    if (!m) die(`--read must look like  dose-id=full-text@source-id  (got "${r}")`);
    const [, doseId, read, source] = m;
    const dose = payload.data.dose?.[doseId];
    if (!dose) die(`--read: the card does not use a dose called "${doseId}".`);
    if (!VERIFICATION_READS.includes(read)) die(`--read: "${read}" is not one of ${VERIFICATION_READS.join(', ')}.`);
    const v = { source: source ?? dose.verification?.source, read, date: today() };
    if (v.source == null) delete v.source;
    const problems = checkVerification({ ...dose, verification: v }, content.data);
    if (problems.length) die(`--read ${r}: ${problems.join('; ')}`);
    edits.push([join(root, content.data.dose[doseId]._file), v]);
  }
  for (const [path, v] of edits) writeFileSync(path, setVerification(readFileSync(path, 'utf8'), v));
  writeFileSync(file, setCheckedLine(readFileSync(file, 'utf8'), { date: today(), by: 'opus', scope, fingerprint: fp }));
  removeFromUnchecked(id);
  console.log(`Stamped ${id}: checked ${today()} by opus, scope "${scope}", fingerprint ${fp}.${edits.length ? ` Updated verification on ${edits.length} dose${edits.length === 1 ? '' : 's'}.` : ''}`);
}

export function carry(id, reason) {
  const { card, fp } = load(id);
  if (!card.checked) die(`${id} has no checked stamp to carry. A card nobody checked needs the Opus check: npm run checked:stamp -- ${id}`);
  if (!reason || reason.trim().length < 8) die('Give the reason in a few words, in quotes: npm run checked:carry -- <card-id> "reworded, no clinical change"');
  const c = card.checked;
  const file = join(root, card.file);
  writeFileSync(file, setCheckedLine(readFileSync(file, 'utf8'), { date: c.date, by: c.by, scope: c.scope, fingerprint: fp, carried: `${today()}: ${reason.trim()}` }));
  console.log(`Carried ${id}: stamp kept (${c.by}, ${c.date}), fingerprint now ${fp}, reason recorded.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, reads, scope, open } = parseArgs(rest);
  if (cmd === 'stamp' && pos[0]) stamp(pos[0], { scope, reads, open });
  else if (cmd === 'carry' && pos[0]) carry(pos[0], pos[1]);
  else die('Usage:\n  npm run checked:stamp -- <card-id> [--scope "doses and numbers"] [--read dose-id=full-text@source-id …] [--open dose-id,dose-id]\n  npm run checked:carry -- <card-id> "<reason>"');
}
