#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Добавляет проверяемые связи между capability, не затрагивая материалы № 1."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
MARK = "## Связанные материалы"

LECTURES = {
    2: ("002_probability-theorems-bayes.md", [6, 7], [3, 4]),
    3: ("003_bernoulli-laplace-poisson.md", [8, 9], [5]),
    4: ("004_random-variables.md", [10], [6]),
    5: ("005_numerical-characteristics.md", [11, 12], [6]),
    6: ("006_distribution-laws.md", [13, 14, 15], [7]),
    7: ("007_law-of-large-numbers-clt.md", [16, 17], [7]),
    8: ("008_bivariate-random-variables.md", [], []),
}

SEMINARS = {
    2: 1, 3: 1, 4: 1, 5: 1,
    6: 2, 7: 2, 8: 3, 9: 3, 10: 4,
    11: 5, 12: 5, 13: 6, 14: 6, 15: 6,
    16: 7, 17: 7,
}

HOMEWORKS = {
    1: ([1], [2]), 2: ([1], [3, 4]), 3: ([2], [6]),
    4: ([2], [7]), 5: ([3], [8]), 6: ([4, 5], [10, 11, 12]),
    7: ([6, 7], [13, 14, 15, 16]),
}


def one(directory: str, prefix: int) -> str:
    matches = sorted((ROOT / directory).glob(f"{prefix:03d}_*.md"))
    if len(matches) != 1:
        raise RuntimeError(f"Ожидался один файл {directory}/{prefix:03d}_*.md, найдено {len(matches)}")
    return matches[0].name


def append(path: Path, lines: list[str]) -> None:
    text = path.read_text(encoding="utf-8").rstrip()
    text = text.replace("<!-- capability-navigation -->\n", "")
    if MARK in text:
        text = text.split(MARK, 1)[0].rstrip()
    path.write_text(text + "\n\n" + MARK + "\n\n" + "\n".join(lines) + "\n", encoding="utf-8")


for number, (filename, seminars, homeworks) in LECTURES.items():
    public_lines = [f"- [Семинар № {item}](../seminars/{one('seminars', item)})" for item in seminars]
    public_lines += [f"- [ИДЗ № {item}](../homeworks/{item:03d}_idz.md)" for item in homeworks]
    if number == 8:
        public_lines = ["- Опциональная capability: отдельные семинар и ИДЗ не предусмотрены."]
    for directory in ("lectures", "lecture-notes"):
        append(ROOT / directory / filename, public_lines)
    teacher_lines = [f"- [Семинар № {item}, ключ](seminars/{one('lectures-teacher/seminars', item)})" for item in seminars]
    teacher_lines += [f"- [ИДЗ № {item}, ключ](homeworks/{item:03d}_idz.md)" for item in homeworks]
    if number == 8:
        teacher_lines = ["- Опциональная capability: отдельные семинар и ИДЗ не предусмотрены."]
    append(ROOT / "lectures-teacher" / filename, teacher_lines)

for number, lecture in SEMINARS.items():
    lecture_file = one("lectures", lecture)
    append(ROOT / "seminars" / one("seminars", number), [f"- [Лекция № {lecture}](../lectures/{lecture_file})"])
    teacher_lecture_file = one("lectures-teacher", lecture)
    append(ROOT / "lectures-teacher" / "seminars" / one("lectures-teacher/seminars", number), [f"- [Лекция № {lecture}, сценарий](../{teacher_lecture_file})"])

for number, (lectures, seminars) in HOMEWORKS.items():
    public_lines = [f"- [Лекция № {item}](../lectures/{one('lectures', item)})" for item in lectures]
    public_lines += [f"- [Семинар № {item}](../seminars/{one('seminars', item)})" for item in seminars]
    append(ROOT / "homeworks" / f"{number:03d}_idz.md", public_lines)
    teacher_lines = [f"- [Лекция № {item}, сценарий](../{one('lectures-teacher', item)})" for item in lectures]
    teacher_lines += [f"- [Семинар № {item}, ключ](../seminars/{one('lectures-teacher/seminars', item)})" for item in seminars]
    append(ROOT / "lectures-teacher" / "homeworks" / f"{number:03d}_idz.md", teacher_lines)
