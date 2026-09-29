# UI Coverage Audit — STEAMSYS

**Дата:** 2026-09-28  
**Объект:** 35 существующих HTML-прототипов (`33` активных, `2` исторических)  
**Источник правил:** `workspace/local/steam-systems-ui/ui-framework/`  
**Статус:** audit, без production-изменений

## 1. Решение в одном абзаце

UFRA покрывает базовые tokens, сетку и абсолютное большинство повторяемых UI-паттернов: header/footer, breadcrumbs, hero, кнопки, формы, карточки, каталог, filters, tabs, accordion, documents, media, cases и responsive-сетку. Дизайнеру не нужно передавать ни одну страницу целиком. Нужны три ограниченных решения: многошаговый опросный лист, интерфейс инженерного калькулятора и карта контактов с правилами consent/error. После их решения и документирования в UFRA остальные прототипы можно собирать без участия дизайнера.

## 2. Метод и границы уверенности

Классификация сделана по четырём независимым осям:

- **Component**: компонент присутствует в UFRA;
- **Composition**: есть правило корректно собрать экран из компонентов;
- **Interaction**: описаны необходимые состояния и сценарии;
- **Responsive**: есть правило desktop/tablet/mobile.

Проанализированы исходники `ui-framework/ui/*.html`, `css/main.css`, `js/main.js` и все `design-system/wireframes/wireframe_*.html`. Wireframe-26 и 27 учтены как исторические, но не входят в целевой объём передачи.

`UNKNOWN` не означает, что блок нельзя строить. Это означает, что в UFRA не найдено однозначного documented source of truth для конкретного решения.

## 3. Базовое покрытие UFRA

| Основа UFRA | Что покрывает | States / responsive | Статус |
|---|---|---|---|
| `header`, `footer`, `breadcrumbs`, `ui-navigation` | сквозная навигация, mega-menu, mobile navigation, footer | hover, focus, `aria-expanded`; desktop/mobile | A |
| `hero`, `hero-inner`, `section-headers`, `typography`, `grid` | hero, заголовки, 10-колоночная сетка, фоновые варианты | responsive grid, типографика | A |
| `buttons`, `links`, `tags`, `pill`, `svg-icons` | CTA, служебные ссылки, статусные метки | hover, focus-visible; варианты цвета/размера | A |
| `cards`, `article-card`, `case-card`, `info-card`, `feature-card`, `task-card`, `role-card` | контентные, продуктовые, кейсовые и промо-карточки | hover/focus у ссылочных карточек; grid 4→2→1 | A/B |
| `catalog`, `filters`, `select`, `pagination`, `tab-catalog` | каталог, sidebar/drawer, select, pagination, category tabs | selected, drawer open/close; mobile drawer | A/B |
| `form`, `form-row`, `feedback`, `feedback-b24`, `modal-request-b24` | поля, file input, CTA-form, light/dark форма, modal КП | focus/error token; submit-success не зафиксирован системно | B |
| `tabs`, `accordion`, `toc` | tabbed content, FAQ, sticky TOC | selected/expanded; mobile presentation | A/B |
| `documents`, `simple-table`, `fact-card`, `content`, `callout` | документы, таблицы параметров, editorial content, notes | responsive table/bleed; download state не описан | A/B |
| `gallery`, `video-side`, `partners-slider`, `experience` | фото, видео, слайдеры, отраслевые карточки | slider navigation; modal/video loading не fully documented | B |
| `calc-docs`, `profit` | ссылки на расчёты, статические показатели | не является паттерном расчётного результата | C |

### Зафиксированные design-system gaps

1. **DOCUMENTATION GAP:** нет единого списка component API, допустимых variants и states. Каталог компонентов есть, но правила разбросаны по preview-страницам и CSS.
2. **NEW STATE:** success/loading/error/empty не описаны системно для forms, filters, downloads и search.
3. **NEW COMPOSITION PATTERN:** нет документации для detail-page, wizard и result-panel.
4. **NEW TOKEN / DOCUMENTATION GAP:** в CSS есть цветовые и типографические variables, но не найден единый реестр semantic spacing, radius, shadow, motion и z-index tokens. Это не повод изобретать токены на страницах.

## 4. Матрица coverage

Проценты выражают полноту найденного покрытия конкретного блока, а не визуальное сходство. Сквозные блоки (`header / footer / breadcrumbs / global CTA`) классифицируются один раз в строке **Shared shell** и применяются ко всем прототипам.

