## 1. Normative source, grading, and preservation baseline

- [x] 1.1 Record that `author-first-four-api-learning-path` supersedes the planning intent of `author-lectures-3-4-and-first-practicals` without applying, editing, or archiving the older change.
- [x] 1.2 Build a `COMMON`/`PRB`/`SII` coverage matrix for lectures 1–4, seminar meetings 1–6, practical works 1–5, and homeworks 1–5 from both RPDs and derived curriculum plans.
- [x] 1.3 Trace the RPD five-point practical-work scale, one-point weekly late penalty, defense expectations, and 60-point practical-work maximum, marking the phrase about statistical methods as a source-template defect.
- [x] 1.4 Create the shared rubric template with levels 5/4/3/2/0, evidence groups, late-penalty field, one-score practical/homework package rule, and explicit labels separating RPD scale from course-authored API evidence.
- [x] 1.5 Define one coherent `PRB` domain and one coherent `SII` domain with consumer goals, resources, methods, paths, schemas, errors, API/schema/model versions, workloads, and synthetic datasets.
- [x] 1.6 Record the current content and diff baseline for lectures 1–2, `course.yaml` if present, publication inputs, and unrelated user files before implementation edits.

## 2. Artifact topology and validation foundation

- [x] 2.1 Create `attachments/api-learning-path/` with contracts, lecture-demos, practicals, homeworks, synthetic-data, and validation areas exactly separated into student and instructor content.
- [x] 2.2 Add pinned or documented Python dependencies and reproducible environment instructions for FastAPI providers, Python clients, contract checks, and tests.
- [x] 2.3 Add a documented C++ reference toolchain, CMake project conventions, HTTP/JSON dependencies, and a clean configure/build/test command for ready-made `SII` clients.
- [x] 2.4 Implement shared uniform-error, request-correlation, schema-version, and model-version fixtures without forcing the same profile payload.
- [x] 2.5 Add orchestration for Markdown links, JSON/YAML parsing, OpenAPI validation, example-against-schema checks, `.proto` compilation, Python tests, and CMake tests.
- [x] 2.6 Add localhost provider lifecycle helpers with readiness, deterministic reset/seed, success/error calls, and clean shutdown.
- [x] 2.7 Add template-state checks that distinguish documented expected failures in student TODO templates from failures in instructor solutions.
- [x] 2.8 Add secret, forbidden-data, production-host, student-to-instructor-solution link, and publication-allowlist scans.

## 3. Build the evolving lecture demonstration projects

- [x] 3.1 Implement `PRB` lecture checkpoints L1.1–L1.6 for function/Web API comparison, client contract, request pipeline, stage errors, sync/async jobs, and lifecycle observability.
- [x] 3.2 Implement `SII` lecture checkpoints L1.1–L1.6 with a Python provider and complete ready-made C++ client where the profile language clarifies the boundary.
- [x] 3.3 Implement `PRB` lecture checkpoints L2.1–L2.8 for raw HTTP, resources/parameters, methods/statuses, idempotency, errors, cache semantics, OpenAPI, and compatibility.
- [x] 3.4 Implement `SII` lecture checkpoints L2.1–L2.8 using the inference contract and complete C++ client calls without making CMake knowledge a student prerequisite.
- [x] 3.5 Implement lecture 3 REST and long-running job checkpoints for both profiles with deterministic behavior and shared comparison fixtures.
- [x] 3.6 Implement the selected end-to-end alternative integration checkpoint for `PRB` and document its workload, delivery, retry, and operational assumptions.
- [x] 3.7 Implement the selected end-to-end gRPC or WebSocket checkpoint for `SII`, including compilable contract, disconnect/error behavior, and documented toolchain.
- [x] 3.8 Add executable or machine-checkable message traces for the remaining gRPC, WebSocket, event-driven, gateway, BFF, and service-to-service comparisons.
- [x] 3.9 Implement lecture 4 checkpoints L4.1–L4.9 for both profile payloads, preserving all prior behavior in the final FastAPI checkpoint.
- [x] 3.10 Add bounded FastAPI/Flask/DRF comparison fragments and PostgreSQL/external-service/model boundary adapters that require no real dependencies.
- [x] 3.11 Give every lecture checkpoint a README command, expected observation, focused validation command, and final regression test.
- [x] 3.12 Run all lecture checkpoints in the reference environment and correct every command, contract, expected response, and cleanup defect before authoring scripts around them.

