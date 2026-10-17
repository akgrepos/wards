# Notes for Claude

## Who this is for
The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon.

## How to work here
- **Don't build anything the owner hasn't asked for.** Propose options, wait for a decision, then build only what was agreed. Answering a question is not permission to build.
- **Branch workflow:** never commit to `main` directly. Start a short-lived branch per task (`setup/…`, `feature/…`, `fix/…`), commit there, push, open a pull request, and merge only when the owner approves. Delete the branch after merging.
- Record every decision in `docs/DECISIONS.md` (date, what, why). Move items out of "Open questions" when they're settled.
- `main` is deployed to the live app by GitHub Pages; anything merged reaches the owner's phone within minutes.

## Hard rules
- No patient information (PHI) in the repo, the app, issues, or commit messages. The site is public by link.
- Clinical content needs a source the owner has verified. Never present generated medical content as verified.

## Design
- Use the AKG Design System: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (read its `project/README.md` first). Don't invent colors, type sizes or components outside it; propose additions to the design system instead.

## Accounts
- GitHub: `akgrepos`. Repo: https://github.com/akgrepos/wards
