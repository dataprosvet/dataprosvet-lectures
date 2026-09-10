## Purpose

Defines faithful, reviewable student materials for every RPD individual assignment and control work while preventing external exercises or silent source repairs from becoming official assessment.

## ADDED Requirements

### Requirement: Every RPD assessment has a stable homework material
The course SHALL provide ten files under `homeworks/`: individual assignments 1–7 and control works 1–3. Their manifest order SHALL follow delivery chronology: IDZ 1, IDZ 2, control work 1, IDZ 3, IDZ 4, IDZ 5, control work 2, IDZ 6, IDZ 7, control work 3.

#### Scenario: Homework inventory is inspected
- **WHEN** files and manifest entries are compared with RPD table 4 and pages 15–19
- **THEN** every required individual assignment and control work appears exactly once with a stable identity and no unapproved assessment type

### Requirement: Assessed task content comes only from the RPD
Official task statements, numerical data, subparts, and assessed skills SHALL be derived solely from the normative RPD. Tasks from Gmurman, methodological books, or generated variants MUST NOT be inserted into an individual assignment or control-work bank as assessed content.

#### Scenario: Assessment provenance is checked
- **WHEN** an assessment task is traced to its source
- **THEN** its official statement maps to the corresponding RPD task and any explanatory text is clearly separate from the assessed statement

### Requirement: Source defects remain visible and non-fabricated
An assessment affected by an RPD omission, contradiction, or suspicious wording SHALL preserve the normative statement, link or refer to the current source audit, and state only the approved limitation, clarification request, general formula, or conditional educational treatment. Missing data and assumptions MUST NOT be invented.

#### Scenario: Defective task is opened
- **WHEN** a student or reviewer opens control work 1.1, control work 3.5, individual assignment 6.3, or another audited defective item
- **THEN** the original issue is visible and the material does not present a fabricated official answer as normative

### Requirement: Assessment materials support review without leaking solutions inappropriately
Each individual-assignment file SHALL include the official task set, submission expectations, and grading context from the RPD, plus source-safe hints only where they do not replace the required work. Each control-work file SHALL identify its official bank and administration context; any instructor-only answer key or audit calculation SHALL remain outside the public student body.

#### Scenario: Public assessment material is reviewed
- **WHEN** a declared homework Markdown file is inspected
- **THEN** it is usable for assignment or administration and does not expose teacher-only solution scaffolding as student-facing task content

### Requirement: Only individual assignment 1 is available initially
Individual assignment 1 SHALL be `available` and declare its Markdown. Individual assignments 2–7 and all control works SHALL remain `inDevelopment` without public Markdown or attachment declarations, while their complete files remain dormant and reviewable in the repository.

#### Scenario: Homework release state is inspected
- **WHEN** the manifest and publication plan are generated
- **THEN** only individual assignment 1 exposes a student action and every other assessment remains locked

