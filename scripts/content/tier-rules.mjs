// Release tiers for content (pure rules; scripts/content/tier.mjs runs them on a pull request).
//   tier 0: reader text changed only in spacing, punctuation, capitals or tiny spelling
//   tier 1: other wording, fields or non-clinical data changed; the fingerprint is the same
//   tier 2: the fingerprint changed (a dose, number, threshold, drug fact, or a citation on a clinical line), or a new card
// A care-changing claim with no number change (a deleted "not", "first-line" reworded) stays tier 1: there is deliberately no
// care-word list. New cards always get tier 2.
import { fingerprint, fingerprintParts, readerLines } from './fingerprint.mjs';

const TIER_ORDER = { 'tier-0': 0, 'tier-1': 1, 'tier-2': 2 };
export const highest = (tiers) => tiers.reduce((a, b) => ((TIER_ORDER[b] ?? -1) > (TIER_ORDER[a] ?? -1) ? b : a), 'tier-0');

function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}

const norm = (s) => s.replace(/[\s.,;:!?'"“”‘’()]+/g, ' ').trim().toLowerCase();

// True when two versions of one reader line differ only in spacing, punctuation, capitals or a one- or two-letter spelling slip
// (in words of four or more letters, with no digit and no marker such as {{dose:…}} involved).
export function tinyChange(a, b) {
  if (a.text === b.text && a.sources.join() === b.sources.join()) return true;
  if (a.sources.join() !== b.sources.join()) return false;
  const [x, y] = [norm(a.text), norm(b.text)];
  if (x === y) return true;
  const [wx, wy] = [x.split(' '), y.split(' ')];
  if (wx.length !== wy.length) return false;
  return wx.every((w, i) => w === wy[i] || (w.length >= 4 && wy[i].length >= 4 && !/[\d{}[\]!|=]/.test(w + wy[i]) && editDistance(w, wy[i]) <= 2));
}

const stringify = (v) => JSON.stringify(v);
const rest = ({ checked, sections, definition, emergency, file, ...others }) => others;

// before / after: a card's split payload ({ card, data }) or undefined. Returns { tier, reasons } or null when nothing a reader
// or the fingerprint could see changed (only the checked stamp, for example).
export function classifyCard(before, after) {
  if (!before) return { tier: 'tier-2', reasons: ['new card (always tier 2)'] };
  if (!after) return { tier: 'tier-1', reasons: ['card removed'] };

  const pb = fingerprintParts(before), pa = fingerprintParts(after);
  if (fingerprint(before) !== fingerprint(after)) {
    const reasons = [];
    const keys = new Set([...Object.keys(pb.data), ...Object.keys(pa.data)]);
    const changedData = [...keys].filter((k) => stringify(pb.data[k]) !== stringify(pa.data[k])).sort();
    if (changedData.length) reasons.push(`changed ${changedData.length > 4 ? `${changedData.slice(0, 4).join(', ')} and ${changedData.length - 4} more` : changedData.join(', ')}`);
    if (stringify(pb.tokens) !== stringify(pa.tokens)) reasons.push('a number or insert in the card text changed');
    if (stringify(pb.cited) !== stringify(pa.cited)) reasons.push('a source citation on a clinical line changed');
    return { tier: 'tier-2', reasons };
  }

  const lb = readerLines(before.card), la = readerLines(after.card);
  const textSame = stringify(lb) === stringify(la);
  const otherSame = stringify(rest(before.card)) === stringify(rest(after.card)) && stringify(before.data) === stringify(after.data);
  if (textSame && otherSame) {
    // Only the stamp, or structure the lines cannot see: check the sections' raw JSON as a last guard.
    return stringify([before.card.sections, before.card.definition, before.card.emergency]) === stringify([after.card.sections, after.card.definition, after.card.emergency])
      ? null : { tier: 'tier-1', reasons: ['page structure changed'] };
  }
  const reasons = [];
  if (!textSame) {
    const tiny = lb.length === la.length && lb.every((l, i) => tinyChange(l, la[i]));
    if (tiny) reasons.push('only spacing, punctuation or tiny spelling changed');
    else reasons.push(lb.length === la.length ? 'wording changed' : `${la.length - lb.length > 0 ? 'lines added' : 'lines removed'} or moved`);
    if (tiny && otherSame) return { tier: 'tier-0', reasons };
    if (tiny) reasons.length = 0;
  }
  if (!otherSame) {
    const fields = Object.keys({ ...rest(before.card), ...rest(after.card) }).filter((k) => stringify(rest(before.card)[k]) !== stringify(rest(after.card)[k]));
    reasons.push(fields.length ? `card fields changed: ${fields.join(', ')}` : 'source or media records used by the card changed');
  }
  return { tier: 'tier-1', reasons };
}

// The gate. A tier-2 card passes when its stamp's fingerprint equals its current one (the stamp or carry command wrote it),
// or when it is a draft listed in content/unchecked.txt. Returns { ok, note }.
export function gateCard(card, currentFingerprint, unchecked) {
  if (card.checked?.fingerprint === currentFingerprint) return { ok: true, note: card.checked.carried ? `carried (${card.checked.carried})` : `stamped ${card.checked.by} ${card.checked.date}` };
  if (!card.checked && unchecked.includes(card.id)) return { ok: true, note: 'draft listed in content/unchecked.txt, not checked yet' };
  return { ok: false, note: card.checked ? 'stamp does not match: run checked:stamp (after the Opus check) or checked:carry' : 'no stamp: needs the Opus check and checked:stamp' };
}
