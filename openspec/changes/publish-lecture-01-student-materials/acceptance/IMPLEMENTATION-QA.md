# Lecture 1 student-material implementation QA

## Implemented files

- `lectures/001_api-tech-introduction.md` is the complete `COMMON` lecture, with an explicit presentation link, prerequisites, later-lecture boundaries, API definition, qualified architecture comparisons, ML-system request path, lifecycle, summary, self-check, and a visibly PRB-only seminar link.
- `lecture-notes/001_api-tech-introduction.md` is a recall-oriented brief with the required glossary, two compact comparison maps, inference flow, lifecycle checklist, warnings, final minimum, and self-check.
- `course.yaml` declares the complete and brief Markdown under the existing `api-tech-introduction` record and preserves its previous identity and PDF attachment.

## Complete-versus-brief differentiation

| Check | Complete lecture | Concise note | Result |
|---|---:|---:|---|
| `wc -w` word count | 2429 | 822 | Brief is 33.84%; below the 50% limit |
| Tokenizer word count | 2196 | 715 | Brief is 32.56%; below the 50% limit |
| Non-title headings | 24 | 9 | Zero exact shared headings |
| Reading job | Explanatory progression | Glossary and retrieval maps | Distinct |

The brief contains all required terms: API, API contract, 1-Tier, 2-Tier, 3-Tier, CORBA, SOAP, WSDL, REST, gRPC, inference API, feature store, model registry, drift, DataOps, ModelOps, and model lifecycle.

## Consistency and boundaries

- Both files agree that an API is an observable contract boundary rather than a URL or implementation detail.
- Both use the same tier responsibilities and conditional architecture trade-offs.
- Both compare CORBA, SOAP/WSDL, REST, and gRPC as contexts, not as a universal performance ranking.
- Both use the same inference sequence: client, load balancing, API validation, feature/preprocessing work, conditional cache, model server, result/metadata, logging and monitoring.
- Both use the same six lifecycle stages: business analysis, data work, model development, validation, deployment, and monitoring/update.
- Detailed HTTP/REST/OpenAPI remains lecture 2; integration-style selection remains lecture 3; profile architecture synthesis remains lecture 9.
- RAISA is presented only as a platform-decomposition illustration.
- The learning path is `COMMON`. Seminar 1 is linked and labeled only `PRB`; no SII practical is implied.

## Links and safety

- All six local Markdown links across the two student files resolve in the working tree.
- Linked files are inside the documented publication/support roots: `attachments/`, `lectures/`, `lecture-notes/`, and `seminars/`.
- No raw HTML, teacher markers, lecturer timing, hidden answers, production endpoint, embedded credential pattern, external figure, or executable code was added.
- Privacy warnings explicitly prevent uncontrolled logging of personal or confidential inference data.
- The teacher script hash remains `d82dbfb92b5c7e51f8e0b29a43268b5e565e81ae5b362bf7856cf98907a4d891`.
- The presentation hash remains `46ac3842afb7fb11242926a5bb6901fc625c647ec339cdf1f42ce12cd51f8d48`.

## Publication validation

The production publisher cannot treat untracked new Markdown as publishable from the read-only working `.git` index. Validation therefore used a temporary Git repository built from `git archive HEAD` plus only the current `course.yaml`, complete lecture, and concise note. The main working index was not modified.

Production-equivalent validation succeeded for branch `courses/api-technologies` with digest `24068f89856ed4737d7e6bc97efbfb271c4c1354bd120a12eac8aebba103b8a7`. The resulting plan contains exactly:

- one `lecture/api-tech-introduction` material;
- one complete content path, `lectures/001_api-tech-introduction.md`;
- one brief content path, `lecture-notes/001_api-tech-introduction.md`;
- one existing attachment, `attachments/lecture_1.pdf`;
- zero generated image assets and zero missing declarations.

External code-repository and clean-clone guidance is inapplicable because this change adds no executable example, branch link, code cutover, or repository mutation.

## Human-centered editorial revision

The complete lecture and concise note were revised into natural student-facing Russian. The new narrative follows one concrete action — pressing “Получить прогноз” — from the client through the API to the model, uses plain-language transitions between architectural stages, replaces avoidable English operational jargon, and explains trade-offs before naming mechanisms. Required definitions, profile boundaries, later-lecture boundaries, warnings, and the two distinct reading jobs remain intact.

| Check | Complete lecture | Concise note | Result |
|---|---:|---:|---|
| `wc -w` word count | 2853 | 994 | Brief is 34.84%; below the 50% limit |
| Whitespace-token count | 2847 | 992 | Brief is 34.84%; below the 50% limit |
| Non-title headings | 23 | 10 | Zero exact shared headings |
| Reading job | Connected explanation with examples | Ten-minute recall guide | Distinct |

- All 17 required concise-note terms remain present and consistent with the complete lecture.
- Both remaining local Markdown links resolve; the missing PRB seminar target was changed to an explicit “published separately” statement instead of leaving a broken link.
- Content-safety scans found no raw HTML, teacher cues, hidden answers, credential patterns, or production endpoints.
- The presentation checksum remains `46ac3842afb7fb11242926a5bb6901fc625c647ec339cdf1f42ce12cd51f8d48`.
- `lectures-teacher/001_api-interface-layer-and-lifecycle.md` and `seminars/001_api-scenarios-and-context.md`, which existed at the earlier baseline, were absent before final editorial validation. This revision did not recreate or modify those out-of-scope user-owned files; their earlier checksums therefore cannot be reconfirmed from the current working tree.
- `course.yaml` received no editorial change; its existing two lecture-1 Markdown declarations remain the only tracked manifest diff.
- Production-equivalent publisher validation succeeded with digest `87a742ad463003013758d4e30c26687cbf428ae38c5abe70488ab32be6e65456` and still produced exactly one complete Markdown, one concise Markdown, and the unchanged PDF attachment.
