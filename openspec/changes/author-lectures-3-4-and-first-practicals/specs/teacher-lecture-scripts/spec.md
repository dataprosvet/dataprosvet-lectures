## MODIFIED Requirements

### Requirement: Teacher scripts are stored as internal Markdown materials
Система материалов курса SHALL содержать четыре самостоятельных Markdown-сценария в `lectures-teacher/`: `001_api-interface-layer-and-lifecycle.md`, `002_http-rest-openapi-data-contracts.md`, `003_integration-styles-api.md` и `004_python-api-services-fastapi.md`. Эти файлы MUST NOT быть объявлены в `course.yaml` или представлены как студенческие материалы.

#### Scenario: Internal placement is verified
- **WHEN** проверяется структура репозитория после реализации change
- **THEN** все четыре файла существуют в `lectures-teacher/`, а ссылки на них отсутствуют в `course.yaml`

### Requirement: Teacher scripts target the sole PRB course scope
Все четыре сценария SHALL представлять один последовательный материал для ПРБ. Нормативные компетенции, инструменты и кейсы SHALL трассироваться к РПД ПРБ; дополнительные примеры SHALL быть обозначены как методические решения курса. Обязательный FastAPI/Python-контур лекции № 4 SHALL раскрываться для этой группы без выбора профильной ветки.

#### Scenario: A lecturer prepares the PRB cohort
- **WHEN** преподаватель готовит любую из первых четырёх лекций для группы ПРБ
- **THEN** он получает полный связный сценарий без выбора профильной ветки, а обязательные результаты соответствуют РПД ПРБ

### Requirement: Source use is original, safe, and reproducible
Сценарии SHALL пересказывать идеи источников своими словами и использовать оригинальные учебные примеры. Примеры MUST использовать синтетические данные и локальные или фиктивные адреса и MUST NOT содержать учётные данные, персональные данные, производственные endpoints или конфиденциальную информацию. Исполняемый пример SHALL указывать язык, зависимости или их версии, команду запуска, ожидаемый запрос и ответ и способ проверки.

#### Scenario: Source and safety review passes
- **WHEN** все четыре сценария и связанные демонстрации проходят редакционную проверку
- **THEN** в них отсутствуют длинные заимствованные фрагменты и секреты, а каждый заявленный исполняемым пример воспроизводится локально на синтетических данных по указанной инструкции

## ADDED Requirements

### Requirement: Lecture 3 compares integration styles under explicit assumptions
Третий сценарий SHALL раскрывать REST, RPC/gRPC, Protocol Buffers, WebSocket и event-driven API, различать синхронное, асинхронное, потоковое и двунаправленное взаимодействие и объяснять роль API gateway, backend-for-frontend и service-to-service взаимодействия. Выбор стиля SHALL опираться на явно заданные требования к задержке, пропускной способности, связанности, масштабированию, сопровождаемости и стоимости эксплуатации, а не на универсальный рейтинг технологий.

#### Scenario: One scenario is represented by multiple styles
- **WHEN** преподаватель проводит центральное сравнение лекции № 3
- **THEN** одна задача бизнес-системы ПРБ получает согласованные формы REST, gRPC, WebSocket и события, а для каждой формы названы направление обмена, контракт, модель отказа и эксплуатационный компромисс

#### Scenario: Integration choice follows PRB learning outcomes
- **WHEN** разбирается выбор интеграционного стиля
- **THEN** пример использует бизнес-сервисы, ETL или длительный расчёт и связывает выбор с требованиями бизнес-системы ПРБ

### Requirement: Lecture 4 builds a minimal FastAPI service as a contract implementation
Четвёртый сценарий SHALL последовательно раскрывать FastAPI, Pydantic, Uvicorn, маршруты, модели запросов и ответов, типизацию, валидацию, зависимости, конфигурацию, исключения, логирование, асинхронные обработчики и Swagger UI/OpenAPI. Сценарий SHALL содержать сравнение FastAPI, Flask и Django REST Framework и мост к PostgreSQL и внешним API для бизнес-решений ПРБ.

#### Scenario: Service rejects invalid input before domain work
- **WHEN** преподаватель отправляет структурно корректный JSON с нарушением ограничения Pydantic-модели
- **THEN** сервис возвращает документированную ошибку до запуска прогнозирования или инференса, а Swagger UI и OpenAPI показывают соответствующее входное ограничение

#### Scenario: FastAPI implements a PRB business contract
- **WHEN** преподаватель проводит демонстрацию лекции № 4
- **THEN** группа изучает FastAPI/Python-механизм на примере прогноза, отчёта или ETL-задачи

### Requirement: Lectures 1 through 4 include coherent executable demonstrations
Каждая из первых четырёх лекций SHALL содержать как минимум одну минимальную воспроизводимую демонстрацию, которая делает наблюдаемой центральную концепцию занятия. Клиентские демонстрации ПРБ SHALL использовать Python; серверная демонстрация лекции № 4 SHALL использовать Python/FastAPI.

#### Scenario: Contract representations agree
- **WHEN** рецензент сверяет prose, HTTP, OpenAPI, JSON и исполняемый клиент или сервер одной демонстрации
- **THEN** путь, метод, поля, обязательность, успешные и ошибочные статусы, единый формат ошибки и версии совпадают во всех представлениях

