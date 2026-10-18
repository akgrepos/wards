# Status

Last updated 2026-10-18 (repo re-created to remove the old non-anonymous commits). A short snapshot so the next session can pick up where the last one stopped. The reasons behind each choice are in [DECISIONS.md](DECISIONS.md).

## Start here next time
1. **Read first:** `CLAUDE.md`, then DECISIONS.md "Sources, updated" (all content rules) before writing any card.
2. **Review the audits** (filed 2026-10-17, no choices made yet). Five reports kept privately: design/UI/UX, navigation, process, systems/security/privacy, clinical content. Present the findings and let the owner choose what to fix with question pop-ups.
   - Done: the repo identity fix (re-created 2026-10-18). Next: the clinical highs (terlipressin boxed warning, Hyperkalemia causes table, calcium chloride arrest rate, insulin onset).
   - When the owner asks, run the saved "expert team" design prompt (kept privately with the audits).
3. **Owner checks on the phone** (version 2026.10.17.7):
   - Tap Reload on "Update Ready" and confirm the app updates. One simulator Home Screen copy didn't reload; a safety net was added, and Safari reloaded fine.
   - Remove Wards from the Home Screen and add it back once, so the dark launch screen takes effect. Then confirm there's no white flash in dark mode.
   - Read the AKI and Hyperkalemia cards; note any wording or content changes.
4. **Then: Pilot 3, Electrolyte repletion** (reference card, protocol variant):
   - Handbook section first, for wording and organization.
   - Primary sources via AMBOSS reference lists, plus OpenEvidence spot-checks (Sackett or Snow mode).
   - Independent reviewer; simulator check; PR.
5. **After the three pilots:** adjust the card templates. Candidates:
   - a short style guide for the clinical register in `docs/CONTENT-FORMAT.md`
   - whether approach cards need fewer sections
   - the "most common" vs "cannot miss" layout
   Then plan batch production of Wave 1.
6. **Inputs needed from the owner:** sign in to AMBOSS and OpenEvidence in the built-in browser if their sessions have expired.

## Done
- **App:** live at https://akgrepos.github.io/wards/ (version 2026.10.17.7).
  - Cards: Hyperkalemia (condition) and Acute Kidney Injury (approach), with flowcharts, tappable doses, cutoffs and criteria, and source pills with stethoscope/check markers.
  - App features: offline use, the "Update Ready" banner, light/dark mode and Text Size support, readable width, and reopening on the last card.
- **Process:** branch and pull request per task, automatic checks (anonymous authors, design system styles, content, type-check, tests, build), automatic publishing from `main`, weekly Dependabot updates plus security fixes. End-of-chat wrap-up via the `wards-wrap-up` skill.
- **Privacy and security:** anonymous history, private GitHub profile with passkey and two-factor sign-in, protected `main`, rebase-only merges, page hidden from search engines and limited to its own scripts.
- **AKG Design System** fourth pass plus SourcePill markers (version 1792291889-0945): https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (copy in `vendor/akg/`).
- **Content planning:** topic list (private; 16 systems plus the Library, about 488 cards plus 41 scores, Wave 1 = 30 cards), card types, data types (now including criteria sets), flowchart and citation formats.
- **HIG reference:** full HIG text and rule summaries kept privately in `~/Documents/Wards-reference/hig/`.

## Waiting on the owner
- Choices on the remaining 2026-10-17 audit findings.

## Watch
- **KDIGO 2026 AKI/AKD guideline:** public-review draft only (March 2026). When the final is published, update the AKI card. Expected changes: cystatin C criteria, biomarker staging, AKD, glucose 140–180 mg/dL, bicarbonate before RRT at pH <7.20, deferred RRT.

## Known limits
- The GitHub account name is the owner's initials. (The old non-anonymous commits were removed by re-creating the repo on 2026-10-18.)

## Possible later work
Not requested yet; listed so nothing is forgotten.
- **App:**
  - search (the design system's BottomBar and Highlight are ready)
  - ECG library
  - score calculators (NumberField is ready)
  - subsections assigned across the private topic list
- **Design system, from the HIG review (not chosen):**
  - accessibility-only items (VoiceOver headings and labels, focus handling, Reduce Motion, Increase Contrast)
  - a Back label naming the previous page
  - a home title other than the app name
  - primary/cancel roles on Button
  - numbered-step lists
- **Design system, remaining kit items:**
  - "Over-glass" and inactive-window variants
  - iOS wheel-style date picker
  - full color spectrum picker
  - iPad-specific menus and popover arrows
  - macOS toolbar pop-ups
  - Each component's README lists what it skipped under Notes.
- **Known approximations:** Liquid Glass is a translucent blur plus shadow, and icons are simple SVG stand-ins for SF Symbols.
