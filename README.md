# Wards

A personal internal medicine reference for iPhone, built as a web app you add to the Home Screen.

**Status:** the app is set up and live, with no content yet. See [docs/STATUS.md](docs/STATUS.md) and [CHANGELOG.md](CHANGELOG.md).

## How it works

- **Hosting:** GitHub Pages serves whatever is on the `main` branch at `https://akgrepos.github.io/wards/`.
- **Install on iPhone:** open that address in Safari, tap the ≡ menu → Share → View More → Add to Home Screen.
- **Design:** built on the [AKG Design System](https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru), a shared Apple HIG–based system for all AKG projects.

## Working on it

- `main` is the live app. It changes only by merging a pull request.
- Each task gets its own short-lived branch and a pull request with a plain-language summary (and simulator screenshots when something visible changed). It's merged once automated checks pass.
- Your phone shows an "Update Ready" banner with a Reload button when a new version is available.

See [docs/DECISIONS.md](docs/DECISIONS.md) for what has been decided and what is still open.

## For Claude: running it

- `npm ci` once, then `npm run build` and `npx vite preview --host --port 4173` to serve the built app at `http://localhost:4173/wards/` (the simulator reaches it at the same address).
- `npm test`, `npm run typecheck`. Updating the design system copy: see `vendor/akg/VERSION.md`. Regenerating icons after editing `public/favicon.svg`: `npm run icons`.

## Ground rules

- **No patient information, ever.** The site is public to anyone with the link.
- Reference content is for personal use and must be checked against current guidelines before clinical use.
