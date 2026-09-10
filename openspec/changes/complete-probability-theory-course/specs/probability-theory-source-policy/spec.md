## ADDED Requirements

### Requirement: A current source-defect audit is maintained
The change SHALL maintain `source-audit.md` as the current versioned record of every RPD omission, contradiction, suspicious statement, numbering defect, and adopted notation translation discovered during implementation. Each entry SHALL identify the source location, observed issue, affected materials, risk, permitted treatment, and current disposition.

#### Scenario: A source defect is discovered or revisited
- **WHEN** an RPD task, table, formula, label, or numbering conflicts with itself or lacks required information
- **THEN** the audit is updated before affected course material is accepted

### Requirement: The audit governs defect treatment without replacing the RPD
The audit SHALL distinguish normative source text from editorial interpretation. It MUST NOT silently rewrite the RPD, invent official data, or turn an educational analogue into an official task. Course materials SHALL reference or reflect the approved audit disposition where the defect affects student use.

#### Scenario: Missing normative data prevents a unique answer
- **WHEN** a task such as control work 3.5 cannot be solved from the supplied RPD
- **THEN** the audit marks it blocked, affected materials disclose the limitation, and any analogue is labelled non-normative

### Requirement: Adopted notation is recorded as a course decision
The audit SHALL record that Russian labels are preferred for experiments and similar examples, and that `E[X]`, `Var(X)`, and `σ(X)` are the primary course notation. It SHALL document translations from `M(X)`, `D(X)`, or older distribution-function conventions when they occur in approved sources.

#### Scenario: Source notation differs from course notation
- **WHEN** material is adapted from a source using another standard convention
- **THEN** the mathematical meaning is preserved and the translation is stated without presenting the source as erroneous solely for using a different convention

