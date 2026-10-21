# Status

Last updated 2026-10-20 (live version 2026.10.20.3, focused pathways). A short snapshot so the next session can pick up where the last one stopped. The reasons behind each choice are in [DECISIONS.md](DECISIONS.md); what changed in each version is in [CHANGELOG.md](../CHANGELOG.md).

## Start here next time
1. **Open a new chat and type "Start Main".** The `wards-main` skill renames it "Main", checks sessions, pull requests and branches, and runs the day by delegating to side sessions (at most three branches at a time). Nothing is parked: no open pull requests, no side sessions, only `main`.
2. **Read first:** `CLAUDE.md`, then DECISIONS.md "Card-writing process" (2026-10-19) and "Sources, updated" before any card work.
3. **Owner checks on the phone** (version 2026.10.20.3; tap Reload on "Update Ready"), then say what to change (Main sends it to a fix session):
   - New cardiology cards: Atrial Fibrillation (with its Rapids page: AF with RVR, Timed Mode), Acute Coronary Syndrome: NSTEMI and Unstable Angina, Acute Decompensated Heart Failure (dose sheets, US vs European comparisons under More Information).
   - New cards: Community-Acquired Pneumonia, Cellulitis and Erysipelas, Pyelonephritis and Complicated UTI (gray Regimen boxes, dose sheets); Hyponatremia (with its Rapids page), Hypokalemia, IV Fluids; Electrolyte Repletion.
   - New focused pathways: Hyperkalemia: Treatment and AKI: Cause Workup (Pathway row under each title, Library › Pathways): levels, dose rows, checkmark answers, pinch zoom, Current Step.
   - Rapids › Hyperkalemia: Timed Mode start to finish (Mark Given, minimize, reopen the app, End, summary).
4. **Next work** (Main picks with the owner, within the three-branch limit):
   - **Wave 1 batch 4**: the next three cards from the private topic list's Wave 1 (one batch at a time, owner reviews each on the phone). Focused pathways for AF (e.g. rate vs rhythm, anticoagulation) and ADHF can now be built in the new format; their drafted box content is in the batch 3 pull request. Batch 2 leftovers, possible later: an aztreonam row for beta-lactam allergy, IV moxifloxacin, the newer oral carbapenem for complicated UTI.
   - **Card template adjustments** from the three pilots: a short clinical-register style guide in CONTENT-FORMAT.md; whether approach cards need fewer sections; the "most common" vs "cannot miss" layout; rates and deficits in prose blocked by the typed-dose check; dose rows that need an indication lead-in; a definition line for reference cards; tall table rows on a phone; Contents menu names cut short at the largest Text Sizes.
   - **Redesign Phase 5, Library and full search** (offline search across sections, drugs and tools, including Rapids pages; possibly one file per card), then **Phase 6** (final light/dark/Text Size check and independent review).
   - **More focused pathways** (e.g. Hyponatremia: Workup and Treatment), only where sequential thinking helps; the owner picks.
   - Small follow-up: switching light/dark while the app is open leaves the strip behind the clock in the old color until the app is reopened.
   - **Audits** (filed 2026-10-17, kept privately): process items next; clinical fixes later (saved: terlipressin boxed warning, Hyperkalemia causes, calcium chloride arrest rate, insulin onset).
5. **Inputs needed from the owner:** The clinical reference is used in the owner's Chrome (Claude in Chrome, new window), where the sign-in lasts. The AI evidence checker is a last resort the owner runs by pasting batches (DECISIONS 2026-10-20); its `.card_check` DotFlow and its how-to are kept privately (`~/Documents/Wards-reference/prompts/`).

## Done
- **App:** live at https://akgrepos.github.io/wards/ (version 2026.10.20.3).
  - Pathways are focused, levelled flowcharts (2026-10-20): Hyperkalemia: Treatment and AKI: Cause Workup; several per card allowed; dose rows in boxes; rebuilt pinch zoom and Current Step.
  - Wave 1 batch 3: Atrial Fibrillation (condition, Rapids page for AF with RVR), Acute Coronary Syndrome: NSTEMI and Unstable Angina, Acute Decompensated Heart Failure (condition cards, Cardiology).
  - Wave 1 batch 2: Community-Acquired Pneumonia, Cellulitis and Erysipelas, Pyelonephritis and Complicated Urinary Tract Infection (all condition cards, Infectious Disease); regimen boxes.
  - Wave 1 batch 1: Hyponatremia (condition, Rapids page for severe symptoms), Hypokalemia (condition), IV Fluids: Selection and Dosing (reference, protocol).
  - Rapids: Hyperkalemia's emergency page (Do Now steps from the card's own lines and doses), the Do Now pop-up on its topic page, Home shortcuts with Edit, and Timed Mode (log with Undo, Due Next, minimize to a timer bar, end confirmation, summary with Copy Summary; kept on the phone, survives closing the app).
  - Cards: Hyperkalemia (condition), Acute Kidney Injury (approach) and Electrolyte Repletion (reference, protocol: potassium, magnesium, phosphate and calcium, 17 dose rows) on the new topic pages: Contents menu, collapsible remembered sections, More Information, source tags per line on demand (quote-mark button; no section source lines), one color per job (Criteria and Note boxes, gray tables, severity ramp), stage rows, dose rows with dose sheets, cutoffs and criteria. AKI and Hyperkalemia have focused pathways, opened from a Pathway row under the title.
  - App features: four tabs (Home, Rapids, Topics, Library) with search; Continue Reading, Rapids shortcuts and Recent kept on the phone (Favorites removed 2026-10-20); offline use (checked on every build), the "Update Ready" banner, light/dark mode and Text Size support, readable width, and reopening on the last page within 30 minutes.
- **Process:** a daily Main chat that delegates to side sessions (`wards-main` skill, at most three branches); branch and pull request per task, automatic checks (anonymous authors, design system styles, content, type-check, tests, build), automatic publishing from `main`, weekly Dependabot updates plus security fixes. End-of-chat wrap-up via the `wards-wrap-up` skill.
- **Privacy and security:** anonymous history, private GitHub profile with passkey and two-factor sign-in, protected `main`, rebase-only merges, page hidden from search engines and limited to its own scripts.
- **AKG Design System** fifth pass, redesign additions, tabs sized to labels, SF Symbols iconography rule, AKI-redesign additions (Panel, GradeList, severity tones, toggle bar button, one-color-one-job rule, redrawn gear), the `chevron.down` icon for Timed Mode, and (2026-10-20) Button subtitle, tinted-label contrast token and checkmark/plus/minus symbols (version 1792549360-bdc1): https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru (copy in `vendor/akg/`).
- **Content planning:** topic list (private; 16 systems plus the Library, about 488 cards plus 41 scores, Wave 1 = 30 cards), card types, data types (now including criteria sets), flowchart and citation formats.
- **HIG reference:** full HIG text and rule summaries kept privately in `~/Documents/Wards-reference/hig/`.

## Waiting on the owner
- Phone review of the new cards, the focused pathways and Timed Mode (see "Start here" 3).
- Which Wave 1 cards go in batch 4.
- Choices on the remaining 2026-10-17 audit findings (process next).

## Watch
- **US heart failure guideline:** the 2022 AHA/ACC/HFSA guideline is still the newest US edition (October 2026); when a new one is published, update the ADHF card, whose European side already follows ESC 2026.
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
