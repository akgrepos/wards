// npm run tidy -- <branch> [--dry-run]: the close rule. Refuses if the branch has commits not on main or its worktree has
// uncommitted changes; otherwise removes the worktree and the local branch. --dry-run only reports what it would do.
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { git, run, parseWorktrees, countUnmerged, tidyDecision } from './lib/workflow.mjs'

const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const branch = args.find((a) => !a.startsWith('--'))
if (!branch) {
  console.error('Usage: npm run tidy -- <branch> [--dry-run]')
  process.exit(1)
}

git(['fetch', 'origin', '--prune', '--quiet'])
const cherry = git(['cherry', 'origin/main', branch])
if (cherry === null) {
  console.error(`Cannot compare ${branch} with origin/main (does the branch exist?)`)
  process.exit(1)
}
console.log(`git cherry origin/main ${branch}:\n${cherry || '  (nothing)'}`)

const tree = parseWorktrees(git(['worktree', 'list', '--porcelain']) ?? '').find((t) => t.branch === branch)
if (tree && !dry) for (const junk of ['.DS_Store', 'Thumbs.db']) rmSync(join(tree.path, junk), { force: true })
const dirtyLines = tree ? (git(['-C', tree.path, 'status', '--porcelain']) ?? '').split(/\r?\n/).filter(Boolean) : []

const d = tidyDecision({ branch, unmerged: countUnmerged(cherry), dirtyLines, isMainBranch: branch === 'main' })
if (!d.ok) {
  console.error(d.reason)
  process.exit(1)
}

if (tree) {
  if (dry) console.log(`DRY RUN: would remove worktree ${tree.path}`)
  else {
    // If the shell is sitting inside the worktree, step out first or Windows will lock it.
    if (process.cwd().toLowerCase().startsWith(tree.path.toLowerCase())) process.chdir(join(tree.path, '..'))
    const ok = run('git', ['worktree', 'remove', tree.path]) !== null
    if (!ok || existsSync(tree.path)) {
      console.error(`Could not fully remove ${tree.path}. Something is probably using it (a terminal, editor, dev server or a Claude session). Close it and run this again; the branch was left alone.`)
      process.exit(1)
    }
    console.log(`Removed worktree ${tree.path}`)
  }
}
if (dry) {
  console.log(`DRY RUN: would delete local branch ${branch}`)
  process.exit(0)
}
if (run('git', ['branch', '-D', branch]) === null) {
  console.error(`Could not delete branch ${branch}`)
  process.exit(1)
}
console.log(`Deleted local branch ${branch}`)
