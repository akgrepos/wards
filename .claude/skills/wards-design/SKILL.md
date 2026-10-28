---
name: wards-design
description: Make a visible design change in Wards (CSS, layout, a component, a new kind of screen), from first look to merged PR, through the AKG Design System. Use for "mock-up", "design change", "tune the page", "make it look like", "update the design system", "new screen".
---

# wards-design

A visible change, one branch, one PR. Sonnet builds; Opus only for a design critique. Plain words to the owner. Template details live in `~/Documents/Wards-reference/mockup-template/README.md`; read it only when you build a mock-up.

1. **Look first.** Before changing anything, `npm run page-shots -- '#/card/<id>/<section>' --dark` (whole page, Safari engine, iPhone width, light and dark, in slices; it starts and stops its own server). Open every slice it prints. A card route needs its section; a bare card id shows nothing useful.
2. **Mock-up only for a new kind of screen** (or when the owner asks to choose). Build it from the template (README), 2 or 3 options, publish, let the owner pick. Write the decision in `~/Documents/Wards-reference/notes/DECISIONS.md` before the chat closes. A tweak to an existing pattern skips the mock-up.
3. **Design system first.** A new or changed pattern goes into the AKG Design System artifact (URL in `vendor/akg/VERSION.md`) before Wards uses it. Colors and type come from AKG tokens; never invent them in Wards.
   - Read the artifact files right before editing (Artifact `read` with `paths`, `out_dir` in the scratchpad); edit working copies under one folder.
   - A component is: `bundle.css`; `bundle.js` (add the name to the `@ds-bundle` header line); `index.d.ts` (and the `window.AKG` declaration); `components/<Name>/README.md`; `preview.html` whose first line is `<!-- @dsCard group="Content" height=N subtitle="..." -->`.
   - Publish with `url`, `root`, `file_path` = one changed file's absolute path, `files` = the rest (`index.d.ts` needs contentType `text/plain`); `project/design-system.json` last, with a new `lastChange`.
   - Copy `bundle.css`, `bundle.js`, `index.d.ts` into `vendor/akg/`, add a row to `vendor/akg/VERSION.md`, run `npm run tokens` if tokens changed.
   - Wards adopts the component and deletes its own duplicate CSS and markup (`src/design/base.css`, `src/ui/Rich.tsx`).
4. **Let the data drive the display.** No per-card styling. Shared pure rules go in `scripts/content/display.mjs`, used by both `src/ui/Rich.tsx` and the checks in `scripts/content/prose.mjs`, so a check never disagrees with what the reader sees. A new check starts as a warning that lists the cards it hits. Update `docs/CARD-WRITING-CHEATSHEET.md` and `docs/CARD-TYPES.md` if card authors must know.
5. **Check.** `npm test`, `npm run content:check`, `npm run privacy:check`; a new kind of screen also gets `npm run look` and an Opus design critique; code changes get `/code-review` at low effort. Then `npm run page-shots` again and open every slice.
6. **Simulator, last step before pushing:** `npm run sim-look -- '#/card/<id>/<section>' --dark`, open the pictures. It shows only the top of the page; to see more, add `--hold 300` (it prints the server address), reopen that address plus the route with the simulator tool's `open_url`, switch with `set_appearance`, and swipe starting at y ≤ 700 (lower opens the app switcher). After a CSS change restart the hold run (it serves the last build). Afterwards set the simulator back to light; make sure no server is left. Say what you saw in plain words.
7. **Ship** as in `wards-fix` step 6: rebase, push, `gh pr merge <n> --rebase --auto`, confirm auto-merge after every push. Before a follow-up push check `gh pr view <n> --json state`; if it already merged, cut a new branch and PR.

No heredocs; leave no background task running. Say what changed, what you saw, and the PR link.
