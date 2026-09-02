## Purpose

Defines PRB-only practical work 3 for reproducible HTTP diagnostics of a local business API using safe synthetic fixtures and observable evidence.

## ADDED Requirements

### Requirement: Practical work 3 diagnoses a PRB HTTP API reproducibly
`seminars/003_http-api-diagnostics.md` SHALL be marked `PRB` and SHALL map only to practical work 3 of the PRB RPD. Students SHALL execute and document success and failure requests against a local or approved synthetic PRB API, recording command, expected status and headers, actual status and body, `request_id`, and explanation.

#### Scenario: Diagnostic report is reproduced
- **WHEN** the documented reset and request sequence is run in a clean local environment
- **THEN** the expected observations are repeatable and include malformed input, schema violation, missing resource, state conflict, and temporary dependency failure without contacting a production endpoint

### Requirement: Practical work 3 excludes SII diagnostics
The required service, fixtures, and acceptance criteria SHALL NOT introduce an SII or computer-vision alternative.

#### Scenario: Required cases are enumerated
- **WHEN** a reviewer lists all mandatory diagnostic cases
- **THEN** each belongs to the PRB business API and no SII case is normative

