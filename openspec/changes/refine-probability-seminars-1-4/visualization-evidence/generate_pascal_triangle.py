from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[4]
OUTPUT = ROOT / "assets" / "seminars" / "002-combinatorics" / "pascal-triangle.png"
MANIFEST = Path(__file__).with_name("pascal-triangle.json")
GRAYSCALE_OUTPUT = Path("/private/tmp/pascal-triangle-grayscale.png")
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_MATH = "/System/Library/Fonts/Supplemental/STIXTwoMath.otf"

WIDTH, HEIGHT = 2200, 1400
ROWS = 8
BACKGROUND = "#F1F5F8"
PANEL = "#FFFFFF"
FORMULA_PANEL = "#F7FAFC"
INK = "#183042"
MUTED = "#586A78"
CELL = "#D8EEEB"
CELL_BORDER = "#2A9D8F"
ACCENT = "#E76F51"
FORMULAS = {
    "биномиальный_коэффициент": r"\binom{n}{k}=\frac{n!}{k!(n-k)!}",
    "правило_паскаля": r"\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}",
    "бином_ньютона": r"(a+b)^n=\sum_{k=0}^{n}\binom{n}{k}a^{n-k}b^k",
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def math_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_MATH, size)


def text_width(draw: ImageDraw.ImageDraw, value: str, used_font: ImageFont.FreeTypeFont) -> float:
    box = draw.textbbox((0, 0), value, font=used_font)
    return box[2] - box[0]


def draw_fraction(
    draw: ImageDraw.ImageDraw,
    center_x: float,
    center_y: float,
    numerator: str,
    denominator: str,
    used_font: ImageFont.FreeTypeFont,
) -> None:
    numerator_width = text_width(draw, numerator, used_font)
    denominator_width = text_width(draw, denominator, used_font)
    width = max(numerator_width, denominator_width) + 32
    draw.text((center_x, center_y - 42), numerator, font=used_font, fill=INK, anchor="mm")
    draw.line((center_x - width / 2, center_y, center_x + width / 2, center_y), fill=INK, width=4)
    draw.text((center_x, center_y + 49), denominator, font=used_font, fill=INK, anchor="mm")


def draw_binomial_theorem(draw: ImageDraw.ImageDraw, x: float, y: float) -> None:
    base = math_font(48)
    superscript = math_font(27)

    first = "(a + b)"
    draw.text((x, y), first, font=base, fill=INK)
    cursor = x + text_width(draw, first, base)
    draw.text((cursor + 3, y - 17), "n", font=superscript, fill=INK)
    cursor += 38

    equals = " = "
    draw.text((cursor, y), equals, font=base, fill=INK)
    cursor += text_width(draw, equals, base)

    sigma_center = cursor + 55
    draw.text((sigma_center, y + 30), "∑", font=math_font(76), fill=INK, anchor="mm")
    draw.text((sigma_center, y - 28), "n", font=superscript, fill=INK, anchor="mm")
    draw.text((sigma_center, y + 78), "k = 0", font=math_font(23), fill=INK, anchor="mm")
    cursor += 112

    coefficient = "C(n, k) "
    draw.text((cursor, y), coefficient, font=base, fill=INK)
    cursor += text_width(draw, coefficient, base)

    draw.text((cursor, y), "a", font=base, fill=INK)
    cursor += text_width(draw, "a", base)
    exponent = "n − k"
    draw.text((cursor + 2, y - 17), exponent, font=superscript, fill=INK)
    cursor += text_width(draw, exponent, superscript) + 10

    draw.text((cursor, y), "b", font=base, fill=INK)
    cursor += text_width(draw, "b", base)
    draw.text((cursor + 2, y - 17), "k", font=superscript, fill=INK)


triangle = [[math.comb(n, k) for k in range(n + 1)] for n in range(ROWS)]
for n, row in enumerate(triangle):
    assert row[0] == row[-1] == 1
    assert row == [math.comb(n, k) for k in range(n + 1)]
    for k in range(1, n):
        assert row[k] == triangle[n - 1][k - 1] + triangle[n - 1][k]

