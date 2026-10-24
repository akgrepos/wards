# Notes for Claude

The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon. Don't build anything the owner hasn't asked for: propose options, wait for a decision, then build only what was agreed.

## Where things live
- **Working notes live outside the repo**, in `~/Documents/Wards-reference/notes/`: WORKING-NOTES.md (start here), DECISIONS.md (product and clinical decisions only), REVIEW-QUEUE.md, and PROCESS.md (testing, design, content and review process; read the part a brief names). Main edits them directly. They are not backed up on GitHub (Time Machine covers them). Side sessions put details in their own PR description and tell Main in their final report.
- In the repo: the app, `content/`, `docs/` (card-writing guides: `CARD-WRITING-CHEATSHEET.md` first, then `CARD-TYPES.md`, `DATA-TYPES.md`, `CONTENT-FORMAT.md`), `CHANGELOG.md` (automatic), `README.md`.
- Design: the AKG Design System and Apple's HIG. Details: PROCESS.md "Design and build".

## Sessions and models
- A chat the owner opens directly is the **Main** chat: follow the `wards-main` skill. Main runs on Sonnet, delegates building, card writing and mock-ups to side sessions started with a brief, and never waits on PRs (sessions merge their own). After a batch, Main updates the notes and tells the owner to open a fresh Main.
- **At most two side sessions at a time**, plus Main. Two sessions never edit the same files; a mock-up-only session doesn't count.
- **Cheapest model that does the job.** Haiku (`claude-haiku-5-5`) for routine work: shipping plain card and text edits, file moves, status checks, tidying, link checks. Sonnet for building features, mock-ups and drafting cards. Opus only for clinical verification and review, and for adjudication. Set `model` and `effort` on every `start_session` (low or medium for non-clinical). Details: PROCESS.md "Conserve usage".
- Ask the owner every question once, up front, in one combined pop-up; then work straight through.

## Pull requests
- One branch and PR per task; never commit to `main`. Branches: `setup/…`, `feature/…`, `fix/…`, `content/…`.
- When checks are green the session runs `gh pr merge --rebase --auto` (the only method allowed), ends its turn without waiting, and archives itself once merged. Never merge with a failing check. Version and changelog are automatic.
- Testing depth (plain card or text edits merge on green checks; new screens get a look first; code PRs get `/code-review` at low effort): see PROCESS.md "Testing in proportion". No accessibility work (owner, 2026-10-24); HIG and design-system checks stay.
- **Card PRs:** the writing session opens a draft PR. Main then switches that same session to Haiku (low effort) and messages it to ship: checks, `gh pr ready`, `gh pr merge --rebase --auto`, archive. No separate ship session.
- No notes-only PRs: notes aren't in the repo. PRs are for the app, cards, tooling and this file. Changes to this file are batched by Main at clean-up.
- At the end of a chat follow the `wards-clean-up` skill.

## Shell habit
Never write files or run scripts with heredocs: they can hang and leave a stuck background task. Use Write and Edit, run scripts from files, and leave no background task running at the end of a turn.

## Hard rules
- No patient information (PHI) anywhere; the site and repo are public. Nothing sensitive or institution-internal (internal protocols, phone or pager numbers).
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; say "the owner". Commits are authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- **Clinical content:** Claude writes it, evidence-based, from the newest final guidelines, cited with their markers. Every dose, number and claim that would change care is verified. Never name or cite AMBOSS, OpenEvidence or the reference handbook in the app, card content or repo, and never copy the handbook. OpenEvidence is the owner's independent check: the owner types and pastes everything by hand; no script, browser tool or session ever touches it. Pregnancy and lactation come from LactMed. Card text is written for the reader (no mention of the writing process). Every new or substantially changed card gets an independent Opus review before clinical use.
- **Card review flow:** one OpenEvidence batch per card, one run, Sackett only (no Snow). The owner pastes the batch once and returns the reply; one Opus helper accepts, reviews, implements and finalizes. Details: PROCESS.md "Card review flow, simple" and "Clinical content".
- Copyrighted reference material (the handbook PDF, the HIG text) stays in `~/Documents/Wards-reference/`, never in the repo. All content edits happen through Claude in chat. Use precise medical terminology; lay terms only as search aliases.
- Content files follow `docs/CARD-TYPES.md` and `docs/DATA-TYPES.md` exactly; a card that seems to need a new type, data type or section kind stops and asks the owner first.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages), Dependabot. Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines (`noindex`) and limited to its own scripts by a security policy in `index.html`. `main` publishes to the live app automatically; the owner taps Reload on the "Update Ready" banner. How to run it: `README.md`.

## Accounts
GitHub `akgrepos`; repo https://github.com/akgrepos/wards; live https://akgrepos.github.io/wards/
