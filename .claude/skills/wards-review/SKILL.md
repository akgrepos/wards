---
name: wards-review
description: Re-check an existing card against its sources with one Opus check and restamp it, or run the April/October freshness sweep. Use for "/wards-review <card>", "review <card>", "freshness sweep".
---

# wards-review

Re-checks cards that already exist. Sonnet reads and searches; one Opus helper checks; Haiku fetches quotes. Plain words to the owner. The owner's stance: a card is reviewed unless they say otherwise, so report what changed, not a request for approval.

## One card
1. **Read** the card, its data files and the sources it cites (`^[id]` markers → `content/data/source/`). Keep the packet in files outside the repo (layout: `scripts/card/README.md`).
2. **Search for newer editions** of each cited guideline and label (last 24 months, PubMed connector, DailyMed). A correction or supersession of a cited guideline is the highest-value finding. List dated results in `~/Documents/Wards-reference/guideline-searches/<topic>.md`.
3. **Grade sources and apply the single-study rule** from the `wards-card` skill: cut or flag a single trial or cohort no current guideline cites; society or study names out of card text; severity ladders as `:::scale`.
4. **Build triples** from existing citations: Haiku quote jobs per source, `quote-verify.mjs`, then `claim-triples.mjs` for every A claim.
5. **One Opus check** (`model: "opus"`): every dose, number, threshold and care-changing claim against the quoted source text, plus the omissions pass (contraindications, interactions, kidney and liver dosing, pregnancy and lactation from LactMed, a standards-body document). It fixes the card and reports by severity.
6. **Restamp:** `npm run checked:stamp -- <card-id> ...`; then `npm run content:check`, `npm test`, `npm run privacy:check`, `npm run pr:tier`.
7. **Ship** as in `wards-fix` (branch from fresh `origin/main`, rebase, plain-words PR with every change Opus made, `gh pr merge <n> --rebase --auto`, verify auto-merge). Append a silent metrics row to `~/Documents/Wards-reference/metrics/cards.md` (note "review"). If a source disagreement needs the owner (for example two different ceilings), ask one pop-up question; otherwise decide and say what you chose.

## Freshness sweep (April and October, or whenever the owner notices)
No monthly job. Run `npm run sources:due` (when it exists; until then list sources by year and number of citing cards from `content/data/source/`). Take the cards it names, oldest and most-cited first, at most about 10 per chat. Review each as above, one PR per card; a card with nothing new gets `checked:carry` with the reason "re-read, no newer edition" in a single small PR. Also do one airplane-mode open of a card on the phone, and tell the owner that is the only thing to do by hand. A sweep may start one background session only if the owner approves a list.

No heredocs; leave no background task running.
