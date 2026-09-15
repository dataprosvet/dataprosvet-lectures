"""Инструмент преподавателя: читает реальные flows mitmweb, не код урока."""
import os
import socket
from contextlib import asynccontextmanager
from pathlib import Path
import httpx
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse


@asynccontextmanager
async def lifespan(app):
    async with httpx.AsyncClient(timeout=5) as client:
        app.state.client = client
        yield


app = FastAPI(docs_url=None, redoc_url=None, lifespan=lifespan)


@app.get("/")
def page():
    return FileResponse(Path(__file__).parent / "web" / "observer.html")


@app.get("/events")
async def events():
    try:
        response = await app.state.client.get(os.environ["MITMWEB_URL"] + "/flows",
            headers={"Authorization": "Bearer " + os.environ["MITMWEB_PASSWORD"]})
        response.raise_for_status()
        manager_ip = socket.gethostbyname("office-manager")
        result = []
        for flow in response.json():
            request = flow.get("request", {})
            if not request.get("path", "").startswith(("/offices/", "/observations")):
                continue
            target = request.get("host")
            if target not in ("read-api", "bank-offices", "office-manager"):
                continue
            peer = flow.get("client_conn", {}).get("peername") or [None]
            source = "office-manager" if peer[0] == manager_ip else "client"
            reply = flow.get("response") or {}
            started = request.get("timestamp_start")
            finished = reply.get("timestamp_end")
            result.append({"id": flow["id"], "source": source, "target": target,
                "method": request["method"], "path": request["path"], "started": started,
                "status": reply.get("status_code"), "error": bool(flow.get("error")),
                "ms": round((finished - started) * 1000, 1) if finished and started else None})
        return {"events": sorted(result, key=lambda event: event["started"] or 0)[-150:]}
    except (httpx.HTTPError, ValueError, OSError):
        return JSONResponse(status_code=503, content={"error": "Наблюдатель не получил данные mitmweb"})


@app.post("/demo/{scenario}")
async def demo(scenario: str):
    base = os.environ["TRAFFIC_URL"]
    calls = {"forecast": (8000, "/offices/42/forecast?days=1"),
             "chain": (8002, "/offices/42/forecast?days=1"),
             "missing": (8000, "/offices/43/forecast?days=1"),
             "post": (8001, "/observations"), "invalid": (8001, "/observations")}
    if scenario not in calls:
        return JSONResponse(status_code=404, content={"error": "Неизвестный пример"})
    port, path = calls[scenario]
    try:
        if scenario in ("post", "invalid"):
            response = await app.state.client.post(f"{base}:{port}{path}",
                json={"office_id": 42, "visitors": -1 if scenario == "invalid" else 45})
        else:
            response = await app.state.client.get(f"{base}:{port}{path}")
        return {"status": response.status_code}
    except httpx.HTTPError:
        return JSONResponse(status_code=503, content={"error": "Учебный запрос не выполнен"})
