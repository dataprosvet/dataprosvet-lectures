from build_repositories import SOURCE, STUDENT, TEACHER, copy_tree, run


for repo in (STUDENT, TEACHER):
    run("git", "switch", "lecture/02-http-rest-openapi", cwd=repo)
    copy_tree(SOURCE / "lecture-demos/sii-cpp", repo / "cpp")
    run("git", "add", "--", "cpp", cwd=repo)
    run("git", "commit", "-m", "Add SII recorded-response client", cwd=repo)
    run("git", "switch", "main", cwd=repo)
