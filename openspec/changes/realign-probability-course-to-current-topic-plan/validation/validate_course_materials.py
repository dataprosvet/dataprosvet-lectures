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
    "lectures-teacher/seminars/001_combinatorics-and-probabilit.md": "bc7512c12d06c524c94bdabcb8e533613ad7a455d3e60152c8801083beb4d5d0",
}
FORMAT_ONLY_BASELINES = {
    "lectures/001_random-experiments-events-combinatorics.md": "preservation/post-pull/lectures/001_random-experiments-events-combinatorics.md",
    "lecture-notes/001_random-experiments-events-combinatorics.md": "preservation/post-pull/lecture-notes/001_random-experiments-events-combinatorics.md",
    "lectures-teacher/001_random-experiments-events-combinatorics.md": "preservation/post-pull/lectures-teacher/001_random-experiments-events-combinatorics.md",
}
LECTURE_BASES = {
    1: "001_random-experiments-events-combinatorics.md",
    2: "002_probability-theorems-bayes.md",
    3: "003_bernoulli-laplace-poisson.md",
    4: "004_random-variables.md",
    5: "005_numerical-characteristics.md",
    6: "006_distribution-laws.md",
    7: "007_law-of-large-numbers-clt.md",
    8: "008_bivariate-random-variables.md",
}
PROBLEM_RE = re.compile(r"^##+ Задача (S\d{2}-P\d{2})(?: \[типовая\])?(?:\.[^\n]*)?\s*$", re.M)
SOLUTION_RE = re.compile(r"^\*\*Решение\.\*\*", re.M)
SOURCE_LEAK_RE = re.compile(r"(?:sources/|Gmurman_|Savyolova_|2_545|4816 методичка)", re.I)
LINK_RE = re.compile(r"!?(?:\[[^\]]*\])\(([^)]+)\)")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_format_only(text: str) -> str:
    """Игнорирует только разрешённые для лекции 1 изменения Markdown."""
    normalized = []
    for line in text.splitlines():
        line = re.sub(r"^> ?", "", line)
        line = re.sub(r"^- (?=\$\$)", "", line)
        line = re.sub(r"\$[ \t]+", "$", line)
        line = re.sub(r"[ \t]+\$", "$", line)
        normalized.append(line.rstrip())
    return "\n".join(normalized)


def compact_math(text: str) -> str:
    return re.sub(r"\s+", "", text)


def blockquote_contains_formula(text: str) -> bool:
    for block in re.findall(r"(?m)(?:^>.*(?:\n|$))+", text):
        if "$" in block or r"\(" in block or r"\[" in block:
            return True
    return False


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
    change_root = ROOT / "openspec" / "changes" / "realign-probability-course-to-current-topic-plan"
    for relative, baseline_relative in FORMAT_ONLY_BASELINES.items():
        current = ROOT / relative
        baseline = change_root / baseline_relative
        if not current.exists() or not baseline.exists():
            errors.append(f"нет текущего файла или post-pull baseline лекции 1: {relative}")
        elif normalize_format_only(current.read_text(encoding="utf-8")) != normalize_format_only(
            baseline.read_text(encoding="utf-8")
        ):
            errors.append(f"в лекции 1 изменено содержание, а не только форматирование: {relative}")


