#!/usr/bin/env python3
"""Deterministic acceptance checks for seminar 2."""

from fractions import Fraction
from math import comb, factorial
from pathlib import Path
from random import Random
import re


ROOT = Path(__file__).resolve().parents[4]
TEACHER = ROOT / "lectures-teacher/seminars/002_combinatorics-and-classical-probability.md"
PUBLIC = ROOT / "seminars/002_combinatorics-and-classical-probability.md"
TASK_RE = re.compile(
    r"^### (S02-[CP]\d{2})([^\n]*)\n\n\*\*Условие\.\*\* (.*?)(?=\n\n(?:### S02-|## 2\.)|\Z)",
    re.MULTILINE | re.DOTALL,
)


def sections(text: str) -> dict[str, tuple[str, str, str]]:
    result = {}
    for match in TASK_RE.finditer(text):
        task_id, heading_suffix, body = match.groups()
        condition, _, remainder = body.rstrip().partition("\n\n")
        result[task_id] = (heading_suffix, condition, remainder)
    return result


def check_bank() -> None:
    teacher_text = TEACHER.read_text(encoding="utf-8")
    public_text = PUBLIC.read_text(encoding="utf-8")
    teacher = sections(teacher_text)
    public = sections(public_text)

    expected_c = [f"S02-C{i:02d}" for i in range(1, 16)]
    expected_p = [f"S02-P{i:02d}" for i in range(1, 26)]
    expected = expected_c + expected_p
    assert list(teacher) == expected
    assert list(public) == expected
    assert {key: value[1] for key, value in teacher.items()} == {
        key: value[1] for key, value in public.items()
    }

    typical = {
        "S02-C01", "S02-C04", "S02-C10", "S02-C14",
        "S02-P01", "S02-P03", "S02-P10", "S02-P23",
    }
    assert {key for key, value in public.items() if "типовая" in value[0]} == typical
    assert public_text.count("**Ответ.**") == 8
    assert teacher_text.count("**Ответ.**") == 40

    teacher_fields = (
        "**Модель и предпосылки.**", "**Решение.**", "**Проверка.**",
        "**Ответ.**", "**Методический комментарий.**", "**Источник.**",
    )
    for task_id, (_, _, body) in teacher.items():
        assert all(field in body for field in teacher_fields), task_id
    for task_id, (_, _, body) in public.items():
        if task_id in typical:
            assert "**Разбор.**" in body and "**Ответ.**" in body, task_id
        else:
            assert body == "", task_id

    teacher_code = re.findall(r"```python\n(.*?)```", teacher["S02-P23"][2], re.DOTALL)
    public_code = re.findall(r"```python\n(.*?)```", public["S02-P23"][2], re.DOTALL)
    assert teacher_code == public_code
    assert len(public_code) == 3
    for index, code in enumerate(public_code, start=1):
        compile(code, f"S02-P23-cell-{index}", "exec")

    for path, text in ((TEACHER, teacher_text), (PUBLIC, public_text)):
        assert text.count("$$") % 2 == 0, path
        assert all(line == "$$" for line in text.splitlines() if "$$" in line), path


def check_exact_calculations() -> None:
    combinatorics = {
        "C01a": 6 * 6 * 5,
        "C01b": 6 * 7 * 7,
        "C02": 6 * 5 * 4,
        "C03": factorial(5),
        "C04": comb(10, 3),
        "C05": 6 * 7 * 4,
        "C06": 2**3 + 2**4 + 2**5,
        "C07": 18 * 17 * 16,
        "C08": 3 * comb(30, 3),
        "C09": 2 * comb(7, 2) * comb(10, 3),
        "C10a": 5 * 4 * 3,
        "C10b": comb(5, 3),
        "C11a": comb(30, 2) * 2,
        "C11b": comb(30, 2),
        "C12": comb(12, 2) - 12,
        "C13": next(n for n in range(2, 100) if comb(n, 2) == 153),
        "C14": comb(10, 8) - comb(8, 8),
        "C15": 15 * comb(14, 4),
    }
    assert list(combinatorics.values()) == [
        180, 294, 120, 120, 120, 168, 56, 4896, 12180, 5040,
        60, 10, 870, 435, 54, 18, 44, 15015,
    ]

    probability = {
        "P01w": Fraction(3, 10), "P01b": Fraction(7, 10),
        "P02": Fraction(1, 5 * 4 * 3),
        "P03a": Fraction(comb(6, 2), comb(10, 2)),
        "P03b": Fraction(comb(4, 2), comb(10, 2)),
        "P03c": Fraction(6 * 4, comb(10, 2)),
        "P04a": Fraction(10, 15), "P04b": Fraction(5, 15), "P04c": Fraction(0, 1),
        "P05a": Fraction(4, 36), "P05b": Fraction(16, 36),
        "P06a": Fraction(comb(10, 2), comb(15, 2)),
        "P06b": Fraction(comb(5, 2), comb(15, 2)),
        "P06c": Fraction(10 * 5, comb(15, 2)),
        "P07a": Fraction(comb(5, 2) + comb(4, 2), comb(9, 2)),
        "P07b": Fraction(5 * 4, comb(9, 2)),
        "P08": Fraction(comb(6, 2) * comb(4, 3), comb(10, 5)),
        "P09": Fraction(comb(4, 3) * comb(5, 3), comb(9, 6)),
        "P10": Fraction(9, 36), "P11": Fraction(5, 36),
        "P12": Fraction(1, factorial(5)), "P13": Fraction(factorial(3) * factorial(2), factorial(7)),
        "P14": Fraction(17, 25), "P15": Fraction(10, 15), "P16": Fraction(9 + 4 - 1, 36),
        "P17": Fraction(4, 6), "P18a": Fraction(2, 6) * Fraction(1, 6) * Fraction(1, 6),
        "P18b": Fraction(2, 6) * Fraction(1, 5) * Fraction(1, 4),
        "P19a": Fraction(1, 7) * Fraction(1, 7) * Fraction(3, 7),
        "P19b": Fraction(1, 7) * Fraction(1, 6) * Fraction(3, 5),
        "P20": Fraction(comb(19, 3), comb(20, 4)), "P21": Fraction(20, 100),
        "P22": Fraction(4 * 3 * 2, 4**3), "P23a": Fraction(2, 10),
        "P23b": Fraction(comb(2, 2), comb(10, 2)),
        "P24": Fraction(1, factorial(10)), "P25": Fraction(factorial(4), factorial(10)),
    }
    expected = [
        Fraction(3, 10), Fraction(7, 10), Fraction(1, 60), Fraction(1, 3),
        Fraction(2, 15), Fraction(8, 15), Fraction(2, 3), Fraction(1, 3), Fraction(0),
        Fraction(1, 9), Fraction(4, 9), Fraction(3, 7), Fraction(2, 21), Fraction(10, 21),
        Fraction(4, 9), Fraction(5, 9), Fraction(5, 21), Fraction(10, 21), Fraction(1, 4),
        Fraction(5, 36), Fraction(1, 120), Fraction(1, 420), Fraction(17, 25),
        Fraction(2, 3), Fraction(1, 3), Fraction(2, 3), Fraction(1, 108), Fraction(1, 60),
        Fraction(3, 343), Fraction(1, 70), Fraction(1, 5), Fraction(1, 5), Fraction(3, 8),
        Fraction(1, 5), Fraction(1, 45), Fraction(1, 3628800), Fraction(1, 151200),
    ]
    assert list(probability.values()) == expected


