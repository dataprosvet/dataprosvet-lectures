## Context

See `proposal.md` for motivation. The repository currently has eight detailed teacher scripts, eight concise notes, no complete student lecture set under `lectures/`, a completed but partly contradicted resource-migration plan, and a manifest that exposes only some concise variants. The old local audit predates the latest lecture revisions. Publication is Git-driven and the source corpus, teacher scripts, OpenSpec, and dormant resources must remain outside the public plan.

The change crosses educational content, repository organization, manifest state, deployment, and production verification. Mathematical and curriculum decisions remain governed by the existing source hierarchy and conventions.

## Goals / Non-Goals

**Goals:**

- Make all teacher scripts comfortable to study and read aloud through bounded editorial changes whose preservation can be reviewed.
- Produce a complete and a concise student variant for each lecture with a repeatable cross-variant quality gate.
- Make the staged manifest truthful: only lecture one is released, with both text variants and no PPTX.
- Retire the obsolete audit without losing historical context.
- Obtain end-to-end evidence from source review through production-site behavior.

**Non-Goals:**

- No curriculum repartition, assessment-bank rewrite, new mathematical-statistics unit, or publisher architecture change.
- No attempt to make all eight lectures publicly available in this release.
- No content reconstruction for missing normative data and no manual Appwrite console mutation.

## Decisions

### 1. Treat teacher-script work as constrained editorial refactoring

Each teacher script is reviewed against its current version, the RPD map, Gmurman, the applied sources, and the current findings. Allowed edits improve sentence rhythm, oral readability, transitions, duplicated explanation, heading consistency, and source locators. Structural sections, learning sequence, worked mathematical meaning, teacher prompts, timing, assessment coverage, known-defect warnings, and computational appendices remain unless a source-backed correction requires a local change.

The review records a per-lecture preservation checklist and a concise change log. This is preferred over rewriting the scripts because their current educational architecture is already sound. The alternative—regenerating them from the student text—would lose delivery scaffolding and user corrections.

### 2. Maintain three explicit content layers

- `lectures-teacher/`: complete teacher scripts, tracked and never published.
- `lectures/`: complete student lectures, with explanatory narrative and worked reasoning but no delivery scaffolding.
- `lecture-notes/`: concise revision notes, shorter and formula-focused.

Complete student lectures are authored from the reviewed teacher scripts one lecture at a time. Concise notes are then checked against both variants; they are not mechanically generated or expanded. The alternative of publishing sanitized teacher scripts is rejected because removal-by-pattern is unsafe and produces teacher-oriented prose.

### 3. Use a lecture-by-lecture quality gate before cross-course QA

For each lecture, work proceeds in the order: source recheck → teacher editorial diff → complete student lecture → concise-note corrections → independent formula/example verification → publication-safe Markdown check. Only after all eight families pass is a cross-course terminology and progression review performed.

The gate explicitly checks assumptions for independence, Bernoulli, Poisson, Laplace, normal, and limit-theorem results; modern `F_X(x)=P(X\le x)` translation; exact versus approximate language; and the two known RPD defects. This prevents global stylistic cleanup from concealing a local mathematical regression.

### 4. Separate content readiness from release availability

All eight complete lectures and concise notes are tracked and validated, but `course.yaml` declares both variants only for lecture one in this release. Lectures two through eight keep metadata and `inDevelopment` availability without exposed content declarations. The PPTX remains tracked under `attachments/` but undeclared.

This staged manifest is preferred over publishing all completed files because the user requested a single-lecture production baseline. It also avoids misrepresenting repository presence as release authorization.

### 5. Archive the old audit locally and create versioned successor evidence

Move `sources/AUDIT_LECTURES_1_8.md` to `sources/archive/AUDIT_LECTURES_1_8.superseded.md`, add an explicit superseded banner and successor reference, and update OpenSpec context so future work does not treat it as current. Because `sources/` is intentionally ignored, create a tracked `review-report.md` in this change for current findings and an acceptance matrix covering all lecture families.

The alternative of deleting the audit loses useful history; leaving it at the active path preserves a known source of confusion.

### 6. Make deployment a gated, evidence-producing stage

Before publication, validate OpenSpec, publisher constraints, links/assets, expected tracked/dormant status, and the deterministic plan. Compare the plan against an explicit allowlist: course metadata, lecture-one complete Markdown, lecture-one concise Markdown, and only their referenced public images.

After the reviewed commit is pushed and the production workflow completes, inspect the primary site in its real user-visible state. Record the commit, workflow result, URL/page checks, exposed actions, absence checks, and rendering result in `publication-verification.md` inside the change.

The source of truth remains Git. Manual production edits are rejected because they cannot be reproduced or safely rolled back.

## Risks / Trade-offs

- [Editorial refactoring accidentally changes mathematics] → Keep changes local, compare semantic formulas and worked answers, and require independent numeric checks for edited examples.
- [Complete lectures become near-duplicates of teacher scripts] → Enforce the student-content boundary and review specifically for prompts, timings, facilitation, coverage matrices, source maps, and generator code.
- [Concise notes drift from complete lectures] → Review all three variants as a lecture family before acceptance and run a final cross-course terminology pass.
- [Dormant files are accidentally published] → Inspect the generated plan against the staged allowlist before any deployment.
- [Production appears stale because deployment is asynchronous or cached] → Wait for the exact commit's workflow completion, then verify the primary site and record the deployed revision where observable.
- [Website check requires an authenticated session] → Use the existing signed-in browser state during apply; if unavailable, verify public behavior and record the unverified authenticated-only portion as a release blocker.
- [The RPD graph for control-work task 3.5 remains missing] → Keep the official task explicitly blocked and retain only the labelled educational analogue.

## Migration Plan

1. Capture current file hashes, manifest state, and teacher-script preservation baselines.
2. Perform the eight lecture-family review gates and create current review evidence.
3. Archive the superseded local audit and update its active references.
4. Set the staged `course.yaml` declarations and confirm the PPTX is dormant.
5. Run strict local validation and inspect the deterministic publication plan.
6. Commit and push the accepted repository state through the normal course-branch workflow.
7. Wait for the exact revision's production publication, perform the primary-site smoke check, and record evidence.

Rollback uses a reviewed `git revert` or restoration of the last known-good course commit followed by the normal publisher workflow. If unintended content is public, the corrective manifest or revert is published through Git; the Appwrite console is not edited manually.

## Open Questions

None. The release boundary, attachment policy, content layering, audit successor, and production acceptance behavior are fixed by this change.
