import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { normalize } from './review-check.mjs'
import { pickBlind, windowAround, anchorsOf, otherOccurrences, candidatePassages, cardLines, cardExtract, buildAll, summary } from './review-packets.mjs'

// Synthetic text only: no real guideline wording in the repo.
const filler = (n, tag) => Array.from({ length: n }, (_, i) => `${tag}${i}`).join(' ')
const source = normalize(`${filler(300, 'a')} Give 20 mEq of potassium chloride over 1 hour. ${filler(300, 'b')} A later table lists 20 mEq for children. ${filler(50, 'c')} Insulin 10 units with 25 g glucose.`)
const texts = { src: source }

describe('review:packets', () => {
  it('takes a window of about 250 words each side of the quote', () => {
    const w = windowAround(source, 'Give 20 mEq of potassium chloride over 1 hour.')
    expect(w.text.split(' ')[0]).toBe('a50')
    expect(w.text).toContain('b249')
    expect(w.text).not.toContain('b250')
    expect(windowAround(source, 'not here')).toBeNull()
  })
  it('finds the same number-with-unit elsewhere, outside the window', () => {
    const w = windowAround(source, 'Give 20 mEq of potassium chloride over 1 hour.')
    const others = otherOccurrences(source, anchorsOf('Potassium chloride 20 mEq'), w)
    expect(others).toHaveLength(1)
    expect(others[0].snippet).toContain('children')
    expect(otherOccurrences(source, anchorsOf('20 mg'), null)).toEqual([])
  })
  it('offers number-anchored candidates when the quote is missing', () => {
    const c = candidatePassages(source, 'Insulin 10 units with 25 g glucose', 'something never written')
    expect(c[0].text).toContain('Insulin 10 units')
  })
  it('chooses a repeatable blind sample of about 10 percent, never fewer than 5', () => {
    expect([...pickBlind(92, 7)].sort()).toEqual([...pickBlind(92, 7)].sort())
    expect(pickBlind(92, 7).size).toBe(9)
    expect(pickBlind(20, 1).size).toBe(5)
    expect(pickBlind(3, 1).size).toBe(3)
    expect([...pickBlind(92, 7)]).not.toEqual([...pickBlind(92, 8)])
  })
  it('finds card lines by the quoted text, else by word overlap', () => {
    const card = '## Do Now\n1. Step\n   - Normal ECG: IV calcium not recommended. ^[x]\n   - Other line about insulin dosing'
    expect(cardLines(card, 'card Do Now 1 "Normal ECG: IV calcium not recommended"', '')[0]).toContain('[section: Do Now]')
    expect(cardLines(card, 'card Do Now', 'insulin dosing line')[0]).toContain('insulin')
  })
  it('reads the data file named in "where"', () => {
    const root = mkdtempSync(resolve(tmpdir(), 'pk-'))
    mkdirSync(resolve(root, 'content/data/dose'), { recursive: true })
    writeFileSync(resolve(root, 'content/data/dose/d.yaml'), 'amount: 10\nunit: g\n')
    expect(cardExtract({ root, cardId: 'c', where: 'data/dose/d.yaml amount', claim: '' })).toContain('amount: 10')
  })
  it('builds batches, hides blind quotes until the end, and measures', () => {
    const root = mkdtempSync(resolve(tmpdir(), 'pk-'))
    mkdirSync(resolve(root, 'content/cards/x'), { recursive: true })
    writeFileSync(resolve(root, 'content/cards/x/c.md'), '## Do Now\n- Potassium chloride 20 mEq over 1 hour.\n')
    const entries = Array.from({ length: 30 }, (_, i) => ({ id: `e${i}`, where: 'card Do Now "Potassium chloride 20 mEq"', claim: 'Potassium chloride 20 mEq over 1 hour', source: 'src', status: 'match', quote: 'Give 20 mEq of potassium chloride over 1 hour.', location: 'p1' }))
    entries[1].quote = 'invented sentence about 20 mEq'
    entries[2].source = 'gone'
    const result = buildAll({ ledger: { entries, unreadable_sources: ['paywalled'] }, texts, root, card: 'c', seed: 42 })
    expect(result.files.map((f) => f.name)).toEqual(['packets-001.md', 'packets-002.md'])
    expect(result.stats).toMatchObject({ packets: 30, blind: 5, seed: 42, entriesSourceMissing: 1, sourcesCited: 3, sourcesMissing: 2 })
    expect(result.stats.found).toBe(28)
    const all = result.files.map((f) => f.content).join('\n')
    expect(all).toContain('[quote-not-found]')
    expect(all).toContain('[source-missing]')
    expect(all).toContain('seed 42')
    expect(all).toContain('mean ')
    for (const f of result.files) {
      const [body, tail = ''] = f.content.split('# Writer’s quotes for the blind packets')
      const blindHere = (body.match(/\(BLIND\)/g) ?? []).length
      expect((tail.match(/^## Packet/gm) ?? []).length).toBe(blindHere)
      if (blindHere) expect(body.split('(BLIND)')[1].split('\n---\n')[0]).not.toContain('Writer’s quote** (location')
    }
    const out = summary('c', '/out', result)
    expect(out).toContain('blind sample: 5 packets, seed 42')
    expect(out).toContain('paywall rate')
  })
})
