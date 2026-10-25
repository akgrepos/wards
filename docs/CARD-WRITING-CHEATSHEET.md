# Card-writing cheat sheet

The essentials for writing or fixing a card. Read this first; open the full guides only when this doesn't answer it: [CARD-TYPES.md](CARD-TYPES.md) (sections per type), [DATA-TYPES.md](DATA-TYPES.md) (data fields), [CONTENT-FORMAT.md](CONTENT-FORMAT.md) (file syntax). `npm run content:check` enforces all of it.

## Files
- Card: `content/cards/<system>/<card-id>.md` (front matter: `id`, `type`, `variant`, `system`, `title`, `aliases`, `subsection` (topic), `definition` with source, `checked`, `related`).
- Shared data: `content/data/<type>/<id>.yaml` (source, dose, threshold, criteria, regimen, pathway, calc, media). Each fact has one home; cards insert it, never retype it.
- Every dose, and every calc with a `calculator` block, ends with a `verification:` note (`read`: fda-label, full-text, abstract, common-practice or not-verified; `source`; `date`). Say how it was really read; DATA-TYPES "Verification note".

## Types and sections (`##`, exact names, fixed order)
- **Topic** (a condition, or a symptom or abnormal result): At a Glance (3-6 bullets) · Definition and Staging · First Steps (symptom or result topics) · Severity · Causes · Presentation · Diagnosis · Treatment · Monitor · Escalation · More Information · Pearls · Related · Sources. Use only the sections the card needs; the order never changes. Give it a `subsection` to list it under that group; without one it is listed under Approach.
- **Reference** (variants: interpretation, protocol, organism, chart, communication), **medication** (single drug or class; class cards have no doses): see CARD-TYPES Part 2. Procedure, score, exam and test cards are reserved: build when the first card needs it (stop and ask the owner).
- `###` headings only inside More Information (fixed subsections; `### Title: short description`, at most 60 characters).
- Emergencies: a `## Do Now` page (2-8 steps, `If:` first and once); see CONTENT-FORMAT.

## Writing style (content:check: errors, for every card)
- A bullet is one idea: at most two sentences and about 160 characters. Longer: split it, or a lead-in with sub-bullets.
- Tables: at most 3 columns, every cell under about 25 characters. A wider comparison is a `:::compare` block.
- Titles are at most 32 characters. A `related` link goes both ways. An alias that is a number is written in quotes.
- Parallel items each get their own bullet in the same shape (for example every cause is `- **Category:** causes`; every criterion has the same pattern).
- No several cases joined in one bullet ("X in A; Y in B; Z in C"): one bullet per case.
- One idea per bullet.
- The same wording for the same kind of item across cards (the same phrase for a monitoring line, a contraindication, a when-to-escalate line).
- Titles name the condition only ("Acute Coronary Syndrome"); the other names are search aliases.
- A severity ladder or risk-level table is always a `:::scale` block (least to most severe, one band per level). Never nested bullets or a gray table. Tones (`layout: stacked`) exist only in shared criteria files.
- Card text never names a guideline, society or study (for example "per ACEP" or "NICE says"). The `^[id]` source markers carry the attribution. Criteria and score names stay (Hunter criteria, Sepsis-3, CURB-65).

## Lines and sources
- Every content line ends `^[source-id, …]` (ids from `content/data/source/`), except lines that are only an insert. Sub-bullets without their own source use the parent's.
- Markers instead of names: `^[common-practice]` (stethoscope); the unnamed-reference check (green check) is a last resort. Never name outside reference tools or the handbook.
- Write as if the reader sees only the final card: no process talk ("the guidance names…", "not read", review notes). Pregnancy and lactation come from LactMed.
- Tags: `[!cannot-miss]`, `[!most-common]` (after a cause's colon).
- Causes: `- **Category:** causes ^[source]`.

- Single-use thresholds, criteria and regimens are written inside the card and shared only on a second use. Exception: criteria that back an in-app calculator stay shared files.

## Inserts and links
- `{{dose:id}}` alone on a line (never a typed dose such as "40 mg"). `{{regimen:id}}`, `{{criteria:id}}`, `{{media:id}}` alone on a line. Thresholds and `{{calc:id}}` go inside sentences.
- Every named score or calculator is `{{calc:id}}` (MDCalc link; add `content/data/calc/<id>.yaml` first, copy the real address).
- Cards never insert pathways; a pathway file points to its card with `card:` and shows as a row under the title.
- Links inside the sentence: `[[card-id|label]]`, `[[card-id/section|label]]`.

## Formatting
- Bullets (one nesting level), numbered steps `1. Step title` with indented content, `or. Step title` for an alternative, tables with sources at row end.
- Blocks closed by `:::`: `:::note` (1-3 lines), `:::scale` (2-5 bands), `:::compare` (2-3), `:::times` (1-12), `:::onset` (2-12).
- US units; precise terms (hypoxemia, not "low oxygen"); terse clinical register; summarize, never copy.

## Consistency rules (content:check; full list: CONTENT-FORMAT "Consistency rules")
- Aliases: each alias on one card only; over 30 per card warns.
- `subsection` must be in the system's list in `content/systems.yaml` (add the name there first).
- `[!cannot-miss]` / `[!most-common]` only on causes in Causes; never name a category "Cannot miss" or "Most common".
- **Table symbols:** `↑` high/raised, `↓` low, `=` normal, `↕` variable, `< > ≤ ≥` for thresholds (`<100`, not "below 100"). Tables only, never for names like "low-risk" or "high-gap". Details: CONTENT-FORMAT.
- **Checked.** A card is Checked when the owner or an independent Opus helper verified its doses, numbers and care-changing claims against sources. The Opus step runs `npm run checked:stamp -- <card-id> [--scope "…"] [--read <dose-id>=<read>@<source-id>] [--open <dose-id>,…]`: it refuses while any of the card's doses still says `not-verified` unless a `--read` gives its real state or `--open` names it as left open on purpose. It writes the stamp (date, `by: opus`, scope and the fingerprint of the card's doses, numbers and drug facts) and updates each dose's `verification` to what Opus read. The header then reads "Checked <date>". Never stamp a card nobody checked, and never type the stamp by hand.
- If a later edit changes the fingerprint, `content:check` fails. Re-check and stamp again, or, when nothing clinical changed, `npm run checked:carry -- <card-id> "<reason>"`. A new card, or a change to a dose, number, threshold or a citation on a clinical line, is tier 2 in `npm run pr:tier` and needs one of the two.
- A draft that is not yet checked has its id in `content/unchecked.txt` (`npm run card:new` adds it). The Opus step removes the line and adds the stamp; `content:check` fails a card with neither.
- Tables: at most 4 columns. `[[card]]` to an unwritten card is allowed (warning, shows as plain text). Related cards go both ways.
- **No semicolons** anywhere in card or data text (error). Clause join: two sentences (`Calcium buys time. It lowers no K⁺.`). List: lead-in with a colon plus sub-bullets, each with the source. Table cell: short sentences.
- Warnings: unused source, `checked` over 12 months, a Do Now dose missing from Treatment.

## Pathways (`content/data/pathway/<id>.yaml`)
Decision tree for one task: `title`, `card`, `summary`, `columns`, `start`, `sources`, `nodes` with `kind` (start, do, urgent, note, question, result), `at: [col, row]`, `next`; a `question` has `answers` (`label`, `at`, `to`) in the row below it. Details: CONTENT-FORMAT "Pathways".
