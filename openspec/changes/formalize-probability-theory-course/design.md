## Context

The course branch publishes eight Markdown files from `lectures/`; those files are currently full teacher scripts ranging from roughly 2,200 to 6,000 words and include timing, teaching prompts, exercises, audit matrices, source maps, and generator code. `course.yaml` already provides stable public identities. The local `sources/` corpus contains the RPD, Gmurman, machine-learning books, methodological works, a course plan, a revision plan, and an audit. `openspec/` and `sources/` are currently ignored. The coordinated root change defines the generic publisher contract needed to track course OpenSpec and teacher-only files safely.

## Goals / Non-Goals

**Goals:**

- Preserve complete teacher scripts without content loss.
- Produce eight concise, mathematically useful student notes at stable public paths.
- Make the course purpose, curriculum, sources, known defects, and content rules durable in OpenSpec.
- Ensure future agents actively use Gmurman for mathematical substance and the machine-learning books for relevant applied enrichment.

**Non-Goals:**

- Rewrite the teacher scripts again or remove their methodological apparatus.
- Publish ignored source documents or teacher scripts.
- Publish files under `attachments/` in this change.
- Change public lecture slugs, ordering, Appwrite schemas, or Flutter behavior.
- Force every student note to an exact word count when mathematical completeness requires a different length.

## Decisions

### Preserve originals by moving them before authoring summaries

The eight current files will be moved to `lectures-teacher/` with identical basenames before replacement files are created under `lectures/`. This makes preservation auditable and keeps relative `../assets/...` references valid in both directories. Existing repository content, including the corrected lecture 1 formulas, is the source of truth for the move.

Copying selected paragraphs into a new teacher archive was rejected because it risks losing user edits and methodological detail.

### Use a common student-note information architecture

Each note will use a compact structure adapted to its topics:

1. what the lecture explains;
2. principal definitions;
3. formulas and conditions;
4. key consequences, relationships, or one compact explanatory example where useful;
5. topic summaries.

The expected working range is approximately 1,000-1,800 words per lecture, but acceptance is based on required content rather than a hard word limit. Longer treatment is allowed for lectures with several formula families, especially lectures 3, 4, 6, and 8.

### Derive notes from the approved teacher script and source hierarchy

The teacher script supplies the already audited course narrative. The RPD is checked for mandatory scope. Gmurman is consulted first for mathematical definitions, theorems, formulas, and derivations. *Mathematics for Machine Learning* and *Deep Learning: Immersion into the World of Neural Networks* are consulted for relevant examples, interpretation, and extensions rather than treated as optional decoration. Remaining sources provide targeted exercises and computational enrichment.

Where the source hierarchy exposes a conflict or missing datum, the documented limitation is retained rather than resolved by invention.

### Version the entire meaningful OpenSpec tree

The broad `openspec/` entry will be removed from `.gitignore`; `sources/` remains ignored. Durable config, specs, proposals, designs, and tasks will be tracked. `.DS_Store` and comparable transient files will remain ignored. Publisher acceptance depends on the coordinated external baseline classifying `openspec/` as support-only.

### Keep attachments reserved

The existing `attachments/lecture_1.pptx` stays outside `course.yaml` and the publication plan. Its future public use will be designed separately with manifest and client support.

### Validate content and publication separately

Content review will compare each note against curriculum requirements, its teacher source, source-policy exceptions, and shared notation. Repository validation will independently verify manifest identity, Markdown safety, tracked paths, asset references, and exclusion of support-only directories.

## Risks / Trade-offs

- [Summaries become too terse] → Use a per-lecture coverage checklist and require applicability conditions and conclusions, not only formula lists.
- [Summaries reproduce teacher scaffolding] → Review excluded-section patterns and inspect headings and prose for lecturer-directed language.
- [Applied examples distort core theory] → Require a direct link to the current probability concept and retain Gmurman as mathematical priority.
- [Moving files loses an existing edit] → Compare file hashes or diffs immediately after the move before writing replacements.
- [Tracked OpenSpec causes current CI failure] → Apply the coordinated external baseline first and verify support-only exclusion with tests.
- [LFS pointers prevent image validation] → Require the root infrastructure change to materialize LFS data before course acceptance.

## Migration Plan

1. Complete and validate the root `define-external-course-repository-contract` planning and baseline implementation.
2. Synchronize the course branch with the accepted external baseline, restoring protected `course.yaml.example` and LFS-capable workflow behavior.
3. Remove only the broad `openspec/` ignore rule, retain `sources/`, and add transient-file ignores.
4. Fill course OpenSpec context and archive the three course capabilities after review.
5. Move all eight current lecture files to `lectures-teacher/` and verify preservation.
6. Create and review the eight student notes sequentially against per-lecture coverage checklists.
7. Run OpenSpec strict validation, publisher tests, course validation with materialized LFS assets, and targeted checks proving support-only files are absent from the publication plan.

Rollback restores the original eight files from `lectures-teacher/` to `lectures/` and reverts the manifest-compatible student-note commit. Because public identities do not change, rollback requires no Appwrite schema migration.
