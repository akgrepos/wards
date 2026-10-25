---
name: wards-card
description: Write one new Wards card end to end (research, quotes, draft, one Opus check, PR). Use for "/wards-card <name>", "new card", "write the <topic> card".
---

# wards-card

You write ONE card and ship ONE PR in this chat. The owner is a physician with no coding experience: plain words. Cheapest model that does the job: Haiku for quotes, Sonnet (you) for drafting, one Opus helper for the check. Never end a turn just to say you are waiting; while helpers run, stay quiet.

## 1. Choose and scope
- The card comes from `npm run brief` (card index plus aliases) and the topic list in `~/Documents/Wards-reference/topic-list-v2.md`, never from memory. If the name or an alias is already a card, stop and say so.
- One pop-up, at most four questions: card type and system (propose by analogy with a live card of that type), scope in one sentence, Rapids page yes/no (default no; true emergencies only), MDCalc links (default yes where a real page exists, URL verified), anything to leave out. Everything else is your call.
- A card that needs a new card type, data type or section kind: STOP and ask. A card that needs a new screen or layout: say "this needs a mock-up" and let the owner decide.

## 2. Read narrowly
`CLAUDE.md`, `docs/CARD-WRITING-CHEATSHEET.md`, then `docs/CARD-TYPES.md`, `DATA-TYPES.md`, `CONTENT-FORMAT.md` only as needed. Copy a live card of the same type and the `#/example` content. Keep context lean: the packet stays in files, read rows by id, stay under about 150k tokens.

## 3. Research
1. **Reference-chapter step (test once; on the first card only).** Haiku, low effort: extract the matching chapter of the local reference PDF in `~/Documents/Wards-reference/` with `swift scripts/card/pdftext.swift in.pdf out.txt` into a scratch folder outside the repo, then return ONLY the chapter's headings as a bedside coverage checklist and its reference list as source pointers. Nothing is copied, quoted or named. Afterwards tell the owner what it added (checklist items, pointers that became sources) so they can keep or drop the step. Skip it after that unless the owner says keep.
2. **No paid-reference reading by tool.** Never read a paid clinical reference site with a browser or script. If the owner reads one personally and tells you, treat it as a lead to verify against a guideline, never a quote, never named.
3. **Newest-guideline search** (last 24 months): society sites, PubMed through the connector, FDA labels on DailyMed, a standards body if the topic has one. Save the dated list to `~/Documents/Wards-reference/guideline-searches/<topic>.md`.
4. **Grade every source before reading, and set a depth budget.** FDA label or current final society guideline (American societies lead) > consensus statement, systematic review or meta-analysis > RCT > observational > case series or report. Read in that order. Budget about 2 to 3 sources when a society guideline exists; wider when none does, and then the card says evidence is limited. Do not chase an original paper a current open source already quotes. Put the grade next to each source in the saved list.
5. **Single-study rule.** One trial or cohort goes on a card only if a current guideline or meta-analysis cites it; otherwise cut it, or keep one "limited evidence" line that gives the study type without a name.
6. **Reach check:** `node scripts/card/source-reach.mjs urls.txt`. Readable sources go to Haiku (`fetchtext.mjs` for pages, `getpdfs.sh` for PDFs); paywalled or unreadable ones go on an Opus-only list. Look for an open-access reprint first.

## 4. Quotes, then draft
- **Tier each claim.** A = doses, thresholds, ranges, criteria, contraindications, interaction rules, toxicity or ICU triggers: exact source quote plus the Opus check. B = standard management: one quote from a current guideline or review, script-checked. C = background: no quote, one skim. A bedside detail with no guideline quote gets the stethoscope marker (`^[common-practice]`) or is cut.
- **Haiku quote jobs** (low effort, one source each, about 25 tool uses cap, in parallel): exact verbatim quotes with location, or NOT FOUND, never from memory; whole table rows and whole definitions. Put them in a packet folder outside the repo (see `scripts/card/README.md` for the file layout). Run `quote-verify.mjs`: a quote that is not verbatim is not used.
- **Draft (Sonnet)** with `npm run card:new -- <type> <system> <id> "<title>"`, using only verified quotes. Every A and B line carries a quote id in your claims file; unsupported claims are cut or marked "needs Opus". Run `claim-numbers.mjs`: every number in a line must appear in its quote.

## 5. Writing rules (the checker warns on most; you keep them)
- No guideline, society or study names in card text ("AHA says", "CANMAT:", "2020 case series"). Source markers `^[id]` carry attribution. Score and criteria names stay (Hunter, Sepsis-3, CURB-65, KDIGO stages). A study type may be stated without a name ("observational; confounding possible").
- Any severity ladder or risk-level list (Mild/Moderate/Severe, stages, risk bands with actions) is a top-level `:::scale Title` block, least to most severe, `- Level: detail`. Never nested bullets, never a gray table. Copy a live card (`cardio-chest-pain`).
- Tables only with short cells and at most 3 columns; wider comparisons become `:::compare`.
- A bullet is one idea, at most about two sentences (about 160 characters); parallel items in the same shape; numbers and test names first; at most about 12 bullets in a section before More Information; titles under about 32 characters.
- No semicolons. US units. Pregnancy and lactation from LactMed. Every dose names its `drug:` and inserts shared dose data; scores link to MDCalc, calculators only for true formulas.
- No number-only aliases (search breaks). Related cards link both ways. Write as if the reader sees only the final card.

## 6. The one Opus check
One helper, `model: "opus"`. Brief it with: claim / quote / location triples (`claim-triples.mjs`), the Opus-only list, the needs-Opus list, and an **omissions pass**: contraindications, interactions, kidney and liver dosing, pregnancy and lactation (LactMed), and a standards-body document if one exists. Scope is every dose, number, threshold and care-changing claim; it reads at most about 6 sources, A claims first, skims B and C, and fixes the card, reporting changes by severity. Then run `npm run content:check`, `npm run review:precheck -- <card-id>`, `npm test`, `npm run checked:stamp -- <card-id> ...`, `npm run privacy:check`, `npm run pr:tier`.

## 7. Ship
Branch from fresh `origin/main`, never on `main`; `git rebase origin/main` (never merge main in; `git log --merges origin/main..HEAD` must be empty). PR text is plain words and holds: guidelines found with dates and source grades, MDCalc URLs, every claim Opus changed or flagged, and anything the owner must decide (for example a source disagreement). No `/Users/` paths, no owner name. `gh pr merge <n> --rebase --auto`; verify `gh pr view <n> --json autoMergeRequest` after every push. No `set_monitor`, no messages to other chats. Append the silent metrics row (below) and stop.

The final message says what the card covers, the PR link, and open owner decisions. No dollar line, no phone checklist. The owner looks on the phone when they like; silence means reviewed.

## Metrics row (file only, never in chat)
Append one line to `~/Documents/Wards-reference/metrics/cards.md` (columns are in that file): date, card, tokens by model (from the session's usage figures; approximate is fine), sources kept/cut, claims A/B/C, NOT FOUND count, Opus changes by severity (high/medium/low), owner catches (blank), estimated cost, notes (failures included, honestly).

No heredocs; leave no background task running.
