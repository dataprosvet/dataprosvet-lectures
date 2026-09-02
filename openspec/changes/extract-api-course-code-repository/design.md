## Context

Исполняемый контур первых четырёх лекций, практических работ № 1–5 и ДЗ № 1–5 собран монолитно в `attachments/api-learning-path/`. В нём смешаны student-facing starters/public checks, лекционные демонстрации, общие контракты и синтетические данные с instructor solutions, instructor checks и внутренними validation fixtures. Markdown курса жёстко ссылается на старые repository-relative пути.

Текущая внешняя `gh`-авторизация проверена read-only и соответствует аккаунту `TheTonyPub`. Change должен создать два приватных GitHub-репозитория, закончить физическое и веточное разделение и заменить старые пути настоящими ссылками на student-facing remote. См. `proposal.md` и `specs/course-code-distribution/spec.md`.

## Goals / Non-Goals

**Goals:**

- сделать приватный `TheTonyPub/api-technologies-code` каноническим источником student-facing исполняемого кода;
- сделать приватный `TheTonyPub/api-technologies-code-teacher` каноническим источником решений, закрытых проверок и grading evidence;
- дать каждой лекции и практической работе автономный воспроизводимый branch snapshot;
- сохранить одну кодовую линию для семинара и соответствующего ДЗ;
- не допустить попадания преподавательских решений в достижимую студентами Git-историю;
- выполнить миграцию с проверкой эквивалентности до удаления старого student-facing расположения.
- закрепить тот же authoring contract для последующих лекций, практических работ и ДЗ в `openspec/config.yaml`.

**Non-Goals:**

- создавать GitHub Organization, private forks, студенческие репозитории или PR automation;
- делать любой из двух кодовых репозиториев публичным;
- переносить ещё не созданные лекции 5–9 и практические работы 6–12;
- перерабатывать учебное содержание, критерии РПД или профильные результаты;
- предоставлять студентам доступ к teacher-репозиторию или автоматизировать состав учебных групп.

## Decisions

### 1. Три репозитория разделяются по аудитории и ответственности

Репозиторий курса остаётся источником Markdown, OpenSpec, нормативной трассировки и teacher scripts. `/Users/ripper/projects/api-technologies-code` и `TheTonyPub/api-technologies-code` содержат только код и данные, доступные студенту. `/Users/ripper/projects/api-technologies-code-teacher` и `TheTonyPub/api-technologies-code-teacher` содержат решения, закрытые проверки, grading fixtures и внутреннюю validation-инфраструктуру.

Альтернатива — перенести весь `attachments/api-learning-path` в один private repository и скрыть решения в отдельных ветках — отклонена: студент с read-доступом способен получить остальные ветки и достижимую историю.

### 2. Ветка является автономным distribution snapshot

`main` служит каталогом. Каждая `lecture/*` или `seminar/*` ветка ответвляется от минимального общего основания и содержит полный набор файлов своего задания в корне репозитория. Пользователь не должен переключать несколько веток или собирать рабочее состояние вручную.

Общие файлы разрешено дублировать между ветками. Это сознательный trade-off в пользу независимого `git clone --branch ... --single-branch` и стабильной выдачи. При переносе общие контракты копируются из одного проверенного источника, а equivalence checks защищают от первоначального расхождения.

### 3. Веточная модель соответствует сдаваемому артефакту

Четыре лекционные ветки соответствуют лекциям 1–4. Пять семинарских веток соответствуют практическим работам № 1–5, а не числу встреч: `seminar/05-fastapi-service` обслуживает семинары 5–6 и ДЗ № 5. ДЗ продолжает рабочую ветку практики; `homework/*` не создаётся.

Внутри ветки профиль выбирается каталогом или явной командой `prb`/`sii`. Отдельные профильные ветки отклонены из-за взрывного роста branch inventory и риска рассинхронизации общей части.

### 4. Состав веток строится по минимально необходимому замыканию зависимостей

Лекционная ветка получает соответствующие checkpoints, необходимые контракты, reference provider/client, профильные данные, зависимости, tests и README. Семинарская ветка получает starter практики, starter домашнего продолжения, public checks, нужный reference API/contract/data subset и README с двумя этапами: «на занятии» и «дома».

Ветка не получает чужие checkpoints, решения, закрытые тесты или общий validation orchestrator, если они не нужны для доступной студенту проверки. Это уменьшает поверхность выдачи и делает назначение файлов очевидным.

### 5. Teacher repository зеркалирует задания, но изолирован от студентов

Для каждой `lecture/*` и `seminar/*` ветки student-репозитория teacher-репозиторий получает одноимённую ветку с соответствующим solution/check pack. Instructor artifacts нельзя временно коммитить в student-репозиторий с последующим удалением: удаление из рабочей ветки не удаляет объекты из истории. Student-facing Markdown и README никогда не ссылаются на teacher remote.

### 6. Markdown использует реальные branch URLs student-репозитория

