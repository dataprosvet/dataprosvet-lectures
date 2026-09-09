# Publisher: migration gate

Этот код ещё не является принятым external baseline. Локальные тесты не подтверждают ресурсы Appwrite, синхронизацию веток, production rollout или backfill. Создание PR, перенос baseline и включение требуют отдельных согласованных действий.

По умолчанию `deploy` пропускается, а CLI `publish` отказывает до создания Appwrite adapter. Единственный рабочий writer — push workflow `publish-course.yml` в `dataprosvet/dataprosvet-lectures`, с GitHub Environment `appwrite`, `contents: read`, course-level concurrency и `cancel-in-progress: false`. Старый reconciler перемещён в test fixture без real-adapter factory.

## Условия будущего включения

- Согласовать аудит count/размеров/готового ZIP, одинаковый effective source limit и ресурсы: source bucket fixed 10 485 760, ZIP bucket fixed 30 000 000. Предел source bucket код не изменяет. При меньшем effective limit fixed bucket ceiling сохраняется.
- Принять один reviewed `.github` tree baseline и синхронизировать **все** permanent `courses/*` branches с сохранением учебных файлов. Закрыть старые workflows/ручные writers и незавершённые старые runs, подтвердить единственного writer. Не запускать публикацию из work branch, fork, локального checkout или старого retry.
- В защищённом Environment `appwrite` задать reviewed новые public bundle table/bucket IDs вместе с прежними public IDs и секретом `APPWRITE_API_KEY`. Ключ требует row/file read/write и read-only table/column/index/bucket inspection; недостающие права не расширяются кодом, а приводят к отказу. Publisher не создаёт/меняет schema, bucket или project permissions.
- Отдельно согласовать и задать Environment variable `COURSE_PUBLICATION_READINESS`: JSON с `enabled: true`, `protocol: "attachments-v1"`, `singleWriterConfirmed: true`, `auditDigest` и `resourceDigest` (64 lowercase hex), `publisherTreeSha` (40 lowercase hex `.github` tree), `courseBranches` (полный список permanent branches). `resourceDigest` вычисляется `publicationResourceDigest(config)` только из public identities и согласованных лимитов; API key не входит. Значения не генерируются и не принимаются автоматически после локальных тестов.
- Только после этих gates включить repository variable `COURSE_PUBLICATION_ROLLOUT=attachments-v1`. Отсутствующее/несогласованное runtime значение и readiness по-прежнему закрывают публикацию. Не публиковать credentials или полный readiness payload в логи/artifacts.

## Порядок и отказ

Все локальные sources/ZIP проверяются до remote operations. Затем read-only resource/ownership inventory и fresh-source fence; private create-or-verify файлов; отзыв всех старых source/ZIP/Markdown/media URL затрагиваемого курса **до** скрытия metadata; private metadata новой версии; точный read-back; выдача read только эффективно доступным ресурсам; active material revision последней; course visibility последней для всего курса. Источники разных материалов не разделяют отзывные file permissions. Legacy shared ownership требует отдельного review, без глобального revoke/remediation.

GitHub branch head и Appwrite не образуют атомарную транзакцию. Авторитетная сериализация — GitHub Actions; process-local lock лишь дополнительный. Fresh-source fences стоят перед каждой mutation. Inventory всех course writers проверяется до записи; изменения writer policy во время run запрещаются организационно. Reader может временно получить недоступность, но не объявленный частичный новый набор.

Внутренние IDs Markdown, brief и изображений также scoped по `course/kind/slug`, роли и checksum: одинаковые bytes двух материалов/курсов не разделяют отзывные permissions. Меняются только opaque file references в новых metadata, не manifest, content bytes, asset keys или attachment revision. Старые shared IDs не мигрируют автоматически: обнаруженное неоднозначное legacy ownership останавливает публикацию до owner review.

При ошибке код не удаляет файлы/старые private rows и не включает обратно старые права. Повторный запуск — только для текущего approved commit; он проверяет/reuses stable IDs и восстанавливает завершённый набор. Старая revision не может перезаписать новую после продвижения branch. Если нужен контент прежней версии, подготовить новый reviewed course commit с прежними source bytes; ручная активация прежнего `attachmentsRevision` не разрешена. Read-only отказ (401/403), неизвестное состояние или network error — стоп, не доказательство безопасного результата.

## Локальная проверка

`npm ci && npm run lint && npm test` внутри `.github/publisher`. Тесты нового протокола используют только in-memory adapters/подставные SDK/GitHub ответы, не project credentials. Полный новый план без readiness должен дать `PUBLICATION_READINESS_REQUIRED` до adapter factory. Реальные Appwrite uploads, permission changes, backfill и branch sync этой проверкой не выполняются.
