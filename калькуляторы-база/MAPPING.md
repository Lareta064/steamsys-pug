# Маппинг калькуляторов TLV: сайт(55) ↔ app-код ↔ build

Источник кодов: `data-calc` в `calc-N.html`. App-данные: `../calculators.json`, `../UQS_*.csv`.

Пересборка 2026-07-15: `build/` был откачен до чистых 17 боевых, 22 калькулятора
(этапы 2 согласно скриншоту клиента) собраны **заново с нуля** — каждый по
собственным полям/формулам из `calculators.json`+`UQS_IOTABLE.csv`+`UQS_LABEL.csv`,
без клонирования разметки/формул соседних калькуляторов (только generic-инфраструктура
`js/main.js`: colebrook/velAndLoss/steamState/Units/PIPE_TABLE/INS_LAMBDA переиспользована).

Статусы: **✅ боевой** (этап 1, calc-1..17) · **🆕 собран этап 2** (22 новых, эта сессия) ·
**⬜ не собран** (вне текущего скоупа — воздух/газ/стоимость энергии и др.).

| # | Slug сайта | App-код | build | Статус |
|---|---|---|---|---|
| 1 | steam-pipe-sizing-by-pressure-loss | 11110 | calc-1 | ✅ боевой |
| 2 | steam-pipe-sizing-by-velocity | 11120 | calc-2 | ✅ боевой |
| 3 | steam-pipe-sizing-for-steam-vent | 11130 | — | ⬜ не собран |
| 4 | steam-pressure-loss-through-piping | 11140 | calc-3 | ✅ боевой |
| 5 | steam-velocity-through-piping | 11150 | calc-4 | ✅ боевой |
| 6 | steam-flow-rate-through-piping | 11160 | calc-5 | ✅ боевой |
| 7 | steam-economical-insulation-piping | 11470 | calc-39 | 🆕 собран (с нуля) |
| 8 | steam-valve-orifice-cv-kvs | 11220 | calc-6 | ✅ боевой |
| 9 | steam-flow-rate-through-valve | 11210 | calc-7 | ✅ боевой |
| 10 | steam-flow-rate-through-orifice | 11230 | calc-8 | ✅ боевой |
| 11 | condensate-load-piping-start-up | 11310 | calc-9 | ✅ боевой |
| 12 | condensate-load-heating-liquid-continuous | 11330 | calc-10 | ✅ боевой |
| 13 | condensate-load-heating-liquid-batch | 11331 | calc-11 | ✅ боевой |
| 14 | condensate-load-heating-air | 11340 | calc-12 | ✅ боевой |
| 15 | condensate-load-radiant-heat-loss | 11320 | calc-13 | ✅ боевой |
| 16 | stall-point | 11350 | calc-18 | 🆕 собран (с нуля) |
| 17 | steam-dryness-pressure-reduction | 11440 | calc-19 | 🆕 собран (с нуля) |
| 18 | steam-dryness-condensate-separation | 11450 | calc-20 | 🆕 собран (с нуля) |
| 19 | temperature-drop-steam-air-mixture | 11460 | calc-21 | 🆕 собран (с нуля) |
| 20 | air-volume-steam-mixture | 11461 | calc-22 | 🆕 собран (с нуля) |
| 21 | energy-unit-cost | 11420 | — | ⬜ не собран |
| 22 | steam-unit-cost | 11430 | — | ⬜ не собран |
| 23 | boiler-efficiency | 11410 | — | ⬜ не собран |
| 24 | economic-analysis-open-recovery | 12110 | calc-31 | 🆕 собран (с нуля) |
| 25 | economic-analysis-closed-recovery | 12120 | calc-32 | 🆕 собран (с нуля) |
| 26 | economic-analysis-heat-exchanger | 12130 | calc-33 | 🆕 собран (с нуля) |
| 27 | economic-analysis-flash-steam | 12140 | calc-34 | 🆕 собран (с нуля) |
| 28 | pipe-sizing-equipment-trap | 12210 | calc-35 | 🆕 собран (с нуля) |
| 29 | pipe-sizing-recovery-line-pressure-loss | 12220 | calc-36 | 🆕 собран (с нуля) |
| 30 | pipe-sizing-recovery-line-velocity | 12221 | calc-37 | 🆕 собран (с нуля) |
| 31 | pipe-sizing-pump-outlet | 12230 | calc-38 | 🆕 собран (с нуля) |
| 32 | flash-steam-generation | 12310 | calc-14 | ✅ боевой |
| 33 | water-pipe-sizing-pressure-loss | 13110 | calc-23 | 🆕 собран (с нуля) |
| 34 | water-pipe-sizing-velocity | 13120 | calc-24 | 🆕 собран (с нуля) |
| 35 | water-pressure-loss-through-piping | 13130 | calc-25 | 🆕 собран (с нуля) |
| 36 | water-velocity-through-piping | 13140 | calc-26 | 🆕 собран (с нуля) |
| 37 | water-flow-rate-through-piping | 13150 | calc-27 | 🆕 собран (с нуля) |
| 38 | water-piping-insulation-thickness | 13500 | — | ⬜ не собран |
| 39 | water-valve-orifice-cv-kvs | 13300 | calc-29 | 🆕 собран (с нуля) |
| 40 | water-flow-rate-through-valve | 13200 | calc-28 | 🆕 собран (с нуля) |
| 41 | water-flow-rate-through-orifice | 13400 | calc-30 | 🆕 собран (с нуля) |
| 42 | air-pipe-sizing-pressure-loss | 14110 | — | ⬜ не собран |
| 43 | air-pipe-sizing-velocity | 14120 | — | ⬜ не собран |
| 44 | air-pressure-loss-through-piping | 14130 | — | ⬜ не собран |
| 45 | air-velocity-through-piping | 14150 | — | ⬜ не собран |
| 46 | air-flow-rate-through-piping | 14160 | — | ⬜ не собран |
| 47 | air-valve-orifice-cv-kvs | 14300 | — | ⬜ не собран |
| 48 | air-flow-rate-through-valve | 14200 | — | ⬜ не собран |
| 49 | air-flow-rate-through-orifice | 14400 | — | ⬜ не собран |
| 50 | condensate-rate-compressed-air | 14500 | — | ⬜ не собран |
| 51 | humid-air-table | 14600 | — | ⬜ не собран |
| 52 | gas-pressure-loss-through-piping | 14140 | — | ⬜ не собран |
| 53 | steam-table-pressure | 11510 | calc-15 | ✅ боевой |
| 54 | steam-table-temperature | 11520 | calc-16 | ✅ боевой |
| 55 | superheated-steam-table | 11530 | calc-17 | ✅ боевой |

