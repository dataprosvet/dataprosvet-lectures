FROM python:3.12.14-slim-bookworm AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app
COPY requirements-runtime.txt ./
RUN pip install --no-cache-dir --only-binary=:all: -r requirements-runtime.txt \
    && groupadd --gid 10001 seminar && useradd --uid 10001 --gid seminar --no-create-home seminar
COPY *.py forecast.json ./
COPY web/ web/
COPY static/ static/
COPY contracts/ contracts/
COPY openapi-template.yaml ./
USER seminar
CMD ["python", "-m", "uvicorn", "read_api:app", "--host", "0.0.0.0", "--port", "8000"]

FROM runtime AS tools
USER root
COPY requirements.txt ./
RUN pip install --no-cache-dir --only-binary=:all: -r requirements.txt
COPY tests/ tests/
COPY smoke.py ./
USER seminar
CMD ["python", "-m", "pytest", "-q"]
