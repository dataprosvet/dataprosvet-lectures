# Probability Theory Source Policy Specification

## Purpose

Defines how normative, textbook, machine-learning, and methodological sources govern the accuracy, scope, examples, and enrichment of probability-theory materials.

## Requirements

### Requirement: Source authority is explicit and role-based
The supplied 2026-08-31 topic-plan PDF SHALL govern lecture boundaries, ordering, and the optional status of lecture 8 as the newest source for those decisions. The RPD and OMD SHALL continue to govern workload, learning outcomes, formal individual assignments, control works, cases, and assessment except where the newer topic plan explicitly changes topic placement. V. E. Gmurman's textbook SHALL remain the primary substantive source for definitions, theorems, formulas, derivations, notation comparisons, and core examples. The machine-learning books SHALL be actively used for applied interpretation and relevant ML/data examples. Other books and methodological sources MAY provide exercises, computation, simulation, and enrichment but MUST NOT silently override higher-priority sources.

#### Scenario: A lecture topic is written or revised
- **WHEN** a maintainer develops definitions, formulas, explanations, derivations, or examples for a lecture
- **THEN** the topic boundary is checked against the supplied current plan, mandatory outcomes and assessment links are checked against the RPD/OMD, core mathematics is grounded first in Gmurman, and the machine-learning books are actively considered for useful applications and interpretation

### Requirement: The expected source inventory is documented
The course OpenSpec context SHALL identify `sources/лекции.pdf` by its stable filename and SHALL assign it the highest authority for lecture boundaries. It SHALL continue to identify the RPD, OMD, Gmurman, both machine-learning books, exercise and methodological PDFs, Monte Carlo guidance, curriculum plans, and active review evidence. The source files MAY remain local under ignored `sources/`, but their absence SHALL be reported when a requested revision requires direct source verification.

#### Scenario: Agent begins source-grounded course work
- **WHEN** an agent reads the course specification before editing educational content
- **THEN** it can resolve the current topic-plan PDF, distinguish each source role, apply the conflict hierarchy, and avoid reconstructing absent sources from memory

### Requirement: Source-derived exercises are transformative and traceable
Teacher materials SHALL retain internal source provenance for selected definitions, examples, and exercises, while public materials MUST NOT expose local source paths or reproduce substantial copyrighted passages. Adapted exercises SHALL be independently solved and checked before use.

#### Scenario: Exercise bank is reviewed
- **WHEN** an exercise inspired by a local book is accepted
- **THEN** internal evidence identifies its source role, the published wording is appropriately transformed, and an independently checked solution exists

### Requirement: Source conflicts and defects are handled explicitly
A lecture MUST NOT invent missing normative data or conceal a conflict between sources. The course SHALL retain documented handling for the missing graph in control-work task 3.5, the absent independence condition in individual assignment 6.3, the general and special forms of Chebyshev's law of large numbers, and the distinction between the modern convention `F(x)=P(X\le x)` and conventions used in older sources.

#### Scenario: Required task lacks sufficient source data
- **WHEN** an official exercise cannot be solved uniquely from the available RPD
- **THEN** the material labels the limitation, provides only clearly marked conditional or educational treatment, and does not fabricate an official numerical answer

#### Scenario: Gmurman and modern notation differ
- **WHEN** a definition or notation differs between the primary textbook and the course's adopted modern convention
- **THEN** the student material states the adopted convention and explains the translation needed to read the source correctly

### Requirement: Enrichment remains relevant to the lecture objective
Material taken from machine-learning or deep-learning sources SHALL clarify, motivate, exemplify, or extend the probability concept being taught. Enrichment MUST remain mathematically accurate and MUST NOT displace required probability-theory content.

#### Scenario: Machine-learning example is added
- **WHEN** a lecture uses an example involving data, models, loss, noise, uncertainty, or neural networks
- **THEN** the example is connected explicitly to the current probability concept and preserves the required definitions and conditions

### Requirement: Superseded audits remain historical and inactive
An audit whose findings have been resolved or invalidated by later revisions SHALL be marked superseded and moved to a non-published archive location rather than deleted or left as active guidance. A current versioned review record SHALL state which findings remain applicable, which were resolved, and which external blockers persist.

#### Scenario: Historical audit is consulted
- **WHEN** a maintainer opens the archived audit
- **THEN** its superseded status and successor review are unambiguous and its old recommendations are not mistaken for current acceptance failures

#### Scenario: Current review is completed
- **WHEN** all eight lecture families have been checked and the staged release is ready
- **THEN** versioned evidence records source coverage, accepted editorial changes, independent calculation checks, unresolved normative defects, and the publication decision
