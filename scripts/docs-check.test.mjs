import { describe, it, expect } from 'vitest'
import { checkReferences, checkDecisionsLength, checkVersionMentions, checkLeftovers, checkPrivacy, checkForbiddenWords, applyAllowlist, runChecks } from './docs-check.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ref = (text, present = ['README.md']) =>
  checkReferences({ file: 'docs/X.md', text, files: present, scripts: ['look', 'docs:check'], exists: (p) => present.includes(p) })

describe('docs:check', () => {
  it('flags missing files and scripts, skips outside-repo paths, branches and units', () => {
    const r = ref('`README.md` `docs/gone.md` `npm run nope` `npm run look` `~/Documents/x.md` `claude/foo` `mg/kg/h` `sketch/`')
    expect(r.map((f) => f.message)).toEqual(['`docs/gone.md` does not exist in the repo.', '`npm run nope` is not a script in package.json.'])
    expect(r[0]).toMatchObject({ rule: 'broken-reference', file: 'docs/X.md', line: 1 })
  })
  it('accepts a "no folder" statement', () => {
    expect(ref('no `docs/screenshots/` folders', ['docs/a.md'])).toEqual([])
  })
  it('warns on long DECISIONS rows only from the cutoff date', () => {
    const long = 'x'.repeat(800)
    const text = `| 2026-10-23 | ${long} | y |\n| 2026-10-24 | ${long} | y |\n| 2026-10-24 | short | y |`
    const r = checkDecisionsLength({ file: 'docs/DECISIONS.md', text })
    expect(r).toHaveLength(1)
    expect(r[0]).toMatchObject({ line: 2, level: 'warning' })
  })
  it('flags STATUS versions that differ from src/version.ts', () => {
    const r = checkVersionMentions({ file: 'docs/STATUS.md', text: 'live version 2026.10.23.8\nversion 2026.10.24.7 ok', current: '2026.10.24.7' })
    expect(r).toHaveLength(1)
    expect(r[0].line).toBe(1)
  })
  it('flags docs/screenshots as a place for files, not as a ban', () => {
    expect(checkLeftovers({ file: 'a.md', text: 'save to docs/screenshots/' })).toHaveLength(1)
    expect(checkLeftovers({ file: 'a.md', text: 'never use docs/screenshots/' })).toEqual([])
  })
  it('flags email addresses and real home paths', () => {
    expect(checkPrivacy({ file: 'a.md', text: 'me@gmail.com' })).toHaveLength(1)
    expect(checkPrivacy({ file: 'a.md', text: '/Users/jane/x and /Users/name/x' })).toHaveLength(1)
  })
  it('flags source names in card content', () => {
    expect(checkForbiddenWords({ file: 'c.yaml', text: 'see AMBOSS' })).toHaveLength(1)
    expect(checkForbiddenWords({ file: 'c.yaml', text: 'fine' })).toEqual([])
  })
  it('allowlist hides matching findings and reports unused entries', () => {
    const f = [{ rule: 'leftover', file: 'a.md', line: 1, level: 'error', message: 'hello world' }]
    expect(applyAllowlist(f, [{ rule: 'leftover', file: 'a.md', text: 'world', reason: 'r' }])).toEqual({ kept: [], unused: [] })
    expect(applyAllowlist(f, [{ rule: 'leftover', file: 'b.md', text: 'world', reason: 'r' }]).unused).toHaveLength(1)
  })
  it('passes on this repo', () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
    expect(runChecks(root).kept.filter((f) => f.level === 'error')).toEqual([])
  })
})
