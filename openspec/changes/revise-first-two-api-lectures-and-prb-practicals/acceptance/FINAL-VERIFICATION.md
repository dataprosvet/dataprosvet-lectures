# Final verification

Completed on 2026-08-31.

## Cross-material consistency

- Lecture 1, practical work 1 and homework 1 use the same PRB progression: consumer goal → business context → API boundary → interfaces → failure paths → lifecycle. The lecture's SII inference example remains an independent lecture-only branch and is not required by either student assignment.
- Lecture 2, practical work 2 and homework 2 consistently require OpenAPI `3.1.2`, forecast resources, `request_id`, `schema_version`, `model_version`, uniform errors and separate API/schema/model version decisions.
- Practical work 3 and homework 3 consume the same status, correlation and error vocabulary introduced in lecture 2 and require only localhost, synthetic fixtures, deterministic reset and clean shutdown.
- The deliberate teaching simplification is explicit: the lecture's compact walkthrough demonstrates a synchronously completed prediction returned as `201 Created`, while practical work 2 expands the domain into create/status/result/history operations for a forecast job. This is progressive modelling, not a hidden contradiction.

## Profile checks

- Positive checks find PRB/forecast context in all six student materials.
- Negative checks find no SII profile choice, competency, endpoint, payload, tool or profile-specific example in seminars 1–3 and homeworks 1–3.
- Both lecture scripts retain distinct `COMMON`, `PRB` and `SII` material and explicitly state that linked practical work and homework are PRB-only.

## Content, safety and navigation

- All 39 local Markdown links in the eight changed teaching files resolve.
- Markdown code fences are balanced. No credential-like secret pattern is present.
- OpenAPI is pinned to 3.1.2; external teaching references use stable RFC, OpenAPI, JSON Schema and DOI locations. `api.example.test` is an intentionally non-routable documentation host.
- Practical diagnostics prohibit production hosts and real data and require localhost, synthetic fixtures, deterministic reset and clean shutdown.
- `course.yaml` remains absent.

## Preservation

- SHA-256 checksums for lectures 3–4, seminars 4–6, homeworks 4–5, `README.md` and `course.yaml.example` exactly match the baseline.
- Public student lectures, concise notes and external code repositories were not edited.
- The final implementation edit set is limited to the OpenSpec change/configuration, teacher lectures 1–2, seminars 1–3, homeworks 1–3 and the two lecture decks.

## OpenSpec and presentation QA

- Strict validation passes for `revise-first-two-api-lectures-and-prb-practicals`.
- The change contains separate numbered capabilities for lectures 1–2, practical works 1–3 and homeworks 1–3. Aggregate predecessor capabilities appear only as removals.
- All 22 added capability scenarios were reviewed against the resulting artifacts.
- Both decks pass ZIP integrity, 22-slide/22-note/22-source-marker checks, overflow checks, full-slide visual review and template-fidelity checks with zero issues. Detailed mapping is in `PRESENTATION-QA.md`.

## Known follow-up

External branch verification remains open. `gh auth status` reports an invalid token for the configured GitHub account, and no authorized sibling clone exists. After re-authentication, verify the `seminar/01`–`03` student branches and teacher mirrors from clean snapshots; record any mismatch in a new change without mutating those repositories here.
