"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

from math import comb
from random import Random

rng = Random(20260808)
n, p = 3, 0.2
repetitions = 200_000

exact = [comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n + 1)]
counts = [0] * (n + 1)

for _ in range(repetitions):
    x = sum(rng.random() < p for _ in range(n))
    counts[x] += 1

empirical = [count / repetitions for count in counts]
cdf = []
total = 0.0
for probability in exact:
    total += probability
    cdf.append(total)

print(" k | точно   | эксперимент | F(k)")
print("---+---------+-------------+------")
for k in range(n + 1):
    print(f" {k} | {exact[k]:.6f} | {empirical[k]:.6f}    | {cdf[k]:.6f}")

# Автономная иллюстрация без сторонних библиотек.
width, height = 900, 420
left, top, panel_w, panel_h = 70, 55, 330, 280

def px(k, offset):
    return offset + k * panel_w / n

def py(value):
    return top + panel_h * (1 - value)

parts = [
    f'\x3csvg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">',
    '\x3crect width="100%" height="100%" fill="white"/>',
    '\x3cstyle>text{font-family:Arial;font-size:15px}.title{font-size:19px;font-weight:bold}\x3c/style>',
    '\x3ctext class="title" x="70" y="28">Многоугольник распределения\x3c/text>',
    '\x3ctext class="title" x="500" y="28">Функция распределения\x3c/text>',
]

for offset in (left, 500):
    parts.append(f'\x3cline x1="{offset}" y1="{top+panel_h}" x2="{offset+panel_w}" y2="{top+panel_h}" stroke="black"/>')
    parts.append(f'\x3cline x1="{offset}" y1="{top}" x2="{offset}" y2="{top+panel_h}" stroke="black"/>')
    for k in range(n + 1):
        parts.append(f'\x3ctext x="{px(k, offset)-4}" y="{top+panel_h+25}">{k}\x3c/text>')

polygon = " ".join(f"{px(k, left)},{py(exact[k])}" for k in range(n + 1))
parts.append(f'\x3cpolyline points="{polygon}" fill="none" stroke="#2563eb" stroke-width="3"/>')
for k, probability in enumerate(exact):
    parts.append(f'\x3ccircle cx="{px(k, left)}" cy="{py(probability)}" r="5" fill="#2563eb"/>')

x0 = 500
for k, value in enumerate(cdf):
    current_x = px(k, x0)
    previous_value = 0 if k == 0 else cdf[k - 1]
    next_x = px(k + 1, x0) if k < n else x0 + panel_w
    current_y = py(value)
    parts.append(f'\x3cline x1="{current_x}" y1="{py(previous_value)}" x2="{current_x}" y2="{current_y}" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4"/>')
    parts.append(f'\x3cline x1="{current_x}" y1="{current_y}" x2="{next_x}" y2="{current_y}" stroke="#dc2626" stroke-width="3"/>')
    parts.append(f'\x3ccircle cx="{current_x}" cy="{current_y}" r="5" fill="#dc2626"/>')

parts.append('\x3c/svg>')
with open("lecture_5_distribution.svg", "w", encoding="utf-8") as file:
    file.write("\n".join(parts))

print("Создан файл lecture_5_distribution.svg")

