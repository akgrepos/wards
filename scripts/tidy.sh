#!/bin/bash
# scripts/tidy.sh <branch>: the close rule. Shows unmerged commits; refuses if any or if the worktree has
# uncommitted changes; otherwise removes the worktree and the local branch. Run from any checkout of the repo.
br="${1:?Usage: scripts/tidy.sh <branch>}"
git fetch origin --prune --quiet 2>/dev/null
echo "git cherry origin/main $br:"; cherry=$(git cherry origin/main "$br") || exit 1
echo "${cherry:-  (nothing)}"
echo "$cherry" | grep -q '^+' && { echo "REFUSED: $br has commits not on main."; exit 1; }
path=$(git worktree list --porcelain | awk -v b="refs/heads/$br" '/^worktree /{p=$2} $1=="branch" && $2==b {print p}')
if [ -n "$path" ]; then
  rm -f "$path/.DS_Store"
  [ -n "$(git -C "$path" status --porcelain)" ] && { echo "REFUSED: uncommitted changes in $path:"; git -C "$path" status --short; exit 1; }
  git worktree remove "$path" || exit 1
  echo "Removed worktree $path"
fi
git branch -D "$br" >/dev/null && echo "Deleted local branch $br"
