import { describe, it, expect } from 'vitest'
import { checkLedger, compareNumbers, normalize, stripHeader, report } from './review-check.mjs'

const texts = {
  src: normalize('Give 20 mEq of potassium chloride over 1 hour.\nGive 10 units insulin with 25 g glucose (50 ml of 50%).'),
}
const entry = (o) => ({ id: 'e1', where: 'card', claim: '', source: 'src', status: 'match', ...o })
const run = (...entries) => checkLedger({ ledger: { entries }, texts })

describe('review:check', () => {
  it('passes a verbatim quote with agreeing numbers', () => {
    const r = run(entry({ claim: 'Potassium chloride 20 mEq over 1 hour', quote: 'Give 20 mEq of potassium chloride over 1 hour.' }))
    expect(r.failures).toEqual([])
    expect(r.counts.match).toBe(1)
  })
  it('flags 40 mEq in the claim against 20 mEq in the quote', () => {
    const r = run(entry({ claim: 'Give 40 mEq of potassium chloride', quote: 'Give 20 mEq of potassium chloride' }))
    expect(r.failures.map((f) => f.rule)).toEqual(['number-mismatch'])
    expect(r.failures[0].message).toContain('40')
  })
  it('flags a changed unit on the same number', () => {
    expect(compareNumbers('20 mg', 'Give 20 mEq')).toHaveLength(1)
  })
  it('does not treat words after a number as units', () => {
    expect(compareNumbers('10 units insulin', '10 units soluble insulin')).toEqual([])
    expect(compareNumbers('30 mL of gluconate', '30 ml 10% calcium')).toEqual([])
  })
  it('ignores years, reads spelled-out numbers and accepts rounding', () => {
    expect(compareNumbers('UK guideline 2026: onset 1 hour, 3% prevalence', 'observed one hour after; the prevalence was 3.4%')).toEqual([])
    expect(compareNumbers('4% prevalence', 'the prevalence was 3.4%')).toHaveLength(1)
  })
  it('flags a quote that is not in the source text, ignoring whitespace and curly quotes', () => {
    expect(run(entry({ claim: 'x', quote: 'Give 20 mEq of  potassium\nchloride' })).failures).toEqual([])
    const r = run(entry({ claim: 'x', quote: 'Give 20 mEq of sodium chloride' }))
    expect(r.failures.map((f) => f.rule)).toEqual(['quote-not-found'])
  })
  it('lets a converted entry skip the number comparison', () => {
    const r = run(entry({ claim: 'below 126 mg/dL', quote: 'Give 20 mEq of potassium chloride', converted: '7.0 mmol/L x 18' }))
    expect(r.failures).toEqual([])
  })
  it('needs a note on partial, mismatch and no-support entries, and a quote on a match', () => {
    const r = run(entry({ status: 'partial', quote: 'over 1 hour' }), entry({ id: 'e2', status: 'match', quote: '' }), entry({ id: 'e3', status: 'no-support', quote: '' }))
    expect(r.failures.map((f) => [f.id, f.rule])).toEqual([['e1', 'missing-note'], ['e2', 'empty-quote'], ['e3', 'missing-note']])
    expect(r.counts).toMatchObject({ total: 3, partial: 1, match: 1, 'no-support': 1 })
  })
  it('reports a missing source text and a bad status', () => {
    const r = run(entry({ source: 'nope', quote: 'x' }), entry({ id: 'e2', status: 'ok' }))
    expect(r.failures.map((f) => f.rule)).toEqual(['source-missing', 'bad-status'])
  })
  it('strips the private header and page markers', () => {
    expect(stripHeader('# a\n# ---\nbody')).toBe('body')
    expect(normalize('a [[page 3]] b')).toBe('a b')
  })
  it('prints counts and every failure', () => {
    const out = report(run(entry({ claim: '40 mEq', quote: 'Give 20 mEq of potassium chloride' })), 'card-x')
    expect(out).toContain('card-x: 1 entries')
    expect(out).toContain('FAIL [number-mismatch] e1')
    expect(out).toContain('found 1 problem')
  })
})
