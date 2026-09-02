## Purpose

Defines the dual-profile teacher script and instructor presentation for lecture 2 as a teachable, standards-grounded unit about HTTP, REST, representations, validation, OpenAPI, and contract evolution.

## ADDED Requirements

### Requirement: Lecture 2 has a bounded 90-minute core and explicit optional depth
Lecture 2 SHALL provide a continuous 0–90 minute core in `lectures-teacher/002_http-rest-openapi-data-contracts.md` covering HTTP request and response anatomy, method and status semantics, safety and idempotency, resources and representations, essential REST constraints, validation, OpenAPI, uniform errors, and compatibility. Detailed format comparisons, extended caching cases, additional CRUD edge cases, and research context MAY remain only when visibly marked as optional, reference, or post-lecture material that is not required to complete the timed core.

#### Scenario: Lecturer follows only the core
- **WHEN** the lecturer skips all optional and reference blocks
- **THEN** the remaining ordered sections still fill a coherent 90-minute session and complete the central contract walkthrough

### Requirement: HTTP, data, and OpenAPI representations agree
The lecture SHALL use one coherent `COMMON` contract walkthrough whose raw HTTP messages, examples, error envelope, data schemas, and OpenAPI operation agree on path, method, parameters, required fields, status codes, headers, versions, and identifiers. Invalid structural or domain input SHALL be rejected before the business operation or inference, while transport and application semantics remain distinguishable.

#### Scenario: Contract consistency is checked
- **WHEN** the successful request, successful response, invalid request, error response, and OpenAPI operation are compared
- **THEN** every externally observable field and status has the same meaning across all representations

### Requirement: Standards and source versions are stable and auditable
The lecture SHALL trace both profile requirements to their matching RPDs, SHALL pin OpenAPI instruction to an explicit 3.1 patch version rather than a moving `latest` target, and SHALL use current official HTTP semantics for method, status, caching, and conditional-request claims. The source map SHALL record the corrected DOI `10.1016/j.jss.2024.112110` for *Microservice API Evolution in Practice* while explicitly noting that the RPD contains `10.1016/j.jss.2024.112081`.

#### Scenario: External references are rechecked
- **WHEN** a reviewer follows the OpenAPI, HTTP, JSON Schema, or article reference
- **THEN** the target is stable, identifies the taught version or publication, and any divergence from the RPD bibliography is documented rather than silently rewritten as normative text

### Requirement: Lecture 2 keeps both lecture profiles separate
The common path SHALL be compatible with both RPDs. `PRB` SHALL use business forecasting and JSON/CSV/Parquet choices where relevant; `SII` SHALL use inference input and textual, binary, or referenced payload choices where relevant. Neither example SHALL impose the other profile's competency, language, or tool requirement.

#### Scenario: Profile example is selected
- **WHEN** the lecturer presents lecture 2 to one cohort
- **THEN** the core remains shared and the selected example is governed by the matching RPD without implying that the practical work is dual-profile

### Requirement: Lecture 2 presentation is source-attributed and classroom-readable
`attachments/002_http-rest-openapi-data-contracts.pptx` SHALL present the 90-minute core as a cumulative visual narrative, with optional detail moved to notes or appendix slides. It SHALL use Russian audience-facing copy, explicit profile labels, concise claim titles, readable HTTP and OpenAPI excerpts, and `[Sources]` records in speaker notes for externally sourced claims and visuals.

#### Scenario: Presentation passes final QA
- **WHEN** the final deck is rendered slide by slide, inspected, and checked structurally
- **THEN** all code and protocol text is legible, no element clips or overlaps unintentionally, profile meaning is not color-only, notes survive export, and every non-original asset is traceable

