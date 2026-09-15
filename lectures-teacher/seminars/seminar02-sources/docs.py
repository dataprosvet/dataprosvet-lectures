"""Служебная настройка локального Swagger UI; на первом занятии не разбираем."""
from pathlib import Path
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse


def enable_local_docs(app):
    app.openapi_version = "3.2.1"
    app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"))

    @app.get("/docs", include_in_schema=False)
    def docs():
        return get_swagger_ui_html(openapi_url="/openapi.json", title=app.title,
            swagger_js_url="/static/swagger-ui-bundle.js", swagger_css_url="/static/swagger-ui.css",
            swagger_favicon_url="data:,", swagger_ui_parameters={"validatorUrl": None})

    @app.get("/lecture-02/openapi.yaml", include_in_schema=False)
    def lecture_contract():
        return FileResponse(Path(__file__).parent / "contracts" / "lecture02-openapi.yaml",
                            media_type="application/yaml")

    @app.get("/lecture-02", include_in_schema=False)
    def lecture_docs():
        return get_swagger_ui_html(openapi_url="/lecture-02/openapi.yaml",
            title="Лекция 2 — авторский контракт OAS 3.2.1",
            swagger_js_url="/static/swagger-ui-bundle.js", swagger_css_url="/static/swagger-ui.css",
            swagger_favicon_url="data:,", swagger_ui_parameters={"validatorUrl": None})
