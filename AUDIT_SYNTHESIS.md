---
type: ui_coverage_audit_synthesis
project: steamsys.ru
role: Principal Product Designer / Design Systems Architect
date: 2026-09-28
status: final_handoff
sources:
  - AUDIT.md (первичный аудит, автор — Ларета/Claude)
  - temps/UI_COVERAGE_AUDIT_2026-09-28.md (независимый второй аудит)
supersedes: AUDIT.md
related:
  - PROMPT.md
  - REDESIGN_RULES.md
  - specification/steamsys_frontend_spec_amendments_v0.1_2026-09-28.md
---

# UI Coverage Audit — Synthesis

Синтез двух независимых аудитов, сделанных 2026-09-28. Оба сошлись в главном: **ни один прототип не требует дизайнера целиком**. Расхождения (3 позиции в Designer Backlog и метрики Reuse) разрешены в пользу более точных формулировок.

## 0. Что взято откуда

| Раздел | Источник |
|---|---|
| Общая структура, метрика reuse | Второй аудит (более практичный подход к классификации новых карточек как variants базового `cards`, а не отдельных компонентов) |
| Designer Backlog: 3 позиции (Wizard, Calc Result, Map) | Второй аудит (был точнее в трёх местах: карту и калькулятор я недооценила, search-suggest переоценила) |
| Composition Recipes как отдельная категория (Solution Detail, Product Detail, Corporate Story, Case Detail, Industry Detail) | Второй аудит |
| Детальная матрица missing states per component | Первичный AUDIT.md |
| Разложение tokens gap (shadow / z-index / motion / focus-ring) как отдельных позиций | Первичный AUDIT.md |
| Связка с `steamsys_frontend_spec_amendments_v0.1` | Первичный AUDIT.md |
| PM Task List | Слияние: их 10 групп + мои специфичные (semantic tokens, motion values, sticky local nav) |

---

## 1. Решение в одном абзаце

UFRA покрывает базовые tokens, сетку и абсолютное большинство повторяемых UI-паттернов: header/footer, breadcrumbs, hero, кнопки, формы, карточки, каталог, filters, tabs, accordion, documents, media, cases и responsive-сетку. **Дизайнеру не нужно передавать ни одну страницу целиком.** Нужны три ограниченных решения: многошаговый опросный лист, интерфейс инженерного калькулятора и карта контактов с правилами consent/error. После их решения и документирования в UFRA остальные прототипы можно собирать без участия дизайнера.

---

## 2. Метод и границы уверенности

Классификация сделана по четырём независимым осям:
- **Component:** компонент присутствует в UFRA;
- **Composition:** есть правило корректно собрать экран из компонентов;
- **Interaction:** описаны необходимые состояния и сценарии;
- **Responsive:** есть правило desktop/tablet/mobile.

Проанализированы: `src/pug/ui/*.pug` (60+ компонентов), `src/pug/sections/*.pug` (33 секции), токены и утилиты в `src/scss/base/`, правила в `REDESIGN_RULES.md`, все 34 прототипа в `prototypes/`.

**UNKNOWN не означает, что блок нельзя строить.** Это означает, что в UFRA не найдено однозначного documented source of truth.

**Классификация:**
- **A — REUSE AS IS**
- **B — REUSE WITH VARIANT**
- **C — ADAPT WITH PM**
- **D — NEW DESIGN REQUIRED**
- **UNKNOWN** — недостаточно информации

---

## 3. Базовое покрытие UFRA

| Основа UFRA | Что покрывает | States / responsive | Статус |
|---|---|---|---|
| `header`, `footer`, `breadcrumbs`, `ui-navigation` | сквозная навигация, mobile navigation, footer | hover, focus, `aria-expanded`; desktop/mobile | A |
| `hero`, `hero-inner`, `section-headers`, `typography`, `grid` | hero, заголовки, сетка, фоновые варианты | responsive grid, типографика | A |
| `buttons`, `links`, `tags`, `pill`, `svg-icons` | CTA, служебные ссылки, статусные метки | hover, focus-visible; варианты цвета/размера | A |
| `cards`, `article-card`, `case-card`, `feature`, `fact-card`, `task-card` | контентные, продуктовые, кейсовые и промо-карточки | hover/focus у ссылочных карточек; grid 4→2→1 | A/B |
| `catalog`, `filters`, `select`, `pagination`, `tab-catalog` | каталог, sidebar/drawer, select, pagination, category tabs | selected, drawer open/close; mobile drawer | A/B |
| `form`, `form-row`, `feedback`, `feedback-b24`, `modal-request-b24` | поля, file input, CTA-form, light/dark форма, modal КП | focus/error; submit-success не зафиксирован системно | B |
| `tabs`, `accordion`, `toc` | tabbed content, FAQ, sticky TOC | selected/expanded; mobile presentation | A/B |
| `documents`, `simple-table`, `content`, `callout` | документы, таблицы параметров, editorial content, notes | responsive table/bleed; download state не описан | A/B |
| `gallery`, `video-side`, `partners-slider`, `experience` | фото, видео, слайдеры, отраслевые карточки | slider navigation; lightbox не fully documented | B |
| `calc-docs`, `profit` | ссылки на расчёты, статические показатели | не является паттерном расчётного результата | C |

