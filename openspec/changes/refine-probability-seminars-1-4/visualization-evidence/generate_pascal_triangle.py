from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[4]
OUTPUT = ROOT / "assets" / "seminars" / "002-combinatorics" / "pascal-triangle.png"
MANIFEST = Path(__file__).with_name("pascal-triangle.json")
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

WIDTH, HEIGHT = 1600, 1200
ROWS = 8
BACKGROUND = "#FBFCFE"
INK = "#183042"
MUTED = "#586A78"
CELL = "#D8EEEB"
CELL_BORDER = "#2A9D8F"
ACCENT = "#E76F51"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


triangle = [[math.comb(n, k) for k in range(n + 1)] for n in range(ROWS)]
for n, row in enumerate(triangle):
    assert row[0] == row[-1] == 1
    for k in range(1, n):
        assert row[k] == triangle[n - 1][k - 1] + triangle[n - 1][k]

image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
draw = ImageDraw.Draw(image, "RGBA")
draw.text((80, 55), "Треугольник Паскаля", font=font(52, True), fill=INK)
draw.text((82, 125), "Строка n содержит биномиальные коэффициенты C(n, 0), …, C(n, n)", font=font(28), fill=MUTED)

center_x = 800
top_y = 245
step_x = 145
step_y = 112
radius = 42

positions: dict[tuple[int, int], tuple[float, float]] = {}
for n, row in enumerate(triangle):
    y = top_y + n * step_y
    draw.text((135, y), f"n = {n}", font=font(25), fill=MUTED, anchor="mm")
    for k, value in enumerate(row):
        x = center_x + (k - n / 2) * step_x
        positions[(n, k)] = (x, y)

for n in range(1, ROWS):
    for k in range(n + 1):
        x, y = positions[(n, k)]
        if k > 0:
            px, py = positions[(n - 1, k - 1)]
            draw.line((px, py + radius, x, y - radius), fill=ACCENT + "70", width=4)
        if k < n:
            px, py = positions[(n - 1, k)]
            draw.line((px, py + radius, x, y - radius), fill=ACCENT + "70", width=4)

for n, row in enumerate(triangle):
    for k, value in enumerate(row):
        x, y = positions[(n, k)]
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=CELL, outline=CELL_BORDER, width=5)
        draw.text((x, y), str(value), font=font(28, True), fill=INK, anchor="mm")

draw.rounded_rectangle((250, 1080, 1350, 1150), 18, fill="#FFF4DC", outline="#E9C46A", width=3)
draw.text((800, 1115), "Каждое внутреннее число равно сумме двух чисел над ним", font=font(27, True), fill=INK, anchor="mm")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT, "PNG", optimize=True, dpi=(200, 200))
data = OUTPUT.read_bytes()
assert data.startswith(b"\x89PNG\r\n\x1a\n")
with Image.open(OUTPUT) as check:
    assert check.size == (WIDTH, HEIGHT)
    assert check.width <= 4096 and check.height <= 4096
    assert check.width * check.height <= 16_000_000
assert OUTPUT.stat().st_size < 5 * 1024 * 1024

manifest = {
    "файл": str(OUTPUT.relative_to(ROOT)),
    "строк": ROWS,
    "значения": triangle,
    "правило_проверки": "C(n,k) = C(n-1,k-1) + C(n-1,k)",
    "ширина": WIDTH,
    "высота": HEIGHT,
    "байты": OUTPUT.stat().st_size,
    "sha256": hashlib.sha256(data).hexdigest(),
}
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
ImageOps.grayscale(image).save("/private/tmp/pascal-triangle-grayscale.png", "PNG", optimize=True)
print(f"Создан {OUTPUT.relative_to(ROOT)}: {WIDTH}x{HEIGHT}, {OUTPUT.stat().st_size} байт")
print("Проверены граничные единицы, биномиальные коэффициенты и сумма соседних элементов")
