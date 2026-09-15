from pathlib import Path
import re, html
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Preformatted, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parent
SRC=ROOT/'002_http-rest-openapi-data-contracts.md'
OUT=ROOT/'002_http-rest-openapi-data-contracts.pdf'
FONT=Path('/Users/ripper/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name,f in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Italic','DejaVuSans-Oblique.ttf'),('Mono','DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT/f)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Italic',boldItalic='Bold')
navy=HexColor('#122C44'); teal=HexColor('#0B777D'); muted=HexColor('#587082'); pale=HexColor('#EDF4F7')
styles={
'p':ParagraphStyle('p',fontName='Body',fontSize=9.8,leading=13.4,textColor=navy,spaceAfter=8),
'h1':ParagraphStyle('h1',fontName='Bold',fontSize=19,leading=24,textColor=navy,spaceAfter=14),
'h2':ParagraphStyle('h2',fontName='Bold',fontSize=12,leading=16,textColor=teal,spaceBefore=9,spaceAfter=8),
'cell':ParagraphStyle('cell',fontName='Body',fontSize=8.9,leading=12.4,textColor=navy),
'head':ParagraphStyle('head',fontName='Bold',fontSize=8.9,leading=12.4,textColor=white),
'code':ParagraphStyle('code',fontName='Mono',fontSize=8.1,leading=11,textColor=navy,backColor=pale,borderPadding=9,spaceBefore=4,spaceAfter=13),
}
def inline(t):
    t=html.escape(t)
    t=re.sub(r'\[([^\]]+)\]\((https?://[^ )]+)\)',lambda m:f'<a href="{m[2]}" color="#087880"><u>{m[1]}</u></a>',t)
    t=re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',t)
    t=re.sub(r'`([^`]+)`',r'<font name="Mono" size="9">\1</font>',t)
    return t
class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw):super().__init__(*a,**kw);self.states=[]
    def showPage(self):self.states.append(dict(self.__dict__));self._startPage()
    def save(self):
        total=len(self.states)
        for s in self.states:
            self.__dict__.update(s)
            self.setStrokeColor(HexColor('#D5E1E7'));self.line(44,43,551,43)
            self.setFillColor(muted);self.setFont('Body',8)
            self.drawString(44,29,'API-технологии • ПРБ • Методичка преподавателя')
            self.drawRightString(551,29,f'{self._pageNumber} / {total}')
            super().showPage()
        super().save()
def header(c,d):
    c.saveState();c.setFillColor(teal);c.rect(44,791,24,4,fill=1,stroke=0)
    c.setFont('Bold',8);c.drawString(77,790,'ЛЕКЦИЯ 02  /  HTTP · REST · DATA · OPENAPI')
    c.restoreState()
text=SRC.read_text().replace('−','-').replace('–','-').replace('—','-').replace('\u2011','-')
sections=text.split('---PAGE---');story=[]
for si,sec in enumerate(sections):
    lines=sec.strip().splitlines();i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line:i+=1;continue
        if line.startswith('```'):
            code=[];i+=1
            while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
            story.append(Preformatted('\n'.join(code),styles['code']));i+=1;continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                cells=[c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[: -]+',c) for c in cells):rows.append(cells)
                i+=1
            n=len(rows[0]);widths={2:[175,332],3:[112,183,212],4:[75,114,165,153]}.get(n,[507/n]*n)
            cells=[[Paragraph(inline(c),styles['head' if ri==0 else 'cell']) for c in row] for ri,row in enumerate(rows)]
            tab=Table(cells,colWidths=widths,hAlign='LEFT')
            tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),navy),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('ROWBACKGROUNDS',(0,1),(-1,-1),[pale,white]),('LINEBELOW',(0,-1),(-1,-1),0.5,HexColor('#D5E1E7'))]))
            story.extend([tab,Spacer(1,12)]);continue
        if line.startswith('# '):story.append(Paragraph(inline(line[2:]),styles['h1']));i+=1;continue
        if line.startswith('## '):story.append(Paragraph(inline(line[3:]),styles['h2']));i+=1;continue
        parts=[line];i+=1
        if not re.match(r'^(- |\d+\. )',line):
            while i<len(lines) and lines[i].strip() and not lines[i].startswith(('#','|','```','- ')):
                parts.append(lines[i].strip());i+=1
        para=' '.join(parts)
        if para.startswith('- '):para='• '+para[2:]
        story.append(Paragraph(inline(para),styles['p']))
    if si<len(sections)-1:story.append(PageBreak())
doc=SimpleDocTemplate(str(OUT),pagesize=(595.28,841.89),leftMargin=44,rightMargin=44,topMargin=64,bottomMargin=57,title='HTTP и контракты данных - методичка преподавателя',author='API-технологии / ПРБ')
doc.build(story,onFirstPage=header,onLaterPages=header,canvasmaker=NumberedCanvas)
r=PdfReader(str(OUT));print({'pages':len(r.pages),'sections':len(sections),'bytes':OUT.stat().st_size,'links':sum(len(p.get('/Annots',[])) for p in r.pages),'words_md':len(text.split())})
for i,p in enumerate(r.pages):
    t=p.extract_text();print(i+1,len(t),t.splitlines()[1:3])
assert len(r.pages)<=30
assert len(r.pages)==len(sections), 'An authored page overflowed; adjust layout.'
