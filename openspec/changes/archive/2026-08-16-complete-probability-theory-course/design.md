## Context

See `proposal.md` for motivation. The repository already contains eight teacher scripts, eight complete student lectures, eight concise notes, a manifest that exposes only lecture one, and publisher support for `.py` attachments. It contains no seminars or homework files. The ignored RPD is normative for structure and assessment, while the teacher scripts are the reconciliation reference for student lecture meaning. Existing review evidence claims all lecture variants passed, but current files contain reproducible notation contradictions, so acceptance must be rebuilt from current content.

The implementation spans authored Markdown, mathematical QA, source provenance, attachment extraction, and manifest allowlisting. It must preserve unrelated working-tree content, including the untracked `.agents/` directory, and stop before commit or deployment.

## Goals / Non-Goals

**Goals:**

- Produce independently usable seminar and assessment content whose RPD coverage can be traced mechanically and reviewed pedagogically.
- Make cross-lecture and cross-variant terminology deterministic, with Russian experiment labels and `E[X]`, `Var(X)`, `σ(X)` as the visible default.
- Preserve normative defects rather than laundering them through editorial rewrites.
- Ensure every embedded Python example has an executable, verified companion without accidentally publishing locked content.
- Make availability an allowlist property of `course.yaml`, not a consequence of whether a repository file exists.
- Provide predictable lecture/seminar document structure and bidirectional local navigation that the site can preserve.

**Non-Goals:**

- Redesign the publisher, change the course branch workflow, or add attachment formats.
- Create new official assessment variants, answer keys for public delivery, or replacements for missing RPD data.
- Make every dormant attachment public merely because it is complete.
- Treat lexical identity as a requirement where two phrasings preserve the same mathematics; the audit is semantic plus convention-focused.

## Decisions

### 1. Build a single RPD coverage ledger before authoring

Implementation will first create `source-audit.md` and a working coverage ledger derived from RPD tables 3–6 and pages 15–20. The ledger maps lectures, seminars, IDZ, control works, cases, practical preparation, independent study, and known defects. Authoring then consumes this map, and final QA checks every row.

This is preferred to drafting files independently because it prevents topic drift and makes the 108-hour structure auditable. The alternative—checking coverage only after authoring—risks expensive rewrites and missed RPD constraints.

### 2. Keep official assessment statements isolated from explanation

Each homework file will separate the normative task block from administrative guidance, hints, and defect notes. Only RPD material may appear inside the assessed block. Where public answer disclosure would undermine assessment, full calculation checks stay in `source-audit.md` or implementation evidence rather than the student body.

This is preferred to interleaving textbook exercises because the user requires RPD-only assessment provenance. Additional book tasks belong only in seminars and must be labelled non-assessed.

### 3. Order homework by delivery chronology

The ten manifest entries and filenames will follow course delivery: IDZ 1, IDZ 2, KR 1, IDZ 3, IDZ 4, IDZ 5, KR 2, IDZ 6, IDZ 7, KR 3. Stable three-digit prefixes follow manifest `sortOrder`.

This is preferred to grouping all IDZ before all controls because chronological ordering matches seminar dependencies and makes the first material exactly IDZ 1.

### 4. Use a three-layer seminar structure

Each teaching seminar uses: (a) prerequisite and compact theory recap, (b) worked/guided practice, and (c) independent practice with checking guidance. Control seminars instead provide administration, the official bank, permitted clarification notes, and post-control reflection boundaries. Cases and practical preparation are embedded in their assigned seminars rather than duplicated as separate materials.

This balances independent usability with two-hour scope. A pure problem list was rejected because it would not meet the requirement that a student can recover methods and conditions without external scaffolding.

### 5. Reconcile lectures through a per-family checklist

For each lecture number, compare teacher, complete, and concise variants across definitions, formulas, assumptions, examples, numerical results, warnings, transitions, RPD defects, Russian outcome labels, and `E`/`Var`/`σ` notation. The teacher script controls semantics, but the user’s new notation decision updates all three variants, including teacher scripts where necessary. Independent calculations are rerun for any touched worked result.

This replaces reliance on the previous pass report. Automated searches catch known lexical conventions, while human semantic review catches omissions that grep cannot detect.

### 6. Extract one companion module per code-bearing material

