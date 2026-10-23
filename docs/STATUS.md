# Status

Last updated 2026-10-23 (live version 2026.10.22.13). A short snapshot. Reasons are in [DECISIONS.md](DECISIONS.md) (older rows: [DECISIONS-archive.md](DECISIONS-archive.md)); what changed in each version is in [CHANGELOG.md](../CHANGELOG.md).

## Start here next time
1. **Open a new chat and type "Start Main".** The `wards-main` skill renames it "Main", checks sessions, pull requests and branches, and delegates (at most two side sessions at a time).
2. **Read first:** `CLAUDE.md`, then `docs/CARD-WRITING-CHEATSHEET.md`; DECISIONS "Card-writing process" and "Sources, updated" before any card work.
3. **Design pass done** (owner's 17 phone-testing items all built, 2026.10.21.8 to .24): compact steps and Rapids text, stacked staging bands and scale boxes, dose sheets with inline sources, titled criteria, Contents subsections, six interactive calculators, full-width Treatment steps. Details in CHANGELOG.
4. **Owner checks on the phone** (tap Reload on "Update Ready"): the list is in [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Owner phone-checks".
   - **Not yet independently reviewed** cards (reviewer deferred 2026-10-21; one review pass when building is done): see [REVIEW-QUEUE.md](REVIEW-QUEUE.md). New cards add themselves to that file.
5. **Next work** (Main picks with the owner):
   - **Wave 1 is complete: 30 of 30 cards live.** Open item: the Alcohol Withdrawal pinned-app test (card and Rapids page, normal and Timed Mode, light and dark, plus screenshots) was blocked by the app's safety filter in its ship session; until it is done the card is only checked by the automatic checks and the owner's phone.
   - **Approved, not started:** record how each dose was verified in the dose data and make `content:check` reject unrecorded doses (memory: project-dose-verification-record). Then the independent review pass (guideline search once, dose-heavy cards first) before any clinical use.
   - **New tools (2026.10.23, PR #103):** `scripts/status.sh`, `wait-live.sh`, `tidy.sh`, `shots.sh`, `npm run release`, `npm run card:new`. `shots.sh` is untested in the Simulator. Sessions should use them.
   - More in [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Next work".
6. **Inputs from the owner:** the clinical reference (Clinical care mode) is used in the owner's Chrome (Claude in Chrome, new window). The app is not used clinically yet; the independent review pass happens before it is. The AI evidence checker is a last resort the owner runs (DECISIONS 2026-10-20); its DotFlow is kept privately (`~/Documents/Wards-reference/prompts/`).

## Done
Everything shipped to date is listed in [CHANGELOG.md](../CHANGELOG.md) and the DECISIONS rows; older history is in [DECISIONS-archive.md](DECISIONS-archive.md). Live at https://akgrepos.github.io/wards/. Content so far: Wave 1 batches 1-5 (30-card plan), pilots Hyperkalemia, AKI, Electrolyte Repletion; Rapids pages, Timed Mode, pathways, ECG figures, MDCalc links. Process, privacy and the AKG Design System (https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru, copy in `vendor/akg/`) are described in CLAUDE.md. HIG text and digests: `~/Documents/Wards-reference/hig/`.

## Pending check on the phone
- See [REVIEW-QUEUE.md](REVIEW-QUEUE.md). Also confirm the bullets (Hyponatremia, DKA, Complicated UTI) and the Rapids "OR" marker and source pills (normal and Timed Mode, light and dark).

## Waiting on the owner
- Phone review of everything in REVIEW-QUEUE.md (the newest cards, calculators and layout changes).
- Whether to make the guideline-audit items not chosen yet (ADHF, AKI; see Watch).
- Choices on the remaining 2026-10-17 audit findings (process next).

## Watch
- Guideline updates to track (US heart failure, KDIGO AKI, audit items, sepsis and diabetes, upcoming guidelines): moved unchanged to [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Watch".

## Known limits
- The GitHub account name is the owner's initials. (The old non-anonymous commits were removed by re-creating the repo on 2026-10-18.)

## Possible later work
- Moved unchanged to [REVIEW-QUEUE.md](REVIEW-QUEUE.md), section "Possible later work".
