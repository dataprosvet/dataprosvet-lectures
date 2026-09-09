# dataprosvet-lectures

`master` — шаблон; `courses/<slug>` — курс. Команды ниже выполняются из корня клона. Нужны Git LFS, Node.js версии из workflow, npm и GitHub CLI (`gh`).

> Новый протокол публикации выключен по умолчанию до review общего baseline, аудита, проверки ресурсов и отдельного разрешения rollout. Локальные тесты не разрешают deployment/backfill. [Условия включения и восстановления](.github/publisher/README.md).
> Публикация принимает только новый план из полной CLI-валидации; старый reconciler существует исключительно в fake regression tests.

## 1. Структура и изображения

| Путь | Назначение |
|---|---|
| `course.yaml`, `course.yaml.example` | Описание курса; шаблон для нового курса |
| `lectures/`, `seminars/`, `homeworks/` | Markdown лекций, семинаров, домашних заданий |
| `lecture-notes/` | Краткие конспекты лекций |
| `lectures-teacher/`, его `seminars/` и `homeworks/` | Материалы преподавателя; не публикуются |
| `assets/`, `attachments/` | Изображения; скачиваемые файлы |
| `.github/` | Схема YAML, проверки, деплой |
| `.gitattributes`, `.gitignore`, `.gitkeep` | Правила LFS; исключения Git; сохранение пустых папок |
| `sources/` | Локальные источники; не добавлять в Git |

Публикуется только объявленное в `course.yaml` и изображения из объявленного Markdown.
Откройте корень клона как vault Obsidian; каталог новых изображений — `assets`:

```md
![[assets/diagram.png]]
![Схема](../assets/diagram.png)
```

Изображения: PNG/JPEG/WebP, до 5 MiB, 4096×4096 и 16 млн пикселей. Внешние изображения и raw HTML запрещены.

## 2. Создание курса

Выполняет maintainer. Используйте lowercase kebab-case для slug.

```sh
git fetch origin
git switch -c courses/data-engineering origin/master
cp course.yaml.example course.yaml
# Заполните поля курса: slug — data-engineering; пока оставьте draft и пустые списки.
git add course.yaml
npm --prefix .github/publisher ci
(cd .github/publisher && COURSE_ROOT=../.. COURSE_BRANCH=courses/data-engineering npm run validate)
git commit -m "Create data engineering course"
git push -u origin courses/data-engineering
```

Добавляйте материалы через рабочую ветку по разделу 4.

## 3. course.yaml

[Полная схема](.github/schemas/course.schema.json). Обязательные поля показаны ниже.

- `slug` курса совпадает с суффиксом ветки; `slug` и `sortOrder` материалов уникальны среди всех трёх списков.
- `lifecycleStatus`: `draft`, `published`, `archived`; `availability`: `inDevelopment`, `available`, `temporarilyUnavailable`.
- `markdown` необязателен; имя — `<sortOrder из 3 цифр>_<slug>.md`. У лекции возможен `briefMarkdown: lecture-notes/001_intro.md`.
- В `attachments` обязательны `key`, `title`, `file`, `sortOrder`; key и порядок уникальны внутри материала. Один файл принадлежит одному материалу.
- Вложения: `.pptx`, `.pdf`, `.xlsx`, `.docx`, `.ipynb`, `.py`, `.zip`, `.7z`, `.tar.gz`, `.tar`, `.rar`; до 10 файлов на материал, каждый до **10 MiB = 10 485 760 байт** (настроенный лимит может быть меньше).
- Готовый общий ZIP без сжатия — до **30 000 000 байт**, включая headers/central directory. Превышение отклоняет весь план до загрузок и любых удалённых изменений, без обрезания, разбиения или частичной публикации. **10 × 10 MiB не помещаются**: автор сам пересматривает состав или размеры файлов.

Пример требует создания указанных Markdown и вложений:

```yaml
schemaVersion: 1
slug: data-engineering
title: Инженерия данных
description: Основы обработки данных
lifecycleStatus: published
availability: available
sortOrder: 1
materials:
  lectures:
    - slug: intro
      title: Введение
      summary: Основные понятия
      lifecycleStatus: published
      availability: available
      sortOrder: 1
      markdown: lectures/001_intro.md
      attachments:
        - { key: slides, title: Слайды, file: attachments/intro.pdf, sortOrder: 1 }
  seminars:
    - slug: practice
      title: Практика
      summary: Разбор примеров
      lifecycleStatus: published
      availability: available
      sortOrder: 2
      markdown: seminars/002_practice.md
      attachments:
        - { key: data, title: Данные, file: attachments/practice.zip, sortOrder: 1 }
  homeworks:
    - slug: homework
      title: Домашнее задание
      summary: Самостоятельная работа
      lifecycleStatus: published
      availability: available
      sortOrder: 3
      markdown: homeworks/003_homework.md
      attachments:
        - { key: starter, title: Заготовка, file: attachments/homework.py, sortOrder: 1 }
```

## 4. Разработка и публикация

Создайте рабочую ветку от курса:

```sh
git fetch origin
git switch -c course/data-engineering/update-materials origin/courses/data-engineering
```

Редактируйте материалы в Obsidian и обновляйте `course.yaml`. Добавьте изменённые файлы до проверки; ниже — пути из примера:

```sh
git add course.yaml lectures/001_intro.md seminars/002_practice.md homeworks/003_homework.md \
  attachments/intro.pdf attachments/practice.zip attachments/homework.py
npm --prefix .github/publisher ci
(cd .github/publisher && COURSE_ROOT=../.. COURSE_BRANCH=courses/data-engineering npm run validate)
git commit -m "Update course materials"
git push -u origin course/data-engineering/update-materials
gh pr create --base courses/data-engineering --title "Update course materials"
```

Дождитесь `validate`, выполните merge, проверьте `deploy` в GitHub Actions. PR только проверяет; merge публикует только после разрешённого rollout. Для доступа к файлам курс и материал должны иметь `published` и `available`.

Если ветка курса обновилась: `git fetch origin`, `git merge origin/courses/data-engineering`, повторная проверка и `git push`.

## 5. Обновление из master

Общие `.github/`, `README.md`, `course.yaml.example` изменяет maintainer в `master`. Подтяните обновление в каждый курс через PR:

```sh
git fetch origin
git switch -c course/data-engineering/sync-master origin/courses/data-engineering
git merge origin/master
git push -u origin course/data-engineering/sync-master
gh pr create --base courses/data-engineering --title "Sync master"
```

При конфликтах сохраните контент курса и актуальные общие файлы из `master`. Перед merge дождитесь `validate`, после merge проверьте `deploy`.
