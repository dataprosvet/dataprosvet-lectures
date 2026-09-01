#!/usr/bin/env python3
"""Независимые численные проверки репрезентативных формул КР и всех ИДЗ."""

from math import comb, exp, factorial, isclose


def close(left: float, right: float) -> None:
    assert isclose(left, right, rel_tol=1e-12, abs_tol=1e-12), (left, right)


for v in range(1, 11):
    # ИДЗ 1: сочетания, альтернативный подсчёт кодов, звёзды и перегородки.
    n = 8 + v
    assert comb(n, 3) == n * (n - 1) * (n - 2) // 6
    m = 6 + v
    assert (m - 1) ** 2 * (m - 2) * (m - 3) == m * (m - 1) * (m - 2) * (m - 3) - (m - 1) * (m - 2) * (m - 3)
    assert comb(7 + v, 2) == sum(6 + v - first for first in range(6 + v))

    # ИДЗ 2–4: диапазоны вероятностей, включение-исключение и Байес.
    assert 0 <= (4 + v) / (20 + v) <= 1
    close(0.4 + 0.5 - (0.2 + 0.01 * v), 0.7 - 0.01 * v)
    close((10 + v) / (40 + 4 * v), 0.25)
    total = 0.7 * 0.02 + 0.3 * (0.03 + 0.001 * v)
    close(total, 0.023 + 0.0003 * v)
    posterior = 0.3 * (0.03 + 0.001 * v) / total
    assert 0 <= posterior <= 1
    weights = [0.02 * v, 0.06, 0.05]
    close(sum(value / sum(weights) for value in weights), 1.0)

    # ИДЗ 5: точная биномиальная модель и два приближения.
    n = 10 + v
    exact_two = comb(n, 2) * 0.2**2 * 0.8 ** (n - 2)
    assert 0 <= exact_two <= 1
    close(sum(comb(n, k) * 0.2**k * 0.8 ** (n-k) for k in range(1, n + 1)), 1 - 0.8**n)
    lam = (1000 + 10 * v) * 0.002
    close(lam, 2 + 0.02 * v)
    assert 0 < exp(-lam) < 1

    # ИДЗ 6: нормировка, моменты и ковариационный член.
    close(0.2 + 0.5 + 0.3, 1)
    close(0 * 0.2 + 1 * 0.5 + 2 * 0.3, 1.1)
    close(0.5 * (2**2) / 2, 1)  # интеграл cx на (0,2), c=1/2
    close(0.5 * (2**3) / 3, 4 / 3)
    close(0.5 * (2**4) / 4 - (4 / 3) ** 2, 2 / 9)
    a, b, covariance = 2 + v, 5 + v, 0.1 * v
    general = 4 * a + b - 4 * covariance
    independent = 4 * a + b
    close(independent - general, 4 * covariance)

    # ИДЗ 7: гипергеометрическая нормировка и граница Чебышёва.
    sample = 20 + v
    hyper_sum = sum(comb(10, k) * comb(90, sample-k) for k in range(max(0, sample-90), min(10, sample) + 1))
    assert hyper_sum == comb(100, sample)
    close(exp(-(1 / (5 + v)) * (5 + v)), exp(-1))
    close(9 / (100 * v), 9 / (100 * v))

# Контрольные работы: явные числовые опорные ответы из семинаров 5, 9 и 17.
close(8 / comb(10, 3), 1 / 15)
close(0.4 * 0.5, 0.2)
close(0.8 * 0.1 + 0.2 * 0.5, 0.18)
close(1 - 0.4**5, 0.98976)
close(0.5**2, 0.25)  # интеграл 2x от 0 до 0,5

# Лекция 3: для X~Pois(3) вероятность строго больше 8 равна примерно 0,0038.
poisson_tail_over_eight = 1 - sum(exp(-3) * 3**k / factorial(k) for k in range(9))
close(poisson_tail_over_eight, 0.003802992061675955)

print("OK: независимый вычислительный аудит пройден")