## 4. Enrich teacher scripts for lectures 1–2

- [x] 4.1 Build a concept-to-checkpoint coverage map for every substantial result and timed block of lecture 1.
- [x] 4.2 Insert the L1.1–L1.6 demonstration sequence into `001_api-interface-layer-and-lifecycle.md` with commands, expected outputs, profile selection, and lecturer explanation.
- [x] 4.3 Reconcile lecture 1 timing so explanations, multiple demonstrations, interactions, summary, RPD coverage, and source map still form a continuous 90-minute path.
- [x] 4.4 Build a concept-to-checkpoint coverage map for every substantial HTTP, REST, format, OpenAPI, validation, versioning, cache, and compatibility concept of lecture 2.
- [x] 4.5 Insert the L2.1–L2.8 demonstration sequence into `002_http-rest-openapi-data-contracts.md` without losing the existing coherent contract walkthrough.
- [x] 4.6 Reconcile lecture 2 prose, raw HTTP, OpenAPI, JSON, Python, C++, tests, timing, RPD coverage, and source map against the validated checkpoints.
- [x] 4.7 Read lectures 1–2 in `PRB`-only and `SII`-only modes and remove any new cross-profile prerequisite or unmarked requirement.

## 5. Author teacher script for lecture 3

- [x] 5.1 Create `lectures-teacher/003_integration-styles-api.md` with scope, outcomes, prerequisites, literature, preparation, and continuous 0–90 timing.
- [x] 5.2 Explain REST, RPC/gRPC, Protocol Buffers, WebSocket, events, synchronous/asynchronous/streaming/bidirectional exchange, gateway, BFF, and service-to-service concepts in the order used by L3 checkpoints.
- [x] 5.3 Add the `PRB` evolving example across REST, long-running work, selected alternative style, failures, and decision matrix.
- [x] 5.4 Add the `SII` evolving example across REST, gRPC/WebSocket, streaming/disconnect behavior, failures, and decision matrix.
- [x] 5.5 Add message traces and comparison evidence for every style or architectural role that is not demonstrated end-to-end.
- [x] 5.6 Add audience questions with answer guidance, typical errors, summary, self-check, seminar 4 bridge, lecture 4 bridge, RPD coverage, sources, and preflight checklist.
- [x] 5.7 Verify the lecture 3 coverage map has no substantive concept without a code, contract, request/response, trace, schema, or error demonstration.

## 6. Author teacher script for lecture 4

- [x] 6.1 Create `lectures-teacher/004_python-api-services-fastapi.md` with scope, outcomes, prerequisites, literature, preparation, and continuous 0–90 timing.
- [x] 6.2 Explain and demonstrate L4.1–L4.4: application/Uvicorn, health and profile routes, request/response models, validation, dependencies, and configuration.
- [x] 6.3 Explain and demonstrate L4.5–L4.9: exceptions, uniform errors, logs/request_id, async behavior, Swagger UI/OpenAPI, and profile integration boundaries.
- [x] 6.4 Add the `PRB` forecast/report/ETL payload path and bounded FastAPI/Flask/DRF and PostgreSQL/external-API comparisons.
- [x] 6.5 Add the `SII` inference/model/request-history path with preprocessing, model version, result schema, error, latency, and CPU-only assumptions.
- [x] 6.6 Add audience questions with answer guidance, typical errors, summary, self-check, seminars 5–6 bridge, lecture 5 bridge, RPD coverage, sources, and preflight checklist.
- [x] 6.7 Verify every FastAPI concept named in the lecture appears in an executable checkpoint and that the final checkpoint passes all prior regression checks.

