"""Подставляем настроенные публичные адреса в неизменный интерфейс страницы."""
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


@app.get("/", response_class=HTMLResponse)
def page():
    html = (Path(__file__).parent / "web" / "index.html").read_text()
    for name in ("READ_API_PUBLIC_URL", "BANK_OFFICES_PUBLIC_URL", "OFFICE_MANAGER_PUBLIC_URL"):
        html = html.replace(f"__{name}__", os.environ[name])
    return html
