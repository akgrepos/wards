# Status

Last updated 2026-10-19 (2026.10.19.12: pathways become whole-card maps; 2026.10.19.11: Wave 1 batch 1, Hyponatremia, Hypokalemia and IV Fluids; 2026.10.19.10: "When to Call" renamed Escalation; 2026.10.19.9: pathway test layout M, the whole flowchart; 2026.10.19.8: I, K, A, L; 2026.10.19.7: I, K, J, L; 2026.10.19.6: Stages, Tree, Map; 2026.10.19.5: first set; 2026.10.19.4: third pilot card, Electrolyte Repletion; before that, redesign Phase 4, Rapids pages and Timed Mode, in 2026.10.19.3). A short snapshot so the next session can pick up where the last one stopped. The reasons behind each choice are in [DECISIONS.md](DECISIONS.md).

## Start here next time
1. **Read first:** `CLAUDE.md`, then DECISIONS.md "Card-writing process" (2026-10-19) and "Sources, updated" before writing any card.
2. **Next: Wave 1 batch 2** (next three cards from the private topic list's Wave 1), same process as batch 1: handbook as outline, AMBOSS for drafting and primary citations, OpenEvidence on every key claim and dose, independent reviewer per card. Batch 1 is live (2026.10.19.11): Hyponatremia (with a Rapids page), Hypokalemia, IV Fluids: Selection and Dosing.
   - Batch 1 follow-ups done in 2026.10.19.13 (albumin maximum now cited to AASLD 2024; potassium in kidney impairment follows the labels; the unverified 50–80% figure removed).
3. **Pathways are whole-card maps** (2026.10.19.12): AKI and Hyperkalemia each have one zoomable flowchart, opened from a Pathway row under the card's title (or Library › Pathways). Owner to try them on the phone, especially pinch-zoom smoothness on these larger maps (the simulator can't judge it), and say what to change. Format: CONTENT-FORMAT.md "Pathway maps". Next maps: only for cards where a flowchart helps, one card at a time; the owner chooses which. Not done: moving the map's pieces into the AKG Design System as a generic component (the map uses standard Buttons, Tags, ListRows and Toolbar pieces, so nothing new was needed).
4. **Build the approved redesign** (plan approved 2026-10-18, see DECISIONS): Phases 1–4 are done (design system additions; app frame and navigation; topic pages; Rapids pages and Timed Mode). Next is **Phase 5, Library and full search** (offline search across sections, drugs and tools; possibly one file per card), then 6 (final light/dark/Text Size check and independent review). One PR each, each live when done.
   - Phase 4 follow-up: Search doesn't list emergencies yet (Phase 5).
5. **Review the rest of the audits** (filed 2026-10-17). Owner's order: design (done via the redesign), then process; clinical fixes later, since the app isn't in clinical use yet. Five reports kept privately: design/UI/UX, navigation, process, systems/security/privacy, clinical content. Present the findings and let the owner choose what to fix with question pop-ups.
   - Done: the repo identity fix (re-created 2026-10-18).
   - Saved for later: the clinical highs (terlipressin boxed warning, Hyperkalemia causes table, calcium chloride arrest rate, insulin onset).
