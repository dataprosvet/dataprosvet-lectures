## 1. Зафиксировать исходное состояние и безопасные цели

- [x] 1.1 Проверить, что `/Users/ripper/projects/api-technologies-code` и `/Users/ripper/projects/api-technologies-code-teacher` отсутствуют либо являются пустыми безопасными целями; при неизвестных файлах остановиться без перезаписи.
- [x] 1.2 Вне sandbox выполнить `gh`-проверку текущего login и подтвердить аккаунт `TheTonyPub` перед любыми GitHub-операциями.
- [x] 1.3 Вне sandbox проверить существование `TheTonyPub/api-technologies-code` и `TheTonyPub/api-technologies-code-teacher`; при конфликте остановиться без изменения repository, visibility или history.
- [x] 1.4 Снять inventory `attachments/api-learning-path/`, всех ссылок и validation commands для лекций 1–4, семинаров 1–6 и ДЗ 1–5.
- [x] 1.5 Запустить и сохранить baseline существующих Python, HTTP, contract и C++ checks до изменения путей.
- [x] 1.6 Составить два явных migration allowlist: student-facing файлы и teacher-only solutions/checks/fixtures; ни один teacher-only файл не должен временно попасть в student repository.
- [x] 1.7 Зафиксировать отображение материалов на девять учебных веток, включая `seminars 5–6 + homework 5 → seminar/05-fastapi-service`, и проверить его против РПД.

## 2. Создать локальные student и teacher repositories

- [x] 2.1 Инициализировать `/Users/ripper/projects/api-technologies-code` с default branch `main`, безопасным `.gitignore` и student-facing README-каталогом.
- [x] 2.2 Инициализировать `/Users/ripper/projects/api-technologies-code-teacher` с default branch `main`, безопасным `.gitignore` и закрытым README-каталогом соответствий.
- [x] 2.3 Описать в student README выбор `COMMON`/`PRB`/`SII`, получение учебной ветки и одну рабочую линию на практику с домашним продолжением.
- [x] 2.4 Описать в teacher README зеркальную веточную модель и запрет предоставления доступа студентам.
- [x] 2.5 Создать отдельные initial commits и проверить отсутствие generated artifacts, секретов, персональных данных и instructor content в student commit.

## 3. Собрать зеркальные ветки первых четырёх лекций

- [x] 3.1 Создать `lecture/01-api-interface-layer` в student repository с checkpoints, контрактами, synthetic data, public tests и автономным README; создать одноимённую teacher branch с решением и закрытыми checks.
- [x] 3.2 Создать `lecture/02-http-rest-openapi` в student repository с HTTP/OpenAPI fixtures, reference provider, public tests и README; создать одноимённую teacher branch.
- [x] 3.3 Создать `lecture/03-integration-styles` в student repository с REST, long-running, gRPC/Protocol Buffers, WebSocket/event traces, public tests и README; создать одноимённую teacher branch.
- [x] 3.4 Создать `lecture/04-fastapi-services` в student repository с FastAPI checkpoints, профильными маршрутами, validation/logging/OpenAPI tests и README; создать одноимённую teacher branch.
- [x] 3.5 Для каждой пары lecture branches проверить clean single-branch student run и прохождение student плюс instructor checks на teacher solution.

## 4. Собрать зеркальные ветки практических работ и ДЗ

- [x] 4.1 Создать `seminar/01-api-scenarios` со starters ПР1/ДЗ1, domain contract, synthetic data, public checks и двухэтапным README; создать одноимённую teacher branch с эталоном и grading evidence.
- [x] 4.2 Создать `seminar/02-rest-openapi-contract` со starters ПР2/ДЗ2, профильными контрактами, public checks и README; создать одноимённую teacher branch.
- [x] 4.3 Создать `seminar/03-http-diagnostics` со starters ПР3/ДЗ3, reference API, fixtures, public checks и README; создать одноимённую teacher branch.
- [x] 4.4 Создать `seminar/04-integration-style-selection` со starters ПР4/ДЗ4, traces, public checks и README; создать одноимённую teacher branch.
- [x] 4.5 Создать `seminar/05-fastapi-service` как единый проект семинаров 5–6 и ДЗ5 со starters, public tests, fixtures и тремя checkpoints; создать одноимённую teacher branch.
- [x] 4.6 Проверить clean student starter behavior и полное прохождение public/instructor checks на каждом teacher solution для `PRB` и `SII`.
- [x] 4.7 Подтвердить отсутствие отдельных `homework/*` веток в обоих repositories.

## 5. Проверить локальную эквивалентность и изоляцию

