## 1. Source preparation and shared structure

- [x] 1.1 Create `lectures-teacher/` and define the common teacher-script section skeleton in both target Markdown files without changing `course.yaml`.
- [x] 1.2 Build a working coverage matrix for lectures 1–2 from the PRB RPD, SII RPD, and both derived curriculum plans, separating `COMMON`, `PRB`, and `SII` claims.
- [x] 1.3 Map the relevant sections and pages of `API-tekhnologii-v-razrabotke-II-sistem.pdf` to the planned lecture blocks and label its 18 tasks as methodical rather than normative RPD work numbers.
- [x] 1.4 Map the relevant chapters or pages from the API-design, microservices, and ML-systems books to the planned lecture blocks and mark their explanatory role.

## 2. Lecture 1 authoring

- [x] 2.1 Draft the 0–90 minute plan, learning outcomes, prerequisites, and preparation notes for `001_api-interface-layer-and-lifecycle.md`.
- [x] 2.2 Write the `COMMON` explanation of API consumers and providers, consumer goals, explicit contracts, architectural boundaries, and the request pipeline from access checks and validation through computation, postprocessing, logging, metrics, and response.
- [x] 2.3 Add the `PRB` forecasting and ERP/CRM/BI lifecycle example, including the documented wording defect in the PRB RPD traceability note.
- [x] 2.4 Add the `SII` inference, feedback, monitoring, and model-update lifecycle example without importing PRB competencies.
- [x] 2.5 Add a comparison of synchronous single-request and asynchronous long-running or batch processing with explicit workload assumptions.
- [x] 2.6 Add the architecture demonstration, audience questions with answer guidance, typical errors, summary, related practical work, RPD coverage, and source map.

## 3. Lecture 2 authoring

- [x] 3.1 Draft the 0–90 minute plan, learning outcomes, prerequisites, and preparation notes for `002_http-rest-openapi-data-contracts.md`.
- [x] 3.2 Write the `COMMON` explanation of HTTP requests and responses, methods, status codes, safe and idempotent semantics, REST resources, JSON, XML, OpenAPI, validation before computation, and separate API, schema, and model versions.
- [x] 3.3 Create one coherent original contract walkthrough with matching HTTP request, successful response, uniform error response, OpenAPI fragment, JSON Schema constraints, `request_id`, `schema_version`, and `model_version`.
- [x] 3.4 Add the `PRB` CSV/Parquet and forecasting-contract material and the `SII` inference-contract material with a bounded bridge to binary formats and Protocol Buffers.
- [x] 3.5 Add structural and semantic compatibility examples, audience questions with answer guidance, typical errors, summary, related practical works, RPD coverage, and source map.

## 4. Verification and preservation review

- [x] 4.1 Verify each timed plan is continuous from 0 to 90 minutes and that every planned block has corresponding lecturer guidance.
- [x] 4.2 Read both scripts separately in `PRB` and `SII` modes and correct any unmarked or cross-profile normative claims.
- [x] 4.3 Validate fenced JSON and YAML syntax and manually reconcile paths, methods, fields, required constraints, responses, uniform errors, identifiers, versions, and terminology across the lecture 2 contract examples.
- [x] 4.4 Check that normative statements trace to the matching RPD, course-authored details are labeled, source passages are paraphrased, and all examples use synthetic safe data.
- [x] 4.5 Verify references to the university guide remain methodical and do not replace, renumber, or expand the 12 normative practical works of either RPD.
- [x] 4.6 Confirm only the two teacher Markdown files were added for implementation, `course.yaml` contains neither path, and no student lecture, note, seminar, homework, presentation, or executable project was introduced.
