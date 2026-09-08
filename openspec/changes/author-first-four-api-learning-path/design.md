## Context

Практическая часть и прежняя модель выдачи заменены change `reset-seminar-01-and-homework-01` 2026-09-08. Семинар/ДЗ и репозиторий сдачи определяются только новым change. История сохранена в [исходном плане](acceptance/superseded-2026-09-08/proposal.md); она не является действующей инструкцией и не должна возвращаться в main specs.

## Goals / Non-Goals

Сохранить лекционные решения и историю проверок. Не восстанавливать старые задания, каталог из десяти веток, профили практики и старые URL. Полный исходный design сохранён в [исторической версии](acceptance/superseded-2026-09-08/design.md); его практические решения отменены.

## Decisions

Сохранённые лекционные delta specs остаются источником требований этого change. Упоминания старых заданий в исторических лекционных примерах не создают обязательства восстановить практический маршрут. Лекционные файлы текущим сбросом не изменяются.

### 2. Два сквозных профильных проекта развиваются через четыре лекции

`PRB` использует сервис прогноза спроса/урожайности и длительные задания интеграции с бизнес-системой. Клиентские примеры пишутся на Python.

`SII` использует сервис инференса изображения/состояния посевов и поток результатов. Поставщик для первых четырёх лекций остаётся воспроизводимым Python/FastAPI-сервисом; готовые клиенты и контрактные демонстрации используют C++ там, где профильный язык проясняет границу, но студенты не обязаны менять C++ до лекции № 5.

Проекты согласуют общий error envelope, request correlation и понятия API/schema/model version, но не используют искусственно общий payload.

### 3. Каждая лекция получает coverage map и набор checkpoints

Checkpoint считается полным, если у него есть исходное состояние, команда запуска, действие демонстрации, ожидаемый результат и validation command. Финальный проект не заменяет промежуточные состояния.

#### Лекция 1: API как граница и жизненный цикл

| Checkpoint | Добавляемое наблюдаемое поведение | Покрываемые понятия |
|---|---|---|
| L1.1 | локальная функция и внешний HTTP-вызов дают один предметный результат | библиотечный API, Web API, consumer/provider |
| L1.2 | клиент отправляет профильный запрос и получает contract-shaped response | цель потребителя, вход, результат, явный контракт |
| L1.3 | pipeline добавляет access placeholder, validation, preprocessing, operation и postprocessing | слои обработки и граница ответственности |
| L1.4 | ошибки этапов имеют различимые codes и request_id | отказ, наблюдаемость, сокрытие реализации |
| L1.5 | быстрый вызов сравнивается с job creation/status/result | sync/async, long-running work |
| L1.6 | логи/метрики и смена model_version показывают эксплуатационный lifecycle | мониторинг, обновление и вывод версии |

#### Лекция 2: HTTP, REST, данные и контракт

| Checkpoint | Добавляемое наблюдаемое поведение | Покрываемые понятия |
|---|---|---|
| L2.1 | raw HTTP request/response разбирается по строке, headers и body | анатомия HTTP, Content-Type, Accept |
| L2.2 | collection/item routes показывают path и query parameters | ресурсы, URI, фильтрация, представление |
| L2.3 | GET/POST/PUT/PATCH/DELETE examples и status assertions | методы, safe, idempotent, коды |
| L2.4 | повтор POST с/без idempotency key даёт разные эффекты | повторы после timeout, идемпотентность |
| L2.5 | invalid JSON и invalid domain value дают разные ошибки | 400/422, validation before computation |
| L2.6 | conditional GET или cache metadata показывает reuse semantics | cache, ETag/conditions в ограниченном примере |
| L2.7 | OpenAPI генерируется/валидируется против вызовов | schema, required, examples, errors |
| L2.8 | совместимое и несовместимое изменение проходит/ломает contract checks | API/schema/model versions, compatibility |

#### Лекция 3: интеграционные стили

| Checkpoint | Добавляемое наблюдаемое поведение | Покрываемые понятия |
|---|---|---|
| L3.1 | обычный REST request/response | synchronous request-response |
| L3.2 | job accepted/status/result | asynchronous long-running API |
| L3.3 | unary RPC с `.proto` и generated messages | RPC/gRPC, Protocol Buffers |
| L3.4 | server-stream или WebSocket updates | streaming, bidirectional channel, disconnect |
| L3.5 | event producer/consumer с duplicate delivery simulation | event-driven, delivery, idempotent consumer |
| L3.6 | message trace через gateway/BFF/service-to-service boundaries | gateways, consumer-specific API, internal calls |
| L3.7 | один workload прогоняется через decision matrix | latency, throughput, coupling, operations |

REST и как минимум один профильный альтернативный стиль исполняются end-to-end. Для остальных сохраняются executable contract/parser checks и детерминированные message traces, если полный runtime непропорционально усложняет локальную среду; coverage map явно различает эти уровни.

#### Лекция 4: постепенная сборка FastAPI-сервиса

| Checkpoint | Добавляемое наблюдаемое поведение | Покрываемые понятия |
|---|---|---|
| L4.1 | app + `/health` запускаются Uvicorn | приложение, route, server lifecycle |
| L4.2 | профильный POST и response model | маршруты, typing, serialization |
| L4.3 | Pydantic constraints и validation errors | модели и validation before work |
| L4.4 | dependency/config injection заменяет hard-coded setting | Depends, configuration, testability |
| L4.5 | domain exceptions преобразуются в uniform error | exception handlers, status semantics |
| L4.6 | structured logs получают request_id | logging и correlation |
| L4.7 | async dependency simulation не блокирует соседний request | async handler и ограничение примера |
| L4.8 | Swagger UI/OpenAPI и tests подтверждают contract | automatic documentation, verification |
| L4.9 | профильный adapter показывает PostgreSQL/external API boundary или model call | интеграционная граница без production dependency |

Сравнение FastAPI/Flask/DRF выполняется небольшими эквивалентными route fragments и таблицей компромиссов; оно не требует трёх полноценных сервисов.

## Risks / Trade-offs

При будущем sync/archive переносить только оставшиеся активные delta specs. Исторические файлы из acceptance не синхронизировать. Исходные невыполненные пункты остаются невыполненными в сохранённом журнале.
