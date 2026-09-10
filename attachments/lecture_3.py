"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

import random
from fractions import Fraction

rng = random.Random(42)
n_trials = 400_000

suits = ["hearts", "diamonds", "clubs", "spades"]
ranks = range(9)  # В каждой масти девять карт.
deck = [(suit, rank) for suit in suits for rank in ranks]

first_heart = 0
first_and_second_hearts = 0
two_hearts_then_spade = 0

for _ in range(n_trials):
    first, second, third = rng.sample(deck, 3)

    event_a = first[0] == "hearts"
    event_b = second[0] == "hearts"
    event_c = third[0] == "spades"

    if event_a:
        first_heart += 1
    if event_a and event_b:
        first_and_second_hearts += 1
    if event_a and event_b and event_c:
        two_hearts_then_spade += 1

empirical_conditional = first_and_second_hearts / first_heart
empirical_joint_two = first_and_second_hearts / n_trials
empirical_three = two_hearts_then_spade / n_trials

exact_conditional = Fraction(8, 35)
exact_joint_two = Fraction(9, 36) * Fraction(8, 35)
false_independent_joint = Fraction(1, 4) * Fraction(1, 4)
exact_three = Fraction(9, 36) * Fraction(8, 35) * Fraction(9, 34)

print("Вторая черва при условии первой червы")
print(f"  теория:     {float(exact_conditional):.6f} = {exact_conditional}")
print(f"  эксперимент:{empirical_conditional:.6f}")

print("\nПервые две карты червовые")
print(f"  теория:     {float(exact_joint_two):.6f} = {exact_joint_two}")
print(f"  эксперимент:{empirical_joint_two:.6f}")
print(f"  ложная независимость: {float(false_independent_joint):.6f}")

print("\nДве червы, затем пика")
print(f"  теория:     {float(exact_three):.6f} = {exact_three}")
print(f"  эксперимент:{empirical_three:.6f}")

