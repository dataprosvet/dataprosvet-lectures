## Purpose

Определяет пять профильных домашних продолжений практических работ № 1–5 с дописываемыми шаблонами, эталонными решениями, проверкой и единой оценкой по РПД.

## ADDED Requirements

### Requirement: Five homeworks continue the five practical outcomes
Система материалов курса SHALL содержать ДЗ № 1–5, каждое из которых ссылается на практическую работу с тем же номером и служит её индивидуальным продолжением или завершением. Домашние задания MUST NOT объявляться дополнительными нормативными работами, отдельными часами РПД или вторым официальным банком оценивания.

#### Scenario: Homework mapping is auditable
- **WHEN** рецензент проверяет ДЗ № 1–5
- **THEN** каждое содержит scope, номер и результат соответствующей практической работы, требуемое дополнение, артефакт, ограничения, проверку и связь с итоговой оценкой той же работы

### Requirement: Every homework has a student template and instructor reference solution
Каждое ДЗ SHALL предоставлять student template с явно обозначенными `TODO`, достаточным контекстом, public checks и неизменяемыми контрактными ограничениями. Отдельный instructor pack SHALL содержать полностью заполненный эталон, reference checks, ожидаемое поведение и explanation map от каждого `TODO` к требованию и критерию оценивания.

#### Scenario: Template is incomplete by design but runnable where appropriate
- **WHEN** студент получает шаблон кодового ДЗ
- **THEN** setup и базовые проверки запускаются, незавершённые требования отмечены `TODO`, часть тестов ожидаемо не проходит до реализации, а за пределами `TODO` не требуется угадывать скрытый контракт

#### Scenario: Reference solution proves solvability
- **WHEN** преподаватель запускает эталонное решение того же ДЗ
- **THEN** все public и reference checks проходят в чистой среде, а итог соответствует условию и не требует недокументированных действий

### Requirement: Homework 1 completes the API context artifact
ДЗ № 1 SHALL требовать индивидуально дополнить профильную контекстную схему и таблицу интерфейсов новыми потребителями, ошибками или этапами жизненного цикла. Template SHALL содержать незаполненные строки и связи, а reference solution — полностью заполненный обоснованный вариант.

#### Scenario: Homework 1 continuation is visible
- **WHEN** сравниваются результат семинара 1 и выполненное ДЗ № 1
- **THEN** домашний артефакт расширяет тот же сценарий и сохраняет согласованность потребителей, целей, границ и жизненного цикла

### Requirement: Homework 2 completes the OpenAPI contract
ДЗ № 2 SHALL требовать дописать отсутствующие paths, schemas, errors, constraints или version metadata в профильном OpenAPI template. Reference solution SHALL содержать полный валидный контракт и автоматическую проверку синтаксиса и обязательного поведения.

#### Scenario: Homework 2 template cannot pass before completion
- **WHEN** public contract checks запускаются на исходном template
- **THEN** они указывают на конкретные незавершённые требования, а после корректного заполнения проходят без изменения самих тестов

### Requirement: Homework 3 completes executable HTTP diagnostics
ДЗ № 3 SHALL требовать дописать запросы, assertions и объяснения для новых успешных и ошибочных сценариев reference API. Reference solution SHALL содержать полный скрипт или коллекцию и заполненный отчёт с детерминированными ожидаемыми результатами.

#### Scenario: Homework 3 validates observation and explanation
- **WHEN** выполненный шаблон запускается против reference API
- **THEN** assertions проверяют статусы, заголовки и JSON, а объяснения корректно связывают наблюдение с HTTP- и контрактной семантикой

### Requirement: Homework 4 completes an architecture decision record
ДЗ № 4 SHALL требовать заполнить недостающие альтернативы, assumptions, риски, решение и reconsideration triggers в профильном ADR template. Reference solution SHALL показывать полный аргументированный выбор без объявления универсально лучшего стиля.

#### Scenario: Homework 4 decision is reviewable
- **WHEN** преподаватель сравнивает ADR с заданной нагрузкой и rubric
- **THEN** каждое существенное утверждение имеет основание в требованиях или явно обозначено как допущение

### Requirement: Homework 5 completes the FastAPI service
ДЗ № 5 SHALL продолжать репозиторий ПР № 5 и требовать дописать обозначенные validators, error handling, профильный маршрут, tests или документацию без изменения заданного контракта. Reference solution SHALL содержать полный сервис и все проходящие проверки.

#### Scenario: Homework 5 preserves seminar behavior
- **WHEN** студент завершает TODO и запускает полный test suite
- **THEN** все ранее пройденные проверки ПР № 5 сохраняются, новые требования проходят, а OpenAPI и README соответствуют финальному сервису

### Requirement: Homework evidence contributes to one practical-work grade
ДЗ № 1–5 SHALL завершать доказательства для rubric соответствующей ПР № 1–5 и MUST NOT получать вторую независимую оценку сверх нормативного максимума 5 баллов. До завершения ДЗ преподаватель MAY зафиксировать предварительный уровень; после срока SHALL выставляться единая итоговая оценка практической работы с учётом семинарского результата, домашнего продолжения и защиты. Непредставленное ДЗ SHALL оцениваться как отсутствие требуемой части связанного результата, а не как отдельный нулевой банк.

#### Scenario: One package yields one score
- **WHEN** завершены семинарская и домашняя части работы № N
- **THEN** одна заполненная rubric объединяет доказательства обеих частей и выдаёт единственный итог 0–5 с применимым штрафом за срок

### Requirement: Homework grading criteria are explicit before submission
Каждое ДЗ SHALL содержать student-visible checklist и профильную grading matrix по полноте требуемого дополнения, корректности контракта или архитектуры, прохождению проверок, безопасности и воспроизводимости, документации и способности объяснить решение. Instructor solution SHALL содержать evidence map, но MUST NOT быть включён в student-facing материал.

#### Scenario: Student can predict acceptance without seeing the answer
- **WHEN** студент читает ДЗ до выполнения
- **THEN** он понимает требуемый артефакт, неизменяемые ограничения, команды public checks и признаки уровней 5/4/3/2/0 без доступа к эталонному решению

### Requirement: Homework packs remain safe and unpublished
Templates, solutions, tests и данные SHALL использовать синтетические значения и localhost, документировать зависимости, не содержать секретов или реальных данных и оставаться вне `course.yaml` до решения о профилях публикации.

#### Scenario: Homework pack passes clean validation
- **WHEN** change реализован
- **THEN** templates запускаются в ожидаемом начальном состоянии, instructor solutions проходят все проверки, forbidden-data scan чист, а новые пути отсутствуют в publication allowlist