6. **Owner checks on the phone** (version 2026.10.19.11): read Hyponatremia and its Rapids page (Rapids › Hyponatremia; try Timed Mode), Hypokalemia and IV Fluids: Selection and Dosing; open a few dose rows (3% saline, tolvaptan, maintenance fluid, albumin) and say what to change. (Version 2026.10.19.4:) open Topics › Kidney › Electrolyte Repletion; read it through, open a few dose rows (IV potassium chloride, potassium phosphate, calcium gluconate) and say what to change. (Version 2026.10.19.3:) open Rapids › Hyperkalemia, tap a dose row and the top-right button; tap Start Timed Mode, Mark Given a few doses, minimize it (down arrow), move around the app with the timer bar, close and reopen the app, then End Timed Mode and look at the summary. On the Hyperkalemia topic, try the red button at the top right. On Home, try Edit next to Rapids. (Version 2026.10.19.2:) on AKI and Hyperkalemia, only the KDIGO criteria name, dose rows and AKI's two contrast eGFR cutoffs should be dotted; say if any other value should still open a pop-up. (Version 2026.10.19:) open Acute Kidney Injury, tap the quote-mark button and a few source tags, check the Criteria/Note boxes, stage rows and urinary indices table, and tap the Pathway row (empty page for now). Earlier checks (version 2026.10.18.3):
   - Open Hyperkalemia and Acute Kidney Injury: try the Contents button, closing sections, More Information and a dose row; say what feels off.
   - Try the new tabs, the star, Continue Reading and Search.
   - Tap Reload on "Update Ready" and confirm the app updates. One simulator Home Screen copy didn't reload; a safety net was added, and Safari reloaded fine.
   - Remove Wards from the Home Screen and add it back once, so the dark launch screen takes effect. Then confirm there's no white flash in dark mode.
   - Read the AKI and Hyperkalemia cards; note any wording or content changes. (First round of feedback fixed in 2026.10.18.7; the mock-up round for guideline attribution, color, the flowchart's end and the urine-index layout is separate.)
7. **Next: adjust the card templates now that all three pilots are live** (Hyperkalemia, AKI, Electrolyte Repletion). Candidates:
   - a short style guide for the clinical register in `docs/CONTENT-FORMAT.md`
   - whether approach cards need fewer sections
   - the "most common" vs "cannot miss" layout
   - from Pilot 3: the typed-dose check also blocks rates and deficits in prose (e.g. "20 mEq/h"), so they had to move into dose notes; a dose row doesn't show its indication, so level-based rows need a lead-in line each; reference cards have no definition line; long table cells make tall rows on a phone
   - from Pilot 3: at the largest Text Sizes the Contents menu cuts section names short ("Indicatio…")
   Then plan batch production of Wave 1.
8. **Inputs needed from the owner:** sign in to AMBOSS and OpenEvidence in the built-in browser if their sessions have expired.

## Done
- **App:** live at https://akgrepos.github.io/wards/ (version 2026.10.19.11).
  - Wave 1 batch 1: Hyponatremia (condition, Rapids page for severe symptoms), Hypokalemia (condition), IV Fluids: Selection and Dosing (reference, protocol).
  - Rapids: Hyperkalemia's emergency page (Do Now steps from the card's own lines and doses), the Do Now pop-up on its topic page, Home shortcuts with Edit, and Timed Mode (log with Undo, Due Next, minimize to a timer bar, end confirmation, summary with Copy Summary; kept on the phone, survives closing the app).
  - Cards: Hyperkalemia (condition), Acute Kidney Injury (approach) and Electrolyte Repletion (reference, protocol: potassium, magnesium, phosphate and calcium, 17 dose rows) on the new topic pages: Contents menu, collapsible remembered sections, More Information, source tags per line on demand (quote-mark button; no section source lines), one color per job (Criteria and Note boxes, gray tables, severity ramp), stage rows, dose rows with dose sheets, cutoffs and criteria. AKI and Hyperkalemia have whole-card pathway maps, opened from a Pathway row under the title.
  - App features: four tabs (Home, Rapids, Topics, Library) with search; Continue Reading, Favorites and Recent kept on the phone; offline use (checked on every build), the "Update Ready" banner, light/dark mode and Text Size support, readable width, and reopening on the last page within 30 minutes.
- **Process:** branch and pull request per task, automatic checks (anonymous authors, design system styles, content, type-check, tests, build), automatic publishing from `main`, weekly Dependabot updates plus security fixes. End-of-chat wrap-up via the `wards-wrap-up` skill.
- **Privacy and security:** anonymous history, private GitHub profile with passkey and two-factor sign-in, protected `main`, rebase-only merges, page hidden from search engines and limited to its own scripts.
- **AKG Design System** fifth pass, redesign additions, tabs sized to labels, SF Symbols iconography rule, AKI-redesign additions (Panel, GradeList, severity tones, toggle bar button, one-color-one-job rule, redrawn gear), and the `chevron.down` icon for Timed Mode (version 1792454681-dae8): https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (copy in `vendor/akg/`).
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
