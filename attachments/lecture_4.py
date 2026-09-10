"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

from math import comb, exp, factorial, erf, sqrt
from random import Random

rng = Random(20260808)

def binom_pmf(n, p, k):
    return comb(n, k) * p**k * (1 - p)**(n - k)

def normal_cdf(z):
    return 0.5 * (1 + erf(z / sqrt(2)))

def simulate_leq(n, p, boundary, repetitions):
    hits = 0
    for _ in range(repetitions):
        successes = sum(rng.random() < p for _ in range(n))
        hits += successes <= boundary
    return hits / repetitions

# Редкие события: ровно три сбоя из 1000.
n_rare, p_rare, k = 1000, 0.002, 3
exact_rare = binom_pmf(n_rare, p_rare, k)
lam = n_rare * p_rare
poisson = exp(-lam) * lam**k / factorial(k)

# ИДЗ № 5: не более 125 стандартных деталей из 150.
n, p, boundary = 150, 0.85, 125
exact_tail = sum(binom_pmf(n, p, j) for j in range(boundary + 1))
sigma = sqrt(n * p * (1 - p))
z = (boundary + 0.5 - n * p) / sigma
laplace = normal_cdf(z)
empirical = simulate_leq(n, p, boundary, 100_000)

print("Редкие события: P(X = 3)")
print(f"  Бернулли (точно): {exact_rare:.6f}")
print(f"  Пуассон:          {poisson:.6f}")
print(f"  Ошибка:           {abs(exact_rare - poisson):.6f}")

print("\nИДЗ № 5: P(X <= 125)")
print(f"  Бернулли (точно): {exact_tail:.6f}")
print(f"  Лаплас:           {laplace:.6f}")
print(f"  Моделирование:    {empirical:.6f}")

