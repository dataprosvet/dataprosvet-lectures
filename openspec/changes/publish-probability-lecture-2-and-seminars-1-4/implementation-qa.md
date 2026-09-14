# Приёмка реализации

## Исправленная граница

- Преподавательские материалы не редактировались.
- Для семинаров использованы только четыре файла, явно указанные владельцем курса:
  - `lectures-teacher/seminars/001_combinatorics-and-probabilit 1.md`;
  - `lectures-teacher/seminars/002_combinations-and-permutations-with-repetitions 1.md`;
  - `lectures-teacher/seminars/003_theorems-conditional-probability.md`;
  - `lectures-teacher/seminars/004_total-probability-bayes.md`.
- Существующая запись `comb-and-prob-17-25-2`, её Markdown и оба вложения сохранены в `course.yaml` без изменений.
- Новая запись семинара 2 добавлена отдельно с явно заданным `sortOrder: 102`.

## Контрольные суммы выбранных источников

| Путь | SHA-256 |
|---|---|
| `lectures-teacher/seminars/001_combinatorics-and-probabilit 1.md` | `60e1c3b38da14a26303e3677107f1a7c1c64dfe3aad2e86f8afbbc7ae8258b8c` |
| `lectures-teacher/seminars/002_combinations-and-permutations-with-repetitions 1.md` | `60e1c3b38da14a26303e3677107f1a7c1c64dfe3aad2e86f8afbbc7ae8258b8c` |
| `lectures-teacher/seminars/003_theorems-conditional-probability.md` | `a31d754d601f89f9c999c1f16e262afeebef9ad2d86f18e1e9acd9dbe10e97b7` |
| `lectures-teacher/seminars/004_total-probability-bayes.md` | `d17d790b930b9858760468d1ceab942a4e16d0cec67a2442b2dca16e1f09249b` |

Первые два выбранных файла побайтово одинаковы. Поэтому студенческие семинары 1 и 2 закономерно содержат один и тот же тематический банк вероятностных задач, но имеют самостоятельные номера, slug и публикационные файлы. Другой тематически подходящий файл не использовался.

## Матрица новых и точечно изменённых записей

| Материал | `sortOrder` | `lifecycleStatus` | `availability` |
|---|---:|---|---|
| Лекция 2 | 2 | `published` | `temporarilyUnavailable` |
| Семинар 1 | 101 | `published` | `available` |
| Новый семинар 2 | 102 | `published` | `available` |
| Семинар 3 | 103 | `published` | `temporarilyUnavailable` |
| Семинар 4 | 104 | `published` | `temporarilyUnavailable` |

Повтор `sortOrder: 102` является прямым требованием владельца курса: существующая запись другой группы не перезаписывается. Если штатный publisher запрещает повтор порядка, это потребует отдельного решения владельца, а не автоматической замены существующего материала.

## Границы выполнения

Git-команды, GitHub-операции, commit, staging, создание ветки, deployment и действия в production не выполнялись.
