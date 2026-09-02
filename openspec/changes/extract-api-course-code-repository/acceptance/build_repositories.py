from __future__ import annotations

import ast
import shutil
import subprocess
from pathlib import Path


COURSE = Path("/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies")
SOURCE = COURSE / "attachments/api-learning-path"
STUDENT = Path("/Users/ripper/projects/api-technologies-code")
TEACHER = Path("/Users/ripper/projects/api-technologies-code-teacher")

LECTURES = {
    "lecture/01-api-interface-layer": (1, "API как интерфейсный слой", ["domain-contract.md"]),
    "lecture/02-http-rest-openapi": (2, "HTTP, REST и OpenAPI", ["prb-openapi.yaml", "sii-openapi.yaml"]),
    "lecture/03-integration-styles": (3, "Стили интеграции", ["inference.proto", "message-traces.json"]),
    "lecture/04-fastapi-services": (4, "Сервисы на FastAPI", ["prb-openapi.yaml", "sii-openapi.yaml"]),
}

SEMINARS = {
    "seminar/01-api-scenarios": (1, "Сценарии использования API", ["domain-contract.md"]),
    "seminar/02-rest-openapi-contract": (2, "REST/OpenAPI-контракт", ["prb-openapi.yaml", "sii-openapi.yaml"]),
    "seminar/03-http-diagnostics": (3, "HTTP-диагностика", []),
    "seminar/04-integration-style-selection": (4, "Выбор стиля интеграции", ["inference.proto", "message-traces.json"]),
    "seminar/05-fastapi-service": (5, "Сервис на FastAPI", ["prb-openapi.yaml", "sii-openapi.yaml"]),
}


def run(*args: str, cwd: Path) -> None:
    subprocess.run(args, cwd=cwd, check=True)


