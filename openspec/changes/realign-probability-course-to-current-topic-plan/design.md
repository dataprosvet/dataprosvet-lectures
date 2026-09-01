## Context

See `proposal.md` for motivation. The repository currently has three lecture variants, one public-style seminar directory, teacher seminar scripts for only seminars 1-4 under `lectures-teacher/seminars/`, embedded homework sections, a dormant publication model, and a local ignored source corpus. The newest PDF changes topic boundaries substantially: the current lectures 1-2 merge, Bernoulli becomes lecture 3, discrete and continuous random variables merge in lecture 4, named distributions move to lecture 6, limit theorems move to lecture 7, and bivariate variables become optional lecture 8 without practice.

The migration must preserve 8 lecture meetings, 17 seminar meetings, seven formal IDZ packages, known normative defects, student/teacher separation, and the current publication state. Reusing source exercises requires both copyright-safe transformation and independent mathematical verification.

## Goals / Non-Goals

**Goals:**

- Give every lecture, seminar, and formal IDZ an independent capability and stable identity.
- Make the topic plan mechanically auditable across OpenSpec, filenames, headings, manifests, prerequisites, and cross-links.
- Provide 15-20 distinct problems per seminar with complete teacher solutions and controlled public solution visibility.
- Use the full source corpus deliberately, with a visible internal evidence trail and strong ML/data relevance.
- Preserve recoverability during the large content migration and prevent silent loss of existing examples, control tasks, assets, and teaching notes.

**Non-Goals:**

- Publishing any currently dormant material.
- Creating a seminar for optional lecture 8.
- Copying textbook prose or exercise collections wholesale.
- Solving the missing-graph defect in control work 3.5 without the missing source data.
- Requiring programming in every applied example; conceptual ML interpretation remains valid where code would distract from probability.

## Decisions

### 1. Use the new PDF only for the authority it actually supplies

During apply, copy the attachment byte-for-byte to `sources/лекции.pdf`. Record it as highest authority for lecture names, boundaries, order, and the optional status of lecture 8. Retain RPD/OMD authority for workload, outcomes, control works, seven IDZ packages, and assessment unless a direct conflict concerns topic placement.

Alternative: make the one-page PDF authoritative for every curriculum property. Rejected because it contains no workload, assessment, or assignment definitions.

### 2. Migrate content through a coverage matrix before rewriting

Build a matrix whose rows are current sections, examples, tasks, figures, IDZ elements, and control-work elements; columns are the new lecture/seminar/homework capabilities. Each row receives a destination, preservation status, source role, and verification owner. Only then rename or replace content files.

Alternative: rewrite directly from the new topic list. Rejected because it risks deleting valuable approved content and known-defect handling.

### 3. Use consistent audience-specific directories

- Lectures: retain `lectures-teacher/`, `lectures/`, and `lecture-notes/`.
- Семинары: использовать разрешённый publisher-контрактом каталог `lectures-teacher/seminars/` для полных сценариев и решений, а `seminars/` — для студенческих материалов. Существующие преподавательские сценарии мигрировать только после проверки сохранности.
- Формальные ИДЗ: использовать `lectures-teacher/homeworks/` для закрытых ключей и рубрик, а `homeworks/` — для студенческих заданий.

Every problem and homework item receives a stable local identifier such as `S10-P07` or `HW6-P03`. Teacher/public parity checks compare identifiers, statements, data, and ordering rather than relying only on headings.

Alternative: keep teacher solutions inline in public files behind comments or collapsed blocks. Rejected because the publisher could leak answers and hidden content is difficult to validate safely.

### 4. Define representative solutions explicitly

Each seminar designates a small, sufficient subset of problems as `typical`. A typical set covers each main method introduced in that seminar but does not reveal every variation or assessment target. The public version contains complete reasoning for those problems only. All other public problems end after the statement and requested output; they contain no answer, numeric check, formula-specific hint, or linked solution asset.

Teacher versions solve all 15-20 problems using a common structure: model and assumptions, method selection, derivation, calculations, final answer, interpretation, and likely errors. Approximation problems also state validity conditions and error character.

Alternative: publish short answers for all remaining problems. Rejected because the user explicitly requested statements only and short answers still leak assessment targets.

### 5. Balance the seminar problem bank by function, not by quota alone

