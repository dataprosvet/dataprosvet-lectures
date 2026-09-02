## Purpose

Определяет полные, решённые и проверяемые материалы семинаров 1–6 для практических работ № 1–5 профилей ПРБ и СИИ, включая эталоны, тесты, защиту и оценивание по РПД.

## ADDED Requirements

### Requirement: Six seminars preserve five normative practical works
Система материалов курса SHALL содержать шесть студенческих семинаров для первых четырёх лекций. Семинары 1–4 SHALL соответствовать практическим работам РПД № 1–4 по два часа, а семинары 5–6 SHALL быть двумя частями одной четырёхчасовой практической работы № 5 и MUST NOT создавать нормативную работу № 6.

#### Scenario: Calendar mapping is exact
- **WHEN** рецензент сопоставляет семинары с обоими РПД и производными планами
- **THEN** отображение равно `1→ПР1`, `2→ПР2`, `3→ПР3`, `4→ПР4`, `5–6→ПР5`, а суммарное аудиторное время равно 12 часам

### Requirement: Every practical work has a complete instructor solution pack
Каждая практическая работа № 1–5 SHALL иметь студенческое условие, безопасные входные данные, starter/template, полностью заполненное преподавательское решение, ожидаемые артефакты, public checks, instructor acceptance checks, вопросы и ориентиры защиты и rubric. Решение SHALL покрывать все обязательные и профильные шаги, а не только демонстрировать фрагмент или happy path.

#### Scenario: Instructor can demonstrate and grade without inventing missing steps
- **WHEN** преподаватель открывает solution pack выбранной работы и профиля
- **THEN** он получает полный эталон от исходных данных до итогового артефакта, команды проверки, ожидаемые результаты, объяснение решений и сопоставление с каждым критерием рубрики

#### Scenario: Student content does not disclose the solution
- **WHEN** формируется student-facing набор
- **THEN** он содержит условие, starter, public checks и критерии, но не содержит instructor solution, ориентиры ответов защиты или hidden/reference expectations

### Requirement: Practical work 1 has complete lifecycle and interface solutions
Семинар 1 SHALL требовать определения внешних и внутренних потребителей, целей, API-ресурсов, входов, выходов, ошибок, поставщиков, границ компонентов и этапов жизненного цикла. Solution pack SHALL содержать полностью заполненные профильные контекстные схемы и таблицы интерфейсов с объяснением каждой связи.

#### Scenario: Practical work 1 solution is complete
- **WHEN** проверяется эталон ПР № 1
- **THEN** `PRB` описывает бизнес-систему с элементами ИИ, `SII` — систему инференса, а каждый интерфейс связан с потребителем, целью, данными, ошибками и этапом жизненного цикла

### Requirement: Practical work 2 has a validated complete OpenAPI solution
Семинар 2 SHALL привести к профильному REST API и OpenAPI 3.1-контракту. Solution pack SHALL содержать полный OpenAPI-документ для загрузки или регистрации входа, запуска операции, статуса, результата и истории, включая схемы, required fields, ограничения, успешные ответы, единые ошибки и версии.

#### Scenario: Practical work 2 contract validates
- **WHEN** запускается OpenAPI validation для эталона ПР № 2
- **THEN** документ синтаксически валиден и согласован с описанными путями, методами, параметрами, запросами, ответами и профильной предметной областью

### Requirement: Practical work 3 has a fully reproducible diagnostic solution
Семинар 3 SHALL использовать локальный reference API и требовать не менее трёх успешных и пяти намеренно ошибочных запросов через `curl` и Postman/Insomnia или эквивалентную коллекцию. Solution pack SHALL содержать полную коллекцию, команды, ожидаемые статусы, заголовки и JSON-тела и заполненный отчёт «ожидание → наблюдение → объяснение».

#### Scenario: Practical work 3 observations are deterministic
- **WHEN** эталонная диагностика запускается против reference API
- **THEN** все успешные и ошибочные запросы возвращают документированные результаты и отчёт не требует внешнего production endpoint

### Requirement: Practical work 4 has a complete evidence-based architecture decision
Семинар 4 SHALL требовать сравнения REST, gRPC, WebSocket и event-driven взаимодействия по directionality, latency, throughput, coupling, delivery, retries, scaling, observability, maintainability и operating cost. Solution pack SHALL содержать полностью заполненные `PRB` и `SII` матрицы, ADR с выбором и условия пересмотра решения.

#### Scenario: Practical work 4 conclusion follows from assumptions
- **WHEN** рецензент проверяет эталонный ADR
- **THEN** выбор выводится из численных или явно качественных параметров нагрузки, а не из утверждения, что одна технология универсально лучше

### Requirement: Practical work 5 has a complete tested FastAPI solution
Семинары 5–6 SHALL вместе привести к одному FastAPI-сервису с health route, профильными маршрутами, Pydantic request/response-моделями, валидацией, едиными ошибками, логированием, Swagger UI и OpenAPI. Solution pack SHALL содержать полный запускаемый сервис, зависимости, синтетические данные, public и instructor tests и README.

#### Scenario: Practical work 5 solution passes clean validation
- **WHEN** эталон ПР № 5 разворачивается по README
- **THEN** сервис запускается, проходит health, success, validation, not-found и dependency-failure проверки, а OpenAPI совпадает с наблюдаемым поведением

### Requirement: Practical work grading follows the RPD scale
Каждая практическая работа № 1–5 SHALL получать одну итоговую оценку максимум 5 баллов. Rubric SHALL использовать уровни `5`, `4`, `3`, `2` и `0`: `5` — полное корректное решение, глубокое объяснение, полные ответы и отсутствие недостатков оформления; `4` — полное решение с небольшими недочётами при верной защите; `3` — решение представлено полностью, но содержит существенные недочёты, неполные ответы или недостатки оформления; `2` — неверный вариант либо грубые нарушения метода, контракта или последовательности; `0` — работа не представлена. Задержка на одну неделю SHALL уменьшать оценку на один балл в соответствии с РПД.

#### Scenario: Rubric translates the source defect into API evidence
- **WHEN** оценивается практическая работа курса API-технологий
- **THEN** шаблонная формулировка РПД о «статистических методах» не копируется как предметный критерий, а полнота, контракт/архитектура, работоспособность и тесты, безопасность/воспроизводимость/документация и защита используются как наблюдаемая авторская конкретизация

#### Scenario: Grade is traceable to evidence
- **WHEN** преподаватель выставляет оценку за ПР № 1–5
- **THEN** заполненная профильная rubric указывает доказательства по каждому критерию, применённый уровень РПД, штраф за срок при наличии и итог 0–5

### Requirement: Practical materials remain safe, reproducible, and unpublished
Starters, solutions, tests и данные SHALL использовать localhost и синтетические значения, документировать зависимости и команды, не содержать секретов или реальных данных и оставаться вне `course.yaml` до решения о публикационных профилях.

#### Scenario: Practical pack passes safety and publication review
- **WHEN** change реализован
- **THEN** заявленные команды воспроизводятся в чистой среде, secret/data scan не находит запрещённых значений, а student и instructor материалы не добавлены в publication allowlist

