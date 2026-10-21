# Notes for Claude

## Who this is for
The owner, a physician, is the only user. No coding experience: explain steps plainly and avoid jargon.

## How to work here
- **Don't build anything the owner hasn't asked for.** Propose options, wait for a decision, then build only what was agreed. Answering a question is not permission to build.
- **Main chat and side sessions.** A chat the owner opens directly is the **Main** chat: follow the `wards-main` skill in the owner's Claude settings (it renames the chat to "Main" and runs the project as the organizer). Main delegates all building, card writing and mock-ups to side sessions it starts with a brief, keeps branches and sessions clean, and closes sessions once their work is merged and live. The owner works inside each side session's own chat. A session started with a brief is a side session: do its task, not Main's job.
- **At most two work branches (side sessions) at a time**, plus the Main chat (owner, 2026-10-21, to conserve usage). Finish or close one before starting another.
- **Conserve usage** (owner, 2026-10-21):
  - *Cheapest model that does the job well* (owner: Opus only where it's needed). **Sonnet is the default** for side sessions and subagents: building features and fixes, mock-ups, notes and STATUS changes, Simulator testing, design-system checks, merging. **Haiku** for simple steps: finding files, listing, checking that links load, gathering screenshots, routine status checks. **Opus only** for clinical card writing, dose and claim verification, the independent clinical reviewer, and the independent design review of a brand-new layout or mock-up (Sonnet builds it; small visual fixes don't need it), where accuracy and taste matter most. A session that hits something genuinely hard may hand that one piece to a more capable subagent.
  - *Read narrowly.* Read the DECISIONS rows a brief names, not the whole file; read only the cards and data you change.
  - *Test in proportion* (rules below): screenshots only of the screens that changed. Wait for checks with one `gh pr checks <n> --watch` instead of checking repeatedly.
  - *Few rounds.* Mock-ups offer two or three clear options in one round; ask the owner one combined question pop-up instead of several in a row.
  - *Close promptly.* Finished sessions are archived as soon as their work is merged and live.
