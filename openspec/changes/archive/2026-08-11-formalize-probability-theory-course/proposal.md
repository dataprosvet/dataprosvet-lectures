## Why

The probability-theory course has complete teacher-oriented lecture scripts and a local source corpus, but it lacks a durable course specification and concise student-facing notes. Formalizing the curriculum, source hierarchy, and lecture formats will let future work remain grounded in the approved program and sources while publishing only material intended for students.

## What Changes

- Version the course-local OpenSpec configuration and specifications instead of ignoring `openspec/`, while keeping all OpenSpec files outside the publisher input set.
- Capture the course purpose, audience, workload, learning outcomes, eight-lecture sequence, and known source defects from the course plan and audit.
- Define the source hierarchy precisely: the 2026 RPD controls required scope, sequence, outcomes, and assessment; Gmurman is the primary substantive source for definitions, theorems, formulas, derivations, and core examples; *Mathematics for Machine Learning* and *Deep Learning: Immersion into the World of Neural Networks* supplement the course with applications, examples, interpretation, and material beyond Gmurman; the remaining methodological sources provide targeted exercises and enrichment.
- Move the eight current full lecture scripts to `lectures-teacher/` without losing existing user edits, images, formulas, methodological notes, or audit corrections.
- Replace the eight files in `lectures/` with concise student notes containing the principal definitions, formulas with applicability conditions, conclusions, and topic summaries.
- Exclude teacher timing tables, delivery prompts, planned-error scripts, instructor recommendations, coverage matrices, source-usage maps, and reproducible generator code from student notes.
- Preserve filenames, slugs, ordering, `course.yaml` references, and valid image references for the public notes.
- Keep `sources/` ignored and unpublished while documenting the expected source inventory and its authority in OpenSpec.
- Coordinate acceptance with the root `define-external-course-repository-contract` change so `lectures-teacher/`, `attachments/`, `.gitattributes`, and versioned `openspec/` are accepted but not published.

## Capabilities

### New Capabilities

- `probability-theory-curriculum`: Defines the course purpose, audience, workload, learning outcomes, lecture sequence, and curriculum coverage.
- `probability-theory-source-policy`: Defines source authority, priority, expected uses, and handling of known defects or conflicts.
- `probability-theory-lecture-materials`: Defines the separate teacher and student lecture products, their repository locations, content rules, and acceptance criteria.

### Modified Capabilities

None.

## Impact

- Course-local `openspec/config.yaml`, durable course specifications, and Git ignore rules.
- Eight existing lecture Markdown files, a new tracked `lectures-teacher/` directory, and eight replacement student notes under `lectures/`.
- Existing course manifest paths and public lecture identities remain stable.
- The external publisher baseline must accept tracked course OpenSpec and teacher-only files before the course branch can validate.
- No publication of `sources/` or supplementary `attachments/`, and no Flutter or Appwrite schema change in this course change.
