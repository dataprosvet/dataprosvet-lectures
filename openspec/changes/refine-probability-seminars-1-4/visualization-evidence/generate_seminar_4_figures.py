from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[4]
OUTPUT_DIR = ROOT / "assets" / "seminars" / "004-geometric-probability"
MANIFEST = Path(__file__).with_name("seminar-4-figures.json")
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

WIDTH = 1600
HEIGHT = 1100
BACKGROUND = "#FBFCFE"
INK = "#183042"
MUTED = "#586A78"
GRID = "#CCD7DF"
TOTAL = "#467A9F"
FAVORABLE = "#2A9D8F"
BOUNDARY = "#D35D4B"
ACCENT = "#E9C46A"
WHITE = "#FFFFFF"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


TITLE_FONT = font(48, True)
SUBTITLE_FONT = font(27)
LABEL_FONT = font(27)
SMALL_FONT = font(23)
TICK_FONT = font(22)


def polygon_area(points: list[tuple[float, float]]) -> float:
    return abs(sum(
        x1 * y2 - x2 * y1
        for (x1, y1), (x2, y2) in zip(points, points[1:] + points[:1])
    )) / 2


class Figure:
    def __init__(self, filename: str, title: str, subtitle: str):
        self.filename = filename
        self.image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
        self.draw = ImageDraw.Draw(self.image, "RGBA")
        self.labels: list[str] = []
        self.text(title, (80, 55), TITLE_FONT, INK)
        self.text(subtitle, (82, 122), SUBTITLE_FONT, MUTED)

    def text(
        self,
        value: str,
        xy: tuple[float, float],
        text_font: ImageFont.FreeTypeFont = LABEL_FONT,
        fill: str = INK,
        anchor: str | None = None,
    ) -> None:
        self.labels.append(value)
        self.draw.text(xy, value, font=text_font, fill=fill, anchor=anchor)

    def save(self, expected_labels: list[str], geometry: dict) -> dict:
        missing = sorted(set(expected_labels) - set(self.labels))
        if missing:
            raise AssertionError(f"{self.filename}: отсутствуют подписи {missing}")
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        output = OUTPUT_DIR / self.filename
        self.image.save(output, "PNG", optimize=True, dpi=(200, 200))
        data = output.read_bytes()
        if not data.startswith(b"\x89PNG\r\n\x1a\n"):
            raise AssertionError(f"{self.filename}: неверная PNG-сигнатура")
        with Image.open(output) as check:
            if check.size != (WIDTH, HEIGHT):
                raise AssertionError(f"{self.filename}: неверный размер {check.size}")
            if check.mode not in {"RGB", "RGBA"}:
                raise AssertionError(f"{self.filename}: неверный цветовой режим {check.mode}")
        if output.stat().st_size >= 5 * 1024 * 1024:
            raise AssertionError(f"{self.filename}: файл превышает 5 MiB")
        return {
            "файл": str(output.relative_to(ROOT)),
            "ширина": WIDTH,
            "высота": HEIGHT,
            "байты": output.stat().st_size,
            "sha256": hashlib.sha256(data).hexdigest(),
            "подписи": expected_labels,
            "геометрия": geometry,
        }


def legend(fig: Figure, y: int = 1000) -> None:
    fig.draw.rounded_rectangle((455, y - 15, 515, y + 15), 8, fill=FAVORABLE + "90")
    fig.text("благоприятная область", (530, y), SMALL_FONT, INK, "lm")
    fig.draw.line((860, y, 920, y), fill=BOUNDARY, width=5)
    fig.text("граница условия", (935, y), SMALL_FONT, INK, "lm")