assert FORMULAS == {
    "биномиальный_коэффициент": r"\binom{n}{k}=\frac{n!}{k!(n-k)!}",
    "правило_паскаля": r"\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}",
    "бином_ньютона": r"(a+b)^n=\sum_{k=0}^{n}\binom{n}{k}a^{n-k}b^k",
}

image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
draw = ImageDraw.Draw(image, "RGBA")
draw.text((80, 55), "Треугольник Паскаля", font=font(54, True), fill=INK)
draw.text(
    (82, 128),
    "Числовая схема и формулы биномиальных коэффициентов на общем поле",
    font=font(29),
    fill=MUTED,
)

triangle_panel = (60, 220, 1210, 1320)
formula_panel = (1250, 220, 2140, 1320)
draw.rounded_rectangle(triangle_panel, 30, fill=PANEL, outline="#D7E1E8", width=3)
draw.rounded_rectangle(formula_panel, 30, fill=FORMULA_PANEL, outline="#D7E1E8", width=3)

draw.text((110, 275), "Числовой треугольник", font=font(33, True), fill=INK)
draw.text((1300, 275), "Общие формулы", font=font(33, True), fill=INK)

center_x = 665
top_y = 390
step_x = 120
step_y = 104
radius = 37

positions: dict[tuple[int, int], tuple[float, float]] = {}
for n, row in enumerate(triangle):
    y = top_y + n * step_y
    draw.text((145, y), f"n = {n}", font=font(24), fill=MUTED, anchor="mm")
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
        draw.text((x, y), str(value), font=font(25, True), fill=INK, anchor="mm")

draw.rounded_rectangle((110, 1190, 1160, 1270), 18, fill="#FFF4DC", outline="#E9C46A", width=3)
draw.text(
    (635, 1230),
    "Каждое внутреннее число равно сумме двух чисел над ним",
    font=font(24, True),
    fill=INK,
    anchor="mm",
)

formula_blocks = ((1295, 350, 2095, 580), (1295, 620, 2095, 850), (1295, 890, 2095, 1245))
for block in formula_blocks:
    draw.rounded_rectangle(block, 22, fill="#FFFFFF", outline="#D7E1E8", width=2)

draw.text((1340, 390), "Биномиальный коэффициент", font=font(25, True), fill=MUTED)
prefix_font = math_font(53)
draw.text((1375, 495), "C(n, k) =", font=prefix_font, fill=INK, anchor="lm")
draw_fraction(draw, 1860, 495, "n!", "k! (n − k)!", math_font(47))

draw.text((1340, 660), "Рекуррентное правило Паскаля", font=font(25, True), fill=MUTED)
draw.text(
    (1695, 755),
    "C(n, k) = C(n − 1, k − 1) + C(n − 1, k)",
    font=math_font(40),
    fill=INK,
    anchor="mm",
)

draw.text((1340, 930), "Бином Ньютона", font=font(25, True), fill=MUTED)
draw_binomial_theorem(draw, 1370, 1035)
draw.text(
    (1695, 1195),
    "Коэффициенты разложения образуют строку n",
    font=font(23),
    fill=MUTED,
    anchor="mm",
)

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
    "формулы": FORMULAS,
    "видимые_заголовки": [
        "Числовой треугольник",
        "Общие формулы",
        "Биномиальный коэффициент",
        "Рекуррентное правило Паскаля",
        "Бином Ньютона",
    ],
    "правило_проверки": "C(n,k) = C(n-1,k-1) + C(n-1,k)",
    "ширина": WIDTH,
    "высота": HEIGHT,
    "байты": OUTPUT.stat().st_size,
    "sha256": hashlib.sha256(data).hexdigest(),
}
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
ImageOps.grayscale(image).save(GRAYSCALE_OUTPUT, "PNG", optimize=True)
print(f"Создан {OUTPUT.relative_to(ROOT)}: {WIDTH}x{HEIGHT}, {OUTPUT.stat().st_size} байт")
print("Проверены числа треугольника, три формулы, PNG-лимиты и manifest")
