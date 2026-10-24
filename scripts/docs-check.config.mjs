// Known exceptions for `npm run docs:check` (scripts/docs-check.mjs). Add one entry per exception.
// An entry is { rule, file, text, reason }: `rule` is the check name, `file` the file it is in,
// `text` a piece of the problem message (usually the quoted text), `reason` why it is allowed.
// Remove an entry once the notes are fixed; the check tells you when an entry no longer matches anything.

export const ALLOW = [
  {
    rule: 'version-mention',
    file: 'docs/STATUS.md',
    text: '2026.10.23.8',
    reason: 'Real fix for a notes PR: STATUS says live version 2026.10.23.8 but src/version.ts is newer.',
  },
  {
    rule: 'broken-reference',
    file: 'CLAUDE.md',
    text: 'project/README.md',
    reason: 'A file inside the design system artifact (not in this repo).',
  },
]

// DECISIONS rows dated before this day are never flagged for length.
export const DECISIONS_LENGTH_FROM = '2026-10-24'
export const DECISIONS_MAX_CHARS = 700

// Words that must not appear in card content (content/), except in the hidden-source records.
export const CONTENT_FORBIDDEN = ['AMBOSS', 'OpenEvidence', 'White Book', 'handbook']
