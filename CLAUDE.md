# Notes for Claude

## Who this is for
The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon.

## How to work here
- **Don't build anything the owner hasn't asked for.** Propose options, wait for a decision, then build only what was agreed. Answering a question is not permission to build.
- **Branch workflow:** never commit to `main` directly. Start a short-lived branch per task (`setup/…`, `feature/…`, `fix/…`, `content/…`), commit there, push, and open a pull request with a plain-language summary and simulator screenshots.
- **Merging is yours:** merge the PR yourself once automated checks are green and your simulator check passes, then delete the branch. The owner reviews by using the app and asks for changes in chat. Never merge with a failing check.
- **Testing every change:** run it in the iOS 27 Simulator in Safari, added to the Home Screen (standalone), in light and dark mode and at least two text sizes. Attach screenshots to the PR.
- **Releases:** bump the date-based version (`YYYY.MM.DD`, `.2` for a second release that day) and add a plain-language entry to `CHANGELOG.md` in any PR that changes what the owner sees.
- Record every decision in `docs/DECISIONS.md` (date, what, why). Move items out of "Open questions" when they're settled.
- `main` is deployed to the live app; anything merged reaches the owner's phone after they tap "Update ready · Reload".

## Hard rules
- No patient information (PHI) in the repo, the app, issues, or commit messages. The site and repo are public.
- Nothing sensitive or institution-internal (internal protocols, phone or pager numbers).
- Clinical content needs a source. Never present generated medical content as verified (authorship/verification rules are still an open question).
- All content edits happen through Claude in chat; there is no in-app editing.

## Stack (decided, not yet set up)
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions for PR checks and deploy to Pages, Dependabot. Content as files in the repo. Must follow the iPhone's Text Size (Dynamic Type) and light/dark appearance; `noindex` + `robots.txt`.

## Design
- Use the AKG Design System: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (read its `project/README.md` first). Don't invent colors, type sizes or components outside it; propose additions to the design system instead.

## Accounts
- GitHub: `akgrepos`. Repo: https://github.com/akgrepos/wards. Live address: https://akgrepos.github.io/wards/
