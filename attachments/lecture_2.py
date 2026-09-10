"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

import math
import random
from pathlib import Path

# Фиксированное зерно делает эксперимент воспроизводимым.
rng = random.Random(42)

n_max = 100_000
exact_probability = 10 / 36
checkpoints = {10, 100, 1_000, 10_000, 100_000}

successes = 0
relative_frequency = []

for n in range(1, n_max + 1):
    die_1 = rng.randint(1, 6)
    die_2 = rng.randint(1, 6)
    if die_1 + die_2 <= 5:
        successes += 1
    relative_frequency.append(successes / n)

print(f"Точная вероятность: {exact_probability:.6f}")
for n in sorted(checkpoints):
    frequency = relative_frequency[n - 1]
    print(
        f"n={n:>6}: "
        f"W_n(A)={frequency:.6f}, "
        f"отклонение={frequency - exact_probability:+.6f}"
    )

# Строим автономный SVG-график без сторонних библиотек.
width, height = 900, 480
left, right, top, bottom = 75, 25, 45, 65
plot_width = width - left - right
plot_height = height - top - bottom
y_max = 0.6


def x_to_svg(n):
    """Логарифмическая шкала от 1 до n_max."""
    return left + math.log10(n) / math.log10(n_max) * plot_width


def y_to_svg(value):
    return top + (y_max - value) / y_max * plot_height


# Около 1 200 точек достаточно для гладкой линии и компактного файла.
sample_n = sorted(
    {
        max(1, round(math.exp(math.log(n_max) * i / 1_199)))
        for i in range(1_200)
    }
)
polyline = " ".join(
    f"{x_to_svg(n):.2f},{y_to_svg(relative_frequency[n - 1]):.2f}"
    for n in sample_n
)

exact_y = y_to_svg(exact_probability)
grid = []
for value in [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]:
    y = y_to_svg(value)
    grid.append(
        f'\x3cline x1="{left}" y1="{y:.2f}" x2="{width - right}" '
        f'y2="{y:.2f}" stroke="#d9dde3" />'
    )
    grid.append(
        f'\x3ctext x="{left - 12}" y="{y + 5:.2f}" text-anchor="end" '
        f'font-size="13">{value:.1f}\x3c/text>'
    )

ticks = []
for n in [1, 10, 100, 1_000, 10_000, 100_000]:
    x = x_to_svg(n)
    ticks.append(
        f'\x3cline x1="{x:.2f}" y1="{height - bottom}" x2="{x:.2f}" '
        f'y2="{height - bottom + 6}" stroke="#252a34" />'
    )
    ticks.append(
        f'\x3ctext x="{x:.2f}" y="{height - bottom + 24}" text-anchor="middle" '
        f'font-size="13">{n:,}\x3c/text>'
    )

svg = f"""\x3csvg xmlns="http://www.w3.org/2000/svg"
     width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  \x3crect width="100%" height="100%" fill="white" />
  \x3ctext x="{width / 2}" y="25" text-anchor="middle"
        font-family="sans-serif" font-size="20">
    Стабилизация относительной частоты
  \x3c/text>
  \x3cg font-family="sans-serif" fill="#252a34">
    {''.join(grid)}
    {''.join(ticks)}
    \x3cline x1="{left}" y1="{top}" x2="{left}" y2="{height - bottom}"
          stroke="#252a34" />
    \x3cline x1="{left}" y1="{height - bottom}" x2="{width - right}"
          y2="{height - bottom}" stroke="#252a34" />
    \x3cline x1="{left}" y1="{exact_y:.2f}" x2="{width - right}"
          y2="{exact_y:.2f}" stroke="#d1495b" stroke-width="2"
          stroke-dasharray="8 6" />
    \x3cpolyline points="{polyline}" fill="none" stroke="#3d8dff"
              stroke-width="1.5" />
    \x3ctext x="{width / 2}" y="{height - 15}" text-anchor="middle"
          font-size="14">Число испытаний n (логарифмическая шкала)\x3c/text>
    \x3ctext x="{width - right - 5}" y="{exact_y - 8:.2f}"
          text-anchor="end" font-size="13" fill="#d1495b">
      P(A) = 5/18
    \x3c/text>
  \x3c/g>
\x3c/svg>"""

output_path = Path("dice_frequency.svg")
output_path.write_text(svg, encoding="utf-8")
print(f"График сохранён: {output_path.resolve()}")

