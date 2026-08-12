## Decisions

Existing files under `lectures/` are concise reference notes, so they move
byte-for-byte to `lecture-notes/`. The manifest uses only `briefMarkdown` for
these files. No teacher script is copied, transformed, sanitized, or used as a
fallback, and no replacement Markdown is added under `lectures/`.

The tracked `attachments/lecture_1.pptx` file is owned by lecture one with the
stable key `slides`, Russian title `Презентация к лекции`, and sort order 10.
The publisher validates and uploads its bytes without executing or rendering
the presentation.

## Future change

A separate change must author complete student-facing Markdown under
`lectures/`. Those documents should be fuller than concise notes while
excluding timings, instructor prompts, facilitation instructions, planned
errors, source maps, and other teacher-only metadata.
