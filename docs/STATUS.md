# Status

Last updated 2026-10-21 (live version 2026.10.21.26). A short snapshot. Reasons are in [DECISIONS.md](DECISIONS.md) (older rows: [DECISIONS-archive.md](DECISIONS-archive.md)); what changed in each version is in [CHANGELOG.md](../CHANGELOG.md).

## Start here next time
1. **Open a new chat and type "Start Main".** The `wards-main` skill renames it "Main", checks sessions, pull requests and branches, and delegates (at most two side sessions at a time).
2. **Read first:** `CLAUDE.md`, then `docs/CARD-WRITING-CHEATSHEET.md`; DECISIONS "Card-writing process" and "Sources, updated" before any card work.
3. **Design pass done** (owner's 17 phone-testing items all built, 2026.10.21.8 to .24): compact steps and Rapids text, stacked staging bands and scale boxes, dose sheets with inline sources, titled criteria, Contents subsections, six interactive calculators, full-width Treatment steps. Details in CHANGELOG.
4. **Owner checks on the phone** (tap Reload on "Update Ready"), then say what to change:
   - **Newest (2026.10.21.19 to .26):** the six calculators (open from a score name or the Calculate button; CURB-65, Wells DVT and PE, serum osmolality, anion gap, corrected sodium); new cards Anticoagulant Selection, Chest Pain, Dyspnea and Upper GI Bleeding (new Gastroenterology system, Rapids page in Timed Mode, pathway risk-score step); stacked scale boxes on 11 cards; Treatment steps at full card width; bullets in lists. Several of these were only partly verified in the pinned app (calculators except Wells PE and anion gap, both pathways on the new cards, dark mode).
   - MDCalc links on score and calculator names (blue with arrow; MAP, BMI and words in dose sheets deliberately not linked).
   - Batch 4 cards: Sepsis and Septic Shock, DKA and HHS (Rapids page, DKA: Treatment pathway), Hyperglycemia in the Hospitalized Patient; try both Rapids pages in Timed Mode and the dose sheets.
   - Cardiology: Atrial Fibrillation (Rapids page), NSTEMI/Unstable Angina, Acute Decompensated Heart Failure.
   - Batch 2 and 1: CAP, Cellulitis and Erysipelas, Pyelonephritis and Complicated UTI; Hyponatremia (Rapids page), Hypokalemia, IV Fluids; Electrolyte Repletion.
   - Pathways as decision trees (Hyperkalemia: Treatment, AKI: Cause Workup, DKA: Treatment); ECG figures on AF, NSTE-ACS, Hypokalemia, Hyperkalemia; Rapids › Hyperkalemia Timed Mode.
   - **Not yet independently reviewed** (reviewer deferred 2026-10-21; each card had its own accuracy and dose check): COPD Exacerbation, Hypoxemic Respiratory Failure, VTE: Diagnosis, Anticoagulant Selection and Management (Opus-verified, a trial), Dyspnea: Acute (Opus-verified; ESC 2026 heart failure thresholds read from the full text; PE lines match the VTE card), Empiric Antimicrobials (Opus-verified; SIS 2024, IDSA/SIS 2010, IDSA/ATS 2016 HAP/VAP, IDSA 2004 Table 8, IDSA 2009 CRBSI and SSC 2026 not read in full text; coverage grid cells partly common practice), Acid-Base Interpretation (Opus-verified; no guideline exists, sources are reviews, Adrogué & Madias 2010 read in full), Upper GI Bleeding, Nonvariceal (Opus-verified; ESGE 2026 and AABB 2023 read as abstracts only), Anemia: Hospitalized Adult (Opus-verified; ASH 2026 iron deficiency, AGA 2020, WHO 2024 and ESC 2026 HF iron wording from abstracts and summaries, full texts not read; B12 IM schedule and some hemolysis/AIHA lines common practice), Chest Pain (Opus-verified; ACEP 2025, STS 2026 and ACC 2025 pericarditis wording from abstracts and summaries, full texts not read), the five calculators (CURB-65, Wells PE and DVT, serum osmolality, anion gap, corrected sodium; verified by a subagent against primary sources, 2026-10-21), and every card shipped since. The COPD and VTE reviews were stopped unfinished. Run one review pass when building is done (guideline search once; dose-heavy cards first).
5. **Next work** (Main picks with the owner):
   - **Wave 1: 6 cards left (empiric antimicrobials drafted on branch `content/empiric-antimicrobials`, awaiting grid layout and ship)** (22 of 30 are live; acid-base drafted on branch `content/acid-base`, awaiting ship): ECG interpretation, empiric antimicrobials, anemia, delirium, alcohol withdrawal, VTE prophylaxis, pain and opioid conversion. One card per session using `~/Documents/Wards-reference/card-session-brief-template.md` (Sonnet drafts, Opus verifies; trial so far: Opus changed 1, 0 and 3 doses on three cards, so keep the verifier), then a Sonnet ship session. Ship briefs should also add a content-check rule that every `{{calc:id}}` in pathway text exists (the Upper GI pathway once showed raw code).
   - Wave 2 inpatient insulin card (titration, adds to the hyperglycemia card's starting doses). Focused pathways for AF and ADHF (drafted box content is in the batch 3 PR). Batch 2 leftovers: aztreonam row for beta-lactam allergy, IV moxifloxacin, the newer oral carbapenem for complicated UTI.
   - **ECG library** (Library › ECGs on the Media data type; only real labeled recordings, otherwise a drawing).
   - **Card template adjustments:** clinical-register style guide in CONTENT-FORMAT.md; fewer sections for approach cards?; "most common" vs "cannot miss" layout; rates and deficits in prose blocked by the typed-dose check; dose rows needing an indication lead-in; definition line for reference cards; tall table rows on a phone; Contents names cut short at the largest Text Sizes.
   - **Redesign Phase 5** (offline search across sections, drugs, tools, Rapids; possibly one file per card), then **Phase 6** (final light/dark/Text Size check and independent review).
   - More focused pathways (e.g. Hyponatremia: Workup and Treatment) only where sequential thinking helps.
   - **Audits** (private): process items next; clinical fixes later (terlipressin boxed warning, Hyperkalemia causes, calcium chloride arrest rate, insulin onset).
6. **Inputs from the owner:** the clinical reference (Clinical care mode) is used in the owner's Chrome (Claude in Chrome, new window). The app is not used clinically yet; the independent review pass happens before it is. The AI evidence checker is a last resort the owner runs (DECISIONS 2026-10-20); its DotFlow is kept privately (`~/Documents/Wards-reference/prompts/`).

## Done
Everything shipped to date is listed in [CHANGELOG.md](../CHANGELOG.md) and the DECISIONS rows; older history is in [DECISIONS-archive.md](DECISIONS-archive.md). Live at https://akgrepos.github.io/wards/. Content so far: Wave 1 batches 1-5 (30-card plan), pilots Hyperkalemia, AKI, Electrolyte Repletion; Rapids pages, Timed Mode, pathways, ECG figures, MDCalc links. Process, privacy and the AKG Design System (https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru, copy in `vendor/akg/`) are described in CLAUDE.md. HIG text and digests: `~/Documents/Wards-reference/hig/`.

## Pending check on the phone
- See "Start here next time" 4. Also confirm the bullets (Hyponatremia, DKA, Complicated UTI) and the Rapids "OR" marker and source pills (normal and Timed Mode, light and dark).

## Waiting on the owner
- Phone review of everything in "Start here" 4 (the newest cards, calculators and layout changes).
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