## 7. Create complete practical-work 1 and 2 packs

- [x] 7.1 Create `seminars/001_api-scenarios-and-context.md` with `COMMON`, `PRB`, and `SII` instructions, safe inputs, incremental steps, expected artifact, public checks, reflection, and student-visible rubric.
- [x] 7.2 Create complete `PRB` and `SII` starters and instructor solutions for PР1 context diagrams and interface/lifecycle tables, including explanation and rubric evidence maps.
- [x] 7.3 Add PР1 structural checks and verify student materials do not expose instructor diagrams, completed rows, defense answers, or hidden evidence.
- [x] 7.4 Create `seminars/002_rest-openapi-contract.md` with incremental resource, route, schema, response, error, versioning, validation, and defense tasks.
- [x] 7.5 Create complete `PRB` and `SII` OpenAPI 3.1 instructor solutions for PР2, including upload/register, operation, status, result, history, errors, request_id, schema_version, and model_version.
- [x] 7.6 Add PР2 starters, public checks, instructor checks, examples, compatibility cases, defense guidance, and profile-specific rubric evidence maps.
- [x] 7.7 Run full OpenAPI lint, schema, example, operation-coverage, and contract-consistency validation for both PР2 solutions.

## 8. Create complete practical-work 3 and 4 packs

- [x] 8.1 Create `seminars/003_http-api-diagnostics.md` around the deterministic local reference API with at least three success and five intended error scenarios.
- [x] 8.2 Create complete `PRB` and `SII` PР3 collections/scripts and filled diagnostic reports with commands, statuses, headers, JSON bodies, request_id correlation, and explanations.
- [x] 8.3 Add PР3 starters, public checks, instructor checks, defense guidance, rubric evidence maps, and deterministic reset/cleanup.
- [x] 8.4 Execute every PР3 diagnostic case against the reference API and reconcile seminar prose, collection, expected report, and server behavior.
- [x] 8.5 Create `seminars/004_integration-style-selection.md` with complete workload assumptions and a student-visible REST/gRPC/WebSocket/events matrix and ADR template.
- [x] 8.6 Create complete `PRB` and `SII` PР4 matrices and ADR solutions with rejected alternatives, failure/operational trade-offs, risks, and reconsideration triggers.
- [x] 8.7 Add PР4 machine-readable completeness checks where possible, content-review checklist, defense guidance, and rubric evidence maps.
- [x] 8.8 Verify both PР4 conclusions follow from explicit workload assumptions and contain no universal technology ranking.

## 9. Create the complete two-part practical-work 5 pack

- [x] 9.1 Create `seminars/005_fastapi-service-foundation.md` as PР5 part 1 with environment setup, starter, app/health, profile route, Pydantic models, checkpoint, public checks, and interim rubric evidence.
- [x] 9.2 Create `seminars/006_fastapi-validation-openapi.md` as PР5 part 2 in the same repository with constraints, errors, logging, OpenAPI, tests, README, defense, and final rubric.
- [x] 9.3 Create incomplete but runnable `PRB` and `SII` PР5 student starters that expose no completed instructor solution.
- [x] 9.4 Create complete `PRB` and `SII` PР5 instructor services with health, success, validation, not-found, conflict/dependency failure, logs, docs, and profile routes.
- [x] 9.5 Add public and instructor test suites, OpenAPI semantic checks, clean-start instructions, defense guidance, and rubric evidence maps for PР5.
- [x] 9.6 Run both PР5 solutions from clean environments and verify seminars 5–6 total four hours, retain one normative work number, and accept one final repository.

## 10. Create homework templates and reference solutions 1–2

