// npm run wait-live -- <pr> [expected-version]
// Run once; it blocks (up to 10 min) until the PR's checks pass, the PR is merged, and the live site shows the version in
// src/version.ts on origin/main (or the expected one). Exit 0 = live, 1 = failed or closed, 2 = timed out. It does not
// merge the PR: merge it yourself with `gh pr merge --rebase` once checks pass (this waits for the merge too).
import { git, ghJson, summarizeChecks, waitDecision, liveVersion, SITE } from './lib/workflow.mjs'
import { computeVersion } from './lib/version.mjs'

const [pr, want] = process.argv.slice(2)
if (!pr) {
  console.error('Usage: npm run wait-live -- <pr-number> [expected-version]')
  process.exit(1)
}
const end = Date.now() + 10 * 60 * 1000
let state = 'unknown'
let checks = { failed: 0, pending: 0, passed: 0 }

while (Date.now() < end) {
  const info = ghJson(['pr', 'view', pr, '--json', 'state,statusCheckRollup'])
  if (info) {
    state = info.state
    checks = summarizeChecks(info.statusCheckRollup)
  }
  let liveMatches = false
  let v = want
  if (state === 'MERGED') {
    git(['fetch', 'origin', 'main', '--quiet'])
    v = want ?? computeVersion('origin/main')
    liveMatches = (await liveVersion()).versions.includes(v)
  }
  const d = waitDecision({ state, checks, liveMatches })
  if (d.done) {
    console.log(d.code === 0 ? `LIVE: PR ${pr} merged and ${SITE} shows version ${v}` : `${d.message} (gh pr checks ${pr})`)
    process.exit(d.code)
  }
  await new Promise((r) => setTimeout(r, 20000))
}
console.log(`TIMEOUT after 10 min: PR ${pr} is ${state} (${checks.pending} checks pending); live version not ${want ?? 'matching origin/main'} yet`)
process.exit(2)
