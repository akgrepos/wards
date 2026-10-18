# Status

Last updated 2026-10-17 (planning complete; audit done). A short snapshot so the next session can pick up where the last one stopped. The reasons behind each choice are in [DECISIONS.md](DECISIONS.md).

## Done
- **Foundations and setup complete.** The app is live at https://akgrepos.github.io/wards/ (version 2026.10.17.2): a home screen with no entries yet, its own icon, offline use, the "Update Ready" banner, light/dark and Text Size support.
- **Process:** branch and pull request per task, automatic checks (anonymous authors, design system styles, type-check, tests, build), automatic publishing from `main`, weekly Dependabot updates plus security fixes.
- **Privacy and security:** anonymous history, private GitHub profile with passkey and two-factor sign-in, protected `main`, rebase-only merges, page hidden from search engines and limited to its own scripts.
- **AKG Design System** second pass published: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (copy in `vendor/akg/`).

## Content planning: done (2026-10-17, see DECISIONS.md)
Topic list (private; 16 systems plus the Library, about 488 cards plus 41 scores, Wave 1 = 30 cards), card types (`docs/CARD-TYPES.md`), data types (`docs/DATA-TYPES.md`), flowchart format and citation format.

## Next
1. **Design system additions** (approved 2026-10-17, in progress): generic components the cards need (flowchart, source pill, card sections) and Text Size support for the design system's components.
2. **App build for cards** (approved 2026-10-17, after step 1): card pages, content and data files with automatic checks, links to individual cards (any address inside `/wards/` other than the home page currently returns "not found").
3. **Pilot cards:** 2–3 from Wave 1, read on the phone, with the accuracy-check pilot test; adjust; then scale in batches. The owner signs in to AMBOSS and OpenEvidence in the built-in browser when needed.

## Known limits
- The design system's components (buttons, banners, lists) use fixed sizes, so their text doesn't follow Text Size yet; the app's own text does. Fixing that is a design system change, for the owner to decide.
- The installed app shows a brief black screen while it starts (iOS default; a launch image could replace it, set aside for now).
- GitHub keeps hidden copies of the pre-rewrite commits behind pull requests #1–#7; only GitHub Support or re-creating the repo removes them. One later commit lists the old display name "AG", and the account name is also the owner's initials.

## Possible later work on the design system
Not requested yet; listed so nothing is forgotten.
- Remaining kit items: "Over-glass" and inactive-window variants, iOS wheel-style date picker, full color spectrum picker, iPad-specific menus and popover arrows, macOS toolbar pop-ups. Each component's README lists what it skipped under Notes.
- Known approximations: Liquid Glass is a translucent blur plus shadow, and icons are simple SVG stand-ins for SF Symbols.
