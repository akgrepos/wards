# Switching machines (Windows PC and Mac)

For the owner. Reference only; nothing here runs on its own. The owner returned to the Mac permanently on 2026-10-24 and will not use Windows again; this file is kept as the one-time hand-off steps. Everything in the repo goes through GitHub, so it travels by itself. Three things do **not**: the Claude skills, the Claude memory, and `~/Documents/Wards-reference/`.

## Going from the PC back to the Mac
1. On the PC, tell Claude "wrap up". It finishes or parks work and updates `docs/STATUS.md`.
2. On the PC, copy these three things into the shared folder (same as when they first came over):
   - the skills folder: `C:\Users\<you>\.claude\skills` (`wards-main`, `wards-wrap-up`)
   - the memory folder: `C:\Users\<you>\.claude\projects\C--Users-<you>-Documents-Wards\memory`
   - `Documents\Wards-reference` (only if you added or changed files in it)
3. On the Mac, copy them back to the matching places (skills to `~/.claude/skills`, memory into the Wards project's `memory` folder under `~/.claude/projects/`, reference to `~/Documents/Wards-reference`). Replace the older Mac copies.
4. On the Mac, in the Wards folder, run `git checkout main`, `git pull`, then `npm install`.
5. Open a new chat in Wards and type **Start Main**. Testing goes back to the iOS Simulator and the pinned Wards app, as in CLAUDE.md.

## Going from the Mac to the PC
Same steps in the other direction. On the PC: `git pull`, `npm install`, and leave `core.autocrlf=false` / `core.eol=lf` as they are (the `.gitattributes` file keeps line endings the same on both machines once it is merged).

## What differs between the machines
- **Testing:** Mac uses the iOS Simulator and the pinned app. The PC has no Simulator; the phone-size WebKit preview is `npm run preview:shot` (Playwright; after `npm install`, run `npx playwright install webkit` once) plus you confirming on your iPhone after the deploy.
- **Scripts:** the workflow scripts are Node (`npm run status`, `wait-live`, `tidy`, `preview:shot`) and run the same on both machines.
- **Never** run both machines on the same branch at once; finish and merge a PR (or note it in STATUS) before switching.
