## Context

В репозитории есть полные teacher scripts лекций 1–2, но нет лекций 3–4, семинаров, ДЗ и проверяемого кода. Первые шесть практических встреч соответствуют пяти работам РПД: работы № 1–4 занимают по два часа, работа № 5 — четыре часа и две встречи. Оба РПД задают максимум 5 баллов за каждую из 12 практических работ и штраф один балл за недельное опоздание; отдельного дополнительного банка оценивания домашних заданий нет.

Таблица оценивания РПД использует шаблонное выражение «статистические методы», хотя методические рекомендации требуют оценивать работоспособность API, архитектуру, контракты, безопасность, тестируемость, документацию, воспроизводимость и защиту. Поэтому change сохраняет уровни и максимумы РПД, но конкретизирует доказательства применительно к API и явно маркирует эту детализацию как решение курса.

Модель публичного выпуска `PRB`/`SII` не решена. Teacher scripts и instructor solutions остаются внутренними; student-ready семинары, ДЗ и starters создаются, но не включаются в `course.yaml`.

## Goals / Non-Goals

**Goals:**

- дать преподавателю полные сценарии лекций 1–4 и несколько наблюдаемых примеров для каждой лекции;
- построить примеры как последовательное развитие двух профильных проектов с воспроизводимыми checkpoints;
- полностью расписать семинары 1–6 и эталонные решения практических работ № 1–5;
- дать для каждого ДЗ дописываемый template, public checks, полное reference solution и instructor checks;
- сделать критерии уровней 5/4/3/2/0 видимыми студенту и трассируемыми к доказательствам;
- автоматически подтвердить синтаксис, контрактную согласованность, запуск и ожидаемое поведение всех заявленных исполняемыми материалов;
- сохранить нормативные различия `PRB` и `SII` и одну оценку за связку «практика + ДЗ».

**Non-Goals:**

- создавать студенческие версии лекций, конспекты или презентации;
- реализовывать практические работы № 6–12, кейсы, контрольные работы или итоговое тестирование;
- начислять отдельные баллы за ДЗ сверх 5 баллов соответствующей практической работы;
- преподавать самостоятельную разработку C++-клиента до лекции № 5;
- подключать реальные production API, PostgreSQL, брокер, ML-модель или GPU;
- решать модель публикации профилей или менять `course.yaml`.

## Decisions

### 1. Capabilities и артефакты разделяются физически и по аудитории

План содержит три независимых capability:

- `teacher-lecture-scripts` — внутренние сценарии, демонстрационный код и teacher checkpoints;
- `profiled-practicals` — студенческие семинары и закрытые полные решения практик;
- `profiled-homeworks` — студенческие templates и закрытые эталоны ДЗ.

Студенческие Markdown-файлы размещаются в `seminars/` и `homeworks/`. Весь вспомогательный код хранится внутри разрешённого `attachments/api-learning-path/` с явным разделением:

```text
attachments/api-learning-path/
├── contracts/                 # profile OpenAPI/proto/error schemas
├── lecture-demos/
│   ├── prb/                   # Python evolving project and checkpoints
│   └── sii/                   # Python provider + ready C++ clients/checkpoints
├── practicals/
│   ├── prb/pr01..pr05/
│   │   ├── starter/
│   │   ├── instructor-solution/
│   │   ├── public-checks/
│   │   └── instructor-checks/
│   └── sii/pr01..pr05/        # same contract
├── homeworks/
│   ├── prb/hw01..hw05/
│   │   ├── template/
│   │   ├── instructor-solution/
│   │   ├── public-checks/
│   │   └── instructor-checks/
│   └── sii/hw01..hw05/
├── synthetic-data/
└── validation/                # orchestration and clean-run evidence
```

Instructor solutions и ориентиры защиты никогда не ссылаются из student-facing Markdown и не объявляются в `course.yaml`. Такое хранение делает полный ответ доступным преподавателю, но не превращает его в часть публикационного набора.

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

### 4. Полные решения практических работ определены до написания student materials

#### ПР № 1 — анализ API-сценариев

- Student artifact: контекстная схема и таблица интерфейсов.
- `PRB` solution: приложение агронома/аналитика, ERP/CRM/BI, forecast service, data source, report consumer; для каждой связи — goal, input, output, errors и lifecycle stage.
- `SII` solution: image source, inference service, model registry/version, operator application, monitoring/feedback; та же обязательная структура.
- Checks: schema/table completeness, уникальные interface identifiers, отсутствие прямого раскрытия внутренних таблиц/классов, согласованность направлений.
- Defense: consumer goal, API boundary, lifecycle и sync/async choice.

