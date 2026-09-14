# Иллюстрации лекции 2

Авторские схемы: `http11-anatomy`, `http11-observation`, `http2-frame`, `http2-streams` (SVG и PNG). Английские подписи; исходные рисунки семинара 2 сохранены. `build-http-diagrams.py` строит SVG; PNG отрисованы Sharp из bundled runtime. При вёрстке PNG можно заменить SVG и раскрывать компоненты последовательно.

## Источники

- HTTP/1.1: семинар 2; [RFC 9112 §2.1](https://www.rfc-editor.org/rfc/rfc9112.html#section-2.1), [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).
- HTTP/2: идея подачи — [Carson](https://cabulous.medium.com/http-2-and-how-it-works-9f645458e4b2), правила — [RFC 9113 §§4–5, 8](https://www.rfc-editor.org/rfc/rfc9113.html#section-4). Ссылки повторять непосредственно рядом с рисунками на слайдах и в конце.
- `cats-1xx.png` … `cats-5xx.png`: новые изображения, сгенерированные imagegen 14.09.2026 по предоставленному преподавателем скриншоту «Снимок экрана — 2026-09-14 в 20.57.22.png». На референсе указан vk.com/asinASTRA; это сведения на изображении, а не проверка авторства или лицензии. Референс использован для образа рыжих рисованных котиков; новые сцены и подписи подготовлены для лекции. 404 ищет отсутствующий клубок, без травм/крови. Семантика статусов — RFC 9110 §15, а не сюжеты исходных стикеров.

## Подписи к группам

- 1xx: 100 Continue — промежуточное разрешение продолжить передачу.
- 2xx: 200/201/202/204 — результат / создание / принято / без тела.
- 3xx: 301/304/307/308 — постоянный URI / не изменилось / временный и постоянный redirect с сохранением метода.
- 4xx: 400/401/403/404/405/422 — некорректный запрос / нет действительных credentials / отказ / не найдено / метод / ограничения содержимого.
- 5xx: 500/502/503/504 — сервер / неверный upstream-ответ / временная недоступность / ожидание upstream.

Подписи на картинках английские; короткие русские объяснения размещаются отдельным текстом слайда. Котики — мнемоника, точное правило задаёт пояснение.


### Правки презентации r2

- `cat-live-demo.png` — built-in ImageGen; reference `cats-5xx.png`. Prompt: Use the attached HTTP status cats as STRICT character and drawing style reference. Generate ONE new sticker of exactly this same ochre/tan cat character, same wide angular furry cheeks, triangular ears, small black nose, simple eyes, thin uneven black handdrawn outlines, flat muted ochre fills, same proportions as the 500 cat. The cat is now happy and enthusiastically typing with both paws on a computer keyboard in front of a small desktop monitor. Joyful little smile and motion marks by paws. No realistic fur, no orange stripes, no white muzzle, no glossy gradients, no Disney/kawaii redesign. Must look like another sticker from this exact set. Single cat, single computer, centered fully visible on pure white background. No text, no numbers, no captions, no watermark. Landscape 3:2.
- `http11-observation-highlighted.svg/png` и `http11-forecast-highlighted.svg/png` — адаптация существующего SVG для подсветки и парного GET; исходники не заменены. Источники семантики: RFC 9110/9112, семинар 2. Подсветка использует палитру VS Code Light+.

### Сверка r3

`http11-request.png` и `http11-response.png` — существующие изображения отдельных запроса и ответа из согласованной презентации, скопированы без изменений из сборки образцов. Используются в послайдовом сценарии; семантика — RFC 9110/9112, исходный учебный пример семинара 2.

### XML как изображение

`xml-observations.png` — точная отрисовка примера из студенческой лекции; белый фон, Courier New, цвета XML в духе VS Code Light+. Текст сохранён в `xml-observations.xml`. Markdown использует PNG, поскольку валидатор публикации считает XML-теги внутри блока кода HTML. Примеры методички и их XML-исходники находятся отдельно в `lectures-teacher/handbooks/assets/` и не публикуются.
