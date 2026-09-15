"""HTTP-клиент с общим пулом соединений на время работы приложения."""
import os
from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from docs import enable_local_docs


@asynccontextmanager
async def lifespan(app):
    # Создаём клиент один раз при запуске. with закроет пул при остановке.
    with httpx.Client(base_url=os.environ["READ_API_URL"], timeout=2) as client:
        app.state.read_api = client
        yield


app = FastAPI(title="OfficeManager — HTTP-клиент", version="2.0.0",
              docs_url=None, lifespan=lifespan)
enable_local_docs(app)


@app.get("/offices/{office_id}/forecast")
def get_forecast(office_id: int, days: int = 1):
    try:
        response = app.state.read_api.get(f"/offices/{office_id}/forecast", params={"days": days})
    except httpx.RequestError:
        return JSONResponse(status_code=503, content={"error": {"code": "upstream_unavailable", "message": "Read API недоступен"}})
    return JSONResponse(status_code=response.status_code, content=response.json())