Each lecture or seminar with Python maps to `attachments/lecture_N.py` or `attachments/seminar_N.py`. Multiple code fences in one material are combined in reading order into one documented module with a `main()` entry point when practical. Outputs go to an explicit argument or a temporary directory during verification; repository assets are regenerated only when the existing material intentionally owns them.

One file per material gives a simple manifest mapping and avoids fragmented downloads. One file per code fence was rejected because it creates unstable keys and makes ordering harder to understand.

### 7. Separate completeness from availability

All content files are authored and tracked-ready, and all materials receive metadata. Only lecture 1, seminar 1, and IDZ 1 declare Markdown. A Python attachment is declared only when its owning available material actually contains Python; later companion files stay dormant. The PPTX stays dormant. `availability: inDevelopment` plus absent declarations is the lock mechanism.

This follows the existing publisher allowlist contract and permits future unlocks through manifest-only changes after review.

### 8. Validate in concentric gates

Validation proceeds from cheapest to broadest: inventory and naming; Markdown/convention scans; Python syntax and execution; independent mathematical checks; RPD coverage and audit closure; OpenSpec strict validation; publisher tests; deterministic publication-plan review; `git diff --check`; and final working-tree review confirming no commit was created.

This ordering surfaces local defects early and reserves full publisher validation for content that has already passed educational QA.

### 9. Treat document templates as contracts, not copy-paste text

The lecture and seminar delta specs define required semantic sections and their order. Authoring may vary heading depth and omit a section only with an explicit not-applicable rationale; the teacher, complete-student, and concise products remain distinct. A final structural audit checks the contract across all files.

This is preferred to storing one literal Markdown template file because the three lecture products and control seminars have different audiences and disclosure boundaries. A semantic template remains stable without forcing empty boilerplate.

### 10. Use relative Markdown navigation with a fixed curriculum map

Complete lectures and concise notes link from a `Связанные семинары` section to `../seminars/<stable-file>.md`; seminars link back to `../lectures/<stable-file>.md`. The fixed mapping is 1→1–2, 2→3–5, 3→6, 4→7–9, 5→10, 6→11–13, 7→14–15, and 8→16–17. Links to dormant files are permitted in repository content but never count as manifest declarations and therefore cannot unlock a material.

Relative file links were chosen over hard-coded site routes because the site supports local Markdown links and stable repository identities already govern publication. Teacher-file targets and absolute URLs are forbidden.

## Risks / Trade-offs

- [Large authored surface creates inconsistency risk] → Use stable templates, the coverage ledger, per-family lecture checklists, and staged validation batches.
- [RPD-only assessment conflicts with helpful explanation] → Keep official blocks verbatim in meaning and place source-safe guidance outside them without adding assessed tasks.
- [Known RPD defects make some tasks unusable as written] → Record them in `source-audit.md`, preserve the original problem, and mark blocked or conditional treatment explicitly.
- [Normalizing notation can accidentally alter formulas] → Restrict mechanical replacement; review every touched formula and rerun calculations.
- [Extracted Python may rely on inline context or repository-relative paths] → Add explicit constants/arguments, run each companion in a temporary directory, and compare outputs.
- [Declared attachment can expose locked content] → Generate the deterministic plan and assert an exact allowlist before acceptance.
- [A link to a dormant seminar may be mistaken for publication] → Validate that links remain content bytes only and that `course.yaml` declarations alone control exposure.
- [Dormant complete content may be mistaken for published content] → Treat `course.yaml` as the only release authority and record dormant paths during validation.
- [The implementation may overlap user edits] → Capture status before each batch, preserve unrelated changes, and avoid bulk overwrites of touched files.

## Migration Plan

1. Capture the current manifest, content inventory, checksums where preservation matters, and working-tree status.
2. Create the source audit and coverage ledger from the current RPD.
3. Reconcile lecture families against their templates, add seminar navigation, and rerun affected calculations.
4. Author seminars from the specification template in prerequisite-aligned batches, add reciprocal lecture links, and create assessment files in delivery order.
5. Extract and verify Python companions.
6. Add complete metadata and the exact staged declarations to `course.yaml`.
7. Run all educational, OpenSpec, attachment, publisher, and diff validation gates.
8. Hand off the uncommitted working tree and audit evidence for owner review.

Rollback during implementation is file-scoped: revert only files created or changed by this change after verifying they do not contain user edits. No production rollback applies because this workflow does not deploy.
