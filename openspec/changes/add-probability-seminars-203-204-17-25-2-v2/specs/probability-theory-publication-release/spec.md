## MODIFIED Requirements

### Requirement: Current production scope is explicit
The next reviewed production release SHALL preserve the currently accepted available probability-theory resources and additionally expose seminar 203 for subgroup 17-25-2 with its safe student Markdown. Seminar 204 SHALL be registered as unavailable without an exposed Markdown or attachment path. Existing seminars 103/104, teacher scripts, local sources, OpenSpec content, and dormant files MUST NOT be newly exposed or altered by this release.

#### Scenario: User opens the probability-theory course
- **WHEN** the accepted repository revision is eventually deployed
- **THEN** seminar 203 appears with the subgroup title and student-safe content, seminar 204 remains unavailable, all previously accepted resources preserve their state, and no teacher solution or local source becomes public

### Requirement: Планирование и перенос материалов не расширяют публичную доступность
Перестройка тем, добавление материалов семинаров и домашних работ или доведение материалов до готовности MUST NOT открывать преподавательский ключ, исходный файл, вложение или иной неразрешённый ресурс. `course.yaml` SHALL сохранять metadata-записи основной сетки и MAY содержать отдельные записи параллельных подгрупп с уникальными `slug` и `sortOrder`. Для этого изменения только семинар 203 получает `lifecycleStatus: published`, `availability: available`, путь к студенческому Markdown и attachment notebook 203; семинар 204 SHALL получить metadata-запись недоступного материала без `markdown` и `attachments` до отдельного решения о выпуске.

#### Scenario: Система публикации собирает курс после перестройки
- **WHEN** создаётся детерминированный план публикации
- **THEN** план содержит отдельные записи 203/204 для 17-25-2, текстовое действие добавлено только для 203, а 204, преподавательские решения, notebook 204 и локальные источники отсутствуют среди публичных ресурсов

### Requirement: Locked materials retain metadata without exposed content
All materials of the main course grid and every registered subgroup resource SHALL have stable manifest metadata. A locked material SHALL omit Markdown and attachment declarations so that its repository files remain dormant rather than public. Seminar 204 for subgroup 17-25-2 SHALL follow this locked-material rule until a separate release decision changes its availability.

#### Scenario: Deterministic plan is generated
- **WHEN** the completed manifest is validated
- **THEN** seminar 203 has one student Markdown action, seminar 204 has metadata without content actions, and neither teacher files nor the seminar-204 notebook occur in the public graph
