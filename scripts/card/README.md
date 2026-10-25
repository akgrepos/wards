# Card tools

Small scripts the `wards-card` and `wards-review` skills use to make sure a card's quotes are real and its numbers match them. They run on your own computer and read plain files; nothing here touches the app. Keep each card's working files (the "packet") outside the repo, for example in `~/Documents/Wards-reference/guideline-searches/<topic>-packet/`. Copyrighted reference material never goes in the repo.

## The packet folder
For each source ("job"):
- `<job>.txt`: the source as plain text (made by `fetchtext.mjs` or `getpdfs.sh`).
- `out-<job>.jsonl`: the quotes a helper returned, one per line: `{"id": "3a", "quote": "...", "where": "table 2"}`. A line with no `quote` means NOT FOUND.
- `jobs.json` (optional): short codes for claim rows, for example `{"LI": "label-lithium-2026"}`.
- `sources.json` (optional): `{"<job>": ["a.txt", "b.txt"]}` when a job's text is in other files; an empty list means "no local text".

A claims file has rows like `A | text the card line contains | LI:3a,GI:7` (tier A, B or C).

## The scripts (run from the repo root)
| Script | What it does |
|---|---|
| `source-reach.mjs urls.txt` | Says which sources can be read (READABLE) and which need Opus (OPUS-ONLY). |
| `fetchtext.mjs urls.txt outdir` | Saves web pages and DailyMed labels as text. |
| `getpdfs.sh urls.txt outdir` | Downloads PDFs and converts them to text (Mac only). |
| `pdftext.swift in.pdf out.txt` | Converts one PDF to text (Mac only). |
| `quote-verify.mjs packet` | Checks every quote is word for word in its source. |
| `quote-dump.mjs packet [job]` | Prints the verified quotes compactly. |
| `quote-stats.mjs packet` | Counts claims asked, quoted and not found per job. |
| `claim-numbers.mjs card claims packet` | Checks each number in a card line appears in its cited quotes. |
| `claim-triples.mjs card claims packet` | Prints claim, quote and location together for the Opus check. |

`urls.txt` lines are `label<TAB>url`. Tests: `card-tools.test.mjs` (run by `npm test`).