- [x] 10.1 Create `homeworks/001_api-scenarios.md` with explicit TODO interfaces/lifecycle fields, unchanged constraints, public checklist, required artifact, security/reproducibility rules, and grading matrix.
- [x] 10.2 Create complete `PRB` and `SII` HW1 reference diagrams/tables and evidence maps; verify each extends rather than replaces PР1.
- [x] 10.3 Create `homeworks/002_rest-openapi-contract.md` with explicit TODO paths/schemas/errors/constraints/examples/version metadata and public contract checks.
- [x] 10.4 Create complete `PRB` and `SII` HW2 reference OpenAPI files and instructor checks; verify templates fail only the documented TODO requirements and references pass all checks.

## 11. Create homework templates and reference solutions 3–5

- [x] 11.1 Create `homeworks/003_http-api-diagnostics.md` with TODO calls/assertions/explanations, deterministic reference API instructions, and public checks.
- [x] 11.2 Create complete `PRB` and `SII` HW3 scripts/collections, reports, instructor checks, and rubric evidence maps.
- [x] 11.3 Create `homeworks/004_integration-style-decision.md` with TODO alternatives/assumptions/trade-offs/decision/triggers and student-visible content checklist.
- [x] 11.4 Create complete `PRB` and `SII` HW4 ADR solutions, instructor review checklist, and rubric evidence maps.
- [x] 11.5 Create `homeworks/005_fastapi-service.md` over the PР5 repository with bounded TODO validator/error/profile-route/tests/README tasks and regression requirements.
- [x] 11.6 Create complete `PRB` and `SII` HW5 solutions and instructor checks; verify all PР5 regression tests plus new homework tests pass.
- [x] 11.7 Verify each HW1–HW5 file states that it contributes evidence to one 0–5 practical-work grade and does not create a second normative score.

## 12. Grading and cross-artifact acceptance review

- [x] 12.1 Instantiate the common 5/4/3/2/0 rubric for PР1–PР5 with profile-specific evidence under completeness, contract/architecture, behavior/tests, safety/reproducibility/docs, and defense.
- [x] 12.2 Verify every practical and homework shows the required artifact, public checks, grading matrix, late-penalty rule, submission checklist, and one-score package semantics before students begin.
- [x] 12.3 Verify instructor solutions include a completed rubric evidence map but student materials contain no hidden answers or defense guidance.
- [x] 12.4 Independently grade the provided instructor solution at level 5 and deliberately defective fixtures at levels 4, 3, and 2 to test rubric discrimination.
- [x] 12.5 Confirm level 1 is not introduced, non-submission maps to 0, weekly lateness is applied separately, and all author-created criteria are labeled as API-specific RPD concretization.

## 13. Full technical, profile, and publication validation

- [x] 13.1 Run Markdown, JSON, YAML, OpenAPI, schema-example, Protocol Buffers, Python, FastAPI, CMake/C++, template-state, and instructor-solution validation suites.
- [x] 13.2 Start each local provider and run every documented lecture, practical, and homework success/error scenario with deterministic reset and clean shutdown.
- [x] 13.3 Generate and review the contract coverage report across lecture prose, checkpoints, OpenAPI/proto, code, seminar requirements, homework TODOs, tests, and reference solutions.
- [x] 13.4 Read all materials in `COMMON+PRB` and `COMMON+SII` modes and correct unmarked cross-profile requirements, artificial universal payloads, or premature C++ expectations.
- [x] 13.5 Run secret, forbidden-data, production-host, instructor-solution exposure, and publication-allowlist scans and correct every finding.
- [x] 13.6 Verify teacher timing remains continuous 0–90, practical timing is 2+2+2+2+4 hours, and all five homework continuations map to the matching normative work.
- [x] 13.7 Confirm the final diff preserves unrelated user changes, leaves `course.yaml` unchanged, and contains only the planned teacher scripts, seminars, homeworks, and scoped attachments.
- [x] 13.8 Run strict OpenSpec validation and available repository validation, recording commands, environment versions, pass/fail results, and any explicitly inapplicable publication check.
