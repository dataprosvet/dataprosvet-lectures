from fastapi.testclient import TestClient
from read_api import app as read
from bank_offices import app as bank


def test_read_is_fixed_and_errors_are_distinct():
    client = TestClient(read)
    first = client.get("/offices/42/forecast?days=1")
    assert first.status_code == 200
    assert len(first.json()["points"]) == 24
    assert client.get("/offices/42/forecast?days=1").json() == first.json()
    assert len(client.get("/offices/42/forecast?days=7").json()["points"]) == 168
    assert client.get("/offices/43/forecast").json()["error"]["code"] == "forecast_not_ready"
    assert client.get("/offices/999/forecast").json()["error"]["code"] == "office_not_found"
    assert client.get("/offices/42/forecast?days=30").status_code == 422


def test_post_is_a_mock_without_storage():
    client = TestClient(bank)
    for _ in range(2):
        assert client.post("/observations", json={"office_id":42,"visitors":45}).status_code == 201
    assert client.post("/observations", json={"office_id":42,"visitors":-1}).status_code == 422
    assert client.post("/observations", json={"office_id":999,"visitors":45}).status_code == 404


def test_manager_reuses_client_and_closes_it(monkeypatch):
    import httpx
    from office_manager import app
    monkeypatch.setenv("READ_API_URL", "http://read-api:8000")
    with TestClient(app) as caller:
        shared = app.state.read_api
        assert not shared.is_closed
        paths = []
        def answer(path, params):
            paths.append((path, params))
            return httpx.Response(200, json={"office_id": 42})
        monkeypatch.setattr(shared, "get", answer)
        for _ in range(2):
            assert caller.get("/offices/42/forecast?days=7").json() == {"office_id": 42}
            assert app.state.read_api is shared
        assert paths == [("/offices/42/forecast", {"days": 7})] * 2
    assert shared.is_closed