Each 15-20 problem set combines foundational recognition, routine calculation, method choice, misconception diagnosis, applied interpretation, and one or more synthesis/challenge problems. Numeric variants do not count as distinct problems. At least several problems per suitable seminar use data/ML/business/reliability contexts, but artificial ML wrapping is avoided.

The main ML thread is progressive: sample spaces and class combinations; empirical probability and simulation; conditional probability and classification errors; Bayes and posterior updates; Bernoulli labels and rare events; random variables and loss; expectation and risk; distribution choice and noise; normal approximation; LLN/CLT and sampling behavior.

Alternative: require a fixed ML percentage in every seminar. Rejected because several mathematical topics are better served by a smaller number of authentic applications than many superficial ones.

### 6. Use a source-role matrix and internal evidence records

For each capability, record which sources supplied mandatory scope, primary mathematics, ML interpretation, exercise inspiration, and computational enrichment. Gmurman anchors core theory; the ML books anchor applied interpretation; methodological PDFs supply exercises and solution techniques; the Monte Carlo source supports simulation; RPD/OMD preserve assessment commitments. Public files omit local source paths, while change evidence retains enough provenance for review.

All adapted exercises are rewritten and independently solved. Direct quotations are avoided except for short necessary terminology. Figures are regenerated or independently created rather than copied unless rights and attribution permit reuse.

Alternative: cite books directly in every student problem. Rejected because local filenames and source scaffolding are teacher-maintenance concerns and may expose unpublished corpus details.

### 7. Preserve staged release and migrate identities explicitly

Create an old-to-new mapping for filenames, slugs, titles, assets, and cross-links. Lecture 1 remains the sole exposed lecture unless publication requirements separately change. New seminar and homework files are prepared but not declared publicly. Publisher validation must prove that teacher directories, solution keys, and `sources/` are absent from the output plan.

Alternative: publish completed materials automatically. Rejected because content readiness and release authorization are separate decisions.

## Risks / Trade-offs

- [Large rewrite loses approved material] -> Require the coverage matrix, pre/post inventories, and preservation checks before replacement.
- [Fifteen to twenty problems per seminar creates shallow repetition] -> Count only materially distinct problems and review the cognitive-role distribution.
- [Teacher and public statements drift] -> Use stable problem IDs and automated parity checks for statements and data.
- [Public files leak answers] -> Keep physical file separation and scan public text/assets for answers, result markers, and teacher-only links.
- [ML emphasis becomes decorative] -> Require each applied task to identify the probabilistic quantity, assumptions, and decision interpretation.
- [Source adaptation infringes copyright] -> Transform wording/context, avoid bulk reproduction, keep internal provenance, and independently verify solutions.
- [Optional lecture 8 causes hidden prerequisite gaps] -> Prohibit any required seminar, IDZ, or assessment dependency on lecture 8.
- [Normal distribution and limit theorems become disconnected after migration] -> Add explicit transitions from lecture/seminar 15 to 16 and require method-selection tasks.
- [Control-work 3.5 or IDZ 6.3 becomes silently “fixed”] -> Retain explicit defect checks in tasks and acceptance evidence.

## Migration Plan

1. Copy and hash the supplied PDF in `sources/`; update source hierarchy and curriculum decisions.
2. Inventory all current lecture, seminar, homework, control, asset, and publication content; build the old-to-new coverage and identity maps.
3. Establish target directories and filename/slug conventions without deleting source material.
4. Migrate lecture variants in topic order, validating each capability before proceeding.
5. Build teacher seminar banks and public projections in order, enforcing 15-20 distinct tasks and problem-ID parity.
6. Extract and rebuild IDZ 1-7 into student and teacher products with rubrics and defect handling.
7. Update manifests and cross-links while preserving dormant availability.
8. Run strict OpenSpec, mathematical, content-parity, answer-leak, Markdown, asset, and publisher-plan validation.
9. Keep the previous files recoverable until all preservation evidence passes; rollback by restoring the old identity map and manifest references if validation fails.

## Open Questions

- Exact filenames and slugs can be finalized from the migration map during apply, provided they remain stable within the new topic plan and every changed published identifier receives compatibility handling.
- The exact number of typical worked examples exposed publicly per seminar can vary by topic, provided the chosen set covers every main method and all non-typical tasks remain statement-only.
