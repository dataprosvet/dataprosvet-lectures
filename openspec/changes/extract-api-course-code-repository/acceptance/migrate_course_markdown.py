from __future__ import annotations

import re
from pathlib import Path


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


def migrate_paths(text: str) -> str:
    text = re.sub(
        r"PYTHONPATH=attachments/api-learning-path \.venv/bin/pytest -q attachments/api-learning-path/lecture-demos/test_checkpoints\.py(?: -k '[^']+')?",
        ".venv/bin/pytest -q tests",
        text,
    )
    text = text.replace(
        "PYTHONPATH=attachments/api-learning-path .venv/bin/python attachments/api-learning-path/lecture-demos/run_checkpoint.py",
        ".venv/bin/python checkpoint.py",
    )
    text = text.replace(
        "PYTHONPATH=attachments/api-learning-path .venv/bin/python attachments/api-learning-path/validation/check_http_scenarios.py",
        ".venv/bin/python tools/check_http_scenarios.py",
    )
    text = text.replace(
        "PYTHONPATH=attachments/api-learning-path .venv/bin/python attachments/api-learning-path/validation/check_artifact.py",
        ".venv/bin/python tools/check_artifact.py",
    )
    text = text.replace(
        "PYTHONPATH=attachments/api-learning-path .venv/bin/uvicorn practicals.<profile>.pr05.starter.app:app --app-dir attachments/api-learning-path",
        ".venv/bin/uvicorn app:app --app-dir profiles/<profile>/practical/starter",
    )
    text = text.replace(
        ".venv/bin/uvicorn reference_api:app --app-dir attachments/api-learning-path",
        ".venv/bin/uvicorn reference_api:app --app-dir .",
    )
    text = text.replace("attachments/api-learning-path/requirements.txt", "requirements.txt")
    text = text.replace("attachments/api-learning-path/lecture-demos/sii-cpp", "cpp")
    text = text.replace("attachments/api-learning-path/contracts", "contracts")
    text = text.replace("attachments/api-learning-path/contracts/", "contracts/")
    text = text.replace("attachments/api-learning-path/synthetic-data/", "synthetic-data/")
    text = re.sub(
        r"attachments/api-learning-path/practicals/<profile>/pr\d{2}/starter",
        "profiles/<profile>/practical/starter",
        text,
    )
    text = re.sub(
        r"attachments/api-learning-path/practicals/<profile>/pr\d{2}/public-checks",
        "profiles/<profile>/practical/public-checks",
        text,
    )
    text = re.sub(
        r"attachments/api-learning-path/homeworks/<profile>/hw\d{2}/starter",
        "profiles/<profile>/homework/starter",
        text,
    )
    text = text.replace("PYTHONPATH=attachments/api-learning-path ", "")
    return text


for relative, branch in FILES.items():
    path = COURSE / relative
    original = path.read_text(encoding="utf-8")
    lines = original.splitlines()
    assert lines and lines[0].startswith("# "), relative
    url = f"{REMOTE}/{branch}"
    if relative.startswith("lectures-teacher/"):
        notice = f"> Код к лекции: [{branch}]({url}) в приватном student-репозитории. Команды ниже выполняются из корня этой ветки после получения доступа."
    elif relative.startswith("seminars/"):
        notice = f"> Код практической работы: [{branch}]({url}) в приватном student-репозитории. Выполняйте команды из корня ветки в своём приватном fork/репозитории."
    else:
        notice = f"> Starter и код: [{branch}]({url}) в приватном student-репозитории. Продолжайте ту же рабочую ветку, что использовалась на практике; отдельную ветку `homework/*` не создавайте."
    if notice not in original:
        lines[1:1] = ["", notice]
    migrated = migrate_paths("\n".join(lines) + ("\n" if original.endswith("\n") else ""))
    assert "attachments/api-learning-path" not in migrated, relative
    path.write_text(migrated, encoding="utf-8")

print(f"migrated course Markdown files: {len(FILES)}")
