## Purpose

Defines the dual-profile teacher script and instructor presentation for lecture 1 as one auditable teaching unit about API boundaries, consumer goals, architecture, and lifecycle.

## ADDED Requirements

### Requirement: Lecture 1 remains a complete dual-profile 90-minute unit
Lecture 1 SHALL retain a continuous 0–90 minute teaching path in `lectures-teacher/001_api-interface-layer-and-lifecycle.md`, with `COMMON` concepts usable by both cohorts and visibly separate `PRB` and `SII` examples. It SHALL explain API as an observable contract rather than an endpoint, start from a consumer goal, distinguish contract from implementation, compare module and service boundaries without prescribing microservices, trace one request and the longer system lifecycle, and compare synchronous with asynchronous interaction.

#### Scenario: Lecturer prepares either cohort
- **WHEN** the lecturer selects the relevant profile before class
- **THEN** the `COMMON` sequence remains complete and only the matching `PRB` business-system or `SII` inference example is required

#### Scenario: Timing and progression are reviewed
- **WHEN** the timed blocks and their detailed sections are read in order
- **THEN** they form a continuous 90-minute progression from consumer goal to contract boundary, architecture, request pipeline, lifecycle, interaction mode, and synthesis

### Requirement: Lecture 1 claims are source-traceable and original
The lecture SHALL trace normative coverage to both matching RPD sections and SHALL classify each supporting source as RPD-listed literature, official technical material, university methodical material, or author-selected explanation. Added explanations SHALL be paraphrased and SHALL identify relevant chapters, sections, pages, DOI, or stable URL without reproducing protected passages or figures.

#### Scenario: Reviewer audits a teaching claim
- **WHEN** a reviewer selects a normative topic, profile example, architecture trade-off, or lifecycle explanation
- **THEN** the source map identifies its source role and location and does not present author-selected literature as RPD authority

### Requirement: Lecture 1 presentation supports rather than replaces the script
`attachments/001_api-interface-layer-and-lifecycle.pptx` SHALL be a revised 16:9 classroom aid whose ordered slide claims cover the complete lecture progression, use Russian audience-facing copy, preserve explicit `COMMON`/`PRB`/`SII` labels, and include speaker notes for timing, prompts, expected answers, demonstrations, and source records. The deck SHALL remain a dormant instructor attachment and SHALL NOT be added to `course.yaml` by this change.

#### Scenario: One profile slide is hidden
- **WHEN** the non-matching profile slide is hidden for a cohort
- **THEN** the remaining slides and notes preserve a coherent `COMMON` narrative plus the correct profile example

#### Scenario: Final deck is reviewed
- **WHEN** every final slide is rendered and inspected at full size after automated checks
- **THEN** the deck has no clipping, unintended overlap, broken media, unreadable text, unresolved placeholders, unattributed external visual, or unaddressed instructor visual-review finding

