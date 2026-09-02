# Migration inventory

Зафиксировано до переноса `attachments/api-learning-path/`.

## Baseline

- Команда: `PYTHONPATH=attachments/api-learning-path .venv/bin/python attachments/api-learning-path/validation/validate_all.py`.
- Результат вне sandbox: `PASS`.
- Покрытие: 33 lecture checkpoint tests; 4 FastAPI instructor tests; PRB/SII HW3 scenarios; framework/adapters; Python compileall; Protocol Buffers generation; C++ configure/build/ctest; live HTTP provider scenarios.
- Первый sandbox-run дошёл до live smoke и ожидаемо не смог открыть loopback port; это ограничение среды, не дефект материалов.

## Branch mapping

| Материал курса | Student branch | Teacher branch |
|---|---|---|
| Лекция 1 | `lecture/01-api-interface-layer` | то же имя |
| Лекция 2 | `lecture/02-http-rest-openapi` | то же имя |
| Лекция 3 | `lecture/03-integration-styles` | то же имя |
| Лекция 4 | `lecture/04-fastapi-services` | то же имя |
| Семинар 1 + ДЗ 1 / ПР 1 | `seminar/01-api-scenarios` | то же имя |
| Семинар 2 + ДЗ 2 / ПР 2 | `seminar/02-rest-openapi-contract` | то же имя |
| Семинар 3 + ДЗ 3 / ПР 3 | `seminar/03-http-diagnostics` | то же имя |
| Семинар 4 + ДЗ 4 / ПР 4 | `seminar/04-integration-style-selection` | то же имя |
| Семинары 5–6 + ДЗ 5 / ПР 5 | `seminar/05-fastapi-service` | то же имя |

Отдельные `homework/*` ветки запрещены: ДЗ продолжает соответствующую практическую работу.

## Student allowlist

- `requirements.txt` и безопасные environment instructions;
- необходимые конкретной ветке `contracts/` и `synthetic-data/`;
- lecture demonstrations, reference provider и C++ reference client для lecture branches;
- `practicals/<profile>/<work>/starter/`;
- `practicals/<profile>/<work>/public-checks/`;
- `homeworks/<profile>/<work>/starter/`;
- только необходимые student-facing validation helpers;
- автономный branch README.

## Teacher allowlist

- полное student-facing основание соответствующей ветки;
- `instructor-solution/` и `instructor-checks/` только соответствующей работы;
- rubric и grading evidence;
- необходимые закрытые validation helpers и expected behavior;
- teacher-only README без student distribution instructions.

## Explicitly forbidden in student Git history

- любой путь `instructor-solution` или `instructor-checks`;
- `validation/grading-fixtures.md` и скрытые acceptance rules;
- ответы к защите и заполненные эталоны;
- secrets, credentials, real endpoints, personal or production data;
- ссылки или clone commands на `api-technologies-code-teacher`.

## Existing Markdown scope

- `lectures-teacher/001..004`;
- `seminars/001..006`;
- `homeworks/001..005`.

Все найденные исполняемые ссылки используют `attachments/api-learning-path/` и должны быть заменены только после успешного push и remote verification.
