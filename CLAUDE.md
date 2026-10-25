# Notes for Claude

The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon. Don't build anything the owner hasn't asked for: propose options, wait for a decision, then build only what was agreed.

## Where things live
- **Working notes live outside the repo**, in `~/Documents/Wards-reference/notes/`: WORKING-NOTES.md (start here; the one live list), DECISIONS.md (decisions that still bind), PROCESS.md (review flow, testing, design, content rules; read the part a brief names). Main edits them directly (Time Machine backs them up). Side sessions put details in their PR description and tell Main in their final message.
- In the repo: the app, `content/`, `docs/` (card-writing guides: `CARD-WRITING-CHEATSHEET.md` first, then `CARD-TYPES.md`, `DATA-TYPES.md`, `CONTENT-FORMAT.md`), `CHANGELOG.md` (automatic), `README.md`.
- Design: the AKG Design System and Apple's HIG (PROCESS.md "Design and build"). Mock-ups copy `~/Documents/Wards-reference/mockup-template/` and follow its README.

## Cards and content
- Three card types: Topic, Reference, Medication. Reserved types are built only when the first card needs one. Content files follow `docs/CARD-TYPES.md` and `docs/DATA-TYPES.md` exactly; a card that seems to need a new type, data type or section kind stops and asks the owner first.
- Every dose names its `drug:`; shared drug facts live in `content/data/drug/`. Built-in calculators are only for true formulas; scores link to MDCalc.
- Cards carry a Checked stamp (`npm run checked:stamp` / `checked:carry`). CI (`pr:tier`) picks the release tier from what changed: typo = tier 0, prose = 1, doses, numbers or a new card = 2, which needs the stamp.
- **Clinical content:** Claude writes it, evidence-based, from the newest final guidelines, cited with their markers. Pregnancy and lactation come from LactMed. Card text is written for the reader (no mention of the writing process). Use precise medical terminology; lay terms only as search aliases.
- **Review:** the writing session searches the newest guidelines and drafts; one independent Opus helper, run inside that session, checks every dose, number and care-changing claim and fixes the card; the session ships its own PR; the owner looks on the iPhone (silence is approval). Details: PROCESS.md "Card review flow". Cards the owner looked over before 2026-10-25 are owner-reviewed, never "independently reviewed".
- **OpenEvidence is optional:** at most one batch per card, only if the owner wants it. The owner types and pastes everything by hand; no script, browser tool or session ever touches it.

## Sessions and models
- A chat the owner opens directly is the **Main** chat: follow the `wards-main` skill. Main plans and delegates; it may make a tiny single-place text or config edit (about 10 lines, no clinical content) itself through a branch and PR. Other small fixes batch into one Haiku session. A session started with a brief is a side session: do its task, not Main's job.
- **At most two side sessions working at once** (sessions only waiting on a merge don't count). Two sessions never edit the same files; a mock-up-only session doesn't count.
- **Cheapest model that does the job:** Haiku for routine work, Sonnet for building and drafting, Opus for clinical checks and reviews. Set `model` and `effort` on every `start_session` (low or medium for non-clinical). A session can't start above Main's model, so Main checks and sets it after starting.
- Ask the owner every question once, up front, in one combined pop-up; then work straight through.
- Every side session messages Main before it stops (what it did, PR, what is left). Titles show the true state: `[Working]` or `[Waiting to merge]`.

## Pull requests
- One branch and PR per task; never commit to `main`. Branches: `setup/…`, `feature/…`, `fix/…`, `content/…`. Sessions rebase onto `main`, never merge it in.
- When checks are green run `gh pr merge --rebase --auto` (the only method allowed) and turn on auto-fix. Re-check that auto-merge is still on after every push. Never merge with a failing check. Auto-archive only on a session's last PR. Version and changelog are automatic.
- Testing in proportion (PROCESS.md): plain card or text edits merge on green checks; new kinds of screens get `npm run look` and a design critique; code PRs get `/code-review` at low effort. No accessibility work (owner, 2026-10-24); HIG and design-system checks stay.
- No notes-only PRs: notes aren't in the repo. At the end of a Main chat follow the `wards-clean-up` skill.

## Shell habit
Never write files or run scripts with heredocs: they can hang and leave a stuck background task. Use Write and Edit, run scripts from files, and leave no background task running at the end of a turn.

## Hard rules
- No patient information (PHI) anywhere; the site and repo are public. Nothing sensitive or institution-internal (internal protocols, phone or pager numbers). `npm run privacy:check` runs in CI.
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; say "the owner". Commits are authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- Never name or cite AMBOSS, OpenEvidence or the reference handbook in the app, card content or repo, and never copy the handbook. Copyrighted reference material (the handbook PDF, the HIG text) stays in `~/Documents/Wards-reference/`, never in the repo. All content edits happen through Claude in chat.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages). The repo stays public and hosting stays GitHub Pages. Dependabot version updates are removed (security alerts stay). Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines (`noindex`) and limited to its own scripts by a security policy in `index.html`. `main` publishes to the live app automatically; the owner taps Reload on the "Update Ready" banner. How to run it: `README.md`.

## Accounts
GitHub `akgrepos`; repo https://github.com/akgrepos/wards; live https://akgrepos.github.io/wards/