**Итого: 39 / 55 собрано** (17 боевых + 22 новых). Остальные 16 — вне скоупа
скриншота клиента (воздух/газ, стоимость энергии/пара, КПД котла, вестовая труба,
изоляция охл. воды).

## Значимые находки при пересборке (см. комментарии в js/main.js)

- **11450**: формула X'1 в LaTeX-источнике даёт >100% (нефизично) — исправлена
  по аналогии с соседней формулой X1 (замена `/(ηs·100)` → `/(ηs/100)`).
- **12220**: LaTeX содержит лишний множитель `g` в Δp — отсутствует в
  сестринской 12221 и во всех остальных формулах потерь давления, не применяется.
- **12130**: LaTeX делит Hr на `hfg` (скрытая теплота пара) — даёт физически
  абсурдный результат (~1 Вт вместо ~550 кВт при реалистичных входах).
  Заменено на явную формулу сенсибельного тепла (проверено по константе
  1.163 кВт/(м³/ч·°C) для воды).
- **12110/12120**: поля `TempOfMix`/`RecoveryPress` есть в IOTABLE, но не
  используются ни в одной формуле — исключены из форм как мёртвые.
- **13110**: поле `WtrPress` не используется формулой (плотность воды
  не зависит от давления в этой модели) — исключено из формы.
- **Ce (EnergyUnitCost)** подтверждено как **$/кДж** через `variables_desc`
  в `calculators.json` (не $/МДж, как предполагалось по `UQS_UNIT.csv`).
- **12130 LiquidName**: SG/Cp для морской воды/керосина/этанола/глицерина —
  инженерные справочные значения, НЕ из TLV-данных (LiquidName сам по себе
  не участвует в формуле, только задаёт лейбл — Gravity/SpecHeat редактируемы).

## Примечания
- App-набор = 69 кодов. Вне списка сайта: конверторы единиц 15110–15122,
  11360 (Stall point для воздуха).
- Порядок файлов `calc-N.html` не совпадает с нумерацией сайта — ориентироваться
  на app-код.
- Схемы формул (`_i.png`) для всех 22 новых калькуляторов извлечены из APK
  в `build/img/calc/<код>.png`.
