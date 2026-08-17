## MODIFIED Requirements

### Requirement: Current production scope is explicit
The next reviewed production release SHALL expose the published probability-theory course, lecture one with both its complete student lecture and concise note, seminar one, and individual assignment one. Eligible Python companions for those available materials MAY be exposed when present and validated. Lectures two through eight, seminars two through seventeen, individual assignments two through seven, all three control works, teacher scripts, local sources, OpenSpec content, audit evidence, dormant files, and the lecture-one presentation MUST NOT be publicly exposed.

#### Scenario: User opens the probability-theory course
- **WHEN** the reviewed release is eventually committed and deployed
- **THEN** lecture one, seminar one, and individual assignment one are available, all later materials remain locked, eligible declared Python companions are downloadable, and no presentation or internal evidence is shown

## ADDED Requirements

### Requirement: Repository review precedes any release action
Completion of this change SHALL produce an uncommitted, validated repository state for owner review. It MUST NOT itself commit, push, deploy, or mutate production.

#### Scenario: Apply workflow completes
- **WHEN** all content and validation tasks for this change pass
- **THEN** the working tree contains the reviewable implementation and no commit, push, or deployment has been performed

### Requirement: Locked materials retain metadata without exposed content
All 8 lectures, 17 seminars, and 10 homework materials SHALL have stable manifest metadata. A locked material SHALL use `inDevelopment` and omit Markdown and attachment declarations so that its repository files remain dormant rather than public.

#### Scenario: Deterministic plan is generated
- **WHEN** the completed manifest is validated
- **THEN** metadata identities are complete while public content is limited to lecture 1, seminar 1, individual assignment 1, and their eligible declared assets or attachments