def check_simulation() -> None:
    server_count = 10
    initial_load = 0.70
    request_load = 0.05
    requests = 140
    trials = 100_000
    seed = 2026
    initial_servers = set(Random(seed).sample(range(server_count), 2))
    initial_loads = [initial_load if i in initial_servers else 0.0 for i in range(server_count)]
    rng = Random(seed + 1)
    random_hits = 0
    power_two_hits = 0
    for _ in range(trials):
        random_hits += rng.randrange(server_count) in initial_servers
        candidates = rng.sample(range(server_count), 2)
        chosen = min(candidates, key=initial_loads.__getitem__)
        power_two_hits += chosen in initial_servers
    empirical = random_hits / trials, power_two_hits / trials
    exact = len(initial_servers) / server_count, comb(2, 2) / comb(10, 2)
    assert initial_servers == {1, 5}
    assert empirical == (0.19812, 0.02253)
    assert all(abs(observed - target) <= 0.005 for observed, target in zip(empirical, exact))

    def simulate(strategy: str, strategy_seed: int) -> tuple[list[list[float]], list[int]]:
        loads = initial_loads.copy()
        history = [loads.copy()]
        dropped_history = [0]
        dropped = 0
        strategy_rng = Random(strategy_seed)
        for _ in range(requests):
            if strategy == "random":
                chosen = strategy_rng.randrange(server_count)
            else:
                candidates = strategy_rng.sample(range(server_count), 2)
                chosen = min(candidates, key=loads.__getitem__)
            if loads[chosen] >= 1.0:
                dropped += 1
            else:
                loads[chosen] = min(1.0, loads[chosen] + request_load)
            history.append(loads.copy())
            dropped_history.append(dropped)
        return history, dropped_history

    random_history, random_dropped = simulate("random", seed + 2)
    power_history, power_dropped = simulate("power_two", seed + 3)
    assert len(random_history) == len(power_history) == requests + 1
    assert random_history[0] == power_history[0] == initial_loads
    assert [round(value, 2) for value in random_history[-1]] == [
        0.90, 1.00, 0.60, 0.80, 0.65, 1.00, 0.55, 0.80, 0.75, 0.85,
    ]
    assert [round(value, 2) for value in power_history[-1]] == [
        0.80, 0.90, 0.90, 0.85, 0.85, 0.85, 0.80, 0.85, 0.85, 0.75,
    ]
    assert random_dropped[-1] == 10
    assert power_dropped[-1] == 0

    def color_bucket(load: float) -> str:
        if load >= 1.0 - 1e-12:
            return "red"
        if load >= 0.80 - 1e-12:
            return "orange"
        if load >= 0.50 - 1e-12:
            return "yellow"
        return "blue"

    assert [color_bucket(value) for value in (0.49, 0.50, 0.79, 0.80, 0.99, 1.00)] == [
        "blue", "yellow", "yellow", "orange", "orange", "red",
    ]


def check_active_links() -> None:
    old_seminar = re.compile(r"seminars/(?:00[3-9]|01[0-7])")
    old_assets = ("assets/seminars/002-combinatorics/", "assets/seminars/004-geometric-probability/")
    active_roots = ("lectures", "lecture-notes", "seminars", "homeworks", "lectures-teacher")
    link_re = re.compile(r"!?\[[^]]*\]\(([^)]+)\)")
    for directory in active_roots:
        for path in (ROOT / directory).rglob("*.md"):
            text = path.read_text(encoding="utf-8")
            assert not old_seminar.search(text), path
            assert not any(old in text for old in old_assets), path
            for target in link_re.findall(text):
                clean = target.split("#", 1)[0]
                if not clean or "://" in clean or clean.startswith("mailto:"):
                    continue
                assert (path.parent / clean).resolve().exists(), (path, target)


if __name__ == "__main__":
    check_bank()
    check_exact_calculations()
    check_simulation()
    check_active_links()
    print("PASS: 40 tasks (15+25), public 8/32 split, calculations, simulation, links")
