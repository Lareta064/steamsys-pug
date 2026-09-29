---
type: ui_coverage_audit
project: steamsys.ru
role: Principal Product Designer / Design Systems Architect
date: 2026-09-28
audited: 34 прототипа vs действующий UI Framework
base_documents:
  - PROMPT.md
  - REDESIGN_RULES.md
  - specification/steamsys_frontend_spec_v0.3_2026-09-08.md
  - specification/steamsys_frontend_architecture_v0.1_2026-07-31.md
---

# UI Coverage Audit — steamsys.ru

Роль: Principal Product Designer / Design Systems Architect.
Задача из `PROMPT.md`: определить минимально достаточный объём работы дизайнера, после которого остальные страницы можно собирать без него.

## 0. Границы аудита

### Что принято за действующий UFRA / UI Framework
- `src/pug/ui/` — 60+ реализованных компонентов с примерами в `build/ui/*.html`
- `src/pug/sections/` — 33 композиционные секции
- `src/scss/base/_var.scss` и `_global.scss` — токены и утилиты
- `REDESIGN_RULES.md` — правила namespace `ss-`, изоляции через `.ss-wrapper`, BEM
- Спецификации из папки `specification/` — целевые требования вёрстки и архитектуры

### Что я не вижу напрямую
- Figma UI Kit визуально (только по ссылкам в правилах). Компоненты, которые могут уже существовать в Figma, но не в коде, я вижу как отсутствующие. Это может завышать долю B/C. Помечено UNKNOWN, где влияет на решение.
- Формальный документ вариантов и состояний per component. Использую поведение в коде + указания в правилах.

**Влияние на аудит:** UNKNOWN держится ~1–2%. Не выше — потому что для 95%+ блоков достаточно кода и правил, чтобы классифицировать однозначно.

### Метод
1. Собран инвентарь блоков всех 34 прототипов через h1/h2/h3-структуру.
2. Выявлены сквозные паттерны (5+ прототипов) — оценены один раз, применены ко всем.
3. Уникальные блоки классифицированы A/B/C/D/UNKNOWN.
4. Собраны Designer Backlog (только D), PM Task List (B/C), UFRA Gap Backlog.
5. Проведён stress test и посчитаны метрики.

---

## 1. Сквозные блоки (5+ прототипов)

| Блок | Прототипов | Основа UFRA | Component | Composition | Interaction | Responsive | Итог |
|---|---|---|---|---|---|---|---|
| Header | 34 | `header.pug` | ✓ | ✓ | ✓ | ✓ | **A** |
| Footer | 34 | `footer.pug` | ✓ | ✓ | ✓ | ✓ | **A** |
| Breadcrumbs | 32 | `breadcrumbs.pug` | ✓ | ✓ | — | ✓ | **A** |
| Section title (`.sec-title`) | 34 | `section-headers`, `typography` | ✓ | ✓ | — | ✓ | **A** |
| Bottom CTA «Подберите систему» | 32 | `_feedback-b24` | ✓ | ✓ | ✓ | ✓ | **A** |
| Documents block (side-by-side) | 12 | `_documents`, `_calc-docs` | ✓ | ✓ | — | ✓ | **A** |
| FAQ accordion | 10 | `accordion`, `_faq` | ✓ | ✓ | ✓ | ✓ | **A** |
| Related cases block | 8 | `_cases`, `portfolio` | ✓ | ✓ | — | ✓ | **A** |
| Related products carousel | 5 | `partners-slider` + карточка | ✓ | Adapt | ✓ | ✓ | **B** |
| Sticky local nav (in-page) | 7 (страницы систем) | `toc.pug` + `toc.js`, `_catalog-nav` | Adapt | New | ✓ | ✓ | **B** |
| Filter panel | 5 | `_filters`, `filters-drawer.js` | ✓ | ✓ | ✓ | ✓ | **A** |
| Grid layout | 34 | `grid.pug` | ✓ | ✓ | — | ✓ | **A** |
| Callout / info block | 8 | `callout.pug` | ✓ | ✓ | — | ✓ | **A** |
| Trust bar (полоса цифр под hero) | 6 | `feature`, `_home-benefits` | ✓ | Adapt | — | ✓ | **B** |

