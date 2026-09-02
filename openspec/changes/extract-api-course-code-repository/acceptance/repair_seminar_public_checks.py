from build_repositories import SOURCE, STUDENT, TEACHER, copy_file, run


for repo in (STUDENT, TEACHER):
    run("git", "switch", "seminar/03-http-diagnostics", cwd=repo)
    copy_file(SOURCE / "validation/check_http_scenarios.py", repo / "tools/check_http_scenarios.py")
    run("git", "add", "--", "tools/check_http_scenarios.py", cwd=repo)
    run("git", "commit", "-m", "Add branch-local HTTP scenario check", cwd=repo)

    run("git", "switch", "seminar/04-integration-style-selection", cwd=repo)
    copy_file(SOURCE / "validation/check_artifact.py", repo / "tools/check_artifact.py")
    copy_file(SOURCE / "requirements.txt", repo / "requirements.txt")
    run("git", "add", "--", "tools/check_artifact.py", "requirements.txt", cwd=repo)
    run("git", "commit", "-m", "Add branch-local ADR validation", cwd=repo)
    run("git", "switch", "main", cwd=repo)
