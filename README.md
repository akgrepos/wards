# Wards

A personal internal medicine reference for iPhone, built as a web app you add to the Home Screen.

**Status:** live, with the first pilot cards. See [docs/STATUS.md](docs/STATUS.md) and [CHANGELOG.md](CHANGELOG.md).

## How it works

- **Hosting:** GitHub Pages serves whatever is on the `main` branch at `https://akgrepos.github.io/wards/`.
- **Install on iPhone:** open that address in Safari, tap the ≡ menu → Share → View More → Add to Home Screen.
- **Design:** built on the [AKG Design System](https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru), a shared Apple HIG–based system for all AKG projects.

## Working on it

- `main` is the live app. It changes only by merging a pull request.
- Each task gets its own short-lived branch and a pull request with a plain-language summary (and simulator screenshots when something visible changed). It's merged once automated checks pass.
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
- `npm run tidy -- <branch> [--dry-run]`: the close rule; refuses if unmerged commits or uncommitted changes, else removes worktree and branch; says so politely if Windows has the folder locked. `--dry-run` only reports.
- `npm run preview:shot -- <outdir> <route...> [--headless]`: Playwright WebKit screenshots (iPhone size, light and dark) of the built app; replaces the old Mac-only Simulator script. The window is visible and slow by default so the owner can watch; `--headless` for background runs and CI. Not the pinned-app test. Needs `npm run build` first (in Git Bash prefix with `MSYS_NO_PATHCONV=1` so `/` stays a route).
- All of these are Node (no `jq`, no bash) and run the same in PowerShell, Git Bash and CI.
- `npm run card:new -- <type> <system> <id> "<title>" [--variant <name>]`: card skeleton; `content:check` rejects it until every `SCAFFOLD:` placeholder is replaced. `content:check` problems now end with the rule and the doc to read.

## Ground rules

- **No patient information, ever.** The site is public to anyone with the link.
- Reference content is for personal use and must be checked against current guidelines before clinical use.
