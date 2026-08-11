## 1. External Publisher Baseline Prerequisite

- [x] 1.1 Prepare the generic `dataprosvet-lectures` baseline update in its protected default-branch workflow, using the root `external-course-repository` specification as the behavioral contract.
- [x] 1.2 Extend validator classification and tests so `.gitattributes`, `lectures-teacher/`, `attachments/`, and `openspec/` are tracked support-only paths, while unknown tracked root paths still fail.
- [x] 1.3 Add tests proving support-only files never enter publication inputs or the computed publication plan and that `attachments/` remains unpublished.
- [x] 1.4 Enable Git LFS materialization for validation and deployment checkouts and add deterministic failure coverage for unresolved required LFS inputs.
- [x] 1.5 Update baseline documentation, preserve `course.yaml.example`, complete the baseline review, and synchronize the accepted baseline into `courses/probability-theory` before continuing.

## 2. Versioned Course Specification

- [x] 2.1 Remove the broad `openspec/` rule from `.gitignore`, retain `sources/`, and ignore `.DS_Store` and other transient OpenSpec artifacts without hiding durable planning files.
- [x] 2.2 Fill `openspec/config.yaml` with the course audience, purpose, workload, lecture sequence, notation conventions, source hierarchy, expected source inventory, and known RPD defects.
- [x] 2.3 Preserve and validate the `probability-theory-curriculum`, `probability-theory-source-policy`, and `probability-theory-lecture-materials` specifications as durable course requirements.
- [x] 2.4 Run strict OpenSpec validation and verify the course specification is visible to Git while remaining absent from the publisher plan.

## 3. Preserve Teacher Lecture Scripts

- [x] 3.1 Record the current eight lecture filenames and checksums or equivalent diffs before moving them.
- [x] 3.2 Move all eight current lecture files from `lectures/` to `lectures-teacher/` with identical basenames.
- [x] 3.3 Verify every teacher file preserves existing corrections, formulas, images, instructor guidance, timing, worked examples, audit matrices, source maps, and computational appendices.
- [x] 3.4 Verify no `course.yaml` entry points to `lectures-teacher/` and publisher planning excludes the directory.

## 4. Student Notes for Lectures 1-4

- [x] 4.1 Create lecture 1 student notes covering experiments, outcomes, events, event operations, counting rules, factorials, permutations, arrangements, combinations, applicability conditions, and a topic summary.
- [x] 4.2 Create lecture 2 student notes covering axiomatic, classical, frequency/statistical, and geometric probability, their assumptions and limitations, and a topic summary.
- [x] 4.3 Create lecture 3 student notes covering addition and multiplication theorems, conditional probability, probability trees, independence, at-least-one events, applicability conditions, and a topic summary.
- [x] 4.4 Create lecture 4 student notes covering total probability, Bayes, Bernoulli trials, the most probable success count, Poisson approximation, local and integral Laplace approximations, method selection, and a topic summary.
- [x] 4.5 Review lectures 1-4 against the RPD, Gmurman, the teacher scripts, and relevant examples or interpretations from the two machine-learning books.

## 5. Student Notes for Lectures 5-8

- [x] 5.1 Create lecture 5 student notes covering random variables, discrete distributions, probability mass tables and polygons, distribution functions, binomial and Poisson laws, and a topic summary.
- [x] 5.2 Create lecture 6 student notes covering expectation, variance, standard deviation, linear transformations, joint and marginal distributions, independence, covariance, correlation, conditions, and a topic summary.
- [x] 5.3 Create lecture 7 student notes covering continuous variables, density, distribution function, interval probability, numerical characteristics, uniform and exponential laws, and a topic summary.
- [x] 5.4 Create lecture 8 student notes covering normal and standard normal laws, standardization, Chebyshev's inequality, general and special law-of-large-numbers forms, the Bernoulli law, the central limit theorem, basic hypothesis terminology, and a course summary.
- [x] 5.5 Review lectures 5-8 against the RPD, Gmurman, the teacher scripts, the documented source defects, and relevant examples or interpretations from the two machine-learning books.

## 6. Cross-Lecture Editorial Quality

- [x] 6.1 Remove timing tables, instructor-directed prompts, planned-error facilitation, teaching recommendations, coverage matrices, source maps, and image-generator code from every public note.
- [x] 6.2 Verify every public note contains principal definitions, formulas with symbols and applicability conditions, key conclusions, and concise topic summaries rather than only a formula list.
- [x] 6.3 Verify consistent notation for events, `F(x)=P(X\le x)`, expectation, variance, standard deviation, normal parameters, and probability approximations across all eight notes.
- [x] 6.4 Verify the narrative progression and required cross-lecture connections from events through distributions, characteristics, continuous models, and limit theorems.
- [x] 6.5 Confirm machine-learning and deep-learning enrichment is mathematically relevant, clearly connected to the current probability concept, and does not displace required content.

## 7. Publication and Final Acceptance

- [x] 7.1 Verify `course.yaml` retains all eight existing slugs, titles, sort orders, and `lectures/<filename>` paths.
- [x] 7.2 Verify every retained asset reference resolves with materialized LFS data and every tracked asset is used by a published note.
- [x] 7.3 Run publisher lint, tests, and course validation on the complete reorganized tree.
- [x] 7.4 Inspect the computed publication plan and prove it contains student notes and declared assets but no files from `lectures-teacher/`, `attachments/`, `openspec/`, or `sources/`.
- [x] 7.5 Run strict OpenSpec validation, review the final diff for preserved teacher files and concise public notes, and record any remaining source limitation without inventing missing data.
