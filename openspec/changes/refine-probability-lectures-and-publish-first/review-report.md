# Review report: probability lecture refinement and staged release

## Status and review boundary

This is the active, versioned review record for the final editorial pass and the staged publication of lecture one. It supersedes the local historical audit now archived under `sources/archive/`. The acceptance matrix remains open until content, publisher, deployment, and production checks are complete.

Review boundary:

- preserve the eight-lecture sequence and RPD scope;
- allow only bounded, source-grounded editorial changes in `lectures-teacher/`;
- create a complete student lecture and retain a distinct concise note for every lecture;
- publish only the course and lecture one, with complete and concise Markdown;
- keep lecture 2–8 text, teacher scripts, sources, OpenSpec, the historical audit, and the PPTX outside the public plan.

## Source map

| Source | Authority in this review |
|---|---|
| `sources/Б1.О.09.01 Теория вероятностей РПД СИИ ПРБ.pdf` | Normative lecture sequence, workload, required topics, assessment materials, cases, and learning outcomes |
| `sources/Gmurman_V_E_Teoria_veroyatnostey_i_matematicheskaya_statistika.pdf` | Primary definitions, theorem statements, derivations, notation comparison, and core exercises |
| `sources/математика для машинного обучения.pdf` | Applied interpretation for data and machine-learning models |
| `sources/Glubokoe_obuchenie_Pogruzhenie_v_mir_neyronnykh_setey.pdf` | Relevant uncertainty, probabilistic-model, and neural-network context |
| `sources/4816 методичка ТВМС.pdf` and `sources/Savyolova_Metodicheskie_ukazaniya_k_resheniyu_zadach_po_veroyatnostnym_razdelam_2014.pdf` | Targeted exercises and computational practice |
| `sources/Savelova_Metod_Monte-Karlo_2011.pdf` and `sources/2_5451720465485703829.pdf` | Monte Carlo and optional enrichment |
| `sources/ПЛАН_КУРСА_ТЕОРИЯ_ВЕРОЯТНОСТЕЙ_ПО_РПД.md` | Stable curriculum map derived from the RPD |
| `sources/PLAN_LECTURE_REVISIONS_1_8.md` | Recorded revision decisions |
| `sources/archive/AUDIT_LECTURES_1_8.superseded.md` | Historical findings only; not active acceptance guidance |

## Baseline captured before implementation

Baseline commit branch: `courses/probability-theory`. The working tree contained no user-content edits; only `.agents/` and this new change were untracked. `lectures/` contained only `.gitkeep`.

### Teacher scripts

| Lecture | Lines | Words | Headings | SHA-256 |
|---:|---:|---:|---:|---|
| 1 | 979 | 5,017 | 65 | `b9d05e0eae8bbc8eda3de5f8367ed44531d14455dde4987ffd6d84438ad45d02` |
| 2 | 1,271 | 6,052 | 88 | `7655f5cfa76751ac9b674fd506e25ea92d73e22fba260a4560a76a5c150c9cf0` |
| 3 | 1,266 | 4,447 | 78 | `e9481524acd64304f58f3af69109091e5b5b96928ad55850afe596a769f1fc42` |
| 4 | 819 | 3,664 | 59 | `1331e3ad4fbd3eb429460f65a1597bd54d6c6e4e4cfed9d64f927be5a50023a0` |
| 5 | 878 | 3,846 | 61 | `9292ebc76399ca2539ef02bc94d1b1f0dba03b0160680e599792ec6456b04a2c` |
| 6 | 638 | 2,307 | 30 | `53a608e2c6e5b9f47788ef52708cfe51e0c3b28ec618af9e38c25c5dbb116796` |
| 7 | 664 | 2,189 | 32 | `fb0cc188ead13434a9499562ed0ef74cafe9509cc4067d1f78afd5358f2fb2d1` |
| 8 | 604 | 2,829 | 34 | `b5eabc361fec9e31b8be8c6fa9a1954d9a5547ce798ee54e2f7ab18eb6df6c43` |

Heading inventories were captured with `rg -n '^#{1,4} ' lectures-teacher/*.md`. Every script contained purpose/progression, outcomes, prerequisite knowledge, worked examples, interaction or self-check, RPD coverage, and sources. Lectures 1–5 also contain reproducible computation where relevant; lectures 6–8 already include the expansions requested by the historical audit.

