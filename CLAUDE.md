# Notes for Claude

## Who this is for
The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon.

## How to work here
- **Don't build anything the owner hasn't asked for.** Propose options, wait for a decision, then build only what was agreed. Answering a question is not permission to build.
- **One branch and pull request per task.** Never commit to `main` (it's protected). Branch names: `setup/…`, `feature/…`, `fix/…`, `content/…`. Open the PR with a plain-language summary.
- **Merge it yourself** with `gh pr merge --rebase` (the only method allowed) once the checks pass and testing below is done. Branches delete themselves. Never merge with a failing check. The owner reviews by using the app and asks for changes in chat.
- **Test in proportion to the change** (iOS 27 Simulator, Safari):
  - *Visible change:* add to the Home Screen and check light and dark at two text sizes. Put screenshots in `docs/screenshots/<date>-<topic>/` and show them in the PR. Bump the version in `src/version.ts` (`YYYY.MM.DD`, `.2` for a second release that day) and add a plain-language `CHANGELOG.md` entry; a test enforces that the two match.
  - *Behind-the-scenes change (build, security, tools):* a quick check that the app opens, works offline and still offers updates. No screenshots or version bump.
  - *Notes only, or a Dependabot PR with nothing visible:* the automatic checks are enough. Read a Dependabot PR's changes before merging.
- **Record decisions** in `docs/DECISIONS.md` (date, what, why) and keep `docs/STATUS.md` a short current snapshot. Move items out of "Open questions" when settled.
- `main` publishes to the live app automatically; the owner gets it after tapping Reload on the "Update Ready" banner.

## Hard rules
- No patient information (PHI) anywhere: repo, app, pull requests or commit messages. The site and repo are public.
- Nothing sensitive or institution-internal (internal protocols, phone or pager numbers).
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; refer to them as "the owner". Commits must be authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- **Clinical content:** Claude writes it, evidence-based, and every claim cites its primary source (rules in DECISIONS.md, "Sources"). Never cite the reference handbook or OpenEvidence; cite AMBOSS only when its primary guideline can't be found. Summarize, never copy, any source's text. Run the internal accuracy check (DECISIONS.md) on every card, with extra care for doses.
- Copyrighted reference material (the reference handbook PDF in `~/Documents/Wards-reference/`) never goes into the repo.
- All content edits happen through Claude in chat; there is no in-app editing.
- Use precise medical terminology (hypoxemia, not "low oxygen"); lay terms and abbreviations only as search aliases.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages), Dependabot. Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines by the page's `noindex` tag, and limited to its own scripts by a security policy in `index.html`. How to run it: see README.

## Design
- Use the AKG Design System: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (read its `project/README.md` first). Don't invent colors, type sizes or components outside it; propose additions to the design system instead.
- The app uses a copy in `vendor/akg/`; `vendor/akg/VERSION.md` says which version and how to update it. `npm run tokens` turns its tokens into `src/design/tokens.css` (iOS text styles in rem so they follow Text Size).
- Second pass (2026-10-16): four themes (`ios-light`, `ios-dark`, `macos-light`, `macos-dark`, set by `data-theme` on `<html>`), 43 text styles, and 30 React components under `AKG`. The README's "Choosing controls by platform" table says which to use where.
- The design system is shared across AKG projects. Change it only when the owner asks, and keep it generic (nothing Wards-specific).

## Where things stand
See `docs/STATUS.md`.

## Accounts
- GitHub: `akgrepos`. Repo: https://github.com/akgrepos/wards. Live address: https://akgrepos.github.io/wards/