После создания и проверки remote в затронутом Markdown используются ссылки `https://github.com/TheTonyPub/api-technologies-code/tree/<branch>`. Ссылка добавляется только после push соответствующей ветки и проверки её существования. Для её открытия студенту потребуется отдельно предоставленный GitHub-доступ к private repository.

Альтернатива — оставить локальные абсолютные пути или логические placeholders — отклонена как непереносимая и непригодная для будущей выдачи курса.

### 7. Миграция выполняется по принципу copy, validate, cut over, remove

Сначала фиксируется inventory и baseline старого контура. Затем создаются два локальных репозитория и зеркальные наборы веток. После локальной проверки через внешнюю `gh`-авторизацию создаются два private GitHub repositories, настраиваются remotes и выполняется обычный push без force. Только после проверки visibility, remote branches, ссылок и cross-repository equivalence удаляется перенесённый код из `attachments/`.

Rollback до удаления состоит в возврате Markdown к исходным путям; новые private repositories при этом не удаляются автоматически, чтобы не выполнять разрушительное внешнее действие. После удаления восстановление исходных файлов выполняется из Git-истории репозитория курса; destructive history rewrite не требуется.

### 8. Проверка разделяется на четыре контура

1. **Repository topology:** два локальных и два private remote repositories, корректные `origin`, `main` как default и зеркальные branch names.
2. **Reproducibility:** чистое извлечение каждой ветки, установка, заявленные команды и public checks.
3. **Contract equivalence:** совпадение paths, methods, schemas, statuses, errors, versions и профильных fixtures со старым контуром.
4. **Security and audience:** visibility `PRIVATE`, secret/data scan, отсутствие instructor markers в student history, отсутствие teacher links в student materials и проверка remote metadata.

### 9. `openspec/config.yaml` становится постоянным authoring contract

В `context` добавляется решённая repository model, а в artifact rules и apply guidance — требования к созданию code branch, README, public checks, зеркальной teacher branch, ссылкам и проверке доступа. Новая лекция с кодом получает `lecture/<nn>-<slug>`; практическая работа и её ДЗ получают одну `seminar/<nn>-<slug>`. Изменение config выполняется вместе с миграцией, чтобы следующие OpenSpec changes наследовали правила автоматически.

## Risks / Trade-offs

- [Дублирование общих контрактов между ветками приводит к drift] → генерировать первичные ветки из одного проверенного inventory и добавить cross-branch consistency checks для общих контрактов.
- [Старый validation orchestrator зависит от монолитных путей] → до cutover выделить branch-local checks и отдельную временную migration validation, не переносить закрытые fixtures в студенческие ветки.
- [Private GitHub-ссылка не открывается без доступа] → проверять URL авторизованным аккаунтом и до выдачи курса отдельно управлять roster доступа; teacher repository студентам не выдавать.
- [Instructor solution случайно попадает в Git history] → формировать новый репозиторий по allowlist student-facing файлов и сканировать все refs/objects до acceptance.
- [`gh` внутри sandbox не видит авторизацию] → все GitHub preflight/create/push/verify команды выполнять вне sandbox с явной проверкой login `TheTonyPub`.
- [Целевой GitHub-репозиторий уже существует] → остановиться без изменения существующего repository, visibility или history и запросить решение пользователя.
- [Удаление старого кода ломает незамеченную ссылку] → выполнить полный поиск `attachments/api-learning-path`, проверить teacher scripts, seminars, homeworks и validation evidence до удаления.
- [Локальные пути новых репозиториев не входят в текущий OpenSpec edit root] → apply workflow должен явно работать в авторизованных `/Users/ripper/projects/api-technologies-code` и `/Users/ripper/projects/api-technologies-code-teacher`, не создавая вложенные репозитории курса.

## Migration Plan

1. Зафиксировать inventory, baseline tests и точное отображение исходных файлов на девять student branches и девять одноимённых teacher branches.
2. Создать два локальных репозитория с `main`, `.gitignore` и раздельными allowlists.
3. Последовательно создать четыре lecture branches и пять seminar branches в student repository и зеркальные branches в teacher repository.
4. Переписать импорты, команды и README так, чтобы каждая student branch проверялась отдельно, а teacher branch подтверждала solvability.
5. Запустить branch-local, contract-equivalence, safety и Git-history checks до внешней публикации.
6. Вне sandbox повторно проверить `gh` login `TheTonyPub`, убедиться в отсутствии конфликтующих repositories и создать оба с visibility `PRIVATE`.
7. Добавить `origin`, запушить `main` и все branches без force и проверить visibility, default branch, remote SHAs и разделение содержимого.
8. Обновить Markdown курса реальными student branch URLs и дополнить `openspec/config.yaml` authoring contract.
9. Повторить полный поиск старых путей, проверку ссылок и acceptance validation.
10. Удалить подтверждённо перенесённый student и teacher code из `attachments/` только после проверки обоих remotes.
11. Проверить `git status` трёх локальных репозиториев и создать итоговый validation report.

## Open Questions

- Состав GitHub-пользователей или команд, которым будет выдан read-доступ к student repository, определяется перед фактической выдачей курса и не влияет на структуру текущей миграции.
