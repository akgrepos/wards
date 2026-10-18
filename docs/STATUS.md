# Status

Last updated 2026-10-18 (repo re-created; app redesign approved; redesign Phases 1 and 2 done). A short snapshot so the next session can pick up where the last one stopped. The reasons behind each choice are in [DECISIONS.md](DECISIONS.md).

## Start here next time
1. **Read first:** `CLAUDE.md`, then DECISIONS.md "Sources, updated" (all content rules) before writing any card.
2. **Build the approved redesign** (plan approved 2026-10-18, see DECISIONS): Phases 1 (design system additions) and 2 (app frame and navigation) are done. Next is **Phase 3, topic pages**: new template and content format, dose fields, Contents menu, collapsible remembered sections, migrate Hyperkalemia and AKI. Then 4 (Rapids pages and Timed Mode), 5 (Library and full search), 6 (final check). One PR each, each live when done. The private mock-up canvas is the reference.
   - Also queued: redraw the design system's icons to match SF Symbols (reference only, never copied; DECISIONS 2026-10-18).
3. **Review the rest of the audits** (filed 2026-10-17). Owner's order: design (done via the redesign), then process; clinical fixes later, since the app isn't in clinical use yet. Five reports kept privately: design/UI/UX, navigation, process, systems/security/privacy, clinical content. Present the findings and let the owner choose what to fix with question pop-ups.
   - Done: the repo identity fix (re-created 2026-10-18).
   - Saved for later: the clinical highs (terlipressin boxed warning, Hyperkalemia causes table, calcium chloride arrest rate, insulin onset).
4. **Owner checks on the phone** (version 2026.10.18):
   - Try the new tabs, the star, Continue Reading and Search; say what feels off.
   - Tap Reload on "Update Ready" and confirm the app updates. One simulator Home Screen copy didn't reload; a safety net was added, and Safari reloaded fine.
   - Remove Wards from the Home Screen and add it back once, so the dark launch screen takes effect. Then confirm there's no white flash in dark mode.
   - Read the AKI and Hyperkalemia cards; note any wording or content changes.
5. **Then: Pilot 3, Electrolyte repletion** (reference card, protocol variant):
   - Handbook section first, for wording and organization.
   - Primary sources via AMBOSS reference lists, plus OpenEvidence spot-checks (Sackett or Snow mode).
   - Independent reviewer; simulator check; PR.
6. **After the three pilots:** adjust the card templates. Candidates:
   - a short style guide for the clinical register in `docs/CONTENT-FORMAT.md`
   - whether approach cards need fewer sections
   - the "most common" vs "cannot miss" layout
   Then plan batch production of Wave 1.
7. **Inputs needed from the owner:** sign in to AMBOSS and OpenEvidence in the built-in browser if their sessions have expired.

## Done
- **App:** live at https://akgrepos.github.io/wards/ (version 2026.10.18).
  - Cards: Hyperkalemia (condition) and Acute Kidney Injury (approach), with flowcharts, tappable doses, cutoffs and criteria, and source pills with stethoscope/check markers.
  - App features: four tabs (Home, Rapids, Topics, Library) with search; Continue Reading, Favorites and Recent kept on the phone; offline use (checked on every build), the "Update Ready" banner, light/dark mode and Text Size support, readable width, and reopening on the last page within 30 minutes.
- **Process:** branch and pull request per task, automatic checks (anonymous authors, design system styles, content, type-check, tests, build), automatic publishing from `main`, weekly Dependabot updates plus security fixes. End-of-chat wrap-up via the `wards-wrap-up` skill.
- **Privacy and security:** anonymous history, private GitHub profile with passkey and two-factor sign-in, protected `main`, rebase-only merges, page hidden from search engines and limited to its own scripts.
- **AKG Design System** fifth pass, redesign additions, tabs sized to labels (version 1792356763-b1b7): https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (copy in `vendor/akg/`).
- **Content planning:** topic list (private; 16 systems plus the Library, about 488 cards plus 41 scores, Wave 1 = 30 cards), card types, data types (now including criteria sets), flowchart and citation formats.
- **HIG reference:** full HIG text and rule summaries kept privately in `~/Documents/Wards-reference/hig/`.

## Waiting on the owner
- Choices on the remaining 2026-10-17 audit findings (process next).

## Watch
- **KDIGO 2026 AKI/AKD guideline:** public-review draft only (March 2026). When the final is published, update the AKI card. Expected changes: cystatin C criteria, biomarker staging, AKD, glucose 140–180 mg/dL, bicarbonate before RRT at pH <7.20, deferred RRT.

## Known limits
- The GitHub account name is the owner's initials. (The old non-anonymous commits were removed by re-creating the repo on 2026-10-18.)

## Possible later work
Not requested yet; listed so nothing is forgotten.
- **App:**
  - ECG library
  - score calculators (NumberField is ready)
  - subsections assigned across the private topic list
- **Design system, from the HIG review (not chosen):**
  - accessibility-only items (VoiceOver headings and labels, focus handling, Reduce Motion, Increase Contrast)
  - primary/cancel roles on Button
- **Design system, remaining kit items:**
  - "Over-glass" and inactive-window variants
  - iOS wheel-style date picker
  - full color spectrum picker
  - iPad-specific menus and popover arrows
  - macOS toolbar pop-ups
  - Each component's README lists what it skipped under Notes.
- **Known approximations:** Liquid Glass is a translucent blur plus shadow, and icons are simple SVG stand-ins for SF Symbols.
