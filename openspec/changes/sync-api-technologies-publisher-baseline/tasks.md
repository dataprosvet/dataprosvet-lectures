## 1. Prepare an isolated synchronization branch

- [x] 1.1 Fetch and prune `origin`, then record the current SHAs of `origin/courses/api-technologies` and `origin/master` used for the synchronization.
- [x] 1.2 Confirm the failed course commit is an ancestor of `origin/courses/api-technologies` and that the course branch still differs from `origin/master` only in the expected protected baseline paths plus course-owned content.
- [x] 1.3 Create a dedicated temporary Git worktree with branch `course/api-technologies/sync-contribution-ci` based exactly on `origin/courses/api-technologies`; verify the primary checkout and its untracked authoring files remain untouched.

## 2. Inherit the publisher baseline

- [x] 2.1 Merge `origin/master` into the contribution branch with a normal merge commit; stop for review if Git reports any conflict instead of resolving protected files automatically.
- [x] 2.2 Inspect the merge against both parents and confirm that every change relative to the course base is inherited from `origin/master`.
- [x] 2.3 Verify that the baseline merge itself does not change `course.yaml`, course materials, assets, attachments, teacher content or course-local OpenSpec artifacts.
- [x] 2.4 Verify `git diff --exit-code origin/master -- .github README.md course.yaml.example` succeeds in the merged tree.

## 3. Normalize and validate the merged tree

- [x] 3.1 Run `npm ci`, publisher lint and publisher unit tests from `.github/publisher` and require all checks to pass.
- [x] 3.2 Run the branch-policy check with pull-request inputs representing head `course/api-technologies/sync-contribution-ci` and base `courses/api-technologies`; require it to resolve `courses/api-technologies`.
- [x] 3.3 Replace the first lecture's YAML `null` summary with the approved non-empty description and verify this is the only course-owned content diff.
- [x] 3.4 Copy only `attachments/lecture_1.pdf` into the isolated worktree, verify its source and destination SHA-256 hashes match, and confirm Git stages it through the existing LFS filter.
- [x] 3.5 Run `COURSE_ROOT=../.. COURSE_BRANCH=courses/api-technologies npm run validate` from `.github/publisher` and require successful validation without Appwrite mutations.
- [x] 3.6 Review the final status, commit ancestry and changed-file list; require no staged, modified or untracked files beyond the intended baseline, summary and declared PDF changes in the isolated worktree.

## 4. Deliver and verify the repair

- [x] 4.1 Push only `course/api-technologies/sync-contribution-ci` and open a pull request targeting `courses/api-technologies` with the failure cause, inherited baseline SHAs and local validation results.
- [x] 4.2 Wait for the PR `validate` job, inspect any failure before changing scope, and require a successful check plus reviewed file list before merge.
- [x] 4.3 Merge the approved PR without force-pushing or rewriting `courses/api-technologies` history.
- [x] 4.4 Verify the resulting push workflow completes both `validate` and `deploy`, and record the successful run URL and deployed course commit.
- [x] 4.5 Remove the temporary worktree after delivery while preserving the local planning artifacts and unrelated authoring files in the primary checkout.

Deployment record: commit `488e0bef3a3f14c970872a768c75a02b555526c8`, workflow run `https://github.com/dataprosvet/dataprosvet-lectures/actions/runs/33659983551` (`validate` and `deploy` succeeded).
