# Wards

A personal internal medicine reference for iPhone, built as a web app you add to the Home Screen.

**Status:** live, with 30+ cards. See [CHANGELOG.md](CHANGELOG.md); working notes are kept outside the repo.

## How it works

- **Hosting:** GitHub Pages serves whatever is on the `main` branch at `https://akgrepos.github.io/wards/`.
- **Install on iPhone:** open that address in Safari, tap the ≡ menu → Share → View More → Add to Home Screen.
- **Design:** built on the [AKG Design System](https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru), a shared Apple HIG–based system for all AKG projects.

## Working on it

- `main` is the live app. It changes only by merging a pull request.
- Each task gets its own short-lived branch and a pull request with a plain-language summary (and the `npm run look` contact sheet attached when something visibly new changed). It's merged once automated checks pass.
- Your phone shows an "Update Ready" banner with a Reload button when a new version is available.

Decisions and working notes are kept outside the repo, in the owner's private notes folder.

## For Claude: running it

- `npm ci` once, then `npm run build` and `npm run preview -- --strictPort` to serve the built app at `http://localhost:4173/wards/` (the simulator reaches it at the same address).
- `npm test`, `npm run typecheck`. Updating the design system copy: see `vendor/akg/VERSION.md`. Regenerating icons after editing `public/favicon.svg`: `npm run icons`.

