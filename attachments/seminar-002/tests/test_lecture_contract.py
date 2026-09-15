"""Lecture contract matches real mock responses; validation fails usefully."""
from copy import deepcopy
from pathlib import Path
import pytest
import yaml
from fastapi.testclient import TestClient
from read_api import app as read
from bank_offices import app as bank
from validate_contract import validate_document, validate_value

DOC = yaml.safe_load((Path(__file__).parents[1] / "contracts/lecture02-openapi.yaml").read_text())


def check_response(response, path, method):
    operation = DOC["paths"][path][method]
    schema = operation["responses"][str(response.status_code)]["content"]["application/json"]["schema"]
    assert response.headers["content-type"].startswith("application/json")
    validate_value(DOC, schema, response.json())


def test_document_and_negative_controls():
    assert validate_document(DOC) >= 10
    for kind in ("reference", "example", "version"):
        broken = deepcopy(DOC)
        if kind == "reference":
            broken["components"]["schemas"]["Forecast"]["properties"]["points"]["items"] = {"$ref": "#/components/schemas/Missing"}
        elif kind == "example":
            broken["paths"]["/observations"]["post"]["requestBody"]["content"]["application/json"]["example"]["visitors"] = -1
        else:
            broken["openapi"] = "3.1.0"
        with pytest.raises(Exception):
            validate_document(broken)


def test_get_responses_match_contract():
    client = TestClient(read)
    for days, count in ((1, 24), (7, 168)):
        response = client.get(f"/offices/42/forecast?days={days}")
        assert response.status_code == 200
        assert len(response.json()["points"]) == count
        check_response(response, "/offices/{office_id}/forecast", "get")
    for target, status in (("42/forecast?days=2", 422), ("42/forecast?days=abc", 422), ("abc/forecast", 422), ("43/forecast", 404), ("999/forecast", 404)):
        response = client.get("/offices/" + target)
        assert response.status_code == status
        check_response(response, "/offices/{office_id}/forecast", "get")


def test_post_and_docs_preserve_their_roles():
    client = TestClient(bank)
    for body, status in (({"office_id":42,"visitors":45},201), ({"office_id":42,"visitors":-1},422), ({"office_id":999,"visitors":45},404), ([],422)):
        response = client.post("/observations", json=body)
        assert response.status_code == status
        check_response(response, "/observations", "post")
    client = TestClient(read)
    assert '/lecture-02/openapi.yaml' in client.get('/lecture-02').text
    assert '/openapi.json' in client.get('/docs').text
    assert yaml.safe_load(client.get('/lecture-02/openapi.yaml').text) == DOC
    assert client.get('/openapi.json').json()['openapi'] == '3.2.1'