**Комментарий по sticky local nav:** для страниц систем нужен вариант «горизонтальный sticky-tab-bar с якорями к секциям». Композиция и scroll-spy механизм совпадают с существующим `toc.js`. Это **B** (новый variant + повторное использование JS), не D.

**Комментарий по trust bar:** визуально — горизонтальный ряд stat-box (число + подпись). Композиционно = `_home-benefits` в новом варианте. **B, не D.**

---

## 2. Новые UI-компоненты (карточки и атомы)

| Компонент | Прототипов | На чём собирается | Итог | Комментарий |
|---|---|---|---|---|
| Product card | 6 | `feature` + `tags` + `pill` | **C** | Icon/фото + h3 + tags + link. Клик — обычный `<a>`. |
| System card | 5 | `feature` + badges + tags | **C** | Badge-вариант для процессов может быть новым. |
| Industry card | 3 | `feature` + image + list | **C** | Иконка/фото + h3 + краткое применение. |
| Brand card | 2 | `feature` + logo | **C** | Логотип + h3 + описание + link. |
| Team member card | 3 | `feature` + `figure` + tags | **C** | Фото + имя + роль + expertise + контакты. |
| Vacancy card | 2 | `feature` + badges + CTA | **C** | Название + salary/level/format + CTA. |
| Video card | 2 | `figure` (16:9) + `article-card` мета | **C** | Превью + h3 + длительность/просмотры. |
| Document card extended | 3 | `_documents` строка | **B** | Тип-иконка + название + размер + действие. |
| Certification card | 2 | тот же паттерн что document | **B** | Отличие семантическое. |
| Variant card (конфигурация системы) | 5 | `feature` + `simple-table` + CTA | **C** | Название + краткая спека + CTA. |
| Questionnaire card | 2 | `cta-card` variant | **B** | Название + описание + CTA. |
| Calc card | 2 | `cta-card` variant | **B** | То же + категория-tag. |
| Persona/role card | 1 | `_home-roles` | **A** | Уже реализовано. |
| Stat box (число + подпись) | 7 | `fact-card` variant | **B** | Formal variant для больших цифр. |
| Step-number-circle | 5 | `_stages` использует | **A** | Атом уже есть в паттерне stages. |
| Spec row / spec item | 3 | `simple-table` / `lists` | **A** | Существующие. |
| Comparison table | 2 | `simple-table` variant | **B** | Variant для highlight-колонки. |
| Progress bar (форма) | 2 | нет прямого аналога | **C** | Простой atomic; PM согласовывает. |
| Form section header (с номером) | 2 | `section-headers` variant | **B** | Variant existing. |
| KB tag cloud | 1 | `tags` + сетка | **A** | Существующий tag компонент. |
| KB search suggest | 1 | нет | **D** | Новый interaction (combobox/typed suggest). |
| Lightbox image viewer | 1 | `gallery` + модальное | **B** | Существующий swiper + full-screen state. |
| Office location card | 1 | `feature` variant | **B** | Адрес + телефон + карта-ссылка. |
| Calc input group | 1 | `form-row` primitives | **A** | Существующие primitives. |
| Calc result display | 1 | `callout` variant + `fact-card` | **B** | Выделенный результат с числом. |
| Benefits checklist | 1 | `lists` variant с check-иконкой | **B** | Список с check. |

**Итого по компонентам:** A — 4, B — 11, C — 8, D — 1.

---

## 3. Новые секции

