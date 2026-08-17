# Probability Theory Lecture Materials Specification

## Purpose

Defines the separate teacher-facing and student-facing lecture products, their repository locations, content boundaries, identity stability, and publication readiness.

## Requirements

### Requirement: Teacher lecture scripts are preserved separately
All eight lecture scripts SHALL remain under `lectures-teacher/` with their filenames, eight-lecture sequence, substantive scope, worked-result meaning, documented RPD defect handling, and teacher-only function intact. They MAY receive source-grounded editorial refinements that improve oral readability, transitions, heading consistency, explanation order, and source traceability, but such refinements MUST NOT silently remove a required topic, applicability condition, worked solution, interactive activity, timing aid, instructor guidance, coverage record, or computational appendix. Teacher lecture files MUST NOT be declared in `course.yaml` or included in the publication plan.

#### Scenario: Teacher scripts receive the final editorial pass
- **WHEN** a maintainer revises a teacher script for study or classroom reading
- **THEN** the revised script is easier to follow while its topic structure, mathematical meaning, required RPD coverage, and teacher-only material remain verifiably preserved

#### Scenario: Existing lectures are reorganized
- **WHEN** the course maintains separate teacher, complete-student, and concise-student variants
- **THEN** each reviewed teacher script remains available under `lectures-teacher/` and no teacher-only file becomes publicly published

#### Scenario: Course publication is generated
- **WHEN** the publisher builds the course plan
- **THEN** no file under `lectures-teacher/` is included in the plan or used as a public fallback

### Requirement: Public lecture files are complete student lectures
Each Markdown file under `lectures/` SHALL be a self-contained, student-facing lecture derived from the corresponding reviewed teacher script. It SHALL contain the topic purpose and progression, principal definitions, central formulas with symbols and applicability conditions, explanatory reasoning, selected worked examples, relevant warnings, applied interpretation, and a concise topic summary sufficient to study the lecture without the teacher script. Relevant applications from approved machine-learning sources SHALL be included where they materially clarify the probability concept.

#### Scenario: Student studies a complete lecture independently
- **WHEN** the student opens a declared `markdown` lecture without access to the teacher script
- **THEN** the student can follow the conceptual progression, recover required terminology and formulas, understand their conditions, and study representative applications and worked reasoning

### Requirement: Student notes exclude delivery scaffolding
Student notes MUST NOT contain instructor timing tables, presentation instructions, prompts addressed to the lecturer, planned-error facilitation scripts, recommendations on how to teach a section, curriculum coverage matrices, source-usage maps, or reproducible image-generator code. They MAY retain concise warnings about common mathematical errors when phrased directly for students.

#### Scenario: Teacher-only section is encountered during conversion
- **WHEN** a section exists to manage lesson delivery rather than explain probability theory to a student
- **THEN** it remains only in the teacher script and is omitted from the corresponding public note

### Requirement: Публичная идентичность лекций остаётся стабильной
Курс SHALL сохранять стабильные идентификаторы в рамках нового тематического плана и SHALL предоставлять явную карту миграции от старых идентификаторов к новым для каждого изменённого имени файла, slug, названия, перекрёстной ссылки или ссылки на ресурс. Все восемь metadata-записей лекций SHALL содержать названия и описания, соответствующие актуальным тематическим границам. Лекция 1 SHALL оставаться единственной публично доступной полной и краткой лекцией, пока отдельное решение о выпуске не изменит доступность; лекции 2–8 SHALL иметь `published` + `inDevelopment` без публичных текстовых действий.

#### Scenario: Текущий поэтапный выпуск проверяется после миграции
- **WHEN** проверяются манифест и план публикации
- **THEN** лекция 1 предоставляет только корректные перенесённые пути полной и краткой версий, лекции 2-8 остаются неактивными, а все старые внутренние ссылки разрешаются через карту миграции или обновлены

#### Scenario: Проверяется текущий поэтапный выпуск
- **WHEN** после тематической миграции проверяются восемь записей манифеста
- **THEN** названия и описания всех лекций совпадают с актуальным распределением тем, лекция 1 предоставляет действия для полной и краткой версий, а лекции 2–8 имеют `published` + `inDevelopment` без публичного текстового действия

#### Scenario: Курс публикуется после преобразования
- **WHEN** система публикации проверяет перенесённую ветку поэтапного выпуска курса
- **THEN** лекция 1 разрешается в оба актуальных студенческих пути, файлы последующих лекций остаются неактивными, а преподавательские файлы, источники, ключи решений и OpenSpec не попадают в план

#### Scenario: Последующая лекция готовится к будущему выпуску
- **WHEN** автор проверяет преподавательскую, полную студенческую и краткую студенческую версии последующей лекции
- **THEN** все три версии имеют единый идентификатор и тематическую границу актуального плана, сохраняя различия для своих аудиторий

