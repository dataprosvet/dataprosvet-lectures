# dataprosvet-lectures

Приватный исходник курсов для DataProsvet. В `master` нет учебного контента: только этот документ, `course.yaml.example`, пустые каталоги и publisher CI. Один курс живёт в одной ветке `courses/<course-slug>`.

## Изменение существующего курса через PR

Всегда создавайте рабочую ветку от актуальной ветки нужного курса. Не создавайте её от `master` и не коммитьте напрямую в `courses/<course-slug>`.

Пример для курса теории вероятностей:

```sh
git fetch origin
git switch courses/probability-theory
git pull --ff-only origin courses/probability-theory
git switch -c course/probability-theory/lecture-5-fixes
git branch --show-current
```

Имя рабочей ветки имеет формат `course/<course-slug>/<work-slug>`. Slug курса обязан совпадать с целевой веткой `courses/<course-slug>`, а `work-slug` кратко описывает изменение. Оба slug используют lowercase kebab-case.

Редактируйте файлы и создавайте логические коммиты только в рабочей ветке. Добавляйте явные пути, чтобы не захватить чужие или локальные изменения:

```sh
git add lectures/005_discrete-random-variables.md course.yaml
git commit -m "Refine probability lecture five"
git push -u origin course/probability-theory/lecture-5-fixes
```

Откройте PR обратно в ту ветку курса, от которой создана рабочая ветка:

```sh
gh pr create \
  --base courses/probability-theory \
  --head course/probability-theory/lecture-5-fixes \
  --title "Refine probability lecture five"
```

CI отклонит произвольное имя рабочей ветки, PR в другой курс или ветку без истории целевого курса. Pull request выполняет validation без Appwrite credentials и ничего не публикует. Публикация возможна только после merge и успешного push workflow постоянной ветки курса.

Если целевая ветка продвинулась во время review, включите её новые commits в рабочую ветку, повторите validation и push. Base PR остаётся прежним:

```sh
git fetch origin
git switch course/probability-theory/lecture-5-fixes
git merge --no-edit origin/courses/probability-theory
cd .github/publisher
npm ci
COURSE_ROOT=../.. COURSE_BRANCH=courses/probability-theory npm run validate
cd ../..
git push
```

Для общей рабочей ветки предпочитайте merge целевого курса: он не переписывает опубликованную историю. Rebase допустим до совместной работы, но потребует безопасно обновить remote branch. Никогда не меняйте base PR на `master` или другой курс.

## Создание курса

```sh
git switch master
git pull --ff-only origin master
git switch -c courses/data-engineering
cp course.yaml.example course.yaml
# заполните course.yaml, lectures/, seminars/, homeworks/ и assets/
cd .github/publisher && npm ci
COURSE_BRANCH=courses/data-engineering npm run validate
```

Slug ветки и `course.yaml:slug` обязаны совпадать и иметь lowercase kebab-case. В ветке должен быть ровно один `course.yaml`; `course.yaml.example` publisher не публикует.

## Контракт каталогов

Публикационными входами являются `course.yaml`, объявленные Markdown-файлы в `lectures/`, `seminars/` и `homeworks/`, а также объявленные изображения из `assets/`.

Репозиторий также разрешает tracked support-файлы, которые никогда не попадают в publication plan:

- `.gitattributes` — правила Git LFS;
- `lectures-teacher/` — полные сценарии преподавателя;
- `attachments/` — дополнительные скачиваемые материалы и их dormant-заготовки;
- `openspec/` — спецификация конкретного курса.

Само наличие файла в каталоге публикации ничего не публикует. `course.yaml` — единственный allowlist: только явно объявленные Markdown, используемые ими изображения и элементы `attachments` проходят публикационную валидацию, попадают в plan и могут быть загружены в Appwrite. Остальные tracked-файлы под `lectures/`, `lecture-notes/`, `seminars/`, `homeworks/`, `assets/` и `attachments/` считаются dormant-заготовками. CI выводит их repository-relative пути как информационные diagnostics, но не читает их как публичный контент, не включает в digest и не загружает.

Dormant Markdown всё равно проверяется на запрещённые credential patterns: отсутствие декларации не является исключением из secret scanning. При добавлении пути в manifest файл становится публикационным input и обязан пройти все строгие проверки. Отсутствующий, untracked, небезопасный или некорректный объявленный файл всегда завершает validation ошибкой до Appwrite mutation.

`sources/` предназначен для локального корпуса источников, должен оставаться в `.gitignore` курса и не может быть tracked. Любой другой неизвестный корневой путь отклоняется валидатором.

Файлы, управляемые Git LFS, загружаются в validation и deployment jobs до чтения publisher. Если вместо содержимого остался LFS pointer, validation завершается ошибкой до любых изменений в Appwrite.

Изменения этого общего контракта сначала вносятся в защищённый `master`. Курсовая ветка не должна самостоятельно менять унаследованные `.github/**`, `README.md` или `course.yaml.example`.

## Manifest и контент

`schemaVersion` всегда `1`. У курса обязательны `slug`, `title` (до 160 символов), `description` (до 4000), `lifecycleStatus`, `availability`, `sortOrder` и три списка `materials.lectures`, `materials.seminars`, `materials.homeworks`.

Элемент списка задаёт `slug`, `title`, `summary`, `lifecycleStatus`, `availability`, `sortOrder` и необязательный `markdown`. Раздел определяет тип: `lectures` → `lecture`, `seminars` → `seminar`, `homeworks` → `homework`. Markdown обязан называться `<трёхзначный sortOrder>_<slug>.md`: например, для `sortOrder: 1` и `slug: introduction` — `lectures/001_introduction.md`.

