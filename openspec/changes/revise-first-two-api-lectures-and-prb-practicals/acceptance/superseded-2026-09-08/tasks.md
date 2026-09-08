## 1. Preservation and Scope Baseline

- [x] 1.1 Record Git status and checksums for `openspec/config.yaml`, both teacher scripts, seminars 1–3, homeworks 1–3, `course.yaml` if present, and the lecture 1 deck.
- [x] 1.2 Record the current headings, timed coverage, profile labels, source maps, code links, and executable checkpoint names for lectures 1 and 2 before rewriting.
- [x] 1.3 Render all 22 slides of the current lecture 1 deck, inspect each slide and its notes, and record visual, source, placeholder, and structural findings without overwriting the source deck.
- [x] 1.4 Confirm that public student lectures, concise notes, lectures 3–9, seminars and homeworks 4–12, `course.yaml`, and external code repositories are outside the implementation edit set.

## 2. OpenSpec Context and Capability Migration

- [x] 2.1 Add a decided profile-scope section to `openspec/config.yaml`: lectures use `COMMON` plus distinct `PRB` and `SII`, while course practical works, seminars, homeworks, and their assessment evidence are `PRB` until a later reviewed change says otherwise.
- [x] 2.2 Add the decided capability-granularity rule to `openspec/config.yaml`, including one capability per numbered lecture, practical work, and homework and exact path/scope requirements in `rules.specs`.
- [x] 2.3 Add verified source defects to `openspec/config.yaml`, including the incorrect RPD DOI `10.1016/j.jss.2024.112081` and corrected DOI `10.1016/j.jss.2024.112110`, without rewriting the RPD itself.
- [x] 2.4 Validate that the aggregate capability removals and eight new numbered capabilities archive without duplicate ownership or loss of a required lecture/practical/homework behavior.

## 3. Lecture Source Research

- [x] 3.1 Build a lecture 1 source matrix covering both RPDs, both curriculum maps, the university methodical guide, RPD-listed books, official sources, and author-selected explanatory literature with stable locators and source roles.
- [x] 3.2 Build a lecture 2 source matrix with the same classification and explicit coverage of HTTP semantics, REST resources and representations, OpenAPI 3.1, JSON Schema, validation, caching, and compatibility.
- [x] 3.3 Verify the RPD-listed articles from their publication or authoritative metadata pages and record which belong to lecture 2, practical work 3, or later testing material rather than forcing every article into the live lecture.
- [x] 3.4 Pin the taught OpenAPI 3.1 patch version and the corresponding official specification URL; replace moving `latest` links where they would change the taught contract.
- [x] 3.5 Verify the current RFC locations used for HTTP semantics and caching and record exact sections used for safe/idempotent methods, statuses, conditional requests, and cache behavior.
- [x] 3.6 Review both source matrices for copyright safety, eliminating any plan to reproduce long passages or unlicensed textbook figures.

## 4. Lecture 1 Script Revision

- [x] 4.1 Reformat `lectures-teacher/001_api-interface-layer-and-lifecycle.md` around a progressive 90-minute path with clearer transitions, stable terminology, and explicit core versus profile blocks.
- [x] 4.2 Strengthen the consumer-goal, observable-contract, implementation-hiding, module/service-boundary, request-pipeline, and lifecycle explanations using the verified source matrix.
- [x] 4.3 Preserve separate PRB forecasting/ERP/CRM/BI and SII inference/feedback/model-lifecycle examples without importing either profile's competencies into the other.
- [x] 4.4 Update the lecture 1 RPD coverage and source map with source roles and stable locators, marking Lauret or other non-RPD literature as author-selected explanation.
- [x] 4.5 Run a preservation comparison proving that every required lecture 1 concept, interaction, misconception, checkpoint, and 0–90 minute interval remains represented after reformatting.

## 5. Lecture 2 Script Revision

- [x] 5.1 Define and label the live 90-minute core, optional live depth, and reference/appendix material in `lectures-teacher/002_http-rest-openapi-data-contracts.md`.
- [x] 5.2 Rework the HTTP method/status section using verified safe, idempotent, retry, creation, asynchronous, validation, and conditional-request semantics.
- [x] 5.3 Rework the REST section to distinguish resource, URI, representation, CRUD operation, and architectural constraints without treating JSON or URL shape as proof of REST.
- [x] 5.4 Rework the end-to-end contract so raw HTTP, schemas, examples, OpenAPI, uniform errors, `request_id`, `schema_version`, and `model_version` agree exactly.
- [x] 5.5 Preserve separate PRB tabular/forecast and SII inference/binary-or-reference payload examples while stating that linked practical work in this course is PRB-only.
- [x] 5.6 Update the lecture 2 source map with the pinned OpenAPI version, official HTTP/JSON Schema sources, RPD-listed literature, verified article metadata, and the documented DOI defect.
- [x] 5.7 Verify that the core alone forms a continuous 0–90 minute sequence and that optional material can be omitted without breaking the central walkthrough or learning outcomes.

