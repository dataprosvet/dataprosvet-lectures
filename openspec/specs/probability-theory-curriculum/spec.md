# Probability Theory Curriculum Specification

## Purpose

Defines the authoritative educational scope, learning outcomes, and eight-lecture progression of the probability-theory course for applied-informatics students.

## Requirements

### Requirement: Course identity and workload follow the approved program
The course SHALL serve second-year, third-semester bachelor students in 09.03.03 Applied Informatics, profile "Software Solutions for Business", and SHALL preserve the approved workload of 3 credit units and 108 hours: 16 lecture hours across 8 meetings, 34 seminar hours across 17 meetings, 57.65 hours of independent work, and graded-pass assessment.

#### Scenario: Course metadata or plan is revised
- **WHEN** a maintainer changes the course description, schedule, or material plan
- **THEN** the result remains consistent with the approved audience, workload, and assessment form or explicitly records a newer normative program

### Requirement: Course develops a coherent probability-modeling progression
The course SHALL enable students to model random experiments and events, calculate probabilities, apply conditional and total probability, analyze repeated trials, describe discrete and continuous random variables, calculate numerical characteristics, use standard distributions, and interpret laws of large numbers and the central limit theorem in applied contexts.

#### Scenario: Student completes the course
- **WHEN** the complete lecture and seminar sequence has been studied
- **THEN** the student can select, calculate, and interpret an appropriate elementary probability model for problems in business, information systems, reliability, and machine learning

### Requirement: Восемь лекций сохраняют утверждённую последовательность тем
Последовательность лекций SHALL соответствовать новейшему предоставленному тематическому плану: (1) события, операции над событиями, комбинаторика, определения и свойства вероятности; (2) условная вероятность, независимость, теоремы сложения и умножения, полные системы событий, полная вероятность и формула Байеса; (3) повторные независимые испытания, формула Бернулли, локальная и интегральная теоремы Лапласа и формула Пуассона; (4) дискретные и непрерывные случайные величины, ряды распределения, функции распределения и плотности; (5) математическое ожидание, мода, медиана, дисперсия, стандартное отклонение, коэффициент вариации, моменты, асимметрия и эксцесс; (6) именованные дискретные и непрерывные законы распределения; (7) неравенства Маркова, Чебышёва и Бернулли, законы больших чисел и центральная предельная теорема; (8) факультативные элементы двумерной случайной величины при наличии времени. Лекция 8 MUST NOT иметь отдельного семинара, а её время SHALL использоваться для завершения лекций 1-7, когда это необходимо.

#### Scenario: Проверяется публичный набор лекций
- **WHEN** восемь лекционных материалов упорядочены по полю сортировки манифеста
- **THEN** их названия и содержательные границы соответствуют новой последовательности без пропущенных или продублированных обязательных тематических блоков, а лекция 8 отмечена как факультативная

### Requirement: Семинары и формальные домашние работы согласованы с последовательностью лекций
Курс SHALL поддерживать 17 упорядоченных возможностей семинаров и семь возможностей формальных домашних работ. Каждый семинар и каждая домашняя работа SHALL указывать необходимые лекционные темы, при этом ни один семинар MUST NOT зависеть от факультативной лекции 8.

#### Scenario: Проверяется карта учебного курса
- **WHEN** проводится проверка полной карты учебного курса
- **THEN** лекции 1-7 имеют согласованное практическое и оценочное покрытие, присутствуют все 17 семинаров и семь возможностей ИДЗ, а лекция 8 не имеет зависимого от неё семинара
### Requirement: Required learning outcomes remain covered
Course materials SHALL cover event operations and combinatorics; classical, geometric, and statistical probability; addition and multiplication theorems; conditional probability; total probability and Bayes; Bernoulli, Poisson, local Laplace, and integral Laplace methods; discrete and continuous distributions; expectation, variance, and standard deviation; binomial, Poisson, uniform, exponential, and normal laws; joint distributions, covariance, and correlation; Chebyshev and Bernoulli laws of large numbers; the central limit theorem; and an introductory interpretation of statistical hypotheses and p-values.

#### Scenario: Lecture notes are shortened
- **WHEN** teacher scripts are converted into concise student notes
- **THEN** shortening removes delivery scaffolding but does not remove a required definition, formula family, applicability condition, or conclusion needed for these learning outcomes