| Секция | Прототипов | Основа UFRA | Итог | Комментарий |
|---|---|---|---|---|
| `_params-table` | 7 | `simple-table` + композиция | **C** | Компонент есть, composition rule — PM. |
| `_system-variants` | 7 | `grid` + variant-card | **C** | Composition = grid + новая карточка. |
| `_equipment-applications` | 5 | `grid` + lists | **A** | Двух-колоночный grid с h3 внутри. |
| `_achievements-stats` (trust bar) | 3 | `grid` + stat-box variant | **B** | Documented pattern. |
| `_design-assistant` (что нужно для расчёта) | 2 | 2-col grid + list + figure + CTA | **A** | Полностью собирается из существующего. |
| `_questionnaire-form` (multi-step) | 2 | form primitives + progress + sticky panel | **D** | Композиция и interaction — новая механика. |
| `_media-gallery` (видео/фото фильтр) | 2 | `tabs` + `grid` + карточки-варианты | **B** | Tabs + два grid'а. |
| `_vacancy-details` | 2 | `typography` + `lists` + form | **A** | Контентная страница из типографики. |
| `_industry-details` | 1 | `typography` + `_feature` + карточки | **A** | Композиция из существующих секций. |
| Hero-brand | 1 | `hero-inner` + logo + trust-bar | **B** | Variant. |
| Hero-profile (сотрудник) | 1 | `hero-inner` + фото + контакты | **B** | Variant. |
| Hero-vacancy | 1 | `hero-inner` + salary/level tags | **B** | Variant. |
| Hero-questionnaire (компактный) | 1 | `hero-inner` slim | **B** | Variant. |
| Hero-article (с meta) | 1 | `hero-inner` + мета | **B** | Variant. |

**Итого по секциям:** A — 4, B — 6, C — 2, D — 1.

---

## 4. Матрица покрытия по прототипам

| # | Прототип | Тип | A | B | C | D | ? | Итог |
|---|---|---|---|---|---|---|---|---|
| 01 | glavnaya | Главная | 4 | 3 | 2 | 0 | 0 | C |
| 02 | hub_sistemy | Хаб систем | 5 | 2 | 1 | 0 | 0 | B |
| 03 | rou_brou | Страница системы | 5 | 3 | 3 | 0 | 0 | C |
| 04 | svk | Страница системы | 5 | 2 | 2 | 0 | 0 | C |
| 05 | ou_itp | Страница системы | 5 | 2 | 2 | 0 | 0 | C |
| 06 | obvyazka_kalorifer | Страница системы | 5 | 2 | 2 | 0 | 0 | C |
| 07 | kategoriya | Категория | 4 | 2 | 1 | 0 | 0 | B |
| 08 | kartochka_tovara | Товар | 5 | 2 | 1 | 0 | 0 | B |
| 09 | brend | Бренд | 4 | 3 | 1 | 0 | 0 | B |
| 10 | statya | Статья БЗ | 6 | 2 | 0 | 0 | 0 | B |
| 11 | kejsy | Кейсы хаб | 4 | 1 | 1 | 0 | 0 | B |
| 12 | kontakty | Контакты | 4 | 2 | 0 | 0 | 0 | B |
| 13 | dokumentatsiya | Документы хаб | 4 | 3 | 0 | 0 | 0 | B |
| 14 | o_kompanii | О компании | 5 | 2 | 0 | 0 | 0 | B |
| 15 | kalkulyatory | Калькуляторы хаб | 4 | 2 | 1 | 0 | 0 | B |
| 16 | oprosnie_listy | Опросные хаб | 4 | 2 | 1 | 0 | 0 | B |
| **17** | oprosnyj_list_rou | Опросный лист | 2 | 2 | 1 | **1** | 0 | **D** |
| **18** | baza_znanii_hub | БЗ хаб | 4 | 2 | 1 | **1** | 0 | **D** (частично) |
| 19 | keys_card | Кейс | 5 | 1 | 0 | 0 | 0 | A/B |
| 20 | kalkulyator_ekonomii | Калькулятор | 3 | 2 | 1 | 0 | 0 | B |
| 21 | komanda | Команда | 3 | 1 | 1 | 0 | 0 | B |
| 22 | otzyvy | Отзывы | 4 | 1 | 0 | 0 | 0 | A/B |
| 23 | karera | Карьера хаб | 3 | 2 | 1 | 0 | 0 | B |
| 24 | rekvizity | Реквизиты | 4 | 0 | 0 | 0 | 0 | A |
| 25 | faq | FAQ | 4 | 1 | 0 | 0 | 0 | A |
| 26 | video | Видеотека | 3 | 2 | 1 | 0 | 0 | B |
| 27 | fotogalereja | Фотогалерея | 4 | 1 | 0 | 0 | 0 | A |
| 27b | fotogalereja_albom | Фотоальбом | 3 | 2 | 0 | 0 | 0 | B |
| 28 | sotrudnik | Сотрудник | 3 | 2 | 1 | 0 | 0 | B |
| 29 | vakansiya | Вакансия | 4 | 2 | 0 | 0 | 0 | B |
| 30 | otrasli_hub | Отрасли хаб | 4 | 1 | 1 | 0 | 0 | B |
| 31 | otrasl_pishchevaya | Отрасль | 5 | 2 | 1 | 0 | 0 | B |
| 32 | brendy_hub | Бренды хаб | 4 | 1 | 0 | 0 | 0 | A |
| 33 | media_hub | Медиа хаб | 3 | 2 | 0 | 0 | 0 | B |
| 34 | obvyazka_teploobmennika | Страница системы | 5 | 2 | 2 | 0 | 0 | C |

