# Wards

A personal internal medicine reference for iPhone, built as a web app you add to the Home Screen.

**Status:** live, with the first pilot cards. See [docs/STATUS.md](docs/STATUS.md) and [CHANGELOG.md](CHANGELOG.md).

## How it works

- **Hosting:** GitHub Pages serves whatever is on the `main` branch at `https://akgrepos.github.io/wards/`.
- **Install on iPhone:** open that address in Safari, tap the ≡ menu → Share → View More → Add to Home Screen.
- **Design:** built on the [AKG Design System](https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru), a shared Apple HIG–based system for all AKG projects.

## Working on it

- `main` is the live app. It changes only by merging a pull request.
- Each task gets its own short-lived branch and a pull request with a plain-language summary (and a few screenshots in the description when something visibly new changed). It's merged once automated checks pass.
- Your phone shows an "Update Ready" banner with a Reload button when a new version is available.

See [docs/DECISIONS.md](docs/DECISIONS.md) for what has been decided and why.

## For Claude: running it

- `npm ci` once, then `npm run build` and `npx vite preview --host --port 4173` to serve the built app at `http://localhost:4173/wards/` (the simulator reaches it at the same address).
- `npm test`, `npm run typecheck`. Updating the design system copy: see `vendor/akg/VERSION.md`. Regenerating icons after editing `public/favicon.svg`: `npm run icons`.

### Workflow scripts (for Claude sessions, one call each; added 2026-10-22)
- `npm run status [-- --since YYYY-MM-DD]`: open PRs with check state, last 5 merged (or since a date), version on `origin/main` vs the live site, worktrees and branches (merged ones marked).
- Dose and calculator files end with a `verification` note (how the numbers were checked); `npm run content:check` rejects one without it (docs/DATA-TYPES.md, "Verification note").
- `npm run wait-live -- <pr> [version]`: run once; blocks up to 10 min until the PR's checks pass, it is merged and the live site shows the new version (exit 0 live, 1 failed, 2 timed out). Merge with `gh pr merge --rebase` yourself.
- `npm run release -- [--card <id>] [--dry-run] "<changelog line>"`: bumps `src/version.ts` (next number for today, from origin/main), adds the CHANGELOG entry, and with `--card` lists the card in REVIEW-QUEUE "Not yet independently reviewed".
- `npm run tidy -- <branch> [--dry-run]`: the close rule; refuses if unmerged commits or uncommitted changes, else removes worktree and branch. `--dry-run` only reports.
- `npm run sim-check [-- --expect "text"] [--route "#/settings"] [--shots [name]]`: one-call Simulator check (Mac only). Reads the screen by screenshot plus text recognition and compares the version shown with `src/version.ts` on `origin/main` (if the screen shows none, it opens Settings itself, then returns to `--route` for the `--expect` check); reports an "Update Ready" banner; `--expect` confirms text is on screen; `--shots` saves 0.4-scale light and dark PNGs to a temp folder outside the repo. `simctl` cannot tap, so tapping Reload or opening a card in the pinned app stays manual (`--route` uses Safari, not the pinned app). Exit 0 ok, 1 mismatch, 2 manual step needed (Simulator not booted, or Settings shows no version).
- `npm run look [-- --no-build] [--no-sheet] [--only name,name]`: the visual check (Mac or Linux). Builds the release, serves it on port 4199, opens real WebKit at iPhone size (390x844, 3x; no Simulator) and visits each page in `scripts/look.config.mjs` in light and dark. It **fails** (exit 1, naming the page and element) on browser-default links, solid underlines outside text, tap targets under 44 points, text colors or fonts that are not design tokens, and `PROTOTYPE` or the preview ribbon in the built files. Known small tap targets are listed in `ALLOW.knownSmallTap` and printed without failing. It saves one contact sheet (every page, light and dark) to `~/Documents/Wards-reference/look/<date>-<branch>.png` and prints the path; attach it to the PR. To add a page, add one line to `ROUTES` in `scripts/look.config.mjs` (`{ name, hash }`, optional `steps: [{ click: 'button text' }]`). One-time setup after `npm ci`: `npx playwright install webkit`. CI runs the checks only (`--no-build --no-sheet`).
- `npm run card:new -- <type> <system> <id> "<title>" [--variant <name>]`: card skeleton; `content:check` rejects it until every `SCAFFOLD:` placeholder is replaced. `content:check` problems now end with the rule and the doc to read.

## Ground rules

- **No patient information, ever.** The site is public to anyone with the link.
- Reference content is for personal use and must be checked against current guidelines before clinical use.
