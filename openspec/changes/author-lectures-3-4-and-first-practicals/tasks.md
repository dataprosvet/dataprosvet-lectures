## 1. Source mapping and preservation baseline

- [ ] 1.1 Build a coverage matrix for lectures 3–4, seminar meetings 1–6, practical works 1–5, and homeworks 1–5 from both RPDs and derived curriculum plans, separating `COMMON`, `PRB`, `SII`, normative wording, and course-authored detail.
- [ ] 1.2 Map relevant sections or pages of the university guide and the API-design, microservices, and ML-systems books to lecture 3–4 blocks without treating the guide's 18 methodical tasks as normative RPD numbering.
- [ ] 1.3 Record the current hashes or diffs of `lectures-teacher/001_*`, `002_*`, `course.yaml` if present, and unrelated user files so later edits preserve existing content and the publication allowlist.
- [ ] 1.4 Define one coherent `PRB` domain and one coherent `SII` domain, including consumer goal, paths, methods, schemas, statuses, uniform errors, API/schema/model versions, and synthetic datasets used across lectures, seminars, homeworks, and attachments.

## 2. Reproducible demonstration foundation

- [ ] 2.1 Create the `attachments/first-four-lectures/` structure with separate teacher-demo, student-starter, contract, and synthetic-data areas and README files that identify what students may use.
- [ ] 2.2 Implement a local `PRB` reference API and Python client that reproduce documented success, validation failure, missing-resource, and temporary-unavailability scenarios without real external services.
- [ ] 2.3 Implement a local `SII` reference API and ready-to-run C++ client with pinned or documented dependencies, CMake instructions, JSON parsing, HTTP status handling, and no expectation that students modify it before lecture 5.
- [ ] 2.4 Add the minimal alternative-style demonstrations selected in design: long-running/event behavior for `PRB` and gRPC or WebSocket behavior for `SII`, including contracts and message traces for the non-executable comparison styles.
- [ ] 2.5 Add automated or scripted checks for health, documented successful calls, at least five intended error scenarios, OpenAPI availability, response schemas, uniform errors, and absence of network dependence beyond localhost.
- [ ] 2.6 Run both demonstration tracks from their README instructions in clean local environments and record dependency versions, commands, expected outputs, CPU/resource assumptions, and known platform limitations.

## 3. Preserve and enrich lectures 1–2

- [ ] 3.1 Add a minimal executable request-pipeline demonstration to lecture 1 with a Python `PRB` client and ready-made C++ `SII` client, keeping API goals and lifecycle reasoning ahead of framework selection.
- [ ] 3.2 Add executable client calls and response/error inspection to lecture 2 while preserving its existing coherent HTTP/OpenAPI walkthrough and 90-minute timing.
- [ ] 3.3 Reconcile all edited lecture 1–2 prose, HTTP, OpenAPI, JSON, Python, and C++ references with the shared profile contracts and attachment README files.
- [ ] 3.4 Verify that additions do not shorten or replace existing explanations, do not make C++ a student prerequisite, and retain the original `COMMON`/`PRB`/`SII` source maps and RPD coverage.

## 4. Author lecture 3

- [ ] 4.1 Create `lectures-teacher/003_integration-styles-api.md` with scope, learning outcomes, prerequisites, preparation notes, literature, and a continuous 0–90 minute plan.
- [ ] 4.2 Write the `COMMON` explanation of REST, RPC/gRPC, Protocol Buffers, WebSocket, event-driven APIs, synchronous/asynchronous/streaming/bidirectional exchange, API gateway, backend-for-frontend, and service-to-service communication.
- [ ] 4.3 Add one comparison matrix and message-flow walkthrough that evaluates the same scenario by latency, throughput, directionality, coupling, delivery behavior, scaling, observability, maintainability, and operating cost.
- [ ] 4.4 Add the `PRB` business-service/ETL/long-running calculation example and executable alternative-style demonstration without importing `SII` competencies.
- [ ] 4.5 Add the `SII` online-inference/streaming computer-vision example and ready-made C++-oriented demonstration without requiring lecture 5 skills.
- [ ] 4.6 Add audience questions with answer guidance, typical selection errors, summary, self-check, bridge to seminar 4 and lecture 4, RPD coverage, source map, and teacher preflight checklist.

## 5. Author lecture 4

