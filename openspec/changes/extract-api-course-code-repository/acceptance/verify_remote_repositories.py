from __future__ import annotations

import json
import subprocess
from pathlib import Path

from build_repositories import LECTURES, SEMINARS, STUDENT, TEACHER


REPOSITORIES = {
    "TheTonyPub/api-technologies-code": STUDENT,
    "TheTonyPub/api-technologies-code-teacher": TEACHER,
}
EXPECTED = {"main", *LECTURES, *SEMINARS}


def output(*args: str, cwd: Path | None = None) -> str:
    return subprocess.check_output(args, cwd=cwd, text=True)


for name, local in REPOSITORIES.items():
    metadata = json.loads(output("gh", "repo", "view", name, "--json", "nameWithOwner,visibility,defaultBranchRef,isPrivate,url"))
    assert metadata["nameWithOwner"] == name
    assert metadata["visibility"] == "PRIVATE" and metadata["isPrivate"] is True
    assert metadata["defaultBranchRef"]["name"] == "main"
    assert output("git", "remote", "get-url", "origin", cwd=local).strip() == f"git@github.com:{name}.git"

    remote_data = json.loads(output("gh", "api", f"repos/{name}/branches?per_page=100"))
    remote = {item["name"]: item["commit"]["sha"] for item in remote_data}
    local_heads = {
        branch: output("git", "rev-parse", branch, cwd=local).strip()
        for branch in EXPECTED
    }
    assert set(remote) == EXPECTED, (name, set(remote) ^ EXPECTED)
    assert remote == local_heads, (name, remote, local_heads)

    for branch in EXPECTED:
        output("gh", "api", f"repos/{name}/contents/README.md?ref={branch}")

student_main = output("git", "show", "main:README.md", cwd=STUDENT)
assert "api-technologies-code-teacher" not in student_main
print("remote repository validation: PASS")
