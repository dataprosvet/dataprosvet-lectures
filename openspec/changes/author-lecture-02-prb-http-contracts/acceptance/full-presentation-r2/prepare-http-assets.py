from pathlib import Path
import xml.etree.ElementTree as E,re,copy
r=Path('/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies/assets/lecture-002');ns='{http://www.w3.org/2000/svg}';E.register_namespace('',ns[1:-1])
orig=E.parse(r/'http11-observation.svg').getroot()
for kind in ['observation','forecast']:
 root=copy.deepcopy(orig)
 if kind=='forecast':
  for el in list(root):
   y=float(el.get('y','0'))
   if el.tag==ns+'path':y=float(re.search(r'M\d+ (\d+)',el.get('d')).group(1))
   if 505<=y<=639:root.remove(el);continue
   if y>=659:
    if el.get('y'):el.set('y',str(y-154))
    if el.tag==ns+'path':el.set('d',re.sub(r'(M\d+ |L\d+ )(\d+)',lambda m:m[1]+str(int(m[2])-154),el.get('d')))
   t=el.text or ''
   d={'HTTP/1.1 — a complete observation request':'HTTP/1.1 — a complete forecast request','Teaching example from seminar 2: the mock acknowledges the observation; it does not store it.':'Teaching example from seminar 2: retrieving a ready forecast.','POST':'GET','/observations':'/offices/42/forecast?days=1','Host: 127.0.0.1:8001':'Host: 127.0.0.1:8000','{"office_id":42,"visitors":45}':'(no request body)','JSON request body':'No content sent in this request','GET example: /offices/42/forecast?days=1':'Headers: each field is written on its own line','Content-Length counts exactly 30 UTF-8 bytes here, with no trailing newline.':'Accept describes the desired response format, not a request body.'}
   el.text=d.get(t,t)
   if t=='/observations':el.set('font-size','25')
   if t=='HTTP/1.1' or (t=='Version' and y==180):el.set('x','820')
  root.set('height','846');root.set('viewBox','0 0 1600 846');root[0].set('height','846')
 for el in root.findall(ns+'text'):
  if 'Mono' not in el.get('font-family',''):continue
  t=el.text or '';el.text=None
  # Syntax colors from VS Code Light+; keep the existing annotated drawing.
  pat=r'"[^"\n]*"|\b(?:GET|POST|HTTP/1\.1|null|true|false)\b|\b\d+\b|^[A-Za-z-]+(?=:)' 
  last=0
  for m in re.finditer(pat,t):
   if m.start()>last:E.SubElement(el,ns+'tspan').text=t[last:m.start()]
   token=m[0];color='#098658' if token.isdigit() else '#0000FF'
   if token.startswith('"'):color='#0451A5' if t[m.end():].startswith(':') else '#A31515'
   elif m.start()==0 and t[m.end():].startswith(':'):color='#0451A5'
   e=E.SubElement(el,ns+'tspan',{'fill':color});e.text=token;last=m.end()
  if last<len(t):E.SubElement(el,ns+'tspan').text=t[last:]
 E.ElementTree(root).write(r/f'http11-{kind}-highlighted.svg',encoding='unicode')
