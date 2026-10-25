# Notes for Claude

The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon. Don't build anything the owner hasn't asked for: propose options, wait for a decision, then build only what was agreed.

## Where things live
- **Working notes live outside the repo**, on the owner's Mac, in `~/Documents/Wards-reference/notes/`: WORKING-NOTES.md (start here), DECISIONS.md (decisions that still bind), PROCESS.md (review flow, testing, design, session and PR mechanics).
- In the repo: the app, `content/`, `docs/` (card guides: `CARD-WRITING-CHEATSHEET.md` first, `CARD-TYPES.md`, `DATA-TYPES.md`, `CONTENT-FORMAT.md`), `CHANGELOG.md` (automatic), `README.md`.
- Design: the AKG Design System and Apple's HIG. Mock-ups copy `~/Documents/Wards-reference/mockup-template/`.

## Cards and content
- Three card types: Topic, Reference, Medication; reserved types are built only when the first card needs one. Content files follow `docs/CARD-TYPES.md` and `docs/DATA-TYPES.md` exactly; a card that seems to need a new type, data type or section kind stops and asks the owner first.
- Every dose names its `drug:`; shared drug facts live in `content/data/drug/`. Built-in calculators only for true formulas; scores link to MDCalc.
- Cards carry a Checked stamp (`npm run checked:stamp` / `checked:carry`). CI (`pr:tier`) sets the release tier from what changed: typo = 0, prose = 1, doses, numbers or a new card = 2, which needs the stamp.
- **Clinical content:** Claude writes it, evidence-based, from the newest final guidelines, cited with their markers. Pregnancy and lactation come from LactMed. Card text is written for the reader.
- **Review:** the writing session drafts, then one independent Opus helper inside it checks every dose, number and care-changing claim and fixes the card; the session ships its own PR; the owner looks on the iPhone. Cards the owner looked over before 2026-10-25 are owner-reviewed, never "independently reviewed".
- **OpenEvidence is optional:** one batch per card at most. The owner types and pastes everything by hand; no script, browser tool or session ever touches it.

## Sessions and PRs
- A chat the owner opens directly is **Main** (`wards-main` skill). Main plans and delegates, and may make a tiny single-place text or config edit (about 10 lines, no clinical content) itself through a branch and PR. Other small fixes batch into one Haiku session.
- At most two side sessions working at once; two sessions never edit the same files. Cheapest model that does the job: Haiku routine, Sonnet building and drafting, Opus clinical checks and reviews.
- One branch and PR per task, never on `main`; merge with `gh pr merge --rebase --auto` only, never with a failing check. The rest: PROCESS.md "Session and PR mechanics".
- Testing in proportion (PROCESS.md): plain card or text edits merge on green checks; new kinds of screens get `npm run look` and a design critique; code PRs get `/code-review` at low effort. No accessibility work (owner, 2026-10-24).

## Shell habit
Never write files or run scripts with heredocs: they can hang and leave a stuck background task. Use Write and Edit, run scripts from files, and leave no background task running at the end of a turn.

## Hard rules
- PR text, titles, screenshots and commit messages never contain absolute home-folder paths (use `~/`) or the owner's name.
- No patient information (PHI) anywhere; the site and repo are public. Nothing sensitive or institution-internal (internal protocols, phone or pager numbers). `npm run privacy:check` runs in CI.
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; say "the owner". Commits are authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- Never name or cite AMBOSS, OpenEvidence or the reference handbook in the app, card content or repo, and never copy the handbook. Copyrighted reference material (the handbook PDF, the HIG text) stays in `~/Documents/Wards-reference/`, never in the repo.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages). The repo stays public and hosting stays GitHub Pages. Dependabot version updates are removed (security alerts stay). Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines (`noindex`) and limited to its own scripts by a security policy in `index.html`. `main` publishes to the live app automatically; the owner taps Reload on the "Update Ready" banner. How to run it: `README.md`.

## Accounts
GitHub `akgrepos`; repo https://github.com/akgrepos/wards; live https://akgrepos.github.io/wards/
