## Purpose

Defines reproducible Python companion files for lecture and seminar code, including verification and staged download behavior that cannot accidentally unlock later course material.

## ADDED Requirements

### Requirement: Embedded Python has a matching attachment
Every lecture or seminar that contains a Python code block SHALL have a corresponding tracked `.py` file under `attachments/`. A material with multiple related blocks MAY use one ordered companion file when it preserves all executable logic and documented outputs.

#### Scenario: Code-bearing materials are scanned
- **WHEN** Python fences in lectures and seminars are enumerated
- **THEN** each code-bearing material maps to exactly one documented companion file containing all required executable logic

### Requirement: Python companions are runnable and reproducible
Each companion file SHALL run in the approved workspace environment without depending on unpublished source PDFs or user-specific absolute paths. Fixed inputs, random seeds, output locations, and generated-artifact behavior SHALL be explicit enough to reproduce the calculations or figures described in the material.

#### Scenario: Companion verification is run
- **WHEN** every `.py` attachment is syntax-checked and executed in a clean temporary output directory
- **THEN** it exits successfully and its checked numerical results or generated artifacts agree with the associated material

### Requirement: Attachment identity and titles remain stable
Lecture companion files SHALL use stable lecture-number identities and seminar companion files SHALL use stable seminar-number identities. Manifest attachment keys and Russian-facing titles SHALL remain unique within each material.

#### Scenario: Attachment metadata is validated
- **WHEN** the manifest is checked against tracked attachment files
- **THEN** every declared key, file, title, and sort order resolves uniquely and follows the material identity

### Requirement: Attachment exposure follows material availability
Only Python companions belonging to currently available materials MAY be declared for download. Python files for locked materials SHALL remain dormant, and `attachments/lecture_1.pptx` SHALL remain undeclared.

#### Scenario: Publication plan is inspected
- **WHEN** the staged manifest is validated
- **THEN** no Python file for a locked lecture, seminar, or homework and no lecture-one presentation appears in the plan

