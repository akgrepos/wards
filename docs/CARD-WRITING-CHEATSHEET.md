# Card-writing cheat sheet

The essentials for writing or fixing a card. Read this first; open the full guides only when this doesn't answer it: [CARD-TYPES.md](CARD-TYPES.md) (sections per type), [DATA-TYPES.md](DATA-TYPES.md) (data fields), [CONTENT-FORMAT.md](CONTENT-FORMAT.md) (file syntax). `npm run content:check` enforces all of it.

## Files
- Card: `content/cards/<system>/<card-id>.md` (front matter: `id`, `type`, `variant`, `system`, `title`, `aliases`, `subsection` (condition), `definition` with source, `reviewed`, `related`).
- Shared data: `content/data/<type>/<id>.yaml` (source, dose, threshold, criteria, regimen, pathway, calc, media). Each fact has one home; cards insert it, never retype it.
- Every dose, and every calc with a `calculator` block, ends with a `verification:` note (`read`: fda-label, full-text, abstract, common-practice or not-verified; `source`; `date`). Say how it was really read; DATA-TYPES "Verification note".

## Types and sections (`##`, exact names, fixed order)
- **Condition:** At a Glance (3-6 bullets) · Severity · Causes · Presentation · Diagnosis · Treatment · Monitor · Escalation · More Information · Pearls · Related · Sources.
- **Approach:** At a Glance · Definition and Staging · First Steps · Causes · Presentation · Diagnosis · Treatment · Monitor · Escalation · More Information · Pearls · Related · Sources.
- **Reference** (variants: interpretation, protocol, organism, chart, communication), **procedure**, **medication** (single drug or class; class cards have no doses), **score**, **exam**, **test:** see CARD-TYPES Part 2.
- `###` headings only inside More Information (fixed subsections; `### Title: short description`, at most 60 characters).
- Emergencies: a `## Do Now` page (2-8 steps, `If:` first and once); see CONTENT-FORMAT.

## Lines and sources
- Every content line ends `^[source-id, …]` (ids from `content/data/source/`), except lines that are only an insert. Sub-bullets without their own source use the parent's.
- Markers instead of names: `^[common-practice]` (stethoscope); the unnamed-reference check (green check) is a last resort. Never name AMBOSS, OpenEvidence or the handbook.
- Write as if the reader sees only the final card: no process talk ("the guidance names…", "not read", review notes). Pregnancy and lactation come from LactMed.
- Tags: `[!cannot-miss]`, `[!most-common]` (after a cause's colon).
- Causes: `- **Category:** causes ^[source]`.

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
- Tables: at most 4 columns. `[[card]]` to an unwritten card is allowed (warning, shows as plain text). Related cards go both ways.
- **No semicolons** anywhere in card or data text (error). Clause join: two sentences (`Calcium buys time. It lowers no K⁺.`). List: lead-in with a colon plus sub-bullets, each with the source. Table cell: short sentences.
- Warnings: unused source, `reviewed` over 12 months, a Do Now dose missing from Treatment.

## Pathways (`content/data/pathway/<id>.yaml`)
Decision tree for one task: `title`, `card`, `summary`, `columns`, `start`, `sources`, `nodes` with `kind` (start, do, urgent, note, question, result), `at: [col, row]`, `next`; a `question` has `answers` (`label`, `at`, `to`) in the row below it. Details: CONTENT-FORMAT "Pathways".
