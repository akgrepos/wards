# Notes for Claude

The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon. Don't build anything the owner hasn't asked for: propose options, wait for a decision, then build only what was agreed.

## Where things live
- **Working notes live outside the repo**, in `~/Documents/Wards-reference/notes/`: WORKING-NOTES.md (start here, in progress, to do, done), DECISIONS.md (product and clinical decisions only), REVIEW-QUEUE.md, and PROCESS.md (testing, design, content and review process; read the part a brief names). Main edits them directly: no branch, PR or session. Trade-off: they are not backed up on GitHub (Time Machine covers them). Side sessions put details in their own PR description and tell Main in their final report.
- In the repo: the app, `content/`, `docs/` (card-writing guides: `CARD-WRITING-CHEATSHEET.md` first, then `CARD-TYPES.md`, `DATA-TYPES.md`, `CONTENT-FORMAT.md`), `CHANGELOG.md` (automatic), `README.md`.
- Design: the AKG Design System (PROCESS.md has the link and rules); every visual element is checked against it and Apple's HIG.

## Sessions and models
- A chat the owner opens directly is the **Main** chat: follow the `wards-main` skill. Main runs on Sonnet, delegates all building, card writing and mock-ups to side sessions started with a brief, and never waits on PRs (sessions merge their own). After dispatching a batch (about every 10 to 15 messages) Main updates the notes and tells the owner to open a fresh Main. A session started with a brief is a side session: do its task, not Main's job.
- **At most two side sessions at a time**, plus Main. Two sessions never edit the same files; a mock-up-only session doesn't count.
- **Cheapest model that does the job.** Haiku (`claude-haiku-5-5`) for routine work: shipping plain card and text edits, mechanical file moves, status checks, tidying, link checks, running review scripts. Sonnet for building features, mock-ups and drafting cards. Opus only for clinical verification and review, adjudication, and the design review of a brand-new kind of screen or component (an Opus helper for Main's hard judgment calls). Set `model` and `effort` (low or medium for non-clinical) on every `start_session`.
- Ask the owner every question once, up front, in one combined pop-up; then work straight through. Details: PROCESS.md "Conserve usage".

## Pull requests
- One branch and PR per task; never commit to `main`. Branches: `setup/…`, `feature/…`, `fix/…`, `content/…`.
- When checks are green the session runs `gh pr merge --rebase --auto` (the only method allowed) and ends its turn, with no `--watch` waiting, then archives itself once merged. Never merge with a failing check. Version and changelog are automatic.
- A plain card or text edit merges on green checks with no Simulator look and no screenshots; the owner's iPhone is the check and silence is approval. `npm run look` plus an independent Opus design review only for a brand-new kind of screen or component. The writing session merges its own PR except for cards (draft PR, then a Haiku ship session). Details: PROCESS.md "Testing in proportion".
- No notes-only PRs: notes aren't in the repo. PRs are for the app, cards, tooling and this file. Changes to this file are batched by Main at wrap-up.
- At the end of a chat follow the `wards-wrap-up` skill.

## Shell habit
Never write files or run scripts with heredocs: they can hang and leave a stuck background task. Use Write and Edit, run scripts from files, and leave no background task running at the end of a turn.

## Hard rules
- No patient information (PHI) anywhere; the site and repo are public. Nothing sensitive or institution-internal (internal protocols, phone or pager numbers).
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; say "the owner". Commits are authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- **Clinical content:** Claude writes it, evidence-based, from the newest final guidelines, cited with their markers; every dose, number and claim that would change care is verified. Never name or cite AMBOSS, OpenEvidence or the reference handbook in the app, card content or repo, and never copy the handbook. OpenEvidence is the owner's regular independent check: the owner types and pastes everything by hand; no script, browser tool or session ever touches it (our scripts only write a text file to paste and read back what the owner pastes). Pregnancy and lactation come from LactMed. Card text is written for the reader (no mention of the writing process). Every new or substantially changed card gets an independent Opus review before clinical use, as "packets, not re-reading", in four tiers; cards the owner looked over before 2026-10-25 are treated as owner-reviewed, never "independently reviewed". Full rules: PROCESS.md "Clinical content".
- Copyrighted reference material (the handbook PDF, the HIG text) stays in `~/Documents/Wards-reference/`, never in the repo. All content edits happen through Claude in chat. Use precise medical terminology; lay terms only as search aliases.
- Content files follow `docs/CARD-TYPES.md` and `docs/DATA-TYPES.md` exactly; a card that seems to need a new type, data type or section kind stops and asks the owner first.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages), Dependabot. Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines (`noindex`) and limited to its own scripts by a security policy in `index.html`. `main` publishes to the live app automatically; the owner taps Reload on the "Update Ready" banner. How to run it: `README.md`.

## Accounts
GitHub `akgrepos`; repo https://github.com/akgrepos/wards; live https://akgrepos.github.io/wards/