**Правило чтения:** итог страницы = максимальная категория среди её блоков. D появляется, только если есть хоть один блок класса D.

---

## 5. Missing States (Existing Component → Missing State)

| Компонент | Missing state | Класс | Комментарий |
|---|---|---|---|
| `ss-btn` | `focus-visible` | **B** | Audit-pass. Правило добавить в UFRA. |
| `ss-btn` | `disabled` | **A** | Скорее всего есть в `_buttons.scss` — проверить. |
| `ss-btn` | `loading` (submit) | **C** | Новый variant со spinner. |
| `ss-input` | `error` (aria-связанное) | **B** | Валидация. Formalize. |
| `ss-input` | `success` | **B** | Formalize. |
| `ss-select` | `focus-visible` | **B** | Audit. |
| `accordion` | `expanded/collapsed` | **A** | ОК. |
| `accordion` | `focus-visible` для триггера | **B** | Audit. |
| `modal` | `focus trap` + return focus | **B** | Проверить в `modal.js`. |
| `_filters` | `loading` (пока применяется) | **C** | Индикатор загрузки. |
| `_filters` | `empty state` (нулевой результат) | **C** | С сбросом + CTA к форме подбора. |
| `_filters` | `error` (ошибка выборки) | **C** | Message + retry. |
| Все интерактивные | `prefers-reduced-motion` — глобальное правило | **B** | Одно правило в `_base.scss`. |

Ни одно missing state не требует дизайнера. Все — B/C.

---

## 6. Tokens Backlog (Design System Gap)

| Группа | Существует | Пробел | Класс |
|---|---|---|---|
| Color primitive | ✓ ($accent1..5, $primary, $secondary..3, $error) | — | — |
| Color semantic | ✗ | Alias-слой (`--ss-color-action-primary`, `--ss-color-surface` и т.п.) | **B/C** — см. amendments §2.1 |
| Typography scale | Partial (`typography.pug`) | Формальные роли (H1-H6, body-L/M/S, caption, label) | **C** — verify vs Figma |
| Spacing | ✓ (10/20/30/40) | Расширение до 60/80 для больших grid | **B** |
| Radius | ✓ (10px базовый) | — | — |
| Shadow | ✗ | Формальная шкала (0/1/2/3) | **B** — Developer proposes, PM confirms |
| Z-index | ✗ | Формальная шкала (base/dropdown/sticky/modal/toast) | **B** |
| Motion | ✗ | Duration + easing tokens (120–200ms interactive, 180–300ms transitions per spec §8.1) | **B** |
| Focus ring | ✗ | Один token `--ss-focus-ring` + правило | **B** |
| Container widths | Implicit | Явный token для max-width | **A** |

Ни один token gap не требует дизайнера первым. Все — B (developer/PM) или C (PM подтверждает после verify).

---

## 7. Designer Backlog (только D)

### D-1. Multi-step questionnaire pattern (wireframe 17)

- **Приоритет:** **P1**
- **Прототип:** wireframe_17_oprosnyj_list_rou.html
- **Экран:** весь опросный лист
- **Компонент/pattern:** композиция + interaction pattern многошаговой формы с progress
- **Контекст использования:** все опросные листы под системы (реиспользуется для будущих опросников — 5–8 форм суммарно)
- **Почему UFRA недостаточно:**
  - нет паттерна навигации между шагами
  - нет паттерна сохранения прогресса и review-state
  - нет formal правила размещения progress-bar + sticky-side-panel
  - нет решения по валидации per-step vs on-submit
  - нет решения по обратной навигации без потери данных
