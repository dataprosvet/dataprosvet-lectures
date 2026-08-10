# dataprosvet-lectures

Приватный исходник курсов для DataProsvet. В `master` нет учебного контента: только этот документ, `course.yaml.example`, пустые каталоги и publisher CI. Один курс живёт в одной ветке `courses/<course-slug>`.

## Создание курса

```sh
git switch master
git pull --ff-only origin master
git switch -c courses/data-engineering
cp course.yaml.example course.yaml
# заполните course.yaml, lectures/, seminars/, homeworks/ и assets/
cd .github/publisher && npm ci
GITHUB_REF_NAME=courses/data-engineering npm run validate
```

Slug ветки и `course.yaml:slug` обязаны совпадать и иметь lowercase kebab-case. В ветке должен быть ровно один `course.yaml`; `course.yaml.example` publisher не публикует.

## Manifest и контент

`schemaVersion` всегда `1`. У курса обязательны `slug`, `title` (до 160 символов), `description` (до 4000), `lifecycleStatus`, `availability`, `sortOrder` и три списка `materials.lectures`, `materials.seminars`, `materials.homeworks`.

Элемент списка задаёт `slug`, `title`, `summary`, `lifecycleStatus`, `availability`, `sortOrder` и необязательный `markdown`. Раздел определяет тип: `lectures` → `lecture`, `seminars` → `seminar`, `homeworks` → `homework`. Markdown обязан называться `<трёхзначный sortOrder>_<slug>.md`: например, для `sortOrder: 1` и `slug: introduction` — `lectures/001_introduction.md`.

Допустимые состояния: lifecycle `draft`, `published`, `archived`; availability `inDevelopment`, `available`, `temporarilyUnavailable`. `published` + `available` материал обязан иметь Markdown. Markdown хранится только в каталоге своего типа. Изображения — только tracked-файлы в `assets/`: PNG, JPEG или WebP, до 5 MiB, до 4096×4096 и 16 млн пикселей. Markdown — до 256 KiB, UTF-8, без raw HTML, удалённых изображений и Appwrite URL. Необъявленные Markdown и неиспользуемые файлы в `assets/` — ошибки.

Обычный material не содержит ручного списка assets:

```yaml
materials:
  lectures:
    - slug: introduction
      title: Введение
      summary: Цели и план курса
      lifecycleStatus: published
      availability: available
      sortOrder: 1
      markdown: lectures/001_introduction.md
```

## Изображения из Obsidian

Для vault задайте каталог новых вложений `assets`. CI понимает стандартные Obsidian embeds:

```md
![[assets/introduction/pipeline.png]]
![[pipeline.png]]
![[assets/introduction/pipeline.png|Схема конвейера]]
```

Если в Obsidian отключены wikilinks, поддерживается относительный Markdown-вариант:

```md
![Схема конвейера](../assets/introduction/pipeline.png)
```

Путь `assets/...` в Obsidian считается путём от корня vault. Короткое имя вроде `![[pipeline.png]]` допустимо, только если во всём `assets/` есть ровно один файл с таким basename. При неоднозначности укажите полный `assets/...` путь. В Markdown-ссылках пробелы кодируются как `%20` либо путь помещается в угловые скобки. Имена файлов могут содержать пробелы и Unicode; абсолютные пути, выход из `assets/`, query/fragment, remote URL, symlink и неподдерживаемый тип отклоняются.

CI не изменяет Markdown или `course.yaml` в Git. Валидатор находит ссылки, генерирует material-scoped key вида `asset-<hash-пути>`, получает alt из подписи или имени файла, проверяет изображение и строит копию Markdown для Appwrite с `![Описание](attachment:<key>)`. Checksum и Storage ID вычисляются от этой преобразованной копии. Остальной Markdown сохраняется побайтно, а тело документа не выводится в CI logs и artifacts.

Старый ручной формат остаётся совместимым:

```yaml
assets:
  - key: pipeline
    file: assets/introduction/pipeline.png
    alt: Схема конвейера
```

Он требует ссылку `![Схема конвейера](attachment:pipeline)` и строгого соответствия объявлений использованию. Голая строка `attachment:pipeline`, неизвестный key, неоднозначный basename, orphan asset и несовпадение расширения с сигнатурой приводят к ошибке validation с repository-relative путём.

## Публикация и восстановление

PR и push в `courses/**` сначала запускают validation без Appwrite credentials. Только успешный push получает Environment `appwrite` и публикует заново вычисленный plan. Publisher сначала скрывает текущий курс, загружает файлы приватно, затем открывает файлы, metadata материалов и metadata курса — именно в таком порядке. Повтор того же коммита безопасен; удалённый из manifest материал архивируется, а его файлы становятся приватными.

Откат — reviewed `git revert` (или восстановление известного good commit) в course branch. Обычное восстановление не редактирует Appwrite Console. При аварии отключите Environment deployment policy или workflow, исправьте Git-источник и повторите publish. Перед удалением ветки сначала переведите курс в `archived` и дождитесь успешного deployment; удаление ветки само Appwrite не меняет.

## GitHub rules и Environment

Защитите `master`: обычным maintainers запретить push, PR merge, force-push и deletion; только узкому owner/bypass разрешён maintenance baseline. Создание `courses/**` — только trusted maintainers; для них потребуйте PR и checks, запретите force-push и удаление до архивирования. Курсовые ветки начинаются от актуального `master` и не должны менять наследованные `.github/**`, `README.md` и `course.yaml.example`.

Создайте Environment `appwrite`, ограничьте deployment branches шаблоном `courses/*`. Он используется текущим production-equivalent publisher; для будущего test-контура будет отдельный Environment. Его единственный secret — `APPWRITE_API_KEY` c конечной датой истечения и ровно scopes `rows.read`, `rows.write`, `files.read`, `files.write`. У существующего ключа удалите остальные scopes либо замените его, отзовите предыдущий и фиксируйте владельца/дату ротации. Не добавляйте ключ в repository secrets.

В Environment variables (не secrets) добавьте `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`, `APPWRITE_COURSES_TABLE_ID`, `APPWRITE_MATERIALS_TABLE_ID`, `APPWRITE_ASSETS_TABLE_ID`, `APPWRITE_MARKDOWN_BUCKET_ID`, `APPWRITE_MEDIA_BUCKET_ID`. Перед включением deploy owner вручную проверяет существующие TablesDB schema/indexes/row security и buckets/file security; CI не получает scopes для их изменения.
