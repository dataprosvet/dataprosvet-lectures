"""Служебный экспорт автоматически созданных описаний, не код первого урока."""
import json
from pathlib import Path
from read_api import app as read
from bank_offices import app as bank
from office_manager import app as manager

if __name__ == "__main__":
    folder = Path(__file__).parent / "contracts"
    folder.mkdir(exist_ok=True)
    for name, app in [("read-api", read), ("bank-offices", bank), ("office-manager", manager)]:
        (folder / f"{name}.json").write_text(json.dumps(app.openapi(), ensure_ascii=False, indent=2) + "\n")
