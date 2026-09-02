from build_repositories import LECTURES, TEACHER, lecture_teacher_tests, run


for branch, (lecture, _, _) in LECTURES.items():
    run("git", "switch", branch, cwd=TEACHER)
    old = TEACHER / "teacher/checks/test_full_course_source.py"
    if old.exists():
        run("git", "rm", "--", "teacher/checks/test_full_course_source.py", cwd=TEACHER)
    target = TEACHER / "teacher/checks/test_instructor.py"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(lecture_teacher_tests(lecture), encoding="utf-8")
    run("git", "add", "--", "teacher/checks/test_instructor.py", cwd=TEACHER)
    run("git", "commit", "-m", f"Scope instructor checks to {branch}", cwd=TEACHER)

run("git", "switch", "main", cwd=TEACHER)
