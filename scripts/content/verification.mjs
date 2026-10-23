// The dose verification record (docs/DATA-TYPES.md, "Verification note"): every dose, and every in-app calculator,
// says which source its numbers were checked against and how that source was read.
export const VERIFICATION_READS = ['fda-label', 'full-text', 'abstract', 'common-practice', 'not-verified'];
export const VERIFICATION_FIELDS = ['source', 'read', 'date'];
const DOC = 'docs/DATA-TYPES.md, "Verification note"';

// Returns a list of plain-language problems (empty when the note is complete and consistent).
export function checkVerification(item, data) {
  const v = item.verification;
  if (v === undefined) return [`has no "verification" note: say which source its numbers were checked against and how it was read (fda-label, full-text, abstract), mark it common-practice, or record not-verified (${DOC})`];
  if (!v || typeof v !== 'object' || Array.isArray(v)) return [`"verification" must be { read, source, date } (${DOC})`];
  const out = [];
  for (const f of Object.keys(v)) if (!VERIFICATION_FIELDS.includes(f)) out.push(`unknown verification field "${f}" (use ${VERIFICATION_FIELDS.join(', ')})`);
  if (!VERIFICATION_READS.includes(v.read)) { out.push(`verification "read" must be one of ${VERIFICATION_READS.join(', ')} (${DOC})`); return out; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v.date ?? ''))) out.push('verification needs a "date" written YYYY-MM-DD');
  const sources = item.sources ?? [];
  if (v.source !== undefined && !sources.includes(v.source)) out.push(`verification source "${v.source}" must be one of the item's own sources`);
  if (['fda-label', 'full-text', 'abstract'].includes(v.read)) {
    if (!v.source) out.push(`verification read "${v.read}" needs the "source" that was read`);
    else if (v.read === 'fda-label' && data.source?.[v.source]?.kind !== 'prescribing-information') out.push(`verification read "fda-label" needs a source that is a prescribing-information label ("${v.source}" is not)`);
  }
  if (v.read === 'common-practice' && !sources.includes('common-practice')) out.push('verification "common-practice" is only for an item that cites the common-practice source');
  return out;
}
