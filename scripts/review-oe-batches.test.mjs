import { describe, it, expect } from 'vitest'
import { expandAbbreviations, subjectFromWhere, scrubSources, buildStatement, riskTier, orderEntries, chunk, renderBatch, planBatches } from './review-oe-batches.mjs'

const e = (o) => ({ id: 'e1', where: 'card X', claim: 'c', source: 'zzsrc-2020', status: 'match', ...o })

describe('review:oe-batches', () => {
  it('spells out abbreviations and short time units', () => {
    expect(expandAbbreviations('IV drug at K⁺ ≥6.0, ECG, AKI, SZC 1, 2 and 24 h or 30 min')).toBe(
      'intravenous drug at potassium ≥6.0, electrocardiogram, acute kidney injury, sodium zirconium cyclosilicate 1, 2 and 24 hours or 30 minutes',
    )
  })
  it('names the drug from a dose data file', () => {
    expect(subjectFromWhere('data/dose/foo-bar-hyperkalemia.yaml amount', 'Hyperkalemia')).toBe('Foo bar')
    expect(subjectFromWhere('data/dose/szc-hyperkalemia-maintenance.yaml x', 'Hyperkalemia')).toBe('Sodium zirconium cyclosilicate (maintenance)')
    expect(subjectFromWhere('card Do Now 1', 'Hyperkalemia')).toBeNull()
  })
  it('removes society names and flags that it did so', () => {
    const r = scrubSources('ZZSRC 2020: A lower dose worked (UK guideline).', ['zzsrc-2020'])
    expect(r.text).not.toMatch(/ZZSRC|UK guideline/i)
    expect(r.scrubbed).toBe(true)
    expect(scrubSources('Plain claim', ['zzsrc-2020']).scrubbed).toBe(false)
  })
  it('puts the drug and population into a fragment from a dose file, and keeps acronyms intact', () => {
    const s = buildStatement(e({ where: 'data/dose/foo-hyperkalemia.yaml onset', claim: 'Onset 1–3 minutes' }), { topic: 'Hyperkalemia', sourceIds: [] })
    expect(s.text).toBe('Foo for hyperkalemia in adults: onset 1–3 minutes.')
    expect(buildStatement(e({ claim: 'Give 10 units IV' }), { topic: 'T', sourceIds: [] }).text).toBe('Give 10 units intravenous.')
  })
  it('uses a hand-written override as is', () => {
    const s = buildStatement(e(), { topic: 'T', sourceIds: [], override: 'my own words' })
    expect(s).toMatchObject({ text: 'My own words.', overridden: true })
  })
  it('puts doses and Do Now lines first, thresholds and numbers next', () => {
    const list = [e({ id: 'a', claim: 'text only' }), e({ id: 'b', where: 'data/threshold/x.yaml value', claim: '>5' }), e({ id: 'c', where: 'data/dose/x.yaml amount', claim: '10 mg' }), e({ id: 'd', where: 'card Do Now 1' })]
    expect(riskTier(list[2])).toBe(0)
    expect(orderEntries(list).map((x) => x.id)).toEqual(['c', 'd', 'b', 'a'])
  })
  it('splits into even batches of about 25', () => {
    expect(chunk(Array.from({ length: 51 }, (_, i) => i)).map((g) => g.length)).toEqual([17, 17, 17])
    expect(chunk(Array.from({ length: 25 }, (_, i) => i)).map((g) => g.length)).toEqual([25])
    expect(chunk([])).toEqual([])
  })
  it('writes only the topic and a numbered list', () => {
    const out = renderBatch('Topic name', ['One.', 'Two.'])
    expect(out.split('\n')[0]).toBe('Topic: Topic name')
    expect(out).toContain('Topic: Topic name')
    expect(out).toContain('1. One.\n2. Two.')
  })
  it('skips owner-checked entries and never sends quotes or source names', () => {
    const ledger = {
      entries: [
        e({ id: 'a', claim: 'ZZSRC says 5 mg', quote: 'SECRET QUOTE', location: 'p. 9' }),
        e({ id: 'b', claim: 'checked', owner_checked: '2026-10-24', quote: '' }),
      ],
    }
    const { batches, skipped } = planBatches({ ledger, topic: 'T' })
    expect(skipped.map((x) => x.id)).toEqual(['b'])
    expect(batches).toHaveLength(1)
    const file = renderBatch('T', batches[0].map((x) => x.text))
    expect(file).not.toMatch(/SECRET|ZZSRC|p\. 9/i)
    expect(batches[0][0].entry.id).toBe('a')
  })
})
