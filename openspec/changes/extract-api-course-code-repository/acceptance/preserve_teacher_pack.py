from build_repositories import SOURCE, TEACHER, copy_tree, run


run("git", "switch", "main", cwd=TEACHER)
copy_tree(SOURCE, TEACHER / "source-baseline")
readme = (TEACHER / "README.md").read_text(encoding="utf-8")
note = """

## Полный исходный instructor pack

`source-baseline/` сохраняет проверенный до миграции baseline: исходные lecture demos,
student starters, instructor solutions/checks, contracts, synthetic fixtures и внутреннюю
validation-инфраструктуру. Каталог закрытый и не предназначен для выдачи студентам.
Учебная работа и проверка ведутся в зеркальных `lecture/*` и `seminar/*` ветках.
"""
if "## Полный исходный instructor pack" not in readme:
    (TEACHER / "README.md").write_text(readme.rstrip() + note, encoding="utf-8")
run("git", "add", "--", "README.md", "source-baseline", cwd=TEACHER)
run("git", "commit", "-m", "Preserve complete instructor validation baseline", cwd=TEACHER)
