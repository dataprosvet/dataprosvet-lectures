# Сохранённые HTTP-обмены лекции 2
Дата проверки: 2026-09-14T16:30:30.858396+00:00. Синтетические данные; это снимок, а не текущий ответ сервера. HTTP/1.1; заголовки сервера сохранены, тело — в исходных байтах рядом.

## forecast-1
```http
GET /offices/42/forecast?days=1 HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

HTTP/1.1 200 OK
date: Mon, 14 Sep 2026 16:30:29 GMT
server: uvicorn
content-length: 1288
content-type: application/json
Connection: close

```
Полное тело: [forecast-1.json](forecast-1.json).

## forecast-7
```http
GET /offices/42/forecast?days=7 HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

HTTP/1.1 200 OK
date: Mon, 14 Sep 2026 16:30:29 GMT
server: uvicorn
content-length: 7822
content-type: application/json
Connection: close

```
Полное тело: [forecast-7.json](forecast-7.json).

## invalid-days
```http
GET /offices/42/forecast?days=2 HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

HTTP/1.1 422 Unprocessable Entity
date: Mon, 14 Sep 2026 16:30:29 GMT
server: uvicorn
content-length: 86
content-type: application/json
Connection: close

```
Полное тело: [invalid-days.json](invalid-days.json).

## invalid-type
```http
GET /offices/42/forecast?days=abc HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

HTTP/1.1 422 Unprocessable Entity
date: Mon, 14 Sep 2026 16:30:29 GMT
server: uvicorn
content-length: 150
content-type: application/json
Connection: close

```
Полное тело: [invalid-type.json](invalid-type.json).

## not-ready
```http
GET /offices/43/forecast HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

HTTP/1.1 404 Not Found
date: Mon, 14 Sep 2026 16:30:29 GMT
server: uvicorn
content-length: 89
content-type: application/json
Connection: close

```
Полное тело: [not-ready.json](not-ready.json).

## observation
```http
POST /observations HTTP/1.1
Host: 127.0.0.1:8001
Accept: application/json
Content-Type: application/json
Content-Length: 30

{"office_id":42,"visitors":45}

HTTP/1.1 201 Created
date: Mon, 14 Sep 2026 16:30:29 GMT
server: uvicorn
content-length: 70
content-type: application/json
Connection: close

```
Полное тело: [observation.json](observation.json).
