## MODIFIED Requirements

### Requirement: Seminars are complete teaching materials
Each non-control seminar SHALL state learning goals and prerequisites and SHALL provide a self-contained, task-driven theory recap containing the definitions, notation items, formulas, and applicability conditions needed to solve that seminar's actual task set. The recap MUST NOT reproduce lecture theory that is unused by the tasks and MUST NOT be constrained to an arbitrary ten-minute duration; its timing SHALL follow the complexity of the required preparation while the complete core path still fits 90 minutes. The seminar SHALL include fully analysed tasks, instructor-guided or student-at-the-board tasks, a larger independent-practice set, reserve or advanced tasks, typical errors, a lesson summary, and a clear link to the corresponding RPD individual assignment or case where applicable. A required concept MUST NOT be left only as an unexplained reference to a lecture. Assessed RPD tasks SHALL remain distinguishable from non-assessed enrichment.

#### Scenario: Student prepares from a seminar independently
- **WHEN** the student opens a seminar without the teacher script or source books
- **THEN** the student can recover the definitions and formulas needed for the task set, follow representative reasoning, practise independently, and distinguish official assessment from optional training without reading unrelated lecture theory

#### Scenario: Seminar recap is checked against its tasks
- **WHEN** every method used in worked, board, independent, and reserve tasks is traced back to the recap
- **THEN** every required definition, formula, notation item, and applicability condition is present before the tasks, no later-course assumption is silently introduced, and every recap item supports at least one task or an explicit cross-task check

### Requirement: Seminars follow a stable student-facing template
Each teaching seminar SHALL contain, in a recognizable order: title and two-hour metadata; learning goals; prerequisite lecture links; a task-driven theory recap; timed lesson plan; fully analysed tasks; tasks for guided or student-at-the-board solution; independent in-seat tasks; reserve or advanced tasks; connection to the relevant IDZ, case, or control activity; typical errors; summary; and previous/next navigation where applicable. Pair-work sections SHALL NOT be required and SHALL be replaced by additional individual solution opportunities. Every task SHALL use the three-part structure defined by the task-structure requirement. A control seminar SHALL use the same navigation and context sections but replace ordinary practice blocks with administration guidance, the official RPD bank link, permitted clarification notes, fixed timing, and post-control reflection boundaries.

#### Scenario: Seminar structure is audited
- **WHEN** all 17 seminar files are compared with the applicable teaching or control template
- **THEN** every required section is present or explicitly marked not applicable, the recap is limited to task-relevant theory, pair-work sections are absent, independent and board-work opportunities are visible, every task has the required three-part structure, and control seminars do not leak teacher-only solutions

## ADDED Requirements

### Requirement: Every non-control seminar task follows one three-part structure
Every task included in a non-control seminar, including fully analysed, student-at-the-board, independent, reserve, case, and assessment-practice tasks, SHALL contain exactly the following three visible task sections in this order: `Условие задачи`, `Разбор решения`, and `Итоговый ответ`. `Условие задачи` SHALL contain all data and the question without requiring reconstruction from another source. `Разбор решения` SHALL explain the model or method choice, intermediate reasoning, calculations, interpretation, relevant checks, and any condition needed to justify the method. `Итоговый ответ` SHALL state the final result directly and with appropriate units or probability interpretation. Additional explanatory material MAY appear inside these three sections but MUST NOT replace or omit any of them.

#### Scenario: Seminar task is reviewed without another source
- **WHEN** a student or reviewer reads any task in a non-control seminar
- **THEN** the condition, complete solution analysis, and final answer are identifiable under the three required headings and can be understood without reconstructing missing data or reasoning

#### Scenario: Independent task is assigned
- **WHEN** a task is designated for in-seat or board solution
- **THEN** its expected method is supported by the recap and its seminar entry still contains `Условие задачи`, `Разбор решения`, and `Итоговый ответ` so the solution can be checked after the student's attempt

### Requirement: All control seminars use one fixed timing contract
Control seminars 5, 9, and 17 SHALL each allocate the 90-minute session as follows: 10 minutes for setup and instructions, 70 minutes for students to complete the control work, 5 minutes for collection and completeness checks, and 5 minutes of reserve. Student-facing control materials MUST NOT expose teacher-only solutions before the work is completed.

#### Scenario: Control seminar timing is audited
- **WHEN** seminars 5, 9, and 17 are compared
- **THEN** each shows the same 10/70/5/5-minute allocation and provides exactly 70 minutes of writing time

#### Scenario: Control material is opened before assessment
- **WHEN** a student accesses the control seminar or its declared bank
- **THEN** administration instructions and permitted clarifications are visible while teacher-only solutions remain outside the student-facing material