- [ ] 5.1 Create `lectures-teacher/004_python-api-services-fastapi.md` with scope, learning outcomes, prerequisites, preparation notes, literature, and a continuous 0–90 minute plan.
- [ ] 5.2 Write the incremental `COMMON` FastAPI path from application and routes through Pydantic request/response models, validation, dependencies, configuration, exceptions, logging, async handlers, Uvicorn, Swagger UI, and generated OpenAPI.
- [ ] 5.3 Add a live invalid-input walkthrough proving validation occurs before forecasting or inference and that code, error body, status, OpenAPI constraint, and expected classroom explanation agree.
- [ ] 5.4 Add the `PRB` forecast/report/ETL route variant, a bounded FastAPI–Flask–Django REST Framework comparison, and explicit bridges to PostgreSQL and external APIs.
- [ ] 5.5 Add the `SII` inference/model/request-history route variant and identify preprocessing, model version, result schema, error cases, latency, and CPU-only resource assumptions.
- [ ] 5.6 Add audience questions with answer guidance, typical implementation errors, summary, self-check, bridges to seminars 5–6 and lecture 5, RPD coverage, source map, and teacher preflight checklist.

## 6. Author seminars for practical works 1–4

- [ ] 6.1 Create `seminars/001_api-scenarios-and-context.md` with separate `PRB` and `SII` cases and acceptance criteria for the context diagram and lifecycle-aware interface table of practical work 1.
- [ ] 6.2 Create `seminars/002_rest-openapi-contract.md` with incremental resource, endpoint, schema, response, error, versioning, and OpenAPI validation tasks for practical work 2.
- [ ] 6.3 Create `seminars/003_http-api-diagnostics.md` around the local reference API, requiring at least three successful and five intentionally failing `curl`/Postman scenarios and a structured diagnostic report for practical work 3.
- [ ] 6.4 Create `seminars/004_integration-style-selection.md` with profile workloads, a REST/gRPC/WebSocket/events comparison rubric, one justified decision, and explicit reconsideration conditions for practical work 4.
- [ ] 6.5 Review seminars 1–4 as student-only documents and remove teacher timing, answer keys, internal source maps, hidden test results, and any requirement belonging only to the other profile.

## 7. Author the two-part FastAPI practical work 5

- [ ] 7.1 Create `seminars/005_fastapi-service-foundation.md` as practical work 5 part 1, ending with a runnable project, health route, profile routes, Pydantic models, and a saved checkpoint for the same repository.
- [ ] 7.2 Create `seminars/006_fastapi-validation-openapi.md` as practical work 5 part 2, adding validation, uniform errors, logging, Swagger UI/OpenAPI verification, and successful and failing acceptance calls.
- [ ] 7.3 Provide profile-specific student starters that expose no completed solution while keeping setup reproducible and consistent with the reference contract.
- [ ] 7.4 Verify that seminars 5–6 total four hours, retain the single normative label `Практическая работа № 5`, and accept one final repository rather than inventing practical work 6.

## 8. Author homeworks 1–5

- [ ] 8.1 Create `homeworks/001_api-scenarios.md` to individualize and complete the context diagram and interface table from practical work 1.
- [ ] 8.2 Create `homeworks/002_rest-openapi-contract.md` to complete a valid profile OpenAPI 3.1 contract with documented success and error responses from practical work 2.
- [ ] 8.3 Create `homeworks/003_http-api-diagnostics.md` to submit the reusable request collection or script and expectation-versus-observation report from practical work 3.
- [ ] 8.4 Create `homeworks/004_integration-style-decision.md` to submit a concise ADR comparing four styles and defending the profile decision from practical work 4.
- [ ] 8.5 Create `homeworks/005_fastapi-service.md` to finish, document, and verify the cumulative FastAPI repository from practical work 5.
- [ ] 8.6 Verify every homework contains scope, matching RPD work number and outcome, input constraints, required artifact, reproducibility and security requirements, observable acceptance criteria, and a submission checklist without claiming a separate normative assessment bank.

## 9. Contract, profile, and publication verification

- [ ] 9.1 Validate Markdown structure, local links, attachment paths, JSON/YAML/Protocol Buffer syntax, and all declared run commands.
- [ ] 9.2 Compare prose, HTTP, OpenAPI, data examples, Python clients, C++ clients, reference APIs, seminar expectations, and homework criteria using the contract coverage matrix and correct every mismatch.
- [ ] 9.3 Read every lecture, seminar, homework, and attachment separately in `PRB`-only and `SII`-only modes and remove unmarked cross-profile requirements or artificial universal payloads.
- [ ] 9.4 Verify all examples use localhost or documented fictitious hosts, synthetic data, placeholders, and no credentials, personal data, bank data, production endpoints, or closed infrastructure.
- [ ] 9.5 Confirm the final diff preserves unrelated user work, contains exactly four teacher scripts plus the planned six seminars, five homeworks, and scoped attachments, and leaves `course.yaml` and the publication plan unchanged.
- [ ] 9.6 Run strict OpenSpec validation and any available repository publisher validation that does not require changing the unresolved publication-profile decision; record any intentionally inapplicable publication check.