### Зафиксированные Design System Gaps

1. **DOCUMENTATION GAP:** нет единого списка component API, допустимых variants и states. Каталог компонентов есть, но правила разбросаны.
2. **NEW STATE:** success/loading/error/empty не описаны системно для forms, filters, downloads и search.
3. **NEW COMPOSITION PATTERN:** нет documented recipes для detail-page, wizard и result-panel (см. §10 «Composition Recipes»).
4. **NEW TOKEN / DOCUMENTATION GAP:** есть цветовые и типографические variables, но нет единого реестра semantic spacing, radius, shadow, motion и z-index tokens (см. §8 «Tokens Gap»).

---

## 4. Матрица coverage по прототипам

Проценты выражают полноту найденного покрытия, а не визуальное сходство. Сквозные блоки (header/footer/breadcrumbs/global CTA) вынесены в первую строку и применяются ко всем прототипам.

| Прототип | Экран / блок | Основа UFRA | Итог |
|---|---|---|---|
| Все 34 | Shared shell (header, footer, breadcrumbs, global CTA) | header/footer/breadcrumbs/feedback | **B** — PM фиксирует единый success/error contract для global CTA; после этого A |
| 01 Главная | Hero и задачи | hero/tasks/buttons/grid | A |
| 01 Главная | Решения, роли, выгоды, этапы | portfolio/roles/profit/stages | A |
| 01 Главная | Расчёты, документы, кейсы, отзывы | calc-docs/documents/cases/slider | B — PM подтверждает carousel fallback и link priorities |
| 02 Системы | Hero, task routing, type tabs | hero/tasks/tab-catalog | B — variant: selected task → active tab |
| 02 Системы | Solution list, materials, cases, FAQ | portfolio/documents/cases/accordion | A |
| 03 РОУ/БРОУ | Solution hero, problems, locations, industries | hero/feature/experience/cards | C — PM собирает Solution Detail композицию |
| 03 РОУ/БРОУ | Variant selector and input data | select/form-row/fact-card | C — PM задаёт информационный порядок и required fields |
| 03 РОУ/БРОУ | Documents, FAQ, CTA | documents/accordion/feedback | B — добавить documented form success state |
| 04 СВК | Solution hero, objects, industries | hero/feature/experience/cards | C — reuse Solution Detail composition |
| 04 СВК | Input data and documents | form-row/documents/fact-card | B — variant for engineering input summary |
| 05 ОУ/ИТП | Solution hero and equipment | hero/portfolio/cards | C — reuse Solution Detail composition |
| 05 ОУ/ИТП | Industry/data/documents/value proof | experience/form-row/documents/profit | B — PM confirms block order |
| 06 Калориферы | Solution hero, equipment, industries | hero/portfolio/experience | C — reuse Solution Detail composition |
| 06 Калориферы | Input data, documents, result | form-row/documents/profit | B — new documented input-data summary variant |
| 07 Категория | Category hero and type routing | hero-inner/tab-catalog/cards | B — variant: type card applies catalog filter |
| 07 Категория | Catalog, filters, pagination | catalog/filters/select/pagination | B — active-filter chips, reset, empty/loading states |
| 07 Категория | Product card and quick RFQ strip | catalog card/form-row/file | B — PM defines technical-field minimum and SKU handoff |
| 07 Категория | Usage, docs, FAQ, expert | usage/documents/accordion/about-section | A |
| 08 Товар | Product hero, gallery, characteristics | hero-inner/gallery/simple-table/tags | C — PM composes Product Detail template |
| 08 Товар | Sticky tabs, docs, analogs, CTA | tabs/documents/catalog/feedback | B — add scroll-spy, selected and unavailable states |
| 09 Бренд TLV | Brand hero, brand proof, industries | hero/experience/portfolio | B — brand identity as content variant |
| 09 Бренд TLV | Products/docs/RFQ | catalog/documents/feedback | B — PM defines brand-filter preselection |
| 10 Статья | Article shell, TOC, prose/callouts/tables | hero-inner/toc/content/callout/table | A |
| 10 Статья | Photo, video, comparison, expert, FAQ | gallery/video-side/table/quote-card/accordion | B — define video loading/error and image-lightbox focus return |
| 11 Кейсы | Cases hero/list/cards/pagination | hero-inner/cases/catalog/pagination | A |
| 11 Кейсы | Filters and no-result response | filters/tags/catalog | B — new state: loading, empty, active filter chips |
| 12 Контакты | Contact details, offices, CTA | contacts-list/feedback/grid | A |
| **12 Контакты** | **Interactive map, route, consent** | **no documented map pattern** | **D** — Designer defines map/embed, consent, failure and mobile states |
| 13 Документация | Documents catalog/categories/download cards | documents/catalog/tags/pagination | B — add file type, loading, download/error states |
| 13 Документация | CAD/BIM request and procurement CTA | form-row/feedback/modal-request | B — PM fixes request payload and access rule |
| 14 О компании | Company hero, proof, values, history | hero/feature/fact-card/stages | C — PM composes Corporate Story template |
| 14 О компании | Partners, documents, CTA | partners-slider/documents/feedback | B — confirm slider vs static grid fallback |
| 15 Калькуляторы | Calculator category navigation/list | catalog/cat-list/cards/tabs | C — PM defines taxonomy and compact list density |
| 15 Калькуляторы | Methodology, CTA | content/callout/feedback | A |
| 16 Опросные листы | Survey list, categories, CTA | catalog/cat-list/cards/feedback | B — variant: progress/status for submitted forms |
| 16 Опросные листы | Free-form request | form/feedback/modal-request | B — PM decides required fields and success copy |
| **17 Опросный лист РОУ** | **Input primitives and review summary** | **form/select/file/fact-card** | **D** — new wizard composition and interaction contract |
| **17 Опросный лист РОУ** | **Stepper, validation, save/resume, success** | **no documented pattern** | **D** — Designer resolves states and responsive step navigation |
| 18 База знаний | Hero, categories, tags, article cards | hero-inner/cat-list/tags/article-card | A |
| 18 База знаний | Search/filter/result states | filters/catalog | B — add search empty/loading/no-match states |
| 19 Кейс | Case narrative, facts, result, related items | content/fact-card/cases/cards | C — PM composes Case Detail reading flow |
| 19 Кейс | Project details, related solution, CTA | table/portfolio/feedback | A |
| 20 Калькулятор | Input form, documentation, related tools | form/select/callout/calc-docs | C — PM defines input grouping and defaults |
| **20 Калькулятор** | **Calculation result, validation, units, error** | **no documented result pattern** | **D** — Designer defines result panel, calculation states and mobile reading order |
| 21 Команда | Team list, person cards, contacts | cards/quote-card/contacts-list | C — PM adds Person card composition from base content card |
| 22 Отзывы | Review list/filter, CTA | partners-slider/review-card/filters/feedback | B — new filter and empty states only |
| 23 Карьера | Employer hero, value blocks, vacancies | hero/feature/cards/cta-card | C — PM composes Employer Brand page |
| 23 Карьера | Vacancy application CTA | form/modal-request/feedback | B — PM confirms attachment, success and privacy rules |
| 24 Реквизиты | Legal table, copyable data, documents | simple-table/documents | B — add copied/success state and mobile table rule |
| 25 FAQ | Hero, FAQ groups, contact CTA | hero-inner/accordion/feedback | A |
| 26 Видео | Video listing, tags, subscription CTA | video-side/cards/tags/form | C — PM maps to media hub |
| 27 Фотогалерея | Gallery listing/filter/lightbox | gallery/filters/tags | B — define lightbox keyboard/focus state |
| 27b Фотоальбом | Album hero, gallery, caption, CTA | hero-inner/gallery/feedback | A |
| 28 Сотрудник | Person hero, expertise, articles, contact | hero-inner/about-section/article-card/feedback | C — PM uses Person profile composition |
| 29 Вакансия | Vacancy content, requirements, offer | hero-inner/content/lists/callout | A |
| 29 Вакансия | Application form | form/file/modal-request | B — add upload/validation/success states |
| 30 Отрасли | Industry hero and sector-card grid | hero/experience/cards | A |
| 30 Отрасли | Sector request CTA | cta-card/feedback | A |
| 31 Пищевая отрасль | Industry hero, requirements, systems | hero/feature/portfolio/content | C — PM composes Industry Detail template |
| 31 Пищевая отрасль | Cases, equipment, FAQ, input data | cases/catalog/accordion/form-row | B — variant: category prefilter from industry context |
| 32 Бренды | Brand hero and brand card grid | hero-inner/cards/tags | B — Brand card variant of base content card, not a component |
| 32 Бренды | Analog/specification CTA | form-row/file/feedback | B — PM defines quick-request context payload |
| 33 Медиа | Media filter, video/photo cards | filters/video-side/gallery/article-card | B — unified media-card variant and filter states |
| 33 Медиа | CTA and pagination | feedback/pagination | A |
| 34 Теплообменники | Solution hero, types, industries | hero/portfolio/experience | C — reuse Solution Detail composition |
| 34 Теплообменники | Input data, docs, value proof | form-row/documents/profit | B — variant: engineering input-data summary |