#### ПР № 2 — REST API и OpenAPI

- Student artifact: OpenAPI 3.1 document и краткое описание resource model.
- `PRB` solution: upload/register dataset, create forecast job, get status, get result, list history.
- `SII` solution: register image/input, create inference request, get status, get result, list history.
- Обязательная полнота: info/servers, paths, operations, parameters, request/response schemas, required/constraints, 2xx/4xx/5xx, uniform errors, request_id, schema_version и model_version.
- Checks: YAML parse, OpenAPI lint/validation, required operation set, schema assertions, example validation и compatibility check.
- Defense: resource vs command, method/status, 400 vs 422, version distinctions.

#### ПР № 3 — диагностика HTTP API

- Student artifact: collection/script и заполненный diagnostic report.
- Solution: не менее трёх success cases и пяти error cases, включая malformed JSON, schema violation, not found, state conflict и temporary dependency failure; для каждого — command, expected status/headers/body, actual result и explanation.
- Checks: deterministic seed/reset, localhost-only requests, JSON assertions, request_id correlation, reference API health.
- Defense: transport vs application error, retry/idempotency и значение headers.

#### ПР № 4 — выбор интеграционного стиля

- Student artifact: заполненная decision matrix и ADR.
- `PRB` solution workload: interactive forecast lookup + long batch/ETL completion event.
- `SII` solution workload: unary online inference + streaming result updates.
- Matrix содержит directionality, latency target, payload/rate, throughput, delivery, ordering, retry, coupling, observability, deployment и cost assumptions.
- Reference ADR выбирает стиль отдельно для каждой операции, фиксирует rejected alternatives, risks и reconsideration triggers.
- Checks: все обязательные критерии заполнены; conclusion ссылается на assumptions; отсутствует «X всегда лучше».
- Defense: failure mode, operational ownership и change scenario.

#### ПР № 5 — FastAPI-сервис, две встречи

- Part 1 result: project installs, `/health` passes, профильный POST route и Pydantic request/response models работают.
- Part 2 result: constraints, errors, logging, OpenAPI, tests и README завершены в том же repository.
- `PRB` solution routes: health, forecast creation/status/result либо reports/ETL subset согласованный с ПР № 2.
- `SII` solution routes: health, inference creation/status/result/models subset согласованный с ПР № 2.
- Checks: unit/integration tests, success, validation, not-found, conflict/dependency failure, OpenAPI snapshot/semantic assertions, clean launch.
- Defense: validation order, dependency boundary, async limitation, OpenAPI correspondence.

### 5. Домашние задания являются контролируемым дописыванием практик

| ДЗ | Что уже дано | Что студент дописывает | Эталон и проверка |
|---:|---|---|---|
| 1 | базовая схема/таблица ПР № 1 | дополнительного consumer, error paths, lifecycle stage и rationale | полностью заполненная схема + structural checklist |
| 2 | валидный каркас OpenAPI и часть schemas | TODO paths, errors, constraints, examples/version metadata | полный contract + lint/schema/behavior checks |
| 3 | готовый client harness и два примера | дополнительные success/error calls, assertions и explanations | полный script/collection + deterministic report |
| 4 | ADR template и workload | alternatives, assumptions, trade-offs, decision и triggers | полный profile ADR + rubric evidence map |
| 5 | repository после семинара 6 с TODO markers | validator, error path, profile route, tests и README section | полный service + regression/contract suite |

Каждый template должен быть честно дописываемым: public tests называют нарушенное требование, но не раскрывают точную реализацию. Instructor solution проходит public и reference checks. Для неисполняемых артефактов используются machine-readable schema/checklist там, где это возможно, и полный преподавательский эталон для содержательной сверки.

### 6. Одна rubric объединяет практику и домашнее продолжение

Для каждой работы создаётся профильная матрица с пятью группами доказательств:

1. полнота нормативного результата и выполнение своего варианта;
2. корректность API-контракта, данных или архитектурного решения;
3. работоспособность, проверки и отсутствие регрессий;
4. безопасность, воспроизводимость, документация и оформление;
5. объяснение решения и ответы на защите.

Уровни применяются целиком, без изобретения отдельной суммы баллов по ДЗ:

| Итог | Интерпретация РПД для API-работ |
|---:|---|
| 5 | Полный профильный результат; контракт/архитектура корректны; все обязательные проверки проходят; запуск и оформление без недостатков; объяснение и ответы полные и глубокие. |
| 4 | Результат полный и воспроизводимый; есть небольшие недочёты в контракте, анализе, тестах или объяснении; ответы по существу верны; критических нарушений нет. |
| 3 | Все обязательные части представлены, но есть существенные недочёты, неполные проверки/объяснения или проблемы оформления; студент отвечает не на все вопросы. |
| 2 | Выполнен неверный вариант либо имеются грубые нарушения контракта, метода или последовательности; обязательное поведение не воспроизводится или решение не может быть объяснено. |
| 0 | Связанный результат не представлен. Уровень 1 не вводится, поскольку его нет в таблице РПД. |