Допустимые состояния: lifecycle `draft`, `published`, `archived`; availability `inDevelopment`, `available`, `temporarilyUnavailable`. Даже `published` + `available` material может содержать только metadata: отсутствие `markdown` и `briefMarkdown` оставляет соответствующие переходы в клиенте disabled. Markdown хранится только в каталоге своего типа. Объявленные изображения — только tracked-файлы в `assets/`: PNG, JPEG или WebP, до 5 MiB, до 4096×4096 и 16 млн пикселей. Объявленный Markdown — до 256 KiB, UTF-8, без raw HTML, удалённых изображений и Appwrite URL.

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

PR и push в точные ветки `courses/*` сначала запускают validation без Appwrite credentials. PR обязан приходить из `course/<тот-же-course-slug>/<work-slug>`. Только успешный push постоянной ветки курса получает Environment `appwrite` и публикует заново вычисленный plan. Publisher сначала скрывает текущий курс, загружает файлы приватно, затем открывает файлы, metadata материалов и metadata курса — именно в таком порядке. Повтор того же коммита безопасен; удалённый из manifest материал архивируется, а его файлы становятся приватными.

Чтобы временно снять с публикации отдельный документ или attachment, удалите только соответствующую декларацию из `course.yaml`, оставив сам файл tracked. Следующая публикация обнулит `contentFileId`/`briefContentFileId` либо удалит active attachment mapping и предварительно отзовёт anonymous read у прежнего Storage object. Metadata материала останется доступной. Чтобы вернуть ресурс, снова добавьте его декларацию: перед публикацией он заново пройдёт полный набор проверок.

Откат — reviewed `git revert` (или восстановление известного good commit) в course branch. Обычное восстановление не редактирует Appwrite Console. При аварии отключите Environment deployment policy или workflow, исправьте Git-источник и повторите publish. Перед удалением ветки сначала переведите курс в `archived` и дождитесь успешного deployment; удаление ветки само Appwrite не меняет.

## GitHub rules и Environment

Защитите `master`: обычным maintainers запретить push, PR merge, force-push и deletion; только узкому owner/bypass разрешён maintenance baseline. Создание `courses/*` — только trusted maintainers; для них потребуйте PR и check `validate`, запретите force-push и удаление до архивирования. Курсовые ветки начинаются от актуального `master` и не должны самостоятельно менять унаследованные `.github/**`, `README.md` и `course.yaml.example`.

После принятия нового общего baseline в `master` синхронизируйте его в курс тем же PR-процессом. Например:

```sh
git fetch origin
git switch courses/probability-theory
git pull --ff-only origin courses/probability-theory
git switch -c course/probability-theory/sync-contribution-ci
git merge --no-edit origin/master
git push -u origin course/probability-theory/sync-contribution-ci
gh pr create --base courses/probability-theory --head course/probability-theory/sync-contribution-ci --title "Inherit contribution CI baseline"
```

Перед merge убедитесь, что diff наследует только принятые общие файлы и не меняет `course.yaml` или материалы курса. Ruleset с обязательным check включается после того, как `courses/probability-theory` унаследовала новый workflow и успешно прошла его PR и push проверки.

Существующий PR из ветки с произвольным именем переносится без policy-исключения. Для PR #10 maintainer или автор может создать `course/probability-theory/ivanshmidt-lectures-1-4` на том же commit, push новой ветки и открыть replacement PR в `courses/probability-theory`; исходный PR не закрывайте до проверки замены.

Создайте Environment `appwrite`, ограничьте deployment branches шаблоном `courses/*`. Он используется текущим production-equivalent publisher; для будущего test-контура будет отдельный Environment. Его единственный secret — `APPWRITE_API_KEY` c конечной датой истечения и ровно scopes `rows.read`, `rows.write`, `files.read`, `files.write`. У существующего ключа удалите остальные scopes либо замените его, отзовите предыдущий и фиксируйте владельца/дату ротации. Не добавляйте ключ в repository secrets.

В Environment variables (не secrets) добавьте `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`, `APPWRITE_COURSES_TABLE_ID`, `APPWRITE_MATERIALS_TABLE_ID`, `APPWRITE_ASSETS_TABLE_ID`, `APPWRITE_MARKDOWN_BUCKET_ID`, `APPWRITE_MEDIA_BUCKET_ID`. Перед включением deploy owner вручную проверяет существующие TablesDB schema/indexes/row security и buckets/file security; CI не получает scopes для их изменения.
# Course content variants and attachments

Lectures may independently declare a full student document with `markdown`
under `lectures/` and concise notes with `briefMarkdown` under
`lecture-notes/`. A lecture with neither document is valid metadata. Files in
`lectures-teacher/` are support-only and are never used as a public fallback.
Tracked files that are not declared remain dormant in their established
directories. Dormant paths are reported without failing validation or entering
the publication plan. All tracked Markdown remains subject to secret scanning;
full content validation starts when a manifest field declares the file.

Any lecture, seminar, or homework may declare an ordered `attachments` list.
Each item contains a stable `key`, Russian-facing `title`, tracked `file` under
`attachments/`, and unique `sortOrder`. Supported extensions are `.pptx`,
`.pdf`, `.xlsx`, `.docx`, `.ipynb`, and `.py`; `.doc` and `.xls` are rejected.
Files are downloaded as inert bytes and are never executed by the publisher.
The default maximum is 15 MiB and can be changed with the reviewed
`COURSE_ATTACHMENT_MAX_BYTES` workflow variable.
