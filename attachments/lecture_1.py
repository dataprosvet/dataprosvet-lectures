"""Воспроизводимый код к лекции; блоки идут в порядке материала."""

from collections import Counter
from itertools import combinations
from math import comb

girls = [f"G{i}" for i in range(1, 13)]
boys = [f"B{i}" for i in range(1, 11)]
group = girls + boys

# Перебираем все неупорядоченные команды из четырёх человек.
counts_by_boys = Counter()
eligible_teams = []

for team in combinations(group, 4):
    boys_in_team = sum(member.startswith("B") for member in team)
    counts_by_boys[boys_in_team] += 1
    if boys_in_team >= 2:
        eligible_teams.append(team)

analytic = (
    comb(10, 2) * comb(12, 2)
    + comb(10, 3) * comb(12, 1)
    + comb(10, 4) * comb(12, 0)
)

print("Все команды:", comb(22, 4))
print("По числу юношей:", dict(sorted(counts_by_boys.items())))
print("Допустимые команды, перебор:", len(eligible_teams))
print("Допустимые команды, формула:", analytic)
assert len(eligible_teams) == analytic == 4620

counts_by_boys = {0: 495, 1: 2200, 2: 2970, 3: 1440, 4: 210}
width, height = 760, 430
left, top, plot_w, plot_h = 75, 55, 620, 300
maximum = max(counts_by_boys.values())
bar_w = 80

parts = [
    f'\x3csvg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">',
    '\x3crect width="100%" height="100%" fill="white"/>',
    '\x3cstyle>text{font-family:Arial;font-size:15px}.title{font-size:20px;font-weight:bold}\x3c/style>',
    '\x3ctext class="title" x="75" y="28">Команды по числу юношей\x3c/text>',
    f'\x3cline x1="{left}" y1="{top+plot_h}" x2="{left+plot_w}" y2="{top+plot_h}" stroke="black"/>',
]

for index, (boys, count) in enumerate(counts_by_boys.items()):
    x = left + 32 + index * 120
    h = plot_h * count / maximum
    color = '#3d8dff' if boys >= 2 else '#b8bcc4'
    parts.append(f'\x3crect x="{x}" y="{top+plot_h-h}" width="{bar_w}" height="{h}" fill="{color}"/>')
    parts.append(f'\x3ctext x="{x+31}" y="{top+plot_h+24}">{boys}\x3c/text>')
    parts.append(f'\x3ctext x="{x+15}" y="{top+plot_h-h-8}">{count}\x3c/text>')

parts += [
    '\x3ctext x="250" y="410">Число юношей в команде\x3c/text>',
    '\x3c/svg>',
]
with open('lecture_1_team_counts.svg', 'w', encoding='utf-8') as file:
    file.write('\n'.join(parts))

assert sum(count for boys, count in counts_by_boys.items() if boys >= 2) == 4620

