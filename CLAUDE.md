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

- **End of a chat:** when the owner says to wrap up (or is done for the day), follow the `wards-wrap-up` skill in the owner's Claude settings: finish or park work, stop servers, clean Git and files, update STATUS/DECISIONS/memory, and leave a "Start here next time" handoff.

## Hard rules
- No patient information (PHI) anywhere: repo, app, pull requests or commit messages. The site and repo are public.
- Nothing sensitive or institution-internal (internal protocols, phone or pager numbers).
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; refer to them as "the owner". Commits must be authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- **Clinical content:** Claude writes it, evidence-based (full rules in DECISIONS.md, "Sources, updated"):
  - Cite the primary guideline or study (US first, newest final edition; drafts aren't cited). Use AMBOSS's reference lists to find primary sources; a paywalled primary source may be cited on AMBOSS's word.
  - Model wording, organization, terminology and content on the reference handbook (terse clinical register), but never name, cite or copy it.
  - Common clinical practice may go uncited with the stethoscope marker. AMBOSS itself only as a last resort (green check, hidden source, tell the owner each time). Never cite OpenEvidence; use it (Sackett or Snow mode) to spot-check.
  - AMBOSS, OpenEvidence and the handbook are never named or cited in the app.
  - Summarize, never copy. Every card gets the internal accuracy check and an independent reviewer (DECISIONS.md), with extra care for doses.
- Copyrighted reference material (the reference handbook PDF in `~/Documents/Wards-reference/`) never goes into the repo.
- All content edits happen through Claude in chat; there is no in-app editing.
- Use precise medical terminology (hypoxemia, not "low oxygen"); lay terms and abbreviations only as search aliases.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages), Dependabot. Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines by the page's `noindex` tag, and limited to its own scripts by a security policy in `index.html`. How to run it: see README.

## Design
- Use the AKG Design System: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (read its `project/README.md` first). Don't invent colors, type sizes or components outside it; propose additions to the design system instead.
- The app uses a copy in `vendor/akg/`; `vendor/akg/VERSION.md` says which version and how to update it. `npm run tokens` turns its tokens into `src/design/tokens.css` (iOS text styles in rem so they follow Text Size).
- Current version: fourth pass plus SourcePill markers (2026-10-17; exact version in `vendor/akg/VERSION.md`). Four themes (`ios-light`, `ios-dark`, `macos-light`, `macos-dark`, set by `data-theme` on `<html>`), 43 text styles, and 42 React components under `AKG`, including content components (Callout, SourcePill with practice/verified markers, ContentSection + SectionBar, Flowchart, TappableValue, Table, Figure) and app pieces (Banner, BottomBar, Highlight, ShareButton, NumberField). iOS component text follows Text Size via `--akg-text-unit`. The README's "Choosing controls by platform" table says which to use where.
- **Every visual element and interaction is checked against the design system and Apple's HIG** before it ships (rule summaries: `~/Documents/Wards-reference/hig/digest/`, full text alongside). When Wards needs something the design system lacks, add it there first (kept generic), then copy it in.
- The design system is shared across AKG projects. Change it only when the owner asks, and keep it generic (nothing Wards-specific).

## Content structure
Card types and their sections: `docs/CARD-TYPES.md`. Shared data (one home, inserted, never retyped): `docs/DATA-TYPES.md`. How to write the files: `docs/CONTENT-FORMAT.md`. Follow them exactly; `npm run content:check` enforces them.

## Where things stand
See `docs/STATUS.md`.

## Accounts
- GitHub: `akgrepos`. Repo: https://github.com/akgrepos/wards. Live address: https://akgrepos.github.io/wards/
