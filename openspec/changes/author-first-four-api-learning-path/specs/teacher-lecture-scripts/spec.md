## MODIFIED Requirements

### Requirement: Teacher scripts are stored as internal Markdown materials
Система материалов курса SHALL содержать четыре самостоятельных Markdown-сценария в `lectures-teacher/`: `001_api-interface-layer-and-lifecycle.md`, `002_http-rest-openapi-data-contracts.md`, `003_integration-styles-api.md` и `004_python-api-services-fastapi.md`. Эти файлы MUST NOT быть объявлены в `course.yaml` или представлены как студенческие материалы.

#### Scenario: Internal placement is verified
- **WHEN** проверяется структура репозитория после реализации change
- **THEN** все четыре файла существуют в `lectures-teacher/`, а ссылки на них отсутствуют в `course.yaml`

### Requirement: Each script supports a complete 90-minute teacher-led lecture
Каждый сценарий SHALL содержать название и область профиля, место в курсе, измеримые результаты обучения, пререквизиты, поминутный план на 90 минут, последовательный текст объяснения, несколько оригинальных демонстраций или один развивающийся пример с исполняемыми контрольными точками, вопросы аудитории с ориентирами для ответа, типичные ошибки, итог, связь с практическими занятиями, покрытие РПД и карту источников.

#### Scenario: Lecturer can prepare from the script alone
- **WHEN** преподаватель последовательно читает один сценарий
- **THEN** он получает порядок и длительность блоков, тезисы объяснения, команды и ожидаемые результаты демонстраций, точки взаимодействия со студентами и критерии завершения лекции без обращения к скрытому второму конспекту

#### Scenario: Timing is internally consistent
- **WHEN** суммируются интервалы поминутного плана лекции
- **THEN** они образуют непрерывную последовательность от 0 до 90 минут и согласуются с расположением объяснений и демонстрационных checkpoints

### Requirement: Common and profile-specific material is visibly separated
Все четыре сценария SHALL маркировать общие блоки как `COMMON`, а профильные вставки как `PRB` или `SII`. Нормативные компетенции, инструменты и кейсы одного профиля MUST NOT приписываться другому профилю; FastAPI/Python-контур лекции № 4 SHALL быть обозначен как общий для обоих РПД.

#### Scenario: A lecturer selects one profile
- **WHEN** преподаватель готовит любую из первых четырёх лекций только для группы ПРБ или только для группы СИИ
- **THEN** по меткам он однозначно определяет общий материал, профильные checkpoints, включаемые примеры и фрагменты другого профиля, которые нужно исключить

### Requirement: Source use is original, safe, and reproducible
Сценарии SHALL пересказывать идеи источников своими словами и использовать оригинальные учебные примеры. Примеры MUST использовать синтетические данные и локальные или фиктивные адреса и MUST NOT содержать учётные данные, персональные данные, производственные endpoints или конфиденциальную информацию. Каждый исполняемый checkpoint SHALL указывать язык, зафиксированные или документированные версии зависимостей, команду запуска, ожидаемый запрос и ответ и автоматический или однозначный ручной способ проверки.

#### Scenario: Source and safety review passes
- **WHEN** все четыре сценария проходят редакционную проверку
- **THEN** в них отсутствуют длинные заимствованные фрагменты и секреты, а каждый пример можно объяснить и проверить без доступа к производственной системе

#### Scenario: Source and execution review passes
- **WHEN** все четыре сценария и связанные checkpoints проходят редакционную и техническую проверку
- **THEN** в них отсутствуют длинные заимствованные фрагменты и секреты, а каждый заявленный исполняемым checkpoint воспроизводится локально на синтетических данных по указанной инструкции

## ADDED Requirements

### Requirement: Every substantial lecture concept has a demonstration anchor
Для каждой из первых четырёх лекций SHALL существовать coverage map, связывающая каждое существенное понятие из результатов обучения и поминутного плана как минимум с одним наблюдаемым примером: фрагментом исполняемого кода, HTTP-запросом и ответом, OpenAPI/Protocol Buffers-контрактом, архитектурной схемой, трассой сообщений или проверяемым ошибочным сценарием. Один проект MAY последовательно дописываться, но итоговое состояние MUST NOT быть единственной демонстрацией лекции.

