## MODIFIED Requirements

### Requirement: The expected source inventory is documented
The course OpenSpec context SHALL identify the normative RPD, Gmurman, *Mathematics for Machine Learning*, *Deep Learning: Immersion into the World of Neural Networks*, the probability-method guidance, the Monte Carlo materials, the course plan, and the lecture revision plan by stable filenames and assigned source roles. It SHALL identify the former lecture audit as a superseded historical record under the ignored source archive and SHALL identify this change's versioned review evidence as the active record for the final editorial and publication decision. The source files MAY remain local under ignored `sources/`, but their absence SHALL be reported when a requested revision requires direct source verification.

#### Scenario: Agent begins source-grounded course work
- **WHEN** an agent reads the course specification before editing educational content
- **THEN** it can identify the authoritative curriculum and mathematical sources, distinguish the active review evidence from the superseded audit, and avoid treating an obsolete defect list as current state

## ADDED Requirements

### Requirement: Superseded audits remain historical and inactive
An audit whose findings have been resolved or invalidated by later revisions SHALL be marked superseded and moved to a non-published archive location rather than deleted or left as active guidance. A current versioned review record SHALL state which findings remain applicable, which were resolved, and which external blockers persist.

#### Scenario: Historical audit is consulted
- **WHEN** a maintainer opens the archived audit
- **THEN** its superseded status and successor review are unambiguous and its old recommendations are not mistaken for current acceptance failures

#### Scenario: Current review is completed
- **WHEN** all eight lecture families have been checked and the staged release is ready
- **THEN** versioned evidence records source coverage, accepted editorial changes, independent calculation checks, unresolved normative defects, and the publication decision
