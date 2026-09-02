from build_repositories import LECTURES, STUDENT, TEACHER, filtered_checkpoint_runner, run


for repo in (STUDENT, TEACHER):
    for branch, (lecture, _, _) in LECTURES.items():
        run("git", "switch", branch, cwd=repo)
        (repo / "checkpoint.py").write_text(filtered_checkpoint_runner(lecture), encoding="utf-8")
        run("git", "add", "--", "checkpoint.py", cwd=repo)
        run("git", "commit", "-m", "Fix branch-local fixture path", cwd=repo)
    run("git", "switch", "main", cwd=repo)
