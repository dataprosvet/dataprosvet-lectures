# Практика №1: ETL, SQL и Python

Практическая работа курса Big Data (2 курс): от исходного CSV к аналитическому отчёту.

Данные к занятию — вложение `attachments/102_etl-sql-python-data.zip`:

- `sales.csv` — исходные продажи
- `inserts.txt` — `CREATE TABLE sales` и `INSERT` для загрузки в БД

## Что такое ETL

ETL — процесс, а не конкретная программа:

1. **Extract** — извлечь данные
2. **Transform** — очистить и преобразовать
3. **Load** — загрузить результат

Сегодняшняя цепочка: CSV → Python/SQL → отчёт.

## Extract

Источники: CSV, Excel, API, БД, логи. Задача этапа — получить исходные данные и понять их структуру.

Пример:

```python
import pandas as pd
df = pd.read_csv("sales.csv")
```

## Transform

Типичные операции:

- удаление дубликатов
- обработка пропусков
- исправление типов
- фильтрация ошибочных записей
- расчёт новых полей

## Load

Результат можно загрузить в PostgreSQL / MySQL, аналитическое хранилище, CSV / Parquet или BI-систему.

## SQL: выборка и фильтрация

SQL — язык работы с реляционными БД: получать данные, фильтровать, сортировать, группировать, объединять таблицы, изменять структуру и данные.

```sql
SELECT * FROM sales;
SELECT customer_name, city
FROM sales;
```

`*` означает «все столбцы».

Фильтрация строк — `WHERE`. `AND` / `OR` объединяют условия:

```sql
SELECT *
FROM sales
WHERE price > 100;
```

## ORDER BY, LIMIT и агрегаты

`ORDER BY price DESC` — сортировка по убыванию. `LIMIT 10` — оставить 10 строк (например, топ-10 самых дорогих товаров).

Агрегатные функции: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.

```sql
SELECT SUM(quantity * price)
FROM sales;
```

## GROUP BY, HAVING и JOIN

Группировка даёт показатели по каждой категории:

```sql
SELECT category,
       SUM(quantity * price) AS revenue
FROM sales
GROUP BY category;
```

- `WHERE` фильтрует строки **до** группировки
- `HAVING` фильтрует группы **после** `GROUP BY`

```sql
HAVING SUM(quantity * price) > 1000
```

`JOIN` объединяет таблицы. Связь обычно строится по ключу:

```sql
SELECT c.name, o.amount
FROM customers c
JOIN orders o
  ON c.id = o.customer_id;
```

## SQL-практика

1. Создайте таблицу `sales` (скрипт в `inserts.txt`).
2. Загрузите CSV.
3. Выполните `SELECT` / `WHERE` / `ORDER BY`.
4. Посчитайте выручку.
5. Сделайте `GROUP BY`.
6. Найдите проблемы качества (в данных есть пропуски `city`, `quantity = 0`, отрицательный `price`, дубли `order_id`).

## Python и pandas

```python
import pandas as pd
df = pd.read_csv("sales.csv")
df.info()
df.isnull().sum()
df.duplicated().sum()
```

Transform:

```python
df = df.drop_duplicates()
df = df.dropna(subset=["city"])
df = df[df["quantity"] > 0]
df = df[df["price"] > 0]
df["total"] = df["quantity"] * df["price"]
```

SQL и pandas — похожие идеи:

| SQL | pandas |
|---|---|
| SELECT | выбор столбцов |
| WHERE | фильтрация |
| GROUP BY | `groupby()` |
| ORDER BY | `sort_values()` |
| SUM | `sum()` |
| AVG | `mean()` |
| JOIN | `merge()` |

## Финальный мини-ETL

```
sales.csv
  → Extract (pandas)
  → Transform (очистка + total)
  → агрегация по category
  → Load: sales_report.csv
```

Самостоятельная работа:

1. Топ-5 товаров по выручке
2. Город с максимальной выручкой
3. Средний чек
4. Категория с максимальной выручкой
5. Сохранить `final_report.csv`

## Что сдаём

- `practice_01.sql`
- `practice_01.ipynb`
- `sales_report.csv`
- краткий отчёт

Главный результат: пройти простой ETL-процесс от исходных данных до отчёта.
