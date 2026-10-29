# Notes for Claude

The owner, a physician, is the only user, with no coding experience: explain plainly. Build only what was asked; propose options, wait for a decision. A personal reference the owner checks against protocols and attendings, used equally in the workroom (look up, plan, write, learn) and at the bedside in a hurry; neither use is primary.

## How a chat works
- **One chat per task**, opened by the owner. Start with the `wards-start` skill: `npm run brief` prints the card index, open PRs, last merges, top of BACKLOG and what the owner owes. Never propose a card the index shows exists.
- **Prioritize efficiency and minimum usage:** use the lowest model and effort that can accomplish the task; step up only if it fails.
- The chat does the work itself. Models: Sonnet builds and drafts, Haiku does quotes, sweeps and plain fixes (step up if it fails), Opus does the clinical check and design critiques. A child session only for a long autonomous job (a batch or sweep), briefed as a skill name plus a list. At most one background job beside the chat; two sessions never edit the same files.
- **State:** `BACKLOG.md` and `DECISIONS.md` (product and clinical decisions only) are the only hand-written state, in `~/Documents/Wards-reference/notes/`; everything else is generated. Write a decision there before the chat closes. Scripts live in the repo, prose outside. Skills: `.claude/skills/`.
- Card guides: `docs/CARD-WRITING-CHEATSHEET.md` first, then `docs/CARD-TYPES.md` and `docs/DATA-TYPES.md`. Design: AKG Design System and Apple's HIG; mock-ups copy `~/Documents/Wards-reference/mockup-template/`. Any visible change follows the `wards-design` skill.

## Cards and content
- Three card types (Topic, Reference, Medication); a card needing a new type, data type or section kind stops and asks the owner. Every dose names its `drug:`. Calculators only for true formulas; scores link to MDCalc.
- Claude writes clinical content from the newest final guidelines, cited with their markers; pregnancy and lactation from LactMed. Text is written for the reader, never about the writing process.
- **Review:** the chat drafts. Haiku finds the quote or book passage behind every dose, number, threshold and care-changing claim; a script checks guideline quotes word for word and a Sonnet helper checks each book-based line against its passage. One independent Opus helper checks only what rests on Claude's own judgment, runs the omissions pass and fixes the card; `npm run checked:stamp` records it. Say exactly what was done. Cards the owner looked over before 2026-10-25 are never "independently reviewed".
- "Updated <date>" is a date, not a claim of review. `pr:tier` sets the tier: typo 0, prose 1, doses, numbers or a new card 2 (needs the stamp).

## PRs and testing
- One branch and PR per task, never on `main`; any chat may make a small edit this way. Rebase (`git rebase origin/main`, `git push --force-with-lease`), never merge `main` in. Merge with `gh pr merge --rebase --auto` only, never with a failing check; confirm auto-merge is still on after every push.
- Test in proportion: card or text edits merge on green checks; a new kind of screen gets `npm run look` and a design critique; code PRs get `/code-review` at low effort; the installed app is checked on the owner's iPhone. No accessibility work.
- **A design change (anything visible: CSS, layout, a component) gets a look in Playwright WebKit (the Safari engine, iPhone width) as the last step before pushing (owner, 2026-10-28, replaces the simulator):** run the official look, never a home-made script: `npm run look -- --only <names>` (one contact sheet of every changed screen and tap state, light and dark, plus the tap-size and token checks; add a `ROUTES` line with `steps` to `scripts/look.config.mjs` for each new state) and `npm run page-shots -- '<route>' --dark` for long pages (slices); open the sheet and slices and say what you saw. A tap on a segmented switch works in `steps`. A built screen that follows an approved mock-up ships with a parity list (each mock-up element built, changed or dropped, with the reason; `wards-design` step 2); nothing is dropped silently. No simulator. Card text edits and code with no visible change skip it. Keep a design PR to one pattern: smaller PRs, one look each.
- Shell: no heredocs (they hang); use Write and Edit, run scripts from files, leave no background task running.

## Hard rules
- No patient information (PHI) and nothing institution-internal; the site and repo are public. `npm run privacy:check` runs in CI.
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits, PRs or screenshots; say "the owner". Never write an absolute home-folder path; use `~/`. Commits are authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>`.
- Practical details no guideline or label gives (interval, route, drug order, who to call) may restate facts from the library books (the first book, then the second, in the order in WEB-SOURCES.md), the two web sources and, for scores only, MDCalc (all in `~/Documents/Wards-reference/library/WEB-SOURCES.md`) in Claude's own words, marked `common-practice`; the newest final guideline or label then verifies, and wins a disagreement. The owner does not confirm them by hand (`wards-card` skill, rule C).
- Never name or cite AMBOSS, OpenEvidence, the White Book, Pocket Medicine, WikEM or Point of Care Medicine in the app, card content or repo, and never copy their text. Copyrighted material stays in `~/Documents/Wards-reference/`.

## Stack
React + TypeScript + Vite PWA, offline; GitHub Actions publish `main` to Pages (the owner taps Reload on "Update Ready"). How to run it: `README.md`. Repo https://github.com/akgrepos/wards, live https://akgrepos.github.io/wards/
