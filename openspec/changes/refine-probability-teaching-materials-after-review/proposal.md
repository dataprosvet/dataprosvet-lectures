## Why

The completed course pass established all eight lecture families and seventeen seminars, but the colleague review identified a second editorial need: teacher scripts are not yet organized as consistent timed blocks, concise notes are not complete formula-and-definition references, and seminar tasks are too terse to support independent preparation and detailed classroom solution work. The course now needs a focused refinement that preserves its verified mathematics while making the teaching materials practical to deliver and revise.

## What Changes

- Reformat all eight teacher scripts into a common 90-minute block structure based on the supplied colleague reference while preserving the course's approved topic split, detailed lecturer explanations, book-chapter references, worked reasoning, source warnings, and instructor-only guidance.
- Remove the `Результаты обучения` section from teacher scripts, add a distinct `Компетенции по РПД` block that lists the competence codes actually covered by the lecture, and keep the remaining course metadata, prerequisites, timing, question of the class, instructional prompts, board work, checks for understanding, summary, independent work, sources, and appendices in stable locations.
- Audit every extended proof in the teacher scripts for omitted intermediate claims, unexplained transformations, and abrupt transitions. Expand any such proof so that each non-trivial step, invoked definition or theorem, applicability condition, and conclusion is explicit enough for the lecturer to present without reconstructing missing reasoning.
- Rebuild all eight concise lecture notes as quick-reference materials organized by topic blocks and tables, containing every core definition, notation, formula, applicability condition, and exact/approximate/asymptotic label from the corresponding reviewed lecture family. Routine worked examples will be removed; only a minimal counterexample or boundary illustration may remain when it is necessary to state a definition or condition accurately.
- Expand each non-control seminar from a short outline into a complete 90-minute teaching material. Its recap will be derived from the actual task set and will contain the definitions, formulas, notation, and applicability conditions needed to solve those tasks; it will not reproduce unrelated lecture theory or be forced into an arbitrary ten-minute limit.
- Replace pair-work blocks with a larger progression of independent tasks, including tasks that a student may solve at the board, in-seat independent tasks, and reserve or advanced tasks.
- Give every task in a non-control seminar, including analysed, board, independent, and reserve tasks, the same three visible sections: `Условие задачи`, `Разбор решения`, and `Итоговый ответ`. The solution analysis will include the required model and method choice, intermediate reasoning, calculations, interpretation, and relevant checks without introducing additional mandatory top-level task sections. Keep official assessed RPD statements distinguishable from non-assessed training tasks.
- Standardize control seminars 5, 9, and 17 to one 90-minute contract: 10 minutes for setup and instructions, 70 minutes for the control work, 5 minutes for collection and completeness checks, and 5 minutes of reserve. Teacher-only solutions remain outside student-facing control materials.
- Re-audit cross-variant completeness, mathematics, navigation, and RPD defect handling after the restructuring, with special care not to fabricate the missing graph for control-work task 3.5 or silently add independence to individual assignment 6.3.
- Keep all implementation, validation, and handoff local. The change will not push or deploy content, and implementation will stop before commit until the owner reviews the resulting materials.

Non-goals:

- Do not design Google Forms or any automated checking mechanism for individual assignments in this change.
- Do not design the multi-week project homework, grading system, automatic control-work checking, or final-exam policy.
- Do not change the approved eight-lecture topic sequence, the seventeen-seminar sequence, official RPD task banks, manifest availability, or publication scope.
- Do not publish teacher scripts, answer keys, local sources, or planning/audit evidence.
- Do not invent missing normative data, including the absent graph for control-work task 3.5.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `probability-theory-lecture-materials`: Changes the teacher-script and concise-note structure, removes teacher learning-outcome sections, adds explicit RPD-competence blocks, requires complete long proofs, and makes concise notes complete definition-and-formula references.
- `probability-theory-seminar-materials`: Requires task-driven theory recaps, a uniform condition/solution/final-answer structure for every non-control seminar task, substantially expanded independent and board work instead of pair work, and a fixed 70-minute writing period for all three control works.

## Impact

- Primary content: all files under `lectures-teacher/`, `lecture-notes/`, and `seminars/`.
- Consistency review: corresponding files under `lectures/` are comparison inputs and are edited only if the restructuring exposes a genuine semantic contradiction or missing core condition.
- Evidence: the change will add source-grounded structural and mathematical acceptance records under its OpenSpec directory.
- Publication: `course.yaml`, material availability, downloadable attachments, and remote deployment behavior remain unchanged.
- Source control: the archived predecessor and synced main specs remain local; this proposal and its later implementation are not pushed.
