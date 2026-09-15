"""Мок приёма JSON: данные возвращаются в ответе, но не сохраняются."""
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from docs import enable_local_docs

app = FastAPI(title="BankOffices — мок", version="2.0.0", docs_url=None)
enable_local_docs(app)


@app.get("/offices/{office_id}")
def get_office(office_id: int):
    if office_id not in (42, 43):
        return JSONResponse(status_code=404, content={"error": {"code": "office_not_found", "message": "Офис не найден"}})
    return {"id": office_id, "name": "Учебный офис", "employees": 3}


@app.post("/observations")
def add_observation(observation: dict):
    # Для урока проверяем лишь два поля; это не полная валидация наблюдения.
    visitors = observation.get("visitors")
    if type(visitors) is not int or visitors < 0:
        return JSONResponse(status_code=422, content={"error": {"code": "invalid_request", "message": "visitors — целое число, не меньше нуля"}})
    if observation.get("office_id") not in (42, 43):
        return JSONResponse(status_code=404, content={"error": {"code": "office_not_found", "message": "Офис не найден"}})
    # Имитируем успешное создание. При повторе снова 201, записи в БД нет.
    return JSONResponse(status_code=201, content={"id": "mock-observation", "observation": observation})
