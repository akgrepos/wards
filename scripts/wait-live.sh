#!/bin/bash
# scripts/wait-live.sh <pr-number> [expected-version]
# Waits (up to 10 min, polling every 20 s) until the PR's checks pass, the PR is merged, and the live site shows
# the version in src/version.ts on origin/main (or the expected one). Exit 0 = live; nonzero = one-line reason.
set -u
pr="${1:?Usage: scripts/wait-live.sh <pr-number> [expected-version]}"
want="${2:-}"
site="https://akgrepos.github.io/wards/"
end=$((SECONDS + 600)); state=""; live=""
while [ $SECONDS -lt $end ]; do
  info=$(gh pr view "$pr" --json state,statusCheckRollup --jq '[.state, ([.statusCheckRollup[]? | select(.conclusion=="FAILURE" or .conclusion=="CANCELLED" or .conclusion=="TIMED_OUT")] | length), ([.statusCheckRollup[]? | select(.status!="COMPLETED")] | length)] | @tsv' 2>/dev/null)
  state=$(echo "$info" | cut -f1); failed=$(echo "$info" | cut -f2); pending=$(echo "$info" | cut -f3)
  [ "${failed:-0}" -gt 0 ] && { echo "FAIL: PR $pr has a failing check (gh pr checks $pr)"; exit 1; }
  [ "$state" = "CLOSED" ] && { echo "FAIL: PR $pr was closed without merging"; exit 1; }
  if [ "$state" = "MERGED" ]; then
    git fetch origin main --quiet 2>/dev/null
    v="${want:-$(git show origin/main:src/version.ts | grep -o "[0-9]\{4\}\.[0-9]\{2\}\.[0-9]\{2\}\(\.[0-9]*\)\?" | head -1)}"
    js=$(curl -s "$site" | grep -o 'assets/index[^"]*\.js' | head -1)
    live=$([ -n "$js" ] && curl -s "$site$js" | grep -o "[0-9]\{4\}\.[0-9]\{2\}\.[0-9]\{2\}\(\.[0-9]*\)\?" | grep -Fx "$v" | head -1)
    [ -n "$live" ] && { echo "LIVE: PR $pr merged and $site shows version $v"; exit 0; }
  fi
  sleep 20
done
echo "TIMEOUT after 10 min: PR $pr is ${state:-unknown} (${pending:-?} checks pending); live version not ${want:-matching origin/main} yet"
exit 2
