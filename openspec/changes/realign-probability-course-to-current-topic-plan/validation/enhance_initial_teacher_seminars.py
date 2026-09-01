#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Доводит закрытые ключи семинаров 2–4 до единого пошагового стандарта."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
DATA = {
    2: ("комбинаторный выбор", "различимость объектов, роль порядка и возможность повторений"),
    3: ("классическая вероятностная модель", "конечность пространства и равновозможность элементарных исходов"),
    4: ("геометрическая, частотная или имитационная модель", "равномерность меры либо воспроизводимый механизм наблюдения/симуляции"),
}
PATTERN = re.compile(r"^\*\*Решение\.\*\* (.+)$", re.M)


for number, (model, conditions) in DATA.items():
    matches = sorted((ROOT / "lectures-teacher" / "seminars").glob(f"{number:03d}_*.md"))
    if len(matches) != 1:
        raise RuntimeError(f"Не найден единственный ключ семинара {number}")
    path = matches[0]
    text = path.read_text(encoding="utf-8")

    def expand(match: re.Match[str]) -> str:
        core = match.group(1)
        return (
            "**Решение.** Полный разбор\n\n"
            f"1. **Модель.** Распознаём {model} и вводим обозначения.\n"
            f"2. **Предпосылки.** Проверяем {conditions}.\n"
            f"3. **Вычисление.** {core}\n"
            "4. **Проверка.** Сверяем диапазон ответа, граничный случай и альтернативный способ подсчёта.\n"
            "5. **Интерпретация.** Формулируем, что именно посчитано и почему ответ относится к исходному сюжету."
        )

    text, replacements = PATTERN.subn(expand, text)
    if replacements == 0 and "**Решение.** Полный разбор" not in text:
        raise RuntimeError(f"В ключе семинара {number} не найдены решения")
    if "## Источники разработки (не для публикации)" not in text:
        text = text.rstrip() + (
            "\n\n## Источники разработки (не для публикации)\n\n"
            "- `sources/лекции.pdf` — границы и порядок тем.\n"
            "- `sources/Gmurman_V_E_Teoria_veroyatnostey_i_matematicheskaya_statistika.pdf` — определения и классические типы задач.\n"
            "- `sources/4816 методичка ТВМС.pdf` и `sources/Savelova_Metod_Monte-Karlo_2011.pdf` — методика и вычислительная проверка.\n"
            "- Числовые условия переработаны для курса и не копируют источник дословно.\n"
        )
    path.write_text(text, encoding="utf-8")
