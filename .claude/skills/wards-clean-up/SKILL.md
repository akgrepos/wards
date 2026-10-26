---
name: wards-clean-up
description: Clean-up for the Wards project, run as the owner's last message in a chat. Use whenever the owner says "clean up", "wrap up", "we're done", "end the chat" or "prepare for the next chat". Deletes leftovers, updates the backlog and hands off.
---

# Wards clean-up

The last thing done in a chat. **Default: delete leftovers, don't keep or archive them.** Ask the owner (one pop-up) only about something unique or irreplaceable. Plain words.

1. **Work.** Nothing half-done: finish it, or add it to BACKLOG with its branch. No background tasks or servers left running.
2. **Sessions.** Archive every child session this chat started once it is finished (PR merged, or nothing more needed; `git cherry main <branch>` shows no `+`). Ask before stopping one that is mid-work.
3. **Git.** Delete merged and stale branches and leftover worktrees (`npm run tidy -- <branch>`), `git fetch --prune`; no stashes. Recent commits are authored by `akgrepos <338781722+akgrepos@users.noreply.github.com>`.
4. **Files.** Delete old drafts, screenshots, finished reports, backups and `.DS_Store` in the repo and in `~/Documents/Wards-reference/`. Keep `notes/` (BACKLOG, DECISIONS), `history/`, `hig/`, `reviews/`, `metrics/`, `mockup-template/`, `tools/`, `guideline-searches/` usage logs, `card-process-v4.md` and its brief template (until the card skill replaces them), the reference handbook PDF and anything still in use. Delete Wards mock-up artifacts whose design shipped or was decided (never the AKG Design System).
5. **Environment.** Stop preview servers, close browser tabs, reset viewport emulation and the Simulator to light appearance and default text size. Never sign out.
6. **State** (notes folder, directly, no PR). BACKLOG.md: finished items out, new owner requests in, the `## Owed by the owner` section current; keep it short. DECISIONS.md: add a row for any product or clinical decision made in this chat that still binds. Changes to CLAUDE.md or a skill go in a PR. Memory: save only facts found nowhere else; delete the stale.
7. **Close.** The owner renames the chat (the session tools cannot see the current chat). Final message, short: what shipped, what was deleted, what is next, anything for the owner. The owner opens the next chat with "Start Wards".
