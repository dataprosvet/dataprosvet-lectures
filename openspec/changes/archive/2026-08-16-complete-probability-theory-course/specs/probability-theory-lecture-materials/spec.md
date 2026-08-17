## ADDED Requirements

### Requirement: Lecture variants follow the adopted language and notation
Teacher scripts, complete student lectures, and concise notes SHALL use Russian outcome labels such as `О` and `Р` in coin experiments when a Russian representation is natural. They SHALL use `E[X]`, `Var(X)`, and `σ(X)` as the primary notation for expectation, variance, and standard deviation. Equivalent source notation such as `M(X)` and `D(X)` MAY be introduced as a translation but MUST NOT remain an unexplained competing convention.

#### Scenario: Known notation discrepancies are revisited
- **WHEN** lecture families 1, 3, 5, 6, 7, and 8 are compared across teacher, complete, and concise variants
- **THEN** English coin labels and inconsistent primary numerical-characteristic notation are corrected or explicitly translated

### Requirement: A fresh cross-variant lecture audit supersedes stale acceptance
All eight lecture families SHALL receive a new semantic audit that compares each student variant to the current teacher script and the RPD. The audit SHALL verify definitions, formulas, assumptions, worked-result meaning, warnings, notation, transitions, and source-defect handling; a previous acceptance statement MUST NOT override a newly observed contradiction.

#### Scenario: A prior report conflicts with current files
- **WHEN** current lecture content contradicts the teacher reference despite a historical pass result
- **THEN** the current variant remains incomplete until corrected and the new audit records the disposition

### Requirement: Teacher semantics remain the reconciliation reference
During reconciliation, the current teacher script SHALL be the reference for topic meaning, reasoning, examples, and defect handling, subject to the normative RPD and the newly adopted notation decision. Student variants MAY be shorter and omit delivery scaffolding but MUST NOT contradict the reference or drop a core condition needed to use a formula correctly.

#### Scenario: Student text is intentionally shorter
- **WHEN** a teacher section is compressed for a complete lecture or concise note
- **THEN** the student text preserves the mathematical claim, applicability conditions, and result while omitting only teacher-facing delivery material or optional detail

### Requirement: Lecture products follow stable templates
Each teacher script SHALL contain, in a recognizable order: title and course metadata; place in the course; learning outcomes and prerequisites; timed teaching plan; logically ordered theory; worked examples; interaction or self-check; typical errors; summary; navigation to related seminars; RPD/coverage notes; and source map, with a computational appendix when code is used. Each complete student lecture SHALL contain: title and purpose; prerequisites; logically ordered theory with formula conditions; worked examples and applications; typical errors; summary; self-check; and related-seminar navigation. Each concise note SHALL contain: title and purpose; key definitions; central formulas with conditions; at least one compact example when needed; short summary; and related-seminar navigation.

#### Scenario: Lecture family structure is audited
- **WHEN** teacher, complete, and concise variants are checked against their respective templates
- **THEN** every required section is present or an explicit not-applicable rationale is recorded without collapsing the three products into identical documents

### Requirement: Student lectures link to related seminars
Every complete student lecture and concise note SHALL include a `Связанные семинары` section containing relative local Markdown links to the seminars that practise its material. Links SHALL target stable repository Markdown paths, use human-readable Russian labels, and preserve the approved mapping: lecture 1 → seminars 1–2; lecture 2 → seminars 3–5; lecture 3 → seminar 6; lecture 4 → seminars 7–9; lecture 5 → seminar 10; lecture 6 → seminars 11–13; lecture 7 → seminars 14–15; lecture 8 → seminars 16–17.

#### Scenario: Lecture navigation is validated
- **WHEN** local links are resolved from every complete lecture and concise note
- **THEN** each target exists, belongs to the approved mapping, and contains a reciprocal link to the prerequisite lecture

#### Scenario: Available lecture is published while a related seminar is locked
- **WHEN** a lecture contains a valid repository link to a seminar whose content is still `inDevelopment`
- **THEN** the link does not change the seminar availability or expose its dormant Markdown through the publication plan
