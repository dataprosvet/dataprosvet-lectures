# Acceptance record

Date: 2026-08-11

## Verified result

- All eight original teacher scripts are present in `lectures-teacher/` under
  their original basenames. Their SHA-256 values match the pre-move values in
  `teacher-lecture-checksums.md`.
- All eight `course.yaml` lecture entries still point to the original
  `lectures/<filename>` identities, which now contain concise student notes.
- Publisher lint passes, all 37 publisher tests pass, and validation succeeds
  for branch `courses/probability-theory`.
- The computed plan contains eight student Markdown files and eight referenced,
  materialized LFS images. It contains no path under `lectures-teacher/`,
  `attachments/`, `openspec/`, or `sources/`.
- Strict OpenSpec validation passes for this change.

## Remaining source limitation

Control-work task 3.5 still refers to a graph that is absent from the supplied
normative source. No graph data or official numerical answer was invented.
The preserved teacher script keeps the limitation and its clearly labelled
educational analogue; the concise public note does not present that analogue as
an official control-work solution.