### Workflow scripts (for Claude sessions, one call each)
- `npm run status [-- --since YYYY-MM-DD]`: open PRs with check state, last 5 merged (or since a date), version on `origin/main` vs the live site, worktrees and branches (merged ones marked).
- `npm run wait-live -- <pr> [version]`: run once; blocks up to 10 min until the PR's checks pass, it is merged and the live site shows the new version (exit 0 live, 1 failed, 2 timed out). Merge with `npm run release -- <pr>` (auto-merge) or `gh pr merge --rebase`.
- `npm run release -- [--card <id>] [<pr-number>]`: the version and changelog are automatic, so there is nothing to bump. With a PR number it turns on auto-merge (`gh pr merge --rebase --auto`): the PR merges itself once the required checks pass. With `--card` it lists the card in REVIEW-QUEUE "Not yet independently reviewed".
- `npm run changelog [-- --dry-run]`: rebuilds the automatic part of `CHANGELOG.md` from the titles of merged pull requests (needs `gh`). Write a clear, plain-language PR title; that is the changelog entry.
- Version: stamped by the build from git as `YYYY.MM.DD.N` (the commit's date, and N = how many changes landed that day). Nobody edits it; `scripts/lib/version.mjs` computes it and `status`, `wait-live` and `sim-check` read it from `origin/main`.
- Dependabot: one grouped PR a month; `.github/workflows/dependabot-auto-merge.yml` turns on auto-merge for patch and minor updates only. Major updates stay manual.
- `npm run tidy -- <branch> [--dry-run]`: the close rule; refuses if unmerged commits or uncommitted changes, else removes worktree and branch. `--dry-run` only reports.
- `npm run docs:check`: no-network, no-AI check of the notes (CLAUDE.md, README.md, docs/*.md): backticked files and `npm run` names that do not exist, `docs/screenshots/` mentioned as a place for files, email addresses or home paths, source names in card content, and (warning only) DECISIONS rows dated 2026-10-24 or later over about 700 characters. Exit 0 pass, 1 problem (file, line, rule). Known exceptions go in `scripts/docs-check.config.mjs` with a reason. CI runs it; the wrap-up light audit runs it first so a model only reviews what judgment is needed.
- `npm run review:check -- <card-id>`: no-network, no-AI check of the private review ledger for a card (`scripts/review-check.mjs`; ledger and saved source texts live in `~/Documents/Wards-reference/`, never in the repo). Confirms every quote is verbatim in its saved source text, compares numbers and units in each claim with its quote (40 mEq against 20 mEq fails), requires a note on every partial, mismatch or no-support entry, counts a match entry with `owner_checked: <date>` and no quote as verified by the owner (own count, not a failure), and prints counts plus each failure. Skips with a plain message when the private files are absent (CI). Exit 0 pass or skip, 1 problem.
- `npm run review:packets -- <card-id> [--blind-seed N]`: cuts the private ledger into review packets for a fresh helper (`scripts/review-packets.mjs`; writes `~/Documents/Wards-reference/review-packets/<card-id>/packets-NNN.md`, about 25 per file, never in the repo). Each packet has the current card line or data, the writer's quote, an automatic window of source text around it (or number-anchored candidate passages when the quote is not found), every other place the same numbers appear in that source, and the `review:check` result. About 10 percent of packets (at least 5, seed recorded) are blind: the quote and its location are hidden until the end of the file, and the source text is shown as shuffled number- or keyword-anchored passages instead of a window around the quote. Entries checked by the owner without a quote are marked "owner-checked" (no window, never blind). Prints packet, blind, found-unaided, words-per-packet and missing-source measurements.
- `npm run review:oe-batches -- <card-id>`: cuts the private review ledger into paste-ready batches for the owner's OpenEvidence `.card_check` (`scripts/review-oe-batches.mjs`; writes `~/Documents/Wards-reference/oe-batches/<card-id>/batch-NN.txt`, about 25 statements each, riskiest first, plus a map file per batch linking statement numbers to ledger entries; never in the repo). Statements are self-contained (abbreviations spelled out, no source names or quotes) and skip `owner_checked` entries; a hand-written statement for any entry goes in an override file in the same folder (the script prints its name). Each file is paste content only (starts at `Topic:`, no instructions; those live in the OpenEvidence `.card_check` Dotflow); the script prints the mode to use (Sackett by default) and a reminder to paste by hand. Nothing is automated.
- `npm run review:oe-read -- <card-id> <batch-NN> [file]`: reads the answer the owner pasted back (file, or stdin), parses the table and the Conflicts / Outdated / Dose safety / Re-check lines (`scripts/review-oe-read.mjs`), writes `oe: {date, verdict, says, source, note, batch}` onto the matching ledger entries without touching the writer's quote or status, and prints counts, every row that is not plain Supported, rows it could not parse, and the Re-check in Snow numbers. `review:check` also reports an OpenEvidence count.
- `npm run sim-check [-- --expect "text"] [--route "#/settings"] [--shots [name]]`: one-call Simulator check (Mac only). Reads the screen by screenshot plus text recognition and compares the version shown with the version computed for `origin/main` (if the screen shows none, it opens Settings itself, then returns to `--route` for the `--expect` check); reports an "Update Ready" banner; `--expect` confirms text is on screen; `--shots` saves 0.4-scale light and dark PNGs to a temp folder outside the repo. `simctl` cannot tap, so tapping Reload or opening a card stays manual (`--route` opens Safari in the Simulator). Exit 0 ok, 1 mismatch, 2 manual step needed (Simulator not booted, or Settings shows no version).
- `npm run look [-- --no-build] [--no-sheet] [--only name,name]`: the visual check (Mac or Linux). Builds the release, serves it on port 4199, opens real WebKit at iPhone size (390x844, 3x; no Simulator) and visits each page in `scripts/look.config.mjs` in light and dark. It **fails** (exit 1, naming the page and element) on browser-default links, solid underlines outside text, tap targets under 44 points, text colors or fonts that are not design tokens, and leftover prototype code in the built files. Known small tap targets are listed in `ALLOW.knownSmallTap` and printed without failing. It saves one contact sheet (every page, light and dark) to `~/Documents/Wards-reference/look/<date>-<branch>.png` and prints the path; attach it to the PR. To add a page, add one line to `ROUTES` in `scripts/look.config.mjs` (`{ name, hash }`, optional `steps: [{ click: 'button text' }]`). One-time setup after `npm ci`: `npx playwright install webkit`. CI runs the checks only (`--no-build --no-sheet`).
- `npm run card:new -- <type> <system> <id> "<title>" [--variant <name>]`: card skeleton; `content:check` rejects it until every `SCAFFOLD:` placeholder is replaced. `content:check` problems now end with the rule and the doc to read.

## Ground rules

- **No patient information, ever.** The site is public to anyone with the link.
- Dose and calculator files end with a `verification` note (how the numbers were checked); `npm run content:check` rejects one without it (docs/DATA-TYPES.md, "Verification note").
- Reference content is for personal use and must be checked against current guidelines before clinical use.
