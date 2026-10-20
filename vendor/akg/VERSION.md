# AKG Design System copy

These files are an unmodified copy from the AKG Design System artifact:
https://claude.ai/artifact/GWFUZ6rCthpEuhMik4Jiru

| Copied | Artifact version | Files |
|---|---|---|
| 2026-10-19 | 1792454681-dae8 (Icons group: `chevron.down` added, drawn like `chevron.backward`; Wards uses it to minimize Timed Mode) | none (icon assets only; the four copied files are unchanged) |
| 2026-10-19 | 1792451012-a7ea (gearshape redrawn closer to SF Symbols; large Text Sizes: ContentSection titles wrap so the chevron stays on screen, GradeList chip moves above its values when the row is narrow) | `project/components/bundle.css` (the other two files are unchanged) |
| 2026-10-19 | 1792449122-2a4d (AKI card redesign: Panel; GradeList; severity tones shared with ScaleBar, whose default ramp is now yellow → orange → red; ToolbarButton `selected`; ListRow `overline` and `buttonLabel`; Table `label`, `subcaption`, `shadedHeader`; blue-tinted SourcePill with gray markers; quote.opening icon; README "One color, one job"; components published in 1792449100-21a4) | `project/components/bundle.css`, `bundle.js`, `index.d.ts` |
| 2026-10-19 | 1792445996-b83c (owner's card feedback: Flowchart map shows only the chosen path, Start Over resets it, roomier nodes, answers on a filled surface; Sheet drag resizes between detents; TimePoints as a timeline of plain labels; Table column gaps grow with Text Size, long first-column words hyphenate, scroll indicator only under the moving columns; longer, eased tab-bar fade) | `project/components/bundle.css`, `bundle.js`, `index.d.ts` |
| 2026-10-18 | 1792364647-ad80 (tab bar search glyph grows with Text Size only up to 26pt, so it stays inside its circle; built-in chevrons, magnifying glasses and xmarks use the Icons group's Regular weight) | `project/components/bundle.css`, `bundle.js` (the other two files are unchanged) |
| 2026-10-18 | 1792364431-3935 (large Text Sizes: Banner buttons move below the text when it would get less than about 140pt beside them; toolbar symbols keep their 20pt size so they stay inside their glass circle) | `project/components/bundle.css` (the other three files are unchanged) |
| 2026-10-18 | 1792363484-ef64 (Toolbar, first published in 1792363469-50e4: leading and trailing controls keep their full width; the title fits between them, centered when it can, truncating with an ellipsis when it can't) | `project/components/bundle.css` (the other three files are unchanged) |
| 2026-10-18 | 1792363484-ef64 (Icons group: 32 symbols drawn after SF Symbols; Iconography: 1.4px Regular weight, filled variants in tab bars and tiles, one-line gaps) | none (README and icon assets only; the four copied files are unchanged) |
| 2026-10-18 | 1792359443-4c69 (README Iconography only: SF Symbols as a reference, one 2px style, custom symbols where SF has none) | none (the four copied files are unchanged) |
| 2026-10-18 | 1792356763-b1b7 (TabBar: tabs start at their label's width and share the spare space, so one longer label isn't cut off) | `project/components/bundle.css` (the other three files are unchanged) |
| 2026-10-18 | 1792340382-7bfa (fifth pass, redesign additions: TabBar accessory slot and floating placement, 11pt tab labels; StepList, ValueRow, Tag, ScaleBar, ComparisonGrid, TimePoints, TimerCapsule, SourceLine; ContentSection card variant with collapsible header and useSectionState; ListRow iconTint and IconTile; Sheet heading and two-line title; layout tokens; akg-link press style) | `project/tokens.json`, `project/components/bundle.css`, `bundle.js`, `index.d.ts` |
| 2026-10-17 | 1792291889-0945 (fourth pass + SourcePill markers, HIG review: viewport sheets with drag and detents, 44pt touch areas, modal basics, title-once toolbar; TappableValue, Table, Figure, Banner, BottomBar, Highlight, ShareButton, NumberField) | `project/tokens.json`, `project/components/bundle.css`, `bundle.js`, `index.d.ts` |
| 2026-10-17 | 1792284958-f879 (third pass: Text Size support; Callout, SourcePill, ContentSection + SectionBar, Flowchart) | `project/tokens.json`, `project/components/bundle.css`, `bundle.js`, `index.d.ts` |

To update: read the artifact, copy the same four files here, run `npm run tokens`, update this table, and test in the simulator.