#### Scenario: Concept coverage has no unexplained gap
- **WHEN** рецензент проходит по понятиям и результатам обучения конкретной лекции
- **THEN** для каждого понятия coverage map указывает место объяснения, checkpoint, команду или действие, ожидаемое наблюдение и связь с практикой

#### Scenario: Incremental project remains teachable
- **WHEN** одна демонстрация развивается на протяжении лекции
- **THEN** промежуточные checkpoints именованы, воспроизводимы в заданном порядке, показывают ровно введённое изменение и имеют сохранённое ожидаемое поведение

### Requirement: Lecture checkpoints are fully executable and validated
Исполняемые материалы SHALL содержать конечный полный исходный код и воспроизводимые промежуточные состояния либо детерминированные патчи между ними. Для каждого checkpoint SHALL существовать validation command, которая завершается успешно в заявленной чистой среде и проверяет не только запуск процесса, но и ожидаемое наблюдаемое поведение.

#### Scenario: Clean validation proves the lecture path
- **WHEN** проверяющий разворачивает профильную демонстрацию по README и последовательно запускает validation commands
- **THEN** все checkpoints проходят, ожидаемые успешные и ошибочные вызовы совпадают с лекцией, а проверка не требует production-систем, секретов или недокументированного ручного исправления

### Requirement: Lecture 3 compares integration styles under explicit assumptions
Третий сценарий SHALL раскрывать REST, RPC/gRPC, Protocol Buffers, WebSocket и event-driven API, различать синхронное, асинхронное, потоковое и двунаправленное взаимодействие и объяснять API gateway, backend-for-frontend и service-to-service коммуникацию. Каждая концепция SHALL иметь контрактный или исполняемый пример, а выбор стиля SHALL опираться на явно заданные latency, throughput, directionality, coupling, delivery, scaling, observability, maintainability и operating-cost assumptions.

#### Scenario: One profile scenario evolves across styles
- **WHEN** преподаватель проводит центральную демонстрацию лекции № 3
- **THEN** одна профильная задача получает отдельные checkpoints REST, long-running/asynchronous, gRPC, WebSocket и event-driven формы с согласованными данными, направлением обмена, ошибками и эксплуатационными компромиссами

#### Scenario: Profile choice remains normative
- **WHEN** разбирается профильный выбор интеграционного стиля
- **THEN** `PRB` использует бизнес-сервис, ETL или длительный расчёт, а `SII` — online-инференс или потоковые результаты компьютерного зрения без переноса компетенций между РПД

### Requirement: Lecture 4 incrementally builds a FastAPI contract implementation
Четвёртый сценарий SHALL последовательно дописывать полностью исполняемый FastAPI-сервис через checkpoints приложения и health route, профильных маршрутов, Pydantic request/response-моделей, валидации, зависимостей и конфигурации, исключений и единых ошибок, логирования, async handlers, Swagger UI и OpenAPI. `PRB` SHALL дополнительно сравнить FastAPI, Flask и Django REST Framework и показать границы подключения PostgreSQL/внешнего API; `SII` SHALL показать контракт вызова модели и результата инференса без требования C++-сервера.

#### Scenario: Invalid input is rejected before domain work
- **WHEN** checkpoint валидации получает структурно корректный JSON с нарушением Pydantic-ограничения
- **THEN** сервис возвращает документированную ошибку до прогнозирования или инференса, а код, тест, Swagger UI и OpenAPI согласованно показывают это ограничение

#### Scenario: Final service preserves all prior checkpoints
- **WHEN** запускается финальный checkpoint лекции № 4
- **THEN** он проходит проверки всех ранее введённых маршрутов, моделей, ошибок, логирования и документации для выбранного профиля

### Requirement: Profile languages support rather than pre-empt the curriculum
Клиентские примеры `PRB` SHALL использовать Python. Готовые клиентские примеры `SII` в лекциях 1–3 SHALL использовать C++ там, где это помогает профильной цели, но MUST NOT требовать от студентов самостоятельной реализации CMake-проекта до лекции № 5. Серверные checkpoints лекции № 4 SHALL использовать Python/FastAPI для обоих профилей.

#### Scenario: SII can observe C++ before implementing it
- **WHEN** преподаватель показывает C++ checkpoint в лекциях 1–3
- **THEN** проект уже содержит полную реализацию, сборочную инструкцию и ожидаемый вывод, а студенты анализируют контракт и поведение без обязательного написания C++
