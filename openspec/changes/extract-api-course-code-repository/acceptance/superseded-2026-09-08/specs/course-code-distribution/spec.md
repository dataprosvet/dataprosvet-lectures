## Purpose

Определяет проверяемый способ хранения и выдачи исполняемых материалов курса через отдельные приватные student-facing и teacher-only GitHub-репозитории с согласованными автономными ветками.

## ADDED Requirements

### Requirement: Course code has separate private student and teacher repositories
Система материалов курса SHALL содержать локальные Git-репозитории `/Users/ripper/projects/api-technologies-code` и `/Users/ripper/projects/api-technologies-code-teacher` с default branch `main`. Они SHALL иметь remotes `TheTonyPub/api-technologies-code` и `TheTonyPub/api-technologies-code-teacher`, а оба GitHub-репозитория MUST иметь visibility `PRIVATE`.

#### Scenario: Private repository pair is verified
- **WHEN** рецензент проверяет локальные каталоги, remotes и GitHub metadata после миграции
- **THEN** оба каталога являются самостоятельными Git-репозиториями с `main`, каждый `origin` указывает на соответствующий репозиторий аккаунта `TheTonyPub`, а GitHub сообщает visibility `PRIVATE`

#### Scenario: Existing repository collision stops creation
- **WHEN** целевой локальный каталог или GitHub-репозиторий уже существует и не соответствует подтверждённому безопасному состоянию этого change
- **THEN** реализация останавливается без перезаписи, удаления, смены visibility или force-push

### Requirement: Every distributed learning unit has a stable branch
Репозиторий кода SHALL содержать ветки `lecture/01-api-interface-layer`, `lecture/02-http-rest-openapi`, `lecture/03-integration-styles`, `lecture/04-fastapi-services`, `seminar/01-api-scenarios`, `seminar/02-rest-openapi-contract`, `seminar/03-http-diagnostics`, `seminar/04-integration-style-selection` и `seminar/05-fastapi-service`. Семинары 5–6 и ДЗ № 5 SHALL использовать одну ветку `seminar/05-fastapi-service`; отдельные ветки `homework/*` MUST NOT создаваться для домашних продолжений практических работ.

#### Scenario: Branch inventory matches the implemented course slice
- **WHEN** ветки локального репозитория перечисляются после миграции
- **THEN** присутствуют `main`, четыре заявленные лекционные ветки и пять заявленных семинарских веток, а отображение семинаров 1–6 на практические работы равно `1→ПР1`, `2→ПР2`, `3→ПР3`, `4→ПР4`, `5–6→ПР5`

#### Scenario: Remote branches match local branches
- **WHEN** локальный и удалённый branch inventory student-репозитория сравниваются после push
- **THEN** GitHub содержит `main` и все девять учебных веток с теми же head SHA и не содержит непредусмотренных `homework/*` веток

### Requirement: Main is a code-repository catalog
Ветка `main` SHALL объяснять назначение репозитория, область `COMMON`/`PRB`/`SII`, правила выбора ветки, общий безопасный порядок локального запуска и таблицу соответствия Markdown-материалов веткам. Она MUST NOT содержать instructor solutions или выдавать один профиль за обязательный для другого.

#### Scenario: A learner can locate the correct branch
- **WHEN** студент или преподаватель открывает README ветки `main` и выбирает номер лекции либо практической работы и профиль
- **THEN** каталог однозначно указывает требуемую ветку и объясняет, что `PRB` и `SII` выбираются внутри неё

### Requirement: Every learning branch is autonomous and reproducible
Каждая `lecture/*` и `seminar/*` ветка SHALL содержать собственный README, необходимые исходники, контракты, зависимости, синтетические данные и доступные студенту проверки, достаточные для чистого запуска без файлов из другой учебной ветки или `attachments/api-learning-path/`. README SHALL указывать scope, поддерживаемую среду, установку, запуск, ожидаемое наблюдение и проверку.

#### Scenario: Clean branch validation succeeds
- **WHEN** проверяющий извлекает только одну учебную ветку в чистый каталог и выполняет её README
- **THEN** заявленный пример либо starter запускается и проверяется без ручного копирования файлов из репозитория курса или другой ветки

#### Scenario: Profile route is explicit
- **WHEN** ветка содержит различия `PRB` и `SII`
- **THEN** README и структура файлов позволяют выбрать ровно один профиль, сохраняют общий контрактный смысл и не требуют артефактов другого профиля

### Requirement: Seminar and homework share one student work line
Ветка каждой практической работы SHALL включать starter и public checks для аудиторного результата и соответствующего домашнего продолжения. Markdown семинара и ДЗ с тем же номером SHALL ссылаться на одну ветку, а ДЗ MUST NOT требовать начать новый кодовый проект или новый нормативный результат.

#### Scenario: Practical work 5 remains one cumulative artifact
- **WHEN** студент последовательно выполняет семинары 5–6 и ДЗ № 5
- **THEN** он продолжает один FastAPI-проект из `seminar/05-fastapi-service`, сохраняя результаты предыдущих этапов и один будущий PR на практическую работу № 5

