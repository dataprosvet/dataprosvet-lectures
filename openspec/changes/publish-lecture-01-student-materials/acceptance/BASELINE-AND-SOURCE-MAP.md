# Lecture 1 baseline and source map

## Preservation baseline

Recorded before implementation on 2026-09-02.

| Path | SHA-256 | Lines | Words | Role |
|---|---|---:|---:|---|
| `course.yaml` | `9d66529c41c011c09d2c8328accc6953d71e1ca83599142e07ae1979b404c57e` | 32 | 196 | Publication manifest before Markdown declarations |
| `lectures/001_api-tech-introduction.md` | `1c3d60c5740f456fa133e29c4963641b18c571cd9ded11176ed1f7217fc074b2` | 330 | 2259 | Presentation-derived complete student lecture |
| `attachments/lecture_1.pdf` | `46ac3842afb7fb11242926a5bb6901fc625c647ec339cdf1f42ce12cd51f8d48` | 26 pages | - | Published presentation basis |
| `lectures-teacher/001_api-interface-layer-and-lifecycle.md` | `d82dbfb92b5c7e51f8e0b29a43268b5e565e81ae5b362bf7856cf98907a4d891` | 547 | 4287 | Preserved teacher source |
| `revise-first-two-api-lectures-and-prb-practicals/specs/lecture-01-api-interface-layer/spec.md` | `78a3abe66b63eaad42fb66311c26229f0e7c3106e78300b45bf7ba843bdf5734` | 35 | 433 | Prerequisite numbered-capability delta |

The complete lecture initially had one local link, to `../attachments/lecture_1.pdf`. Its headings covered tiers, CORBA, SOAP/WSDL, REST, gRPC, ML-system goals and components, inference scaling, model lifecycle, RAISA, mistakes, summary, and self-check. The teacher script and unrelated untracked course materials are user-owned and must remain unchanged.

## Capability reconciliation

`openspec/specs/lecture-01-api-interface-layer/spec.md` is not yet present in the main spec tree. The active `revise-first-two-api-lectures-and-prb-practicals` change introduces it with requirements for the dual-profile teacher script, source traceability, and presentation QA. This change adds requirements for the complete student lecture, concise note, presentation-derived scope, and manifest declaration.

The two deltas are additive: they use different requirement names, preserve one numbered capability, and do not redefine each other's owned files. The prerequisite change must be applied and archived first; this change can be implemented now against the reconciled delta pair and archived after the prerequisite capability exists in main specs.

## Slide-to-student-material map

| PDF page | Presentation topic | Classification | Student-material treatment |
|---:|---|---|---|
| 1 | Blank/export cover | Omit | No educational claim |
| 2 | Introduction and basic concepts | Core | Lecture purpose and orientation |
| 3 | Local applications, 1-Tier | Core | Definition, strengths, limits, examples |
| 4 | 2-Tier client-server architecture | Core | Definition and responsibility split |
| 5 | 2-Tier direct access, procedures, bottleneck | Core | Conditional trade-offs; no universal bottleneck claim |
| 6 | 3-Tier architecture | Core | Presentation, application, and data layers |
| 7 | Tier comparison | Core | Compact comparison with qualified scale/security claims |
| 8 | CORBA | Bounded orientation for lecture 3 | IDL, ORB, IIOP and historical contract role |
| 9 | SOAP, WSDL, XML Schema, WS-* | Bounded orientation for lectures 2-3 | Contract role and enterprise context only |
| 10 | SOAP/WSDL/UDDI stack | Bounded orientation for lectures 2-3 | Glossary-level relationship |
| 11 | REST resource approach | Bounded orientation for lecture 2 | Resource and uniform-interface overview only |
| 12 | REST constraints | Bounded orientation for lecture 2 | Client-server, statelessness, cache, layers at survey depth |
| 13 | gRPC and Protocol Buffers | Bounded orientation for lecture 3 | Contract, HTTP/2, streaming, typical context |
| 14 | CORBA/SOAP/REST/gRPC comparison | Bounded orientation for lecture 3 | Conditional comparison; no universal ranking |
| 15 | API in AI-system architecture | Core transition | Bridge from interface contracts to ML systems |
| 16 | ML-system design goals | Core | Scale, latency, reliability, adaptability, explainability as measurable goals |
| 17 | Traditional versus ML systems | Core | Code/data/model differences and silent failures |
| 18 | ML-system components | Core | Data, features, training, registry, inference, monitoring |
| 19 | Inference request path | Core | Client-to-model pipeline and privacy warning |
| 20 | Scaling techniques | Core with production caveats | Scale-out, queues, caching, partitioning, autoscaling with costs |
| 21 | Model lifecycle section divider | Core | Transition only |
| 22 | Model lifecycle stages | Core | Six-stage lifecycle checklist |
| 23 | RAISA section divider | Profile illustration | Identified as a platform example, not a universal architecture |
| 24 | RAISA functional landscape | Profile illustration / bounded lecture-9 orientation | Summarized without reproducing the figure |
| 25 | RAISA architecture | Profile illustration / bounded lecture-9 orientation | Platform decomposition only |
| 26 | DataOps, ModelOps, AnalyticOps, Low-code | Profile illustration / bounded lecture-9 orientation | Definitions and API linkage; no product prescription |

## Source locations and roles

| Role | Source | Stable location used for verification |
|---|---|---|
| Normative `PRB` | `sources/Б1.В.11 API-технологии_ПРБ_РПД.pdf` | Table 3 and topic 1.1, PDF pages 10-11 |
| Normative `SII` | `sources/Б1.В.11 API-технологии_СИИ_РПД.pdf` | Table 3 and topic 1.1, PDF pages 10-11 |
| Derived `PRB` curriculum | `sources/ПЛАН_КУРСА_API-ТЕХНОЛОГИИ_ПО_РПД_ПРБ.md` | “Лекция 1” and PRB seminar/work 1 mapping |
| Derived `SII` curriculum | `sources/ПЛАН_КУРСА_API-ТЕХНОЛОГИИ_ПО_РПД_СИИ.md` | “Лекция 1” entry; used for lecture meaning only, not delivered practical scope |
| University methodical guide | `sources/API-tekhnologii-v-razrabotke-II-sistem.pdf` | Introduction, §§ 1.1-1.2 and task 1, PDF pages 7-10 and 15-16 |
| Consumer-oriented API explanation | `sources/dokumen_pub_the_design_of_web_apis_1nbsped_1617295108_978_1617295102.pdf` | Chapters 1-2, PDF pages 27-66 |
| Architecture explanation | `sources/dokumen_pub_building_microservices_designing_fine_grained_systems.pdf` | Chapters 1 and 5, PDF pages 18-54 and 162-190 |
| ML-system context | `sources/dokumen_pub_designing_machine_learning_systems_an_iterative_process.pdf` | System context, PDF pages 42-49; data flows, pages 89-91 |
| Immediate presentation basis | `attachments/lecture_1.pdf` | All 26 pages, classified above |

Source priority is matching RPD, derived curriculum plan, university methodical guide, relevant technical/architecture literature, then presentation shorthand and author-created explanation. No source text or external figure is copied into the student Markdown.
