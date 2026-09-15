import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {resolvePresentationFont,finalizePresentation} from '/Users/ripper/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='/tmp/lecture02-r2',asset='/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies/assets/lecture-002/';
const content=JSON.parse(await fs.readFile(root+'/build/content.json','utf8'));const foot=await fs.readFile(root+'/build/footnotes.txt','utf8');
const font=resolvePresentationFont({fontFamily:'Arial'}),mono=resolvePresentationFont({fontFamily:'Courier New'});
const p=Presentation.create({slideSize:{width:1280,height:720}}),map=[];
const C={ink:'#22343C',muted:'#637379',accent:'#416F99',pale:'#EAF1F7',line:'#DDE2E5'};
function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false,typeface=font){let q=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});q.text=t;q.text.style={typeface,fontSize:size,color,bold,autoFit:'none'};return q;}
function box(s,x,y,w,h,fill=C.pale){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function link(s,label,url,x=76,y=642,w=1120){let q=text(s,label,x,y,w,28,17,C.muted);q.text.get(label).link={uri:url,isExternal:true};}
function notes(n,extra){const raw=content[n-1]?.notes??'';const section=raw.split('### Ход показа, вопрос и границы')[1]?.split('\n---')[0]?.trim()??'Кратко назвать тему и перейти к следующему слайду.';return 'Ход показа и границы\n'+section.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\[\^[^\]]+\]/g,'').replace(/[*`]/g,'').replace(/\b\d+–\d+(?: минуты| минут)?\s*:/g,'');}
function highlight(q,str,lang='json'){
 const apply=(re,color)=>{for(const m of str.matchAll(re))q.text.getRange(m.index,m[0].length).fill=color;};
 if(lang==='xml'){apply(/<\/?[\w:-]+|\/?>/g,'#800000');apply(/[\w:-]+(?==)/g,'#E50000');apply(/"[^"]*"/g,'#0000FF');}
 else if(lang==='yaml'){apply(/[^\s:]+(?=:\s|:$)/gm,'#0451A5');apply(/(?<=: )[^^\n]+/g,'#0000FF');apply(/'[^']*'|"[^"]*"/g,'#A31515');apply(/(?<!["\w])(?:true|false|null)(?!["\w])/g,'#0000FF');apply(/(?<![\w./:])-?\b\d+(?:\.\d+)?\b(?![\w./:])/g,'#098658');}
 else {apply(/"(?:\\.|[^"\\])*"/g,'#A31515');apply(/"(?:\\.|[^"\\])*"(?=\s*:)/g,'#0451A5');apply(/(?<!["\w])(?:true|false|null)(?!["\w])/g,'#0000FF');apply(/(?<![\w"\d:-])-?\b\d+(?:\.\d+)?\b(?![\w"\d:-])/g,'#098658');}
 return q;
}
function slide(topic,sub,n,extra=''){let s=p.slides.add();s.background.fill='#FFFFFF';text(s,topic,64,36,1140,62,48,C.ink,true);text(s,sub,66,107,1140,65,29,C.muted);box(s,66,188,1148,2,C.line);text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',66,676,700,22,13,C.muted);text(s,String(p.slides.items.length).padStart(2,'0'),1158,674,55,24,15,C.muted);s.speakerNotes.textFrame.setText(notes(n,extra));map.push({slide:p.slides.items.length,sourceSlide:n,topic,subtitle:sub,extra});return s;}
function divider(topic,sub,n){let s=p.slides.add();s.background.fill='#FFFFFF';box(s,90,206,92,6,C.accent);text(s,topic,82,228,1110,120,76,C.ink,true);text(s,sub,88,366,1080,125,34,C.muted);text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',88,642,800,30,16,C.muted);s.speakerNotes.textFrame.setText(notes(n,'Разделитель: 10–15 секунд внутри времени исходного блока, не дополнительное время.'));map.push({slide:p.slides.items.length,sourceSlide:n,topic,subtitle:sub,divider:true});return s;}
function rows(topic,sub,n,items,extra=''){let s=slide(topic,sub,n,extra);let step=n===28?101.25:Math.min(113,405/items.length);items.forEach(([key,value,detail],i)=>{let y=218+i*step;text(s,key,78,y,270,48,30,C.accent,true);text(s,'→',345,y,65,46,34,C.accent);text(s,value,428,y,772, detail?48:75,28,C.ink,true);if(detail)text(s,detail,428,y+47,772,48,23,C.muted);if(i<items.length-1)box(s,78,y+step-9,1122,1,C.line);});return s;}
function bullets(topic,sub,n,items,extra=''){let s=slide(topic,sub,n,extra);let step=Math.min(129,414/items.length);items.forEach(([title,body],i)=>{let y=220+i*step;text(s,title,80,y,1110,45,31,C.accent,true);if(body)text(s,body,80,y+49,1110,70,27);});return s;}
function code(topic,sub,n,listing,explanation,extra=''){let s=slide(topic,sub,n,extra);box(s,70,214,750,420);highlight(text(s,listing,88,228,716,389,23,'#000000',false,mono),listing,n===22?'xml':n===29||n===32?'yaml':n===23?'csv':'json');text(s,explanation,862,240,344,390,n===25?25:27);return s;}
async function image(s,name,x=66,y=210,w=1148,h=408){s.images.add({blob:new Uint8Array(await fs.readFile(name.startsWith('/')?name:asset+name)),contentType:'image/png',fit:'contain',alt:name,position:{left:x,top:y,width:w,height:h}});}
const rfc='https://www.rfc-editor.org/rfc/';const medium='https://cabulous.medium.com/http-2-and-how-it-works-9f645458e4b2';
let s;
bullets('Рекап','О чём говорили на первой лекции',1,[['Архитектура','1/2/3-tier: экран, логика, данные.'],['Способы взаимодействия','CORBA, SOAP, REST, gRPC.'],['API в ML-системе','Внешние обещания отделяем от внутреннего устройства.']]);
rows('План лекции','HTTP, REST и описание API',2,[['HTTP','Структура, версии, методы и коды ответа'],['REST','Ресурсы, представления и кэширование'],['Данные','JSON, XML, CSV, Parquet; схемы и валидация'],['OpenAPI 3.2.1','Описание API и демонстрация Swagger UI']]);
divider('HTTP','Как клиент формулирует запрос,\nа сервер сообщает результат',3);
for(const [sub,file] of [['Запрос: структура HTTP/1.1','request.png'],['Ответ: структура HTTP/1.1','response.png']]){s=slide('HTTP',sub,3,'Запрос и ответ показаны последовательно в рамках исходных 2 минут. Заголовков может быть много, каждый записывается отдельной строкой.');await image(s,'/tmp/lecture02-palette/build/'+file,66,209,1148,350);text(s,'Headers: заголовков может быть много — каждый на отдельной строке',76,580,1120,46,25,C.accent,true);link(s,'Источник: RFC 9112 §2.1',rfc+'rfc9112.html#section-2.1');}
s=slide('HTTP','Получение прогноза: заполненный запрос',4);await image(s,'http11-forecast-highlighted.png',66,205,850,442);text(s,'Path и query',942,265,270,45,27,C.accent,true);text(s,'42 — офис\ndays=1 — горизонт',942,313,270,110,25);text(s,'Accept',942,460,270,45,29,C.accent,true);text(s,'Желаемый формат\nответа сервера',942,508,270,100,25);
s=slide('HTTP','Передача наблюдения: заполненный запрос',4);await image(s,'http11-observation-highlighted.png',66,205,850,442);text(s,'Content-Type',942,265,270, forty(),27,C.accent,true);text(s,'Формат тела\nэтого сообщения',942,313,270,100,25);text(s,'30 байт',942,460,270,45,29,C.accent,true);text(s,'Длина JSON\nбез перевода строки',942,508,270,100,25);
rows('HTTP','Версии: одна семантика, разная передача',5,[['HTTP/1.1','TCP; текстовая стартовая строка и заголовки','Тело может быть бинарным. Соединение переиспользуется.'],['HTTP/2','Кадры разных потоков в одном TCP-соединении','HPACK; потеря TCP-данных задерживает доставку потокам.'],['HTTP/3','Потоки поверх QUIC/UDP','QPACK; QUIC обеспечивает надёжность и интегрирует TLS 1.3.']]);
rows('HTTP','Когда появились первые RFC версий',5,[['Январь 1997','HTTP/1.1 · RFC 2068'],['Май 2015','HTTP/2 · RFC 7540','Через 18 лет 4 месяца'],['Июнь 2022','HTTP/3 · RFC 9114','Через 7 лет 1 месяц']]);
s=rows('HTTP','Какая версия встречается чаще',5,[['52,5%','HTTP/2'],['27,6%','HTTP/1.x'],['19,9%','HTTP/3']]);text(s,'Cloudflare: Worldwide / All traffic · 7 дней до 14.09.2026',78,573,1120,40,22,C.muted);link(s,'Выборка Cloudflare, не все API мира · источник: Radar','https://radar.cloudflare.com/adoption-and-usage?dateRange=7d#http1x-vs-http2-vs-http3');
s=slide('HTTP','HTTP/2: соединение, поток, сообщение, кадр',6);await image(s,'http2-frame.png',66,201,1148,415);link(s,'Carson: HTTP/2 and How it Works',medium,76,617,670);link(s,'RFC 9113 §§4–5, 8',rfc+'rfc9113.html#section-4',870,617,340);
s=slide('HTTP','HTTP/2: два потока в одном соединении',7);await image(s,'http2-streams.png',66,201,1148,415);link(s,'Carson: HTTP/2 and How it Works',medium,76,617,670);link(s,'RFC 9113 §§4–5, 8',rfc+'rfc9113.html#section-4',870,617,340);
bullets('HTTP','gRPC: вызов метода другого сервиса',8,[['Backend → ForecastService.GetForecast','Взаимодействие сервисов, в том числе на разных языках.'],['Контракт .proto; обычно Protobuf','Генерация клиентских обёрток и серверных заготовок.'],['Unary и streaming','Один запрос/ответ или поток сообщений. RPC ≠ DATA-кадр.']]);
rows('HTTP','Метод выражает намерение',9,[['GET','Получить представление','Готовый прогноз'],['POST','Обработать переданное содержимое','Новое наблюдение или создание задания'],['PUT','Создать или полностью заменить','Полное состояние по известному URI'],['PATCH','Применить документ изменений','Установить один порог']]);
rows('HTTP','Другие методы',9,[['DELETE','Удалить связь ресурса с его функциональностью','Например, отменить подписку'],['HEAD','Семантика GET без тела ответа','Метаданные выгрузки'],['OPTIONS','Узнать возможности взаимодействия','CORS preflight — частный случай']]);
bullets('HTTP','Почему не делать всё через GET?',10,[['Представьте','GET удаляет подписку; параметры передаются в body.'],['Вопрос','Кто может пройти по ссылке, повторить запрос\nили вернуть ответ из кэша?']]);
bullets('HTTP','Методы — договор со всей инфраструктурой',10,[['GET — безопасное чтение','Роботы, предварительная загрузка и кэш рассчитывают на эту семантику.'],['Повтор запроса','Идемпотентность определяет ожидаемый эффект повторения.'],['Тело GET','Общепринятой семантики нет; посредник или сервер может его отвергнуть.']]);
rows('HTTP','Нужен ли полный CRUD на каждом URI?',11,[['Сценарий','Реализуем нужные потребителю операции'],['405 + Allow','Метод известен, но не разрешён ресурсу'],['501','Метод не распознан или не реализуется сервером']]);
bullets('HTTP','Интерактив: выберите метод и результат',12,[['Размер CSV','Узнать размер готовой выгрузки, не скачивая её. Сервер знает длину.'],['Расписание','Передать полное расписание по /offices/42/schedule.'],['Долгий отчёт','Заказать /report-jobs и получить ответ до завершения.'],['Подписка','Отменить /subscriptions/sub-7. Какие методы здесь не нужны?']]);
bullets('HTTP','Ответ потерялся: что произойдёт при повторе запроса?',13,[['GET / PUT','Прогноз / полное состояние threshold=100, notifications_enabled=true.'],['POST','Добавление нового наблюдения.'],['PATCH','«Установить 100» или «прибавить 10».']]);
const statuses=[
[14,'1xx: промежуточный ответ','cats-1xx.png',[['100','Можно продолжить отправку тела']]],
[15,'2xx: что именно удалось','cats-2xx.png',[['200','Успешный результат'],['201','Новый объект API, например подписка'],['202','Принято; обработка ещё не завершена'],['204','Выполнено; тела ответа нет']]],
[16,'3xx: перейти или использовать сохранённое','cats-3xx.png',[['301','Новый постоянный адрес'],['304','Использовать сохранённое представление'],['307 / 308','Временный / постоянный переход; метод сохраняется']]],
[17,'4xx: что исправить в обращении','cats-4xx.png',[['400','Некорректный запрос'],['401 / 403','Нужны credentials / доступ запрещён'],['404 / 405','Не найдено / метод не разрешён'],['422','Содержимое нельзя обработать']]],
[18,'5xx: почему запрос не выполнен','cats-5xx.png',[['500','Сбой внутри нашего сервиса'],['502','Некорректный ответ upstream'],['503','Сервис временно недоступен'],['504','Upstream не ответил вовремя']]]];
for(const [n,title,file,items] of statuses){s=slide('HTTP',title,n);await image(s,file,64,218,620,408);items.forEach(([k,v],i)=>{let y=225+i*Math.min(102,380/items.length);text(s,k,729,y,470,40,31,C.accent,true);text(s,v,729,y+42,480,62,25);});if(n===18)text(s,'upstream — сервер, куда мы отправляем запрос',729,633,480,38,18,C.muted);}
divider('REST','Как организовать ресурсы\nи взаимодействие с ними',19);
bullets('REST','Ресурс и его представление',19,[['Ресурс','Адресуемое понятие: прогноз офиса.'],['Представление','Переданные данные о ресурсе, например JSON.'],['Внутреннее устройство','Таблица, файл или вычисление не диктуют внешний интерфейс.']]);
rows('REST','Ограничения архитектурного стиля',19,[['Клиент–сервер','Разделение ответственности'],['Stateless','Запрос несёт необходимый контекст'],['Кэш и слои','Повторное использование и посредники'],['Единый интерфейс','Ресурсы, представления, сообщения и гипермедиа']]);
bullets('REST','Связи и доступные действия',19,[['Гипермедиа','Клиент узнаёт связи и действия из представления.'],['Пример проектирования','links.office.href = "/offices/42"'],['Зачем нужны ссылки','Ответ подсказывает клиенту, куда перейти и какие действия доступны.']]);
rows('REST','Когда можно повторно использовать прогноз',20,[['max-age=60','Срок свежести по выбранной политике'],['no-cache','Проверить перед повторным использованием'],['no-store','Не хранить'],['stale в моке','Фиксированное учебное значение']]);
divider('Форматы данных','Как кодировать, передавать\nи хранить представление',21);
function listing(n,lang){let m=content[n-1].visible.match(new RegExp('```'+lang+'\\n([\\s\\S]*?)```'));return m?.[1].trim()??'';}
code('Форматы данных','JSON: сообщение приложения',21,`{
  "office_id": 42,
  "observations": [
    {"hour": "2026-09-14T09:00:00Z",
     "visitors": 45, "note": "Офис, центр"},
    {"hour": "2026-09-14T10:00:00Z",
     "visitors": 0, "note": null}
  ]
}`,'application/json\n\nОбъект и массив\n\nЧисла, строки, null\n\nПарсер → структура → схема');
code('Форматы данных','XML: документ для партнёра',22,`<observations xmlns="urn:course:observations:v1"
              officeId="42">
  <observation hour="2026-09-14T09:00:00Z">
    <visitors>45</visitors>
    <note>Офис, центр</note>
  </observation>
  <observation hour="2026-09-14T10:00:00Z">
    <visitors>0</visitors>
  </observation>
</observations>`,'application/xml\n\nЭлементы, атрибуты, пространства имён\n\nXSD = XML Schema Definition\n\nСхема XML: элементы, атрибуты и типы');
code('Форматы данных','CSV: таблица для импорта',23,listing(23,'csv'),'text/csv\n\nКавычки защищают запятую внутри поля.\n\nДиалект, кодировка, колонки и пропуски — договор.');
s=slide('Форматы данных','Parquet: группы строк и блоки колонок',24);const cols=['office_id','hour','visitors','note'];text(s,'Row group 1',76,219,1100,45,30,C.accent,true);cols.forEach((v,i)=>{box(s,76+i*285,277,259,112);text(s,v,91+i*285,306,231,50,27,C.ink,true);});text(s,'Row group 2 → аналогичные блоки колонок',76,433,1110,58,30,C.accent,true);text(s,'Читаем нужные колонки; используем метаданные и статистику.',76,527,1110,86,28);link(s,'Источник: Apache Parquet — File Format','https://parquet.apache.org/docs/file-format/');
rows('Форматы данных','Выбор зависит от потребителя',24,[['Приложение','JSON','Компактные структурированные сообщения'],['XML-партнёр','XML','Документ и согласованная XSD'],['Небольшой импорт','CSV','Плоские строки и явный диалект'],['Аналитика истории','Parquet','Колонковое чтение больших наборов данных']]);
divider('Схемы и валидация','Как проверить структуру\nи сохранить смысл данных',25);
code('Схемы и валидация','Отсутствие, null и ноль',25,`{
  "type": "object",
  "properties": {
    "office_id": {"type": "integer"},
    "visitors": {
      "type": ["integer", "null"],
      "minimum": 0
    }
  },
  "required": ["office_id", "visitors"]
}`,'required — поле обязательно.\n\nnull — значение неизвестно.\n\n0 — известно: посетителей нет.\n\nПоле отсутствует — значение не передано.');
for(let stage=1;stage<=3;stage++){s=slide('Схемы и валидация','Проверки до выполнения действия',26,'Кадр '+stage+' из 3; все кадры занимают 2 минуты суммарно.');const xs=[['JSON-парсер','{"visitors": }','Не разобрать сообщение'],['Схема','{"visitors": -5}','Нарушено minimum: 0'],['Предметные правила','{"office_id": 999}','Офис неизвестен']];for(let i=0;i<stage;i++){let y=221+i*128;box(s,75,y,72,72);text(s,'0'+(i+1),86,y+12,60,44,31,C.accent,true);text(s,xs[i][0],182,y,1010,44,29,C.ink,true);highlight(text(s,xs[i][1],182,y+50,411,40,25,'#000000',false,mono),xs[i][1]);text(s,'→',593,y+46,56, forty(),29,C.accent);text(s,xs[i][2],666,y+49,532,44,25);}if(stage===3)text(s,'Допустимый запрос → действие → проверка исходящего ответа',182,620,1020,40,24,C.accent,true);}
s=rows('Схемы и валидация','Тип сохранён, смысл изменился',27,[['Было','visitors: 45 — посетителей за час'],['Стало','visitors: 45 — посетителей за сутки'],['Последствие','Схема проходит; клиент считает неправильно']]);text(s,'Вывод: в договоре фиксируем единицы и период измерения.',78,586,1120, fifty(),27,C.accent,true);
divider('OpenAPI','Описание HTTP-интерфейса\nи проверка его обещаний',28);
for(let stage=1;stage<=4;stage++){let xs=[['OAS 3.2.1','Правила описания интерфейса'],['YAML / JSON','Конкретный документ; info.version — его редакция'],['Swagger UI','Читает документ: операции, схемы, примеры'],['API-сервер','Execute отправляет настоящий HTTP-запрос']];rows('OpenAPI','Спецификация, документ, интерфейс и сервер',28,xs.slice(0,stage),'Раскрытие '+stage+'/4. Общая длительность всей последовательности 2 минуты.');}
code('OpenAPI','Знакомый GET в документе',29,'openapi: 3.2.1\ninfo:\n  title: Forecast API\n  version: 1.0.0\nservers:\n  - url: http://127.0.0.1:8000\npaths:\n  /offices/{office_id}/forecast:\n    get:\n      parameters: ...\n      responses: ...','servers — базовый адрес\n\npaths + get — операция\n\nСокращённый фрагмент, не полный YAML');
rows('OpenAPI','Параметры, ответы и переиспользование схем',29,[['office_id','in: path; integer; required: true'],['days','in: query; enum: [1, 7]'],['responses','Код → content → schema / example'],['$ref','Ссылка на components/schemas']]);
s=slide('OpenAPI','Swagger UI: от описания к запросу',30);let live=text(s,'Live Demo!',70,211,1140,83,60,C.accent,true);live.text.style={typeface:font,fontSize:60,color:C.accent,bold:true,alignment:'center'};await image(s,'cat-live-demo.png',343,298,594,352);
rows('OpenAPI','Execute: обещание и фактический ответ',31,[['42 / days=1','200 · 24 часовые точки'],['42 / days=7','200 · 168 часовых точек'],['42 / days=2','422 · invalid_request']]);
code('OpenAPI','POST: requestBody и $ref',32,listing(32,'yaml'),'Тело описывается отдельно от path/query.\n\n$ref переиспользует схему Observation.\n\nPOST читаем в UI; выполняем через curl.');
rows('OpenAPI','Три разных проверки',32,[['Документ','Формат OpenAPI и разрешение ссылок'],['Примеры','Значения удовлетворяют схемам'],['Реальный сервер','Проверенные обмены соответствуют договору']]);
rows('OpenAPI','Совместимость для конкретного клиента',33,[['Запрос','Новое обязательное поле ломает отправителя'],['Ответ','Удалённое обещанное поле ломает читателя'],['Добавление','Поле или enum требуют проверки старого клиента'],['Смысл','Те же типы, другие единицы — тоже нарушение']]);
bullets('Итоги','Как получить прогноз, не читая серверный код?',34,[['Что нужно потребителю','Операция, параметры, формат, схема и смысл, результаты, ошибки.'],['Что даёт OpenAPI','Машиночитаемое описание HTTP-договора.'],['Что проверяем отдельно','Поведение реального сервера.']]);
for(let n=35;n<=37;n++){s=slide('Источники',content[n-1].title.replace('Источники: ',''),n);let lines=content[n-1].visible.split('\n').filter(x=>x.startsWith('- '));lines.forEach((l,i)=>{let clean=l.slice(2),m=clean.match(/\[([^\]]+)\]\(([^)]+)\)(.*)/);if(m){let q=text(s,m[1]+m[3],78,215+i*57,1120,51,24);q.text.get(m[1]).link={uri:m[2],isExternal:true};}else text(s,clean,78,215+i*57,1120,51,24);});}
function forty(){return 40;} function fifty(){return 50;}
// Each physical slide gets its own wall-clock interval, starting at 09:00.
const fmt=sec=>{let h=9+Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':');};
const overrides={
52:'Раскрыть POST и requestBody, сопоставить JSON-схему и пример, объяснить локальный $ref на Observation. POST Execute с этой страницы не выполнять из-за CORS; использовать подготовленный curl. Не требовать запоминания версий зависимостей.',
53:'Спросить: изменила ли правка YAML реальный сервер? Сопоставить проверку документа и ссылок, примеров по схемам и настоящих HTTP-обменов. Проверка нескольких запросов не доказывает корректность всех режимов сервера.',
2:'Назвать все разделы: HTTP, REST, форматы данных, схемы и валидация, OpenAPI 3.2.1 и Swagger UI. Связать темы с задачей получения готового прогноза. Не уходить в определения до соответствующего раздела.',
6:'Прочитать заполненный GET: method, path, query, version, headers, пустая строка; показать отсутствие тела. Затем перейти к POST. Accept описывает желаемый формат ответа.',
20:'Сервер уже обработал запрос, но ответ потерялся. Для каждой строки спросить, что произойдёт при повторе. Сравнить PATCH «установить» и «прибавить». Не сводить идемпотентность к одинаковому телу ответа.',
22:'Пояснить: создание ресурса — появление нового адресуемого объекта API, например подписки /subscriptions/sub-7. 201 сообщает о создании; Location может указать URI. Это не обязательно новая таблица или файл. Мок POST /observations лишь подтверждает приём: не выдавать проектируемую подписку за его поведение.',
29:'Показать ссылку из прогноза на офис и объяснить пользу для клиента: переход к связанному ресурсу и обнаружение доступных действий. Одна ссылка сама по себе не означает выполнения всех ограничений REST. Code-on-demand здесь не углублять.',
38:'Различить отсутствие поля, null и число 0. Здесь договор трактует null как неизвестное число посетителей. required требует наличия поля, а type разрешает целое число или null. Ноль означает известное отсутствие посетителей. Не приписывать null универсальный предметный смысл.',
42:'Сопоставить час и сутки при одном типе и одинаковом числе. Зафиксировать вывод: единицы и период измерения — часть договора, одной схемы недостаточно.',
50:'Переключиться на /lecture-02, читающую /lecture-02/openapi.yaml. Найти Parameters и Responses, сопоставить их с YAML. Различить Example Value и Schema; пример не является фактическим ответом сервера. Затем Execute с days=1, 7, 2. При недоступности демонстрации использовать подготовленный запасной показ.'
};
for(let n=1;n<=37;n++){
 let mm=content[n-1].notes.match(/Время: (\d+):(\d+)–(\d+):(\d+)/);if(!mm)throw Error('Missing time '+n);
 let start=+mm[1]*60+ +mm[2],end=+mm[3]*60+ +mm[4],entries=map.filter(x=>x.sourceSlide===n),divs=entries.filter(x=>x.divider).length,rest=entries.length-divs,budget=end-start-15*divs,used=0,seen=0;
 for(const e of entries){let dur=e.divider?15:Math.floor(budget/rest)+(++seen<=budget%rest?1:0);e.start=fmt(start+used);e.end=fmt(start+used+dur);used+=dur;
 let body=overrides[e.slide]?'Ход показа и границы\n'+overrides[e.slide]:e.divider?'Ход показа и границы\nОбъявить новую тему и связать её с предыдущим разделом. Не разворачивать объяснение на разделителе.':notes(n,'');
 p.slides.items[e.slide-1].speakerNotes.textFrame.setText('Время: '+e.start+'–'+e.end+'\nДлительность: '+dur+' с.\n\n'+body);
 }
}
await fs.writeFile(root+'/build/slide-map.json',JSON.stringify(map,null,2));
await(await PresentationFile.exportPptx(p)).save(root+'/build/candidate.pptx');
for(let i=0;i<p.slides.items.length;i++){let b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(root+'/build/slide-'+(i+1)+'.png',new Uint8Array(await b.arrayBuffer()));}
const skill='/Users/ripper/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const res=await finalizePresentation({workspaceDir:root,candidatePath:root+'/build/candidate.pptx',finalPath:root+'/output/002_http-rest-openapi-data-contracts-r2-delivery.pptx',pythonExecutable:'/Users/ripper/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font,mono]},explicitTotalSlideCount:map.length,verifyArtifactToolImport:true,receiptPath:root+'/build/validation-delivery.json'});console.log(JSON.stringify({slides:map.length,result:res}));
