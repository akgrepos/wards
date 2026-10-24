# Status

Last updated 2026-10-24 (live version 2026.10.23.5). A short snapshot. Reasons are in [DECISIONS.md](DECISIONS.md) (older rows: [DECISIONS-archive.md](DECISIONS-archive.md)); what changed in each version is in [CHANGELOG.md](../CHANGELOG.md).

## Start here next time
1. **Open a new chat and type "Start Main".** The `wards-main` skill renames it "Main", checks sessions, pull requests and branches, and delegates (at most two side sessions at a time).
2. **Read first:** `CLAUDE.md`, then `docs/CARD-WRITING-CHEATSHEET.md`; DECISIONS "Card-writing process" and "Sources, updated" before any card work.
3. **Design pass done** (owner's 17 phone-testing items all built, 2026.10.21.8 to .24): compact steps and Rapids text, stacked staging bands and scale boxes, dose sheets with inline sources, titled criteria, Contents subsections, six interactive calculators, full-width Treatment steps. Details in CHANGELOG.
4. **Owner checks on the phone** (tap Reload on "Update Ready"): [REVIEW-QUEUE.md](REVIEW-QUEUE.md), first "Awaiting iPhone confirmation" (newest changes), then "Owner phone-checks". The owner is back on the Mac permanently (2026-10-24): Claude tests in the iOS Simulator, the owner confirms on the iPhone.
   - **Not yet independently reviewed** cards (reviewer deferred 2026-10-21; one review pass when building is done): see [REVIEW-QUEUE.md](REVIEW-QUEUE.md). New cards add themselves to that file.
5. **Next work** (Main picks with the owner; nothing is running, no open PRs). **Owner decided (2026-10-23): foundation/design first, clinical review on hold** (ask Fable how to run it later), no new cards until the foundation is done.
   - **Shipped today:** content split per card, no semicolons, tap-highlight and pop-up scroll fixes, table sources and symbols, Node scripts (`npm run status|wait-live|tidy`), and the Acute Agitation card (first Psychiatry card, folder `content/cards/psych`).
   - **Owner idea list (not started; send to sessions only when the owner says go):** see [REVIEW-QUEUE.md](REVIEW-QUEUE.md) "Owner ideas". Order agreed: A (table symbols and sources) is done; **B** three clearly different tappable kinds (info pop-ups such as renal tubular acidosis types, calculators, card links that open a specific preview with "Open full card"), mock-up first; **C** visual distinction of card parts and how colors are used (mock-up, then design system, then app).
   - **Foundation work still open (Fable audit 2026-10-23):** medication card pilot (ceftriaxone; `drug:` on every dose; owner decided medication cards are the home of doses), pilots for other untested card types (procedure, score, exam, test) with their data types, full search (Phase 5), planned-link rendering check, table scroll cue, banned-words CI check, tap-target check, Increase Contrast, Rapids A-Z.
   - **Psychiatry priority** (owner starts a psychiatry rotation): after the foundation, Suicide risk assessment, Serotonin syndrome and NMS, Lithium and psychotropic safety, then an antidepressant comparison (coverage-style grid, a new data type documented first). Memory: project-psychiatry-priority.
   - **Independent review pass** (guideline search once, dose-heavy cards first, 220 doses marked `not-verified`) is on hold until the owner and Fable decide how; required before any clinical use.
   - More in [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Next work".
6. **Machine:** the Mac (owner, 2026-10-24). Testing is lean on screenshots (CLAUDE.md "Test in proportion").
   - **Held from the machine switch:** draft PR #125 (ceftriaxone Medication card, Opus-verified, ready for a fresh Sonnet ship session) and the mock-up B artifact https://claude.ai/artifact/9xADZ4saXpU6gutsyRjXeb (owner picks favorites, then a build brief). The two PC chats are not carried over; start fresh sessions from these.
7. **Inputs from the owner:** the clinical reference (Clinical care mode) is used in the owner's Chrome (Claude in Chrome, new window). The app is not used clinically yet; the independent review pass happens before it is. The AI evidence checker is a last resort the owner runs (DECISIONS 2026-10-20); its DotFlow is kept privately (`~/Documents/Wards-reference/prompts/`).

## Done
Everything shipped to date is listed in [CHANGELOG.md](../CHANGELOG.md) and the DECISIONS rows; older history is in [DECISIONS-archive.md](DECISIONS-archive.md). Live at https://akgrepos.github.io/wards/. Content so far: Wave 1 batches 1-5 (30-card plan), pilots Hyperkalemia, AKI, Electrolyte Repletion; Rapids pages, Timed Mode, pathways, ECG figures, MDCalc links. Process, privacy and the AKG Design System (https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru, copy in `vendor/akg/`) are described in CLAUDE.md. HIG text and digests: `~/Documents/Wards-reference/hig/`.

## Pending check on the phone
- See [REVIEW-QUEUE.md](REVIEW-QUEUE.md). Also confirm the bullets (Hyponatremia, DKA, Complicated UTI) and the Rapids "OR" marker and source pills (normal and Timed Mode, light and dark).

## Waiting on the owner
- **iPhone confirmation** of the six items in REVIEW-QUEUE "Awaiting iPhone confirmation" (tap Reload on "Update Ready"): table symbols, Acute Agitation, no semicolons, content split, tap highlight, pop-up scroll.
- The next idea group to start (B or C mock-ups), the ceftriaxone medication pilot, or the Suicide risk card.
- Whether to make the guideline-audit items not chosen yet (ADHF, AKI; see Watch).
- Choices on the remaining 2026-10-17 audit findings (process next).

## Watch
- Guideline updates to track (US heart failure, KDIGO AKI, audit items, sepsis and diabetes, upcoming guidelines): moved unchanged to [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Watch".

## Known limits
- The GitHub account name is the owner's initials. (The old non-anonymous commits were removed by re-creating the repo on 2026-10-18.)

## Possible later work
- Moved unchanged to [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Possible later work".
