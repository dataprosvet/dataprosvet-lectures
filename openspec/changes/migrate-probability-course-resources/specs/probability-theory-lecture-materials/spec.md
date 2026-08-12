## MODIFIED Requirements

### Requirement: Public lecture variants are truthfully classified

The eight existing concise student documents SHALL be published as
`briefMarkdown` from `lecture-notes/`. The course SHALL declare no primary
lecture Markdown until complete student-facing lectures are authored in a
separate future change. Teacher scripts SHALL remain unpublished.

#### Scenario: Student opens a migrated lecture overview

- **WHEN** the lecture has concise notes but no complete lecture document
- **THEN** the concise action is available and the full-lecture action is disabled

### Requirement: Lecture attachments are explicitly owned

Lecture one SHALL declare `attachments/lecture_1.pptx` with stable key
`slides`, title `Презентация к лекции`, and sort order 10.

#### Scenario: Publisher validates lecture one

- **WHEN** the course plan is generated
- **THEN** the presentation belongs exactly once to lecture one and is handled as inert downloadable bytes