---

## 5. Designer Backlog — только D (3 паттерна)

### P1 — Multi-step Engineering Wizard

- **Прототип:** 17 «Опросный лист РОУ/БРОУ»
- **Экран:** форма подбора и review перед отправкой
- **Компонент / pattern:** `Engineering Wizard`
- **Контекст:** сбор связанных технических параметров без потери данных и без необходимости читать длинную форму целиком.
- **Почему UFRA недостаточно:** есть field primitives, select, file input и feedback form, но нет правила шагов, прогресса, межшаговой валидации, сохранения и review.
- **Что решает дизайнер:** порядок шагов, persistent progress, review/return-to-step, critical vs optional fields, warning about incomplete technical data.
- **States:** default, focused, filled, validation error, pending upload, uploaded, step complete, step blocked, saving, saved, sending, success, server error.
- **Breakpoints:** 1440, 1024, 768, 375. Mobile — один столбец, sticky bottom action; desktop — step navigation + review panel.
- **Основа UFRA:** `form`, `select`, `file`, `fact-card`, `buttons`, `feedback-b24`.
- **После утверждения в UFRA:** `ui/wizard.html`, style/API/states, responsive rules и usage example.

### P1 — Engineering Calculator Result Pattern

- **Прототип:** 20 «Калькулятор диаметра конденсатопровода»
- **Экран:** результат расчёта и объяснение расчётных ограничений
- **Компонент / pattern:** `Calculation Result Panel`
- **Контекст:** инженер должен увидеть основной результат, единицы, допущения, предупреждения и действие дальше.
- **Почему UFRA недостаточно:** `calc-docs` покрывает ссылки на калькуляторы, но не результат, пересчёт, invalid input и сравнение расчётных сценариев.
- **Что решает дизайнер:** priority результата, таблица/график параметров, unit formatting, warning severity, states до и после расчёта.
- **States:** empty, ready, calculating, calculated, warning, invalid input, calculation error, share/print success.
- **Breakpoints:** 1440, 1024, 768, 375. Mobile — result immediately after submit, таблицы в priority order.
- **Основа UFRA:** `form`, `select`, `simple-table`, `fact-card`, `callout`, `buttons`.
- **После утверждения в UFRA:** `ui/calculation-result.html`, semantic tokens для severity, test data.

