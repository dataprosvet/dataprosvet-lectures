# Probability Theory Source Policy Specification

## Purpose

Defines how normative, textbook, machine-learning, and methodological sources govern the accuracy, scope, examples, and enrichment of probability-theory materials.

## Requirements

### Requirement: Приоритет источников задан явно и по ролям
Предоставленный PDF с тематическим планом от 2026-08-31 SHALL определять границы и порядок лекций, а также факультативный статус лекции 8 как наиболее новый источник этих решений. РПД и ОМД SHALL продолжать определять трудоёмкость, результаты обучения, формальные индивидуальные задания, контрольные работы, кейсы и оценивание, кроме случаев, когда новый тематический план явно меняет размещение темы. Учебник В. Е. Гмурмана SHALL оставаться основным содержательным источником определений, теорем, формул, выводов, сопоставления обозначений и базовых примеров. Книги по машинному обучению SHALL активно использоваться для прикладной интерпретации и уместных примеров из ML и анализа данных. Другие книги и методические материалы MAY предоставлять упражнения, вычислительные методы, симуляции и дополнительный материал, но MUST NOT неявно переопределять источники с более высоким приоритетом.

#### Scenario: Материал обновляется после принятия нового плана
- **WHEN** создаётся или пересматривается лекция, семинар или домашняя работа
- **THEN** её тематическая граница соответствует предоставленному плану, оценочные обязательства соответствуют РПД и ОМД, математика опирается на содержательные источники, а полезные применения в ML рассмотрены явно

#### Scenario: Тема лекции создаётся или обновляется
- **WHEN** автор разрабатывает определения, формулы, объяснения, выводы, примеры или упражнения для лекции
- **THEN** тематическая граница сверяется с актуальным планом, обязательные результаты и связи с оцениванием проверяются по РПД и ОМД, основная математика сначала сверяется с Гмурманом, а книги по машинному обучению рассматриваются как источник полезных приложений и интерпретаций

### Requirement: Ожидаемый состав источников задокументирован
Контекст OpenSpec курса SHALL указывать скопированный актуальный PDF с тематическим планом под стабильным именем файла и SHALL назначать ему высший приоритет при определении границ лекций. Контекст SHALL продолжать указывать РПД, ОМД, Гмурмана, обе книги по машинному обучению, сборники задач и методические PDF, материалы по методу Монте-Карло, планы курса и актуальные свидетельства ревью. Все исходные файлы SHALL оставаться локальными, игнорируемыми системой контроля версий и неопубликованными.

#### Scenario: Агент начинает работу с материалами на основе источников
- **WHEN** агент читает политику источников курса перед редактированием материалов
- **THEN** он может найти актуальный PDF с тематическим планом, различить роли источников, применить иерархию при конфликте и не восстанавливать отсутствующие источники по памяти

### Requirement: Упражнения на основе источников переработаны и прослеживаемы
Преподавательские материалы SHALL сохранять внутренние сведения о происхождении выбранных определений, примеров и упражнений, а публичные материалы MUST NOT раскрывать локальные пути источников или воспроизводить существенные защищённые авторским правом фрагменты. Адаптированные упражнения SHALL независимо решаться и проверяться до использования.

#### Scenario: Проверяется банк упражнений
- **WHEN** принимается упражнение, созданное на основе локальной книги
- **THEN** внутренние свидетельства указывают роль источника, публичная формулировка достаточно переработана и существует независимо проверенное решение
### Requirement: Source conflicts and defects are handled explicitly
A lecture MUST NOT invent missing normative data or conceal a conflict between sources. The course SHALL retain documented handling for the missing graph in control-work task 3.5, the absent independence condition in individual assignment 6.3, the general and special forms of Chebyshev's law of large numbers, and the distinction between the modern convention `F(x)=P(X\le x)` and conventions used in older sources.

#### Scenario: Required task lacks sufficient source data
- **WHEN** an official exercise cannot be solved uniquely from the available RPD
- **THEN** the material labels the limitation, provides only clearly marked conditional or educational treatment, and does not fabricate an official numerical answer

#### Scenario: Gmurman and modern notation differ
- **WHEN** a definition or notation differs between the primary textbook and the course's adopted modern convention
- **THEN** the student material states the adopted convention and explains the translation needed to read the source correctly

### Requirement: Enrichment remains relevant to the lecture objective
Material taken from machine-learning or deep-learning sources SHALL clarify, motivate, exemplify, or extend the probability concept being taught. Enrichment MUST remain mathematically accurate and MUST NOT displace required probability-theory content.

#### Scenario: Machine-learning example is added
- **WHEN** a lecture uses an example involving data, models, loss, noise, uncertainty, or neural networks
- **THEN** the example is connected explicitly to the current probability concept and preserves the required definitions and conditions

### Requirement: Superseded audits remain historical and inactive
An audit whose findings have been resolved or invalidated by later revisions SHALL be marked superseded and moved to a non-published archive location rather than deleted or left as active guidance. A current versioned review record SHALL state which findings remain applicable, which were resolved, and which external blockers persist.

#### Scenario: Historical audit is consulted
- **WHEN** a maintainer opens the archived audit
- **THEN** its superseded status and successor review are unambiguous and its old recommendations are not mistaken for current acceptance failures

#### Scenario: Current review is completed
- **WHEN** all eight lecture families have been checked and the staged release is ready
- **THEN** versioned evidence records source coverage, accepted editorial changes, independent calculation checks, unresolved normative defects, and the publication decision