def check_lectures(errors: list[str]) -> None:
    required_markers = {
        2: (r"P(B\midA)", r"P(A\capB)", r"P(H_i\midA)"),
        3: (r"P_n(k)", r"\varphi", r"\Phi", r"\lambda"),
        4: (r"F_X(x)=P(X\lex)", r"p_k", r"f_X"),
        5: (r"E[X]", r"D(X)", r"\gamma_1", r"\gamma_2"),
        6: (r"Bin(n,p)", r"Pois(\lambda)", r"N(\mu,\sigma^2)", r"1-e^{-(x/\lambda)^k}"),
        7: (r"P(X\gea)", r"\xrightarrow{P}", r"\xrightarrow{d}"),
        8: (r"p_{ij}", r"Cov(X,Y)", r"\rho_{XY}"),
    }
    for number, basename in LECTURE_BASES.items():
        texts: list[tuple[Path, str]] = []
        for directory in ("lectures-teacher", "lectures", "lecture-notes"):
            path = ROOT / directory / basename
            if not path.exists():
                errors.append(f"нет варианта лекции {number}: {path.relative_to(ROOT)}")
            else:
                text = path.read_text(encoding="utf-8")
                texts.append((path, text))
                if blockquote_contains_formula(text):
                    errors.append(f"формула осталась внутри Markdown-цитаты: {path.relative_to(ROOT)}")
                if text.count("$$") % 2:
                    errors.append(f"несбалансированы блоки $$: {path.relative_to(ROOT)}")
                if "$$*" in text or "*$$" in text:
                    errors.append(f"маркер курсива примыкает к блоку формулы: {path.relative_to(ROOT)}")
                if re.search(r"(?<!\\)(?<!q)(?:qquad|quad)\b", text):
                    errors.append(f"команда LaTeX записана без обратного слеша: {path.relative_to(ROOT)}")
        if len(texts) == 3 and not (len(texts[2][1]) < len(texts[1][1]) < len(texts[0][1])):
            errors.append(f"нарушено соотношение объёмов вариантов лекции {number}")
        for path, text in texts:
            compact = compact_math(text)
            for marker in required_markers.get(number, ()):
                if marker not in compact:
                    errors.append(f"лекция {number}: нет общего маркера {marker!r} в {path.relative_to(ROOT)}")
        if number == 2:
            for path, text in texts:
                if re.search(r"P_A\(|P_\{H|A \\cdot B", text):
                    errors.append(f"лекция 2: осталась устаревшая нотация в {path.relative_to(ROOT)}")
                if re.search(r"слова считаются независимыми", text, re.I):
                    errors.append(f"лекция 2: независимость признаков не обусловлена классом в {path.relative_to(ROOT)}")
        if number == 3:
            for path, text in texts:
                if "0,012" in text or "0{,}012" in text:
                    errors.append(f"лекция 3: осталось неверное значение хвоста Пуассона в {path.relative_to(ROOT)}")


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
    if number == 1:
        expected_public = ROOT / "seminars" / "001_combinatorics-and-probabilit.md"
        expected_teacher = ROOT / "lectures-teacher" / "seminars" / "001_combinatorics-and-probabilit.md"
        if public_path != expected_public or teacher_path != expected_teacher:
            errors.append("семинар 1: используется неканонический post-pull файл")
        public_ids = [item[0] for item in public_sections]
        if public_ids != [f"S01-P{index:02d}" for index in range(1, 8)]:
            errors.append("семинар 1: публичная версия должна сохранять семь исходных задач и их порядок")
        for problem_id, body, typical in public_sections:
            has_solution = bool(SOLUTION_RE.search(body))
            if typical != has_solution:
                errors.append(f"семинар 1: некорректная видимость решения {problem_id}")
            condition = re.search(r"^\*\*Условие\.\*\*\s*(.+)$", body, re.M)
            if not condition:
                errors.append(f"семинар 1: не найдено условие {problem_id}")
                continue
            normalized_condition = re.sub(r"[\s*_`]", "", condition.group(1))
            normalized_teacher = re.sub(r"[\s*_`]", "", teacher_text)
            if normalized_condition not in normalized_teacher:
                errors.append(f"семинар 1: условие {problem_id} не совпадает с подтянутой версией")
        if sum(1 for _, _, typical in public_sections if typical) != 4:
            errors.append("семинар 1: ожидаются четыре типовые задачи с решениями")
        if SOURCE_LEAK_RE.search(public_text):
            errors.append("семинар 1: публичный файл раскрывает локальный источник")
        check_links(public_path, public_text, errors)
        check_links(teacher_path, teacher_text, errors)
        return
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
        for number in range(1, 18):
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
