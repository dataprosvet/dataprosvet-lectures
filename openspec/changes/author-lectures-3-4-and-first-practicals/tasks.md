## 1. Сохранённая лекционная часть

Практические задачи заменены `reset-seminar-01-and-homework-01`. Полный исходный журнал с прежними статусами находится в [acceptance](acceptance/superseded-2026-09-08/tasks.md). Отмена не означает выполнение; в частности, непроверенный пункт 8.5 старого PRB-change остаётся `[ ]` в историческом журнале.

С 2026-09-14 отменены задачи 2.3, 4.5 и 5.5 прежней второй траектории. Они удалены из активного списка, а не отмечены выполненными. Исторические статусы сохраняются в acceptance; оставшиеся задачи относятся только к ПРБ.

- [ ] 1.1 Build a coverage matrix for lectures 3–4 from the PRB RPD and its derived curriculum plan, separating normative wording and course-authored detail.
- [ ] 1.2 Map relevant sections or pages of the university guide and the API-design, microservices, and ML-systems books to lecture 3–4 blocks without treating the guide's 18 methodical tasks as normative RPD numbering.
- [ ] 1.3 Record the current hashes or diffs of `lectures-teacher/001_*`, `002_*`, `course.yaml` if present, and unrelated user files so later edits preserve existing content and the publication allowlist.
- [ ] 1.4 Define one coherent PRB domain, including consumer goal, paths, methods, schemas, statuses, uniform errors, API/schema/model versions, and synthetic datasets used across lectures and their attachments.
- [ ] 2.1 Create the `attachments/first-four-lectures/` structure with separate teacher-demo, student-starter, contract, and synthetic-data areas and README files that identify what students may use. (С 2026-09-08 действует только лекционная часть; упоминания прежней практики исторические.)
- [ ] 2.2 Implement a local `PRB` reference API and Python client that reproduce documented success, validation failure, missing-resource, and temporary-unavailability scenarios without real external services.
- [ ] 2.4 Add the minimal alternative demonstration selected in design: long-running or event behavior for PRB, including contracts and message traces for the non-executable comparison styles such as gRPC and WebSocket.
- [ ] 2.5 Add automated or scripted checks for health, documented successful calls, at least five intended error scenarios, OpenAPI availability, response schemas, uniform errors, and absence of network dependence beyond localhost.
- [ ] 2.6 Run the PRB demonstrations from their README instructions in clean local environments and record dependency versions, commands, expected outputs, CPU/resource assumptions, and known platform limitations.
- [ ] 3.1 Add a minimal executable request-pipeline demonstration to lecture 1 with a Python PRB client, keeping API goals and lifecycle reasoning ahead of framework selection.
- [ ] 3.2 Add executable client calls and response/error inspection to lecture 2 while preserving its existing coherent HTTP/OpenAPI walkthrough and 90-minute timing.
- [ ] 3.3 Reconcile all edited lecture 1–2 prose, HTTP, OpenAPI, JSON, and Python references with the PRB contracts and attachment README files.
- [ ] 3.4 Verify that additions do not shorten or replace existing explanations, and retain the PRB source maps and RPD coverage.
- [ ] 4.1 Create `lectures-teacher/003_integration-styles-api.md` with scope, learning outcomes, prerequisites, preparation notes, literature, and a continuous 0–90 minute plan.
- [ ] 4.2 Write the explanation of REST, RPC/gRPC, Protocol Buffers, WebSocket, event-driven APIs, synchronous/asynchronous/streaming/bidirectional exchange, API gateway, backend-for-frontend, and service-to-service communication.
- [ ] 4.3 Add one comparison matrix and message-flow walkthrough that evaluates the same scenario by latency, throughput, directionality, coupling, delivery behavior, scaling, observability, maintainability, and operating cost.
- [ ] 4.4 Add the `PRB` business-service/ETL/long-running calculation example and executable alternative-style demonstration traced to PRB outcomes.
- [ ] 4.6 Add audience questions with answer guidance, typical selection errors, summary, self-check, bridge to seminar 4 and lecture 4, RPD coverage, source map, and teacher preflight checklist. (С 2026-09-08 действует только лекционная часть; упоминания прежней практики исторические.)
- [ ] 5.1 Create `lectures-teacher/004_python-api-services-fastapi.md` with scope, learning outcomes, prerequisites, preparation notes, literature, and a continuous 0–90 minute plan.
- [ ] 5.2 Write the incremental FastAPI path from application and routes through Pydantic request/response models, validation, dependencies, configuration, exceptions, logging, async handlers, Uvicorn, Swagger UI, and generated OpenAPI.
- [ ] 5.3 Add a live invalid-input walkthrough proving validation occurs before forecasting or inference and that code, error body, status, OpenAPI constraint, and expected classroom explanation agree.
- [ ] 5.4 Add the `PRB` forecast/report/ETL route variant, a bounded FastAPI–Flask–Django REST Framework comparison, and explicit bridges to PostgreSQL and external APIs.
- [ ] 5.6 Add audience questions with answer guidance, typical implementation errors, summary, self-check, bridges to seminars 5–6 and lecture 5, RPD coverage, source map, and teacher preflight checklist. (С 2026-09-08 действует только лекционная часть; упоминания прежней практики исторические.)
- [ ] 9.1 Validate Markdown structure, local links, attachment paths, JSON/YAML/Protocol Buffer syntax, and all declared run commands.
- [ ] 9.3 Read every affected lecture and attachment as one coherent PRB narrative and verify that all required outcomes trace to its RPD without another program's requirements or artificial universal payloads.
- [ ] 9.4 Verify all examples use localhost or documented fictitious hosts, synthetic data, placeholders, and no credentials, personal data, bank data, production endpoints, or closed infrastructure.
- [ ] 9.5 Confirm the final diff preserves unrelated user work, contains exactly four teacher scripts plus the planned six seminars, five homeworks, and scoped attachments, and leaves `course.yaml` and the publication plan unchanged. (С 2026-09-08 действует только лекционная часть; упоминания прежней практики исторические.)
- [ ] 9.6 Run strict OpenSpec validation and any available repository publisher validation without changing the approved PRB publication allowlist; record any intentionally inapplicable publication check.
