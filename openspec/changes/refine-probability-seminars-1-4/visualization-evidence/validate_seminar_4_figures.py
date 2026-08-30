from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[4]
ASSET_DIR = ROOT / "assets" / "seminars" / "004-geometric-probability"
MANIFEST = Path(__file__).with_name("seminar-4-figures.json")
PUBLIC = ROOT / "seminars" / "004_geometric-statistical-probability.md"
TEACHER = ROOT / "lectures-teacher" / "seminars" / "004_geometric-statistical-probability.md"
IMAGE_RE = re.compile(r"!\[([^\]]+)]\(([^)]+\.png)\)")


def fail(message: str) -> None:
    raise AssertionError(message)


manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))["изображения"]
if len(manifest) != 9:
    fail(f"В manifest ожидалось 9 изображений, получено {len(manifest)}")

manifest_paths = {ROOT / item["файл"] for item in manifest}
disk_paths = set(ASSET_DIR.glob("*.png"))
if manifest_paths != disk_paths:
    fail(f"Manifest и каталог различаются: manifest={manifest_paths}, disk={disk_paths}")

for item in manifest:
    path = ROOT / item["файл"]
    data = path.read_bytes()
    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        fail(f"Неверная PNG-сигнатура: {path}")
    if hashlib.sha256(data).hexdigest() != item["sha256"]:
        fail(f"SHA-256 не совпадает с manifest: {path}")
    if len(data) >= 5 * 1024 * 1024:
        fail(f"Файл превышает 5 MiB: {path}")
    with Image.open(path) as image:
        width, height = image.size
        if (width, height) != (item["ширина"], item["высота"]):
            fail(f"Размер не совпадает с manifest: {path}")
        if width > 4096 or height > 4096 or width * height > 16_000_000:
            fail(f"Геометрия превышает лимиты publisher: {path}")

for markdown in (PUBLIC, TEACHER):
    text = markdown.read_text(encoding="utf-8")
    references = IMAGE_RE.findall(text)
    if len(references) != 9:
        fail(f"{markdown}: ожидалось 9 PNG-ссылок, получено {len(references)}")
    resolved: set[Path] = set()
    for alt, target in references:
        if len(alt.strip()) < 20:
            fail(f"{markdown}: слишком короткий alt-текст: {alt!r}")
        path = (markdown.parent / target).resolve()
        if not path.is_file():
            fail(f"{markdown}: отсутствует цель {target}")
        resolved.add(path)
    if resolved != manifest_paths:
        fail(f"{markdown}: ссылки не покрывают manifest без orphan-файлов")

print("Проверено 9 PNG: manifest, сигнатуры, SHA-256, размеры и лимиты корректны")
print("Публичная и преподавательская версии содержат по 9 уникальных ссылок с alt-текстами")
