## MODIFIED Requirements

### Requirement: Teacher lecture scripts are preserved separately
All eight lecture scripts SHALL remain under `lectures-teacher/` with their filenames, eight-lecture sequence, substantive scope, worked-result meaning, documented RPD defect handling, and teacher-only function intact. They MAY receive source-grounded editorial refinements that improve oral readability, transitions, heading consistency, explanation order, and source traceability, but such refinements MUST NOT silently remove a required topic, applicability condition, worked solution, interactive activity, timing aid, instructor guidance, coverage record, or computational appendix. Teacher lecture files MUST NOT be declared in `course.yaml` or included in the publication plan.

#### Scenario: Teacher scripts receive the final editorial pass
- **WHEN** a maintainer revises a teacher script for study or classroom reading
- **THEN** the revised script is easier to follow while its topic structure, mathematical meaning, required RPD coverage, and teacher-only material remain verifiably preserved

#### Scenario: Existing lectures are reorganized
- **WHEN** the course maintains separate teacher, complete-student, and concise-student variants
- **THEN** each reviewed teacher script remains available under `lectures-teacher/` and no teacher-only file becomes publicly published

#### Scenario: Course publication is generated
- **WHEN** the publisher builds the course plan
- **THEN** no file under `lectures-teacher/` is included in the plan or used as a public fallback

### Requirement: Public lecture files are complete student lectures
Each Markdown file under `lectures/` SHALL be a self-contained, student-facing lecture derived from the corresponding reviewed teacher script. It SHALL contain the topic purpose and progression, principal definitions, central formulas with symbols and applicability conditions, explanatory reasoning, selected worked examples, relevant warnings, applied interpretation, and a concise topic summary sufficient to study the lecture without the teacher script. Relevant applications from approved machine-learning sources SHALL be included where they materially clarify the probability concept.

#### Scenario: Student studies a complete lecture independently
- **WHEN** the student opens a declared `markdown` lecture without access to the teacher script
- **THEN** the student can follow the conceptual progression, recover required terminology and formulas, understand their conditions, and study representative applications and worked reasoning

### Requirement: Public lecture identity remains stable
The complete lectures and concise notes SHALL retain the existing eight filenames, slugs, sort order, and titles across their respective directories. In the current staged release, lecture one SHALL declare `lectures/001_random-experiments-events-combinatorics.md` as `markdown` and `lecture-notes/001_random-experiments-events-combinatorics.md` as `briefMarkdown`; lectures two through eight SHALL remain present and quality-checked but MUST NOT be made publicly available. Any retained image reference SHALL resolve through the supported asset mechanism, and every asset in the publication plan SHALL be referenced by a declared public material.

#### Scenario: Current staged release is inspected
- **WHEN** the eight manifest entries are examined after the change
- **THEN** lecture one exposes both complete and concise text actions while lectures two through eight remain unavailable or in development without an exposed public text action

#### Scenario: Course is published after conversion
- **WHEN** the publisher validates the staged course branch
- **THEN** lecture one resolves to both stable student paths, later lecture files remain dormant, and no teacher or OpenSpec file enters the plan

#### Scenario: A later lecture is prepared for a future release
- **WHEN** a maintainer inspects its repository files before changing its availability
- **THEN** its complete lecture and concise note retain the stable identity needed for a later manifest-only release decision

### Requirement: Content conversion is quality-checked across all lectures
Each teacher script, complete student lecture, and concise note SHALL be checked against the curriculum capability, source policy, current review findings, and Markdown publication constraints. The complete set MUST preserve cross-lecture terminology and progression, including event classification in lecture one, probability notation, distribution-function convention, expectation and variance notation, stated model assumptions, and transitions from discrete to continuous and limit-theorem topics. Calculated examples and known source-defect treatments SHALL be independently checked before a material is accepted.

#### Scenario: Cross-variant review finds a missing core element
- **WHEN** a required definition, formula condition, conclusion, example result, source warning, or cross-lecture convention appears in an approved source or reviewed teacher script but is absent or contradicted in a student variant
- **THEN** that variant remains incomplete until the omission or an explicit course-boundary rationale is resolved

#### Scenario: Conversion review finds a missing core element
- **WHEN** a required definition, formula condition, conclusion, or cross-lecture convention exists in approved source material but not in the corresponding complete lecture or concise note
- **THEN** the affected student variant remains incomplete until the omission or an explicit course-boundary rationale is resolved

#### Scenario: Editorial refactoring changes a worked section
- **WHEN** prose or ordering around a worked example is revised
- **THEN** its assumptions, mathematical model, calculated result, and interpretation are rechecked independently

## ADDED Requirements

### Requirement: Concise notes remain a distinct student product
Each Markdown file under `lecture-notes/` SHALL remain a concise student note containing the topic purpose, principal definitions, central formulas with applicability conditions, key relationships, selected compact examples where necessary, and a summary. A concise note MUST remain meaningfully shorter than the complete lecture and MUST NOT be used as a substitute for the corresponding `lectures/` document.

#### Scenario: Student chooses between lecture variants
- **WHEN** both variants are declared for a released lecture
- **THEN** the complete action provides the full study narrative and the concise action provides a compact revision aid without teacher-only scaffolding

### Requirement: Presentation remains dormant in the current release
`attachments/lecture_1.pptx` SHALL remain tracked support content but MUST NOT be declared in `course.yaml`, uploaded, or exposed on the primary site in the current release.

#### Scenario: Publisher builds lecture one
- **WHEN** the current course publication plan is generated
- **THEN** lecture one contains no downloadable presentation attachment and the PPTX bytes are absent from the plan
