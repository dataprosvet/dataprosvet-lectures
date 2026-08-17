# Probability Theory Publication Release Specification

## Purpose

Defines the staged production release and the evidence required to prove that repository, publisher, and primary-site state agree for the probability-theory course.

## Requirements

### Requirement: Current production scope is explicit
The next reviewed production release SHALL expose the published probability-theory course, lecture one with both its complete student lecture and concise note, seminar one, and individual assignment one. Eligible Python companions for those available materials MAY be exposed when present and validated. Lectures two through eight, seminars two through seventeen, individual assignments two through seven, all three control works, teacher scripts, local sources, OpenSpec content, audit evidence, dormant files, and the lecture-one presentation MUST NOT be publicly exposed.

#### Scenario: User opens the probability-theory course
- **WHEN** the reviewed release is eventually committed and deployed
- **THEN** lecture one, seminar one, and individual assignment one are available, all later materials remain locked, eligible declared Python companions are downloadable, and no presentation or internal evidence is shown

### Requirement: Планирование и перенос материалов не расширяют публичную доступность
Перестройка тем, добавление материалов семинаров и домашних работ или доведение материалов до готовности к реализации MUST NOT открывать содержимое неактивной лекции, семинара, домашней работы, преподавательского ключа, банка решений, исходного файла или вложения без отдельного явного решения о выпуске. `course.yaml` SHALL содержать metadata-записи всех восьми лекций и всех 17 семинаров. Семинары SHALL иметь `lifecycleStatus: published`, `availability: inDevelopment`, нейтральное обязательное `summary` без тематического описания и MUST NOT иметь путь `markdown` до отдельного решения о выпуске содержимого.

#### Scenario: Система публикации собирает курс после перестройки
- **WHEN** после переноса всех файлов материалов создаётся план публикации
- **THEN** план содержит 8 лекционных и 17 семинарских metadata-записей, текстовые действия есть только у лекции 1, все семинары остаются `inDevelopment` без содержимого, ИДЗ отсутствуют, а преподавательские решения и локальные источники не попадают в публикуемые ресурсы

### Requirement: Публичные задачные материалы предотвращают утечку ответов
Любое будущее публичное действие семинара или домашней работы SHALL ссылаться только на безопасные для студентов файлы. Преподавательские файлы, полные ключи решений, сведения о происхождении источников и скрытые ответы MUST NOT быть доступны через публичный манифест или граф ресурсов.

#### Scenario: Семинар выпускается позднее
- **WHEN** действие семинара объявляется в манифесте
- **THEN** связанный файл содержит полные решения только обозначенных типовых задач, а план не содержит преподавательскую версию или ресурс с ключом решений
### Requirement: Publication plan is validated before deployment
Before any production mutation, the repository SHALL pass strict OpenSpec validation, Markdown and asset validation, deterministic publication-plan generation, and a review of the resulting plan against the staged scope. Validation failure or an unexpected public resource MUST stop the release.

#### Scenario: Plan contains an unintended resource
- **WHEN** validation shows a later lecture, teacher script, archived audit, local source, or presentation in the publication plan
- **THEN** deployment is not started until the declaration or publisher behavior is corrected and the plan is regenerated

### Requirement: Repository publication follows the reviewed branch workflow
The completed and validated change SHALL be committed and pushed through the repository's normal reviewed course-branch workflow. Production publication MUST originate from the committed repository state rather than from an uncommitted working tree or manual console edits.

#### Scenario: Change is ready to publish
- **WHEN** content acceptance and pre-deployment validation are complete
- **THEN** the exact accepted files are committed, pushed, and allowed to publish through the configured repository workflow

### Requirement: Primary-site state is verified after deployment
After the production deployment completes, the primary site SHALL be checked using the deployed commit identity and user-visible behavior. Verification SHALL confirm course visibility, lecture-one metadata, both lecture-one text variants, absence of the presentation, non-availability of lectures two through eight, and successful rendering of formulas, headings, links, and referenced images. The verification result SHALL be recorded as versioned evidence.

#### Scenario: Production smoke check succeeds
- **WHEN** the deployment reports success and the primary site is opened
- **THEN** the site matches the staged release contract and the evidence records the deployed revision, checked pages, and result

#### Scenario: Production differs from the accepted plan
- **WHEN** the primary site exposes missing, stale, malformed, or unintended resources
- **THEN** the release is treated as failed, the discrepancy is recorded, and the repository-based rollback or corrective publish path is used before acceptance

### Requirement: Repository review precedes any release action
Completion of this change SHALL produce an uncommitted, validated repository state for owner review. It MUST NOT itself commit, push, deploy, or mutate production.

#### Scenario: Apply workflow completes
- **WHEN** all content and validation tasks for this change pass
- **THEN** the working tree contains the reviewable implementation and no commit, push, or deployment has been performed

### Requirement: Locked materials retain metadata without exposed content
All 8 lectures, 17 seminars, and 10 homework materials SHALL have stable manifest metadata. A locked material SHALL use `inDevelopment` and omit Markdown and attachment declarations so that its repository files remain dormant rather than public.

#### Scenario: Deterministic plan is generated
- **WHEN** the completed manifest is validated
- **THEN** metadata identities are complete while public content is limited to lecture 1, seminar 1, individual assignment 1, and their eligible declared assets or attachments