### Requirement: Каждая лекция имеет три версии для разных аудиторий
Каждая возможность лекции SHALL иметь полный преподавательский сценарий, самодостаточную полную студенческую лекцию и содержательно более краткий студенческий конспект. Три версии SHALL совпадать по определениям, обозначениям, формулам, условиям, результатам и тематической границе; только преподавательский сценарий MAY содержать тайминг, реплики, методику проведения, карту источников и полные преподавательские рекомендации.

#### Scenario: Выполняется перекрёстное ревью версий
- **WHEN** сравниваются три файла одной лекции
- **THEN** математический смысл и обязательное покрытие совпадают, студенческие файлы не содержат преподавательскую обвязку, а краткий конспект остаётся короче полной лекции

### Requirement: Формулы лекций согласованы и читаемо оформлены
Во всех трёх версиях лекций 1–8 определения, обозначения, формулы, условия применимости и численные результаты SHALL быть взаимно согласованы и математически корректны. Формула или содержащий формулу фрагмент MUST NOT оформляться как Markdown-цитата. Формулы и математические обозначения MUST использовать корректные LaTeX-разделители; исправление оформления MUST сохранять исходное содержание, кроме отдельно подтверждённых исправлений ошибок.

#### Scenario: Лекции 2–8 проходят формульную сверку
- **WHEN** преподавательская, полная студенческая и краткая студенческая версии одной лекции сравниваются редакционно и автоматическими проверками
- **THEN** обязательные формулы и соглашения совпадают по смыслу, численные примеры воспроизводятся, команды LaTeX корректны и формулы отсутствуют внутри Markdown-цитат

#### Scenario: Лекция 1 проходит аудит LaTeX-оформления
- **WHEN** три версии лекции 1 проверяются после форматирования
- **THEN** математические обозначения не остаются обычным текстом, LaTeX-разделители сбалансированы, а нормализованное текстово-математическое содержание совпадает с post-pull baseline

#### Scenario: Исправляется ошибка без расширения лекции
- **WHEN** в лекции 2–8 обнаружена неверная нотация, опечатка LaTeX, фактическая или вычислительная ошибка
- **THEN** исправляется только ошибочный фрагмент и связанные с ним версии, а новые темы и содержательные блоки не добавляются
### Requirement: Course OpenSpec is versioned but unpublished
The course SHALL track `openspec/config.yaml`, durable specifications, and change artifacts required for reproducible course maintenance. The broad `openspec/` ignore rule SHALL be removed, while transient operating-system files SHALL remain ignored. Course OpenSpec content MUST NOT be interpreted as educational material or uploaded by the publisher.

#### Scenario: Repository is cloned for future course work
- **WHEN** a maintainer or agent checks out the course branch
- **THEN** the course purpose, source policy, lecture requirements, and planning history are available without reconstructing them from conversation history

### Requirement: Local sources remain ignored and discoverable through specification
The `sources/` directory SHALL remain ignored and unpublished. Its expected inventory, authority, and known findings SHALL be described in course OpenSpec so an agent can request or locate the local source corpus when source verification is required.

#### Scenario: Repository validation runs with local sources present
- **WHEN** ignored source PDFs and audit files exist in the working tree
- **THEN** they do not enter tracked-tree validation or the publication plan

### Requirement: Content conversion is quality-checked across all lectures
Each teacher script, complete student lecture, and concise note SHALL be checked against the curriculum capability, source policy, current review findings, and Markdown publication constraints. The complete set MUST preserve cross-lecture terminology and progression, including event classification in lecture one, probability notation, distribution-function convention, expectation and variance notation, stated model assumptions, and transitions from discrete to continuous and limit-theorem topics. Calculated examples and known source-defect treatments SHALL be independently checked before a material is accepted.

#### Scenario: Cross-variant review finds a missing core element
- **WHEN** a required definition, formula condition, conclusion, example result, source warning, or cross-lecture convention appears in an approved source or reviewed teacher script but is absent or contradicted in a student variant
- **THEN** that variant remains incomplete until the omission or an explicit course-boundary rationale is resolved

#### Scenario: Conversion review finds a missing core element
- **WHEN** a required definition, formula condition, conclusion, or cross-lecture convention exists in approved source material but not in the corresponding complete lecture or concise note
- **THEN** the affected student variant remains incomplete until the omission or an explicit course-boundary rationale is resolved

#### Scenario: Editorial refactoring changes a worked section
- **WHEN** prose or ordering around a worked example is revised
- **THEN** its assumptions, mathematical model, calculated result, and interpretation are rechecked independently