- [x] 5.1 Сравнить старый и новый контуры по API paths/methods, schemas, required fields, statuses, errors, versions, checkpoints и профильным fixtures.
- [x] 5.2 Запустить branch-local Python, HTTP, OpenAPI, Protocol Buffers и применимые C++ checks во всех student и teacher branches.
- [x] 5.3 Проверить общие контракты и synthetic fixtures между ветками на непреднамеренный drift.
- [x] 5.4 Просканировать все refs и достижимые Git-объекты student repository на instructor markers, grading fixtures, секреты, реальные endpoints и персональные данные.
- [x] 5.5 Просканировать teacher repository на секреты и реальные данные и подтвердить, что student-facing файлы не содержат ссылок или clone commands teacher repository.
- [x] 5.6 Подтвердить точный локальный branch inventory и одинаковые имена девяти учебных веток в двух repositories.

## 6. Создать и проверить приватные GitHub repositories

- [x] 6.1 Вне sandbox повторно подтвердить `gh` login `TheTonyPub` непосредственно перед созданием repositories.
- [x] 6.2 Создать `TheTonyPub/api-technologies-code` через `gh` с visibility `PRIVATE`, default branch `main` и без включения публичности или GitHub Pages.
- [x] 6.3 Создать `TheTonyPub/api-technologies-code-teacher` через `gh` с visibility `PRIVATE`, default branch `main` и без предоставления student access.
- [x] 6.4 Настроить соответствующие `origin` в локальных repositories и проверить точные fetch/push URLs до отправки данных.
- [x] 6.5 Запушить `main` и девять учебных веток student repository обычным push без force.
- [x] 6.6 Запушить `main` и девять зеркальных веток teacher repository обычным push без force.
- [x] 6.7 Вне sandbox проверить через `gh` visibility `PRIVATE`, owner `TheTonyPub`, default branch, remote branch inventory и совпадение head SHA с локальными ветками обоих repositories.
- [x] 6.8 Повторно проверить remote student history на отсутствие instructor artifacts и убедиться, что teacher repository не указан в student README.

## 7. Закрепить authoring contract в OpenSpec config

- [x] 7.1 Дополнить `openspec/config.yaml` решённой моделью course Markdown, private student code repository и private teacher repository.
- [x] 7.2 Добавить правила именования `lecture/<nn>-<slug>` и `seminar/<nn>-<slug>`, зеркальных teacher branches и запрет отдельных `homework/*` веток для продолжения практики.
- [x] 7.3 Добавить требования к автономному README: scope, environment, install, run, expected behavior, public validation и этапы «семинар → дома».
- [x] 7.4 Добавить обязательное разделение student/instructor artifacts, запрет teacher links в student materials и правила synthetic data/secret safety.
- [x] 7.5 Добавить правила Markdown-ссылок на реальную student branch и запрет считать материал готовым при отсутствующей ветке, README, checks, profile scope или teacher mirror.
- [x] 7.6 Добавить apply guidance для проверки local/remote SHAs, GitHub visibility, link resolution, contract equivalence и сохранности instructor pack.

## 8. Переключить Markdown курса на приватный student repository

- [x] 8.1 Обновить teacher scripts лекций 1–4 ссылками `https://github.com/TheTonyPub/api-technologies-code/tree/<lecture-branch>` и branch-local командами.
- [x] 8.2 Обновить семинары 1–6 соответствующими private GitHub links; семинары 5–6 должны ссылаться на `seminar/05-fastapi-service`.
- [x] 8.3 Обновить ДЗ 1–5 ссылками на ту же seminar branch, что и соответствующая практика, и явно требовать продолжения существующей рабочей линии.
- [x] 8.4 Авторизованным GitHub-аккаунтом проверить открытие каждой добавленной ссылки и соответствие README материалу.
- [x] 8.5 Выполнить полный поиск старых исполняемых путей и устранить все команды и ссылки с `attachments/api-learning-path/` в затронутом Markdown.

## 9. Завершить cutover и acceptance

- [x] 9.1 Только после успешной remote-проверки удалить из `attachments/api-learning-path/` перенесённые student и teacher code artifacts, сохранив настоящие приложения к материалам.
- [x] 9.2 Адаптировать course-side validation к двум remote code repositories без копирования закрытых правил в student repository.
- [x] 9.3 Повторно запустить course checks, branch checks, contract equivalence, secret/data scan, Git-history scan, link validation и strict OpenSpec validation.
- [x] 9.4 Создать acceptance report с URLs, visibility, branch inventory, local/remote head SHA, командами и результатами проверок и подтверждением student/teacher separation.
- [x] 9.5 Проверить итоговый `git status` репозитория курса и двух локальных code repositories и явно отделить изменения change от существующих пользовательских изменений.
