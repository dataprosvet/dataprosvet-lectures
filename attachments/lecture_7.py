"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

from random import Random
from math import sqrt, exp

rng = Random(20260808)
n = 300_000
sample = [(-5 + sqrt(9 + 112 * rng.random())) / 2 for _ in range(n)]

emp_p = sum(0 < x < 2.7 for x in sample) / n
emp_mean = sum(sample) / n
emp_var = sum((x - emp_mean) ** 2 for x in sample) / n

print(f"P(0\x3cX<2.7): теория=0.742500, опыт={emp_p:.6f}")
print(f"E[X]: теория={29/21:.6f}, опыт={emp_mean:.6f}")
print(f"Var(X): теория={524/441:.6f}, опыт={emp_var:.6f}")

# SVG: плотность, F и закрашенная вероятность.
W, H = 900, 420
def sx(x, left): return left + (x + 1) * 90
def sy(y): return 340 - y * 260
parts = ['\x3csvg xmlns="http://www.w3.org/2000/svg" width="900" height="420">',
         '\x3crect width="100%" height="100%" fill="white"/>',
         '\x3cstyle>text{font-family:Arial;font-size:17px}\x3c/style>',
         '\x3ctext x="100" y="30">Плотность и площадь P(0&lt;X&lt;2,7)\x3c/text>',
         '\x3ctext x="575" y="30">Функция распределения\x3c/text>']
left = 70
parts.append(f'\x3cpolygon points="{sx(0,left)},340 {sx(0,left)},{sy(5/28)} {sx(2.7,left)},{sy(10.4/28)} {sx(2.7,left)},340" fill="#93c5fd" opacity="0.7"/>')
parts.append(f'\x3cline x1="{sx(-1,left)}" y1="{sy(3/28)}" x2="{sx(3,left)}" y2="{sy(11/28)}" stroke="#2563eb" stroke-width="4"/>')
right = 500
pts=[]
for i in range(81):
    x=-1+4*i/80
    F=(x*x+5*x+4)/28
    pts.append(f"{sx(x,right)},{sy(F)}")
parts.append(f'\x3cpolyline points="{" ".join(pts)}" fill="none" stroke="#dc2626" stroke-width="4"/>')
parts.append('\x3c/svg>')
with open("lecture_7_density.svg", "w", encoding="utf-8") as file:
    file.write("\n".join(parts))

# SVG: пары f/F для U(0,1) и Exp(1).
W, H = 960, 620
parts = [f'\x3csvg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}">',
         '\x3crect width="100%" height="100%" fill="white"/>',
         '\x3cstyle>text{font-family:Arial;font-size:15px}.title{font-size:18px;font-weight:bold}\x3c/style>']

def panel(left, top, title):
    parts.append(f'\x3ctext class="title" x="{left}" y="{top-18}">{title}\x3c/text>')
    parts.append(f'\x3cline x1="{left}" y1="{top+210}" x2="{left+380}" y2="{top+210}" stroke="black"/>')
    parts.append(f'\x3cline x1="{left}" y1="{top+10}" x2="{left}" y2="{top+225}" stroke="black"/>')

def mapx(x, left): return left + x * 110
def mapy(y, top): return top + 210 - y * 170

panel(60, 60, "U(0,1): плотность f")
parts += ['\x3cpolyline points="60,270 60,100 170,100 170,270" fill="none" stroke="#2563eb" stroke-width="4"/>',
          '\x3ctext x="54" y="292">0\x3c/text>', '\x3ctext x="166" y="292">1\x3c/text>']

panel(540, 60, "U(0,1): функция F")
parts += ['\x3cpolyline points="540,270 650,100 850,100" fill="none" stroke="#dc2626" stroke-width="4"/>',
          '\x3ctext x="534" y="292">0\x3c/text>', '\x3ctext x="646" y="292">1\x3c/text>']

panel(60, 365, "Exp(1): плотность f")
pts = [f'{mapx(3*i/100,60)},{mapy(exp(-3*i/100),365)}' for i in range(101)]
parts.append(f'\x3cpolyline points="{" ".join(pts)}" fill="none" stroke="#2563eb" stroke-width="4"/>')

panel(540, 365, "Exp(1): функция F")
pts = [f'{mapx(3*i/100,540)},{mapy(1-exp(-3*i/100),365)}' for i in range(101)]
parts.append(f'\x3cpolyline points="{" ".join(pts)}" fill="none" stroke="#dc2626" stroke-width="4"/>')
parts.append('\x3c/svg>')
with open("lecture_7_standard_distributions.svg", "w", encoding="utf-8") as file:
    file.write("\n".join(parts))
