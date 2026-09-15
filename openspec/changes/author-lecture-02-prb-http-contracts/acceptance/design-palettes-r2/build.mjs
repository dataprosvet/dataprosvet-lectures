import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {resolvePresentationFont,finalizePresentation} from '/Users/ripper/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/artifact_tool_utils.mjs';
const font=resolvePresentationFont({fontFamily:'Arial'});
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={bg:'#FFFFFF',ink:'#22343C',muted:'#637379',accent:'#287B79',dark:'#20383F',pale:'#DCE7E2',line:'#C6CFCA',white:'#F8F6F0'};
const asset='/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies/assets/lecture-002/';
function text(s,t,x,y,w,h,size=28,color=C.ink,bold=false){let a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=t;a.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none'};return a;}
function box(s,x,y,w,h,fill){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function base(topic,sub,notes){let s=p.slides.add();s.background.fill=C.bg;text(s,topic,64,36,1130,62,48,C.ink,true);text(s,sub,66,107,1140,65,29,C.muted);box(s,66,188,1148,2,C.line);text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',66,676,700,22,13,C.muted);text(s,String(p.slides.items.length).padStart(2,'0'),1158,674,55,24,15,C.muted);s.speakerNotes.textFrame.setText(notes);return s;}
function divider(topic,sub,notes){let s=p.slides.add();s.background.fill=C.dark;text(s,topic,82,228,1110,120,82,C.white,true);text(s,sub,88,366,1080,105,34,'#B7CECA');text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',88,642,800,30,16,'#B7CECA');s.speakerNotes.textFrame.setText(notes);return s;}
async function img(s,name,x,y,w,h){s.images.add({blob:new Uint8Array(await fs.readFile(asset+name)),contentType:'image/png',alt:name,fit:'contain',position:{left:x,top:y,width:w,height:h}});}
function noteSource(t){return t+'\nИсточники: https://www.rfc-editor.org/rfc/rfc9110.html';}

const palettes=[['A · Дымчато-синий','#416F99','#EAF1F7'],['B · Шалфейный','#527A62','#ECF3ED'],['C · Лавандовый','#77639D','#F1EDF7'],['D · Терракотовый','#9B6553','#F8EFEB'],['E · Бирюзовый / белый','#287B79','#E8F2F0'],['F · Бирюзовый / серый','#287B79','#E8F2F0']];
for(const [name,accent,pale] of palettes){
 C.bg=name.startsWith('F')?'#F8F9FA':'#FFFFFF';C.accent=accent;C.pale=pale;C.line='#DDE2E5';
 let s=base('HTTP','Метод выражает намерение',noteSource('Образец палитры '+name+'. 17:00–21:00, фрагмент объяснения методов. При выборе цвета сравнивать одинаковое содержание.'));
 text(s,name,940,42,274,39,20,C.accent,true);
 const rows=[['GET','Получить представление','Готовый прогноз'],['POST','Обработать переданное содержимое','Новое наблюдение'],['PUT','Создать или полностью заменить','Расписание по известному URI'],['PATCH','Применить изменения','Установить один порог']];
 rows.forEach((r,i)=>{let y=220+i*103;box(s,73,y-2,166,57,C.pale);text(s,r[0],83,y,150,46,34,C.accent,true);text(s,'→',268,y,65,48,36,C.accent);text(s,r[1],346,y,820,43,29,C.ink,true);text(s,r[2],346,y+44,820,35,23,C.muted);if(i<3)box(s,76,y+88,1127,1,C.line);});
 s=base('HTTP','5xx: почему запрос не выполнен',noteSource('Палитра '+name+'. 36:30–38:00. Upstream — сервер, к которому текущий сервер обратился за ответом; 502/504 относятся к роли шлюза или прокси. 503 не гарантирует безопасный повтор POST. Иллюстрации: авторский комплект курса по референсу преподавателя.'));
 text(s,name,940,42,274,39,20,C.accent,true);
 await img(s,'cats-5xx.png',65,232,627,376);
 const codes=[['500','Сбой внутри нашего сервиса'],['502','Другой сервер прислал\nнекорректный ответ'],['503','Сервис временно недоступен'],['504','Другой сервер не ответил вовремя']];
 codes.forEach((r,i)=>{let y=220+i*98; text(s,r[0],736,y,94,43,32,C.accent,true);text(s,r[1],839,y+3,369,73,25);});
 text(s,'«Другой сервер» = upstream: к нему наш сервис\nобратился за ответом.',736,619,477,47,18,C.muted);
}
C.bg='#FFFFFF';C.accent=palettes[0][1];C.pale=palettes[0][2];
let s=p.slides.add();s.background.fill='#FFFFFF';text(s,'HTTP',82,228,1110,120,82,C.ink,true);text(s,'Как клиент формулирует запрос,\nа сервер сообщает результат',88,366,1080,105,34,C.muted);box(s,90,206,92,6,C.accent);text(s,'API-ТЕХНОЛОГИИ · ЛЕКЦИЯ 02',88,642,800,30,16,C.muted);s.speakerNotes.textFrame.setText('Белый разделитель глобальной темы. Акцент предварительно A, заменяется выбранным. Около 15 секунд внутри перехода HTTP.');
s=base('HTTP','Upstream: сервер, у которого мы запрашиваем данные',noteSource('Пояснение роли upstream к статусам 502 и 504. Наш сервер здесь работает как шлюз/прокси. Коды относятся к сбою обмена с upstream; не всякий прикладной отказ зависимости автоматически означает 502.'));
[['Клиент',75],['Наш сервер',484],['Другой сервер',893]].forEach(([label,x])=>{box(s,x,255,305,113,C.pale);text(s,label,x+18,284,275, fifty(),30,C.ink,true);});
text(s,'→',400,280,60,58,45,C.accent);text(s,'→',810,280,60,58,45,C.accent);text(s,'upstream',910,380,290, forty(),28,C.accent,true);
text(s,'502',83,475,118,48,36,C.accent,true);text(s,'Ответ пришёл, но он некорректен',230,481,970,44,30);
text(s,'504',83,557,118,48,36,C.accent,true);text(s,'Ответ не пришёл вовремя',230,563,970,44,30);
text(s,'Источник: RFC 9110 §§15.6.3, 15.6.5',83,634,1100,27,17,C.muted);
function fifty(){return 50;}function forty(){return 40;}
C.bg='#FFFFFF';C.accent='#287B79';
for(const [sub,crop] of [['Запрос: структура HTTP/1.1',{left:0,top:0.12,right:0,bottom:0.49}],['Ответ: структура HTTP/1.1',{left:0,top:0.505,right:0,bottom:0.18}]]){
 s=base('HTTP',sub,'03:00–05:00, общий разбор запроса и ответа. Исходная авторская иллюстрация сохранена без изменения файла; в PPTX показаны последовательно области request и response. Источник: RFC 9112 §2.1 https://www.rfc-editor.org/rfc/rfc9112.html#section-2.1');
 s.images.add({blob:new Uint8Array(await fs.readFile('/tmp/lecture02-palette/build/'+(sub.startsWith('Запрос')?'request':'response')+'.png')),contentType:'image/png',alt:sub,fit:'contain',position:{left:66,top:205,width:1148,height:412}});
 text(s,'Строки разделены CRLF · Источник: RFC 9112 §2.1',76,635,1100,28,17,C.muted);
}
const root='/tmp/lecture02-palette';const skill='/Users/ripper/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
await(await PresentationFile.exportPptx(p)).save(root+'/build/candidate.pptx');
for(let i=0;i<p.slides.items.length;i++){let b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(root+'/build/slide-'+(i+1)+'.png',new Uint8Array(await b.arrayBuffer()));}
const res=await finalizePresentation({workspaceDir:root,candidatePath:root+'/build/candidate.pptx',finalPath:root+'/output/lecture02-palette-samples-r2-final5.pptx',pythonExecutable:'/Users/ripper/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},explicitTotalSlideCount:16,verifyArtifactToolImport:true,receiptPath:root+'/build/validation-final5.json'});console.log(res);
