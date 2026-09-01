#!/usr/bin/env python3
"""Проверки структуры материалов курса без внешних зависимостей."""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
FROZEN = {
    "lectures/001_random-experiments-events-combinatorics.md": "72621a4c2c3c10de8d2326d7cefb7e6617bda98dfff1164506bc753c22736468",
    "lecture-notes/001_random-experiments-events-combinatorics.md": "3bab50f0ccff5a7da951cab849125805ce6859dff59825d741f02d5a930ff028",
    "lectures-teacher/001_random-experiments-events-combinatorics.md": "8bba5ad463c34dca085c140b19380c16a01400f356f4ed043083343f425fbb48",
    "seminars/001_combinatorics.md": "12f7eb28690deaf61a16a2c8a6304646e8f6e9412e52fe7e8a51279bcd618f2e",
    "lectures-teacher/seminars/001_combinatorics.md": "5174c5d4b03c0de8d60d5b4ea8b5c077d40e414d19e3734bebe95cfda51cfaa4",
}
LECTURE_BASES = {
    2: "002_probability-theorems-bayes.md",
    3: "003_bernoulli-laplace-poisson.md",
    4: "004_random-variables.md",
    5: "005_numerical-characteristics.md",
    6: "006_distribution-laws.md",
    7: "007_law-of-large-numbers-clt.md",
    8: "008_bivariate-random-variables.md",
}
PROBLEM_RE = re.compile(r"^##+ Задача (S\d{2}-P\d{2})(?: \[типовая\])?\s*$", re.M)
SOLUTION_RE = re.compile(r"^\*\*Решение\.\*\*", re.M)
SOURCE_LEAK_RE = re.compile(r"(?:sources/|Gmurman_|Savyolova_|2_545|4816 методичка)", re.I)
LINK_RE = re.compile(r"!?(?:\[[^\]]*\])\(([^)]+)\)")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sections(text: str) -> list[tuple[str, str, bool]]:
    matches = list(PROBLEM_RE.finditer(text))
    result = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        heading = match.group(0)
        result.append((match.group(1), text[match.end():end], "[типовая]" in heading))
    return result


def check_frozen(errors: list[str]) -> None:
    for relative, expected in FROZEN.items():
        path = ROOT / relative
        if not path.exists():
            errors.append(f"защищённый файл отсутствует: {relative}")
        elif sha256(path) != expected:
            errors.append(f"защищённый файл изменён: {relative}")


def check_lectures(errors: list[str]) -> None:
    for number, basename in LECTURE_BASES.items():
        texts = []
        for directory in ("lectures-teacher", "lectures", "lecture-notes"):
            path = ROOT / directory / basename
            if not path.exists():
                errors.append(f"нет варианта лекции {number}: {path.relative_to(ROOT)}")
            else:
                texts.append(path.read_text(encoding="utf-8"))
        if len(texts) == 3 and not (len(texts[2]) < len(texts[1]) < len(texts[0])):
            errors.append(f"нарушено соотношение объёмов вариантов лекции {number}")


def check_links(path: Path, text: str, errors: list[str]) -> None:
    for target in LINK_RE.findall(text):
        clean = target.split("#", 1)[0].strip()
        if not clean or "://" in clean or clean.startswith("mailto:"):
            continue
        resolved = (path.parent / clean).resolve()
        if not resolved.exists():
            errors.append(f"битая ссылка {clean!r} в {path.relative_to(ROOT)}")


def check_seminar(number: int, errors: list[str]) -> None:
    public_matches = sorted((ROOT / "seminars").glob(f"{number:03d}_*.md"))
    teacher_matches = sorted((ROOT / "lectures-teacher" / "seminars").glob(f"{number:03d}_*.md"))
    if len(public_matches) != 1 or len(teacher_matches) != 1:
        errors.append(f"семинар {number}: ожидается ровно одна публичная и одна преподавательская версия")
        return
    public_path, teacher_path = public_matches[0], teacher_matches[0]
    public_text = public_path.read_text(encoding="utf-8")
    teacher_text = teacher_path.read_text(encoding="utf-8")
    public_sections, teacher_sections = sections(public_text), sections(teacher_text)
    public_ids = [item[0] for item in public_sections]
    teacher_ids = [item[0] for item in teacher_sections]
    if public_ids != teacher_ids:
        errors.append(f"семинар {number}: не совпадают идентификаторы или порядок задач")
    if not 15 <= len(public_ids) <= 20:
        errors.append(f"семинар {number}: найдено {len(public_ids)} задач вместо 15–20")
    for problem_id, body, _ in teacher_sections:
        if not SOLUTION_RE.search(body):
            errors.append(f"семинар {number}: нет полного решения {problem_id} в версии преподавателя")
    for problem_id, body, typical in public_sections:
        has_solution = bool(SOLUTION_RE.search(body))
        if typical != has_solution:
            errors.append(f"семинар {number}: некорректная видимость решения {problem_id}")
    if SOURCE_LEAK_RE.search(public_text):
        errors.append(f"семинар {number}: публичный файл раскрывает локальный источник")
    check_links(public_path, public_text, errors)
    check_links(teacher_path, teacher_text, errors)


def check_homeworks(errors: list[str]) -> None:
    for number in range(1, 8):
        public = ROOT / "homeworks" / f"{number:03d}_idz.md"
        teacher = ROOT / "lectures-teacher" / "homeworks" / f"{number:03d}_idz.md"
        if not public.exists() or not teacher.exists():
            errors.append(f"ИДЗ {number}: отсутствует студенческая или преподавательская версия")
            continue
        public_text = public.read_text(encoding="utf-8")
        teacher_text = teacher.read_text(encoding="utf-8")
        if "**Решение.**" in public_text or "**Ответ.**" in public_text:
            errors.append(f"ИДЗ {number}: в студенческой версии обнаружен ответ")
        if "**Решение.**" not in teacher_text or "## Критерии оценивания" not in teacher_text:
            errors.append(f"ИДЗ {number}: преподавательский ключ неполон")
        if SOURCE_LEAK_RE.search(public_text):
            errors.append(f"ИДЗ {number}: публичный файл раскрывает локальный источник")
        check_links(public, public_text, errors)
        check_links(teacher, teacher_text, errors)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frozen-only", action="store_true")
    args = parser.parse_args()
    errors: list[str] = []
    check_frozen(errors)
    if not args.frozen_only:
        check_lectures(errors)
        for number in range(2, 18):
            check_seminar(number, errors)
        check_homeworks(errors)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("OK: проверки материалов пройдены")
    return 0


if __name__ == "__main__":
    sys.exit(main())
