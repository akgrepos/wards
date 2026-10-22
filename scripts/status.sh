#!/bin/bash
# scripts/status.sh: one-call check-in: open PRs, last 5 merged PRs, live version, branches and worktrees.
git fetch origin --prune --quiet 2>/dev/null
echo "== Open PRs"; gh pr list --state open --json number,title,headRefName,isDraft --jq '.[] | "#\(.number) \(.headRefName) \(if .isDraft then "[draft] " else "" end)\(.title)"'
echo "== Last 5 merged PRs"; gh pr list --state merged --limit 5 --json number,title,mergedAt --jq '.[] | "#\(.number) \(.mergedAt[:16]) \(.title)"'
echo "== Version on origin/main: $(git show origin/main:src/version.ts | grep -o "[0-9]\{4\}\.[0-9]\{2\}\.[0-9]\{2\}\(\.[0-9]*\)\?" | head -1)"
echo "== Worktrees (branch: merged = nothing left to cherry-pick onto main)"
git worktree list --porcelain | awk '/^worktree /{p=$2} /^branch /{sub("refs/heads/","",$2); print p, $2}' | while read -r path br; do
  [ "$br" = "main" ] && { echo "  main checkout  $path"; continue; }
  n=$(git cherry origin/main "$br" 2>/dev/null | grep -c '^+')
  dirty=$(git -C "$path" status --porcelain 2>/dev/null | grep -vc '^$')
  echo "  $br  $([ "$n" = 0 ] && echo MERGED || echo "$n unmerged commit(s)")$([ "$dirty" != 0 ] && echo ", $dirty uncommitted")  ${path/#$HOME/~}"
done
echo "== Local branches without a worktree"
wt=$(git worktree list --porcelain | sed -n 's#^branch refs/heads/##p')
git for-each-ref --format='%(refname:short)' refs/heads | while read -r b; do
  echo "$wt" | grep -qx "$b" && continue
  n=$(git cherry origin/main "$b" 2>/dev/null | grep -c '^+'); echo "  $b  $([ "$n" = 0 ] && echo MERGED || echo "$n unmerged commit(s)")"
done
