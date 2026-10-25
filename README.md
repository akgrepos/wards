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
- `npm run changelog [-- --dry-run]`: rebuilds the automatic part of `CHANGELOG.md` from the titles of merged pull requests (needs `gh`). Write a clear, plain-language PR title; that is the changelog entry.
- Version: stamped by the build from git as `YYYY.MM.DD.N` (the commit's date, and N = how many changes landed that day). Nobody edits it; `scripts/lib/version.mjs` computes it and `status` reads it from `origin/main`.
- Dependabot: one grouped PR a month; `.github/workflows/dependabot-auto-merge.yml` turns on auto-merge for patch and minor updates only. Major updates stay manual.
- `npm run tidy -- <branch> [--dry-run]`: the close rule; refuses if unmerged commits or uncommitted changes, else removes worktree and branch. `--dry-run` only reports.
- `npm run review:oe-batches -- <card-id>`: cuts the private review ledger into paste-ready batches for the owner's optional outside check (`scripts/review-oe-batches.mjs`; writes `~/Documents/Wards-reference/oe-batches/<card-id>/batch-NN.txt`, about 25 statements each, riskiest first, plus a map file per batch linking statement numbers to ledger entries; never in the repo). Statements are self-contained (abbreviations spelled out, no source names or quotes) and skip `owner_checked` entries; a hand-written statement for any entry goes in an override file in the same folder (the script prints its name). Each file is paste content only (starts at `Topic:`, no instructions; those live in the owner's Dotflow); the script prints the mode to use (Sackett by default) and a reminder to paste by hand. Nothing is automated.
- `npm run review:oe-read -- <card-id> <batch-NN> [file]`: reads the answer the owner pasted back (file, or stdin), parses the table and the Conflicts / Outdated / Dose safety lines (`scripts/review-oe-read.mjs`), writes `oe: {date, verdict, says, source, note, batch}` onto the matching ledger entries without touching the writer's quote or status, and prints counts, every row that is not plain Supported, rows it could not parse.
- `npm run look [-- --no-build] [--no-sheet] [--only name,name]`: the visual check (Mac or Linux). Builds the release, serves it on port 4199, opens real WebKit at iPhone size (390x844, 3x; no Simulator) and visits each page in `scripts/look.config.mjs` in light and dark. It **fails** (exit 1, naming the page and element) on browser-default links, solid underlines outside text, tap targets under 44 points, text colors or fonts that are not design tokens, and leftover prototype code in the built files. Known small tap targets are listed in `ALLOW.knownSmallTap` and printed without failing. It saves one contact sheet (every page, light and dark) to `~/Documents/Wards-reference/look/<date>-<branch>.png` and prints the path; attach it to the PR. To add a page, add one line to `ROUTES` in `scripts/look.config.mjs` (`{ name, hash }`, optional `steps: [{ click: 'button text' }]`). One-time setup after `npm ci`: `npx playwright install webkit`. CI runs the checks only (`--no-build --no-sheet`).
- `npm run checked:stamp -- <card-id>` and `npm run checked:carry -- <card-id> "<reason>"`: write the Checked stamp with the card's clinical fingerprint (after the Opus check), or update the fingerprint for a change that needs no re-check. `npm run pr:tier` labels a PR tier-0, tier-1, tier-2 or app and fails a tier-2 card with no matching stamp or carry (`scripts/content/tier.mjs`).
- `npm run card:new -- <type> <system> <id> "<title>" [--variant <name>]`: card skeleton; `content:check` rejects it until every `SCAFFOLD:` placeholder is replaced. `content:check` problems now end with the rule and the doc to read.

## Ground rules

- **No patient information, ever.** The site is public to anyone with the link.
- Dose and calculator files end with a `verification` note (how the numbers were checked); `npm run content:check` rejects one without it (docs/DATA-TYPES.md, "Verification note").
- Reference content is for personal use and must be checked against current guidelines before clinical use.
