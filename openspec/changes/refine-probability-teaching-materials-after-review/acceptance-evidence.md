# Acceptance evidence

## Mathematical recheck

| Area | Recheck performed | Result |
|---|---|---|
| Addition and conditional rules | set partition, double-count correction, chain-rule induction | consistent |
| Bayes and repeated trials | denominator expansion, mode ratio algebra, Poisson limit factors, Laplace correction | consistent |
| Distribution functions | $F=P(X\le x)$ boundaries, right continuity and jump masses | consistent |
| Characteristics | variance identity, linear transforms, covariance-aware sums, named-law moments | consistent |
| Continuous laws | density normalization, interval integrals, exponential integration by parts and units | consistent |
| Limits | indicator proof of Chebyshev, variance bound in LLN, CLT scaling | consistent |
| Newly authored seminar answers | direct recomputation of counts, probabilities, moments, integrals and normal standardization | consistent |

## Reproducible checks

- `openspec validate refine-probability-teaching-materials-after-review --strict`: pass.
- `npm test --prefix .github/publisher`: 47/47 tests pass.
- `npm run lint --prefix .github/publisher`: pass.
- Full publisher validation was run twice against an isolated temporary Git metadata directory containing the complete current working tree. Both runs produced digest `f31d2c50a3e2d24c1c2292d3e079a06a3653a3ff40dfd0ba19a1d0ae8bf6a1da`.
- Both plans expose the same material identities and only the pre-existing `attachments/lecture_1.py` downloadable attachment; `course.yaml` is byte-identical to `HEAD`.
- Relative Markdown link scan over all 33 teacher, concise and seminar files: pass.
- Eight opening `Литература к лекции` sections and all of their local PDF links: pass.
- UTF-8 reads, fenced-code balance, task-heading counts, competence counts, pair-work scan and `git diff --check`: pass.

## Source and publication boundaries

- KR 3.5 remains blocked without the missing graph; no graph or official answer was invented.
- IDZ 6.3 uses the covariance-aware formula first and labels independence as an added special condition.
- Russian outcome labels and the course notation $E[X]$, $\operatorname{Var}(X)$, $\sigma(X)$ remain distinct.
- Google Forms, grading redesign and large project assessment were not introduced.
- No commit, push, deployment or remote mutation was performed.
