# Presentation mapping and QA

Completed on 2026-08-31 for the two final 16:9, 22-slide decks.

## Lecture 1 slide map

| Slides | Live time | Script coverage | Profile and teaching action | Principal source role |
|---|---:|---|---|---|
| 1–2 | 0–8 | opening problem and observable contract | `COMMON`; diagnose interface versus implementation | lecture script; both RPD topic 1.1 |
| 3–7 | 8–20 | consumer goal, request/response, hidden implementation | `COMMON`; prediction and misconception checks | university methodical guide; curriculum maps |
| 8–10 | 20–35 | module, service, boundary and dependency | `COMMON`; boundary classification | RPD learning outcomes; author-selected explanation |
| 11–13 | 35–50 | synchronous pipeline and failure path | `COMMON`; reconstruct the path | lecture script; official HTTP detail deferred to lecture 2 |
| 14–15 | 50–63 | lifecycle and external integration pressure | `COMMON`; lifecycle ordering | both RPDs; curriculum maps |
| 16–18 | 63–74 | PRB forecast/CRM/ERP/BI path | `PRB`; bridge to practical work 1 | PRB RPD and course plan |
| 19 | 74–78 | SII inference/feedback/model path | `SII`, lecture only | SII RPD and course plan |
| 20–21 | 78–86 | contract assembly and four-minute interaction | `COMMON`; learner-produced boundary | lecture script checkpoints |
| 22 | 86–90 | synthesis and bridge to HTTP/OpenAPI | `COMMON`; exit check | lecture script summary |

## Lecture 2 slide map

| Slides | Live time | Script coverage | Profile and teaching action | Principal source role |
|---|---:|---|---|---|
| 1–2 | 0–7 | opening anti-pattern: `200 OK` with an error body | `COMMON`; predict client observation | RFC 9110; lecture script |
| 3–5 | 7–20 | HTTP request and response anatomy | `COMMON`; identify method, URI, headers, body, status | RFC 9110 |
| 6–8 | 20–33 | safe/idempotent, success statuses, retry | `COMMON`; classify retries and outcomes | RFC 9110 sections 9 and 15 |
| 9–13 | 33–54 | HTTP versus REST, resources, lifecycle and conditional GET | `COMMON`; resource modelling and cache walkthrough | REST literature; RFC 9110/9111 |
| 14 | 54–57 | representation format choice | `COMMON`; choose by next operation | both RPDs; lecture script |
| 15 | 57–60 | forecast and batch exchange | `PRB`; bridge to practical works 2–3 | PRB RPD topic 1.2 |
| 16 | 60–62 | body, binary payload or object URI | `SII`, lecture only | SII RPD topic 1.2 |
| 17–18 | 62–71 | OpenAPI 3.1.2, JSON Schema and version separation | `COMMON`; inspect contract layers | OpenAPI 3.1.2; JSON Schema 2020-12 |
| 19 | 71–81 | consistency across HTTP, examples, schemas and errors | `COMMON`; find the first mismatch | official specifications; lecture script |
| 20 | 81–87 | structural and semantic compatibility | `COMMON`; consumer-view analysis | verified API-evolution article |
| 21–22 | 87–90 | four-minute contract exercise, synthesis and bridge | `COMMON`; exit check | lecture script summary |

## Speaker notes and sources

- Every slide in both decks has speaker notes and exactly one `[Sources]` block.
- Notes include timing and the intended explanation or interaction. Profile slides state whether they are `PRB` lecture-plus-practice or `SII` lecture-only.
- External claims use stable locators. The only remaining external-photo slide in lecture 1 retains its attribution and permission basis; profile diagrams are editable native shapes.

## Visual and structural QA

- Both decks contain 22 slides, 22 notes parts and 22 `[Sources]` markers; both ZIP packages pass integrity checks.
- All slides were rendered and reviewed as montages and at full size. Template remnants found during review were corrected before the final pass.
- Automated overflow checks pass for both decks with no detected overflow.
- Template-fidelity checks pass for both decks with zero issues. The revised lecture 1 deck preserves inherited editable structure; lecture 2 follows the approved lecture 1 visual language.
- Typography, spacing, navy/teal/orange semantics, diagram vocabulary, profile labels and source-note treatment are consistent across the pair.
- No unresolved placeholders were observed. Lecture 2 contains no embedded external media; lecture 1 removes the two weak profile photos identified in the baseline and replaces them with editable diagrams.

## Final artifacts

- `attachments/001_api-interface-layer-and-lifecycle.pptx`
- `attachments/002_http-rest-openapi-data-contracts.pptx`