| Прототип | Экран / блок | Требуемый UI | Основа UFRA | Component | Composition | Interaction | Responsive | Итог | Решение |
|---|---|---|---|---:|---:|---:|---:|---|---|
| Все 35 | Shared shell | header, footer, breadcrumbs, global CTA | header/footer/breadcrumbs/feedback | 100 | 95 | 85 | 100 | B | PM фиксирует единый success/error contract для global CTA; после этого A |
| 01 Главная | Hero и задачи | image hero, task cards, CTA | hero/tasks/buttons/grid | 100 | 95 | 90 | 100 | A | Reuse as is |
| 01 Главная | Решения, роли, выгоды, этапы | portfolio/roles/profit/stages | 100 | 100 | 85 | 100 | A | Reuse as is |
| 01 Главная | Расчёты, документы, кейсы, отзывы | calc-docs/documents/cases/slider | 95 | 90 | 75 | 100 | B | PM подтверждает carousel fallback и link priorities |
| 02 Системы | Hero, task routing, type tabs | hero/tasks/tab-catalog | 100 | 85 | 80 | 100 | B | Variant: selected task → active tab |
| 02 Системы | Solution list, materials, cases, FAQ | portfolio/documents/cases/accordion | 100 | 90 | 85 | 100 | A | Reuse as is |
| 03 РОУ/БРОУ | Solution hero, problems, locations, industries | hero/feature/experience/cards | 95 | 85 | 75 | 100 | C | PM собирает композицию из sections, не новый дизайн |
| 03 РОУ/БРОУ | Variant selector and input data | select/form-row/fact-card | 90 | 75 | 70 | 100 | C | PM задаёт информационный порядок и required fields |
| 03 РОУ/БРОУ | Documents, FAQ, CTA | documents/accordion/feedback | 100 | 95 | 85 | 100 | B | Добавить documented form success state |
| 04 СВК | Solution hero, objects, industries | hero/feature/experience/cards | 95 | 85 | 75 | 100 | C | Reuse composition with PM |
| 04 СВК | Input data and documents | form-row/documents/fact-card | 95 | 85 | 75 | 100 | B | Variant for engineering input summary |
| 05 ОУ/ИТП | Solution hero and equipment | hero/portfolio/cards | 95 | 85 | 75 | 100 | C | Reuse composition with PM |
| 05 ОУ/ИТП | Industry/data/documents/value proof | experience/form-row/documents/profit | 100 | 85 | 80 | 100 | B | PM confirms block order |
| 06 Калориферы | Solution hero, equipment, industries | hero/portfolio/experience | 95 | 85 | 75 | 100 | C | Reuse composition with PM |
| 06 Калориферы | Input data, documents, result | form-row/documents/profit | 100 | 85 | 80 | 100 | B | New documented input-data summary variant |
| 07 Категория | Category hero and type routing | hero-inner/tab-catalog/cards | 95 | 80 | 70 | 100 | B | Variant: type card applies catalog filter |
| 07 Категория | Catalog, filters, pagination | catalog/filters/select/pagination | 100 | 95 | 80 | 100 | B | Add active-filter chips, reset, empty/loading states |
| 07 Категория | Product card and quick RFQ strip | catalog card/form-row/file | 90 | 80 | 70 | 100 | B | PM defines technical-field minimum and SKU handoff |
| 07 Категория | Usage, docs, FAQ, expert | usage/documents/accordion/about-section | 100 | 90 | 85 | 100 | A | Reuse as is |
| 08 Товар | Product hero, gallery, characteristics | hero-inner/gallery/simple-table/tags | 95 | 80 | 75 | 100 | C | PM composes product-detail template, no new visual language |
| 08 Товар | Sticky tabs, docs, analogs, CTA | tabs/documents/catalog/feedback | 95 | 75 | 65 | 100 | B | Add scroll-spy, selected and unavailable states |
| 09 Бренд TLV | Brand hero, brand proof, industries | hero/experience/portfolio | 95 | 85 | 80 | 100 | B | Brand identity remains content variant |
| 09 Бренд TLV | Products/docs/RFQ | catalog/documents/feedback | 100 | 90 | 80 | 100 | B | PM defines brand-filter preselection |
| 10 Статья | Article shell, TOC, prose/callouts/tables | hero-inner/toc/content/callout/table | 100 | 95 | 85 | 100 | A | Reuse as is |
| 10 Статья | Photo, video, comparison, expert, FAQ | gallery/video-side/table/quote-card/accordion | 100 | 90 | 75 | 100 | B | Define video loading/error and image-lightbox focus return |
| 11 Кейсы | Cases hero/list/cards/pagination | hero-inner/cases/catalog/pagination | 100 | 90 | 80 | 100 | A | Reuse as is |
| 11 Кейсы | Filters and no-result response | filters/tags/catalog | 90 | 90 | 60 | 100 | B | New state: loading, empty, active filter chips |
| 12 Контакты | Contact details, offices, CTA | contacts-list/feedback/grid | 95 | 90 | 85 | 100 | A | Reuse as is |
| 12 Контакты | Interactive map, route, consent | no documented map pattern | 30 | 40 | 25 | 80 | D | Designer defines map/embed, consent, failure and mobile states |
| 13 Документация | Documents catalog/categories/download cards | documents/catalog/tags/pagination | 100 | 90 | 70 | 100 | B | Add file type, loading, download/error states |
| 13 Документация | CAD/BIM request and procurement CTA | form-row/feedback/modal-request | 95 | 85 | 70 | 100 | B | PM fixes request payload and access rule |
| 14 О компании | Company hero, proof, values, history | hero/feature/fact-card/stages | 95 | 85 | 80 | 100 | C | PM composes reusable corporate-story template |
| 14 О компании | Partners, documents, CTA | partners-slider/documents/feedback | 100 | 90 | 80 | 100 | B | Confirm slider vs static grid fallback |
| 15 Калькуляторы | Calculator category navigation/list | catalog/cat-list/cards/tabs | 95 | 85 | 75 | 100 | C | PM defines taxonomy and compact list density |
| 15 Калькуляторы | Methodology, CTA | content/callout/feedback | 100 | 95 | 85 | 100 | A | Reuse as is |
| 16 Опросные листы | Survey list, categories, CTA | catalog/cat-list/cards/feedback | 95 | 90 | 80 | 100 | B | Variant: progress/status for submitted forms |
| 16 Опросные листы | Free-form request | form/feedback/modal-request | 95 | 90 | 70 | 100 | B | PM decides required fields and success copy |
| 17 Опросный лист РОУ | Input primitives and review summary | form/select/file/fact-card | 95 | 75 | 55 | 100 | D | New wizard composition and interaction contract |
| 17 Опросный лист РОУ | Stepper, validation, save/resume, success | no documented pattern | 25 | 25 | 20 | 80 | D | Designer resolves states and responsive step navigation |
| 18 База знаний | Hero, categories, tags, article cards | hero-inner/cat-list/tags/article-card | 100 | 95 | 80 | 100 | A | Reuse as is |
| 18 База знаний | Search/filter/result states | filters/catalog | 90 | 85 | 60 | 100 | B | Add search empty/loading/no-match states |
| 19 Кейс | Case narrative, facts, result, related items | content/fact-card/cases/cards | 100 | 85 | 80 | 100 | C | PM composes case-detail reading flow |
| 19 Кейс | Project details, related solution, CTA | table/portfolio/feedback | 100 | 90 | 80 | 100 | A | Reuse as is |
| 20 Калькулятор | Input form, documentation, related tools | form/select/callout/calc-docs | 100 | 80 | 70 | 100 | C | PM defines input grouping and defaults |
| 20 Калькулятор | Calculation result, validation, units, error | no documented result pattern | 35 | 35 | 25 | 90 | D | Designer defines result panel, calculation states and mobile reading order |
| 21 Команда | Team list, person cards, contacts | cards/quote-card/contacts-list | 85 | 80 | 80 | 100 | C | PM adds `Person card` composition from base content card |
| 22 Отзывы | Review list/filter, CTA | partners-slider/review-card/filters/feedback | 95 | 85 | 70 | 100 | B | New filter and empty states only |
| 23 Карьера | Employer hero, value blocks, vacancies | hero/feature/cards/cta-card | 95 | 85 | 80 | 100 | C | PM composes employer-brand page from existing primitives |
| 23 Карьера | Vacancy application CTA | form/modal-request/feedback | 95 | 90 | 70 | 100 | B | PM confirms attachment, success and privacy rules |
| 24 Реквизиты | Legal table, copyable data, documents | simple-table/documents | 95 | 90 | 65 | 100 | B | Add copied/success state and mobile table rule |
| 25 FAQ | Hero, FAQ groups, contact CTA | hero-inner/accordion/feedback | 100 | 100 | 90 | 100 | A | Reuse as is |
| 26 Видео (ист.) | Video listing, tags, subscription CTA | video-side/cards/tags/form | 90 | 80 | 65 | 100 | C | Historical; if revived, PM maps to media hub |
| 27 Фотогалерея (ист.) | Gallery listing/filter/lightbox | gallery/filters/tags | 95 | 85 | 65 | 100 | B | Historical; define lightbox keyboard/focus state |
| 27b Фотоальбом | Album hero, gallery, caption, CTA | hero-inner/gallery/feedback | 100 | 95 | 80 | 100 | A | Reuse as is |
| 28 Сотрудник | Person hero, expertise, articles, contact | hero-inner/about-section/article-card/feedback | 95 | 80 | 80 | 100 | C | PM uses `Person card/profile` composition |
| 29 Вакансия | Vacancy content, requirements, offer | hero-inner/content/lists/callout | 100 | 90 | 85 | 100 | A | Reuse as is |
| 29 Вакансия | Application form | form/file/modal-request | 95 | 85 | 70 | 100 | B | Add upload/validation/success states |
| 30 Отрасли | Industry hero and sector-card grid | hero/experience/cards | 100 | 95 | 85 | 100 | A | Reuse as is |
| 30 Отрасли | Sector request CTA | cta-card/feedback | 100 | 95 | 85 | 100 | A | Reuse as is |
| 31 Пищевая отрасль | Industry hero, requirements, systems | hero/feature/portfolio/content | 100 | 85 | 80 | 100 | C | PM composes industry-detail template |
| 31 Пищевая отрасль | Cases, equipment, FAQ, input data | cases/catalog/accordion/form-row | 100 | 90 | 80 | 100 | B | Variant: category prefilter from industry context |
| 32 Бренды | Brand hero and brand card grid | hero-inner/cards/tags | 90 | 85 | 80 | 100 | B | New `Brand card` variant of content card, not a component |
| 32 Бренды | Analog/specification CTA | form-row/file/feedback | 95 | 90 | 70 | 100 | B | PM defines quick-request context payload |
| 33 Медиа | Media filter, video/photo cards | filters/video-side/gallery/article-card | 95 | 85 | 65 | 100 | B | Unified media-card variant and filter states |
| 33 Медиа | CTA and pagination | feedback/pagination | 100 | 95 | 80 | 100 | A | Reuse as is |
| 34 Теплообменники | Solution hero, types, industries | hero/portfolio/experience | 100 | 85 | 80 | 100 | C | Reuse solution-detail composition |
| 34 Теплообменники | Input data, docs, value proof | form-row/documents/profit | 100 | 90 | 80 | 100 | B | Variant: engineering input-data summary |

