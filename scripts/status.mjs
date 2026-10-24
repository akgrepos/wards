// npm run status [-- --since YYYY-MM-DD]: one-call check-in: open PRs with check state, merged PRs (last 5, or since a date),
// version on origin/main vs the live site, worktrees and local branches (merged ones marked).
import { homedir } from 'node:os'
import { git, ghJson, parseWorktrees, countUnmerged, summarizeChecks, liveVersion } from './lib/workflow.mjs'
import { computeVersion } from './lib/version.mjs'

const si = process.argv.indexOf('--since')
const since = si >= 0 ? process.argv[si + 1] : null
const tilde = (p) => p.replace(homedir(), '~')
const unmerged = (b) => {
  const o = git(['cherry', 'origin/main', b])
  return o === null ? null : countUnmerged(o)
}

git(['fetch', 'origin', '--prune', '--quiet'])

console.log('== Open PRs')
const open = ghJson(['pr', 'list', '--state', 'open', '--json', 'number,title,headRefName,isDraft,statusCheckRollup']) ?? []
if (!open.length) console.log('  (none)')
for (const p of open) {
  const c = summarizeChecks(p.statusCheckRollup)
  const checks = c.failed ? `checks FAILING (${c.failed})` : c.pending ? `checks running (${c.pending})` : c.passed ? 'checks passed' : 'no checks'
  console.log(`  #${p.number} ${p.headRefName} ${p.isDraft ? '[draft] ' : ''}${p.title}  [${checks}]`)
}

console.log(since ? `== Merged PRs since ${since}` : '== Last 5 merged PRs')
const merged = ghJson(['pr', 'list', '--state', 'merged', '--limit', since ? '100' : '5', '--json', 'number,title,mergedAt']) ?? []
for (const p of merged.filter((p) => !since || p.mergedAt.slice(0, 10) >= since)) console.log(`  #${p.number} ${p.mergedAt.slice(0, 16)} ${p.title}`)

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

console.log('== Local branches without a worktree')
const inTree = new Set(trees.map((t) => t.branch))
for (const b of (git(['for-each-ref', '--format=%(refname:short)', 'refs/heads']) ?? '').split(/\r?\n/).filter(Boolean)) {
  if (inTree.has(b) || b === 'main') continue
  const n = unmerged(b)
  console.log(`  ${b}  ${n === 0 ? 'MERGED' : `${n} unmerged commit(s)`}`)
}
