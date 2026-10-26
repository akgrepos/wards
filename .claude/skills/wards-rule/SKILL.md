---
name: wards-rule
description: Turn one owner correction into a rule for every card. Fixes the card, sweeps all other cards for the same problem, then changes the card-writing rules or checks so future cards avoid it. Use for "/wards-rule <what>", "make this a rule", "apply this to all cards", "fix this everywhere".
---

# wards-rule

One correction, three layers: the card, the other cards, the process. Plain words to the owner. Haiku for mechanical sweeps with exact instructions; Sonnet when wording needs judgment. Nothing clinical is changed without a source quote.

1. **State the rule in one sentence** and show the owner the card line it came from. If the owner's wording could mean two rules, ask one pop-up question. If it is a product or clinical decision (not just style), write it to `DECISIONS.md` in `~/Documents/Wards-reference/notes/` before the chat closes.
2. **Fix the card first** as in `wards-fix` (its own branch and PR, so the original request lands fast).
3. **Count the reach.** Search all cards for the same problem: a script or `grep` for anything a pattern finds, a Haiku pass for judgment cases. Tell the owner the number of cards affected and the tier (`npm run pr:tier` logic: typo 0, prose 1, doses, numbers or citations 2) before changing any of them. Cards the owner looked over before 2026-10-25 keep their status unless a clinical line changes.
4. **Sweep.** One branch and PR for tier 0 and 1 changes (split by specialty if over about 10 cards). A tier-2 change gets its own PR and the Opus check on the changed claims, then `npm run checked:stamp`. Text-only sweeps use `npm run checked:carry -- <card-id> "<reason>"`.
5. **Change the process so it does not come back.** Pick the strongest place that fits:
   - A script check in `content:check` when a script can test it (a pattern, count, length or missing link). Add a test in `scripts/content` for it. New cards get an error, old ones a warning until the sweep lands.
   - A line in `docs/CARD-WRITING-CHEATSHEET.md` for judgment rules.
   - A step or reminder in `.claude/skills/wards-card/SKILL.md` (and `wards-review`) when the writing or checking steps must change.
   Keep each addition to a line or two; delete or merge an older rule it replaces rather than stacking.
6. **Ship** as in `wards-fix` (fresh `origin/main`, rebase never merge, `gh pr merge <n> --rebase --auto`, verify auto-merge after every push). Code and check changes get `/code-review` at low effort.
7. **Report in plain words:** the rule, cards fixed, where the rule now lives (check, cheatsheet or skill), PR links, and anything that still needs the owner.

If the fix needs a new card type, data type or section kind, stop and ask. If the sweep touches more than about 20 cards or more than one tier, propose the plan first and wait for a go.

No heredocs; leave no background task running.