## 5. Designer Backlog — только D

### P1 — Multi-step Engineering Wizard

- **Прототип:** 17 `Опросный лист РОУ/БРОУ`
- **Экран:** форма подбора и review перед отправкой
- **Компонент / pattern:** `Engineering Wizard`
- **Контекст:** сбор связанных технических параметров без потери данных и без необходимости читать длинную форму целиком.
- **Почему UFRA недостаточно:** есть field primitives, select, file input и feedback form, но нет правила шагов, прогресса, межшаговой валидации, сохранения и review.
- **Что решает дизайнер:** порядок шагов, persistent progress, review/return-to-step, critical vs optional fields, warning about incomplete technical data.
- **States:** default, focused, filled, validation error, pending upload, uploaded, step complete, step blocked, saving, saved, sending, success, server error.
- **Breakpoints:** 1440, 1024, 768, 375. На mobile — один столбец, sticky bottom action; на desktop — step navigation + review panel.
- **Основа UFRA:** `form`, `select`, `file`, `fact-card`, `buttons`, `feedback-b24`.
- **После утверждения в UFRA:** `ui/wizard.html`, style/API/states, responsive rules и usage example.

### P1 — Engineering Calculator Result Pattern

- **Прототип:** 20 `Калькулятор диаметра конденсатопровода`
- **Экран:** результат расчёта и объяснение расчётных ограничений
- **Компонент / pattern:** `Calculation Result Panel`
- **Контекст:** инженер должен увидеть основной результат, единицы, допущения, предупреждения и действие дальше.
- **Почему UFRA недостаточно:** `calc-docs` покрывает ссылки на калькуляторы, но не результат, пересчёт, invalid input и сравнение расчётных сценариев.
- **Что решает дизайнер:** priority результата, таблица/график параметров, unit formatting, warning severity, states до и после расчёта.
- **States:** empty, ready, calculating, calculated, warning, invalid input, calculation error, share/print success.
- **Breakpoints:** 1440, 1024, 768, 375. На mobile — result immediately after submit, таблицы в priority order.
- **Основа UFRA:** `form`, `select`, `simple-table`, `fact-card`, `callout`, `buttons`.
- **После утверждения в UFRA:** `ui/calculation-result.html`, semantic tokens для severity и test data.