- **One branch and pull request per task.** Never commit to `main` (it's protected). Branch names: `setup/…`, `feature/…`, `fix/…`, `content/…`. Open the PR with a plain-language summary.
- **Merge it yourself** with `gh pr merge --rebase` (the only method allowed) once the checks pass and testing below is done. Branches delete themselves. Never merge with a failing check. The owner reviews by using the app and asks for changes in chat.
- **Test in proportion to the change** (iOS 27 Simulator). Always test the installed Home Screen app, never a Safari tab (it behaves differently). Don't reinstall it for each test: open the existing Wards Home Screen app and tap Reload on the "Update Ready" banner, as the owner does on their phone; add it to the Home Screen only if no copy exists (keep just one).
  - *Visible change:* add to the Home Screen and check light and dark at two text sizes. Put screenshots in `docs/screenshots/<date>-<topic>/` and show them in the PR. Bump the version in `src/version.ts` (`YYYY.MM.DD`, `.2` for a second release that day) and add a plain-language `CHANGELOG.md` entry; a test enforces that the two match.
  - *Behind-the-scenes change (build, security, tools):* a quick check that the app opens, works offline and still offers updates. No screenshots or version bump.
  - *Notes only, or a Dependabot PR with nothing visible:* the automatic checks are enough. Read a Dependabot PR's changes before merging.
- **Record decisions** in `docs/DECISIONS.md` (date, what, why) and keep `docs/STATUS.md` a short current snapshot. Move items out of "Open questions" when settled.
- `main` publishes to the live app automatically; the owner gets it after tapping Reload on the "Update Ready" banner.

- **End of a chat:** when the owner says to wrap up (or is done for the day), follow the `wards-wrap-up` skill in the owner's Claude settings: finish or park work, stop servers, clean Git and files, update STATUS/DECISIONS/memory, and leave a "Start here next time" handoff.

## Hard rules
- No patient information (PHI) anywhere: repo, app, pull requests or commit messages. The site and repo are public.
- Nothing sensitive or institution-internal (internal protocols, phone or pager numbers).
- **Stay anonymous.** Never put the owner's name, email or computer name in files, commits or PRs; refer to them as "the owner". Commits must be authored as `akgrepos <338781722+akgrepos@users.noreply.github.com>` (this repo's git config); a check rejects any other author.
- **Clinical content:** Claude writes it, evidence-based (full rules in DECISIONS.md, "Card-writing process" 2026-10-19 and "Sources, updated"):
  - The reference handbook is the starting outline: it decides what a card covers and how it's organized, including practical bedside details, in its terse clinical register. It is a guide only: never copy, closely paraphrase or reproduce its text, tables or structure verbatim; never name or cite it.
  - AMBOSS is the main drafting knowledge base; its reference lists supply the primary citations (a paywalled primary source may be cited on AMBOSS's word). Use it in the owner's own Chrome (Claude in Chrome, new window), where the sign-in lasts.
  - **Newest-guideline search first:** before drafting or updating any card, search independently for the newest final guidelines and consensus statements (society websites, the guideline journals, PubMed for the last 24 months); don't rely on AMBOSS, the handbook or built-in knowledge for this. The independent reviewer repeats it, and the review log lists the guidelines found with dates (DECISIONS 2026-10-20, "Newest-guideline search before drafting").
  - Cite the primary guideline or study (US first, newest final edition; drafts aren't cited). Common clinical practice may go uncited with the stethoscope marker. AMBOSS itself only as a last resort (green check, hidden source, tell the owner each time).
  - Verify every key claim and dose against the guideline full text, the FDA label and AMBOSS. OpenEvidence is a last resort the owner runs: only claims nothing else can verify go to it, as one-line batches the owner pastes in and returns. Claude never types into OpenEvidence and never cites it (DECISIONS 2026-10-20).
  - AMBOSS, OpenEvidence and the handbook are never named or cited in the app or in card content and sources.
  - Summarize, never copy. Every card gets the internal accuracy check and an independent reviewer (DECISIONS.md), with extra care for doses; the review log notes how each claim and dose was verified.
- Copyrighted reference material (the reference handbook PDF in `~/Documents/Wards-reference/`) never goes into the repo.
- All content edits happen through Claude in chat; there is no in-app editing.
- Use precise medical terminology (hypoxemia, not "low oxygen"); lay terms and abbreviations only as search aliases.

## Stack
React + TypeScript + Vite, Vite PWA plugin (fully offline, prompt-to-update), GitHub Actions (checks on PRs, publish `main` to Pages), Dependabot. Content as files in the repo. Follows the iPhone's Text Size and light/dark appearance. Hidden from search engines by the page's `noindex` tag, and limited to its own scripts by a security policy in `index.html`. How to run it: see README.

## Design
- Use the AKG Design System: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (read its `project/README.md` first). Don't invent colors, type sizes or components outside it; propose additions to the design system instead.
- The app uses a copy in `vendor/akg/`; `vendor/akg/VERSION.md` says which version and how to update it. `npm run tokens` turns its tokens into `src/design/tokens.css` (iOS text styles in rem so they follow Text Size).
- Current version: Button `choice` variant with `selected` and `block` (2026-10-21, pathway decisions), after Figure drawings with a full-screen scroll-and-zoom view (2026-10-21) and Button `subtitle`, the `tinted-label` token and the `checkmark`, `plus` and `minus` icons (2026-10-20); exact version in `vendor/akg/VERSION.md`. Every symbol comes from SF Symbols (drawn after it; the README's Iconography rules). Four themes (`ios-light`, `ios-dark`, `macos-light`, `macos-dark`, set by `data-theme` on `<html>`), 43 text styles, and the React components under `AKG`, including content components (Callout, SourcePill with practice/verified markers, ContentSection + SectionBar, Flowchart, TappableValue, Table, Figure, Panel, GradeList, ScaleBar) and app pieces (Banner, BottomBar, Highlight, ShareButton, NumberField). Its README's "One color, one job" rule sets what each color means in card content. iOS component text follows Text Size via `--akg-text-unit`. The README's "Choosing controls by platform" table says which to use where.
- **Every visual element and interaction is checked against the design system and Apple's HIG** before it ships (rule summaries: `~/Documents/Wards-reference/hig/digest/`, full text alongside). Every design review asks two things: does it follow the design system and HIG, and does it look good? Icons are always drawn after an SF Symbol. When Wards needs something the design system lacks, add it there first (kept generic), then copy it in.
- The design system is shared across AKG projects. Change it only when the owner asks, and keep it generic (nothing Wards-specific).

## Content structure
Card types and their sections: `docs/CARD-TYPES.md`. Shared data (one home, inserted, never retyped): `docs/DATA-TYPES.md`. How to write the files: `docs/CONTENT-FORMAT.md`. Follow them exactly; `npm run content:check` enforces them.

## Where things stand
See `docs/STATUS.md`.

## Accounts
- GitHub: `akgrepos`. Repo: https://github.com/akgrepos/wards. Live address: https://akgrepos.github.io/wards/
