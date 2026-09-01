## Why

The course's eight-lecture structure and its seminar sequence no longer match the newest topic plan supplied on 2026-08-31. The course needs a source-grounded realignment that preserves the approved workload and assessment obligations while making every lecture, seminar, and formal individual homework independently specified, teachable, reviewable, and publication-safe.

## What Changes

- Treat the supplied one-page lecture plan as the newest authority for lecture boundaries and ordering, while retaining the RPD/OMD as authority for workload, learning outcomes, individual assignments, control works, and assessment except where the newer plan explicitly supersedes topic placement.
- Store the supplied PDF under `sources/` and document its role in the source hierarchy; `sources/` remains ignored and unpublished.
- Replace the current lecture progression with seven required topic meetings plus an eighth optional meeting on bivariate random variables. If lecture 8 is not taught, its time is used to complete lectures 1-7; no seminar is allocated to lecture 8.
- Rebuild all teacher, full-student, and concise-student lecture variants against the new boundaries, preserving mathematical conditions, source traceability, worked-result meaning, and publication separation.
- Realign all 17 seminars to the new lecture progression. Each seminar contains 15-20 purposeful problems, including applied data, business, reliability, and machine-learning contexts where mathematically appropriate.
- Maintain distinct teacher and public seminar products. The teacher version gives a complete, checked, step-by-step solution and teaching notes for every problem. The public version gives full solutions only for representative problem types and leaves the remaining problems as statements without answers or solution leakage.
- Maintain seven formal individual homework packages (ИДЗ 1-7), each as its own capability. Short preparation prompts or error-correction work that is local to a seminar remains governed by that seminar rather than becoming an additional formal homework product.
- Use the complete local source corpus for definitions, proofs, examples, exercise selection, computational enrichment, and applications, with special emphasis on probability modeling in machine learning. Source use must be transformative and must not reproduce copyrighted passages or exercise collections wholesale.
- Preserve the documented defects in control-work task 3.5 and individual assignment 6.3, and preserve the adopted modern probability and distribution-function notation.
- Сохранить поэтапный выпуск содержимого: лекция 1 остаётся единственной записью с подключёнными полной и краткой версиями; лекции 2–8 сохраняют `published` + `inDevelopment` без текстовых действий. Добавить в `course.yaml` metadata-записи всех 17 семинаров со статусами `published` + `inDevelopment`, без путей `markdown`; обязательное схемой поле `summary` заполнить нейтральным сообщением об отсутствии описания.
- **BREAKING**: lecture identities, titles, boundaries, summaries, seminar-to-lecture relationships, and later material filenames/slugs may change to match the newest topic plan. Compatibility redirects or explicit migration mapping are required wherever published identifiers change.

## Capabilities

### New Capabilities

