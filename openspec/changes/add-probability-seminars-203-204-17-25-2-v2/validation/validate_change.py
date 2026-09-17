from pathlib import Path
import hashlib
import json
import math
import re

ROOT = Path(__file__).resolve().parents[4]
PAIR = {
    4: (
        ROOT / "lectures-teacher/seminars/204_total-probability-bayes-17-25-2.md",
        ROOT / "seminars/204_total-probability-bayes-17-25-2.md",
    ),
}
COUNTS = {4: 17}
SOURCE_TASKS = {
    4: ["1.6", "1.7", "1.19", "1.20", "1.22", "1.23", "1.4", "1.5", "1.16", "1.17", "1.18", "1.21", "1.8", "1.24", "1.25", "1.26", "1.27"],
}
TYPICAL_COUNTS = {4: 6}
OLD_HASHES = {
    "seminars/103_theorems-conditional-probability.md": "c62687623c81dc10dd6816cf0cd37b582c3f798207198765ee99fe4dc70e76b7",
    "seminars/104_total-probability-bayes.md": "dd041d57044d7396f680a3fa5d42763117691d9a65a9a8a1b08e1f7a96575b4e",
    "lectures-teacher/seminars/103_theorems-conditional-probability.md": "a31d754d601f89f9c999c1f16e262afeebef9ad2d86f18e1e9acd9dbe10e97b7",
    "lectures-teacher/seminars/104_total-probability-bayes.md": "5a4a0b66468b86f8a128442f91b67529a09c9730e43b21d166d157f43bab673a",
}

def sections(text):
    matches=list(re.finditer(r"^### (S\d{2}-\d{2})(?:[^\n]*)\n", text, re.M))
    return {m.group(1): text[m.end():(matches[i+1].start() if i+1 < len(matches) else len(text))]
            for i,m in enumerate(matches)}

for num,(teacher_path,public_path) in PAIR.items():
    teacher, public = teacher_path.read_text(), public_path.read_text()
    expected=[f"S{num:02d}-{i:02d}" for i in range(1,COUNTS[num]+1)]
    tsec,psec=sections(teacher),sections(public)
    public_typical={
        ident for ident in expected
        if re.search(rf"^### {ident}\b[^\n]*\bтиповая\b", public, re.M)
    }
    assert public_typical == set(expected[:TYPICAL_COUNTS[num]])
    assert list(tsec)==expected and list(psec)==expected
    assert "## Рекап формул" in teacher and "## Рекап формул" in public
    assert "## Домашний пул" in teacher and "## Домашний пул" in public
    assert "Результат после обучения" not in public
    assert not re.search(r"^### .*\b(базовая|стандартная|повышенная)\b", public, re.M|re.I)
    observed_source_tasks=[]
    for ident in expected:
        tc=re.search(r"\*\*Условие\.\*\* (.*)",tsec[ident]).group(1)
        pc=re.search(r"\*\*Условие\.\*\* (.*)",psec[ident]).group(1)
        assert tc==pc, ident
        assert "**Решение.**" in tsec[ident] and "**Ответ.**" in tsec[ident] and "**Источник.**" in tsec[ident]
        source_line=re.search(r"\*\*Источник\.\*\* ([^\n]+)", tsec[ident]).group(1)
        if num == 3:
            assert "4816 методичка ТВМС" in source_line, ident
        else:
            assert "Савёлова" in source_line, ident
        assert "PDF-страниц" in source_line, f"{ident}: source lacks an exact PDF page"
        assert re.search(r"PDF-страниц(?:а|ы) \d+", source_line), f"{ident}: malformed PDF page"
        source_task=re.search(r"(?:разобранная задача|задача|пример) (\d+\.\d+)", source_line)
        assert source_task, f"{ident}: source lacks an exact task number"
        observed_source_tasks.append(source_task.group(1))
        assert ("**Решение.**" in psec[ident]) == (ident in public_typical)
    assert observed_source_tasks == SOURCE_TASKS[num]

for rel,digest in OLD_HASHES.items():
    assert hashlib.sha256((ROOT/rel).read_bytes()).hexdigest()==digest, rel

course=(ROOT/"course.yaml").read_text()
assert "attachments/203-server-failure-risk-17-25-2.ipynb" in course
block204=course.split("- slug: total-probability-bayes-17-25-2",1)[1].split("- slug:",1)[0]
assert "temporarilyUnavailable" in block204 and "markdown:" not in block204 and "attachments:" not in block204

nb203=json.loads((ROOT/"attachments/203-server-failure-risk-17-25-2.ipynb").read_text())
assert all(c.get("execution_count") is not None for c in nb203["cells"] if c["cell_type"]=="code")
assert any(o.get("output_type")=="display_data" for c in nb203["cells"] for o in c.get("outputs",[]))

values=[1-(1-0.001)**n for n in [1,10,100,500,1000,5000]]
assert all(a<b for a,b in zip(values,values[1:]))
assert math.ceil(math.log(0.5)/math.log(0.999))==693
print("OK: 44 tasks; exact source ranges; typical-first ordering; public filtering; notebook 203; course boundary; 103/104 hashes")
