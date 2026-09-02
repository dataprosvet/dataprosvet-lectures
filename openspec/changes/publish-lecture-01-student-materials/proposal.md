## Why

Lecture 1 is already represented by published metadata and `attachments/lecture_1.pdf`, and a presentation-derived complete student lecture now exists, but neither a complete lecture nor a concise revision note is declared through the publication manifest. Students therefore lack an auditable text path from the introductory architecture narrative to its essential definitions and concepts.

## What Changes

- Review and finalize `lectures/001_api-tech-introduction.md` as the complete Russian-language student lecture for lecture 1, with scope `COMMON` and clearly bounded ML-system examples usable by both profiles.
- Add `lecture-notes/001_api-tech-introduction.md` as a distinct concise revision note centered on definitions, architectural concepts, integration approaches, ML-system components, lifecycle stages, warnings, and self-check prompts.
- Keep `attachments/lecture_1.pdf` as the primary presentation basis while reconciling its overview claims with the course sequence, source hierarchy, and current lecture-1 terminology.
- Treat CORBA, SOAP/WSDL, REST, and gRPC as historical and comparative orientation only; detailed HTTP/REST/OpenAPI instruction remains lecture 2, and integration-style selection remains lecture 3.
- Add `markdown` and `briefMarkdown` to the existing `api-tech-introduction` lecture entry in `course.yaml`, without changing its slug, sort order, attachment, lifecycle status, or availability.
- Verify that the brief is meaningfully shorter than the complete lecture, does not duplicate it section-for-section, and remains useful as an independent revision aid.
- Coordinate this change with `revise-first-two-api-lectures-and-prb-practicals`, which introduces the numbered `lecture-01-api-interface-layer` capability for the teacher script and presentation; apply this change only after that capability is available or after its delta is deliberately reconciled.
- Preserve the unresolved one-course/two-profile publication decision by publishing only a shared `COMMON` learning path. Profile-specific examples remain visibly labeled and do not become requirements for the other cohort.

Explicit non-goals:

- Do not revise or replace the teacher script or either presentation attachment.
- Do not redefine the detailed scope of lectures 2, 3, or 9.
- Do not add executable code or change either private course-code repository.
- Do not create a second numbered capability for lecture 1.
- Do not resolve the course-wide PRB/SII publication model in this change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `lecture-01-api-interface-layer`: Extends the numbered lecture-1 capability, introduced by the prerequisite lecture-revision change, with observable requirements for the complete student lecture, concise revision note, presentation alignment, profile-safe publication, and manifest declaration.

## Impact

- Student materials: `lectures/001_api-tech-introduction.md` and new `lecture-notes/001_api-tech-introduction.md`.
- Publication manifest: the existing lecture entry in `course.yaml` gains `markdown` and `briefMarkdown` paths.
- Supporting source: `attachments/lecture_1.pdf` remains unchanged and already declared.
- OpenSpec dependency: this change follows or explicitly reconciles `revise-first-two-api-lectures-and-prb-practicals`; it does not duplicate that change's teacher-script or presentation work.
- Validation: strict publisher checks, Markdown/link checks, source-and-scope review, filename/slug checks, and a complete-versus-brief differentiation check are required before completion.