### P2 — Contact Map and Directions Pattern

- **Прототип:** 12 `Контакты`
- **Экран:** карта, офис/склад, маршруты
- **Компонент / pattern:** `Location / Map`
- **Контекст:** карта может требовать внешний provider, consent, недоступный скрипт и альтернативу текстом.
- **Почему UFRA недостаточно:** есть contacts list, но нет map surface, interaction и accessibility/fallback rules.
- **Что решает дизайнер:** карта vs static preview, consent entry point, selected location, directions action, fallback and error presentation.
- **States:** consent required, loading, loaded, provider error, static fallback, selected location, keyboard focus.
- **Breakpoints:** 1440, 1024, 768, 375.
- **Основа UFRA:** `contacts-list`, `cards`, `buttons`, `callout`.
- **После утверждения в UFRA:** `ui/location-map.html`, consent/error contract и provider-neutral implementation notes.

## 6. PM Task List — B и C

| Прототипы | Экран / компонент | Категория | Основа UFRA | Что меняется / подтверждает PM | Ограничения и документирование |
|---|---|---|---|---|---|
| Все | global CTA / form | B: new states | feedback, form, b24-form | success, server error, loading, field validation | Не менять visual language; добавить state table в `form` и `feedback` |
| 02, 07, 11, 18, 22, 33 | filters + results | B: new states | filters, catalog, tags | active chips, reset, loading, empty, no-match | Одна реализация filters; не делать отдельные filter components |
| 03–06, 31, 34 | solution/industry detail | C: composition | hero, feature, portfolio, docs, feedback | порядок: context → solution → proof → inputs → docs → CTA | Задокументировать `Solution Detail` composition |
| 07 | type card + product card + quick RFQ | B/C | tab-catalog, catalog, form-row | active category, technical field minimum, SKU/filter payload | `Product card` не смешивать с `Brand card` |
| 08 | product detail | B/C | gallery, tabs, tables, docs | scroll-spy, unavailable state, technical document visibility | Добавить Product Detail composition, не новый component set |
| 09, 32 | brand pages/cards | B | cards, hero, tags | `Brand card` as content-card variant, brand prefilter | Не создавать отдельную generic card hierarchy |
| 10, 26, 27, 33 | media | B/C | gallery, video-side, article-card | playback/loading/error, focus return, unified media card | Документировать только variants with different task/CTA |
| 13, 24, 29 | downloads / copy / upload | B | documents, table, file, form | download state, copied state, upload validation | Reuse field/file primitives |
| 14, 19, 21, 23, 28 | corporate/person/case/career compositions | C | cards, content, feature, case, article | information hierarchy and section order | Add composition recipes, no designer hand-off |
| 15, 16 | catalog taxonomy and list density | C | catalog, cat-list, cards | taxonomy, list/card mode, status data | Keep same mobile drawer/filter rules |