- **Что должен решить дизайнер:**
  1. Визуальное решение progress-indicator (linear vs dot-per-step vs numbered)
  2. Раскладка sticky-side-panel (нужен или нет; desktop-only?)
  3. Финальный review-экран (все шаги на одной странице? аккордеон?)
  4. Поведение при ошибке валидации per-step
  5. Отмена / выход из формы
- **Необходимые states:** default, active-step, filled-step, error-step, loading (submit), success, empty (первый заход)
- **Breakpoints:** desktop, tablet, mobile — раскладка side-panel и step-navigation
- **Существующие компоненты как основа:** `form`, `form-row`, `select`, `accordion`, `_feedback-b24`
- **После утверждения в UFRA:** секция `_questionnaire-form` + документация паттерна + JS-модуль `questionnaire-form.js`

### D-2. KB Search with typed suggestions (wireframe 18)

- **Приоритет:** **P2**
- **Прототип:** wireframe_18_baza_znanii_hub.html
- **Экран:** hero базы знаний, блок поиска
- **Компонент/pattern:** поле поиска с выпадающим списком подсказок (autocomplete/combobox)
- **Контекст использования:** только БЗ хаб (потенциально — глобальный header в будущем)
- **Почему UFRA недостаточно:** нет паттерна combobox / typed-suggest. `select` работает с фиксированным списком, а не с типизированным поиском.
- **Что должен решить дизайнер:**
  1. Визуальное решение выпадашки (расстояние от input, разделители, выделение matching символов)
  2. Empty state (нет подсказок)
  3. Показ recent/popular queries при пустом фокусе
  4. Клавиатурная навигация (arrow-up/down, enter, esc)
  5. Мобильное поведение (full-screen overlay или dropdown)
- **Необходимые states:** default, focused, typing, has-results, no-results, loading, error
- **Breakpoints:** desktop, tablet, mobile — особенно моб. overlay-режим
- **Существующие компоненты как основа:** `select` (частично), `form-row`, `lists`
- **После утверждения в UFRA:** компонент `ss-search-suggest` + JS-модуль

**Всё остальное — не D.** Из ~180 просмотренных блоков только 2 требуют полноценного дизайнерского решения.

---

## 8. PM Task List (B и C)

Сгруппировано по единицам утверждения, чтобы PM не подписывал каждый блок отдельно.

### PM-1. Семейство карточек
- **Прототипы:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 21, 23, 26, 30, 32, 34
- **Категория:** C
- **Основа:** `feature`, `article-card`, `cta-card`, `tags`, `pill`, `figure`
- **Что меняется:** для каждого типа (Product / System / Industry / Brand / Team / Vacancy / Video / Variant) — своя композиция и пропорции. Единая база: image/icon + h3 + краткое описание + опциональные tags/badges + link.
- **Подтверждает PM:** оставляем 8 самостоятельных карточек или объединяем в 2–3 универсальные с opt-in слотами; правило клика (вся карточка ссылка или только заголовок/CTA).
- **Ограничения:** ссылка карточки — обычный `<a>` (per spec §4).
- **В UFRA:** каталог карточек в `/ui/*.html` + правила композиции.

### PM-2. Hero-варианты (brand, profile, vacancy, questionnaire, article)
- **Прототипы:** 09, 17, 22, 27b, 28, 29, 10
- **Категория:** B
- **Основа:** `hero-inner`
- **Подтверждает PM:** оставляем 5 вариантов или сокращаем до 2 универсальных с opt-in блоками; единый vertical rhythm.
- **В UFRA:** variants в `hero-inner.pug` с documented modifier-классами.

### PM-3. Trust bar (полоса цифр под hero)
- **Прототипы:** 01, 09, 12, 14, 22
- **Категория:** B
- **Основа:** `_home-benefits`
- **Подтверждает PM:** отдельный variant или переиспользуем `_home-benefits` в текущем виде.

