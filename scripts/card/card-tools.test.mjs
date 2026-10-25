import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { norm, numbersIn, loadQuotes, claimRows } from './lib.mjs'
import { checkNumbers } from './claim-numbers.mjs'

function packet() {
  const dir = mkdtempSync(join(tmpdir(), 'packet-'))
  writeFileSync(join(dir, 'jobs.json'), JSON.stringify({ AA: 'src-a' }))
  writeFileSync(join(dir, 'src-a.txt'), 'Give 40 mg daily. The “range” is 5 to 10 mg.')
  writeFileSync(join(dir, 'out-src-a.jsonl'), [
    JSON.stringify({ id: '1', quote: 'Give 40 mg daily.', where: 'p1' }),
    JSON.stringify({ id: '2', quote: 'Not in the source at all.', where: 'p2' }),
    JSON.stringify({ id: '3', quote: null }),
  ].join('\n'))
  return dir
}

describe('card tools', () => {
  it('normalizes quotes and spacing', () => {
    expect(norm('A  “b”\n c')).toBe('a "b" c')
  })
  it('reads numbers but skips markers, inserts and gene names', () => {
    expect(numbersIn('Give 40 mg ^[x-2024] {{dose:y-5}} CYP3A4')).toEqual(['40'])
  })
  it('flags a card number missing from its quote', () => {
    const dir = packet()
    const rows = [
      { tier: 'A', text: 'Give 40 mg daily', ids: ['AA:1'] },
      { tier: 'A', text: 'Give 45 mg daily', ids: ['AA:1'] },
      { tier: 'B', text: 'Give 40 mg daily', ids: ['AA:9'] },
    ]
    const r = checkNumbers(['- Give 40 mg daily', '- Give 45 mg daily'], rows, loadQuotes(dir))
    expect(r.ok).toBe(1)
    expect(r.bad).toBe(2)
    expect(r.noQuote).toBe(1)
  })
  it('parses claim rows and ignores other lines', () => {
    const dir = packet()
    writeFileSync(join(dir, 'claims.txt'), '# comment\nA | text | AA:1, AA:2\nnot a row\n')
    expect(claimRows(join(dir, 'claims.txt'))).toEqual([{ tier: 'A', text: 'text', ids: ['AA:1', 'AA:2'] }])
  })
  it('quote-verify marks verbatim, not verbatim and not found', () => {
    const out = execFileSync('node', [join(import.meta.dirname, 'quote-verify.mjs'), packet()], { encoding: 'utf8' })
    expect(out).toContain('"verbatim":1')
    expect(out).toContain('"notVerbatim":1')
    expect(out).toContain('"notFound":1')
  })
})
