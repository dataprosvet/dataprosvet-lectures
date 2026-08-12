## Why

The generic publisher now distinguishes full student lectures, concise notes,
and inert downloadable attachments. This course must adopt that contract
without mislabelling its current concise notes as full lectures or exposing
teacher scripts.

## What Changes

- Move the current public lecture notes from `lectures/` to `lecture-notes/`
  and declare them as `briefMarkdown`.
- Leave `lectures/` empty of student Markdown so the full-lecture action is
  intentionally unavailable.
- Declare the existing lecture-one presentation as a downloadable attachment.
- Preserve `lectures-teacher/` as support-only content.

## Non-goals

Writing complete student-facing lectures is deliberately excluded. That work
requires a separate future OpenSpec change with independent educational review.
