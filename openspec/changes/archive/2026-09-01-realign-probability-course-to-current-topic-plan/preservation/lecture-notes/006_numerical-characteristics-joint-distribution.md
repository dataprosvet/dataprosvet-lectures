# Лекция № 6. Числовые характеристики и совместное распределение

## Блок 1. Одномерные характеристики

| Характеристика | Формула | Смысл / условие |
|---|---|---|
| Ожидание | $E[X]=\sum_kx_kp_k$ | центр; ряд абсолютно сходится |
| Функция величины | $E[g(X)]=\sum_kg(x_k)p_k$ | ожидание без построения отдельного ряда |
| Линейность | $E[aX+bY+c]=aE[X]+bE[Y]+c$ | независимость не требуется |
| Дисперсия | $\operatorname{Var}(X)=E[(X-E[X])^2]$ | квадрат разброса |
| Вычислительная форма | $\operatorname{Var}(X)=E[X^2]-(E[X])^2$ | $E[X^2]=\sum_kx_k^2p_k$ |
| Стандартное отклонение | $\sigma(X)=\sqrt{\operatorname{Var}(X)}$ | единицы совпадают с единицами $X$ |
| Линейное преобразование | $E[aX+b]=aE[X]+b$, $\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)$ | сдвиг не меняет разброс |

## Блок 2. Суммы и именованные законы

| Формула | Условие |
|---|---|
| $\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y)$ | общая формула |
| $\operatorname{Var}(X-Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)-2\operatorname{Cov}(X,Y)$ | общая формула |
| $\operatorname{Var}(X\pm Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)$ | только при $\operatorname{Cov}(X,Y)=0$, в частности при независимости |
| $X\sim\operatorname{Bin}(n,p)$ | $E[X]=np$, $\operatorname{Var}(X)=np(1-p)$ |
| $X\sim\operatorname{Pois}(\lambda)$ | $E[X]=\operatorname{Var}(X)=\lambda$ |

Для ИДЗ 6.3 независимость не дана: сначала применяется общая формула с ковариацией; частный ответ без ковариации разрешён только при явно добавленном условии.

## Блок 3. Совместное распределение

| Элемент | Формула |
|---|---|
| Совместная масса | $p_{ij}=P(X=x_i,Y=y_j)$, $p_{ij}\ge0$, $\sum_i\sum_jp_{ij}=1$ |
| Маргинальная масса $X$ | $P(X=x_i)=\sum_jp_{ij}$ |
| Маргинальная масса $Y$ | $P(Y=y_j)=\sum_ip_{ij}$ |
| Условная масса | $P(Y=y_j\mid X=x_i)=\dfrac{p_{ij}}{P(X=x_i)}$ при положительном знаменателе |
| Независимость | $p_{ij}=P(X=x_i)P(Y=y_j)$ для **всех** ячеек |

## Блок 4. Ковариация и корреляция

| Понятие | Формула / ограничение |
|---|---|
| Ковариация | $\operatorname{Cov}(X,Y)=E[(X-E[X])(Y-E[Y])]=E[XY]-E[X]E[Y]$ |
| Смешанный момент | $E[XY]=\sum_i\sum_jx_iy_jp_{ij}$ |
| Корреляция | $\rho_{XY}=\dfrac{\operatorname{Cov}(X,Y)}{\sigma(X)\sigma(Y)}$, если обе дисперсии положительны |
| Границы | $-1\le\rho_{XY}\le1$ |
| Логика | независимость $\Rightarrow\operatorname{Cov}=0$; обратное в общем случае неверно; корреляция не доказывает причинность |

## Связанные семинары

- [Семинар 11](../seminars/111_expectation-variance-standard-deviation.md)
- [Семинар 12](../seminars/112_linear-transformations-binomial-poisson.md)
- [Семинар 13](../seminars/113_discrete-cdf-joint-distributions.md)