- `probability-theory-lecture-1`: current-plan lecture 1 on events, combinatorics, definitions, and properties of probability.
- `probability-theory-lecture-2`: current-plan lecture 2 on conditional probability, independence, core theorems, total probability, and Bayes.
- `probability-theory-lecture-3`: current-plan lecture 3 on repeated trials, Bernoulli, Laplace, and Poisson methods.
- `probability-theory-lecture-4`: current-plan lecture 4 on discrete and continuous random variables and their specification.
- `probability-theory-lecture-5`: current-plan lecture 5 on numerical characteristics of random variables.
- `probability-theory-lecture-6`: current-plan lecture 6 on standard discrete and continuous distribution laws.
- `probability-theory-lecture-7`: current-plan lecture 7 on inequalities, laws of large numbers, and the central limit theorem.
- `probability-theory-lecture-8`: optional lecture 8 on bivariate random variables without a corresponding seminar.
- `probability-theory-seminar-1`: seminar 1 on elementary counting rules and modeling sample spaces.
- `probability-theory-seminar-2`: seminar 2 on permutations, arrangements, combinations, and repeated elements.
- `probability-theory-seminar-3`: seminar 3 on classical probability and equiprobable outcomes.
- `probability-theory-seminar-4`: seminar 4 on geometric, frequency-based, and simulation-supported probability.
- `probability-theory-seminar-5`: seminar 5 for consolidation and control work 1 on lecture-1 material.
- `probability-theory-seminar-6`: seminar 6 on addition, multiplication, conditional probability, and independence.
- `probability-theory-seminar-7`: seminar 7 on total probability, hypothesis trees, and Bayes updates.
- `probability-theory-seminar-8`: seminar 8 on Bernoulli trials and exact/asymptotic approximations.
- `probability-theory-seminar-9`: seminar 9 for consolidation and control work 2 on lectures 2-3.
- `probability-theory-seminar-10`: seminar 10 on discrete and continuous random-variable representations, CDFs, and densities.
- `probability-theory-seminar-11`: seminar 11 on expectation, mode, median, and interpretation.
- `probability-theory-seminar-12`: seminar 12 on variance, standard deviation, variation, moments, skewness, and kurtosis.
- `probability-theory-seminar-13`: seminar 13 on standard discrete distributions.
- `probability-theory-seminar-14`: seminar 14 on uniform, exponential, Weibull, and other continuous distributions.
- `probability-theory-seminar-15`: seminar 15 on the normal distribution, standardization, and the three-sigma rule.
- `probability-theory-seminar-16`: seminar 16 on Markov/Chebyshev/Bernoulli inequalities, laws of large numbers, and CLT interpretation.
- `probability-theory-seminar-17`: seminar 17 for control work 3, cumulative model selection, and course synthesis.
- `probability-theory-homework-1`: formal individual homework 1 on combinatorial models.
- `probability-theory-homework-2`: formal individual homework 2 on event probability definitions and elementary models.
- `probability-theory-homework-3`: formal individual homework 3 on probability theorems and conditional probability.
- `probability-theory-homework-4`: formal individual homework 4 on total probability and Bayesian updating.
- `probability-theory-homework-5`: formal individual homework 5 on repeated independent trials and approximations.
- `probability-theory-homework-6`: formal individual homework 6 on random-variable representations and numerical characteristics.
- `probability-theory-homework-7`: formal individual homework 7 on distribution choice, continuous models, and limit-theorem interpretation.
- `probability-theory-seminar-materials`: cross-cutting contract for teacher/public seminar variants, 15-20 problems, solution visibility, source use, and QA.
- `probability-theory-homework-materials`: cross-cutting contract for formal homework identity, variants, assessment integrity, source use, and QA.

### Modified Capabilities

- `probability-theory-curriculum`: supersede the old lecture sequence and define the aligned 8-lecture/17-seminar/7-homework map.
- `probability-theory-source-policy`: add the supplied current topic-plan PDF as the highest authority for topic boundaries and formalize use of the full local source corpus with ML emphasis.
- `probability-theory-lecture-materials`: permit controlled identity migration and require all three lecture variants to follow the new plan.
- `probability-theory-publication-release`: preserve staged availability while allowing migrated identities and future public seminar/homework products without accidental release.

## Impact

- Affected planning and metadata: `openspec/config.yaml`, main OpenSpec capabilities, `course.yaml`, source-policy records, and publication validation.
- Affected content: all files in `lectures-teacher/`, `lectures/`, `lecture-notes/`, `seminars/`, teacher seminar materials, formal homework materials, related assets, and cross-links.
- Affected source corpus: the supplied PDF is copied to `sources/` during apply and remains ignored/unpublished.
- Affected validation: topic coverage, source traceability, exercise counts, teacher/public solution parity, answer-leak checks, mathematical checks, Markdown/assets, and publisher plan validation.
- Non-goals: открытие содержимого лекций 2–8, семинаров, ИДЗ и вложений; воспроизведение книг дословно; изобретение отсутствующего графика контрольной работы; молчаливое предположение независимости в ИДЗ 6.3.