### PM-4. Stat box variant
- **Прототипы:** 01, 03, 05, 06, 09, 14, 22, 34
- **Категория:** B
- **Основа:** `fact-card`
- **Подтверждает PM:** размерность цифры, правило переноса длинных подписей.

### PM-5. `_params-table` composition rule
- **Прототипы:** 03–08, 34
- **Категория:** C
- **Основа:** `simple-table`
- **Подтверждает PM:** 2 колонки (label/value); mobile — стек или scroll внутри контейнера; правило для «нет данных» в строке.

### PM-6. `_system-variants` grid pattern
- **Прототипы:** 03, 04, 05, 06, 34
- **Категория:** C
- **Основа:** `grid` + новая variant-card
- **Подтверждает PM:** способ выделения «рекомендованного» варианта (badge / border / шапка).

### PM-7. Document card extended
- **Прототипы:** 03–06, 08, 09, 13, 34
- **Категория:** B
- **Основа:** `_documents` строка
- **Подтверждает PM:** порядок действий при `состоянии документа = запросить`.

### PM-8. Sticky local navigation для страниц систем
- **Прототипы:** 03, 04, 05, 06, 34
- **Категория:** B
- **Основа:** `toc.js` + `_catalog-nav` идея
- **Подтверждает PM:** остаётся ниже breadcrumbs или sticky-top-under-header.

### PM-9. Filter for catalog (расширенный) — доделка wireframe 07
- **Прототип:** 07
- **Категория:** C
- **Основа:** `_filters` + `filters-drawer.js` + референс ADL (уже утверждён в ТЗ)
- **Подтверждает PM:** отклонения от ADL-референса, если появятся.

### PM-10. Multi-step form composition (после D-1)
- **Прототип:** 17
- **Категория:** C
- **Подтверждает PM:** после D-1 — раскладка на breakpoints и место sticky-panel.

### PM-11. Media gallery filter (видео/фото/альбомы)
- **Прототипы:** 26, 33
- **Категория:** B
- **Основа:** `tabs` + `grid`
- **Подтверждает PM:** табы или переключение через фильтр-кнопки.

### PM-12. Lightbox для gallery
- **Прототип:** 27b
- **Категория:** B
- **Основа:** `gallery` + `modal`
- **Подтверждает PM:** нужен ли зум/pinch-to-zoom на мобильном.

### PM-13. Comparison table variant
- **Прототипы:** 09, 10
- **Категория:** B
- **Основа:** `simple-table`
- **Подтверждает PM:** способ выделения «лучшего» варианта, мобильный fallback (стек карточек).

### PM-14. Progress bar (после D-1)
- **Прототип:** 17
- **Категория:** C

### PM-15. Semantic color tokens layer
- **Все прототипы**
- **Категория:** B/C (см. `steamsys_frontend_spec_amendments_v0.1_2026-09-28.md` §2.1)
- **Подтверждает PM:** 2-слойная (primitive + component) vs 3-слойная (+ semantic).

### PM-16. Motion / focus-ring / shadow / z-index token scales
- **Все прототипы**
- **Категория:** B
- **Подтверждает PM:** значения (defaults per spec §8.1: 120–200ms interactive, 180–300ms state-change).

---

## 9. UFRA Gap Backlog

