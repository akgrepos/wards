import { describe, it, expect } from 'vitest'
import { parseWorktrees, countUnmerged, summarizeChecks, waitDecision, tidyDecision, findBundle, versionsIn, versionFromSource } from './workflow.mjs'

describe('workflow helpers', () => {
  it('parses worktrees with Windows paths and detached heads', () => {
    const t = parseWorktrees('worktree C:/Users/x/Wards\r\nHEAD abc\r\nbranch refs/heads/main\r\n\r\nworktree C:/Users/x/Wards/.claude/worktrees/a b\r\nHEAD def\r\nbranch refs/heads/feature/x\r\n\r\nworktree D:/d\r\nHEAD 1\r\ndetached\r\n')
    expect(t).toEqual([
      { path: 'C:/Users/x/Wards', branch: 'main' },
      { path: 'C:/Users/x/Wards/.claude/worktrees/a b', branch: 'feature/x' },
      { path: 'D:/d', branch: null },
    ])
  })
  it('counts unmerged cherry lines', () => {
    expect(countUnmerged('- aaa\n+ bbb\r\n+ ccc\n')).toBe(2)
    expect(countUnmerged('')).toBe(0)
  })
  it('summarizes checks', () => {
    expect(summarizeChecks([{ status: 'COMPLETED', conclusion: 'SUCCESS' }, { status: 'IN_PROGRESS' }, { status: 'COMPLETED', conclusion: 'FAILURE' }])).toEqual({ failed: 1, pending: 1, passed: 1 })
    expect(summarizeChecks(undefined)).toEqual({ failed: 0, pending: 0, passed: 0 })
  })
  it('decides wait-live', () => {
    const ok = { failed: 0, pending: 0, passed: 2 }
    expect(waitDecision({ state: 'OPEN', checks: { ...ok, failed: 1 }, liveMatches: false }).code).toBe(1)
    expect(waitDecision({ state: 'CLOSED', checks: ok, liveMatches: false }).code).toBe(1)
    expect(waitDecision({ state: 'OPEN', checks: ok, liveMatches: false }).done).toBe(false)
    expect(waitDecision({ state: 'MERGED', checks: ok, liveMatches: false }).done).toBe(false)
    expect(waitDecision({ state: 'MERGED', checks: ok, liveMatches: true }).code).toBe(0)
  })
  it('applies the tidy close rule', () => {
    const base = { branch: 'b', unmerged: 0, dirtyLines: [], isMainBranch: false }
    expect(tidyDecision(base).ok).toBe(true)
    expect(tidyDecision({ ...base, unmerged: 2 }).ok).toBe(false)
    expect(tidyDecision({ ...base, dirtyLines: [' M a'] }).ok).toBe(false)
    expect(tidyDecision({ ...base, isMainBranch: true }).ok).toBe(false)
  })
  it('reads versions and the bundle name', () => {
    expect(findBundle('<script src="/wards/assets/index-AbC.js"></script>')).toBe('assets/index-AbC.js')
    expect(versionsIn('x"2026.10.22.2"y')).toEqual(['2026.10.22.2'])
    expect(versionFromSource("export const APP_VERSION = '2026.10.23'")).toBe('2026.10.23')
  })
})