def draw_segment(filename: str, title: str, total_end: int, favorable_start: int, favorable_end: int) -> dict:
    assert 0 <= favorable_start < favorable_end <= total_end
    fig = Figure(filename, title, "Равномерный выбор точки на отрезке")
    x0, x1, y = 200, 1400, 585

    def px(value: float) -> float:
        return x0 + (value / total_end) * (x1 - x0)

    fig.draw.line((x0, y, x1, y), fill=TOTAL, width=12)
    fig.draw.line((px(favorable_start), y, px(favorable_end), y), fill=FAVORABLE, width=28)
    ticks = sorted({0, favorable_start, favorable_end, total_end})
    for value in ticks:
        x = px(value)
        fig.draw.line((x, y - 34, x, y + 34), fill=INK, width=5)
        fig.draw.ellipse((x - 9, y - 9, x + 9, y + 9), fill=WHITE, outline=INK, width=4)
        fig.text(str(value), (x, y + 62), TICK_FONT, INK, "ma")
    interval = f"[{favorable_start}; {favorable_end}]"
    total = f"[0; {total_end}]"
    fig.text(f"благоприятный отрезок {interval}", ((px(favorable_start) + px(favorable_end)) / 2, y - 90), LABEL_FONT, FAVORABLE, "ma")
    fig.text(f"весь отрезок {total}", ((x0 + x1) / 2, y + 145), LABEL_FONT, TOTAL, "ma")
    length_total = total_end
    length_favorable = favorable_end - favorable_start
    return fig.save(
        [str(value) for value in ticks] + [f"благоприятный отрезок {interval}", f"весь отрезок {total}"],
        {
            "тип": "отрезок",
            "общая_длина": length_total,
            "благоприятная_длина": length_favorable,
            "границы": [0, total_end, favorable_start, favorable_end],
        },
    )


def draw_circle_square() -> dict:
    fig = Figure("task-02-circle-inscribed-square.png", "Задача 2. Круг и вписанный квадрат", "Точка равномерно выбирается внутри круга радиуса 1")
    cx, cy, radius = 720, 585, 340
    box = (cx - radius, cy - radius, cx + radius, cy + radius)
    square = [(cx, cy - radius), (cx + radius, cy), (cx, cy + radius), (cx - radius, cy)]
    fig.draw.ellipse(box, fill=TOTAL + "28", outline=TOTAL, width=7)
    fig.draw.polygon(square, fill=FAVORABLE + "90", outline=FAVORABLE)
    fig.draw.line((cx - radius, cy, cx + radius, cy), fill=BOUNDARY, width=5)
    fig.draw.line((cx, cy, cx + radius, cy), fill=INK, width=4)
    fig.text("R = 1", (cx + radius / 2, cy - 22), LABEL_FONT, INK, "ma")
    fig.text("диагональ квадрата d = 2", (720, 965), LABEL_FONT, BOUNDARY, "ma")
    fig.text("круг — пространство исходов", (1135, 420), SMALL_FONT, TOTAL, "lm")
    fig.text("квадрат — благоприятная область", (1135, 520), SMALL_FONT, FAVORABLE, "lm")
    assert math.isclose(polygon_area(square), 2 * radius * radius)
    return fig.save(
        ["R = 1", "диагональ квадрата d = 2", "круг — пространство исходов", "квадрат — благоприятная область"],
        {"тип": "круг_и_квадрат", "радиус": 1, "диагональ_квадрата": 2, "площадь_квадрата": 2},
    )


def draw_annulus() -> dict:
    fig = Figure("task-04-annulus.png", "Задача 4. Кольцо", "Благоприятная область между окружностями радиусов 1 и 2")
    cx, cy, outer, inner = 760, 590, 360, 180
    fig.draw.ellipse((cx - outer, cy - outer, cx + outer, cy + outer), fill=FAVORABLE + "90", outline=TOTAL, width=7)
    fig.draw.ellipse((cx - inner, cy - inner, cx + inner, cy + inner), fill=BACKGROUND, outline=BOUNDARY, width=6)
    fig.draw.line((cx, cy, cx + outer, cy), fill=INK, width=4)
    fig.draw.line((cx, cy, cx + inner, cy), fill=BOUNDARY, width=5)
    fig.text("R = 2", (cx + (outer + inner) / 2, cy - 25), LABEL_FONT, INK, "ma")
    fig.text("r = 1", (cx + inner / 2, cy + 45), LABEL_FONT, BOUNDARY, "ma")
    fig.text("кольцо — благоприятная область", (760, 1010), LABEL_FONT, FAVORABLE, "ma")
    return fig.save(
        ["R = 2", "r = 1", "кольцо — благоприятная область"],
        {"тип": "кольцо", "внешний_радиус": 2, "внутренний_радиус": 1, "площадь_кольца_в_единицах_pi": 3},
    )


