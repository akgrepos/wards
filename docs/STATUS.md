# Status

Last updated 2026-10-24. Live version 2026.10.24.7 at https://akgrepos.github.io/wards/. A short snapshot: reasons are in [DECISIONS.md](DECISIONS.md) (older rows: [DECISIONS-archive.md](DECISIONS-archive.md)); what changed in each version is in [CHANGELOG.md](../CHANGELOG.md). Wave 1 (30 cards) is live.

## Start here next time
1. **Read [CHANGE-LIST.md](CHANGE-LIST.md)**: the running list of what the owner has asked for, what is in progress and what is done.
2. **Open a new chat and type "Start Main".** The `wards-main` skill renames it "Main", checks sessions, pull requests and branches, and delegates (at most two side sessions at a time).
3. **Read first:** `CLAUDE.md`, then `docs/CARD-WRITING-CHEATSHEET.md`; DECISIONS "Card-writing process" and "Sources, updated" before any card work.
4. **Phone checks** are the tap list in [REVIEW-QUEUE.md](REVIEW-QUEUE.md); silence means approved.
5. **Handoff from the 2026-10-24 Main (Main now runs on Opus):**
   - **Running when Main closed:** "Review: OE batch builder + paste-back reader" (Sonnet; writes ready-to-paste `.card_check` batches for Hyperkalemia to `~/Documents/Wards-reference/oe-batches/renal-hyperkalemia/` and `npm run review:oe-read` to file pasted answers into the ledger) and "Review pilot 2b: Opus helper on Hyperkalemia" (judges the 92 packets independently; report at `~/Documents/Wards-reference/review-packets/renal-hyperkalemia/OPUS-REVIEW.md`). Check both with `list_sessions`, merge or relay, archive.
   - **Next for the owner:** paste the Hyperkalemia batches into OpenEvidence by hand and return the tables; then compare OE with the Opus helper on the same card (agreement rate), fix the card (known: the insulin-dose wording UKKA does not support; 7 partial matches), log cost in `~/Documents/Wards-reference/usage-log.md`, and offer the owner the review pace (fast, half or slow) with real numbers.
   - **Decided, to apply:** OpenEvidence is the regular independent check for new and existing cards (owner pastes; Opus only adjudicates disagreements); Main decides the research-brief versus AMBOSS balance after a few cards. Full proposed card process is in DECISIONS (2026-10-24, "Card process with OpenEvidence"); fold it into CLAUDE.md and the brief template in one notes PR.
   - **Owner list:** 11 items in CHANGE-LIST, held until the owner says the list is complete; then organize, prioritize and propose the order in one pop-up.
   - **Open PR:** 167 "Main chat runs on Opus" (notes) may still need `gh pr update-branch 167 --rebase`, checks, merge.

Cards that have not had the independent clinical review (required before any clinical use) and the dose verification worklist are in [REVIEW-QUEUE.md](REVIEW-QUEUE.md), "Not yet independently reviewed".

## Known limits
- The GitHub account name is the owner's initials. (The old non-anonymous commits were removed by re-creating the repo on 2026-10-18.)
