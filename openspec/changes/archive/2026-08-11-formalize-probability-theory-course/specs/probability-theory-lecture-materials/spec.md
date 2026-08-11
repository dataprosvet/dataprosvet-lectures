## Purpose

Defines the separate teacher-facing and student-facing lecture products, their repository locations, content boundaries, identity stability, and publication readiness.

## ADDED Requirements

### Requirement: Teacher lecture scripts are preserved separately
The complete current versions of all eight lectures SHALL be preserved under `lectures-teacher/` with their filenames and substantive content intact, including existing user corrections, instructor guidance, timing, interactive activities, worked solutions, coverage matrices, source maps, and computational appendices. Teacher lecture files MUST NOT be declared in `course.yaml` or included in the publication plan.

#### Scenario: Existing lectures are reorganized
- **WHEN** the course introduces separate student notes
- **THEN** each original full lecture remains available in `lectures-teacher/` and no teacher-only file becomes publicly published

### Requirement: Public lecture files are concise student notes
Each Markdown file under `lectures/` SHALL be a self-contained student-facing note containing the topic purpose, principal definitions, central formulas with symbols and applicability conditions, key relationships or conclusions, and a concise summary by topic. Explanations and selected compact examples SHALL be included where they materially improve understanding, including relevant applications from approved machine-learning sources.

#### Scenario: Student returns to a lecture after class
- **WHEN** the student opens a published lecture note without the teacher script
- **THEN** the student can recover the essential terminology, formulas, conditions, reasoning outcomes, and topic structure without instructor-only context

### Requirement: Student notes exclude delivery scaffolding
Student notes MUST NOT contain instructor timing tables, presentation instructions, prompts addressed to the lecturer, planned-error facilitation scripts, recommendations on how to teach a section, curriculum coverage matrices, source-usage maps, or reproducible image-generator code. They MAY retain concise warnings about common mathematical errors when phrased directly for students.

#### Scenario: Teacher-only section is encountered during conversion
- **WHEN** a section exists to manage lesson delivery rather than explain probability theory to a student
- **THEN** it remains only in the teacher script and is omitted from the corresponding public note

### Requirement: Public lecture identity remains stable
The student notes SHALL retain the current eight filenames, slugs, sort order, titles, and `course.yaml` Markdown paths. Any retained image reference SHALL resolve through the existing supported asset mechanism, and every declared asset SHALL remain referenced by at least one published material.

#### Scenario: Course is published after conversion
- **WHEN** the publisher validates the reorganized course branch
- **THEN** all eight manifest entries resolve to student notes at their existing public identities and no teacher or OpenSpec file enters the plan

### Requirement: Course OpenSpec is versioned but unpublished
The course SHALL track `openspec/config.yaml`, durable specifications, and change artifacts required for reproducible course maintenance. The broad `openspec/` ignore rule SHALL be removed, while transient operating-system files SHALL remain ignored. Course OpenSpec content MUST NOT be interpreted as educational material or uploaded by the publisher.

#### Scenario: Repository is cloned for future course work
- **WHEN** a maintainer or agent checks out the course branch
- **THEN** the course purpose, source policy, lecture requirements, and planning history are available without reconstructing them from conversation history

### Requirement: Local sources remain ignored and discoverable through specification
The `sources/` directory SHALL remain ignored and unpublished. Its expected inventory, authority, and known findings SHALL be described in course OpenSpec so an agent can request or locate the local source corpus when source verification is required.

#### Scenario: Repository validation runs with local sources present
- **WHEN** ignored source PDFs and audit files exist in the working tree
- **THEN** they do not enter tracked-tree validation or the publication plan

### Requirement: Content conversion is quality-checked across all lectures
Each converted note SHALL be checked against its teacher script, the curriculum capability, the source policy, the course audit, and Markdown publication constraints. The complete set MUST preserve cross-lecture terminology and progression, including event notation, distribution-function convention, expectation and variance notation, and transitions from discrete to continuous and limit-theorem topics.

#### Scenario: Conversion review finds a missing core element
- **WHEN** a required definition, formula condition, conclusion, or cross-lecture convention exists in the approved source material but not in the student note
- **THEN** the note remains incomplete until the omission or an explicit course-boundary rationale is resolved
