from __future__ import annotations

import hashlib
import json
import math
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[4]
MANIFEST = Path(__file__).with_name("pascal-triangle.json")
PUBLIC_SEMINAR = ROOT / "seminars" / "002_combinations-and-permutations-with-repetitions.md"
TEACHER_SEMINAR = ROOT / "lectures-teacher" / "seminars" / "002_combinations-and-permutations-with-repetitions.md"
EXPECTED_FORMULAS = {
    "биномиальный_коэффициент": r"\binom{n}{k}=\frac{n!}{k!(n-k)!}",
    "правило_паскаля": r"\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}",
    "бином_ньютона": r"(a+b)^n=\sum_{k=0}^{n}\binom{n}{k}a^{n-k}b^k",
}
EXPECTED_HEADINGS = {
    "Числовой треугольник",
    "Общие формулы",
    "Биномиальный коэффициент",
    "Рекуррентное правило Паскаля",
    "Бином Ньютона",
}


manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
image_path = ROOT / manifest["файл"]
data = image_path.read_bytes()

assert data.startswith(b"\x89PNG\r\n\x1a\n")
assert hashlib.sha256(data).hexdigest() == manifest["sha256"]
assert image_path.stat().st_size == manifest["байты"] < 5 * 1024 * 1024
assert manifest["формулы"] == EXPECTED_FORMULAS
assert set(manifest["видимые_заголовки"]) == EXPECTED_HEADINGS

triangle = manifest["значения"]
assert len(triangle) == manifest["строк"] == 8
for n, row in enumerate(triangle):
    assert row == [math.comb(n, k) for k in range(n + 1)]
    assert row[0] == row[-1] == 1
    for k in range(1, n):
        assert row[k] == triangle[n - 1][k - 1] + triangle[n - 1][k]

with Image.open(image_path) as image:
    assert image.format == "PNG"
    assert image.size == (manifest["ширина"], manifest["высота"])
    assert image.width <= 4096 and image.height <= 4096
    assert image.width * image.height <= 16_000_000

references = (
    (PUBLIC_SEMINAR, "../assets/seminars/002-combinatorics/pascal-triangle.png"),
    (TEACHER_SEMINAR, "../../assets/seminars/002-combinatorics/pascal-triangle.png"),
)
for seminar, relative_target in references:
    content = seminar.read_text(encoding="utf-8")
    matches = re.findall(r"!\[([^\]]+)\]\(([^)]+pascal-triangle\.png)\)", content)
    assert matches == [
        (
            "Треугольник Паскаля от строки 0 до строки 7 и панель с общими формулами",
            relative_target,
        )
    ]
    assert (seminar.parent / relative_target).resolve() == image_path.resolve()

print("Треугольник Паскаля: числа, формулы, PNG, manifest и обе ссылки проверены")
