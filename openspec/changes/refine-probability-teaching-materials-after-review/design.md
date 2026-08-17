## Context

See `proposal.md` for motivation. The predecessor change is archived and its delta specs are synced into the main course specifications. The current repository already contains large, mathematically reviewed teacher scripts, shorter complete student lectures, concise notes, seventeen short seminar outlines, assessment banks, and companion code. This change restructures and expands those materials without changing the curriculum, availability, or source hierarchy.

The supplied colleague file is a presentation reference, not a normative source. The RPD remains authoritative for course structure and assessed content; Gmurman remains the primary mathematical source; current reviewed teacher scripts remain the semantic preservation baseline subject to those sources and the adopted course conventions.

## Goals / Non-Goals

**Goals:**

- Make every teacher script directly deliverable as a consistent 90-minute sequence of explicit blocks while preserving detailed lecturer support.
- Make the RPD competence codes actually covered by each lecture visible in a dedicated teacher-facing block.
- Make every extended proof presentation-ready by expanding missing intermediate reasoning and abrupt transitions.
- Turn every concise note into an auditable, complete definition-and-formula reference.
- Make every seminar independently usable, task-rich, and explicit about both method and detailed solution reasoning while limiting its recap to theory used by the task set.
- Apply one predictable assessment timing contract to all three control seminars.
- Preserve mathematical correctness, source provenance, public/private boundaries, stable filenames, links, and current publication availability.

**Non-Goals:**

- Do not redesign complete student lectures unless an audit finds a genuine semantic mismatch.
- Do not create Google Forms, automated assessment, grading-policy, multi-week project, publication, or deployment designs.
- Do not change official task banks, source-defect dispositions, filenames, manifest identities, or downloadable attachments.

## Decisions

### 1. Establish preservation ledgers before rewriting

Before editing each lecture family, implementation will inventory its definitions, formulas, conditions, worked results, source warnings, instructor guidance, book chapters, navigation, and appendices. Before editing each seminar, implementation will inventory its existing tasks, RPD links, cases, practical-preparation obligations, and disclosure boundaries. The post-edit audit will close against these ledgers.

This is preferred to reauthoring from a blank template because the teacher scripts contain verified explanations and source-defect handling that could otherwise be lost. The alternative of relying on heading counts alone was rejected because it cannot detect semantic deletion.

### 2. Use a semantic teacher-block template rather than identical prose

Each teacher script will use a common sequence: passport and literature; a dedicated RPD-competence block; question of the class; 90-minute timing table; numbered timed blocks; summary and independent work; navigation and appendices. Within a block, the author will place the lecturer narrative, board/visual action, mathematics, proofs, worked reasoning, typical warning, and understanding check that are actually applicable. Empty boilerplate will not be inserted merely to make headings identical.

The standalone `Результаты обучения` section will be removed. Its useful content may influence the question of the class, checks, or summary, but it will not survive as a renamed duplicate section.

### 3. Derive competence blocks from the RPD and actual lecture content

For each lecture, implementation will start with the competence codes assigned by the RPD, then verify that the lecture actually teaches or practises the knowledge or action represented by each code. The dedicated `Компетенции по РПД` block will list only supported codes. The acceptance evidence will map each listed code to the lecture blocks that cover it and will record any RPD-assigned code omitted because the lecture does not substantively address it.

This is preferred to copying the same competence list into every lecture because a code label without corresponding content does not communicate real coverage. The competence block remains separate from the removed learning-outcomes section and does not recreate that section in prose.

### 4. Audit extended proofs as chains of justified transitions

An extended proof is any proof that spans multiple claims or displayed transformations, invokes a prior definition or theorem, or contains a transition that a student at the course level may not be able to reconstruct immediately. Each such proof will be reviewed statement by statement. For every transition, the script will name the definition, theorem, algebraic transformation, set identity, limiting argument, or probability property that justifies it and will show the necessary intermediate formulas.

Phrases such as «очевидно», «аналогично» and «нетрудно видеть» may remain only for genuinely immediate steps whose justification is written in the same sentence. Otherwise the omitted reasoning will be expanded. This is preferred to a word-count threshold because a short proof can still contain a serious logical jump, while a long calculation can be routine but must still remain traceable.

### 5. Treat concise notes as coverage-indexed references

For each family, a coverage ledger will map every core definition, symbol, formula, and applicability label from the teacher and complete-student variants to exactly one concise-note location. The note will use compact tables and grouped formula blocks. Routine examples will be removed; only minimal boundary illustrations or counterexamples that carry definitional information may remain.

This is preferred to mechanical shortening because the current notes are selectively narrative and can omit low-frequency but required formulas. A formula-only dump was also rejected because conditions and notation translations are necessary for safe use.

### 6. Build seminar recaps from the task set and retain task roles

Each non-control seminar will separate tasks by pedagogical role:

1. fully worked tasks;
2. instructor-guided or student-at-the-board tasks;
3. independent in-seat tasks;
4. reserve or advanced tasks.