Семинар даёт предварительные доказательства. ДЗ завершает или индивидуализирует тот же результат. После срока преподаватель заполняет одну final rubric и выставляет один итог 0–5. Недельная задержка уменьшает полученный балл на один; применение штрафа записывается отдельно. Если ДЗ не представлено, отсутствующая обязательная часть влияет на полноту той же работы, а не образует отдельный ноль.

Для каждой ПР rubric конкретизирует первую и вторую группы:

- ПР1: completeness и correctness контекстной схемы/интерфейсов/lifecycle;
- ПР2: resource model и согласованность/валидность OpenAPI;
- ПР3: полнота наблюдений и правильность HTTP-диагностики;
- ПР4: полнота assumptions и доказательность архитектурного решения;
- ПР5: contract-correct working service, validation, errors, tests и docs.

### 7. Валидация проверяет не только синтаксис, но и поведение

Validation orchestration включает:

1. Markdown links и ожидаемую структуру файлов.
2. JSON/YAML parse, OpenAPI lint/validation, example-against-schema checks и `.proto` compilation.
3. Python dependency installation from pinned manifest, import/compile checks и test suite.
4. CMake configure/build/test для готовых `SII` clients с документированной toolchain и dependency versions.
5. Запуск локальных providers, readiness check, success/error HTTP scenarios и clean shutdown.
6. Последовательный прогон каждого lecture checkpoint и финального regression suite.
7. Проверку исходного состояния homework templates: setup проходит, ожидаемые TODO tests падают по документированным причинам; затем reference solutions проходят всё.
8. Secret/forbidden-data scan, localhost/fictional-host allowlist и отсутствие production dependencies.
9. Contract coverage report: lecture prose, OpenAPI, code, practices, homeworks и tests согласованы по method/path/schema/status/error/version.

Фраза «полностью исполняемый» используется только для артефакта, который реально прошёл соответствующую команду. Контрактные схемы и архитектурные решения, которые не являются программой, называются «машиночитаемо проверенными» или «эталонно сверенными».

### 8. Профильная и публикационная проверка выполняются отдельно

Материалы читаются дважды: в режиме `COMMON+PRB` и `COMMON+SII`. Cross-profile audit проверяет, что Python/data/ETL/PL-1 не выданы за обязательные `SII`, а C++/streaming/PL-4 — за обязательные `PRB`. FastAPI lecture/practical core остаётся общим, профильными являются payload, routes и rationale.

Ни один новый путь не добавляется в `course.yaml`. До решения о публикации instructor solutions, student materials и attachments остаются dormant.

## Risks / Trade-offs

- [Полные эталоны могут попасть студентам] → хранить их только в instructor-solution, не ссылаться из student Markdown и не объявлять в publication allowlist.
- [Дублирование starter и solution ведёт к расхождению] → строить оба из одного contract fixture и прогонять общий regression suite плюс template-state checks.
- [Одна оценка за практику и ДЗ выглядит неоднозначно] → в каждом материале явно показывать одну final rubric и роль семинарской/домашней части как доказательств одного результата.
- [РПД не определяет уровень 1] → не вводить его; использовать только 5/4/3/2 и 0 за отсутствие работы, отдельно показывая late penalty.
- [Checkpoints разрастаются и ломают 90 минут] → coverage map различает обязательные live checkpoints и заранее подготовленные короткие наблюдения; каждый блок имеет сокращаемую часть.
- [gRPC/WebSocket/events требуют тяжёлой среды] → полностью исполнять REST и профильный альтернативный стиль; для оставшихся требовать компилируемый контракт и детерминированную message trace, не называя это end-to-end runtime.
- [C++ toolchain нестабилен между платформами] → документировать compiler/CMake/dependency versions, иметь CPU-only путь и проверять сборку в выбранной reference environment.
- [Авторская рубрика выдаётся за дословное РПД] → отдельно подписывать уровни как нормативную шкалу РПД, а API-доказательства как методическую конкретизацию из рекомендаций РПД.
- [Student material содержит hidden answer] → выполнять автоматический content audit по путям и запрещённым ссылкам до завершения change.
- [Профильные материалы случайно публикуются] → сохранить `course.yaml` неизменным и включить diff-проверку publication plan в acceptance.