### Concise notes

| Lecture | Lines | Words | Headings | SHA-256 |
|---:|---:|---:|---:|---|
| 1 | 158 | 741 | 15 | `c8effc0637a48a2ea7423fd3446ab6aed423449d2d4949d3189241cfd5cb06e2` |
| 2 | 151 | 628 | 10 | `a388e41d8dfcb0af35d2461229471f4411b62ec8a80f894756e084a1c77b9b80` |
| 3 | 169 | 596 | 12 | `a7410c123f36d01d5da0487ccd6a8ad68c68f458bfcae847cc28e9c1cf68ad06` |
| 4 | 174 | 615 | 13 | `35d3a105e680842365ccd6dc3d7ca9060789213e042057512fb9a65bafed6920` |
| 5 | 148 | 635 | 8 | `f0eea12f80168a9d22def3ea2c31e722cad3663f083eba413b22eaf4a2d35e08` |
| 6 | 169 | 530 | 9 | `28e66192755c26c97938cf1437e14126b742741c656ed4b4ba1e5ecc4cec9e83` |
| 7 | 187 | 509 | 9 | `7ce6bebc54d235574c3566eeaa06b0fcbbcfa6bb7f1a7d8c220f51c6` |
| 8 | 178 | 790 | 11 | `8ec52f644efa3531223048934f5b4ae7d457576d6a36d9149ad2f5cb405d26f7` |

Correction: the full lecture-7 baseline hash is `7ce6bebc54d235574c3566ee742fd0eeaa06b0fcbbcfa6bb7f1a7d8c220f51c6`.

### Assets and attachment

All eight PNG files and `attachments/lecture_1.pptx` were tracked. The PPTX baseline was 943,832 bytes with SHA-256 `a37076eb2bb47c67b72c298e45e17bfa2e19b99aaf12f791037fb40d998af7e8`. The image hashes were captured in the command log and will be compared before release.

### Manifest and deterministic plan

At baseline the course and lecture one were `published` / `available`, but lecture one declared no text. Lectures 2–8 were `published` / `inDevelopment` and incorrectly retained `briefMarkdown` declarations. The PPTX declaration was commented out.

Publisher validation command:

```text
COURSE_ROOT=../.. GITHUB_REF_NAME=courses/probability-theory npm run validate
```

Baseline result: success, plan digest `c28598dec50ead8b1434a8e843edf26b2bbbacbc9e5d1a1fc146aac63a92d46f`. The plan contained metadata for eight lectures, concise content for lectures 2–8, no lecture-one text, and no PPTX. Diagnostics identified lecture-one concise text, its PNG, and the PPTX as dormant. This plan does not satisfy the staged-release target and must not be deployed unchanged.

## Current findings and disposition of historical findings

| Finding | Current disposition |
|---|---|
| Lecture 1 concise note omitted event classifications | Resolved: joint, opposite, full-group, dependent, and independent classifications restored |
| Lecture 3 slide references and coverage-matrix errors | Resolved in current teacher script |
| Lecture 4 incomplete transition and numbering | Resolved in current teacher script |
| Lecture 5 `F_X` boundary mismatch | Resolved by explicit modern-convention translation |
| Lecture 6 insufficient depth and incomplete conditional laws | Resolved in current teacher script; preserve the full joint example |
| Lecture 7 insufficient depth and structure | Resolved in current teacher script; normative graph remains absent |
| Lecture 8 missing prerequisites/general Chebyshev form | Resolved in current teacher script; preserve exact statement |
| Uneven cross-lecture transitions | Resolved in the current teacher scripts and preserved in the student progression |
| Teacher scripts lacked one-click source navigation | Resolved: all eight scripts link to local PDFs with chapter/section and PDF-page locators |

## Persistent normative blockers

- **КР 3.5:** the RPD refers to a graph that is absent from the supplied PDF. No official numeric solution can be reconstructed. Lecture 7 may keep only an explicitly labelled educational analogue until the graph is supplied.
- **ИДЗ 6.3:** the RPD does not state that the random variables are independent. The accepted solution is the covariance-aware general formula, followed by a separate conditional result under an explicit independence assumption.

These are external source defects, not release failures, provided the materials preserve the warnings and do not fabricate conditions or data.