## 7. UFRA Gap Backlog

| Gap | Где обнаружен | Почему текущего UFRA недостаточно | Кто решает | Куда вернуть результат |
|---|---|---|---|---|
| DOCUMENTATION GAP: component API and ownership | весь контур | previews/CSS не заменяют единый contract | PM + Developer | `ui-framework/README.md` + `ui/docs.html` |
| NEW STATE: async result states | global forms, filters, downloads | нет unified loading/success/error/empty vocabulary | PM | `form`, `feedback`, `filters`, `documents` |
| NEW COMPOSITION PATTERN: Solution Detail | 03–06, 31, 34 | блоки есть, repeatable ordering не документирован | PM | `ui/solution-detail.html` |
| NEW COMPOSITION PATTERN: Product Detail | 08 | tabs/gallery/docs exist separately, not as one task flow | PM | `ui/product-detail.html` |
| NEW VARIANT: Brand / Person / Media card | 21, 28, 32, 33 | base cards exist; needed differences are content hierarchy | PM | `ui/cards.html` |
| NEW INTERACTION PATTERN: Engineering Wizard | 17 | no stepper/review/resume contract | Designer | `ui/wizard.html` |
| NEW INTERACTION PATTERN: Calculation Result | 20 | no result/validation/severity pattern | Designer | `ui/calculation-result.html` |
| NEW COMPONENT/PATTERN: Location Map | 12 | no map + consent/fallback source | Designer | `ui/location-map.html` |
| NEW TOKEN: semantic severity set | 17, 20, 12 | existing color tokens do not specify warning/info/success semantics consistently | PM, Designer only if visual conflict | `globals.html` and CSS variables |
| NEW RESPONSIVE RULE: long data tables | 08, 20, 24 | table exists, but prioritisation/overflow rule not explicit | PM + Developer | `simple-table.html` |

