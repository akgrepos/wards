import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { sourcesDue, formatDue } from './sources-due.mjs'

const make = () => {
  const root = mkdtempSync(join(tmpdir(), 'due-'))
  for (const d of ['cards/gi', 'data/source', 'data/dose']) mkdirSync(join(root, 'content', d), { recursive: true })
  const src = (id, kind, year) => writeFileSync(join(root, 'content', 'data', 'source', `${id}.yaml`), `kind: ${kind}\nyear: ${year}\ntitle: T\n`)
  src('old-guide-2010', 'guideline', 2010)
  src('new-guide-2025', 'guideline', 2025)
  src('some-trial-2005', 'trial', 2005)
  src('unused-guide-2001', 'guideline', 2001)
  src('label-x-2020', 'prescribing-information', 2020)
  writeFileSync(join(root, 'content', 'data', 'dose', 'x-dose.yaml'), 'sources: [label-x-2020]\n')
  writeFileSync(join(root, 'content', 'cards', 'gi', 'gi-a.md'), '---\nid: gi-a\n---\n- a ^[old-guide-2010]\n- b ^[new-guide-2025, some-trial-2005]\n\n{{dose:x-dose}}\n')
  writeFileSync(join(root, 'content', 'cards', 'gi', 'gi-b.md'), '---\nid: gi-b\n---\n- a ^[old-guide-2010]\n')
  return root
}

describe('sources due', () => {
  it('lists refreshable sources oldest first, counts cards (including inserted doses), skips trials and uncited sources', () => {
    const rows = sourcesDue(make())
    expect(rows.map((r) => r.id)).toEqual(['old-guide-2010', 'label-x-2020', 'new-guide-2025'])
    expect(rows[0].cards).toEqual(['gi-a', 'gi-b'])
    expect(rows[1].cards).toEqual(['gi-a'])
  })

  it('prints a line per source and handles an empty list', () => {
    expect(formatDue(sourcesDue(make()))[1]).toBe('2010   2 cards  guideline  old-guide-2010')
    expect(formatDue([])).toEqual(['(no cited guideline, label or review found)'])
  })
})
