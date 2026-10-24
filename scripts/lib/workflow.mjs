// Shared helpers for the workflow scripts (status, wait-live, tidy). Pure functions are unit-tested in workflow.test.mjs.
import { execFileSync } from 'node:child_process'

export const SITE = 'https://akgrepos.github.io/wards/'
const VERSION_RE = /\d{4}\.\d{2}\.\d{2}(?:\.\d+)?/

/** Runs a command without a shell; returns trimmed stdout, or null if it failed. */
export function run(cmd, args, opts = {}) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trimEnd()
  } catch {
    return null
  }
}
export const git = (args, opts) => run('git', args, opts)
export const gh = (args, opts) => run('gh', args, opts)
export const ghJson = (args) => {
  const out = gh(args)
  return out ? JSON.parse(out) : null
}

export function versionFromSource(text) {
  const m = text.match(/APP_VERSION\s*=\s*'(\d{4}\.\d{2}\.\d{2}(?:\.\d+)?)'/)
  return m ? m[1] : (text.match(VERSION_RE) ?? [null])[0]
}

/** Finds the main script path in the site's HTML. */
export function findBundle(html) {
  return (html.match(/assets\/index[^"']*\.js/) ?? [null])[0]
}

export function versionsIn(js) {
  return js.match(new RegExp(VERSION_RE, 'g')) ?? []
}

/** Parses `git worktree list --porcelain` into [{ path, branch }]. */
export function parseWorktrees(text) {
  const out = []
  let cur = null
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd()
    if (line.startsWith('worktree ')) {
      cur = { path: line.slice(9), branch: null }
      out.push(cur)
    } else if (line.startsWith('branch ') && cur) cur.branch = line.slice(7).replace(/^refs\/heads\//, '')
  }
  return out
}

/** Number of commits `git cherry` reports as not on the base (lines starting with +). */
export function countUnmerged(cherryOutput) {
  return cherryOutput.split(/\r?\n/).filter((l) => l.startsWith('+')).length
}

/** Summarizes a PR's statusCheckRollup: { failed, pending, passed }. */
export function summarizeChecks(rollup) {
  let failed = 0, pending = 0, passed = 0
  for (const c of rollup ?? []) {
    if (c.status && c.status !== 'COMPLETED') pending++
    else if (['FAILURE', 'CANCELLED', 'TIMED_OUT', 'ACTION_REQUIRED', 'STARTUP_FAILURE'].includes(c.conclusion ?? c.state)) failed++
    else passed++
  }
  return { failed, pending, passed }
}

/** Decides what wait-live should do next for a PR. */
export function waitDecision({ state, checks, liveMatches }) {
  if (checks.failed > 0) return { done: true, code: 1, message: 'FAIL: the PR has a failing check' }
  if (state === 'CLOSED') return { done: true, code: 1, message: 'FAIL: the PR was closed without merging' }
  if (state === 'MERGED' && liveMatches) return { done: true, code: 0, message: 'LIVE' }
  return { done: false }
}

/** Tidy's close rule. Returns { ok, reason }. */
export function tidyDecision({ branch, unmerged, dirtyLines, isMainBranch }) {
  if (isMainBranch) return { ok: false, reason: `REFUSED: ${branch} is the main branch.` }
  if (unmerged > 0) return { ok: false, reason: `REFUSED: ${branch} has ${unmerged} commit(s) not on main.` }
  if (dirtyLines.length > 0) return { ok: false, reason: `REFUSED: uncommitted changes in the worktree:\n${dirtyLines.join('\n')}` }
  return { ok: true, reason: '' }
}

export async function liveVersion() {
  try {
    const html = await (await fetch(SITE, { cache: 'no-store' })).text()
    const bundle = findBundle(html)
    if (!bundle) return { bundle: null, versions: [] }
    const js = await (await fetch(SITE + bundle, { cache: 'no-store' })).text()
    return { bundle, versions: versionsIn(js) }
  } catch {
    return { bundle: null, versions: [] }
  }
}

// What the version part of sim-check should do, given the screen text and the version on origin/main.
// Returns { step: 'update' | 'open-settings' | 'ok' | 'mismatch', shown }.
export function versionStep(plain, want) {
  if (/Update Ready/i.test(plain)) return { step: 'update', shown: null }
  const shown = (plain.match(/\b\d{4}\.\d{2}\.\d{2}(?:\.\d+)?\b/) ?? [null])[0]
  if (!shown) return { step: 'open-settings', shown: null }
  return { step: shown === want ? 'ok' : 'mismatch', shown }
}