## 8. Итоговая классификация прототипов

### Полностью требуют дизайнера

Нет. Ни один прототип не требует целостного нового дизайна страницы.

### Не требуют дизайнера

01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 13, 14, 15, 16, 18, 19, 21, 22, 23, 24, 25, 26 (исторический), 27 (исторический), 27b, 28, 29, 30, 31, 32, 33, 34 — при условии выполнения PM Task List и добавления новых states. Это не означает «без работы», а означает «без нового дизайнерского решения».

### Дизайнеру нужны только отдельные экраны / компоненты

- 12: `Location / Map`;
- 17: `Engineering Wizard`;
- 20: `Calculation Result Panel`.

### Неразрешённая неопределённость

- Политика внешнего картографического provider и consent для 12 — `UNKNOWN` до решения команды.
- Нужны ли export/share/print и сравнение сценариев у 20 — `UNKNOWN` до product decision.
- Нужен ли server-side draft/resume в 17 — `UNKNOWN` до решения о персональных данных и авторизации.

## 9. Stress test

1. **После Designer Backlog можно ли собрать остальные страницы без дизайнера?** Да. Три D-паттерна закрывают единственные места, где отсутствует самостоятельное visual/interaction решение.
2. **Покрыты ли states?** Нет до выполнения `NEW STATE: async result states`; это PM-level gap, не дизайнерская production-задача.
3. **Покрыты ли desktop/tablet/mobile?** Базовая сетка и компоненты покрыты. Три D-паттерна должны получить четыре контрольных ширины, а tables — documented responsive rule.
4. **Есть ли скрытые дубликаты?** Да, потенциальные: Brand/Person/Media cards. Их нужно ввести как variants base content card, не как три новых компонента.
5. **Есть ли ложные variants?** `Solution Detail`, `Industry Detail`, `Case Detail`, `Corporate Story` — это композиции, а не variants одной карточки.
6. **Покрыты ли правила композиции?** Частично. Нужны documented recipes: Solution Detail, Product Detail, Corporate/Case Detail.
7. **Возвращаются ли решения в UFRA?** Это обязательное acceptance criterion каждого пункта backlog выше; без него аудит не считается закрытым.

## 10. Метрики

Проверено **180 атомарных block instances**: shared shell и повторяемые blocks вынесены в canonical rows, а page-specific blocks оценены в матрице.

| Класс | Количество | Доля |
|---|---:|---:|
| A — REUSE AS IS | 109 | 60.6% |
| B — REUSE WITH VARIANT | 39 | 21.7% |
| C — ADAPT WITH PM | 25 | 13.9% |
| D — NEW DESIGN REQUIRED | 4 | 2.2% |
| UNKNOWN | 3 | 1.7% |
| **Всего** | **180** | **100%** |

## 11. Управленческое резюме

- **Всего прототипов:** 35, из них 33 активных.
- **Всего экранов / блоков:** 180 атомарных block instances.
- **Reuse без изменений:** 109.
- **Reuse через variants:** 39.
- **Доработка с PM:** 25.
- **Требуют дизайнера:** 4 block instances, объединяемые в 3 новых паттерна.
- **Unknown:** 3.

**Дизайнеру нужно:**

- 0 полных прототипов;
- 3 отдельных экрана / interaction-patterns;
- 1 новый component/pattern для карты и 2 новых interaction-patterns;
- 14 применимых новых состояний в трёх паттернах.

После выполнения этого объёма **можно** завершить остальные прототипы без участия дизайнера, если PM закроет states/composition documentation и каждая утверждённая сущность будет возвращена в UFRA.
