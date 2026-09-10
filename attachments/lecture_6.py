"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

from random import Random
from math import sqrt

rng = Random(20260808)
n = 200_000
xs = [rng.choice((-1.0, 0.0, 1.0)) for _ in range(n)]
ys = [x * x for x in xs]

def mean(values):
    return sum(values) / len(values)

def variance(values):
    m = mean(values)
    return sum((x - m) ** 2 for x in values) / len(values)

mx, my = mean(xs), mean(ys)
cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / n
corr = cov / sqrt(variance(xs) * variance(ys))

print(f"E[X] ≈ {mx:.5f}; E[Y] ≈ {my:.5f}")
print(f"Var(X) ≈ {variance(xs):.5f}; Var(Y) ≈ {variance(ys):.5f}")
print(f"Cov(X,Y) ≈ {cov:.5f}; Corr(X,Y) ≈ {corr:.5f}")
print("При этом Y = X²: зависимость функциональная.")

# Автономная диаграмма всех возможных пар.
points = [(-1, 1), (0, 0), (1, 1)]
parts = ['\x3csvg xmlns="http://www.w3.org/2000/svg" width="700" height="420">',
         '\x3crect width="100%" height="100%" fill="white"/>',
         '\x3cstyle>text{font-family:Arial;font-size:17px}\x3c/style>',
         '\x3cline x1="70" y1="340" x2="650" y2="340" stroke="black"/>',
         '\x3cline x1="350" y1="60" x2="350" y2="370" stroke="black"/>']
for x, y in points:
    cx, cy = 350 + 220 * x, 340 - 220 * y
    parts.append(f'\x3ccircle cx="{cx}" cy="{cy}" r="14" fill="#2563eb"/>')
    parts.append(f'\x3ctext x="{cx+18}" y="{cy-8}">({x}, {y})\x3c/text>')
parts += ['\x3ctext x="610" y="370">X\x3c/text>', '\x3ctext x="365" y="75">Y\x3c/text>',
          '\x3ctext x="170" y="30">Y = X²: зависимость есть, корреляция равна нулю\x3c/text>', '\x3c/svg>']
with open("lecture_6_dependence.svg", "w", encoding="utf-8") as file:
    file.write("\n".join(parts))
