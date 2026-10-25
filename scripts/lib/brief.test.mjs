import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { updatedDate, parseCard, cardIndex, formatIndex, parseBacklog, lastMetricsRow } from './brief.mjs'

const card = (id, system, extra = '') => `---\nid: ${id}\ntype: topic\nsystem: ${system}\ntitle: "T ${id}"\n${extra}---\n## At a Glance\n- x\n`

describe('brief helpers', () => {
  it('shows the later of the stamp date and the carried date', () => {
    expect(updatedDate({ date: '2026-10-22', carried: '2026-10-24: reworded' })).toBe('2026-10-24')
    expect(updatedDate({ date: new Date('2026-10-25T00:00:00Z') })).toBe('2026-10-25')
    expect(updatedDate({ date: '2026-10-25', carried: '2026-10-20: older' })).toBe('2026-10-25')
    expect(updatedDate(undefined)).toBeNull()
  })

  it('reads a card front matter and tolerates a missing stamp', () => {
    expect(parseCard(card('a-b', 'psych', 'checked: { date: 2026-10-22, by: opus, scope: x, fingerprint: "f" }\n'))).toMatchObject({ id: 'a-b', type: 'topic', system: 'psych', title: 'T a-b', updated: '2026-10-22' })
    expect(parseCard(card('c-d', 'gi')).updated).toBeNull()
    expect(parseCard('no front matter')).toBeNull()
  })

  it('builds the index from content/cards, grouped by system, and counts examples', () => {
    const root = mkdtempSync(join(tmpdir(), 'brief-'))
    mkdirSync(join(root, 'content', 'cards', 'gi'), { recursive: true })
    mkdirSync(join(root, 'content', 'cards', 'psych'), { recursive: true })
    mkdirSync(join(root, 'content', 'examples'), { recursive: true })
    writeFileSync(join(root, 'content', 'cards', 'psych', 'psych-a.md'), card('psych-a', 'psych'))
    writeFileSync(join(root, 'content', 'cards', 'gi', 'gi-b.md'), card('gi-b', 'gi'))
    writeFileSync(join(root, 'content', 'examples', 'ex.md'), card('ex', 'gi'))
    const idx = cardIndex(root)
    expect(idx.cards.map((c) => c.id)).toEqual(['gi-b', 'psych-a'])
    expect(idx.examples).toBe(1)
    const lines = formatIndex(idx)
    expect(lines[0]).toBe('2 cards (+1 example). id [type, updated]:')
    expect(lines[1]).toContain('gi: gi-b [topic, no stamp]')
  })

  it('an empty or missing cards folder gives zero cards', () => {
    expect(cardIndex(mkdtempSync(join(tmpdir(), 'brief-'))).cards).toEqual([])
  })

  it('splits BACKLOG into next items and owed items', () => {
    const text = '# Backlog\n\n## Next\n1. First\n2. Second\n3. Third\n4. Fourth\n\n## Owed by the owner\n- Pick a thing\n\n## Later\n- Not shown\n'
    const b = parseBacklog(text)
    expect(b.next).toHaveLength(4)
    expect(b.next[0]).toBe('1. First')
    expect(b.owed).toEqual(['- Pick a thing'])
    expect(parseBacklog('nothing here')).toEqual({ next: [], owed: [] })
  })

  it('takes the last data row of the metrics table', () => {
    const t = '# Metrics\n\n| card | date | cost |\n|---|---|---|\n| a | 1 | $1 |\n| b | 2 | $2 |\n'
    expect(lastMetricsRow(t)).toBe('| b | 2 | $2 |')
    expect(lastMetricsRow('| card | date |\n|---|---|\n')).toBeNull()
    expect(lastMetricsRow('')).toBeNull()
  })
})
