"""Rebuild original, English-labelled lecture diagrams (SVG; render PNG with Sharp)."""
from pathlib import Path
from html import escape


OUT = Path(__file__).resolve().parent
INK = '#24364b'
parts = []
def start(title, subtitle, height=1000):
    parts.clear()
    parts.extend([f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="{height}" viewBox="0 0 1600 {height}">', f'<rect width="1600" height="{height}" fill="#f6f8fc"/>'])
    text(55, 67, title, 37)
    text(55, 110, subtitle, 23, '#586a80')
def text(x,y,s,size=24,color=INK,mono=False):
    parts.append(f'<text x="{x}" y="{y}" font-family="{"DejaVu Sans Mono" if mono else "DejaVu Sans"}, sans-serif" font-size="{size}" fill="{color}">{escape(s)}</text>')
def rect(x,y,w,h,color='#ffffff'):
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{color}" stroke="#cbd6e4"/>')
def line(x,y,x2,y2,color='#8297af'):
    parts.append(f'<path d="M{x} {y} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="3"/>')
def save(name):
    svg='\n'.join(parts+['</svg>'])
    (OUT/f'{name}.svg').write_text(svg)

def row(y,value,label,color='#ffffff',size=25):
    rect(55,y-33,920,57,color)
    text(75,y+4,value,size,mono=True)
    line(990,y-3,1020,y-3)
    text(1040,y+4,label,23)

start('HTTP/1.1 — request and response anatomy', 'Abstract templates first; explanatory labels are not transmitted bytes.', 1160)
text(55,167,'REQUEST',26,'#2760a7')
text(75,211,'Method',21,'#2760a7'); text(278,211,'Path',21,'#2760a7');text(411,211,'Query',21,'#2760a7');text(716,211,'Version',21,'#2760a7')
row(260,'','Request line','#e7effc');text(75,264,'METHOD',29,mono=True);text(278,264,'/path',29,mono=True);text(411,264,'?key=value',29,mono=True);text(716,264,'HTTP/1.1',29,mono=True)
row(331,'Host: <host>[:<port>]','Host and optional port')
row(402,'Header-Name: <value>','Header name : value')
row(473,'','Empty line (CRLF)','#fff1cc')
row(544,'<optional request content>','Request body, if present','#e6f5ec')
text(55,615,'RESPONSE',26,'#2760a7')
text(75,657,'Version',21,'#2760a7');text(287,657,'Status code',21,'#2760a7');text(536,657,'Reason phrase',21,'#2760a7')
row(706,'','Status line','#e7effc');text(75,710,'HTTP/1.1',29,mono=True);text(287,710,'200',29,mono=True);text(536,710,'OK',29,mono=True)
row(777,'Header-Name: <value>','Response headers')
row(848,'','Empty line (CRLF)','#fff1cc')
row(919,'<response content, when permitted>','Response body','#e6f5ec')
text(55,1002,'Lines end with CRLF. Header/body boundary: CRLF CRLF.',23)
text(55,1040,'Request-target shown in origin-form. Message framing determines body presence and length.',23)
text(55,1080,'HEAD responses and 204 / 304 responses have no message body.',23)
text(55,1120,'Sources: RFC 9112 §2.1; RFC 9110 §§6, 9, 15. Original redraw for lecture 2.',20,'#586a80')
save('http11-anatomy')

start('HTTP/1.1 — a complete observation request', 'Teaching example from seminar 2: the mock acknowledges the observation; it does not store it.')
text(75,180,'Method',23,'#2760a7');text(240,180,'Path',23,'#2760a7');text(660,180,'Version',23,'#2760a7')
row(230,'','Request line','#e7effc');text(75,234,'POST',30,mono=True);text(240,234,'/observations',30,mono=True);text(660,234,'HTTP/1.1',30,mono=True)
row(307,'Host: 127.0.0.1:8001','Host : port')
row(384,'User-Agent: seminar-demo','Client software')
row(461,'Accept: application/json','Accepted response media type')
row(538,'Content-Type: application/json','Request body media type')
row(615,'Content-Length: 30','Body length in bytes')
row(692,'','Empty line (CRLF)','#fff1cc')
row(769,'{"office_id":42,"visitors":45}','JSON request body','#e6f5ec',27)
text(55,850,'GET example: /offices/42/forecast?days=1',26,mono=True)
text(55,892,'Path = /offices/42/forecast     Query = days=1     Parameter: days → 1',24)
text(55,935,'Content-Length counts exactly 30 UTF-8 bytes here, with no trailing newline.',23)
text(55,975,'Sources: seminar 2 teaching example; RFC 9112 §§2–3; RFC 9110 §8.',20,'#586a80')
save('http11-observation')

start('HTTP/2 — from a connection to frames', 'Same HTTP semantics; binary framing replaces HTTP/1.1 message lines.')
for x,w,label,col in [(55,340,'Connection','#e7effc'),(430,330,'Stream 1 / Stream 3','#e6f5ec'),(795,350,'Request / response','#fff1cc'),(1180,365,'Frames','#e7effc')]:
    rect(x,155,w,75,col);text(x+18,201,label,25)
    if x<1180: text(x+w+8,203,'→',29)
text(55,289,'Frame header: 9 bytes = 72 bits. Widths below are schematic; labels give exact bit counts.',23)
x=55
for w,label,bits,col in [(340,'Length','24 bits','#e7effc'),(230,'Type','8 bits','#fff1cc'),(230,'Flags','8 bits','#fff1cc'),(160,'R','1 bit','#f2f5fa'),(530,'Stream ID','31 bits','#e6f5ec')]:
    rect(x,320,w,112,col);text(x+20,367,label,27);text(x+20,410,bits,23);x+=w
rect(55,450,1490,80);text(78,500,'Payload — exactly Length bytes (the 9-byte header is not counted)',28)
text(55,587,'HEADERS  →  header block encoded with HPACK',28,mono=True)
text(55,632,'DATA     →  message content (for example, part of a JSON body)',26,mono=True)
rect(55,675,1490,200,'#e7effc')
text(80,715,'Readable fields AFTER HPACK decoding — not literal wire bytes',25,'#2760a7')
text(80,759,':method = GET     :scheme = https     :authority = api.example.edu',24,mono=True)
text(80,804,':path = /offices/42/forecast?days=1',25,mono=True)
text(80,850,'Response: :status = 200',25,mono=True)
text(55,922,'Stream ID joins related frames. Stream ID 0 is reserved for connection-level frames.',23)
text(55,969,'Sources: Carson, HTTP/2 and How it Works; RFC 9113 §§4–5, 8. Original diagram.',20,'#586a80')
save('http2-frame')

start('HTTP/2 — two streams share one connection', 'Illustrative exchange, not traffic from the HTTP/1.1 teaching mock. Both forecasts exist here.')
text(65,172,'Direction',24);text(357,172,'Frame',24);text(712,172,'Meaning / decoded fields',24)
rows=[('Client → Server','HEADERS [1]','GET /offices/42/forecast','END_HEADERS + END_STREAM',1),('Client → Server','HEADERS [3]','GET /offices/43/forecast','END_HEADERS + END_STREAM',3),('Server → Client','HEADERS [1]',':status = 200','END_HEADERS',1),('Server → Client','HEADERS [3]',':status = 200','END_HEADERS',3),('Server → Client','DATA [1]','Office 42: first part','',1),('Server → Client','DATA [3]','Office 43: complete body','END_STREAM',3),('Server → Client','DATA [1]','Office 42: remaining part','END_STREAM',1)]
for i,(direction,frame,meaning,flags,stream) in enumerate(rows):
    y=198+i*88;rect(55,y,1490,76,'#e7effc' if stream==1 else '#e6f5ec')
    text(72,y+32,direction,23);text(355,y+32,frame,25,mono=True);text(710,y+30,meaning,24)
    if flags:text(710,y+61,flags,20,'#586a80',True)
text(55,864,'Time flows downward. Stream 3 finishes first; each stream preserves its own order.',24)
text(55,909,'END_STREAM ends one sending direction. Every shown header block is complete.',24)
text(55,948,'An unfinished HEADERS / CONTINUATION block cannot be interleaved with other frames.',22)
text(55,985,'Sources: Carson, HTTP/2 and How it Works; RFC 9113 §§4–5, 8. Setup frames omitted.',20,'#586a80')
save('http2-streams')