def draw_meeting(filename: str, title: str, wait: int) -> dict:
    assert 0 < wait < 60
    fig = Figure(filename, title, f"Каждая координата — время прихода в минутах; ожидание {wait} минут")
    left, top, size = 380, 225, 720
    right, bottom = left + size, top + size

    def point(x: float, y: float) -> tuple[float, float]:
        return left + x / 60 * size, bottom - y / 60 * size

    band = [(0, 0), (wait, 0), (60, 60 - wait), (60, 60), (60 - wait, 60), (0, wait)]
    band_px = [point(x, y) for x, y in band]
    fig.draw.rectangle((left, top, right, bottom), fill=WHITE, outline=TOTAL, width=7)
    for tick in (0, 10, 20, 30, 40, 50, 60):
        x, _ = point(tick, 0)
        _, y = point(0, tick)
        fig.draw.line((x, bottom, x, bottom + 13), fill=INK, width=3)
        fig.draw.line((left - 13, y, left, y), fill=INK, width=3)
        fig.text(str(tick), (x, bottom + 35), TICK_FONT, INK, "ma")
        fig.text(str(tick), (left - 25, y), TICK_FONT, INK, "rm")
    fig.draw.polygon(band_px, fill=FAVORABLE + "90")
    fig.draw.line((*point(0, 0), *point(60, 60)), fill=INK, width=4)
    fig.draw.line((*point(0, wait), *point(60 - wait, 60)), fill=BOUNDARY, width=5)
    fig.draw.line((*point(wait, 0), *point(60, 60 - wait)), fill=BOUNDARY, width=5)
    fig.draw.rectangle((left, top, right, bottom), outline=TOTAL, width=7)
    fig.text("x — приход первого", ((left + right) / 2, bottom + 82), SMALL_FONT, INK, "ma")
    fig.text("y — приход второго", (left, top - 42), SMALL_FONT, INK, "ls")
    condition = f"|x − y| ≤ {wait}"
    fig.text(condition, (1290, 430), LABEL_FONT, FAVORABLE, "mm")
    fig.text(f"y = x + {wait}", (1285, 525), SMALL_FONT, BOUNDARY, "mm")
    fig.text(f"y = x − {wait}", (1285, 595), SMALL_FONT, BOUNDARY, "mm")
    legend(fig, 1015)
    expected_area = 60 * 60 - (60 - wait) ** 2
    assert math.isclose(polygon_area(band), expected_area)
    return fig.save(
        ["x — приход первого", "y — приход второго", condition, f"y = x + {wait}", f"y = x − {wait}", "благоприятная область", "граница условия"],
        {
            "тип": "задача_о_встрече",
            "квадрат": [0, 60, 0, 60],
            "время_ожидания": wait,
            "неравенство": condition,
            "площадь_благоприятной_области": expected_area,
            "многоугольник": band,
        },
    )


def draw_two_numbers() -> dict:
    fig = Figure("task-06-two-numbers.png", "Задача 6. Два числа из отрезка", "Условия: x + y ≤ 1 и y ≥ x в единичном квадрате")
    left, top, size = 390, 220, 720
    right, bottom = left + size, top + size

    def point(x: float, y: float) -> tuple[float, float]:
        return left + x * size, bottom - y * size

    region = [(0, 0), (0, 1), (0.5, 0.5)]
    fig.draw.rectangle((left, top, right, bottom), fill=WHITE, outline=TOTAL, width=7)
    fig.draw.polygon([point(x, y) for x, y in region], fill=FAVORABLE + "90")
    fig.draw.line((*point(0, 0), *point(1, 1)), fill=BOUNDARY, width=5)
    fig.draw.line((*point(0, 1), *point(1, 0)), fill=INK, width=5)
    fig.draw.rectangle((left, top, right, bottom), outline=TOTAL, width=7)
    for value in (0, 0.5, 1):
        x, _ = point(value, 0)
        _, y = point(0, value)
        label = str(value).replace("0.5", "1/2")
        fig.draw.line((x, bottom, x, bottom + 14), fill=INK, width=3)
        fig.draw.line((left - 14, y, left, y), fill=INK, width=3)
        fig.text(label, (x, bottom + 38), TICK_FONT, INK, "ma")
        fig.text(label, (left - 25, y), TICK_FONT, INK, "rm")
    fig.text("x", (right + 35, bottom), LABEL_FONT, INK, "lm")
    fig.text("y", (left, top - 35), LABEL_FONT, INK, "ms")
    fig.text("y = x", (1195, 405), LABEL_FONT, BOUNDARY, "mm")
    fig.text("x + y = 1", (1215, 505), LABEL_FONT, INK, "mm")
    fig.text("x + y ≤ 1,  y ≥ x", (1230, 650), LABEL_FONT, FAVORABLE, "mm")
    legend(fig, 1015)
    assert math.isclose(polygon_area(region), 0.25)
    return fig.save(
        ["x", "y", "y = x", "x + y = 1", "x + y ≤ 1,  y ≥ x", "благоприятная область", "граница условия"],
        {
            "тип": "область_в_единичном_квадрате",
            "неравенства": ["x + y ≤ 1", "y ≥ x"],
            "вершины": region,
            "площадь": 0.25,
        },
    )


