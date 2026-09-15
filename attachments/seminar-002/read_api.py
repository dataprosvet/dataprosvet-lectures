"""Мок: выбираем заранее подготовленный ответ по параметрам запроса."""
import json
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from docs import enable_local_docs

app = FastAPI(title="Read API — мок", version="2.0.0", docs_url=None)
enable_local_docs(app)
# Разрешаем неизменённой web-странице обращаться с порта 8003 на 8000.
app.add_middleware(CORSMiddleware, allow_origins=[os.environ["WEB_ORIGIN"]], allow_methods=["GET"])
forecast = json.loads((Path(__file__).parent / "forecast.json").read_text())


@app.get("/offices/{office_id}")
def get_office(office_id: int):
    if office_id not in (42, 43):
        return JSONResponse(status_code=404, content={"error": {"code": "office_not_found", "message": "Офис не найден"}})
    return {"id": office_id, "name": "Учебный офис", "employees": 3}


@app.get("/offices/{office_id}/forecast")
def get_forecast(office_id: int, days: int = 1):
    if days not in (1, 7):
        return JSONResponse(status_code=422, content={"error": {"code": "invalid_request", "message": "days должен быть 1 или 7"}})
    if office_id == 43:
        return JSONResponse(status_code=404, content={"error": {"code": "forecast_not_ready", "message": "Прогноз ещё не готов"}})
    if office_id != 42:
        return JSONResponse(status_code=404, content={"error": {"code": "office_not_found", "message": "Офис не найден"}})
    # Только выбираем часть фиксированного JSON. Ничего не рассчитываем и не сохраняем.
    return {**forecast, "days": days, "points": forecast["points"][:days * 24]}