def copy_file(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def copy_tree(source: Path, target: Path) -> None:
    shutil.copytree(
        source,
        target,
        dirs_exist_ok=True,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", ".pytest_cache"),
    )


def begin_branch(repo: Path, branch: str) -> None:
    existing = subprocess.run(
        ["git", "show-ref", "--verify", "--quiet", f"refs/heads/{branch}"], cwd=repo
    )
    if existing.returncode == 0:
        raise RuntimeError(f"branch already exists: {repo}: {branch}")
    run("git", "switch", "main", cwd=repo)
    run("git", "switch", "-c", branch, cwd=repo)


def finish_branch(repo: Path, branch: str, paths: list[str]) -> None:
    run("git", "add", "--", *paths, cwd=repo)
    run("git", "commit", "-m", f"Add course snapshot for {branch}", cwd=repo)


def filtered_checkpoint_runner(lecture: int) -> str:
    tree = ast.parse((SOURCE / "lecture-demos/run_checkpoint.py").read_text(encoding="utf-8"))
    filtered: list[ast.stmt] = []
    prefix = f"L{lecture}."
    for node in tree.body:
        if (
            isinstance(node, ast.Assign)
            and any(isinstance(target, ast.Name) and target.id == "ROOT" for target in node.targets)
        ):
            node.value = ast.parse("Path(__file__).resolve().parent", mode="eval").body
        if isinstance(node, ast.ImportFrom) and node.module == "framework_and_adapters" and lecture != 4:
            continue
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == "run":
            body: list[ast.stmt] = []
            for statement in node.body:
                if isinstance(statement, ast.If):
                    comparison = statement.test
                    if (
                        isinstance(comparison, ast.Compare)
                        and isinstance(comparison.left, ast.Name)
                        and comparison.left.id == "checkpoint"
                        and len(comparison.comparators) == 1
                        and isinstance(comparison.comparators[0], ast.Constant)
                        and isinstance(comparison.comparators[0].value, str)
                    ):
                        if comparison.comparators[0].value.startswith(prefix):
                            body.append(statement)
                        continue
                body.append(statement)
            node.body = body
        filtered.append(node)
    tree.body = filtered
    ast.fix_missing_locations(tree)
    return ast.unparse(tree) + "\n"


def lecture_tests(lecture: int) -> str:
    counts = {1: 6, 2: 8, 3: 7, 4: 9}
    checkpoints = ", ".join(repr(f"L{lecture}.{number}") for number in range(1, counts[lecture] + 1))
    return f'''from checkpoint import run


CHECKPOINTS = [{checkpoints}]


def test_lecture_checkpoints_are_executable():
    for checkpoint in CHECKPOINTS:
        result = run(checkpoint)
        assert isinstance(result, dict)
        assert result


def test_both_profiles_are_supported():
    assert run("L{lecture}.1", "prb")
    assert run("L{lecture}.1", "sii")
'''


def lecture_teacher_tests(lecture: int) -> str:
    observations = {
        1: 'assert run("L1.1")["equal"] is True',
        2: 'assert run("L2.4")["same_key_same_job"] is True\n    assert run("L2.6")["conditional_status"] == 304',
        3: 'assert len(run("L3.4", "sii")["messages"]) == 3',
        4: 'assert run("L4.5")["status"] == 503\n    assert run("L4.9")["production_dependency"] is False',
    }
    return f'''import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from checkpoint import run


def test_contractually_important_observations():
    {observations[lecture]}
'''


def lecture_readme(branch: str, lecture: int, title: str, teacher: bool = False) -> str:
    checkpoints = {1: "L1.1–L1.6", 2: "L2.1–L2.8", 3: "L3.1–L3.7", 4: "L4.1–L4.9"}[lecture]
    audience = "Преподавательская зеркальная ветка." if teacher else "Материалы для студента."
    teacher_note = "\nЗакрытая проверка: `pytest -q tests teacher/checks`.\n" if teacher else ""
    return f'''# Лекция {lecture}: {title}

{audience} Ветка: `{branch}`. Профиль задаётся как `prb` или `sii`; все данные синтетические.

## Окружение и установка

Нужен Python 3.12+:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Запуск

```bash
python checkpoint.py L{lecture}.1 --profile prb
python checkpoint.py L{lecture}.1 --profile sii
```

В ветке доступны checkpoints `{checkpoints}`. Команда печатает наблюдаемое поведение API в JSON.

## Проверка

```bash
pytest -q tests
```

Ожидаемый результат: все checkpoints выполняются для обоих профилей. Для лекции 3 дополнительно можно собрать пример C++ по инструкции в `cpp/README.md`.
{teacher_note}'''


def common_lecture_files(repo: Path, branch: str, lecture: int, title: str) -> list[str]:
    copy_file(SOURCE / "requirements.txt", repo / "requirements.txt")
    copy_file(SOURCE / "reference_api.py", repo / "reference_api.py")
    copy_tree(SOURCE / "synthetic-data", repo / "synthetic-data")
    for contract in LECTURES[branch][2]:
        copy_file(SOURCE / "contracts" / contract, repo / "contracts" / contract)
    (repo / "checkpoint.py").write_text(filtered_checkpoint_runner(lecture), encoding="utf-8")
    (repo / "tests").mkdir(parents=True, exist_ok=True)
    (repo / "tests/test_checkpoints.py").write_text(lecture_tests(lecture), encoding="utf-8")
    if lecture in {2, 3}:
        copy_tree(SOURCE / "lecture-demos/sii-cpp", repo / "cpp")
    if lecture == 4:
        copy_file(SOURCE / "lecture-demos/framework_and_adapters.py", repo / "framework_and_adapters.py")
    (repo / "README.md").write_text(lecture_readme(branch, lecture, title), encoding="utf-8")
    return ["README.md", "requirements.txt", "reference_api.py", "checkpoint.py", "tests", "synthetic-data", "contracts"] + (["cpp"] if lecture in {2, 3} else []) + (["framework_and_adapters.py"] if lecture == 4 else [])


def build_lectures() -> None:
    for branch, (lecture, title, _) in LECTURES.items():
        begin_branch(STUDENT, branch)
        student_paths = common_lecture_files(STUDENT, branch, lecture, title)
        finish_branch(STUDENT, branch, student_paths)

        begin_branch(TEACHER, branch)
        teacher_paths = common_lecture_files(TEACHER, branch, lecture, title)
        (TEACHER / "README.md").write_text(lecture_readme(branch, lecture, title, teacher=True), encoding="utf-8")
        (TEACHER / "teacher/checks").mkdir(parents=True, exist_ok=True)
        (TEACHER / "teacher/checks/test_instructor.py").write_text(lecture_teacher_tests(lecture), encoding="utf-8")
        copy_file(SOURCE / "validation/grading-fixtures.md", TEACHER / "teacher/grading-fixtures.md")
        teacher_paths.append("teacher")
        finish_branch(TEACHER, branch, teacher_paths)


def seminar_readme(branch: str, number: int, title: str, teacher: bool = False) -> str:
    extra = "\n## Закрытая проверка\n\nРешения и instructor checks находятся в `teacher/profiles/`.\n" if teacher else ""
    third = "Семинары 5–6" if number == 5 else f"Семинар {number}"
    return f'''# {third}: {title}

Ветка: `{branch}`. Выберите профиль `profiles/prb` или `profiles/sii`; не смешивайте артефакты профилей.

## Этап 1 — на занятии

Работайте в `profiles/<profile>/practical/starter` и сверяйтесь с `profiles/<profile>/practical/public-checks`.

## Этап 2 — дома

Продолжайте ту же Git-ветку и выполните задание из `profiles/<profile>/homework/starter`. Отдельная `homework/*` ветка не создаётся. Для работы студента используется его приватный fork/репозиторий; сдача фиксируется последним commit в PR/MR его репозитория.

## Окружение и запуск

Для Python-заданий нужен Python 3.12+. Если в корне есть `requirements.txt`:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Читайте профильные README в `public-checks`. Публичная проверка для задания 5:

```bash
pytest -q profiles/<profile>/practical/public-checks
```

До выполнения TODO часть student checks может ожидаемо падать. Все примеры данных синтетические; реальные endpoint, ключи и персональные данные добавлять нельзя.
{extra}'''


def copy_seminar_common(repo: Path, branch: str, number: int, title: str) -> list[str]:
    paths = ["README.md", "profiles"]
    for profile in ("prb", "sii"):
        base = repo / "profiles" / profile
        copy_tree(SOURCE / f"practicals/{profile}/pr{number:02d}/starter", base / "practical/starter")
        copy_tree(SOURCE / f"practicals/{profile}/pr{number:02d}/public-checks", base / "practical/public-checks")
        copy_tree(SOURCE / f"homeworks/{profile}/hw{number:02d}/starter", base / "homework/starter")
    for contract in SEMINARS[branch][2]:
        copy_file(SOURCE / "contracts" / contract, repo / "contracts" / contract)
    if SEMINARS[branch][2]:
        paths.append("contracts")
    if number in {1, 3, 5}:
        copy_tree(SOURCE / "synthetic-data", repo / "synthetic-data")
        paths.append("synthetic-data")
    if number in {3, 5}:
        copy_file(SOURCE / "reference_api.py", repo / "reference_api.py")
        copy_file(SOURCE / "requirements.txt", repo / "requirements.txt")
        paths.extend(["reference_api.py", "requirements.txt"])
    if number == 2:
        copy_file(SOURCE / "validation/check_artifact.py", repo / "tools/check_artifact.py")
        copy_file(SOURCE / "requirements.txt", repo / "requirements.txt")
        paths.extend(["tools", "requirements.txt"])
    if number == 3:
        copy_file(SOURCE / "validation/check_http_scenarios.py", repo / "tools/check_http_scenarios.py")
        paths.append("tools")
    if number == 4:
        copy_file(SOURCE / "validation/check_artifact.py", repo / "tools/check_artifact.py")
        copy_file(SOURCE / "requirements.txt", repo / "requirements.txt")
        paths.extend(["tools", "requirements.txt"])
    (repo / "README.md").write_text(seminar_readme(branch, number, title), encoding="utf-8")
    return paths


def build_seminars() -> None:
    for branch, (number, title, _) in SEMINARS.items():
        begin_branch(STUDENT, branch)
        student_paths = copy_seminar_common(STUDENT, branch, number, title)
        finish_branch(STUDENT, branch, student_paths)

        begin_branch(TEACHER, branch)
        teacher_paths = copy_seminar_common(TEACHER, branch, number, title)
        (TEACHER / "README.md").write_text(seminar_readme(branch, number, title, teacher=True), encoding="utf-8")
        for profile in ("prb", "sii"):
            target = TEACHER / "teacher/profiles" / profile
            copy_tree(SOURCE / f"practicals/{profile}/pr{number:02d}/instructor-solution", target / "practical-solution")
            copy_tree(SOURCE / f"practicals/{profile}/pr{number:02d}/instructor-checks", target / "practical-checks")
            copy_tree(SOURCE / f"homeworks/{profile}/hw{number:02d}/instructor-solution", target / "homework-solution")
            copy_tree(SOURCE / f"homeworks/{profile}/hw{number:02d}/instructor-checks", target / "homework-checks")
        copy_file(SOURCE / "validation/grading-fixtures.md", TEACHER / "teacher/grading-fixtures.md")
        copy_file(SOURCE / "RUBRIC.md", TEACHER / "teacher/RUBRIC.md")
        teacher_paths.append("teacher")
        finish_branch(TEACHER, branch, teacher_paths)


def main() -> None:
    for repo in (STUDENT, TEACHER):
        run("git", "status", "--porcelain=v1", cwd=repo)
    build_lectures()
    build_seminars()
    run("git", "switch", "main", cwd=STUDENT)
    run("git", "switch", "main", cwd=TEACHER)


if __name__ == "__main__":
    main()
