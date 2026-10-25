// npm run brief [-- --since YYYY-MM-DD]: the one thing a Wards chat reads first. Prints what exists (card index from content/cards),
// what is in flight (open PRs with check state and auto-merge flag, worktrees), what shipped (last merges), what is planned
// (top of BACKLOG.md) and owed by the owner, the last metrics row, and sources due. Everything but BACKLOG is generated.
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'
import { git, run, ghJson, parseWorktrees, countUnmerged, summarizeChecks, liveVersion } from './lib/workflow.mjs'
import { computeVersion } from './lib/version.mjs'
import { notesDir, metricsFile, cardIndex, formatIndex, parseBacklog, lastMetricsRow, readIf } from './lib/brief.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const si = process.argv.indexOf('--since')
const since = si >= 0 ? process.argv[si + 1] : null
const tilde = (p) => p.replace(homedir(), '~')
const unmerged = (b) => {
  const o = git(['cherry', 'origin/main', b])
  return o === null ? null : countUnmerged(o)
}

git(['fetch', 'origin', '--prune', '--quiet'])

console.log('== What exists (check here before proposing any card)')
for (const line of formatIndex(cardIndex(root))) console.log(line)

console.log('== In flight: open PRs')
const open = ghJson(['pr', 'list', '--state', 'open', '--json', 'number,title,headRefName,isDraft,statusCheckRollup,autoMergeRequest']) ?? []
if (!open.length) console.log('  (none)')
for (const p of open) {
  const c = summarizeChecks(p.statusCheckRollup)
  const checks = c.failed ? `checks FAILING (${c.failed})` : c.pending ? `checks running (${c.pending})` : c.passed ? 'checks passed' : 'no checks'
  const merge = p.autoMergeRequest ? 'auto-merge ON' : 'auto-merge OFF'
  console.log(`  #${p.number} ${p.headRefName} ${p.isDraft ? '[draft] ' : ''}${p.title}  [${checks}; ${merge}]`)
}

console.log(since ? `== Shipped: merged PRs since ${since}` : '== Shipped: last 5 merged PRs')
const merged = ghJson(['pr', 'list', '--state', 'merged', '--limit', since ? '100' : '5', '--json', 'number,title,mergedAt']) ?? []
for (const p of merged.filter((p) => !since || p.mergedAt.slice(0, 10) >= since)) console.log(`  #${p.number} ${p.mergedAt.slice(0, 16)} ${p.title}`)

const backlogPath = join(notesDir(), 'BACKLOG.md')
const backlog = readIf(backlogPath)
console.log('== Planned: top of BACKLOG (the owner picks; the rest is in BACKLOG.md)')
if (backlog === null) console.log(`  (no BACKLOG.md at ${tilde(backlogPath)})`)
else {
  const { next, owed } = parseBacklog(backlog)
  for (const l of next.slice(0, 3)) console.log(`  ${l}`)
  if (!next.length) console.log('  (nothing listed under "## Next")')
  console.log('== Owed by the owner')
  if (!owed.length) console.log('  (nothing)')
  for (const l of owed) console.log(`  ${l}`)
}

console.log('== Last metrics row')
const metrics = readIf(metricsFile())
console.log(`  ${(metrics && lastMetricsRow(metrics)) || '(none yet)'}`)

console.log('== Sources due')
const due = join(root, 'scripts', 'sources-due.mjs')
if (existsSync(due)) console.log((run('node', [due]) ?? '  (sources-due failed)').replace(/^/gm, '  '))
else console.log('  (not built yet: roadmap step 10)')

const src = computeVersion('origin/main')
const live = await liveVersion()
const liveNote = !live.bundle
  ? 'could not read the live site'
  : live.versions.includes(src)
    ? 'live site matches'
    : `live site NOT yet showing it (found ${[...new Set(live.versions)].join(', ') || 'no version'})`
console.log(`== Version on origin/main: ${src}  (${liveNote})`)

console.log('== Worktrees (merged = nothing left to cherry-pick onto main)')
const trees = parseWorktrees(git(['worktree', 'list', '--porcelain']) ?? '')
for (const t of trees) {
  if (!t.branch) { console.log(`  (detached)  ${tilde(t.path)}`); continue }
  if (t.branch === 'main') { console.log(`  main checkout  ${tilde(t.path)}`); continue }
  const n = unmerged(t.branch)
  const dirty = (git(['-C', t.path, 'status', '--porcelain']) ?? '').split(/\r?\n/).filter(Boolean).length
  console.log(`  ${t.branch}  ${n === 0 ? 'MERGED' : `${n} unmerged commit(s)`}${dirty ? `, ${dirty} uncommitted` : ''}  ${tilde(t.path)}`)
}

const inTree = new Set(trees.map((t) => t.branch))
const loose = (git(['for-each-ref', '--format=%(refname:short)', 'refs/heads']) ?? '')
  .split(/\r?\n/)
  .filter((b) => b && b !== 'main' && !inTree.has(b))
if (loose.length) {
  console.log('== Local branches without a worktree')
  for (const b of loose) console.log(`  ${b}  ${unmerged(b) === 0 ? 'MERGED' : `${unmerged(b)} unmerged commit(s)`}`)
}
