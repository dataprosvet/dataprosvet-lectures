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

## Повторная приёмка после ревью 2026-09-15

- В `seminars/101_...`–`104_...` повторно сформированы студенческие версии из восстановленного полного содержимого: оставлены условия 17, 17, 15 и 18 задач соответственно; ход решения, подсказки, ответы, ключи, тайминг и преподавательские инструкции удалены.
- В полной лекции и кратком конспекте `\\operatorname{Precision}` и `\\operatorname{Recall}` заменены на переносимые `\\mathrm{Precision}` и `\\mathrm{Recall}`. Показанный на скриншоте незавершённый фрагмент `\\dfrac{m}{n}=\\dfrac{` в текущих публикационных файлах отсутствует.
- Все формулы полной лекции, краткого конспекта и четырёх семинаров успешно разобраны тем же `TexParser` из `flutter_math_fork`, который использует рендерер сайта: `flutter test test/tmp_probability_course_tex_test.dart` — `All tests passed`.
- Все ссылки между шестью публикационными материалами используют абсолютные внутренние маршруты `/courses/probability-theory/...`; GitHub URL и относительные `.md`-ссылки отсутствуют.
- Текущие неизменяемые контрольные копии семинаров находятся в `lectures-teacher/seminars/101_...`–`104_...`; они не редактировались в ходе повторной приёмки. Их SHA-256: `6f5be0048acf828fd30183db2890a166d2d6f411a6939746fac6c3e42a2b0abf`, `6f5be0048acf828fd30183db2890a166d2d6f411a6939746fac6c3e42a2b0abf`, `d908b997332a89536ae512339b48a4d3cb8b9fc82acd477f68030aae0df112d9`, `d17d790b930b9858760468d1ceab942a4e16d0cec67a2442b2dca16e1f09249b`.
- Ранее зафиксированные в этом документе пути преподавательских файлов `001_...`–`004_...` в текущем рабочем дереве отсутствуют; это состояние существовало до повторной приёмки и не исправлялось за счёт изменения исходников.
- `openspec validate publish-probability-lecture-2-and-seminars-1-4 --type change --strict --no-interactive` завершён успешно; `openspec validate --all --strict --no-interactive` — 45 passed, 0 failed.
- `course.yaml`, преподавательские материалы, Git, GitHub, deployment и production в ходе повторной приёмки не изменялись и не вызывались.
