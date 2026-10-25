// Number-only alias lint (docs/CONTENT-FORMAT.md, "Consistency rules"). An alias that is only digits, such as "988", breaks search.
// Warnings only: they print with the other content warnings and never fail the check.
const DIGITS_ONLY = /^\d+$/;

export function checkNumericAliases({ cards }) {
  const out = [];
  for (const c of cards) {
    for (const alias of c.aliases ?? []) {
      if (DIGITS_ONLY.test(String(alias).trim())) out.push(`${c.file}: alias "${alias}" is only digits; add words a clinician would search (docs/CONTENT-FORMAT.md, "Consistency rules")`);
    }
  }
  return out;
}
