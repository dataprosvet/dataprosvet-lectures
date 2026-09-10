"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

from random import Random
from math import erf, sqrt, exp, pi

def normal_pdf(x, mu, sigma):
    return exp(-((x - mu) ** 2) / (2 * sigma**2)) / (sigma * sqrt(2 * pi))

def normal_family_svg(filename, curves, title):
    width, height = 900, 440
    left, top, plot_w, plot_h = 70, 60, 760, 300
    colors = ('#2563eb', '#dc2626', '#16a34a')
    parts = [f'\x3csvg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">',
             '\x3crect width="100%" height="100%" fill="white"/>',
             '\x3cstyle>text{font-family:Arial;font-size:15px}.title{font-size:20px;font-weight:bold}\x3c/style>',
             f'\x3ctext class="title" x="70" y="30">{title}\x3c/text>',
             f'\x3cline x1="{left}" y1="{top+plot_h}" x2="{left+plot_w}" y2="{top+plot_h}" stroke="black"/>',
             f'\x3cline x1="{left+plot_w/2}" y1="{top}" x2="{left+plot_w/2}" y2="{top+plot_h+15}" stroke="#94a3b8"/>']
    for index, (mu, sigma, label) in enumerate(curves):
        points = []
        for i in range(241):
            x = -6 + 12 * i / 240
            px = left + (x + 6) * plot_w / 12
            py = top + plot_h - normal_pdf(x, mu, sigma) * 330
            points.append(f'{px},{py}')
        color = colors[index]
        parts.append(f'\x3cpolyline points="{" ".join(points)}" fill="none" stroke="{color}" stroke-width="3"/>')
        parts.append(f'\x3cline x1="590" y1="{82+24*index}" x2="625" y2="{82+24*index}" stroke="{color}" stroke-width="3"/>')
        parts.append(f'\x3ctext x="635" y="{87+24*index}">{label}\x3c/text>')
    parts.append('\x3c/svg>')
    with open(filename, 'w', encoding='utf-8') as file:
        file.write('\n'.join(parts))

normal_family_svg(
    'lecture_8_normal_mean.svg',
    [(-2, 1, 'μ=-2, σ=1'), (0, 1, 'μ=0, σ=1'), (2, 1, 'μ=2, σ=1')],
    'Изменение среднего при фиксированном σ',
)
normal_family_svg(
    'lecture_8_normal_sigma.svg',
    [(0, 0.5, 'μ=0, σ=0,5'), (0, 1, 'μ=0, σ=1'), (0, 2, 'μ=0, σ=2')],
    'Изменение σ при фиксированном среднем',
)

rng = Random(20260808)
p = 0.3
series = 50_000

def normal_cdf(z):
    return 0.5 * (1 + erf(z / sqrt(2)))

def sample_means(n):
    return [sum(rng.random() < p for _ in range(n)) / n for _ in range(series)]

results = {}
for n in (1, 5, 30, 100):
    values = sample_means(n)
    mean = sum(values) / series
    variance = sum((x - mean) ** 2 for x in values) / series
    results[n] = values
    print(f"n={n:3d}: среднее={mean:.5f}, Var={variance:.6f}, теория Var={p*(1-p)/n:.6f}")

# Проверка ЦПТ для n=100: P(|Z| <= 1).
n = 100
sigma_mean = sqrt(p * (1 - p) / n)
inside = sum(abs((x - p) / sigma_mean) <= 1 for x in results[n]) / series
normal_inside = normal_cdf(1) - normal_cdf(-1)
print(f"P(|Z|<=1): опыт={inside:.5f}, N(0,1)={normal_inside:.5f}")

# SVG: распределения выборочных средних для n=5, 30 и 100.
W, H = 960, 480
parts = ['\x3csvg xmlns="http://www.w3.org/2000/svg" width="960" height="480">',
         '\x3crect width="100%" height="100%" fill="white"/>',
         '\x3cstyle>text{font-family:Arial;font-size:15px}.t{font-size:20px}\x3c/style>',
         '\x3ctext class="t" x="230" y="28">Распределение средних сжимается около p = 0,3\x3c/text>']
colors = {5: '#93c5fd', 30: '#60a5fa', 100: '#1d4ed8'}
for panel, n in enumerate((5, 30, 100)):
    left = 40 + panel * 310
    top, pw, ph = 70, 270, 320
    bins = [0] * 25
    for value in results[n]:
        index = min(24, int(value * 25))
        bins[index] += 1
    maximum = max(bins)
    for i, count in enumerate(bins):
        h = ph * count / maximum
        parts.append(f'\x3crect x="{left+i*pw/25}" y="{top+ph-h}" width="{pw/25-1}" height="{h}" fill="{colors[n]}"/>')
    parts.append(f'\x3cline x1="{left}" y1="{top+ph}" x2="{left+pw}" y2="{top+ph}" stroke="black"/>')
    parts.append(f'\x3ctext x="{left+105}" y="{top+ph+28}">n = {n}\x3c/text>')
parts.append('\x3c/svg>')
with open("lecture_8_lln_clt.svg", "w", encoding="utf-8") as file:
    file.write("\n".join(parts))

