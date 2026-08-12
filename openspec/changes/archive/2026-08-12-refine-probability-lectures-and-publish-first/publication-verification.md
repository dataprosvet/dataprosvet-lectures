# Publication Verification

## Release identity

- Production site: <https://dataprosvet.ru>
- Course branch: `courses/probability-theory`
- Deployed content commit: `ac1ea32071186ce911290cf0f4836a86775fc4d3`
- Publisher plan digest: `eb67f7466ab97507058bfa375535a28dc71c1ec94d791b06e68952dfb79c37b6`
- GitHub Actions run: <https://github.com/dataprosvet/dataprosvet-lectures/actions/runs/31616832952>
- Workflow result: `success`; validation completed at 2026-08-12 16:17:49 UTC and deployment completed at 16:18:46 UTC.

## Positive checks

- The primary site opens and shows the published course «Теория вероятностей».
- Lecture 1 is visible with the expected title and published/available state.
- The complete student lecture opens and preserves its headings, formulas, source links, and referenced illustration.
- The distinct concise student note opens and preserves its revision-oriented structure and formulas.

## Negative checks

- No presentation action is exposed; `attachments/lecture_1.pptx` remains tracked but undeclared and dormant.
- Lectures 2–8 remain in development and their complete and concise texts are not publicly available.
- Teacher scripts, local sources, historical audits, OpenSpec artifacts, dormant lecture assets, and attachments are not reachable from the course UI.

## Evidence and acceptance

The deterministic publication-plan allowlist, strict validation, 47 publisher tests, dormant-resource diagnostics, and successful deployment workflow provide machine-verifiable evidence. On 2026-08-12 the course owner independently checked the production site and explicitly confirmed that the lecture was published correctly. This owner acceptance is the equivalent UI evidence for the checks above; no screenshot is required.

Final decision: **accepted**. No rollback or corrective publication is required.
