---
name: wards-fix
description: Make one small fix to a card, code, config or doc, as one PR. Use for "/wards-fix <what>", "fix this", "retire <card>", or when the owner reports a problem on the phone.
---

# wards-fix

One fix, one branch, one PR. Haiku for plain fixes with exact instructions; step up to Sonnet if Haiku fails or the wording needs judgment. Plain words to the owner.

1. **Read only what the fix touches.** For a card, read just that card file (and the cheatsheet `docs/CARD-WRITING-CHEATSHEET.md` if you change wording). Copy the pattern from a live card or `#/example`; never invent a layout.
2. **Stop and ask** if the fix needs a new card type, data type, section kind or screen, or is a clinical change you cannot source. A clinical edit is not a small fix: give the new claim a source quote first.
3. **Branch** from fresh `origin/main`, never on `main`. Make the change with Edit/Write.
4. **Check:** `npm run content:check`, `npm test`, `npm run privacy:check`, then `npm run pr:tier`.
   - Tier 0 or 1 (typo, wording): if the checker says the stamp is stale, `npm run checked:carry -- <card-id> "<reason>"`.
   - Tier 2 (a dose, number, threshold or citation on a clinical line, or a new card): run the Opus check on the changed claims only (quote, location, omissions glance), then `npm run checked:stamp -- <card-id> ...`. Cards the owner looked over before 2026-10-25 get this Opus check only on a clinical edit, not on a format-only fix.
5. **Retire a card** (`/wards-fix retire <card>`): move the file to `content/retired/`, remove links to it (the reciprocity rule forces this), free its aliases, run the checks; the build refuses dangling references.
   - A visible design change (CSS, layout, component): last step before pushing, the official look: `npm run look -- --only <names>` (contact sheet, light and dark) and `npm run page-shots -- '<route>' --dark` for long pages (Playwright WebKit, no simulator); read the sheet and slices (CLAUDE.md, PRs and testing).
6. **Ship:** commit as the configured author; `git rebase origin/main` (never merge main in); push (`--force-with-lease` after a rebase); open the PR in plain words (no `/Users/` paths, no owner name); `gh pr merge <n> --rebase --auto`; verify `gh pr view <n> --json autoMergeRequest` after every push. Never merge with a failing check. Plain card or text edits merge on green checks; code PRs get `/code-review` at low effort.

No heredocs; leave no background task running. Say what changed and the PR link; nothing waits.
