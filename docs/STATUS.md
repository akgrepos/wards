# Status

Last updated 2026-10-21 (live version 2026.10.21.15 once merged). A short snapshot. Reasons are in [DECISIONS.md](DECISIONS.md) (older rows: [DECISIONS-archive.md](DECISIONS-archive.md)); what changed in each version is in [CHANGELOG.md](../CHANGELOG.md).

## Start here next time
1. **Open a new chat and type "Start Main".** The `wards-main` skill renames it "Main", checks sessions, pull requests and branches, and delegates (at most two side sessions at a time).
2. **Read first:** `CLAUDE.md`, then `docs/CARD-WRITING-CHEATSHEET.md`; DECISIONS "Card-writing process" and "Sources, updated" before any card work.
3. **Design pass (7 steps, one at a time):** steps 1-4 shipped (2026.10.21.8-.13). Next: the calculators (spec: `~/Documents/Wards-reference/design-build-spec-2026-10-21.md`).
4. **Owner checks on the phone** (tap Reload on "Update Ready"), then say what to change:
   - MDCalc links on score and calculator names (blue with arrow; MAP, BMI and words in dose sheets deliberately not linked).
   - Batch 4 cards: Sepsis and Septic Shock, DKA and HHS (Rapids page, DKA: Treatment pathway), Hyperglycemia in the Hospitalized Patient; try both Rapids pages in Timed Mode and the dose sheets.
   - Cardiology: Atrial Fibrillation (Rapids page), NSTEMI/Unstable Angina, Acute Decompensated Heart Failure.
   - Batch 2 and 1: CAP, Cellulitis and Erysipelas, Pyelonephritis and Complicated UTI; Hyponatremia (Rapids page), Hypokalemia, IV Fluids; Electrolyte Repletion.
   - Pathways as decision trees (Hyperkalemia: Treatment, AKI: Cause Workup, DKA: Treatment); ECG figures on AF, NSTE-ACS, Hypokalemia, Hyperkalemia; Rapids › Hyperkalemia Timed Mode.
   - **Not yet independently reviewed** (reviewer deferred 2026-10-21; each card had its own accuracy and dose check): COPD Exacerbation, Hypoxemic Respiratory Failure, VTE: Diagnosis, Anticoagulant Selection and Management (Opus-verified, a trial, not the independent review), and every card shipped since. The COPD and VTE reviews were stopped unfinished. Run one review pass when building is done (guideline search once; dose-heavy cards first).
