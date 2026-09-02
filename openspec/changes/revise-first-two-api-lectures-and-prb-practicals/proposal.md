## Why

The first two teacher lectures already contain substantial material, but their density, source traceability, and presentation support are uneven: lecture 2 is overloaded for a 90-minute session, lecture 1 has a deck that still requires visual revision, and lecture 2 has no deck. At the same time, aggregate capabilities obscure which numbered lecture, practical work, or homework is changing, and the course now requires a deliberate profile boundary: lectures serve both `PRB` and `SII`, while practical and homework materials in this scope serve only `PRB`.

## What Changes

- Reformat and substantively review teacher lectures 1 and 2 as `COMMON` material with clearly separated `PRB` and `SII` examples, preserving the matching requirements of both RPDs without merging profile competencies.
- Build a verified source corpus for each lecture from both RPDs, their listed books, articles, methodical materials, and official specifications; distinguish RPD-listed, normative technical, and author-selected explanatory sources.
- Record and handle source defects discovered during review, including the incorrect DOI for *Microservice API Evolution in Practice* and the need to pin OpenAPI 3.1 rather than link a moving `latest` version.
- Rebalance lecture 2 into a teachable 90-minute core plus clearly marked optional or reference material instead of merely increasing its length.
- Visually revise the existing lecture 1 PowerPoint and create a matching lecture 2 PowerPoint, both with Russian audience-facing copy, speaker notes, per-slide source records, explicit `COMMON`/`PRB`/`SII` labels, full-slide rendering, and visual QA.
- Review and align practical works 1–3 and homeworks 1–3 only for `PRB`; remove any implication that the resulting assignments or acceptance criteria also apply to `SII`.
- Update `openspec/config.yaml` so every numbered lecture, practical work, and homework has its own capability. A lecture capability may include its teacher script and presentation, while a practical work and its homework continuation remain separate capabilities even when they share one RPD outcome and code branch.
- Supersede new unit-specific requirements in the aggregate `teacher-lecture-scripts` and `lecture-presentations` capabilities with the numbered lecture capabilities introduced by this change.
- Keep `course.yaml`, public student lectures, concise lecture notes, lectures 3–9, practical works and homeworks 4–12, and external code repositories unchanged unless verification finds a directly conflicting link or contract that must be reported for a follow-up change.

## Capabilities

### New Capabilities

- `lecture-01-api-interface-layer`: Defines the dual-profile teacher script and presentation for lecture 1, including source traceability, teachability, profile separation, and visual verification.
- `lecture-02-http-rest-openapi-contracts`: Defines the dual-profile teacher script and presentation for lecture 2, including a 90-minute core, optional depth, pinned technical standards, profile examples, and visual verification.
- `practical-01-prb-api-scenario-analysis`: Defines PRB-only practical work 1 for analyzing consumers, interfaces, data, lifecycle stages, and the context of a business system with AI elements.
- `homework-01-prb-api-scenario-extension`: Defines the PRB-only take-home continuation of practical work 1 without creating a separate normative RPD outcome.
- `practical-02-prb-rest-openapi-design`: Defines PRB-only practical work 2 for designing a forecast-service REST API and an OpenAPI contract.
- `homework-02-prb-rest-openapi-extension`: Defines the PRB-only take-home completion of the practical work 2 contract.
- `practical-03-prb-http-api-diagnostics`: Defines PRB-only practical work 3 for reproducible HTTP API diagnostics with safe synthetic data.
- `homework-03-prb-http-diagnostics-extension`: Defines the PRB-only take-home completion and individualization of practical work 3.

### Modified Capabilities

- `teacher-lecture-scripts`: Removes ownership of unit-specific requirements for lectures 1 and 2 after those requirements move to numbered lecture capabilities.
- `lecture-presentations`: Removes ownership of the lecture 1 unit-specific presentation requirements after they move to `lecture-01-api-interface-layer` and establishes numbered lecture capabilities as the target for future presentation revisions.

## Impact

- Primary content paths: `lectures-teacher/001_api-interface-layer-and-lifecycle.md`, `lectures-teacher/002_http-rest-openapi-data-contracts.md`, `seminars/001_api-scenarios-and-context.md`, `seminars/002_rest-openapi-contract.md`, `seminars/003_http-api-diagnostics.md`, and matching `homeworks/001`–`003` files.
- Presentation paths: revision of `attachments/001_api-interface-layer-and-lifecycle.pptx` and creation of `attachments/002_http-rest-openapi-data-contracts.pptx`.
- Planning context: `openspec/config.yaml` gains the decided lecture-versus-practical profile boundary, capability-granularity rules, and known source defects verified by this change.
- Normative sources: both RPDs govern lectures; only `sources/Б1.В.11 API-технологии_ПРБ_РПД.pdf` and the PRB curriculum plan govern practical works and homeworks in this change.
- Publication remains unchanged: teacher scripts and dormant attachments are not added to `course.yaml`, and the unresolved publication-profile decision remains unresolved.
- No executable course-code branch is changed by default. Any discovered mismatch with existing private branch behavior is documented and scoped into a separate implementation decision before repository mutation.