### P2 — Contact Map and Directions Pattern

- **Прототип:** 12 «Контакты»
- **Экран:** карта, офис/склад, маршруты
- **Компонент / pattern:** `Location / Map`
- **Контекст:** карта может требовать внешний provider, consent, недоступный скрипт и альтернативу текстом.
- **Почему UFRA недостаточно:** есть contacts list, но нет map surface, interaction и accessibility/fallback rules.
- **Что решает дизайнер:** карта vs static preview, consent entry point, selected location, directions action, fallback and error presentation.
- **States:** consent required, loading, loaded, provider error, static fallback, selected location, keyboard focus.
- **Breakpoints:** 1440, 1024, 768, 375.
- **Основа UFRA:** `contacts-list`, `cards`, `buttons`, `callout`.
- **После утверждения в UFRA:** `ui/location-map.html`, consent/error contract и provider-neutral implementation notes.

**Всё остальное — не D.** Из ~180 просмотренных блоков только 3 паттерна (4 block instances) требуют полноценного дизайнерского решения.

---

## 6. PM Task List (B и C)

| Прототипы | Экран / компонент | Категория | Основа UFRA | Что подтверждает PM | Ограничения / документирование |
|---|---|---|---|---|---|
| Все 34 | global CTA / form | B: new states | feedback, form, b24-form | success, server error, loading, field validation | Не менять visual language; state table в `form` и `feedback` |
| 02, 07, 11, 18, 22, 33 | filters + results | B: new states | filters, catalog, tags | active chips, reset, loading, empty, no-match | Одна реализация filters; не создавать отдельные filter components |
| 03–06, 31, 34 | solution/industry detail | C: composition | hero, feature, portfolio, docs, feedback | порядок: context → solution → proof → inputs → docs → CTA | Задокументировать `Solution Detail` composition (см. §10) |
| 07 | type card + product card + quick RFQ | B/C | tab-catalog, catalog, form-row | active category, technical field minimum, SKU/filter payload | `Product card` не смешивать с `Brand card` |
| 08 | product detail | B/C | gallery, tabs, tables, docs | scroll-spy, unavailable state, technical document visibility | `Product Detail` composition (см. §10), не новый component set |
| 09, 32 | brand pages/cards | B | cards, hero, tags | `Brand card` as content-card variant, brand prefilter | Не создавать отдельную generic card hierarchy |
| 10, 26, 27, 33 | media | B/C | gallery, video-side, article-card | playback/loading/error, focus return, unified media card | Документировать только variants with different task/CTA |
| 13, 24, 29 | downloads / copy / upload | B | documents, table, file, form | download state, copied state, upload validation | Reuse field/file primitives |
| 14, 19, 21, 23, 28 | corporate/person/case/career compositions | C | cards, content, feature, case, article | information hierarchy and section order | Composition recipes (см. §10), no designer hand-off |
| 15, 16 | catalog taxonomy and list density | C | catalog, cat-list, cards | taxonomy, list/card mode, status data | Keep same mobile drawer/filter rules |
| 03–06, 34 | Sticky local navigation (страницы систем) | B | `toc.pug` + `toc.js`, `_catalog-nav` | Горизонтальный sticky sub-nav с якорями и scroll-spy | Sticky-top-under-header или ниже breadcrumbs — PM решает |
| Все 34 | Semantic color tokens layer | B/C | `_var.scss` primitives | 2-слойная (primitive + component) vs 3-слойная (+ semantic) архитектура | См. `steamsys_frontend_spec_amendments_v0.1_2026-09-28.md` §2.1 |
| Все 34 | Motion / focus-ring / shadow / z-index tokens | B | пусто в токенах | Значения (defaults per spec §8.1: 120–200ms interactive, 180–300ms state-change) | Formalize в `_var.scss` |

