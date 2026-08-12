## Why

The eight teacher scripts are mathematically strong and aligned with the RPD, but they need a final source-grounded editorial pass for comfortable study and classroom delivery, while the course still lacks complete student-facing lecture documents under `lectures/`. The repository and production site also need one explicit, truthful release state: the course, lecture one, and both lecture-one text variants are public; later lectures and the presentation are not.

## What Changes

- Apply targeted corrections found by the current review, including restoring the missing event-classification material in the first concise note and preserving all documented RPD defect handling.
- Review and lightly refactor all eight `lectures-teacher/` scripts for readability, oral delivery, consistency, and source traceability without changing their topic sequence, substantive scope, worked-result meaning, or teacher-only role.
- Author eight complete student-facing Markdown lectures under `lectures/`, derived from the reviewed teacher scripts but excluding timings, lecturer prompts, facilitation instructions, coverage matrices, source maps, and generator code.
- Preserve the eight existing `lecture-notes/` documents as separate concise notes and quality-check both student variants against the RPD, primary sources, and shared mathematical conventions.
- Change the publication contract to a staged release: lecture one declares both its complete `markdown` and concise `briefMarkdown`; lectures two through eight remain prepared but unavailable/in development; `attachments/lecture_1.pptx` remains tracked and undeclared.
- Record the current production state in versioned specification and require publisher-plan verification before deployment plus an authenticated or public-site smoke check after deployment.
- Mark the old lecture audit as superseded, preserve it as historical evidence in a non-published archive location, and replace its active role with the findings and acceptance evidence of this change.
- Publish the reviewed repository change through the normal branch workflow and verify that the primary site exposes exactly the intended course and lecture-one resources.

Non-goals:

- Do not redesign the eight-lecture curriculum, change workload, replace RPD assessment banks, or expand the course into mathematical statistics.
- Do not publish lectures two through eight, teacher scripts, local sources, OpenSpec artifacts, archived audits, or the presentation in this release.
- Do not reconstruct the missing graph for control-work task 3.5 or assume independence in individual assignment 6.3.
- Do not perform a broad visual redesign of the site or publisher.

## Capabilities

### New Capabilities

- `probability-theory-publication-release`: Defines the staged production release, deterministic publication-plan checks, repository publication, and primary-site verification for the course and lecture one.

### Modified Capabilities

- `probability-theory-lecture-materials`: Changes the student-product model to complete lectures plus concise notes, permits controlled editorial refinement of teacher scripts, defines staged availability, and keeps the presentation unpublished.
- `probability-theory-source-policy`: Replaces the old audit's active authority with a superseded historical record and requires current source-grounded review evidence.

## Impact

- Affected content: all eight files in `lectures-teacher/`, all eight files in `lecture-notes/`, eight new or completed files in `lectures/`, and the historical audit record.
- Affected publication configuration: `course.yaml` lecture variants, availability metadata, and the deliberate absence of an attachment declaration.
- Affected planning history: durable OpenSpec requirements and this change's review/acceptance evidence.
- Affected external systems: the course branch, publisher CI/deployment, Appwrite-backed course data, and the primary DataProsvet site.
- No publisher API, storage schema, or dependency change is expected; deployment must use the existing reviewed publication path.
