## Context

See `proposal.md` for motivation. The failed run checked commit `dc5a71d681f637b751ddd28b8e2cbf7e57a56731` from `courses/api-technologies`. Its merge base with the current `origin/master` is `70f92eec6c28aed109f99a5b76bf9b589c00081f`; `master` has since advanced through the contribution-policy and Appwrite pagination changes. The course branch therefore carries stale versions of protected `.github/**` and `README.md`, and the fail-closed baseline diff correctly stops before `npm run validate` and deployment.

The working directory also contains untracked course materials and OpenSpec artifacts. They belong to ongoing authoring work and must remain outside the baseline synchronization commit and PR.

## Goals / Non-Goals

**Goals:**

- Inherit the complete current publisher baseline from `origin/master` without editing protected files independently in the course branch.
- Preserve the course branch history and deliver the synchronization through the established contribution PR path.
- Demonstrate that the merged tree passes branch policy, publisher tests, course validation, and the protected-file equality gate.
- Make the existing empty first-lecture summary schema-valid without adding unreviewed descriptive claims.
- Materialize the already declared lecture PDF as a tracked Git LFS publication input.
- Keep the publication contract profile-neutral (`COMMON`); PRB/SII distinctions, RPD priority, content structure and manifest declarations remain byte-for-byte unchanged by this change.

**Non-Goals:**

- Do not alter course content or any `course.yaml` field other than the approved summary; do not add any attachment except `attachments/lecture_1.pdf`; do not alter Appwrite resources, credentials, environment configuration or GitHub rulesets.
- Do not redesign the publisher or weaken/remove the fail-closed comparison with `origin/master`.
- Do not resolve the publication-profile decision or any normative-source defect.
- Do not stage or commit unrelated untracked files.

## Decisions

### Synchronize with a merge from `origin/master`

Create `course/api-technologies/sync-contribution-ci` from the current remote-backed `courses/api-technologies`, then merge `origin/master` with a normal merge commit. This imports the already reviewed baseline as one auditable ancestry change and preserves the published course history.

Alternatives considered:

- Directly commit to `courses/api-technologies`: rejected because repository policy requires reviewed contribution PRs.
- Cherry-pick individual baseline commits: rejected because it can omit prerequisite commits and makes future ancestry checks harder to reason about.
- Copy protected files from `master`: rejected because content equality without ancestry obscures provenance and can silently miss non-file history assumptions.
- Disable or narrow the gate: rejected because the gate is behaving correctly and protects the shared publication contract.

### Keep the synchronization PR mechanically isolated

Create the contribution branch in a dedicated temporary Git worktree based on `origin/courses/api-technologies`. This prevents the untracked authoring files in the primary checkout from appearing in status, staging or review for the synchronization.

The baseline portion of the PR diff must consist only of files inherited from `origin/master`. The only course-owned changes allowed in the final PR are the approved `course.yaml` summary and `attachments/lecture_1.pdf`. Before committing or pushing, compare the merge result against both parents and verify that `lectures/**`, `lecture-notes/**`, `seminars/**`, `homeworks/**`, `assets/**`, other `attachments/**`, `lectures-teacher/**` and unrelated `openspec/**` authoring changes are absent.

This isolation preserves source priority and profile assumptions automatically: no RPD-grounded or profile-scoped content is changed, so there is no new content claim to validate.

### Track the declared PDF through Git LFS

Copy the existing local `attachments/lecture_1.pdf` into the isolated worktree and stage that exact path only. The inherited `.gitattributes` maps `*.pdf` to Git LFS, so the Git object must be an LFS pointer while local and CI validation receive the materialized PDF bytes. Record the source and worktree SHA-256 hashes before staging to prove that no binary transformation occurred.

Alternatives considered:

- Remove the attachment declaration: rejected because the user confirmed the presentation should be published.
- Add every local attachment: rejected because only `lecture_1.pdf` is declared and authorized for this repair.
- Store the PDF as a normal Git blob: rejected because it would violate the repository's existing LFS policy.

### Supply the required lecture summary

Set `materials.lectures[0].summary` to the user-approved text `Введение в роль API в бизнес-приложениях и системах искусственного интеллекта.`. The current blank YAML value parses as `null`, while the publisher schema requires a non-empty string. The concise wording follows the existing course description and applies to the shared (`COMMON`) introductory scope.

Alternatives considered:

- Keep an empty string: rejected after validation confirmed the schema requires at least one character.
- Relax the publisher schema to accept `null`: rejected because this course-local data defect does not justify changing the shared contract.

### Validate the exact merged tree before review

Run the publisher install, lint and unit test commands from `.github/publisher`, then run course validation with `COURSE_ROOT=../..` and `COURSE_BRANCH=courses/api-technologies`. Finally require an empty protected-file diff against `origin/master`:

```sh
git diff --exit-code origin/master -- .github README.md course.yaml.example
```

The PR validation is the authoritative reproducibility check. Deployment remains unavailable to PRs and occurs only after the reviewed PR is merged into `courses/api-technologies` and its push validation succeeds.

## Risks / Trade-offs

- [Untracked authoring files are accidentally staged] → Stage only the merge commit produced by Git and inspect `git status`, both-parent diffs and the final PR file list before push.
- [The course branch advances before the PR is merged] → Refresh `origin/courses/api-technologies`, merge it into the contribution branch, and rerun the complete validation set.
- [A future `master` update lands during review] → Update the contribution branch from the new `origin/master` and rerun validation so the protected-file gate is evaluated against the current baseline.
- [Inherited publisher behavior exposes a latent course-manifest problem] → Treat a later `npm run validate` failure as a separate course-content issue; do not bypass the baseline or combine unrelated fixes into this PR.
- [The new summary could overstate lecture scope] → Use only concepts already present in the course title and description, and keep the wording profile-neutral.
- [The wrong local PDF is uploaded] → Compare exact path, file type, byte size and SHA-256 hash before staging; inspect the staged LFS pointer and let publisher validation structurally inspect the materialized file.
- [The merge triggers production publication after PR merge] → Rely on the existing validate-before-deploy job dependency and Appwrite environment boundary; rollback with a reviewed revert if publication fails after merge.

## Migration Plan

1. Fetch `origin` and confirm the intended base is the current `origin/courses/api-technologies`.
2. Create a dedicated temporary worktree and branch `course/api-technologies/sync-contribution-ci` from that remote-tracking ref, leaving the primary checkout untouched.
3. Merge `origin/master` without manually resolving protected files unless Git reports a conflict; if a conflict appears, stop and review rather than choosing a side automatically.
4. Set the first lecture's summary to the agreed non-empty text, add only the declared `attachments/lecture_1.pdf` through Git LFS, verify both course-owned changes, and run all local publisher and course validation checks.
5. Push the contribution branch and open a PR targeting `courses/api-technologies`.
6. Require a successful PR `validate` job and review of the exact file list before merge.
7. Merge the PR; verify the resulting push run completes `validate` and `deploy` successfully.

Rollback uses a reviewed revert of the synchronization merge in a new `course/api-technologies/<work-slug>` contribution PR. Do not rewrite or force-push the persistent course branch.
