"""Проверка запущенных моков; запускается на хосте обычным Python."""
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError


def request(port, path, status, data=None):
    body = json.dumps(data).encode() if data is not None else None
    req = Request(f"http://127.0.0.1:{port}{path}", data=body, headers={"Content-Type": "application/json"})
    try:
        response = urlopen(req, timeout=10)
    except HTTPError as error:
        response = error
    assert response.code == status, (path, response.code)
    return json.loads(response.read())

assert len(request(8000, "/offices/42/forecast?days=1", 200)["points"]) == 24
assert len(request(8000, "/offices/42/forecast?days=7", 200)["points"]) == 168
request(8000, "/offices/999/forecast", 404)
request(8000, "/offices/43/forecast", 404)
request(8000, "/offices/42/forecast?days=30", 422)
request(8001, "/observations", 201, {"office_id":42, "visitors":45})
request(8001, "/observations", 201, {"office_id":42, "visitors":45})
request(8001, "/observations", 422, {"office_id":42, "visitors":-1})
request(8002, "/offices/42/forecast?days=1", 200)
print("9 live HTTP checks passed")
