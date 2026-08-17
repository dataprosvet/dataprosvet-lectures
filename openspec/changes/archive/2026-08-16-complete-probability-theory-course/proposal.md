## Why

The course currently has all eight lecture families but no seminar or homework content, and the existing student lecture variants contain terminology and notation inconsistencies with the teacher scripts. The course needs a source-grounded completion pass now so that every required RPD activity exists, all variants agree, and only the intended first materials are available for review.

## What Changes

- Author all 17 two-hour seminars in the RPD sequence, using the RPD for mandatory scope and approved books for explanations and non-assessed enrichment.
- Author the seven individual assignments and three control works under `homeworks/`, preserving the RPD task banks as the sole source of assessed tasks.
- Incorporate the three RPD cases, the required four hours of practical preparation, and the mandatory independent-study topics into the seminar sequence.
- Re-audit every teacher lecture, complete student lecture, and concise lecture note; treat the teacher scripts as the semantic reference while standardizing experiment outcomes to Russian labels and the primary numerical-characteristic notation to `E[X]`, `Var(X)`, and `σ(X)`.
- Normalize every lecture and seminar to specification-defined templates so that required navigation, prerequisites, theory, practice, checks, and summaries appear in stable locations.
- Add relative local Markdown links from each student lecture to its related seminars and reciprocal links from seminars to prerequisite lectures, enabling in-site navigation without remote URLs.
- Create a current, versioned audit file that records every identified RPD defect, its impact, and the permitted handling without silently repairing or inventing normative data. Known affected items include control work 1.1, control work 3.5, individual assignment 6.3, the case-2 probability/table conflict, the suspicious wording of individual assignment 4.1, the course-code and lecture-numbering conflicts, and source-notation translations.
- Extract runnable Python code from every lecture and seminar that contains Python into stable `.py` files under `attachments/`; verify that the files reproduce the documented computations or generated assets.
- Extend `course.yaml` with stable metadata for all seminars and homework materials. Only lecture 1, seminar 1, and individual assignment 1 expose their Markdown; all later materials remain `inDevelopment` without public content or attachment declarations.
- Allow the Python attachment for an available material to be downloadable while keeping later Python files and `attachments/lecture_1.pptx` dormant.
- Validate source coverage, mathematical calculations, Markdown, attachments, and the deterministic publication plan without committing, pushing, or deploying the implementation.

Non-goals:

- Do not replace or extend official individual-assignment or control-work banks with tasks from Gmurman or other books.
- Do not invent missing graphs, assumptions, numerical data, or official answers for defective RPD tasks.
- Do not unlock lectures 2–8, seminars 2–17, individual assignments 2–7, or any control work.
- Do not publish the teacher scripts, local source corpus, audit evidence, OpenSpec artifacts, or the lecture-one presentation.
- Do not commit, push, or deploy the completed course as part of this change.

## Capabilities

### New Capabilities

- `probability-theory-seminar-materials`: Defines the complete 17-seminar sequence, its required template, lecture prerequisites and links, source roles, cases, practical preparation, and student-facing seminar quality.
- `probability-theory-assessment-materials`: Defines faithful RPD-only individual assignments and control works, their identities, ordering, defect annotations, and availability.
- `probability-theory-code-attachments`: Defines extraction, verification, stable naming, and staged exposure of runnable Python attachments for lectures and seminars.

### Modified Capabilities

- `probability-theory-lecture-materials`: Requires a new cross-variant audit, stable lecture templates, local links to related seminars, and consistent Russian experiment labels plus primary `E[X]`, `Var(X)`, `σ(X)` notation.
- `probability-theory-publication-release`: Expands the staged review scope to expose seminar 1 and individual assignment 1, plus eligible Python attachments, while keeping all later materials locked.
- `probability-theory-source-policy`: Makes a current versioned RPD-defect audit mandatory and defines how defects and notation conflicts are recorded and handled.

## Impact

- Content: `lectures/`, `lecture-notes/`, `lectures-teacher/`, new `seminars/` and `homeworks/` Markdown, and new audit evidence under the change record.
- Attachments: new `.py` files under `attachments/`; the existing PPTX remains dormant.
- Manifest: `course.yaml` gains all seminar and homework metadata plus only the declarations permitted by the staged availability policy.
- Validation: OpenSpec strict validation and the existing publisher test/validation workflow must pass with an allowlist containing only the intended available materials and attachments.
- Sources: the ignored `sources/` corpus is read during authoring but remains untracked and unpublished.
