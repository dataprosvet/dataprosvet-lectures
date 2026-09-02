# Content preservation and scope verification

## Lecture 1

- Timed blocks remain continuous: 0–8, 8–20, 20–35, 35–50, 50–63, 63–78, 78–86, 86–90.
- Preserved concepts: API vs endpoint; consumer/provider/goal; observable syntactic, semantic, operational and evolutionary contract; implementation hiding; module, modular-monolith and service boundaries; request pipeline; system lifecycle; synchronous/asynchronous choice.
- Preserved interactions and misconceptions: click-to-result opening, interface classification, consumer card, boundary anti-examples, context diagram, error correction and final pair question.
- Preserved executable checkpoints: L1.1–L1.6.
- Profile separation remains explicit: PRB forecasting/ERP/CRM/BI and SII inference/feedback/model lifecycle. Only PRB is linked to practical work and homework.
- Added a progressive reading path, transition logic, source roles and stable source-matrix locator.

## Lecture 2

- Timed core remains continuous: 0–7, 7–20, 20–33, 33–54, 54–62, 62–71, 71–81, 81–87, 87–90.
- Core covers request/response anatomy, safe/idempotent methods, 201/202/204 and error statuses, resource/URI/representation, REST constraints, formats, validation, OpenAPI, uniform errors and compatibility.
- Optional depth is explicitly labelled for pagination and extended caching; the required `ETag`/`If-None-Match`/`304` chain remains in the core. The full YAML and checkpoint catalogue are reference material usable without live projection.
- Central raw HTTP, JSON, OpenAPI and error examples agree on `/v1/predictions`, `request_id`, `schema_version`, `model_version`, `prediction_id`, `status` and result fields.
- Preserved interactions and misconceptions: `200` with error opening, parameter question, status choice, REST false-signals, format choice, contract cross-check, compatibility question and final correction table.
- Preserved executable checkpoints: L2.1–L2.8.
- Profile separation remains explicit: PRB table/forecast formats and SII inference/binary-or-reference representations. Only PRB is linked to practical work and homework.
- OpenAPI is pinned to 3.1.2; HTTP and cache claims point to RFC 9110/9111; JSON Schema points to Draft 2020-12; the RPD DOI defect is documented.

## Student-material scope

- Seminars 1–3 and homeworks 1–3 use only PRB paths, context and acceptance language.
- Each homework continues the matching seminar branch and defines a separate at-home checkpoint while contributing evidence to the same RPD work score; no separate RPD homework bank is claimed.
- All examples require synthetic/local data and forbid production hosts and secrets.

## External repository verification follow-up

The referenced `seminar/01-api-scenarios`, `seminar/02-rest-openapi-contract` and `seminar/03-http-diagnostics` branches and their teacher mirrors could not be inspected from an authorized clean snapshot on 2026-08-31. The configured GitHub account `TheTonyPub` is present, but `gh auth status` reports an invalid token; no sibling clone is available. External repositories were not mutated. After re-authentication, verify that each branch exposes `profiles/prb`, that the documented starter paths and commands exist, and that OpenAPI declares `3.1.2`. Record mismatches as a new follow-up change.