def draw_square_circle() -> dict:
    fig = Figure("home-task-02-square-inscribed-circle.png", "Домашняя задача 2. Круг в квадрате", "Квадрат имеет сторону 2; вписанная окружность имеет радиус 1")
    left, top, size = 390, 225, 720
    right, bottom = left + size, top + size
    fig.draw.rectangle((left, top, right, bottom), fill=TOTAL + "25", outline=TOTAL, width=7)
    fig.draw.ellipse((left, top, right, bottom), fill=FAVORABLE + "90", outline=FAVORABLE, width=7)
    fig.draw.line((left, bottom + 35, right, bottom + 35), fill=INK, width=4)
    fig.draw.line((left, bottom + 20, left, bottom + 50), fill=INK, width=4)
    fig.draw.line((right, bottom + 20, right, bottom + 50), fill=INK, width=4)
    fig.draw.line(((left + right) / 2, (top + bottom) / 2, right, (top + bottom) / 2), fill=BOUNDARY, width=5)
    fig.text("a = 2", ((left + right) / 2, bottom + 72), LABEL_FONT, INK, "ma")
    fig.text("R = 1", ((left + 3 * right) / 4, (top + bottom) / 2 - 25), LABEL_FONT, BOUNDARY, "ma")
    fig.text("круг — благоприятная область", (1510, 455), SMALL_FONT, FAVORABLE, "rm")
    fig.text("квадрат — пространство исходов", (1510, 555), SMALL_FONT, TOTAL, "rm")
    return fig.save(
        ["a = 2", "R = 1", "круг — благоприятная область", "квадрат — пространство исходов"],
        {"тип": "круг_в_квадрате", "сторона_квадрата": 2, "радиус_круга": 1},
    )


def contact_sheet(paths: list[Path], output: Path, grayscale: bool = False) -> None:
    thumb_w, thumb_h = 500, 340
    sheet = Image.new("RGB", (thumb_w * 3, (thumb_h + 45) * 3), WHITE)
    draw = ImageDraw.Draw(sheet)
    caption_font = font(18)
    for index, source in enumerate(paths):
        with Image.open(source) as image:
            image = image.convert("L").convert("RGB") if grayscale else image.convert("RGB")
            image.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            x = (index % 3) * thumb_w + (thumb_w - image.width) // 2
            y = (index // 3) * (thumb_h + 45)
            sheet.paste(image, (x, y))
            draw.text(((index % 3) * thumb_w + 15, y + thumb_h + 8), source.name, font=caption_font, fill=INK)
    sheet.save(output, "PNG", optimize=True)


def main() -> None:
    records = [
        draw_segment("task-01-segment.png", "Задача 1. Точка на отрезке", 10, 3, 7),
        draw_circle_square(),
        draw_meeting("task-03-meeting-15.png", "Задача 3. Задача о встрече", 15),
        draw_annulus(),
        draw_meeting("task-05-meeting-10.png", "Задача 5. Встреча", 10),
        draw_two_numbers(),
        draw_segment("home-task-01-segment.png", "Домашняя задача 1. Точка на отрезке", 5, 1, 3),
        draw_square_circle(),
        draw_meeting("home-task-03-meeting-10.png", "Домашняя задача 3. Задача о встрече", 10),
    ]
    if len({record["файл"] for record in records}) != 9:
        raise AssertionError("Ожидалось девять уникальных изображений")
    MANIFEST.write_text(json.dumps({"изображения": records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    paths = [ROOT / record["файл"] for record in records]
    contact_sheet(paths, Path("/private/tmp/seminar-4-figures-contact.png"))
    contact_sheet(paths, Path("/private/tmp/seminar-4-figures-contact-grayscale.png"), grayscale=True)
    print(f"Создано изображений: {len(records)}")
    for record in records:
        print(f"{record['файл']}: {record['ширина']}x{record['высота']}, {record['байты']} байт")


if __name__ == "__main__":
    main()