## Per-lecture preservation and acceptance matrix

All eight content families passed preservation, student-boundary, and independent-calculation review. Publication status remains a separate gate below.

| Lecture | Teacher sequence and scope | Worked meaning | RPD/defect handling | Complete student lecture | Concise note | Independent checks | Final status |
|---:|---|---|---|---|---|---|---|
| 1 | preserved | preserved | preserved | pass | corrected/pass | pass | accepted |
| 2 | preserved | preserved | planned-error activity preserved | pass | pass | pass | accepted |
| 3 | preserved | preserved | preserved | pass | pass | pass | accepted |
| 4 | preserved | preserved | preserved | pass | pass | pass | accepted |
| 5 | preserved | preserved | case-data conflict preserved | pass | pass | pass | accepted |
| 6 | preserved | preserved | ИДЗ 6.3 warning preserved | pass | pass | pass | accepted |
| 7 | preserved | preserved | КР 3.5 blocker preserved | pass | pass | pass | accepted |
| 8 | preserved | preserved | general Chebyshev form preserved | pass | pass | pass | accepted |

## Independent-calculation log

Checks were run with Python standard-library arithmetic (`fractions`, `math`, exact binomial sums). Program output is verification evidence only; each lecture retains the mathematical derivation.

| Lecture | Check | Independent result | Status |
|---:|---|---|---|
| 1 | $C_6^3$, $A_6^3$, five-digit counts | $20$, $120$, $6480$ with repetition, $600$ without | pass |
| 2 | urn probability and meeting geometry | $10/21$ and $7/16$ | pass |
| 3 | three aces; independent reserve system | $1/5525$ and $0.98$ | pass |
| 4 | total probability, Bayes, diagnostic posterior, Bernoulli, Poisson | $0.032$, $0.625$, $0.1610169$, $0.4096$, $0.1804470$ | pass |
| 5 | $\operatorname{Bin}(3,0.2)$ and corrected RPD case tail | $0.384$ and $0.08146$ | pass |
| 6 | variance, covariance, correlation, conditional independence result | $1.24$, $0.1$, $0.4082483$, $\sqrt{5.26}=2.293469$ | pass |
| 7 | polynomial interval probability, variance, exponential reliability | $0.875$, $3/80$, $e^{-1.5}=0.2231302$ | pass |
| 8 | normal interval, Chebyshev bound, exact two-sided binomial p-value | $0.7745375$, $8/9$, $0.00351764$ | pass |

## Publication acceptance

| Gate | Expected | Status |
|---|---|---|
| OpenSpec strict validation | zero errors | pass; 5 items passed |
| Publisher validation | zero errors | pass; final digest `eb67f7466ab97507058bfa375535a28dc71c1ec94d791b06e68952dfb79c37b6` |
| Public plan allowlist | course + lecture-one full/concise Markdown + referenced lecture-one images only | pass; one full Markdown, one concise Markdown, one referenced PNG |
| PPTX | tracked, dormant, absent from plan | pass |
| Lecture 2–8 text | tracked, dormant, absent from plan | pass; 14 dormant content diagnostics |
| Teacher/source/audit/OpenSpec content | absent from plan | pass |
| Production site | exact staged-release behavior | pending |

The first staged validation identified the same lecture-one PNG in both student variants and rejected the duplicate asset key. The concise note did not require the illustration, so its duplicate embed was removed; the full lecture remains the single public owner. Regenerated validation then passed with the exact allowlist above.

Repository acceptance also passed all 47 publisher tests, JavaScript syntax lint, UTF-8 and size checks, teacher-only leakage scans, and `git diff --check`. Final teacher diffs contain only bounded oral-readability edits, the heading normalization in lecture 6, and the requested source navigators; no mathematical section, timing aid, interaction, worked solution, RPD warning, coverage record, or computational appendix was removed.

The exact release commit scope is the 30 staged course/content/OpenSpec paths listed by `git diff --cached --stat`; `.agents/` and the ignored `sources/` corpus are excluded. The production course branch was already four commits ahead of its remote: three commits implementing dormant-resource publisher support plus their merge. Those prerequisite commits are already present on the remote feature branch and are required for the staged manifest behavior; pushing the course branch will advance it through that reviewed baseline and this course change together.