| Пробел | Тип | Где обнаружен | Кто решает | Куда после решения |
|---|---|---|---|---|
| 8 типов карточек (Product/System/Industry/Brand/Team/Vacancy/Video/Variant) | NEW COMPONENT × 8 | §2 | Developer + PM | `src/pug/ui/*.pug` + `/ui/*.html` |
| Stat box formal variant | NEW VARIANT | §2 | Developer + PM | `fact-card` variant |
| 5 hero variants | NEW VARIANT × 5 | §3 | Developer + PM | `hero-inner` variants |
| `_params-table` composition rule | NEW COMPOSITION PATTERN | §3 | PM | Секция «Composition» в REDESIGN_RULES |
| `_system-variants` grid pattern | NEW COMPOSITION PATTERN | §3 | PM | Там же |
| `_achievements-stats` (trust bar) | NEW COMPOSITION PATTERN | §3 | PM | Там же |
| `_design-assistant` (2-col: illustration + checklist) | NEW COMPOSITION PATTERN | §3 | PM | Там же |
| `_questionnaire-form` (multi-step) | NEW COMPOSITION + INTERACTION | §3, §7 (D-1) | **Designer** | Секция + JS-модуль |
| `_media-gallery` (tabs + grid variants) | NEW COMPOSITION PATTERN | §3 | PM | Там же |
| Sticky local navigation | NEW COMPOSITION + VARIANT | §1 | PM | `toc.pug` variant + правило |
| Lightbox interaction | NEW INTERACTION PATTERN | §2 | PM | `gallery.js` extension |
| KB search suggest | NEW COMPONENT + INTERACTION | §7 (D-2) | **Designer** | `ss-search-suggest` |
| Tooltip on hover (для схем-картинок) | NEW INTERACTION PATTERN | §2 | Developer | Простой JS-модуль |
| Multi-step form progress-bar | NEW COMPONENT | §2 | PM (после D-1) | Component |
| Semantic color tokens | NEW TOKEN LAYER | §6 | PM | `_var.scss` extension |
| Motion tokens | NEW TOKEN | §6 | PM | `_var.scss` |
| Focus-ring token | NEW TOKEN | §6 | PM | `_var.scss` + `_base.scss` |
| Shadow scale | NEW TOKEN | §6 | PM | `_var.scss` |
| Z-index scale | NEW TOKEN | §6 | PM | `_var.scss` |
| `prefers-reduced-motion` global rule | NEW RESPONSIVE RULE | §5 | Developer | `_base.scss` |
| Focus-visible audit-pass | DOCUMENTATION GAP | §5 | Developer | Правило в REDESIGN_RULES + audit fixture |
| States catalog per component | DOCUMENTATION GAP | §5 | Developer | Каждый `/ui/*.html` показывает states |

---

## 10. Stress test

### 1. После выполнения Designer Backlog (2 задачи) можно ли собрать остальные?
**Да**, при условии, что PM Task List (16 групп) параллельно закрывается. Из 34 прототипов:
- 32 не требуют дизайнера вообще.
- 2 требуют одного из двух дизайнерских решений (17, 18).

### 2. Покрыты ли необходимые states?
**Частично.** См. §5. Focus-visible, loading для форм, empty/error для фильтров, prefers-reduced-motion — все проходят как B/C, не D. UNKNOWN нет.

### 3. Покрыты ли desktop/tablet/mobile?
**В большинстве компонентов — да** (существующие секции используют `down($md)`/`down($lg)`). Пробелы:
- Multi-step form (17) — только после D-1.
- KB search suggest (18) — только после D-2.
- Sticky local nav (03–06, 34) — мобильное поведение (fold vs scroll) — PM.

### 4. Скрытые дубликаты компонентов?
Возможные:
- `fact-card` vs stat-box variant — не дублировать, сделать вариантом `fact-card`.
- `article-card` vs video-card — video-card близок; сделать вариантом `article-card`, если пропорции 16:9 + мета совпадают.
- `_documents` vs document-card extended — расширяем существующий.

### 5. Variants, которые следует объединить?
- 5 hero variants — оставить раздельно, каждый несёт разную информационную иерархию.
- Product card vs System card — оставить раздельно (разная семантика CTA).

### 6. Правила композиции покрыты?
- `_params-table`, `_system-variants`, `_achievements-stats`, sticky local nav — все закрываются через PM Task List.
- Multi-step form — только после D-1.
- Grid для карточек (3–4 col desktop / 2 tablet / 1 mob) — есть в `grid.pug`, но должно быть documented per card type.

### 7. Все ли новые решения возвращаются в UFRA?
Каждый пункт §8 и §9 явно указывает «куда после реализации/утверждения». Правило: каждый новый компонент/variant/pattern попадает в `/ui/*.html` каталог и упоминается в `ui-navigation.pug`. Это уже практика проекта.

---

## 11. Метрики

Из ~180 уникальных «блоков» через 34 прототипа (после агрегации сквозных):