### Requirement: Student and instructor artifacts remain separated
Ветки `TheTonyPub/api-technologies-code` SHALL содержать только student-facing demonstrations, starters, public checks, публичные контракты и синтетические данные. Instructor solutions, instructor checks, grading fixtures, ответы к защите и скрытые validation rules MUST NOT присутствовать ни в одном commit или иной достижимой истории student-репозитория. Эти артефакты SHALL храниться только в `TheTonyPub/api-technologies-code-teacher`, который MUST NOT предоставляться студентам.

#### Scenario: Student branch does not disclose assessment material
- **WHEN** рецензент проверяет все достижимые commits и ветки нового репозитория
- **THEN** он не находит instructor solutions, закрытые проверки, grading fixtures или ответы, а соответствующие преподавательские материалы сохранены в приватном teacher-репозитории

#### Scenario: Teacher branches mirror student assignments
- **WHEN** рецензент выбирает любую `lecture/*` или `seminar/*` ветку student-репозитория
- **THEN** teacher-репозиторий содержит ветку с тем же именем и соответствующие решения, закрытые проверки и grading evidence без изменения выданного студенту контракта

#### Scenario: Teacher repository is not linked from student materials
- **WHEN** проверяются student-facing Markdown, README и branch contents
- **THEN** они не содержат URL, clone command или иной указатель на `api-technologies-code-teacher`

### Requirement: Course Markdown links to the private student repository
Teacher scripts первых четырёх лекций, семинары 1–6 и ДЗ 1–5 SHALL перестать использовать исполняемые пути `attachments/api-learning-path/...` и SHALL содержать реальные ссылки вида `https://github.com/TheTonyPub/api-technologies-code/tree/<branch>` на соответствующую student-facing ветку. Семинар и ДЗ одной практической работы SHALL ссылаться на одну ветку.

#### Scenario: Private repository link resolves for an authorized user
- **WHEN** авторизованный преподаватель или студент переходит по ссылке из Markdown
- **THEN** GitHub открывает существующую ветку приватного `TheTonyPub/api-technologies-code`, а её README содержит соответствующую инструкцию

#### Scenario: No stale executable attachment path remains
- **WHEN** выполняется поиск по затронутым teacher scripts, семинарам и ДЗ после миграции
- **THEN** ни одна команда запуска или ссылка на код не использует `attachments/api-learning-path/`

### Requirement: Authoring rules govern every new lecture, seminar, homework, and code branch
`openspec/config.yaml` SHALL устанавливать постоянные правила, по которым новый Markdown лекции, семинара или ДЗ создаётся вместе с соответствующей веткой кода, автономным README, воспроизводимой проверкой, явным scope `COMMON`/`PRB`/`SII` и корректной GitHub-ссылкой. Для student-facing ветки SHALL существовать одноимённая teacher branch, если материал имеет решение, закрытые checks или grading evidence. ДЗ, продолжающее практическую работу, MUST использовать её seminar branch и MUST NOT создавать отдельную homework branch.

#### Scenario: A new coded lecture is complete
- **WHEN** автор добавляет лекцию с исполняемой демонстрацией
- **THEN** Markdown указывает соответствующую `lecture/<nn>-<slug>` ветку, student branch автономно воспроизводится, а закрытые материалы при наличии находятся только в одноимённой teacher branch

#### Scenario: A new practical and homework remain one work line
- **WHEN** автор добавляет семинар и домашнее продолжение одной практической работы
- **THEN** оба Markdown-файла указывают одну `seminar/<nn>-<slug>` ветку, README разделяет аудиторный и домашний этапы, а отдельная `homework/*` ветка отсутствует

#### Scenario: Authoring validation catches an incomplete material family
- **WHEN** новый материал содержит код, но отсутствует обязательная ветка, README, профильная маркировка, проверка, зеркальная teacher branch или корректная ссылка
- **THEN** authoring review считается непройденным и материал не готов к публикации или выдаче

### Requirement: Migration preserves observable learning behavior
Перенос SHALL сохранять пути и методы API, схемы, обязательные поля, статусы, ошибки, профильные различия, ожидаемые checkpoints и public acceptance behavior существующего контура. Исходный student-facing код в `attachments/` MUST NOT удаляться до подтверждения эквивалентности всех новых веток.

#### Scenario: Pre-migration and post-migration validation agree
- **WHEN** одинаковые применимые проверки запускаются на исходном контуре и на соответствующих новых ветках
- **THEN** успешные и ошибочные сценарии дают эквивалентные наблюдаемые результаты, а отличия ограничены путями, упаковкой и командами запуска

#### Scenario: Removal follows successful validation
- **WHEN** оба private GitHub-репозитория, все remote branches, Markdown-ссылки, безопасность и разделение доступа подтверждены
- **THEN** перенесённый код удаляется из `attachments/`, student-facing артефакты остаются в student-репозитории, а преподавательские материалы — только в недоступном студентам teacher-репозитории
