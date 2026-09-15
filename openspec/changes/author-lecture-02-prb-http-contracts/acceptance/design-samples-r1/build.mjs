import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {resolvePresentationFont,finalizePresentation} from '/Users/ripper/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/artifact_tool_utils.mjs';
const font=resolvePresentationFont({fontFamily:'Arial'});
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={bg:'#F0EEE8',ink:'#22343C',muted:'#637379',accent:'#287B79',dark:'#20383F',pale:'#DCE7E2',line:'#C6CFCA',white:'#F8F6F0'};
const asset='/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies/assets/lecture-002/';
function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false){let a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=t;a.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none'};return a;}
function box(s,x,y,w,h,fill){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function base(topic,sub,notes){let s=p.slides.add();s.background.fill=C.bg;text(s,topic,64,36,1130,62,48,C.ink,true);text(s,sub,66,107,1140,65,29,C.muted);box(s,66,188,1148,2,C.line);text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',66,676,700,22,13,C.muted);text(s,String(p.slides.items.length).padStart(2,'0'),1158,674,55,24,15,C.muted);s.speakerNotes.textFrame.setText(notes);return s;}
function divider(topic,sub,notes){let s=p.slides.add();s.background.fill=C.dark;text(s,topic,82,228,1110,120,82,C.white,true);text(s,sub,88,366,1080,105,34,'#B7CECA');text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',88,642,800,30,16,'#B7CECA');s.speakerNotes.textFrame.setText(notes);return s;}
async function img(s,name,x,y,w,h){s.images.add({blob:new Uint8Array(await fs.readFile(asset+name)),contentType:'image/png',alt:name,fit:'contain',position:{left:x,top:y,width:w,height:h}});}
function noteSource(t){return t+'\nИсточники: https://www.rfc-editor.org/rfc/rfc9110.html';}
divider('HTTP','Как клиент формулирует запрос,\nа сервер сообщает результат','Разделитель HTTP. Около 15 секунд внутри перехода к блоку HTTP. В полной лекции время распределяется в рамках 90 минут.');
let s=base('HTTP','Запрос и ответ: общая форма HTTP/1.1',noteSource('03:00–05:00, 2 минуты. Сначала Method, Path, Query, Version; затем Headers, Empty line, Body. Подписи не передаются по сети. Источник рисунка: авторская переработка семинара 2, RFC 9112 §2.1.'));
text(s,'REQUEST',82,211,510,42,25,C.accent,true);text(s,'RESPONSE',683,211,510,42,25,C.accent,true);
const requestRows=[['Method · Path · Query · Version','METHOD /path?query HTTP/1.1'],['Headers','Host: api.example.edu'],['Empty line','Header / body boundary'],['Body','Optional request content']];
const responseRows=[['Version · Status code · Reason phrase','HTTP/1.1 200 OK'],['Headers','Content-Type: application/json'],['Empty line','Header / body boundary'],['Body','Response content, when permitted']];
[requestRows,responseRows].forEach((rows,col)=>rows.forEach((r,i)=>{let x=76+col*600,y=264+i*90;box(s,x,y,536,76,i===2?'#E6DFC9':C.pale);text(s,r[0],x+15,y+5,504,29,19,C.muted);text(s,r[1],x+15,y+34,504,35,23,C.ink,true);}));
text(s,'Lines end with CRLF · Source: RFC 9112 §2.1',82,637,1120,26,17,C.muted);

s=base('HTTP','Метод выражает намерение',noteSource('17:00–21:00, фрагмент блока методов. Типовой вариант вместо таблицы. PUT означает создание или полную замену состояния целевого ресурса. PATCH применяет документ изменений.'));
const rows=[['GET','Получить представление','Готовый прогноз'],['POST','Обработать переданное содержимое','Новое наблюдение'],['PUT','Создать или полностью заменить','Расписание по известному URI'],['PATCH','Применить изменения','Установить один порог']];
rows.forEach((r,i)=>{let y=220+i*103; text(s,r[0],76,y,170,46,34,C.accent,true);text(s,'→',259,y,70,48,36,C.muted);text(s,r[1],346,y,820,43,29,C.ink,true);text(s,r[2],346,y+44,820,35,23,C.muted);if(i<3)box(s,76,y+88,1127,1,C.line);});
s=base('HTTP','5xx: сервер или его зависимость не справились',noteSource('36:30–38:00, 1 минута 30 секунд. Сравнить 500/502/503/504. 503 не гарантирует безопасный повтор POST. Изображения сгенерированы для курса по референсу преподавателя; исходный скриншот содержит vk.com/asinASTRA.'));
await img(s,'cats-5xx.png',68,208,736,439);let codes=[['500','Внутренний сбой'],['502','Неверный ответ upstream'],['503','Временная недоступность'],['504','Upstream не ответил вовремя']];codes.forEach((r,i)=>{text(s,r[0],835,222+i*105,105,42,32,C.accent,true);text(s,r[1],835,263+i*105,370,52,23);});
for(let stage=1;stage<=3;stage++){
 s=base('HTTP','Проверяем данные до выполнения действия',noteSource('62:00–64:00, весь пример 2 минуты. Кадр раскрытия '+stage+' из 3; это отдельный слайд, без анимации. Переходы на клике. Проектируемые проверки, не утверждение о реализации мока.'));
 const checks=[['01','JSON-парсер','{"visitors": }','Не разобрать сообщение'],['02','Схема','{"visitors": -5}','Нарушено minimum: 0'],['03','Правила предметной области','{"office_id": 999}','Офис неизвестен']];
 for(let i=0;i<stage;i++){let y=227+i*129;let r=checks[i];box(s,70,y,76,76,C.pale);text(s,r[0],83,y+14, sixty(),44,31,C.accent,true);text(s,r[1],181,y,1000,43,29,C.ink,true);text(s,r[2],181,y+47,380,43,25,C.muted);text(s,'→',592,y+43,60,45,31,C.accent);text(s,r[3],663,y+46,533,45,25);}
 if(stage===3)text(s,'Только допустимый запрос → действие → проверка ответа',181,622,1020,38,25,C.accent,true);
}
function sixty(){return 60;}
divider('Форматы данных','Как кодировать, передавать\nи хранить представление','Разделитель после REST. Перерыв и переход не отображаются на слайде; отсчёт лекции продолжается с 45:00.');
s=base('Форматы данных','JSON: структура сообщения', '45:00–48:00, 3 минуты. Показать число, массив, объект и null. Отсутствие, null и ноль различаются. Источник: RFC 8259 https://www.rfc-editor.org/rfc/rfc8259.html');
box(s,70,222,695,394,'#E2E6DF');text(s,'{\n  "office_id": 42,\n  "observations": [\n    {"visitors": 45, "note": "Центр"},\n    {"visitors": 0, "note": null}\n  ]\n}',95,244,645,345,29,C.ink);
text(s,'Объект → свойства',825,239,374,46,29,C.accent,true);text(s,'Массив хранит\nпоследовательность значений.',825,293,374,95,26);text(s,'0 ≠ null',825,421,374,44,33,C.accent,true);text(s,'Ноль — известное число.\nnull — отдельное значение.',825,476,374,94,26);text(s,'application/json · RFC 8259',825,610,374,28,17,C.muted);
const root='/tmp/lecture02-template';const skill='/Users/ripper/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
await(await PresentationFile.exportPptx(p)).save(root+'/build/candidate.pptx');
for(let i=0;i<p.slides.items.length;i++){let b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(root+'/build/slide-'+(i+1)+'.png',new Uint8Array(await b.arrayBuffer()));}
const res=await finalizePresentation({workspaceDir:root,candidatePath:root+'/build/candidate.pptx',finalPath:root+'/output/lecture02-design-samples-r1-final.pptx',pythonExecutable:'/Users/ripper/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},explicitTotalSlideCount:9,verifyArtifactToolImport:true,receiptPath:root+'/build/validation-final.json'});console.log(res);