## 6. Lecture 1 Presentation Revision

- [x] 6.1 Create a slide-to-script/source map for the revised lecture 1 narrative, including timing, profile selection, interaction, speaker-note content, and source attribution.
- [x] 6.2 Preserve the original lecture 1 PPTX and revise a copy through the approved presentation workflow, editing inherited elements and retaining editable master/layout structure.
- [x] 6.3 Resolve the recorded composition, image-selection, information-density, and teaching-appeal findings while preserving a coherent `COMMON` sequence and optional PRB/SII slides.
- [x] 6.4 Add or correct speaker notes and `[Sources]` blocks for every externally sourced claim and visual, including permission basis for non-original images.
- [x] 6.5 Render every revised slide, inspect each at full size, run overflow and structural checks, verify notes/media/placeholders, correct all defects, and repeat the complete QA pass.

## 7. Lecture 2 Presentation Creation

- [x] 7.1 Use the visually approved lecture 1 language to plan a cumulative lecture 2 deck whose visible sequence covers the live core and keeps optional detail in notes or appendix slides.
- [x] 7.2 Create `attachments/002_http-rest-openapi-data-contracts.pptx` with readable HTTP/OpenAPI excerpts, concise Russian claim titles, and explicit `COMMON`, `PRB`, and `SII` labels.
- [x] 7.3 Add speaker notes for timing, explanations, questions, expected answers, profile selection, demonstrations, and a `[Sources]` block on every sourced slide.
- [x] 7.4 Render and inspect every slide individually and as a montage, run overflow and structural checks, verify notes/media/placeholders, correct all defects, and repeat the complete QA pass.
- [x] 7.5 Compare both final decks for consistent typography, spacing, color semantics, diagram language, profile labeling, source treatment, and classroom readability without forcing identical slide counts.

## 8. PRB Practical Works 1–3

- [x] 8.1 Revise `seminars/001_api-scenarios-and-context.md` to one PRB context-analysis path and remove all normative SII variants, examples, and acceptance criteria.
- [x] 8.2 Revise `seminars/002_rest-openapi-contract.md` to one PRB forecast-service contract path with a pinned OpenAPI 3.1 version and internally consistent validation criteria.
- [x] 8.3 Revise `seminars/003_http-api-diagnostics.md` to one PRB diagnostic path using local synthetic data, deterministic reset, success/error evidence, and no production endpoint.
- [x] 8.4 Verify that each practical maps to the matching PRB RPD work number, states course-authored methodological additions explicitly, links to the correct prerequisite lecture, and contains no normative SII reference.
- [ ] 8.5 Resolve each referenced existing `seminar/01`–`03` student branch and teacher mirror, verify profile labels and links from an authorized clean snapshot, and record any contract mismatch as a follow-up rather than mutating external repositories in this change.

## 9. PRB Homeworks 1–3

- [x] 9.1 Revise `homeworks/001_api-scenarios.md` as the PRB-only extension of practical work 1 with an additional consumer, failure paths, lifecycle stage, and rationale.
- [x] 9.2 Revise `homeworks/002_rest-openapi-contract.md` as the PRB-only completion of practical work 2 with missing paths, errors, constraints, examples, and version metadata.
- [x] 9.3 Revise `homeworks/003_http-api-diagnostics.md` as the PRB-only completion of practical work 3 with additional deterministic calls, assertions, and explanations.
- [x] 9.4 Verify that each homework preserves its practical-work number and shared branch, defines a distinct at-home checkpoint, does not claim a separate RPD homework bank, and contains no normative SII variant.

## 10. Cross-Material and Final Verification

- [x] 10.1 Compare lecture 1 terminology, examples, and links with PRB practical/homework 1 while confirming the lecture's SII example remains independent of the PRB assignment.
- [x] 10.2 Compare lecture 2 paths, methods, fields, errors, versions, and terminology with PRB practical/homework 2–3 and report rather than hide any deliberate educational simplification.
- [x] 10.3 Run positive PRB scope checks on all six student materials and negative checks proving that no required SII profile choice, competency, endpoint, payload, or tool remains.
- [x] 10.4 Check all changed Markdown links, local source paths, stable external URLs, headings, code fences, secret patterns, synthetic-data safety, and navigation links.
- [x] 10.5 Compare post-change checksums and Git diff with the baseline and confirm that `course.yaml`, public student lectures, concise notes, out-of-scope materials, and external repositories were not modified.
- [x] 10.6 Run strict OpenSpec validation, review every numbered capability against its scenarios, and record final lecture, presentation, PRB-scope, source, preservation, and known-follow-up results.
