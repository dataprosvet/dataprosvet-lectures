# Preservation baseline

Recorded before implementation on 2026-08-31. Repository HEAD: `70f92eec6c28aed109f99a5b76bf9b589c00081f`.

## Target checksums

| Path | SHA-256 |
|---|---|
| `openspec/config.yaml` | `11cd4a4bcda5759e0251b81fda43c47484c1f447595b354233b8a5b8ff848a71` |
| `lectures-teacher/001_api-interface-layer-and-lifecycle.md` | `3bc42aacd7f9fc7bf186b7e5e910995d50dc85d4c3700b1c012f2b47155df2a5` |
| `lectures-teacher/002_http-rest-openapi-data-contracts.md` | `7c9a230444226b52ef63c9ea57d84521c426295c47400b2913283b63dca3cad2` |
| `seminars/001_api-scenarios-and-context.md` | `4db8ae3fcef313f1700f774926e42690bf6b2841e71e7226258d2c0894805f3a` |
| `seminars/002_rest-openapi-contract.md` | `8640ed168ec17d45b50dcecb5e0074df9440937dbfe26194bbc01bc08ee9c067` |
| `seminars/003_http-api-diagnostics.md` | `0ca63acab783ea69f2075986c25c92083899bf29bf6e09cfe006ad9b186c3f8a` |
| `homeworks/001_api-scenarios.md` | `53944f894461be543168cb9947a8341e8d6f31fdcae8b4cd4d7dfab7692564b6` |
| `homeworks/002_rest-openapi-contract.md` | `cb30bf82c4934b12540a5c5ed6b6087e60b2c441f8bd49780c5f2ace4836508c` |
| `homeworks/003_http-api-diagnostics.md` | `095d72abf055b144d3db1d9e8e313027e050a2daf0ca4e5866b6d09d2b8ac71b` |
| `attachments/001_api-interface-layer-and-lifecycle.pptx` | `e210022c6d43b6f015d3c1abaa8d50b17de5ecf3a1529e2963ff45a12ddb09f0` |

`course.yaml` is absent. The tracked publisher template is out of scope.

## Lecture content baseline

- Lecture 1: 541 lines, 4,168 words, eight continuous timed blocks covering 0–90 minutes, `COMMON` plus `PRB` and `SII`, checkpoints L1.1–L1.6.
- Lecture 2: 823 lines, 5,392 words, nine continuous timed blocks covering 0–90 minutes, `COMMON` plus `PRB` and `SII`, checkpoints L2.1–L2.8.
- Both scripts contain profile labels, code links, RPD coverage, a source map, interactions, misconceptions, and teacher checklists.
- Existing practicals 1–3 present a profile choice; homework 3 contains an explicit SII continuation. These are intentional targets of this change.

## Lecture 1 deck baseline

- 22 slides, 16:9, three embedded JPEG images, no charts or native tables.
- All 22 slides render; automated overflow check passes.
- All 22 slides contain speaker notes and a `[Sources]` block.
- Visual review findings: the repeated alternating split becomes mechanical; most diagrams occupy a small part of the visual frame; body copy is readable but visually light for projection; external photos on network complexity, retail, and leaf inference have inconsistent relevance and treatment; several conceptual slides would benefit from stronger hierarchy and fewer small labels; the deck is coherent but not yet visually approved.
- No source or target deck was overwritten during baseline inspection.

## Out-of-scope preservation checksums

| Path | SHA-256 |
|---|---|
| `lectures-teacher/003_integration-styles-api.md` | `6ad736186b94300f89a8e9b751c7887c3ab3d6e523bf929e8a73aab14cab5020` |
| `lectures-teacher/004_python-api-services-fastapi.md` | `a136438d7d8472d0c1b6ca0129342e274df927f7c80a276e4bb45b1680654f3c` |
| `seminars/004_integration-style-selection.md` | `a17a6e45b200f355cfa12fa7c7a5e528d83614514c259ce954ac9541591b9dd7` |
| `seminars/005_fastapi-service-foundation.md` | `c533fcc5d6d1ac34f21428ef0db9a871ff1c5e698cbd34d4f302236b0f69566d` |
| `seminars/006_fastapi-validation-openapi.md` | `c39bd88bc22b4e8d74ab4d500ed3d7aacddfba506b5c00a8095ba2cef7084ccc` |
| `homeworks/004_integration-style-decision.md` | `3aa071e7c139bba6107000f2a69d5b641080ad4f30979e71688fc79fb2a1c68d` |
| `homeworks/005_fastapi-service.md` | `2a3a2c066ca0124627f5e77afab6a0c91662a28d68db7aa487688b4b8a0a045a` |
| `README.md` | `b4f3568545f1354d1206ed4a7e5da28ecca1e7a2ce4a36644e0b2c54752e1649` |
| `course.yaml.example` | `388113cf4cfceb727e3fe37b723fcb9cf47beb5e1e852238abbdfc128a0eb3a6` |

The private student and teacher code repositories are not present as sibling local repositories. This change therefore cannot mutate them; authorized remote branch verification is recorded separately when attempted.

