"""Validate a single-file OpenAPI 3.2.1 document and inline examples, offline."""
import argparse
import json
from pathlib import Path
from urllib.parse import unquote
import yaml
from jsonschema import Draft202012Validator, FormatChecker
from openapi_spec_validator import validate_spec


def resolve(doc, value):
    seen = set()
    while isinstance(value, dict) and "$ref" in value:
        reference = value["$ref"]
        if reference in seen:
            raise ValueError(f"Циклическая ссылка вне схемы: {reference}")
        seen.add(reference)
        if not reference.startswith("#/"):
            raise ValueError(f"Используйте локальные #/ ссылки в одном файле: {reference}")
        value = doc
        for token in unquote(reference[2:]).split("/"):
            value = value[token.replace("~1", "/").replace("~0", "~")]
    return value


def validate_value(doc, schema, value):
    # Keep components at the document root so local JSON Pointers work in nested schemas.
    root_schema = {**doc, "allOf": [schema]}
    Draft202012Validator(root_schema, format_checker=FormatChecker()).validate(value)


def validate_document(doc):
    if doc.get("openapi") != "3.2.1":
        raise ValueError("Ожидается явно закреплённая OpenAPI 3.2.1")
    checked = 0

    def walk(node):
        nonlocal checked
        if isinstance(node, list):
            for value in node:
                walk(value)
        elif isinstance(node, dict):
            if "$ref" in node:
                resolve(doc, node)  # No remote retrieval; fail early on broken local pointers.
            if "schema" in node:
                schema = node["schema"]
                if "example" in node:
                    validate_value(doc, schema, node["example"])
                    checked += 1
                examples = node.get("examples", {})
                if isinstance(examples, dict):
                    for example in examples.values():
                        example = resolve(doc, example)
                        if "externalValue" in example:
                            raise ValueError("Встройте пример через value: для автономной проверки")
                        if "value" in example:
                            validate_value(doc, schema, example["value"])
                            checked += 1
            # JSON Schema's examples array and legacy example at schema nodes.
            if ("type" in node or "$ref" in node or "allOf" in node) and "schema" not in node:
                if isinstance(node.get("examples"), list):
                    for value in node["examples"]:
                        validate_value(doc, node, value)
                        checked += 1
                if "example" in node:
                    validate_value(doc, node, node["example"])
                    checked += 1
            for key, value in node.items():
                if key not in {"example", "examples", "default", "enum", "const"}:
                    walk(value)
    walk(doc)
    validate_spec(doc)
    return checked


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    for path in parser.parse_args().paths:
        doc = yaml.safe_load(path.read_text())
        count = validate_document(doc)
        print(f"OK {path}: OpenAPI 3.2.1, ссылки, {count} примеров")


if __name__ == "__main__":
    main()
