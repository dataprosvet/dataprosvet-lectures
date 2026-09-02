# Source matrices for lectures 1–2

Verified on 2026-08-31. Source roles are explicit so that a course requirement is never inferred from an explanatory book or article. Local PDF page locators refer to PDF pages, not printed folios.

## Role legend

- **Normative** — the matching RPD defines required topics and assessed work.
- **Derived curriculum** — the course map traces RPD topics to a session; it does not outrank the RPD.
- **University method** — approved teaching procedure and exercise structure.
- **RPD-listed literature** — recommended content source named by an RPD.
- **Official specification** — normative technical semantics.
- **Author-selected explanation** — useful exposition not listed in either RPD; it cannot create a course requirement.
- **Research enrichment** — evidence or discussion for a later topic; not compulsory live content unless explicitly scheduled.

## Lecture 1 — API as interface boundary and lifecycle

| Topic | Source role | Stable locator | Use in the lecture |
|---|---|---|---|
| Required topic and outcomes, PRB | Normative | `sources/Б1.В.11 API-технологии_ПРБ_РПД.pdf`, PDF pp. 10–11, topic 1.1 | Business application, ERP/CRM/BI, forecasting and lifecycle examples. |
| Required topic and outcomes, SII | Normative | `sources/Б1.В.11 API-технологии_СИИ_РПД.pdf`, PDF pp. 10–11, topic 1.1 | Inference, data/model boundary, feedback and model-lifecycle examples. |
| Lecture/practical trace | Derived curriculum | `sources/ПЛАН_КУРСА_API-ТЕХНОЛОГИИ_ПО_РПД_ПРБ.md`, lecture 1 and seminar 1; corresponding SII lecture 1 entry | Verifies lecture coverage. Only the PRB practical is delivered in this course. |
| Context diagram and interface table | University method | `sources/API-tekhnologii-v-razrabotke-II-sistem.pdf`, PDF pp. 7–10 and 15–16 | Consumer, provider, interfaces, sync/async and context-analysis artifact. |
| API from consumer goals | Author-selected explanation | Arnaud Lauret, *The Design of Web APIs*, local PDF pp. 27–66 | Goal-first design, observable promise and implementation hiding. Lauret is not presented as RPD-listed. |
| Stable boundaries and distribution cost | RPD-listed for both profiles | Sam Newman, *Building Microservices*, local PDF pp. 18–54 and 162–190; bibliographic check: O’Reilly, 2nd ed., 2021 | Module/service boundary, coupling, latency and operational cost. Local file is used only for short paraphrases. |
| ML-system dataflow and lifecycle | RPD-listed for both profiles | Chip Huyen, *Designing Machine Learning Systems*, local PDF pp. 42–49 and 89–91 | PRB/SII lifecycle examples; does not transfer competencies between profiles. |
| Data-intensive boundaries | RPD-listed for both profiles | Martin Kleppmann, *Designing Data-Intensive Applications*, RPD bibliography (no local copy) | Optional conceptual cross-check; no quotation or figure reproduced. |

## Lecture 2 — HTTP, REST, OpenAPI and data contracts

| Topic | Source role | Stable locator | Use in the lecture |
|---|---|---|---|
| Required topic and outcomes, PRB | Normative | `sources/Б1.В.11 API-технологии_ПРБ_РПД.pdf`, PDF pp. 10–12, topic 1.2 | HTTP, REST, JSON/XML/CSV/Parquet, OpenAPI, validation and PRB contract. |
| Required topic and outcomes, SII | Normative | `sources/Б1.В.11 API-технологии_СИИ_РПД.pdf`, PDF pp. 10–11, topic 1.2 | HTTP, REST, JSON/XML, OpenAPI, compatibility and SII representations. |
| Lecture/practical trace | Derived curriculum | Both curriculum maps, lecture 2 and works 2–3 | Verifies both lecture profiles. Course practicals and homework remain PRB-only. |
| Validation and version metadata | University method | `sources/API-tekhnologii-v-razrabotke-II-sistem.pdf`, PDF pp. 10–11 and 17–18 | Pre-computation validation, `request_id`, API/schema/model versions and uniform errors. |
| HTTP message semantics | Official specification | [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html): §§6–8; methods §§9.2–9.3; conditions §13; statuses §15 | Request/response anatomy, safe/idempotent methods, 201/202/204, validators, conditional requests and status semantics. |
| HTTP caching | Official specification | [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html): §§3–5, especially validation §4.3 | Cacheability, freshness/revalidation and the role of `304 Not Modified`. |
| OpenAPI | Official specification | [OpenAPI Specification 3.1.2](https://spec.openapis.org/oas/v3.1.2.html), especially §§4.1–4.3 and 4.8 | Pinned taught patch. The moving `latest` URL is not used as the contract target. |
| JSON Schema | Official specification | [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12), Core and Validation | Constraints used by OAS 3.1 Schema Objects and validation examples. |
| REST resources and representations | RPD-listed for both profiles | Richardson, Amundsen, Ruby, *RESTful Web APIs*, O’Reilly 2013, publisher record `9781449359713` | Resource/representation distinctions and hypermedia context; paraphrase only. |
| Practical API design | RPD-listed for both profiles | Masse, *REST API Design Rulebook*, O’Reilly 2011, RPD bibliography | Supporting design rules, subordinate to RFC semantics. |
| Goal-to-resource explanation | Author-selected explanation | Lauret, *The Design of Web APIs*, local PDF pp. 67–130 | Teaching sequence from consumer goal to path/method/schema. |
| Contract evolution | Research enrichment for lecture 2 | *Microservice API Evolution in Practice*, JSS 215 (2024), article 112110, [DOI 10.1016/j.jss.2024.112110](https://doi.org/10.1016/j.jss.2024.112110) | Short evidence-based compatibility discussion. The SII RPD/course map prints incorrect DOI `10.1016/j.jss.2024.112081`; the source document is not rewritten. |
| Automated REST API testing survey | Research enrichment for practical 3/later testing | Golmohammadi, Zhang, Arcuri, *Testing RESTful APIs: A Survey*, TOSEM 33(1), article 27, [DOI 10.1145/3617175](https://doi.org/10.1145/3617175) | Motivates reproducible setup and contract-derived checks; not forced into the 90-minute core. The course map’s article number 14 is inconsistent with the publication’s article 27. |
| Testing rationale and challenges | Research enrichment for practical 3/later testing | Golmohammadi, Arcuri, *Applied Sciences* 12(9), 4369, [DOI 10.3390/app12094369](https://doi.org/10.3390/app12094369) | Optional teacher reading for diagnostics and test design. |

## Placement and copyright review

- Live lecture 1 uses RPDs, course maps, the university guide and short paraphrases from books; no textbook figure is copied.
- Live lecture 2 uses official RFC/OAS/JSON Schema semantics. The evolution article contributes one paraphrased observation. The two testing papers belong primarily to practical work 3 and later testing material.
- Examples, diagrams and payloads are course-authored and synthetic. External book covers, pages and figures are not reproduced.
- Any future external image must have an explicit permission basis in slide notes. Otherwise use original editable diagrams.
