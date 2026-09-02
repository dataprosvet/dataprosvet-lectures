from __future__ import annotations

import re
import subprocess
from pathlib import Path

import yaml

from build_repositories import STUDENT


COURSE = Path("/Users/ripper/vaults/Teaching/Tim/c2s3/api-technologies")
REMOTE = "https://github.com/TheTonyPub/api-technologies-code/tree"
FILES = {
    "lectures-teacher/001_api-interface-layer-and-lifecycle.md": "lecture/01-api-interface-layer",
    "lectures-teacher/002_http-rest-openapi-data-contracts.md": "lecture/02-http-rest-openapi",
    "lectures-teacher/003_integration-styles-api.md": "lecture/03-integration-styles",
    "lectures-teacher/004_python-api-services-fastapi.md": "lecture/04-fastapi-services",
    "seminars/001_api-scenarios-and-context.md": "seminar/01-api-scenarios",
    "seminars/002_rest-openapi-contract.md": "seminar/02-rest-openapi-contract",
    "seminars/003_http-api-diagnostics.md": "seminar/03-http-diagnostics",
    "seminars/004_integration-style-selection.md": "seminar/04-integration-style-selection",
    "seminars/005_fastapi-service-foundation.md": "seminar/05-fastapi-service",
    "seminars/006_fastapi-validation-openapi.md": "seminar/05-fastapi-service",
    "homeworks/001_api-scenarios.md": "seminar/01-api-scenarios",
    "homeworks/002_rest-openapi-contract.md": "seminar/02-rest-openapi-contract",
    "homeworks/003_http-api-diagnostics.md": "seminar/03-http-diagnostics",
    "homeworks/004_integration-style-decision.md": "seminar/04-integration-style-selection",
    "homeworks/005_fastapi-service.md": "seminar/05-fastapi-service",
}


def exists(branch: str, relative: str) -> bool:
    return subprocess.run(
        ["git", "cat-file", "-e", f"{branch}:{relative}"], cwd=STUDENT, capture_output=True
    ).returncode == 0


for relative, branch in FILES.items():
    text = (COURSE / relative).read_text(encoding="utf-8")
    assert f"{REMOTE}/{branch}" in text, relative
    assert "attachments/api-learning-path" not in text, relative
    assert "api-technologies-code-teacher" not in text, relative
    if relative.startswith("homeworks/"):
        assert "ту же рабочую ветку" in text and "homework/*" in text, relative
    for token in re.findall(r"`([^`]+)`", text):
        if not token.startswith(("profiles/", "contracts/", "synthetic-data/", "tools/", "cpp/")):
            continue
        candidate = token.rstrip(".,;:")
        if " " in candidate:
            continue
        for profile in ("prb", "sii") if "<profile>" in candidate else (None,):
            expanded = candidate.replace("<profile>", profile or "")
            assert exists(branch, expanded), (relative, branch, expanded)

config = yaml.safe_load((COURSE / "openspec/config.yaml").read_text(encoding="utf-8"))
context = config["context"]
for required in (
    "api-technologies-code",
    "api-technologies-code-teacher",
    "lecture/<two-digit-number>",
    "seminar/<two-digit-work-number>",
    "homework/*",
    "private student code repository",
):
    assert required in context, required

assert not (COURSE / "attachments/api-learning-path").exists(), "old executable tree still exists"
print("course cutover validation: PASS")
