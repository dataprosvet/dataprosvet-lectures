from __future__ import annotations

import os
import re
import shutil
import subprocess
import tarfile
import tempfile
from pathlib import Path

from build_repositories import LECTURES, SEMINARS, STUDENT, TEACHER


PYTHON = Path("/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies/.venv/bin/python")


def export(repo: Path, branch: str, target: Path) -> None:
    archive = target / "snapshot.tar"
    with archive.open("wb") as output:
        subprocess.run(["git", "archive", branch], cwd=repo, stdout=output, check=True)
    with tarfile.open(archive) as bundle:
        bundle.extractall(target / "tree", filter="data")


def execute(args: list[str], cwd: Path, expected: int = 0) -> None:
    environment = os.environ.copy()
    environment["PYTHONPATH"] = str(cwd)
    result = subprocess.run(args, cwd=cwd, env=environment, text=True, capture_output=True)
    if result.returncode != expected:
        raise AssertionError(
            f"unexpected exit {result.returncode}, expected {expected}: {' '.join(args)}\n{result.stdout}\n{result.stderr}"
        )


def validate_lectures(root: Path) -> None:
    for repo, teacher in ((STUDENT, False), (TEACHER, True)):
        for branch in LECTURES:
            target = root / ("teacher" if teacher else "student") / branch.replace("/", "-")
            target.mkdir(parents=True)
            export(repo, branch, target)
            tree = target / "tree"
            execute([str(PYTHON), "-m", "pytest", "-q", "tests"], tree)
            if teacher:
                execute([str(PYTHON), "-m", "pytest", "-q", "teacher/checks"], tree)
            execute([str(PYTHON), "-m", "compileall", "-q", "."], tree)
            if branch == "lecture/03-integration-styles":
                (tree / "generated").mkdir()
                execute(
                    [str(PYTHON), "-m", "grpc_tools.protoc", "-I", "contracts", "--python_out", "generated", "contracts/inference.proto"],
                    tree,
                )
                if shutil.which("cmake") and shutil.which("ctest"):
                    execute(["cmake", "-S", "cpp", "-B", "build"], tree)
                    execute(["cmake", "--build", "build"], tree)
                    execute(["ctest", "--test-dir", "build", "--output-on-failure"], tree)
                else:
                    execute(["c++", "-std=c++17", "cpp/main.cpp", "-o", "sii_reference_client"], tree)
                    execute(["./sii_reference_client", "--fixture", "cpp/response.json"], tree)


def validate_seminars(root: Path) -> None:
    for repo, teacher in ((STUDENT, False), (TEACHER, True)):
        for branch, (number, _, _) in SEMINARS.items():
            target = root / ("teacher" if teacher else "student") / branch.replace("/", "-")
            target.mkdir(parents=True)
            export(repo, branch, target)
            tree = target / "tree"
            execute([str(PYTHON), "-m", "compileall", "-q", "."], tree)
            if number == 5 and not teacher:
                for profile in ("prb", "sii"):
                    checks = f"profiles/{profile}/practical/public-checks"
                    execute([str(PYTHON), "-m", "pytest", "-q", checks], tree, expected=1)
            if number == 5 and teacher:
                checks = [
                    "teacher/profiles/prb/practical-checks",
                    "teacher/profiles/prb/homework-checks",
                    "teacher/profiles/sii/practical-checks",
                    "teacher/profiles/sii/homework-checks",
                ]
                for check_directory in checks:
                    execute([str(PYTHON), "-m", "pytest", "-q", check_directory], tree)


def validate_topology_and_isolation() -> None:
    expected = {"main", *LECTURES, *SEMINARS}
    for repo in (STUDENT, TEACHER):
        branches = {
            line.strip().removeprefix("* ").strip()
            for line in subprocess.check_output(["git", "branch", "--format=%(refname:short)"], cwd=repo, text=True).splitlines()
        }
        assert branches == expected, (repo, branches ^ expected)
        assert not any(name.startswith("homework/") for name in branches)
    objects = subprocess.check_output(["git", "rev-list", "--objects", "--all"], cwd=STUDENT, text=True)
    forbidden = ("instructor-solution", "instructor-checks", "grading-fixtures", "api-technologies-code-teacher")
    assert not any(marker in objects for marker in forbidden)
    for branch in {"main", *LECTURES, *SEMINARS}:
        for marker in forbidden:
            result = subprocess.run(
                ["git", "grep", "-I", "-n", "-e", marker, branch],
                cwd=STUDENT,
                text=True,
                capture_output=True,
            )
            assert result.returncode == 1, result.stdout
    security_pattern = re.compile(r"(github_pat_|ghp_[A-Za-z0-9]|AKIA[0-9A-Z]{16}|BEGIN (RSA |OPENSSH )?PRIVATE KEY|api[_-]?key\s*[:=])", re.I)
    for repo in (STUDENT, TEACHER):
        for branch in {"main", *LECTURES, *SEMINARS}:
            files = subprocess.check_output(["git", "ls-tree", "-r", "--name-only", branch], cwd=repo, text=True).splitlines()
            for filename in files:
                blob = subprocess.check_output(["git", "show", f"{branch}:{filename}"], cwd=repo)
                try:
                    content = blob.decode("utf-8")
                except UnicodeDecodeError:
                    continue
                assert not security_pattern.search(content), (repo, branch, filename)
                for url in re.findall(r"https?://[^\s)>\]}`]+", content):
                    assert url.startswith(("http://127.0.0.1", "http://localhost", "https://github.com/TheTonyPub/api-technologies-code")), (repo, branch, filename, url)


def validate_equivalence() -> None:
    def baseline(relative: str) -> bytes:
        return subprocess.check_output(["git", "show", f"main:source-baseline/{relative}"], cwd=TEACHER)

    for repo in (STUDENT, TEACHER):
        for branch in LECTURES:
            actual = subprocess.check_output(["git", "show", f"{branch}:reference_api.py"], cwd=repo)
            assert actual == baseline("reference_api.py")
        for branch, (number, _, contracts) in (LECTURES | SEMINARS).items():
            for contract in contracts:
                actual = subprocess.check_output(["git", "show", f"{branch}:contracts/{contract}"], cwd=repo)
                assert actual == baseline(f"contracts/{contract}")


def main() -> None:
    validate_topology_and_isolation()
    validate_equivalence()
    with tempfile.TemporaryDirectory(prefix="api-course-validation-") as directory:
        root = Path(directory)
        validate_lectures(root)
        validate_seminars(root)
    print("local repository validation: PASS")


if __name__ == "__main__":
    main()
