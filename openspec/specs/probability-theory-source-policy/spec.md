# Probability Theory Source Policy Specification

## Purpose

Defines how normative, textbook, machine-learning, and methodological sources govern the accuracy, scope, examples, and enrichment of probability-theory materials.

## Requirements

### Requirement: Source authority is explicit and role-based
The 2026 RPD for Б1.О.09.01 SHALL govern mandatory course structure, required topics, learning outcomes, assessment materials, and workload. V. E. Gmurman's probability and mathematical statistics textbook SHALL be the primary substantive source for definitions, theorem statements, formulas, derivations, notation comparisons, and core examples. *Mathematics for Machine Learning* and *Deep Learning: Immersion into the World of Neural Networks* SHALL supplement Gmurman with applied interpretations, machine-learning and neural-network examples, and relevant extensions beyond the primary textbook. Other methodological and Monte Carlo sources MAY supply targeted exercises, computational approaches, and enrichment but MUST NOT silently override higher-priority sources.

#### Scenario: A lecture topic is written or revised
- **WHEN** a maintainer develops definitions, formulas, explanations, derivations, or examples for a lecture
- **THEN** the mandatory scope is checked against the RPD, core mathematical treatment is grounded first in Gmurman, and the machine-learning books are actively considered for useful applications, examples, interpretation, or extension

### Requirement: The expected source inventory is documented
The course OpenSpec context SHALL identify the normative RPD, Gmurman, *Mathematics for Machine Learning*, *Deep Learning: Immersion into the World of Neural Networks*, the probability-method guidance, the Monte Carlo materials, the course plan, and the lecture revision plan by stable filenames and assigned source roles. It SHALL identify the former lecture audit as a superseded historical record under the ignored source archive and SHALL identify the versioned review evidence from the completed editorial and publication change as the active record for the final decision. The source files MAY remain local under ignored `sources/`, but their absence SHALL be reported when a requested revision requires direct source verification.

#### Scenario: Agent begins source-grounded course work
- **WHEN** an agent reads the course specification before editing educational content
- **THEN** it can identify the authoritative curriculum and mathematical sources, distinguish the active review evidence from the superseded audit, and avoid treating an obsolete defect list as current state

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