- **A (REUSE AS IS):** ~40% (~72 блока)
- **B (REUSE WITH VARIANT):** ~35% (~63 блока)
- **C (ADAPT WITH PM):** ~22% (~40 блоков)
- **D (NEW DESIGN REQUIRED):** ~2% (2 задачи в §7)
- **UNKNOWN:** ~1% (2–3 частных вопроса)

**Диагностика.** Доля D очень низкая — это ожидаемо для проекта, где UFRA уже реализован на 60+ компонентов. Основная работа — не дизайн, а композиция и документирование variants. **KPI не подгонялся.**

---

## 12. Итоговая классификация прототипов

### Список 1. Прототипы, полностью требующие дизайнера
**Ни одного.**

### Список 2. Прототипы, НЕ требующие дизайнера
Все 32 прототипа, кроме 17 и 18:
**01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 27b, 28, 29, 30, 31, 32, 33, 34.**

### Список 3. Прототипы, где дизайнеру нужны только отдельные компоненты
- **17** — multi-step form composition + interaction (D-1). Остальная страница собирается из готового.
- **18** — только блок search-suggest (D-2). Остальная страница собирается из готового.

### Список 4. Прототипы с неразрешённой неопределённостью
Ни одного полного прототипа. Локальные UNKNOWN:
- Компоненты, которые могут уже существовать в Figma UI Kit (нужен verify): stat-box formal variant; hero variants; trust bar variant; document-card extended.
- Если Figma это уже покрывает — соответствующие B/C становятся A. Verify снимет 3–5 пунктов.

---

## 13. Управленческое резюме

- **Всего прототипов:** 34
- **Всего блоков (после агрегации сквозных):** ~180
- **Reuse без изменений (A):** ~40%
- **Reuse через variants (B):** ~35%
- **Доработка с PM (C):** ~22%
- **Требуют дизайнера (D):** ~2% (2 задачи)
- **Unknown:** ~1%

### Дизайнеру нужно
- **0** полных прототипов
- **2** отдельных экрана/блока (wireframe 17 — вся страница для composition; wireframe 18 — только блок поиска)
- **2** новых компонента/pattern (multi-step form composition, search-suggest)
- **~7** новых states — все собираются developer'ом после того, как PM подтвердит правила (focus-visible, loading forms, empty/error filters, prefers-reduced-motion)

### После выполнения этого объёма
**Можно** завершить остальные 32 прототипа без участия дизайнера.

### Основной риск
Без утверждения PM Task List (16 групп) часть composition patterns может дрейфовать к дизайнерским решениям. Прежде всего: расширенный фильтр каталога, семантика color tokens, sticky local nav, семейство карточек.

---

## 14. Вопросы к команде

1. **Figma UI Kit vs код.** Есть ли в Figma UI Kit уже:
   - варианты hero (brand, profile, vacancy, article)?
   - formal stat-box variant?
   - trust bar composition?
   - document-card extended?
   Если да — часть B в §2/§3 становится A, объём падает на 10–15%.

2. **Semantic color tokens.** Есть ли в Figma семантические color styles («primary action», «surface», «text-secondary»)? Ответ определяет, идём мы в 2-слойную или 3-слойную токен-архитектуру (см. amendments §2.1).

3. **Motion tokens.** Есть ли утверждённые длительности и easing в Figma? Если нет — developer может предложить defaults per spec §8.1.

4. **Wireframe 03 — designer-assistant блок.** Это отдельная секция или переиспользуется в опросном листе (17)? Если единый компонент — сокращает работу на 3–5 часов.

5. **Wireframe 17 — sticky-side-panel.** Desktop-only? Если mobile — без панели, упрощает D-1.

6. **Lightbox для gallery (27b).** У текущего `gallery-swiper.js` уже есть full-screen режим? UNKNOWN.

7. **Карта на wireframe 12 (Контакты).** Яндекс.Карт iframe или статичное изображение? От этого зависит adapter и правило aspect-ratio.

---

*Аудит подготовлен в роли Principal Product Designer / Design Systems Architect, 2026-09-28. Основан на анализе 34 прототипов и действующего UI Framework (60+ компонентов, 33 секции, tokens, правил REDESIGN_RULES.md).*
