## 1. Baseline and Review Evidence

- [x] 1.1 Capture hashes, word counts, heading inventories, manifest declarations, tracked/dormant status, and current publisher-plan output for all teacher, complete-student, concise-student, asset, and attachment paths.
- [x] 1.2 Create `review-report.md` in this change with a per-lecture preservation checklist, source map, current findings, resolved old findings, independent-calculation log, and the persistent RPD blockers for KР 3.5 and ИДЗ 6.3.
- [x] 1.3 Reconcile the active `migrate-probability-course-resources` change with this staged-release decision so its prior attachment-publication requirement cannot be mistaken for the current contract.

## 2. Lecture 1 Family

- [x] 2.1 Review and locally refactor the lecture 1 teacher script for oral readability, transitions, consistency, and precise source locators while recording preservation checks.
- [x] 2.2 Author `lectures/001_random-experiments-events-combinatorics.md` as a complete student lecture without teacher-only scaffolding.
- [x] 2.3 Add the missing joint/opposite/full-group/dependent/independent event classification to the lecture 1 concise note and verify its formulas, examples, summary, and student/teacher boundary.

## 3. Lecture 2 Family

- [x] 3.1 Review and locally refactor the lecture 2 teacher script without changing the RPD-required planned-error activity or mathematical scope.
- [x] 3.2 Author `lectures/002_event-probability-definitions.md` and quality-check it with the concise note against the RPD, Gmurman, applied sources, and independently recalculated examples.

## 4. Lecture 3 Family

- [x] 4.1 Review and locally refactor the lecture 3 teacher script while preserving conditional-probability, independence, tree, and assessment coverage.
- [x] 4.2 Author `lectures/003_probability-theorems.md` and quality-check it with the concise note, including pairwise-versus-joint independence and all worked probabilities.

## 5. Lecture 4 Family

- [x] 5.1 Review and locally refactor the lecture 4 teacher script while preserving the full-probability/Bayes progression and exact-versus-approximate method distinctions.
- [x] 5.2 Author `lectures/004_total-probability-bayes-repeated-trials.md` and quality-check it with the concise note, including Bernoulli, Poisson, both Laplace methods, conditions, and numerical answers.

## 6. Lecture 5 Family

- [x] 6.1 Review and locally refactor the lecture 5 teacher script while preserving the discrete-distribution progression, RPD case-data warning, and distribution-function translation.
- [x] 6.2 Author `lectures/005_discrete-random-variables-distributions.md` and quality-check it with the concise note, including the modern `F_X(x)=P(X\le x)` convention and the binomial/Poisson model boundary.

## 7. Lecture 6 Family

- [x] 7.1 Review and locally refactor the lecture 6 teacher script while preserving the complete joint/conditional-distribution example, covariance treatment, and ИДЗ 6.3 defect handling.
- [x] 7.2 Author `lectures/006_numerical-characteristics-joint-distribution.md` and quality-check it with the concise note, including marginal and conditional laws, covariance-aware variance, correlation limits, and recalculated examples.

## 8. Lecture 7 Family

- [x] 8.1 Review and locally refactor the lecture 7 teacher script while preserving density/function relationships, reliability interpretation, and the explicit external blocker for КР 3.5.
- [x] 8.2 Author `lectures/007_continuous-random-variables.md` and quality-check it with the concise note, including interval geometry, characteristics, uniform/exponential conditions, and the clearly labelled educational analogue.

## 9. Lecture 8 Family

- [x] 9.1 Review and locally refactor the lecture 8 teacher script while preserving normal-model conditions, the general Chebyshev theorem, LLN/CLT distinctions, and the introductory hypothesis-testing boundary.
- [x] 9.2 Author `lectures/008_normal-distribution-limit-theorems.md` and quality-check it with the concise note, including exact/bounded/approximate/asymptotic language and recalculated normal and p-value examples.

## 10. Cross-Course Quality Assurance

- [x] 10.1 Compare all eight three-variant lecture families for stable titles, sequence, notation, definitions, assumptions, transitions, examples, image references, and summaries; resolve every unexplained discrepancy.
- [x] 10.2 Scan complete lectures and concise notes for teacher-only timings, prompts, facilitation, coverage matrices, source maps, and generator code, and remove any leakage without removing student-facing warnings.
- [x] 10.3 Run independent calculation checks for every edited or transferred worked result and record the commands/results in `review-report.md` without relying on program output as the mathematical explanation.
- [x] 10.4 Validate all Markdown, formulas, internal links, supported images, file sizes, encodings, and publisher-safe syntax across published and dormant student files.

## 11. Audit and Durable Context

- [x] 11.1 Move the ignored `sources/AUDIT_LECTURES_1_8.md` to `sources/archive/AUDIT_LECTURES_1_8.superseded.md` and add a superseded notice that points to this change's `review-report.md`.
- [x] 11.2 Update durable OpenSpec context and source-policy references so the archived audit is historical, the current review evidence is active, and the expected local source inventory remains discoverable.

## 12. Staged Publication Configuration

- [x] 12.1 Update `course.yaml` so lecture one is published/available with both `markdown` and `briefMarkdown`, lectures two through eight remain unavailable or `inDevelopment` without public text declarations, and titles/slugs/order remain stable.
- [x] 12.2 Keep `attachments/lecture_1.pptx` tracked but undeclared and prove that no attachment, teacher script, source, audit, OpenSpec file, or later lecture enters the publication plan.
- [x] 12.3 Generate the deterministic plan and compare its public resources with the explicit allowlist for the course and lecture one; resolve every missing or additional item.

## 13. Pre-Release Acceptance

- [x] 13.1 Run strict OpenSpec validation, repository/publisher validation, secret scanning, dormant-resource diagnostics, and Git diff checks with zero failures.
- [x] 13.2 Review the final teacher-script diffs against the captured baselines and confirm that every structural or substantive change is intentional and source-grounded.
- [x] 13.3 Complete the lecture-family acceptance matrix in `review-report.md` and do not proceed while any content, source, rendering, or staged-scope check remains unresolved except the explicitly documented external RPD graph blocker.

## 14. Repository Publication

- [x] 14.1 Confirm the exact file scope and cleanly commit the accepted change on the course branch without unrelated user files or ignored sources.
- [x] 14.2 Push through the normal reviewed repository workflow and wait for validation and production publication for the exact commit to complete successfully.

## 15. Primary-Site Verification

- [x] 15.1 Open the primary site after deployment and verify the probability-theory course and lecture-one metadata are visible for the intended audience.
- [x] 15.2 Verify lecture one opens both the complete lecture and concise note with correct headings, formulas, links, and images, and verify that no presentation action is exposed.
- [x] 15.3 Verify lectures two through eight are not publicly available and no teacher, source, audit, OpenSpec, dormant, or attachment resource can be reached through the course UI.
- [x] 15.4 Create `publication-verification.md` with the deployed commit, workflow result, checked pages, positive and negative checks, screenshots or equivalent evidence, and final acceptance or rollback/corrective action.
