<<<<<<< HEAD
# Спецификация возможности: probability-theory-seminar-materials

## Purpose

Устанавливает единый проверяемый контракт для преподавательских и публичных версий всех семинаров курса теории вероятностей.

## Requirements

### Requirement: Каждый семинар имеет две согласованные версии
Для каждого из 17 семинаров курс SHALL поддерживать закрытую преподавательскую и публичную студенческую версии с одинаковой нумерацией и условиями задач. Преподавательская версия MUST содержать полный пошаговый разбор каждой задачи; публичная версия SHALL раскрывать решения только выбранных типовых задач.

#### Scenario: Проверка паритета версий
- **WHEN** две версии одного семинара сравниваются автоматически или редакционно
- **THEN** количество, номера и условия задач совпадают, преподавательская версия решает каждую задачу, а публичная версия не раскрывает решения нетиповых задач

### Requirement: Семинар содержит 15-20 качественных задач
Каждый семинар SHALL содержать от 15 до 20 задач, распределённых по базовому, стандартному и повышенному уровням и включающих вычисление, выбор модели, проверку условий и интерпретацию результата. Повторы, отличающиеся только числами, MUST NOT учитываться как содержательно разные задачи. Единственное временное исключение — семинар 1: в текущем post-pull change он MUST сохранить семь задач неизменяемой преподавательской версии и SHALL быть расширен только после отдельного разрешения пользователя.

#### Scenario: Банк задач проходит приёмку
- **WHEN** семинар проверяется перед публикацией
- **THEN** в нём насчитывается 15-20 содержательно различных задач, типовые задачи явно выбраны для публичного разбора, а остальные не содержат утечек решения

### Requirement: Решения математически воспроизводимы
Каждое преподавательское решение SHALL явно фиксировать модель, предпосылки, формулу, подстановку, вычисление, ответ и интерпретацию. Численные результаты SHALL быть независимо перепроверены, а точные, приближённые, асимптотические и ограничивающие выводы SHALL различаться.

#### Scenario: Задача использует приближение
- **WHEN** решение применяет Пуассона, Лапласа, нормальное приближение или предельную теорему
- **THEN** преподавательская версия указывает условия применимости, характер погрешности и причину выбора метода

### Requirement: Прикладные задачи используют источники трансформативно
Задачи MAY опираться на все утверждённые книги и методические материалы, но SHALL быть переформулированы, проверены и адаптированы к целям курса. ML-примеры SHALL моделировать правдоподобные явления: классификационные ошибки, байесовское обновление, шум, редкие события, распределения данных, ожидание потерь или выборку.

#### Scenario: Задача создана на основе источника
- **WHEN** редактор включает задачу, вдохновлённую книгой или методичкой
- **THEN** задача не воспроизводит существенный фрагмент источника дословно, имеет проверенное решение и явно служит результату конкретного семинара
=======
# Probability Theory Seminar Materials Specification

## Purpose

Defines the complete source-grounded seminar sequence that turns the approved lecture progression into 17 coherent, practice-oriented meetings without introducing unapproved assessed content.

## Requirements

### Requirement: Seventeen seminars follow the approved RPD sequence
The course SHALL provide 17 student-facing seminar files, each representing two academic hours, in this order: (1) sum/product rules and permutations; (2) arrangements, combinations, and constrained counting; (3) classical probability; (4) geometric and statistical probability; (5) control work 1; (6) addition/multiplication theorems, conditional probability, and independence; (7) total probability and Bayes; (8) repeated independent trials; (9) control work 2; (10) discrete distribution rows and polygons; (11) expectation, variance, and standard deviation; (12) linear transformations, sums, binomial and Poisson laws; (13) discrete distribution functions and joint distributions; (14) continuous distribution functions and densities; (15) numerical characteristics, uniform and exponential laws; (16) normal distribution, standardization, interval probabilities, and the three-sigma rule; and (17) control work 3.

#### Scenario: Seminar inventory is inspected
- **WHEN** the seminar files and manifest entries are ordered by sort order
- **THEN** all 17 meetings are present once, retain the approved progression, and total 34 academic hours

### Requirement: Seminar prerequisites do not outrun the lecture sequence
Each seminar SHALL use only concepts introduced in a preceding or current approved lecture, except for a clearly labelled seminar-level extension that is explained self-containedly and does not become an unstated prerequisite for an assessed RPD task.

#### Scenario: Seminar dependency review is performed
- **WHEN** definitions, formulas, and solution methods in a seminar are compared with the lecture progression
- **THEN** every required method has already been introduced or is explicitly taught in that seminar without relying on later-course material

### Requirement: Seminars are complete teaching materials
Each non-control seminar SHALL state learning goals and prerequisites, provide a concise theory recap with applicability conditions, include worked examples, guided and independent practice, answers or solution guidance, typical errors, a lesson summary, and a clear link to the corresponding RPD individual assignment or case where applicable. Assessed RPD tasks SHALL remain distinguishable from non-assessed enrichment.

#### Scenario: Student prepares from a seminar independently
- **WHEN** the student opens a seminar without the teacher script or source books
- **THEN** the student can identify the required method, follow representative reasoning, practise it, and distinguish official assessment from optional training

### Requirement: Approved cases and practical preparation are covered
Seminars 7, 8, and 13 SHALL incorporate RPD cases 3, 1, and 2 respectively. Seminars 13 and 14 SHALL jointly provide the four required hours of practical preparation, including distribution construction and interpretation with the software usage required by the RPD.

#### Scenario: RPD activity coverage is audited
- **WHEN** the 17 seminars are mapped back to RPD tables 4–6
- **THEN** all three cases, all four practical-preparation hours, and the required interactive forms are explicitly accounted for without changing their normative role

### Requirement: Seminar examples follow course notation and language
Experiment outcomes and similar elementary labels SHALL use Russian forms such as `О`/`Р` when a Russian representation is natural. Numerical characteristics SHALL use `E[X]`, `Var(X)`, and `σ(X)` as the primary notation, with source alternatives explained only where needed.

#### Scenario: Cross-material notation scan is run
- **WHEN** seminar formulas and examples are compared with the adopted conventions
- **THEN** no unexplained English coin labels or competing primary expectation/variance notation remains

### Requirement: Seminars follow a stable student-facing template
Each teaching seminar SHALL contain, in a recognizable order: title and two-hour metadata; learning outcomes; prerequisite lecture links and required concepts; compact theory recap with applicability conditions; worked examples; guided practice; independent practice; answers, hints, or checking guidance; connection to the relevant IDZ, case, or control activity; typical errors; summary; and previous/next navigation where applicable. A control seminar SHALL use the same navigation and context sections but replace ordinary practice blocks with administration guidance, the official RPD bank link, permitted clarification notes, and post-control reflection boundaries.

#### Scenario: Seminar structure is audited
- **WHEN** all 17 seminar files are compared with the applicable teaching or control template
- **THEN** every required section is present or explicitly marked not applicable, and control seminars do not leak teacher-only solutions

### Requirement: Seminars link back to prerequisite lectures
Every seminar SHALL include relative local Markdown links to the complete student lecture or lectures that introduce its required theory. The reciprocal lecture-to-seminar mapping SHALL match the approved sequence and MUST NOT alter material availability.

#### Scenario: Bidirectional navigation is checked
- **WHEN** lecture and seminar Markdown links are traversed in both directions
- **THEN** all paths resolve locally, the relationship is reciprocal, and no link targets a teacher-only file
>>>>>>> 9b805d1 (ADD: lecturs and seminars refactoring)