### Requirement: Concise notes remain a distinct student product
Each Markdown file under `lecture-notes/` SHALL remain a concise student note containing the topic purpose, principal definitions, central formulas with applicability conditions, key relationships, selected compact examples where necessary, and a summary. A concise note MUST remain meaningfully shorter than the complete lecture and MUST NOT be used as a substitute for the corresponding `lectures/` document.

#### Scenario: Student chooses between lecture variants
- **WHEN** both variants are declared for a released lecture
- **THEN** the complete action provides the full study narrative and the concise action provides a compact revision aid without teacher-only scaffolding

### Requirement: Presentation remains dormant in the current release
`attachments/lecture_1.pptx` SHALL remain tracked support content but MUST NOT be declared in `course.yaml`, uploaded, or exposed on the primary site in the current release.

#### Scenario: Publisher builds lecture one
- **WHEN** the current course publication plan is generated
- **THEN** lecture one contains no downloadable presentation attachment and the PPTX bytes are absent from the plan

### Requirement: Lecture variants follow the adopted language and notation
Teacher scripts, complete student lectures, and concise notes SHALL use Russian outcome labels such as `О` and `Р` in coin experiments when a Russian representation is natural. They SHALL use `E[X]`, `Var(X)`, and `σ(X)` as the primary notation for expectation, variance, and standard deviation. Equivalent source notation such as `M(X)` and `D(X)` MAY be introduced as a translation but MUST NOT remain an unexplained competing convention.

#### Scenario: Known notation discrepancies are revisited
- **WHEN** lecture families 1, 3, 5, 6, 7, and 8 are compared across teacher, complete, and concise variants
- **THEN** English coin labels and inconsistent primary numerical-characteristic notation are corrected or explicitly translated

### Requirement: A fresh cross-variant lecture audit supersedes stale acceptance
All eight lecture families SHALL receive a new semantic audit that compares each student variant to the current teacher script and the RPD. The audit SHALL verify definitions, formulas, assumptions, worked-result meaning, warnings, notation, transitions, and source-defect handling; a previous acceptance statement MUST NOT override a newly observed contradiction.

#### Scenario: A prior report conflicts with current files
- **WHEN** current lecture content contradicts the teacher reference despite a historical pass result
- **THEN** the current variant remains incomplete until corrected and the new audit records the disposition

### Requirement: Teacher semantics remain the reconciliation reference
During reconciliation, the current teacher script SHALL be the reference for topic meaning, reasoning, examples, and defect handling, subject to the normative RPD and the newly adopted notation decision. Student variants MAY be shorter and omit delivery scaffolding but MUST NOT contradict the reference or drop a core condition needed to use a formula correctly.

#### Scenario: Student text is intentionally shorter
- **WHEN** a teacher section is compressed for a complete lecture or concise note
- **THEN** the student text preserves the mathematical claim, applicability conditions, and result while omitting only teacher-facing delivery material or optional detail

### Requirement: Lecture products follow stable templates
Each teacher script SHALL contain, in a recognizable order: title and course metadata; place in the course; learning outcomes and prerequisites; timed teaching plan; logically ordered theory; worked examples; interaction or self-check; typical errors; summary; navigation to related seminars; RPD/coverage notes; and source map, with a computational appendix when code is used. Each complete student lecture SHALL contain: title and purpose; prerequisites; logically ordered theory with formula conditions; worked examples and applications; typical errors; summary; self-check; and related-seminar navigation. Each concise note SHALL contain: title and purpose; key definitions; central formulas with conditions; at least one compact example when needed; short summary; and related-seminar navigation.

#### Scenario: Lecture family structure is audited
- **WHEN** teacher, complete, and concise variants are checked against their respective templates
- **THEN** every required section is present or an explicit not-applicable rationale is recorded without collapsing the three products into identical documents

### Requirement: Student lectures link to related seminars
Every complete student lecture and concise note SHALL include a `Связанные семинары` section containing relative local Markdown links to the seminars that practise its material. Links SHALL target stable repository Markdown paths, use human-readable Russian labels, and preserve the approved mapping: lecture 1 → seminars 1–2; lecture 2 → seminars 3–5; lecture 3 → seminar 6; lecture 4 → seminars 7–9; lecture 5 → seminar 10; lecture 6 → seminars 11–13; lecture 7 → seminars 14–15; lecture 8 → seminars 16–17.

#### Scenario: Lecture navigation is validated
- **WHEN** local links are resolved from every complete lecture and concise note
- **THEN** each target exists, belongs to the approved mapping, and contains a reciprocal link to the prerequisite lecture

#### Scenario: Available lecture is published while a related seminar is locked
- **WHEN** a lecture contains a valid repository link to a seminar whose content is still `inDevelopment`
- **THEN** the link does not change the seminar availability or expose its dormant Markdown through the publication plan
