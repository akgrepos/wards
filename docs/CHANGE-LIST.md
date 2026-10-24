# Running change list

The one list of changes the owner has asked for or that are outstanding. Main adds each owner request here the moment it arrives (with the date), groups and prioritizes them when the owner says the list is complete, moves an item to "In progress" when a session starts it, and to "Done" with the version and PR when it is live. Details and reasons stay in [DECISIONS.md](DECISIONS.md); iPhone checks in [REVIEW-QUEUE.md](REVIEW-QUEUE.md) (silence on a check means approved).

## In progress
- **Links:** card-link pop-up shows the linked card's title (not "Card"); MDCalc links inside sentences become inline text with a blue dotted underline and an end arrow (PR 159).

## To do: owner list of 2026-10-24 (not yet prioritized; Main organizes when the owner says the list is done)
1. **Home specialty cards:** vertical layout, shorter names so all fit on one screen, proper medical terms (Nephrology and Urology, not "Kidney, Electrolytes and Urology"; Pulmonology, not "Pulmonary").
2. **"Psychiatry"**, not "Psychiatry and Substance use".
3. **Card titles trimmed everywhere** ("Acute Coronary Syndrome" only, not the NSTEMI/unstable angina part); aliases keep the other names for search.
4. **Titles trimmed elsewhere** (section titles, dose rows and other rows; for example a ceftriaxone dose row says "Lyme disease" and the rest of the wording goes in the pop-up).
5. **Ceftriaxone: orphan SBP bullet** (line 39 of `content/cards/id/ceftriaxone.md`) does not fit its box; make it a proper dose row or remove it (clinical verification path).
6. **Ceftriaxone: LactMed** is not cited in Pregnancy and Lactation (the 2026-10-24 rule); also the "cefotaxime as its example" wording. Do items 3 to 6 on ceftriaxone as one content pass.
7. **Dose pop-up (ceftriaxone):** sources show in the middle of the pop-up and even when "show sources" is off; they should sit at the bottom like everywhere else and respect the setting.
8. **Search opened from a card page** has a glitchy animation; use the app's standard page transition (calm version with Reduce Motion).

## To do: carried over
9. **Design system:** add a tile grid (the home tiles still use hand-written CSS); needs the owner's explicit yes to publish.
10. **Symbols:** five existing section symbols were not re-checked against the SF Symbols app (owner sends screenshots when asked); Search rows have no icon (needs a symbol).
11. **Medication look polish (deferred from PR 150):** dose title and dose line both heavy, pressed highlight on dose rows stops at the text edge, Mac-theme bar height, bar title uses raw sizes instead of a text-style token, a future orange (caution) section needs its own symbol.
12. **Roll the Quiet colors out to the other card types**, one at a time (Condition and Approach first), each checked on the phone; the all-card-types map is in `~/Documents/Wards-reference/decisions/mockup-decisions-2026-10-24.md`.
13. **Tap targets:** 43 small ones are on the known list in `scripts/look.config.mjs` (toolbar buttons 36 points, source pills, inline links); owner said not now.
14. **Search:** per-row remove needs a design-system swipe-to-delete pattern; search still matches titles and aliases only (not drugs, sections, calculators).
15. **Coverage chart:** add MSSA and review other organism groups (VRE, ESBL, AmpC, Stenotrophomonas, Acinetobacter, Listeria, atypicals; Opus verifies); collapsible regimens inside sections.
16. **Medication card type:** six open gaps from the ceftriaxone PR (extra scaffold sections, header extras, interactions data type, one dose per indication, duration, dose-adjustment placement); other drugs' doses still lack `drug:`.
17. **Foundation (Fable audit 2026-10-23):** pilots for the untested card types (procedure, score, exam, test), planned-link rendering check, table scroll cue, banned-words CI check, Increase Contrast, Rapids A to Z.
18. **Psychiatry cards** (after the foundation): Suicide risk assessment, Serotonin syndrome and NMS, Lithium and psychotropic safety, antidepressant comparison grid (new data type, documented first).
19. **Independent clinical review pass** (on hold; required before any clinical use; 220 doses marked `not-verified`).
20. **Cleanup:** the app still contains the preview-ribbon code (harmless, preview builds only); "Awaiting iPhone confirmation" lines in REVIEW-QUEUE can be cleared (silence is approval).

## Done (newest first)
- 2026.10.24.6 Search: recent searches list (PR 156). 2026.10.24.5 Search: recents and suggestions from the template mock-up (PR 153). 2026.10.24.4 Medication card look: Quiet colors, own symbols, condition-titled doses (PR 150). 2026.10.24.3 Home tile fix (PR 147). 2026.10.24.2 Home is Topics, no Home tab (PR 146). 2026.10.24 Quick fixes: inline card links, table widths, ceftriaxone wording, Continue reading removed, stethoscope icon (PR 138). Tooling: `npm run look` (PR 149), `sim-check` finds the version itself (PR 158).
