# Wards

A personal internal medicine reference for iPhone, built as a web app you add to the Home Screen.

**Status:** planning and foundations. No app code yet.

## How it works

- **Hosting:** GitHub Pages serves whatever is on the `main` branch at `https://akgrepos.github.io/wards/` (once Pages is turned on).
- **Install on iPhone:** open that address in Safari → Share → Add to Home Screen.
- **Design:** built on the [AKG Design System](https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru), a shared Apple HIG–based system for all AKG projects.

## Working on it

- `main` is the live app. It changes only by merging a pull request.
- Each task gets its own short-lived branch (`setup/…`, `feature/…`, `fix/…`, `content/…`) and a pull request with a summary and iPhone-simulator screenshots. It's merged once automated checks pass, then the branch is deleted.
- Your phone shows "Update ready · Reload" when a new version is available.

See [docs/DECISIONS.md](docs/DECISIONS.md) for what has been decided and what is still open.

## Ground rules

- **No patient information, ever.** The site is public to anyone with the link.
- Reference content is for personal use and must be checked against current guidelines before clinical use.
