## MODIFIED Requirements

### Requirement: Current production scope is explicit
The next reviewed production release SHALL expose the published probability-theory course, lecture one with both student variants, seminars one and two, and individual assignment one. Lecture two and seminars three and four SHALL be present as `published` + `temporarilyUnavailable` materials with declared student content but MUST NOT grant public read access. Lectures three through eight, seminars five through seventeen, individual assignments two through seven, all three control works, teacher scripts, local sources, OpenSpec content, audit evidence, dormant files, superseded seminar-two content, and the lecture-one presentation MUST NOT be publicly exposed.

#### Scenario: User opens the probability-theory course
- **WHEN** a future reviewed release is eventually committed and deployed
- **THEN** lecture one, seminars one and two, and individual assignment one are available; lecture two and seminars three and four are visible only according to the platform's temporary-unavailability behavior and their content is not anonymously readable; all remaining excluded resources stay locked

### Requirement: Планирование и перенос материалов не расширяют публичную доступность
Перестройка тем и доведение материалов до готовности MUST NOT открывать содержимое преподавательского сценария, полного ключа решений, локального источника, OpenSpec или другого неразрешённого ресурса. Явно разрешённое изменение SHALL открыть только безопасные студенческие версии семинаров 1–2. Лекция 2 и семинары 3–4 SHALL иметь `lifecycleStatus: published`, `availability: temporarilyUnavailable`, объявленные студенческие Markdown-пути и `publicRead: false`. Остальные материалы MUST сохранить ранее утверждённую доступность.

#### Scenario: Система публикации собирает курс после изменения
- **WHEN** из подготовленного локального состояния создаётся детерминированный publisher-план
- **THEN** студенческий Markdown семинаров 1–2 имеет публичное чтение, содержимое лекции 2 и семинаров 3–4 присутствует без публичного чтения, а преподавательские и неразрешённые ресурсы не получают публичных разрешений

#### Scenario: Система публикации собирает курс после перестройки
- **WHEN** после подготовки всех затронутых материалов создаётся план публикации
- **THEN** план сохраняет восемь лекционных и 17 семинарских metadata-записей, открывает только лекцию 1 и семинары 1–2 из затронутой области, удерживает лекцию 2 и семинары 3–4 без публичного чтения и не включает преподавательские решения или локальные источники

### Requirement: Locked materials retain metadata without exposed content
All course materials SHALL retain stable manifest metadata unless this change explicitly records a migration. A material that is still being developed SHALL use `inDevelopment` and MAY omit content declarations. A prepared material intentionally held back after publication SHALL use `temporarilyUnavailable`; it MAY declare validated student Markdown, but its normalized course row, Markdown objects, assets, and attachments MUST all have `publicRead: false`.

#### Scenario: Deterministic plan is generated
- **WHEN** the completed manifest is validated
- **THEN** available materials and temporarily unavailable materials are distinguishable, only seminar one and seminar two gain new public student content, and every temporarily unavailable resource remains private

## ADDED Requirements

### Requirement: Новый семинар 102 не изменяет существующий материал другой группы
Новая запись семинара 2 SHALL добавляться отдельно от текущей идентичности `comb-and-prob-17-25-2`. Существующие поля, Markdown и вложения `jupyter-notebook` и `notes-s2` этой записи MUST сохраняться без изменений; новый материал SHALL иметь собственный slug и Markdown.

#### Scenario: Проверяется новый материал с порядком 102
- **WHEN** манифест и publisher-план сравниваются с исходным состоянием
- **THEN** существуют сохранённая запись `comb-and-prob-17-25-2` и отдельная новая запись семинара 2 с явно заданным `sortOrder: 102`, а прежние вложения остаются только у сохранённой записи

### Requirement: Локальная приёмка не выполняет Git-операций
В рамках этого change проверка SHALL выполняться без вызова Git, включая commit, staging, status, diff, push, pull, checkout, merge, создание ветки и инициализацию временного репозитория. Publisher-семантика SHALL проверяться прямым чтением файлов и не использующим Git парсером или тестовым harness. Если штатная проверка жёстко требует tracked-tree, эта часть MUST быть явно отмечена как непроверенная и MUST NOT обходиться созданием временного Git-репозитория.

#### Scenario: Владелец получает результат реализации
- **WHEN** все локальные задачи завершены
- **THEN** созданы или изменены только разрешённые публикационные и OpenSpec-файлы, Git не запускался, а индекс, история, удалённая сторона и production не затронуты
