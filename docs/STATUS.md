# Status

Last updated 2026-10-17 (HIG review applied). A short snapshot so the next session can pick up where the last one stopped. The reasons behind each choice are in [DECISIONS.md](DECISIONS.md).

## Done
- **Foundations and setup complete.** The app is live at https://akgrepos.github.io/wards/ (version 2026.10.17.6): the first card (Hyperkalemia), its own icon, offline use, the "Update Ready" banner, light/dark and Text Size support.
- **Process:** branch and pull request per task, automatic checks (anonymous authors, design system styles, type-check, tests, build), automatic publishing from `main`, weekly Dependabot updates plus security fixes.
- **Privacy and security:** anonymous history, private GitHub profile with passkey and two-factor sign-in, protected `main`, rebase-only merges, page hidden from search engines and limited to its own scripts.
- **AKG Design System** fourth pass (HIG review) published: https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (copy in `vendor/akg/`).

## Content planning: done (2026-10-17, see DECISIONS.md)
Topic list (private; 16 systems plus the Library, about 488 cards plus 41 scores, Wave 1 = 30 cards), card types (`docs/CARD-TYPES.md`), data types (`docs/DATA-TYPES.md`), flowchart format and citation format.

## Next
1. ~~**Design system additions**~~ done (2026-10-17, design system third pass, copied in version 2026.10.17.3): generic components the cards need (flowchart, source pill, card sections) and Text Size support for the design system's components.
2. ~~**App build for cards**~~ done (version 2026.10.17.4): content files and checks, home and system screens, card pages with links, inserts, source pills and flowcharts. Search is not built yet.
3. ~~**HIG review**~~ done (version 2026.10.17.6): design system fourth pass and the app fixes chosen by the owner (see DECISIONS.md).
4. **Pilot cards:** Hyperkalemia (2026.10.17.5, reworded in 2026.10.17.7) and Acute kidney injury (2026.10.17.7) done. Next: Electrolyte repletion, adjusting the template after each; then scale in batches. The owner signs in to AMBOSS and OpenEvidence in the built-in browser when needed.

## Known limits
- GitHub keeps hidden copies of the pre-rewrite commits behind pull requests #1–#7; only GitHub Support or re-creating the repo removes them. One later commit lists the old display name "AG", and the account name is also the owner's initials.

## Possible later work on the design system
Not requested yet; listed so nothing is forgotten.
- From the HIG review, not chosen: accessibility-only items (VoiceOver headings and labels, focus handling, Reduce Motion, Increase Contrast), a Back label naming the previous page, a home title other than the app name, primary/cancel roles on Button, numbered-step lists.
- Remaining kit items: "Over-glass" and inactive-window variants, iOS wheel-style date picker, full color spectrum picker, iPad-specific menus and popover arrows, macOS toolbar pop-ups. Each component's README lists what it skipped under Notes.
- Known approximations: Liquid Glass is a translucent blur plus shadow, and icons are simple SVG stand-ins for SF Symbols.
