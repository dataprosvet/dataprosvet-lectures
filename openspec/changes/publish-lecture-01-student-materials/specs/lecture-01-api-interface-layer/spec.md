## ADDED Requirements

### Requirement: Lecture 1 provides a complete student-facing lecture
The course SHALL provide `lectures/001_api-tech-introduction.md` as the complete Russian-language student lecture for lecture 1. It SHALL identify scope `COMMON`, state its purpose and prerequisites, explain the progression from one-, two-, and three-tier architectures to explicit API contracts, provide a bounded comparison of CORBA, SOAP/WSDL, REST, and gRPC, connect API infrastructure to ML-system components and model lifecycle, include applicability conditions and warnings against categorical architecture claims, summarize the material, provide self-check questions, and link related PRB practical work without implying an SII practical track.

#### Scenario: Student reads the complete lecture independently
- **WHEN** a student opens the declared lecture Markdown without the presentation or teacher script
- **THEN** the document provides a coherent path from architectural separation through API contracts to ML-system deployment and lifecycle, with enough explanation, examples, trade-offs, summary, and self-check to stand alone

#### Scenario: Profile scope is reviewed
- **WHEN** lecture claims and examples are checked for `COMMON`, `PRB`, and `SII` meaning
- **THEN** the shared path is valid for both profiles, any profile-specific example is visibly labeled, and the PRB-only related practical is not presented as an SII requirement

### Requirement: Lecture 1 provides a distinct concise revision note
The course SHALL provide `lecture-notes/001_api-tech-introduction.md` as a concise Russian-language revision aid rather than a replacement or section-by-section duplicate of the complete lecture. It SHALL state the lecture purpose; define API, API contract, 1-Tier, 2-Tier, 3-Tier, CORBA, SOAP, WSDL, REST, gRPC, API inference, feature store, model registry, drift, DataOps, ModelOps, and the model lifecycle; summarize the central architecture and inference-request patterns with applicability conditions; include a compact comparison table, warnings, a final checklist, and the related PRB seminar link; and contain no more than half the word count of the complete lecture.

#### Scenario: Student revises the lecture quickly
- **WHEN** a student opens only the concise note before a self-check or seminar
- **THEN** the student can recover the essential vocabulary, architectural distinctions, ML-system flow, lifecycle stages, and selection caveats without reading teacher-only guidance

#### Scenario: Complete and concise products are compared
- **WHEN** the two Markdown files are compared structurally and by word count
- **THEN** the concise note is no more than 50 percent as long, organizes information for recall rather than replaying the full narrative, and does not omit any required definition or warning

### Requirement: Presentation-derived coverage respects the course sequence and source priority
The student lecture and concise note SHALL use `attachments/lecture_1.pdf` as their immediate presentation basis while applying the repository source hierarchy and the approved nine-lecture sequence when a slide claim is simplified, categorical, or overlaps a later lecture. Lecture 1 SHALL present REST, gRPC, detailed ML operations, and RAISA only as orientation needed to explain API's architectural role; it SHALL NOT claim to replace detailed HTTP/REST/OpenAPI coverage in lecture 2, integration-style selection in lecture 3, or profile architecture synthesis in lecture 9. All text SHALL be original paraphrase and SHALL NOT reproduce protected passages or third-party figures.

#### Scenario: Presentation and student texts are reconciled
- **WHEN** every slide topic is mapped to the complete lecture and concise note
- **THEN** each retained topic is represented at the appropriate depth, categorical scale or performance claims are qualified, and later-lecture subjects are explicitly bounded as orientation

#### Scenario: A source or sequence conflict is found
- **WHEN** a presentation statement conflicts with the matching RPD, course sequence, or a higher-priority verified source
- **THEN** the student material follows the higher-priority source, records the presentation as supporting context, and does not silently promote the slide claim to normative course authority

### Requirement: Both student texts are declared through the existing lecture entry
The existing `api-tech-introduction` lecture entry in `course.yaml` SHALL declare `markdown: lectures/001_api-tech-introduction.md` and `briefMarkdown: lecture-notes/001_api-tech-introduction.md` while preserving its slug, title, summary, lifecycle status, availability, sort order, and `attachments/lecture_1.pdf` declaration. Both paths and filenames SHALL satisfy the publisher contract and all referenced local files SHALL resolve.

#### Scenario: Publication plan is built
- **WHEN** strict publisher validation processes `course.yaml`
- **THEN** the complete lecture, concise note, and existing presentation are included under one lecture-1 record with no duplicate slug, missing file, filename mismatch, or dormant student document

#### Scenario: Unresolved profile publication model is checked
- **WHEN** the declared materials are reviewed before publication
- **THEN** only the shared `COMMON` learning path is mandatory for both cohorts and no profile-specific content is published as a requirement of the other profile
