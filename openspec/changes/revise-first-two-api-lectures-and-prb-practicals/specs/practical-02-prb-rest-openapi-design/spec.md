## Purpose

Defines PRB-only practical work 2 for designing a forecast-service REST resource model and a coherent OpenAPI contract.

## ADDED Requirements

### Requirement: Practical work 2 produces a PRB forecast API contract
`seminars/002_rest-openapi-contract.md` SHALL be marked `PRB` and SHALL map only to practical work 2 of the PRB RPD. The required artifact SHALL describe a forecast-service resource model and an OpenAPI 3.1 contract for data registration or upload, forecast job creation, status, result, and history, including parameters, schemas, constraints, examples, success responses, uniform errors, `request_id`, `schema_version`, and `model_version`.

#### Scenario: Contract is validated
- **WHEN** the student artifact is checked
- **THEN** it parses, passes the selected OpenAPI validation, contains the required operations, and keeps paths, methods, schemas, examples, and status semantics internally consistent

### Requirement: Practical work 2 excludes the SII contract variant
The material SHALL NOT offer image-inference routes, SII competencies, or the SII RPD as an alternative normative submission.

#### Scenario: Assignment scope is reviewed
- **WHEN** all profile labels and required routes are inspected
- **THEN** only the PRB forecast-service outcome is required