5. **Next work** (Main picks with the owner):
   - **Interactive calculators** (serum osmolality, anion gap, corrected sodium, CURB-65, Wells DVT and PE): in progress in its own session.
   - Wave 2 inpatient insulin card (titration, adds to the hyperglycemia card's starting doses). Focused pathways for AF and ADHF (drafted box content is in the batch 3 PR). Batch 2 leftovers: aztreonam row for beta-lactam allergy, IV moxifloxacin, the newer oral carbapenem for complicated UTI.
   - **ECG library** (Library › ECGs on the Media data type; only real labeled recordings, otherwise a drawing).
   - **Card template adjustments:** clinical-register style guide in CONTENT-FORMAT.md; fewer sections for approach cards?; "most common" vs "cannot miss" layout; rates and deficits in prose blocked by the typed-dose check; dose rows needing an indication lead-in; definition line for reference cards; tall table rows on a phone; Contents names cut short at the largest Text Sizes.
   - **Redesign Phase 5** (offline search across sections, drugs, tools, Rapids; possibly one file per card), then **Phase 6** (final light/dark/Text Size check and independent review).
   - More focused pathways (e.g. Hyponatremia: Workup and Treatment) only where sequential thinking helps.
   - **Audits** (private): process items next; clinical fixes later (terlipressin boxed warning, Hyperkalemia causes, calcium chloride arrest rate, insulin onset).
6. **Inputs from the owner:** the clinical reference is used in the owner's Chrome (Claude in Chrome, new window). The AI evidence checker is a last resort the owner runs (DECISIONS 2026-10-20); its DotFlow is kept privately (`~/Documents/Wards-reference/prompts/`).

## Done
Everything shipped to date is listed in [CHANGELOG.md](../CHANGELOG.md) and the DECISIONS rows; older history is in [DECISIONS-archive.md](DECISIONS-archive.md). Live at https://akgrepos.github.io/wards/. Content so far: Wave 1 batches 1-5 (30-card plan), pilots Hyperkalemia, AKI, Electrolyte Repletion; Rapids pages, Timed Mode, pathways, ECG figures, MDCalc links. Process, privacy and the AKG Design System (https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru, copy in `vendor/akg/`) are described in CLAUDE.md. HIG text and digests: `~/Documents/Wards-reference/hig/`.

## Pending check (2026.10.21.15)
- Bullets instead of semicolon lists (swept 2026.10.21.15): look at Hyponatremia, DKA and Complicated UTI on the phone; two-item semicolon lines were deliberately left.

## Pending check (2026.10.21.14)
- Rapids "OR" marker and Do Now source pills fixed; confirm in the pinned Simulator app after deploy (normal and Timed Mode, light and dark).

## Waiting on the owner
- Phone review of batch 4 (sepsis, DKA/HHS, inpatient hyperglycemia), the DKA pathway and both new Rapids pages, plus the earlier items in "Start here" 3.
- Whether to make the guideline-audit items not chosen yet (ADHF, AKI; see Watch).
- Choices on the remaining 2026-10-17 audit findings (process next).

## Watch
- **US heart failure guideline:** the 2022 AHA/ACC/HFSA guideline is still the newest US edition (October 2026); when a new one is published, update the ADHF card, whose European side already follows ESC 2026.
- **KDIGO 2026 AKI/AKD guideline:** public-review draft only (March 2026). When the final is published, update the AKI card. Expected changes: cystatin C criteria, biomarker staging, AKD, glucose 140–180 mg/dL, bicarbonate before RRT at pH <7.20, deferred RRT.

- **Audit items not chosen yet (2026-10-20; details in the PR):** ADHF could add the 2024 ACC inpatient heart failure pathway and the Second Universal Definition of Heart Failure (June 2026); AKI could cite Surviving Sepsis 2026 for balanced fluids and note the 2024 ADQI/ICA cirrhosis AKI consensus (albumin for 24 h vs 48 h); CAP's hydrocortisone line should be checked against Surviving Sepsis 2026 (steroids now suggested for all septic shock); dose rows for the newer β-lactams named on Complicated UTI; IDSA's MRSA (2011) and catheter UTI (2009) guidelines are now archived with no successor; the 2025 ACC/AHA ACS guideline has three published corrections to check against NSTE-ACS doses.
- **Sepsis and diabetes (batch 4):** ADA Standards of Care 2027 (expected December 2026) replace the 2026 sections cited on the DKA and hyperglycemia cards; a future sepsis definition may adopt the SOFA-2 score (JAMA, December 2025), not yet adopted by any consensus; the SCCM/ESICM refractory septic shock criteria (2026) await validation; the international inpatient CGM and pump position statement (September 2026) could not be read in full.
- **Upcoming guidelines:** UK hyperkalaemia guideline review (due October 2026); KDIGO 2027 CKD focused update (public review from October 2026); ACC/AHA heart failure update (2027); ESC ACS (2027); IDSA uncomplicated cystitis and pyelonephritis (in development); a lab statement (April 2026) against reporting albumin-corrected calcium (Electrolyte Repletion).

## Known limits
- The GitHub account name is the owner's initials. (The old non-anonymous commits were removed by re-creating the repo on 2026-10-18.)

## Possible later work
Not requested yet; listed so nothing is forgotten.
- **App:**
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