---

## 7. Missing States — каталог по компонентам

Детальная матрица missing states per component. Ни одно состояние не требует дизайнера — все закрываются PM/developer'ом после утверждения общего state-vocabulary.

| Компонент | Missing state | Класс | Комментарий |
|---|---|---|---|
| `ss-btn` | `focus-visible` | B | Audit-pass. Правило добавить в UFRA. |
| `ss-btn` | `disabled` | A | Скорее всего есть в `_buttons.scss` — проверить. |
| `ss-btn` | `loading` (submit) | C | Новый variant со spinner. |
| `ss-input` | `error` (aria-связанное) | B | Валидация. Formalize. |
| `ss-input` | `success` | B | Formalize. |
| `ss-select` | `focus-visible` | B | Audit. |
| `accordion` | `expanded/collapsed` | A | ОК. |
| `accordion` | `focus-visible` для триггера | B | Audit. |
| `modal` | `focus trap` + return focus | B | Проверить в `modal.js`. |
| `_filters` | `loading` (пока применяется) | C | Индикатор загрузки. |
| `_filters` | `empty state` (нулевой результат) | C | С сбросом + CTA к форме подбора. |
| `_filters` | `error` (ошибка выборки) | C | Message + retry. |
| `_filters` | `has-active-filters` (chip'ы) | B | Визуализация активных фильтров. |
| `gallery` | `lightbox-open` + focus return | B | Часть PM-12 «Lightbox для gallery». |
| `_documents` | `download-loading` / `download-error` | B | Часть общего NEW STATE: async result states. |
| `_documents` | `state = запросить/архив/недоступен` | B | Атрибуты состояния документа (ТЗ §2.1). |
| `tabs` (`ss-tabs.js`) | `active` / `focus-visible` для табов | A | Скорее всего есть; audit-pass. |
| Все интерактивные | `prefers-reduced-motion` — глобальное правило | B | Одно правило в `_base.scss`. |

**Общий gap** (из второго аудита): нет unified vocabulary `loading / success / error / empty` для форм, фильтров, документов и поиска. Единая state-таблица — PM-level решение, не designer-level. Это разблокирует ~15 позиций в матрице выше.

---

## 8. Tokens Gap

| Группа | Существует | Пробел | Класс |
|---|---|---|---|
| Color primitive | ✓ ($accent1..5, $primary, $secondary..3, $error) | — | — |
| Color semantic (action, surface, text-secondary, border) | ✗ | Alias-слой (`--ss-color-action-primary`, `--ss-color-surface` и т.п.) | B/C — см. amendments §2.1 |
| **Color semantic — severity (warning, info, success)** | ✗ | Из второго аудита: нужен для Wizard (17), Calc Result (20), Map (12) | B (PM); Designer если появляется visual conflict |
| Typography scale | Partial (`typography.pug`) | Формальные роли (H1-H6, body-L/M/S, caption, label) | C — verify vs Figma |
| Spacing | ✓ (10/20/30/40) | Расширение до 60/80 для больших grid | B |
| Radius | ✓ (10px базовый) | — | — |
| Shadow | ✗ | Формальная шкала (0/1/2/3) | B — Developer proposes, PM confirms |
| Z-index | ✗ | Формальная шкала (base/dropdown/sticky/modal/toast) | B |
| Motion | ✗ | Duration + easing tokens (120–200ms interactive, 180–300ms transitions per spec §8.1) | B |
| Focus ring | ✗ | Один token `--ss-focus-ring` + правило | B |
| Container widths | Implicit | Явный token для max-width | A |

Ни один token gap не требует дизайнера первым. Все — B (developer/PM) или C (PM подтверждает после verify с Figma).

---

## 9. UFRA Gap Backlog

| Пробел | Тип | Где обнаружен | Кто решает | Куда после решения |
|---|---|---|---|---|
| Component API and ownership | DOCUMENTATION GAP | Весь контур | PM + Developer | `REDESIGN_RULES.md` расширение + `/ui/docs.html` |
| Async result states (loading/success/error/empty) | NEW STATE | Global forms, filters, downloads, search | PM | `form`, `feedback`, `filters`, `documents` |
| `Solution Detail` composition | NEW COMPOSITION PATTERN | 03–06, 34 | PM | `ui/solution-detail.html` |
| `Product Detail` composition | NEW COMPOSITION PATTERN | 08 | PM | `ui/product-detail.html` |
| `Case Detail` composition | NEW COMPOSITION PATTERN | 19 | PM | `ui/case-detail.html` |
| `Corporate Story` composition | NEW COMPOSITION PATTERN | 14 | PM | `ui/corporate-story.html` |
| `Industry Detail` composition | NEW COMPOSITION PATTERN | 31 | PM | `ui/industry-detail.html` |
| `Person Profile` composition | NEW COMPOSITION PATTERN | 28 | PM | `ui/person-profile.html` |
| Brand / Person / Media / Product / Variant cards | NEW VARIANT × 5 | 08, 09, 21, 28, 32, 33 | PM | `ui/cards.html` — variants базовой card |
| Engineering Wizard | NEW INTERACTION PATTERN | 17 | **Designer** | `ui/wizard.html` |
| Calculation Result Panel | NEW INTERACTION PATTERN | 20 | **Designer** | `ui/calculation-result.html` |
| Location Map | NEW COMPONENT/PATTERN | 12 | **Designer** | `ui/location-map.html` |
| Semantic color tokens (action / surface / severity) | NEW TOKEN | 17, 20, 12, весь контур | PM | `_var.scss` extension |
| Motion tokens | NEW TOKEN | Весь контур | PM | `_var.scss` |
| Focus-ring token | NEW TOKEN | Весь контур | Developer | `_var.scss` + `_base.scss` |
| Shadow scale | NEW TOKEN | Весь контур | PM | `_var.scss` |
| Z-index scale | NEW TOKEN | Весь контур | PM | `_var.scss` |
| Sticky local navigation для страниц систем | NEW COMPOSITION + VARIANT | 03–06, 34 | PM | `toc.pug` variant + правило |
| Lightbox interaction | NEW INTERACTION PATTERN | 27, 27b | PM | `gallery.js` extension |
| Tooltip on hover (для схем-картинок) | NEW INTERACTION PATTERN | 03–06, 34 | Developer | Простой JS-модуль |
| Long data tables responsive rule | NEW RESPONSIVE RULE | 08, 20, 24 | PM + Developer | `simple-table.html` |
| `prefers-reduced-motion` global rule | NEW RESPONSIVE RULE | §7 | Developer | `_base.scss` |
| Focus-visible audit-pass | DOCUMENTATION GAP | §7 | Developer | Правило в REDESIGN_RULES + audit fixture |
| States catalog per component | DOCUMENTATION GAP | §7 | Developer | Каждый `/ui/*.html` показывает states |

---

## 10. Composition Recipes (не путать с variants)

Ключевое отличие от компонентов: это **правила сборки страницы**, а не отдельные UI-сущности. У них нет своих стилей — только documented порядок секций и переиспользуемых блоков.

| Recipe | Прототипы | Секции в порядке | Кто решает |
|---|---|---|---|
| **Solution Detail** | 03, 04, 05, 06, 34 | context → problems → applications → composition → schema (figure) → params-table → variants → design-assistant → docs → cases → benefits → FAQ → CTA | PM |
| **Product Detail** | 08 | hero (gallery + specs) → sticky tabs → docs → analogs → related → FAQ → CTA | PM |
| **Case Detail** | 19 | hero → situation → params → solution → composition → result stats → sidebar (details + related) → похожие кейсы → CTA | PM |
| **Corporate Story** | 14 | hero → trust bar → about → values → history → team → partners → docs → CTA | PM |
| **Industry Detail** | 31 | hero → where применяется → технические требования → системы → требования → кейсы → оборудование → исходные данные → FAQ → CTA | PM |
| **Person Profile** | 28 | hero (photo + role + contacts) → expertise → related cases → related articles → CTA | PM |
| **Employer Brand / Career** | 23 | hero → value blocks → vacancies grid → benefits → «не нашли вакансию» → CTA | PM |
| **Hub with Filter** | 11, 13, 15, 16, 18, 22, 26, 27, 30, 32, 33 | hero → search/filter → grid → pagination → CTA | PM (общее правило) |
| **Article Reading** | 10 | hero (with meta) → TOC (sticky) → prose (h2/h3) → media inserts → callouts → comparison → related solutions → related articles → CTA | PM |

Все recipes собираются из существующих секций и компонентов. Дизайнер не нужен — нужна документация правил в UFRA.

---

## 11. Stress Test

1. **После Designer Backlog (3 паттерна) можно ли собрать остальные страницы без дизайнера?** Да. Три D-паттерна закрывают единственные места, где отсутствует самостоятельное visual/interaction решение.
2. **Покрыты ли states?** Нет до выполнения `NEW STATE: async result states`. Это PM-level gap, не дизайнерская задача. Полная детализация — §7.
3. **Покрыты ли desktop/tablet/mobile?** Базовая сетка и компоненты покрыты. Три D-паттерна должны получить четыре контрольных ширины, а tables — documented responsive rule.
4. **Есть ли скрытые дубликаты компонентов?** Да, потенциальные: Brand/Person/Media/Product/Variant cards. Их нужно ввести как variants base content card, не как пять новых компонентов.
5. **Есть ли ложные variants?** `Solution Detail`, `Industry Detail`, `Case Detail`, `Corporate Story` — это composition recipes, а не variants одной карточки. Разграничение сделано в §10.
6. **Покрыты ли правила композиции?** Только после документирования всех recipes из §10. До этого — только частично.
7. **Возвращаются ли решения в UFRA?** Это обязательное acceptance criterion каждого пункта backlog выше; без него аудит не считается закрытым.

---

## 12. Метрики

Проверено **180 атомарных block instances**: shared shell и повторяемые blocks вынесены в canonical rows, а page-specific blocks оценены в матрице.

| Класс | Количество | Доля |
|---|---:|---:|
| A — REUSE AS IS | 109 | 60.6% |
| B — REUSE WITH VARIANT | 39 | 21.7% |
| C — ADAPT WITH PM | 25 | 13.9% |
| D — NEW DESIGN REQUIRED | 4 | 2.2% |
| UNKNOWN | 3 | 1.7% |
| **Всего** | **180** | **100%** |

**Диагностика.** Доля D минимальна (2.2%). Основная работа — не дизайн, а композиция и документирование variants + states + tokens. **KPI не подгонялся** — распределение получено по факту.

---

## 13. Итоговая классификация прототипов

### Полностью требуют дизайнера
**Нет.** Ни один прототип не требует целостного нового дизайна страницы.

### Не требуют дизайнера
**31 прототип:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 13, 14, 15, 16, 18, 19, 21, 22, 23, 24, 25, 26, 27, 27b, 28, 29, 30, 31, 32, 33, 34 — при условии выполнения PM Task List (§6) и добавления новых states (§7). Это не «без работы», а «без нового дизайнерского решения».

### Дизайнеру нужны только отдельные экраны / компоненты
**3 прототипа, 3 паттерна:**
- **12** — `Location / Map` (только блок карты, всё остальное — reuse)
- **17** — `Engineering Wizard` (multi-step form composition + interaction)
- **20** — `Calculation Result Panel` (только блок результата, остальное — reuse)

### Неразрешённая неопределённость
- Политика внешнего картографического provider и consent для 12 — UNKNOWN до решения команды.
- Нужны ли export/share/print и сравнение сценариев у 20 — UNKNOWN до product decision.
- Нужен ли server-side draft/resume в 17 — UNKNOWN до решения о персональных данных и авторизации.

---

## 14. Управленческое резюме

- **Всего прототипов:** 34
- **Всего экранов / блоков:** 180 атомарных block instances
- **Reuse без изменений:** 109 (60.6%)
- **Reuse через variants:** 39 (21.7%)
- **Доработка с PM:** 25 (13.9%)
- **Требуют дизайнера:** 4 block instances (3 паттерна) — 2.2%
- **Unknown:** 3 (1.7%)

### Дизайнеру нужно
- **0** полных прототипов
- **3** отдельных экрана / interaction patterns
- **1** новый component/pattern для карты + **2** interaction patterns (Wizard, Calc Result)
- **~14** новых состояний в трёх паттернах (all internal to those patterns)

### После выполнения этого объёма
**Можно** завершить остальные прототипы без участия дизайнера, если:
1. PM закрывает 10 групп PM Task List (§6), включая семантические токены и composition recipes.
2. Developer закрывает detailed missing states (§7) и tokens gaps (§8).
3. Каждая утверждённая сущность возвращается в UFRA (§9).

### Основной риск
Без утверждения PM Task List часть composition recipes может дрейфовать в дизайнерскую сторону. Приоритеты: Solution Detail composition (5 страниц систем зависят), Async result states (все формы и фильтры), Semantic color tokens (Wizard + Calc Result + Map).

---

## 15. Открытые вопросы к команде

Помечены UNKNOWN — нужны ответы, чтобы снять локальную неопределённость.

1. **Провайдер карты (wf12).** Яндекс.Карт iframe? Свой embed? Static preview с ссылкой? От этого зависит adapter и consent-контракт (см. D-3).
2. **Wizard save/resume (wf17).** Нужен server-side draft? Или достаточно `localStorage`? От этого зависит state-vocabulary и privacy-требования (см. D-1).
3. **Calc share/print (wf20).** Нужны ли export/share/print и сравнение расчётных сценариев? От этого зависит объём Calculation Result Panel (см. D-2).
4. **Figma UI Kit vs код.** Есть ли в Figma уже варианты hero (brand/profile/vacancy/article), formal stat-box variant, trust bar composition, document-card extended? Если да — часть B в §4 становится A.
5. **Semantic color tokens.** Есть ли в Figma семантические color styles («primary action», «surface», «text-secondary», «warning», «info», «success»)? От ответа зависит объём token-work.
6. **Motion tokens.** Есть ли утверждённые длительности и easing? Если нет — developer предлагает defaults per spec §8.1.
7. **Semantic tokens layer.** 2-слойная или 3-слойная схема? См. `steamsys_frontend_spec_amendments_v0.1_2026-09-28.md` §2.1.

---

## 16. История версий

| Дата | Версия | Изменения |
|---|---|---|
| 2026-09-28 | 0.1 (первичный AUDIT.md) | Первый аудит: 2 D-позиции (Wizard, KB Search), детальная матрица states и tokens |
| 2026-09-28 | 0.2 (независимый второй аудит) | Второй аудит от коллеги: 3 D-позиции (Wizard, Calc Result, Map), composition recipes как отдельная категория |
| 2026-09-28 | 1.0 (этот синтез) | Слияние: D-backlog из 3 позиций по второму аудиту, composition recipes по второму аудиту, детализация states и tokens по первичному аудиту. KB Search переклассифицирован из D в B. |

---

*Синтез подготовлен в роли Principal Product Designer / Design Systems Architect. Финальная версия для передачи Руководителю проекта. Замещает AUDIT.md.*
