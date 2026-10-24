import { describe, it, expect } from 'vitest'
import { parse } from 'yaml'
import { normalizeVerdict, parseOeAnswer, applyToLedger, summarize } from './review-oe-read.mjs'
import { checkLedger, report } from './review-check.mjs'

const ANSWER = `
**Governing guidelines:** Society X, Title, 2024.

| # | Statement (short) | Verdict | What the source says | Source | Discrepancy or note |
|---|---|---|---|---|---|
| 1 | Drug A 5 mg IV | Supported | 5 mg IV once | Society X 2024, rec 3.1 (1B) | – |
| 2 | Drug A onset | **Partly supported** | onset 5–10 minutes | Label 2023 | Statement says 1–3 minutes |
| 3 | Threshold | Contradicted | ≥7.0 | Society X 2024 | Correct value is 7.0 | extra pipe text |
| 4 | Practice item | Supported (practice, no guideline) | – | – | – |
| 5 | Unknown thing | No evidence found | – | – | – |
| 6 | Broken row | Maybe? | – | – | – |
| nonsense | Supported | x | y | z |

**Conflicts:** None
**Outdated:** Drug B withdrawn 2024 (affects #2).
- second line
**Dose safety:**
- #2 missing maximum dose

Re-check in Snow: #2, #3, 5-6
`

describe('review:oe-read', () => {
  it('normalizes verdict wording', () => {
    expect(normalizeVerdict('**Partly supported**')).toBe('Partly supported')
    expect(normalizeVerdict('supported (practice, no guideline)')).toBe('Supported (practice, no guideline)')
    expect(normalizeVerdict('Supported')).toBe('Supported')
    expect(normalizeVerdict('No evidence found')).toBe('No evidence found')
    expect(normalizeVerdict('Contradicted')).toBe('Contradicted')
    expect(normalizeVerdict('Maybe')).toBeNull()
  })
  it('parses the table, the three lists and the re-check line, and reports rows it cannot read', () => {
    const p = parseOeAnswer(ANSWER)
    expect(p.rows.map((r) => [r.n, r.verdict])).toEqual([[1, 'Supported'], [2, 'Partly supported'], [3, 'Contradicted'], [4, 'Supported (practice, no guideline)'], [5, 'No evidence found']])
    expect(p.rows[1]).toMatchObject({ says: 'onset 5–10 minutes', source: 'Label 2023', note: 'Statement says 1–3 minutes' })
    expect(p.rows[2].note).toContain('Correct value is 7.0')
    expect(p.unparsed).toHaveLength(2)
    expect(p.lists.conflicts).toBe('None')
    expect(p.lists.outdated).toContain('Drug B withdrawn 2024')
    expect(p.lists.outdated).toContain('second line')
    expect(p.lists.doseSafety).toContain('missing maximum dose')
    expect(p.recheck).toEqual([2, 3, 5, 6])
  })
  it('tolerates a table without outer pipes or a separator row, and "Re-check in Snow: none"', () => {
    const p = parseOeAnswer('# | Statement | Verdict | What the source says | Source | Discrepancy or note\n1. | A | Supported | s | src | n\n\nRe-check in Snow: none')
    expect(p.rows).toHaveLength(1)
    expect(p.rows[0].n).toBe(1)
    expect(p.recheck).toEqual([])
    expect(p.recheckFound).toBe(true)
  })
  it('reads columns by header name when the order differs', () => {
    const p = parseOeAnswer('| # | Verdict | Statement (short) | Source | What the source says | Discrepancy or note |\n|--|--|--|--|--|--|\n| 1 | Supported | S | the source | the says | the note |')
    expect(p.rows[0]).toMatchObject({ statement: 'S', source: 'the source', says: 'the says', note: 'the note' })
  })
  const LEDGER = `# top comment
card: c
entries:
  # section comment
  - id: a
    claim: "Drug A 5 mg"
    quote: "five mg"
    status: match
  - id: b
    claim: "Other"
    quote: "x"
    status: partial
    note: "writer note"
`
  it('writes oe onto the mapped entries and leaves the quote, status and comments alone', () => {
    const p = parseOeAnswer(ANSWER)
    const r = applyToLedger(LEDGER, { batch: 'batch-01', entries: { 1: 'a', 2: 'b' } }, p, '2026-01-02')
    expect(r.applied.map((x) => x.id)).toEqual(['a', 'b'])
    expect(r.unmapped).toEqual([3, 4, 5])
    expect(r.text).toContain('# top comment')
    expect(r.text).toContain('# section comment')
    const out = parse(r.text)
    expect(out.entries[0]).toMatchObject({ quote: 'five mg', status: 'match', oe: { date: '2026-01-02', verdict: 'Supported', batch: 'batch-01' } })
    expect(out.entries[1]).toMatchObject({ status: 'partial', note: 'writer note', oe: { verdict: 'Partly supported', note: 'Statement says 1–3 minutes' } })
  })
  it('summarizes counts, non-Supported rows, missing rows and the re-check numbers', () => {
    const p = parseOeAnswer(ANSWER)
    const map = { batch: 'batch-01', entries: { 1: 'a', 2: 'b', 7: 'zz' } }
    const r = applyToLedger(LEDGER, map, p, '2026-01-02')
    const out = summarize({ card: 'c', batch: 'batch-01', parsed: p, applied: r.applied, unmapped: r.unmapped, map, ledger: parse(r.text) })
    expect(out).toContain('Supported 1, Partly supported 1')
    expect(out).toContain('#2 Partly supported [b]')
    expect(out).toContain('OpenEvidence note: Statement says 1–3 minutes')
    expect(out).toContain('No row found for statement(s): #7')
    expect(out).toContain('2 table row(s) could not be parsed')
    expect(out).toContain('Re-check in Snow: #2, #3, #5, #6')
  })
  it('review:check counts the OpenEvidence verdicts', () => {
    const ledger = { entries: [
      { id: 'a', where: 'w', claim: 'x', source: 's', status: 'match', quote: 'q', oe: { verdict: 'Supported' } },
      { id: 'b', where: 'w', claim: 'x', source: 's', status: 'match', quote: 'q', oe: { verdict: 'Contradicted' } },
      { id: 'c', where: 'w', claim: 'x', source: 's', status: 'match', quote: 'q' },
    ] }
    const res = checkLedger({ ledger, texts: { s: 'q' } })
    expect(res.counts.oe).toMatchObject({ checked: 2, byVerdict: { Supported: 1, Contradicted: 1 } })
    const out = report(res, 'c')
    expect(out).toContain('OpenEvidence check: 2 of 3 entries have a verdict (Supported 1, Contradicted 1).')
    expect(out).toContain('Not plain Supported: b (Contradicted)')
  })
})