Pair-work sections will be removed. Existing valid tasks will be preserved and expanded with source-grounded non-assessed exercises. Every method appearing in any task must be supported by the preceding recap, and every task role will retain the complete three-part solution structure for checking after the student's attempt.

The recap will be produced only after the task inventory is fixed. Each task contributes the definitions, notation, formulas, and applicability conditions required by its solution; duplicate items are consolidated, and theory not used by any task is excluded. The recap has no fixed ten-minute ceiling: its planned duration follows its complexity, while the selected core tasks and recap together must still fit the 90-minute session. This is preferred to summarizing the whole prerequisite lecture, which would consume practice time without helping solve the actual seminar tasks.

### 7. Use exactly three visible sections for every seminar task

Every task included in a non-control seminar will use exactly these visible headings in order: `Условие задачи`, `Разбор решения`, and `Итоговый ответ`. The condition contains all inputs and the question. The analysis contains the given/sought interpretation, model and method choice, intermediate reasoning, calculations, checks, and relevant error warnings. The final-answer section states the result directly with units or probability interpretation. No fourth mandatory task heading is introduced; finer structure stays inside `Разбор решения`.

Board and independent tasks retain their pedagogical role: students attempt them before consulting the analysis, while the file still contains the full three-part solution for later checking. This makes the depth and structure mechanically reviewable and avoids the current pattern where a task condition and final numeric expression stand in for an explanation.

### 8. Standardize control-work timing without exposing solutions

Seminars 5, 9, and 17 will use 10 minutes for setup, 70 minutes for writing, 5 minutes for collection, and 5 minutes of reserve. Public control files will retain official bank links and permitted defect notes. Detailed keys, if prepared for verification or lecturer use, will stay in teacher-only change evidence or another non-public boundary.

The same writing time is used for all three controls to make expectations predictable. A whole 90-minute writing period was rejected because distribution, instructions, and collection also require scheduled time.

### 9. Apply changes in reviewable batches

Implementation will proceed lecture-family by lecture-family for teacher scripts and notes, then seminar clusters 1–4, 6–8, 10–16, followed by controls 5, 9, and 17. After every batch, structural and mathematical preservation checks will run before starting the next batch.

This limits the risk of broad mechanical rewrites in already long files and makes owner review possible without waiting for the entire corpus to be compared at once.

### 10. Keep publication and Git actions outside implementation

`course.yaml` availability and attachment declarations will remain unchanged. Implementation will finish with strict OpenSpec validation, Markdown/link checks, mathematical spot checks, publication-plan comparison, `git diff --check`, and a local working-tree handoff. It will not commit, push, deploy, or mutate the remote repository.

## Risks / Trade-offs

- [Block restructuring accidentally drops verified material] → Capture preservation ledgers and compare every family before acceptance.
- [Competence codes become decorative metadata] → Map every listed code to concrete lecture blocks and remove unsupported codes rather than copying a generic list.
- [A proof looks complete to its author but still skips prerequisites] → Audit consecutive statements from the perspective of the target student and require an explicit justification for every non-trivial transition.
- [Complete formula coverage makes concise notes too dense] → Use tables, topic grouping, and condition columns; measure completeness semantically rather than by length alone.
- [Task-driven recap omits a hidden prerequisite] → Trace every step of every solution back to a recap item or an explicitly established prerequisite before acceptance.
- [More seminar tasks and variable recap length exceed 90 minutes] → Mark tasks explicitly as analysed, board, independent, or reserve; only the recap and core timed path must fit 90 minutes.
- [Detailed solutions weaken independent practice] → Preserve board/independent timing and instruct students to attempt tasks before reading `Разбор решения`, while retaining the required complete structure for checking.
- [External exercises are mistaken for official assessment] → Label enrichment as non-assessed and keep RPD task banks isolated.
- [Source defects are silently normalized during rewriting] → Recheck the current source audit, especially control work 3.5 and IDZ 6.3, in every affected batch.
- [Large Markdown diffs are difficult to review] → Use file-scoped batches, preservation evidence, stable filenames, and no unrelated formatting sweep.

## Migration Plan

1. Capture the committed baseline, repository status, target-file inventory, competence map, proof inventory, and per-family preservation ledgers.
2. Refactor and audit teacher scripts, including competence blocks and line-by-line expansion of extended proofs, then rebuild concise notes in lecture-family batches.
3. Fix each seminar's task inventory, derive its minimum sufficient theory recap from those tasks, apply the three-part structure to every task, and normalize the three control seminars.
4. Run cross-material completeness, competence, proof-continuity, mathematical, source-defect, navigation, Markdown, publication-plan, and OpenSpec validation.
5. Hand off the local uncommitted diff and acceptance evidence for owner review.

Rollback is file-scoped: restore only a change-owned file from the committed baseline after verifying it does not contain owner edits made during implementation. No production rollback applies because this change does not publish or deploy.
