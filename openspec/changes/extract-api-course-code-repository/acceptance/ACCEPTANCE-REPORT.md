# Acceptance report: extract API course code repositories

Дата проверки: 2026-08-21. GitHub account: `TheTonyPub`.

## Результат

Миграция принята. Код первых четырёх лекций, практических работ № 1–5 и ДЗ № 1–5 вынесен из course `attachments/` в два отдельных приватных репозитория. Student и instructor history физически разделены; ДЗ продолжает соответствующую `seminar/*` ветку.

| Репозиторий | URL | Visibility | Default branch | Локальный status |
| --- | --- | --- | --- | --- |
| Student | https://github.com/TheTonyPub/api-technologies-code | `PRIVATE` | `main` | clean |
| Teacher | https://github.com/TheTonyPub/api-technologies-code-teacher | `PRIVATE` | `main` | clean |

Student Markdown не содержит имени или URL teacher-репозитория. Полный исходный instructor/validation pack сохранён только в teacher `main/source-baseline/`.

## Branch inventory и проверенные local/remote SHA

Remote SHA получены через GitHub API и побайтно сопоставлены с локальными heads скриптом `verify_remote_repositories.py`.

| Branch | Student SHA | Teacher SHA |
| --- | --- | --- |
| `main` | `dd755b7ddd46c0f413f0a531464d93312708ba36` | `f53abd2e8f06b632b2ea78d82e937e61d39270a3` |
| `lecture/01-api-interface-layer` | `4cd9e011d98c7c16cdeb0caa1723b052b6b2bc91` | `ffed7af89c72b032d7b4b246307c2c3ba52f6e29` |
| `lecture/02-http-rest-openapi` | `1462046d10c010ae189602689783e811c8650341` | `dece6b101576f10eadbf771d90539d6ce53cb063` |
| `lecture/03-integration-styles` | `ee58c98fdb0b12c7a468eed6832ab763c786d4ec` | `c9393fd6b05256ea631e7319d46c4c8bc36e0e2f` |
| `lecture/04-fastapi-services` | `980d30f96729bbf4b0e22488e7c63e37016ab3f7` | `56fe6b564254969710a5fe1f249ad40a963b1e60` |
| `seminar/01-api-scenarios` | `2a922acd7889e267c9976cdc035f38a1f9d602a5` | `9a46b46979b02cb7b41cab6fc62c2fedc50e1e90` |
| `seminar/02-rest-openapi-contract` | `1dbc6c88fec2965b3b3e232bc47789edde4cc26b` | `9bb6fe0759358ce641a24e88183d4f599e0413a5` |
| `seminar/03-http-diagnostics` | `2285ca290a84ec62a7d891e4f0237e19b44ab178` | `a1307999dd5c9c9909df07c873b0af9351926f8a` |
| `seminar/04-integration-style-selection` | `3a7cfec2d4897a16423068d1464af382c3b18772` | `3de5e5de39f716e12263eb49f0a195ddec007679` |
| `seminar/05-fastapi-service` | `56e0b19b70adf2e4a9e151150ef65cf9f79be73e` | `9d89882997392e9135fb0829a2cd235a747ec7f8` |

В обоих репозиториях ровно `main` и девять учебных веток; `homework/*` отсутствуют.

## Выполненные проверки

- Исходный baseline до cutover: 33 lecture checkpoint tests, 4 FastAPI instructor tests, PRB/SII HW3, framework/adapters, `compileall`, protobuf generation, C++ build/test и live HTTP provider scenarios — `PASS`.
- `.venv/bin/python openspec/changes/extract-api-course-code-repository/acceptance/validate_local_repositories.py` — `PASS`. Проверены чистые Git snapshots всех веток, Python tests, expected failing starter checks, teacher checks, protobuf, C++17 fixture client, contract equivalence, branch topology, secret/data scan и student Git-history isolation.
- `.venv/bin/python openspec/changes/extract-api-course-code-repository/acceptance/validate_course_cutover.py` — `PASS`. Проверены 15 Markdown-файлов, их branch mapping, branch-local paths, отсутствие старых executable paths и teacher links, а также repository rules в `openspec/config.yaml`.
- `.venv/bin/python openspec/changes/extract-api-course-code-repository/acceptance/verify_remote_repositories.py` вне sandbox — `PASS`. Проверены owner, `PRIVATE`, `main`, exact branch inventory, local/remote SHA и authorized README access каждой ветки.
- `openspec validate extract-api-course-code-repository --strict` — `PASS`.
- Отдельного publisher manifest/validator (`course.yaml`, `package.json`, `pyproject.toml`, `Makefile`) в course root нет, поэтому дополнительный publisher command неприменим.

## Cutover и восстановление

`attachments/api-learning-path/` удалён из course working tree только после remote acceptance. Его 149 файлов доступны:

1. канонически — в private teacher repository, `main/source-baseline/`;
2. как локальная временная страховочная копия — `/private/tmp/api-learning-path-pre-cutover-backup-20260821`.

Другие файлы `attachments/` не удалялись.

## Итоговый working tree

Оба новых code repositories чистые на `main`. Course repository остаётся намеренно dirty: ещё до миграции были пользовательский `M .gitignore` и untracked `.agents/`, `lectures-teacher/`, `seminars/`, `homeworks/`, `openspec/` и code tree. Change не изменял `.gitignore` или `.agents/`; его собственные изменения ограничены затронутыми Markdown-файлами, `openspec/config.yaml` и `openspec/changes/extract-api-course-code-repository/acceptance/`/`tasks.md`.
