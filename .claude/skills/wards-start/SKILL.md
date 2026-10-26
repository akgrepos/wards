---
name: wards-start
description: Start a Wards chat. Use at the start of any Wards chat the owner opens, and whenever the owner says "Start Wards", "status", "what's next" or "where are we". Runs the brief, says what exists and what is in flight, and asks what to do.
---

# Wards start

One chat is one task. This skill only orients; it reads nothing but the brief.

1. Run `npm run brief` from the repo (or the worktree you are in). Do not read the notes folder, old plans or other docs to learn state: the brief is the state.
2. Tell the owner in a few plain lines: how many cards exist (and the newest ones), what is in flight (open PRs, check state, auto-merge on or off), what shipped last, anything owed by the owner.
3. Ask "What now?" in one pop-up. Options: the top three BACKLOG items from the brief, plus "something else". Plain words, no jargon.
4. When the owner picks:
   - **A new card:** first look for the topic in the brief's card index (ids and titles). If a card on that topic exists, say so and offer to update it instead; never suggest a card the index already shows. Then use the `wards-card` skill.
   - **A fix:** do it in this chat through a branch and PR; the tier is set by `npm run pr:tier`.
   - **Anything else:** do it in this chat, or start one child session only for a long autonomous job (a batch of cards or a sweep), with a brief of a skill name plus a list.
5. Read `DECISIONS.md` in the notes folder (`~/Documents/Wards-reference/notes/`) only if the task touches a product or clinical decision, and read only the rows that matter.
6. Before the chat ends, the owner says "clean up" (the `wards-clean-up` skill). A decision made in this chat is written to DECISIONS.md first.

The owner never needs to read CLAUDE.md or this skill. Keep every PR small and every explanation short.
