# Probability Theory Publication Release Specification

## Purpose

Defines the staged production release and the evidence required to prove that repository, publisher, and primary-site state agree for the probability-theory course.

## Requirements

### Requirement: Current production scope is explicit
The current production release SHALL expose the published probability-theory course and lecture one with both its complete student lecture and concise note. Lectures two through eight SHALL remain unavailable or in development, and teacher scripts, local sources, OpenSpec content, archived audits, dormant files, and the lecture-one presentation MUST NOT be publicly exposed.

#### Scenario: User opens the probability-theory course
- **WHEN** the current release has completed successfully
- **THEN** the course and lecture-one metadata are visible, lecture one offers complete and concise text, later lectures are not available for study, and no presentation action is shown

### Requirement: Publication plan is validated before deployment
Before any production mutation, the repository SHALL pass strict OpenSpec validation, Markdown and asset validation, deterministic publication-plan generation, and a review of the resulting plan against the staged scope. Validation failure or an unexpected public resource MUST stop the release.

#### Scenario: Plan contains an unintended resource
- **WHEN** validation shows a later lecture, teacher script, archived audit, local source, or presentation in the publication plan
- **THEN** deployment is not started until the declaration or publisher behavior is corrected and the plan is regenerated

### Requirement: Repository publication follows the reviewed branch workflow
The completed and validated change SHALL be committed and pushed through the repository's normal reviewed course-branch workflow. Production publication MUST originate from the committed repository state rather than from an uncommitted working tree or manual console edits.

#### Scenario: Change is ready to publish
- **WHEN** content acceptance and pre-deployment validation are complete
- **THEN** the exact accepted files are committed, pushed, and allowed to publish through the configured repository workflow

### Requirement: Primary-site state is verified after deployment
After the production deployment completes, the primary site SHALL be checked using the deployed commit identity and user-visible behavior. Verification SHALL confirm course visibility, lecture-one metadata, both lecture-one text variants, absence of the presentation, non-availability of lectures two through eight, and successful rendering of formulas, headings, links, and referenced images. The verification result SHALL be recorded as versioned evidence.

#### Scenario: Production smoke check succeeds
- **WHEN** the deployment reports success and the primary site is opened
- **THEN** the site matches the staged release contract and the evidence records the deployed revision, checked pages, and result

#### Scenario: Production differs from the accepted plan
- **WHEN** the primary site exposes missing, stale, malformed, or unintended resources
- **THEN** the release is treated as failed, the discrepancy is recorded, and the repository-based rollback or corrective publish path is used before acceptance
