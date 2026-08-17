## MODIFIED Requirements

### Requirement: Concise notes remain a distinct student product
Each Markdown file under `lecture-notes/` SHALL remain a concise student reference organized by the corresponding lecture's topic blocks. It SHALL contain every core definition, notation item, central formula, applicability condition, and exact, approximate, bounded, or asymptotic label required by the reviewed teacher script and complete student lecture. Definitions and formulas SHALL be grouped into readable tables or compact reference sections rather than a shortened narrative. Routine worked examples SHALL be omitted; a minimal counterexample or boundary illustration MAY remain only when it is necessary to state a definition, distinguish concepts, or communicate an applicability condition accurately. The note MUST remain meaningfully shorter than the complete lecture and MUST NOT be used as a substitute for the corresponding `lectures/` document.

#### Scenario: Student chooses between lecture variants
- **WHEN** both variants are declared for a released lecture
- **THEN** the complete action provides the full study narrative and the concise action provides a compact definition-and-formula reference without teacher-only scaffolding

#### Scenario: Concise-note completeness is audited
- **WHEN** the definitions, notation, formulas, and conditions in a teacher script and complete student lecture are mapped to the corresponding concise note
- **THEN** every core item appears exactly once or through an unambiguous cross-reference, and no routine worked-example section displaces required reference content

### Requirement: Lecture products follow stable templates
Each teacher script SHALL contain, in a recognizable order: title and course metadata; place in the course and prerequisites; literature with relevant book chapters; a distinct `Компетенции по РПД` block listing the competence codes actually covered by that lecture; a question of the class; a complete 90-minute timing plan; explicitly numbered timed teaching blocks; detailed lecturer narration; definitions, formulas, proofs, reasoning, and worked solutions at their delivery points; board or visual guidance where useful; checks for understanding; typical errors; summary; independent work and transition; navigation to related seminars; RPD/coverage notes; and a source map, with a computational appendix when code is used. A teacher script MUST NOT contain a standalone `Результаты обучения` section. Each complete student lecture SHALL contain: title and purpose; prerequisites; logically ordered theory with formula conditions; worked examples and applications; typical errors; summary; self-check; and related-seminar navigation. Each concise note SHALL follow the complete reference structure defined by the concise-note requirement rather than retain a worked-example narrative.

#### Scenario: Lecture family structure is audited
- **WHEN** teacher, complete, and concise variants are checked against their respective templates
- **THEN** every required section is present or an explicit not-applicable rationale is recorded without collapsing the three products into identical documents

#### Scenario: Teacher script is delivered from its blocks
- **WHEN** a lecturer follows the script in class
- **THEN** the block timings cover the 90-minute session, the narration and board guidance remain detailed enough for delivery, and no separate learning-outcomes section interrupts the teaching flow

#### Scenario: RPD competence coverage is inspected
- **WHEN** a teacher script is compared with the competence indicators assigned by the RPD and with the lecture's actual content
- **THEN** a distinct competence block lists the applicable RPD codes, omits unsupported codes, and remains separate from the removed learning-outcomes section

#### Scenario: Colleague reference influences presentation
- **WHEN** a teacher script is reorganized using the supplied reference
- **THEN** its block-oriented delivery style is adopted while the approved eight-lecture topic allocation, source hierarchy, mathematical conventions, and verified course-specific explanations remain unchanged

## ADDED Requirements

### Requirement: Extended proofs are complete and presentation-ready
Every extended proof in a teacher script SHALL make its assumptions, invoked definitions or prior results, intermediate transformations, non-trivial implications, and final conclusion explicit. It MUST NOT replace a substantive step with an unexplained phrase such as “очевидно”, “аналогично”, “нетрудно видеть”, or an abrupt formula transition when the omitted reasoning is necessary to understand why the next statement follows.

#### Scenario: Long proof is audited line by line
- **WHEN** consecutive statements or formulas in an extended proof are compared
- **THEN** each non-trivial transition has an explicit justification and the lecturer can present the proof without reconstructing a missing derivation

#### Scenario: A compressed transition is found
- **WHEN** a proof skips algebra, a probability identity, a limiting argument, a set transformation, or an applicability condition needed by the audience
- **THEN** the teacher script expands the transition into complete intermediate steps while preserving the theorem's assumptions and conclusion
