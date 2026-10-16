# Правила работы над редизайном STEAMSYS

> **Этот файл — стабильный справочник:** правила проекта, конвенции, документация готовых компонентов.
> **Активные задачи и рабочая переписка** — в [`TASKS.md`](./TASKS.md).
> По завершении задачи финальный API/стили переносятся сюда, черновики удаляются из TASKS.

Проект представляет собой постепенный редизайн существующего рабочего сайта [STEAMSYS](https://www.steamsys.ru/).

Новая верстка будет внедряться на действующий сайт поэтапно. Поэтому при разработке необходимо учитывать существующую верстку и существующие стили сайта.
Существующие файлы, классы, глобальные стили, утилиты и архитектурные решения в репозитории не следует автоматически считать окончательными или рекомендуемыми для нового дизайна.

Перед переиспользованием существующих глобальных классов, reset-стилей или общих селекторов необходимо оценить риск конфликтов с действующим сайтом.

## Проверка перед изменением UI Framework

Этот проект — upstream-источник UI Framework для production-репо `../steamsys/local/`. Общие правила workflow (SEARCH → REUSE → EXTEND → CREATE, классы A–D, DESIGN SYSTEM GAP, Review gate Лоретты, cross-page impact) — в `CLAUDE.md`, разделы «Workflow для UI-задач», «Review gate», «Cross-page impact». Здесь — только practical index, куда смотреть при SEARCH.

### Что считается UI Framework в этом проекте

| Папка / файл | Назначение |
| --- | --- |
| `src/pug/ui/**/*.pug` | Витрины и примеры компонентов (генерируют `build/ui/*.html`) |
| `src/pug/ui/ui-navigation.pug` | Section index UI-kit (sidebar в `build/ui/*.html`) |
| `src/pug/mixins/**/*.pug` | Pug-миксины компонентов (`+ssBtn`, `+ssLink`, `+svgIcon`, `+ssSwiperBtn`) |
| `src/scss/blocks/**/*.scss` | Reusable UI-блоки (карточки, слайдеры, фильтры, таблицы, навигация) |
| `src/scss/base/**/*.scss` | Tokens, типографика, utilities, кнопки, формы, сетка, иконки, селекты |
| `src/scss/sections/**/*.scss` | Reusable секции (hero, footer, feedback, cases и т.п.) |
| `src/js/**/*.js` | Reusable interactive patterns (аккордеон, модалки, слайдеры, select) |
| `REDESIGN_RULES.md` | Документация системы |

**Не UI Framework** (page-level, можно менять без согласования):

- `src/pug/pages/**` — pug-страницы (consumers)
- `src/scss/pages/**` — page-specific стили
- `src/pug/sections/_<page-specific>.pug` — секции конкретной страницы (не reusable)

### Где искать существующее решение (SEARCH-пути)

| Что ищу | Куда смотреть |
| --- | --- |
| H1–H6, текст, шрифт | `src/scss/base/_typography.scss`, `src/pug/ui/typography.pug` |
| Цвет, utility | `src/scss/base/_var.scss` (переменные), `src/scss/base/_global.scss` (utilities), `src/pug/ui/colors.pug` |
| Spacing, container, grid | `src/scss/base/_container.scss`, `_grid.scss`, `src/pug/ui/grid.pug` |
| Button, link, pill | `src/scss/base/_buttons.scss`, `_ss-link.scss`, `_pill.scss`, `src/pug/mixins/_ss-button.pug`, `_ss-link.pug` |
| Form, input, checkbox, radio, select | `src/scss/base/_form.scss`, `_select.scss`, `_b24-form.scss`, `src/pug/ui/form.pug`, `select.pug` |
| Tags, badges, metrics | `src/scss/base/_tag.scss`, `src/scss/blocks/_metrics.scss`, `src/pug/ui/tags.pug` |
| Card (любая) | `src/pug/ui/cards.pug`, спец-карточки в `src/scss/blocks/_*-card.scss` |
| Карточка калькулятора (хаб инструментов) | `src/pug/ui/calc-card.pug`, `src/scss/blocks/_calc-card.scss` |
| Filter / drawer / chip | `src/scss/blocks/_filters.scss`, `_filter-bar.scss`, `_filter-chip.scss`, `_category-nav.scss` |
| Pagination | `src/scss/base/_pagination.scss`, `src/scss/blocks/_pagination-toolbar.scss` |
| Table | `src/scss/blocks/_simple-table.scss` |
| Accordion / tabs | `src/scss/base/_tabs.scss`, `src/scss/blocks/_accordion.scss` |
| Slider (Swiper) | `src/scss/blocks/_swiper-btn.scss`, `_slider-side-nav.scss`, `src/js/*-swiper.js`, см. раздел «Swiper — CSS и разметка» ниже |
| Breadcrumbs / TOC | `src/scss/base/_breadcrumbs.scss`, `src/scss/blocks/_toc.scss` |
| Hero / inner-hero | `src/scss/sections/_hero.scss`, `_hero-inner.scss` |
| Doc-layout (статья/кейс/система) | `src/scss/blocks/_doc-layout.scss`, `_sticky-side.scss`, `_help-card.scss`, `_solutions-list.scss`, `_info-pair.scss` |
| Header / footer | `src/scss/sections/_header.scss`, `_footer.scss` |
| Gallery / figure / video | `src/scss/blocks/_gallery.scss`, `_figure.scss`, `_video-side.scss`, `_product-gallery.scss` |
| Modal | `src/scss/blocks/_modal.scss`, `src/js/modal.js` |

### Mini-workflow перед правкой компонента

1. **SEARCH** — `Grep` по `src/scss/blocks/` и `src/scss/base/` на предмет имени класса / похожего паттерна.
2. **UNDERSTAND** — прочитать блок целиком + найти всех потребителей через `Grep <класс>` по `src/pug/`.
3. **CROSS-PAGE IMPACT** — если потребителей >1, явно учесть каждого при правке.
4. **REUSE / EXTEND / CREATE** — выбрать класс A/B/C/D (см. CLAUDE.md).
5. **ATOMIC CHANGE** — SCSS + ui-pug (витрина) + `src/pug/ui/ui-navigation.pug` (ссылка на витрину) + REDESIGN_RULES.md (запись правила) — одной задачей.
6. **CHECKS** в конце — согласно чеклисту в CLAUDE.md.

## Старт новой страницы — чек-лист

Когда начинается работа над новой страницей (например, `/kakaya-to-stranica.html`), по умолчанию делаем это так — **никаких уточняющих вопросов не нужно**, просто выполнить все 4 шага:

1. **Pug-файл страницы** — `src/pug/pages/<name>.pug`:
   - `extends ../layouts/layout.pug`
   - блок `variables` с `title` и `bodyCl = "ss-wrapper"`
   - в `block content` подключить `include ../sections/_header.pug` сверху и `include ../sections/_footer.pug` снизу
   - между ними — `main.ss-main-inner.ss-<name>` (пустой под будущие секции)
   - эталон — `src/pug/pages/portfolio-page.pug`

2. **SCSS-файл страницы** — `src/scss/pages/_<name>.scss`:
   - начать с `@use '../base/_var' as *;`
   - корневой класс `.ss-<name>` (минимум — `padding-top: var(--header-height, 100px)` под fixed-шапку; если первая секция сама компенсирует высоту шапки, правило уберётся)

3. **Подключить SCSS** в `src/scss/main.scss` в блоке `// pages — ...` рядом с другими `pages/_*`.

4. **Ссылка на стартовой** — добавить `a(href="./<name>.html") <Название>` в `src/pug/pages/index.pug`.

5. **Если у страницы есть hero с фоновой картинкой** (`.ss-hero-inner--dark`) — задать картинку через CSS custom properties в `<style>` в `<head>`. Градиент и позиционирование уже прописаны в `_hero-inner.scss`, страничный CSS их не дублирует.

   В `block variables` файла страницы добавить однострочный `customStyle` с прямым `background-image` и media-query (важно — однострочно, без переносов):
   ```pug
   -var customStyle = `.ss-hero-inner--dark .ss-hero-inner__body{background-image:url('${basePath}img/<mobile>.webp')}@media(min-width:1024px){.ss-hero-inner--dark .ss-hero-inner__body{background-image:url('${basePath}img/<desktop>.webp')}}`
   ```

   **Почему прямой `background-image`, а не CSS custom property.**  
   Браузеры резолвят `url()` внутри `var()` относительно `main.css` (а не HTML-документа), поэтому путь `./img/` ведёт в несуществующую папку `css/img/`. При прямом `background-image` в `<style>` внутри `<head>` путь резолвится относительно HTML-документа — надёжно и кроссбраузерно. Градиент, `background-size`, `position` — по-прежнему в `_hero-inner.scss`.

   `${basePath}img/<mobile>.webp` — мобильная картинка (до 1024px).  
   `${basePath}img/<desktop>.webp` — десктопная (от 1024px). Если нет отдельной мобильной — одно и то же имя в обоих местах.

   Файлы изображений в проекте: `solution-hero.webp` / `solution-hero@2x.webp` (портфолио, single-case), `cases-mob.webp` / `cases.webp` (страница кейсов).

   На Битриксе шаблон страницы выводит этот `<style>` в `<head>` с абсолютными URL из медиабиблиотеки (`/upload/...`). Breakpoint (1024px) прописан прямо в шаблоне — он стабилен и не меняется без перевёрстки.

После этого ждём от пользователя задач по секциям страницы.

## Что верстаем: компоненты, а не секции

Верстаем только переиспользуемые компоненты — те, что повторяются на разных страницах
проекта: карточки, кнопки, ссылки, теги, списки, сетка, заголовки секций. Секции целиком
(заголовок + раскладка + контент конкретной страницы) на текущем этапе не собираем.

**Почему.** Новая вёрстка внедряется на действующий сайт поэтапно, разметку страниц
собирает бэкенд. От нас нужен каталог готовых блоков, из которых страница соберётся,
а не готовые страницы.

Каждый компонент попадает в каталог `/ui/*.html` — он же служит документацией.
Если по ходу задачи кажется, что нужна секция целиком, — сначала спросить.

## Главное правило: изоляция новой верстки

Новые стили не должны:

- изменять внешний вид существующих элементов сайта;
- переопределять существующие классы legacy-верстки;
- влиять на элементы старого сайта через глобальные CSS-селекторы;
- использовать слишком общие имена классов, которые могут совпасть с существующими.

При создании новых компонентов необходимо использовать отдельные классы для нового дизайна.

Не создавать глобальные стили для:

```scss
button
input
textarea
a
p
h1
h2
h3
div
*
```

если они могут повлиять на существующую верстку сайта.

Если для реализации компонента требуется глобальное изменение CSS или изменение существующих legacy-стилей, сначала сообщить об этом и не вносить изменение без подтверждения.

## Именование классов нового дизайна

Для всех новых компонентов редизайна использовать префикс `ss-`.

Примеры:

```scss
.ss-btn
.ss-input
.ss-tag
.ss-tab
```

Классы с префиксом `sts-` относятся к существующей legacy-верстке сайта. Не переопределять их и не использовать для новых компонентов.

Не создавать новые классы редизайна без префикса `ss-`, если это может привести к конфликту с существующими стилями.

**Исключение:** для утилитарных SVG-иконок из общего спрайта допускается класс вида `.svg-<name>` без префикса `ss-` (см. раздел «Иконки svg»).

## Селекторы: по классам, а не по тегам

Собственную разметку редизайна (компоненты из `src/pug/ui/`, секции `src/pug/sections/_*.pug`, страницы `src/pug/pages/*.pug`) стилизуем **только по классам**. Селекторы по тегу (`.ss-block > h2`, `.ss-block p`, `.ss-block ul li` и т.п.) запрещены — у каждого элемента должен быть явный BEM-класс компонента, и правило вешается на него.

```scss
// ❌ плохо — зависимость от тега
.ss-calc-catalog__group > h2 {
    font-size: 24px;
    margin: 0 0 20px;
}

// ✅ хорошо — явный класс в разметке
.ss-calc-catalog__group-title {
    font-size: 24px;
    margin: 0 0 20px;
}
```

**Почему это важно:**

- Контент/разметку часто рефакторят: `h2` может стать `h3`, `div` — `<section>`. Правило по классу переживёт это, по тегу — нет.
- Селектор по тегу создаёт неявные зависимости: прочитав HTML, непонятно, какие теги стилизованы. По классу — всё в разметке явно.
- Семантика HTML должна подчиняться контексту (`h1` → `h6` вложенность), а не визуальному размеру. Привязка стилей к тегу вынуждает выбирать тег по размеру шрифта.
- БЭМ-дисциплина проще для контрибьюторов: один компонент → один `__*` класс на каждый визуально значимый элемент.

### Единственное исключение — контент из WYSIWYG админки

Внутри `.ss-content` админ пишет HTML без классов (просто `<h2>`, `<p>`, `<ul>`, `<strong>`, `<blockquote>`, `<table>` и т.п.). Здесь — и **только здесь** — стилизация по тегу допустима и необходима: это задокументированный контракт между нашими стилями и редактором.

```scss
// ✅ единственный допустимый кейс
:where(.ss-content) h2 { font-weight: 700; font-size: clamp(22px, …, 28px); }
:where(.ss-content) p  { font-size: 16px; line-height: 1.6; }
:where(.ss-content) blockquote p { font-style: italic; }
```

Специфика стилизации контента админки — см. `src/scss/blocks/_content.scss` (используется `:where()` для низкой специфичности, чтобы utility-классы перебивали без `!important`).

### Крайний случай — временный override внутри секции

Если **точно разово** (локальный один-единственный override внутри секции-реализатора, не компонент UI Framework) — допустимо стилизовать по тегу через scope родительского класса. Но даже тогда это сигнал задуматься: может лучше добавить класс?

```scss
// ⚠ крайний случай — scope-override в page-level секции
.ss-calc-howto .ss-feature-card__icon > span {
    font-size: 32px; // цифра номера шага вместо иконки
}
```

Если этот паттерн повторится — пора вводить класс.

## Изоляция базовых стилей

Вся новая верстка редизайна должна находиться внутри родительского контейнера `.ss-wrapper`.

Глобальные reset-стили для HTML-тегов не должны применяться ко всему документу. Если для новой верстки необходимы сбросы для `h1`, `p`, `a`, `button`, `input`, `img` и других тегов, они должны быть ограничены областью `.ss-wrapper`.

Пример:

```scss
 .ss-wrapper {
  h1,
  h2,
  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
}
```
## Типографика
изучи только фрейм typography в UI Kit Figma Нужно:

- сгруппировать типографику по ролям: заголовки и body-текст;
- предлагаю заголовкам задать классы, как .ss-h1, .ss-h2 итд
- классы предложишь для body  текстов?
- для каждого класса указать font-size, font-weight, 	line-height,если он отличается от 400 и letter-spacing, если отличается от нуля .

  В конце предложи, как лучше организовать src/scss/base/_typography.scss и
  src/pug/ui/typography.pug, но код пока не пиши.

## Иконки svg

Иконки редизайна складываем в общий SVG-спрайт `src/img/ss-sprite.svg` и подключаем через `<use>` внешним файлом (не inline в layout).

Источник иконок — [UI Kit Figma](https://www.figma.com/design/GNusOAwms0rjIjDfqDHG2o/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B?node-id=5741-15542). Иконки берём поштучно по мере надобности. Актуальный список — в каталоге `/ui/svg-icons.html` (источник: `src/pug/ui/svg-icons.pug`), там же инструкция по добавлению новой.

### Спрайт `src/img/ss-sprite.svg`

- Каждая иконка — отдельный `<symbol id="svg-<name>" viewBox="...">` со своим родным `viewBox` из макета (не приводим к общему размеру).
- Внутри symbol все заливки — `fill="currentColor"`. Цвет управляется через CSS-свойство `color`.
- Имя `<name>` — короткое, kebab-case, отражает назначение (`plus-circle`, `carret-down`, `cross`).

### Стили `src/scss/base/_svg-icons.scss`

- Базовое поведение (`display: inline-block`, вертикальное выравнивание и т.п.) задаётся атрибутным селектором `[class^="svg-"], [class*=" svg-"]` — общий класс не нужен.
- Персональный класс `.svg-<name>` — размер и цвет по макету (для `plus-circle` — 28×28).

**Префикс `svg-` зарезервирован ТОЛЬКО под иконки из спрайта.** Не использовать его для других классов (сетки, обёртки, декоративные элементы) — иначе они подхватят базовые стили иконки.

### Использование в pug

Через миксин `+svgIcon(name)` из `src/pug/mixins/_svg-icons.pug`. Миксин ставит класс `svg-<name>` и подставляет `<use>` с путём до внешнего спрайта.

### Каталог `src/pug/ui/svg-icons.pug`

Сетка всех доступных иконок с именем и pug-сниппетом использования. Служит справочником для команды.

## Buttons

Компонент `.ss-btn` — универсальная кнопка редизайна. Стили — в `src/scss/base/_buttons.scss` (файл подключается и на боевом сайте, и в UI-каталоге).

### Класс и модификаторы

- Базовый класс: `.ss-btn` — визуально совпадает с `.ss-btn--primary` (заливной синий).
- Цветовые варианты: `.ss-btn--primary`, `--secondary`, `--outline`, `--outline-dark`, `--dark`, `--light`, `--outline-light`, `--white` (см. таблицу ниже).
- Размер: базовый — big (padding 22×46, gap 24, font 22/1.3). Малый — модификатор `.ss-btn--mini` (padding 20×30, gap 20, font 18/1.4).
- На всю ширину: `.ss-btn--full` (`width: 100%`).
- На всю ширину только на мобилке: утилита `.ss-xs-full` (общая утилита в `src/scss/base/_global.scss`, работает на любом элементе). На `<$md` даёт `width: 100%`; компаунд `.ss-btn.ss-xs-full` в `_buttons.scss` навешивает сверху `max-width: 440px` — кнопка не превращается в неудобно длинную полосу на широких мобильных экранах / небольших планшетах. Ставить всегда, когда группа кнопок стекуется в колонку (hero actions, CTA-группы, формы) — визуально уравнивает ширину.
- Radius у всех — 10px.

### Иконка

Компонент универсальный — работает и с иконкой, и без. Иконка ставится через миксин `+svgIcon(name)` рядом с текстом (`span`) внутри кнопки. Размер иконки задан внутри `.ss-btn svg` и переопределяется для `mini`: 30×30 (big) / 24×24 (mini).

### Состояния

- **hover** — свой bg/border/text для каждого варианта (см. таблицу).
- **focus** — используется `:focus-visible` (реагирует только на клавиатурный фокус). Цвет `outline`:
  - для заливных вариантов — совпадает с `bg` в normal;
  - для outline-вариантов — совпадает с цветом `border` в normal.
  Смещение — `outline-offset: 2px`.
- **disabled** — универсально: `pointer-events: none; opacity: .4`. Работает и через атрибут `disabled` на `<button>`, и через класс `.is-disabled` (для `<a class="ss-btn">`, у которого нет атрибута disabled).

### Тег

`.ss-btn` можно вешать и на `<button>` (для действий), и на `<a>` (для ссылок) — стили одинаковые.

### Использование через миксин

Миксин `+ssBtn(text, opts)` из `src/pug/mixins/_ss-button.pug` (уже подключён в `layout-ui.pug` через `_mixins-links.pug`).

Опции:
- `variant` — `primary` | `secondary` | `outline` | `outline-dark` | `dark` | `light` | `outline-light` | `white` (default: `primary`).
- `size` — `big` | `mini` (default: `big`).
- `full` — `true` для `width: 100%`.
- `xsFull` — `true` для утилиты `.ss-xs-full` (100% на `<$md`, с кэпом 440px в компаунде с `.ss-btn`).
- `icon` — имя иконки без префикса `svg-` (напр. `plus-circle`); если не задан — иконки нет.
- `iconSide` — `right` | `left` (default: `right`).
- `tag` — `button` | `a` (default: `button`).
- `href` — URL, только при `tag: 'a'`.
- `disabled` — `true` для disabled-состояния.

Примеры:
```pug
+ssBtn('Отправить', { variant: 'primary' })
+ssBtn('Скачать',   { variant: 'outline', icon: 'plus-circle', iconSide: 'left' })
+ssBtn('Подробнее', { tag: 'a', href: '/about', size: 'mini' })
```

### Каталог `src/pug/ui/buttons.pug`

Матрица всех вариантов big/mini + примеры иконок, состояний, тега `a` vs `button`, `--full`. Служит справочником для команды.

### Таблица цветов вариантов + hover:
     
  Вариант: btn 1 (primary)
  bg (normal): --accent1 #0044BB
  border (normal): —
  text (normal): --white
  bg (hover): --accent2 #08428C
  border (hover): —
  text (hover): --white
  ────────────────────────────────────────
  Вариант: btn 2
  bg (normal): --secondary2
  border (normal):
  text (normal):--primary
  bg (hover):--primary
  border (hover):
  text (hover):--white
  ────────────────────────────────────────
  Вариант: btn 3 (outline)
  bg (normal): transparent
  border (normal): 1px solid var(--accent1);
  text (normal): --accent1
  bg (hover): --accent1
  border (hover): --accent1
  text (hover): --white
  ────────────────────────────────────────
  Вариант: btn 4 (outline-dark)
  bg (normal): transparent
  border (normal):1px solid var(--primary1);
  text (normal):--primary1
  bg (hover):transparent
  border (hover):--accent2
  text (hover):--accent2
  ────────────────────────────────────────
  Вариант: btn 5 (dark)
  bg (normal): --primary
  border (normal):
  text (normal):--white
  bg (hover):--accent1
  border (hover):
  text (hover):--white
  ────────────────────────────────────────
  Вариант: btn 6 (light)
  bg (normal): --accent3
  border (normal):
  text (normal):--white
  bg (hover):--accent4
  border (hover):
  text (hover):--white
  ────────────────────────────────────────
  Вариант: btn 7 (outline-light)
  bg (normal): transparent
  border (normal):--secondary
  text (normal):--secondary
  bg (hover):--accent2
  border (hover):
  text (hover):--white
  ────────────────────────────────────────
  Вариант: btn 8 (white)
  bg (normal): --white
  border (normal): 1px solid var(--primary1);
  text (normal): --primary1
  bg (hover): --white
  border (hover): --accent2
  text (hover): --accent2


## Текстовые ссылки

Компонент `.ss-link` — универсальная текстовая ссылка редизайна с опциональной иконкой справа/слева. Стили — в `src/scss/base/_ss-link.scss`.

### Класс и модификаторы

- Базовый класс: `.ss-link` — визуально совпадает с variant 2 (`--accent1` → hover `--secondary`) и размером `lg` (18px).
- Цветовые варианты (см. таблицу ниже): `.ss-link--dark`, `.ss-link--light`, `.ss-link--white`.
- Размеры: базовый — `lg` (18px, gap 10, иконка 20×20). Модификаторы — `.ss-link--md` (14px, gap 6, иконка 16×16), `.ss-link--sm` (12px, gap 6, иконка 14×14).
- Общее: `font-family: Inter`, `font-weight: 500 (Medium)`, `line-height: 1.4`, `text-decoration: none`.

### Иконка

Иконка — опциональна. Один и тот же класс `.ss-link` работает и с иконкой, и без: `column-gap` в `inline-flex` не создаёт лишнего отступа, если flex-детей всего один.

Дефолтная иконка в миксине — `arrow-right` (справа). Можно поменять на любую другую из спрайта через опцию `icon`, положение — через `iconSide: 'left'`, а `icon: null` — вывести ссылку без иконки.

### Состояния

- **hover** — свой цвет для каждого варианта (см. таблицу).
- **focus** — пока не заданы (макет не показывает; уточним и добавим позднее).
- **disabled** — универсально: `pointer-events: none; opacity: .4`. Работает через `[disabled]` (для button) и `.is-disabled` (для `<a>`).

### Тег

`.ss-link` — обычно `<a>` (для ссылок), но при желании применимо к `<button>` (стили одинаковые).

### Использование через миксин

Миксин `+ssLink(text, opts)` из `src/pug/mixins/_ss-link.pug` (подключён в `layout-ui.pug` через `_mixins-links.pug`).

Опции:
- `variant` — `primary` | `dark` | `light` | `white` (default: `primary`).
- `size` — `lg` | `md` | `sm` (default: `lg`).
- `icon` — имя иконки без префикса `svg-`; **default: `arrow-right`**. Передай `null` — иконки не будет.
- `iconSide` — `right` | `left` (default: `right`).
- `tag` — `a` | `button` (default: `a`).
- `href` — URL (default: `'#'`), только при `tag: 'a'`.
- `disabled` — `true` для disabled-состояния.

Примеры:
```pug
+ssLink('Политика обработки')
+ssLink('Скачать', { variant: 'dark', size: 'md' })
+ssLink('Подробнее', { icon: null })            // без иконки
+ssLink('Наверх', { variant: 'white', size: 'sm' })
```

### Каталог `src/pug/ui/links.pug`

Матрица «варианты × размеры» + `white` на тёмной подложке + примеры (иконка справа/слева/без, disabled). Служит справочником для команды.

### Таблица цветов вариантов + hover

| # | Modifier | normal | hover |
|---|---|---|---|
| 2 | `.ss-link` (default) | `--accent1` | `--secondary` |
| 4 | `.ss-link--dark` | `--primary` | `--accent2` |
| 3 | `.ss-link--light` | `--accent3` | `--primary` |
| 1 | `.ss-link--white` | `--secondary1` | `--white` |

## Брейкпоинты

Подход — **desktop-first**: базовые стили пишутся для самого крупного экрана, при сужении применяются медиа-запросы через `max-width`.

Ниже 360px не поддерживаем.

Точки перелома объявлены в `src/scss/base/_var.scss`:

| Ключ    | Значение | Диапазон    | Что примерно |
|---------|----------|-------------|---|
| `$xs`   | 360px    | 360 – 767   | phones |
| `$md`   | 768px    | 768 – 1023  | tablets portrait |
| `$lg`   | 1024px   | 1024 – 1199 | tablets landscape / small laptop |
| `$xl`   | 1200px   | 1200 – 1439 | desktop |
| `$xxl`  | 1440px   | 1440 – 1919 | large desktop |
| `$xxxl` | 1920px   | 1920+       | huge |

### Миксины

- **`down($bp)`** — desktop-first, применяет стили при ширине **меньше** переданного брейкпоинта. Основной инструмент.
- **`up($bp)`** — mobile-first (для точечных случаев).

Использование:
```scss
.foo {
    padding: 80px;                          // база = desktop
    @include down($xl)  { padding: 30px; }  // ниже 1200 → 30
    @include down($md)  { padding: 20px; }  // ниже 768 → 20
}
```

## div container

`.ss-container` — технический контейнер редизайна. Стили — в `src/scss/base/_container.scss`.

**Что делает:**
- Ширина `100%`, ограничена `max-width: 1920px` (включая padding — на экране 1920 контент = 1760px).
- По центру через `margin-inline: auto`.
- Горизонтальный padding по брейкпоинтам:
  - **80px** — по умолчанию (xl+, то есть 1200+);
  - **30px** — ниже `$xl` (0–1199);
  - **20px** — ниже `$md` (0–767).
- `box-sizing: border-box` — задан явно, чтобы контейнер работал в любом контексте.

Вертикальные отступы (`padding-block`) не задаются — каждая секция контента сама решает свои верхние/нижние отступы.

Модификаторы (напр. `--narrow`) не введены — вводим по мере появления макетов другой ширины.

Использование:
```pug
.ss-container
    // содержимое секции
```

## .ss-section — вертикальные отступы между секциями

Единая обёртка для секций контента. Стили — в `src/scss/sections/_section.scss`.

**Вертикальный padding по брейкпоинтам:**
- **70px** — по умолчанию (desktop ≥ `$xxl` = 1440+);
- **60px** — ниже `$xxl` (0–1439);
- **50px** — ниже `$md` (0–767).

**Логика «одинарный gap между белыми секциями»:**
Через сиблинг-селектор у второй подряд идущей БЕЛОЙ секции снимается `padding-top`. Так визуальный зазор между двумя белыми секциями = 70, а не 140.

| Сосед слева | Сосед справа | Зазор (desktop) |
|---|---|---|
| Белая `.ss-section` | Белая `.ss-section` | 70 |
| Белая | Цветная `.ss-section--tinted` | 140 |
| Цветная | Белая | 140 |
| Цветная | Цветная | 140 |

Класс-маркер `.ss-section--tinted` сам не даёт стилей — он нужен ТОЛЬКО как «якорь» для сиблинг-селектора: если у соседа есть `--tinted`, селектор не срабатывает и обе секции сохраняют свои полные паддинги.

**Как править массовые отступы между секциями:**
Если дизайнер просит «уменьшить/увеличить все отступы между блоками» — правим ТОЛЬКО `.ss-section { padding-block: … }` в `_section.scss` (все три брейкпоинта: default + `$xxl` + `$md`) и синхронизируем комментарий + таблицу выше в этом файле.

**Что НЕ является `.ss-section`:**
Hero-секции, running-line, footer, header — не используют этот класс и живут со своими паддингами. Их стили здесь не трогаем.

## Grid

Базовая 12-колоночная сетка редизайна. Стили — в `src/scss/base/_grid.scss`.

### Базовый класс

- `.ss-grid` — 12 колонок, `display: grid`, `grid-template-columns: repeat(12, 1fr)`.
- `column-gap` = `row-gap`:
  - **30px** (xxl+, база, 1440+);
  - **20px** (ниже `$xxl`, 0–1439);
  - **10px** (ниже `$lg`, 0–1023).

### Модификатор общего числа колонок

- `.ss-grid--10` — переключает сетку на 10 колонок (через CSS-переменную `--ss-cols`).

### Дочерние span'ы

Ребёнок указывает свою ширину классом `.ss-col-<N>`, где N от 1 до 12 (= сколько колонок он занимает):

```pug
.ss-grid
    .ss-col-4 …
    .ss-col-8 …
```

Адаптивные версии (desktop-first, применяются при ширине **ниже** брейкпоинта): `.ss-col-xxl-<N>`, `.ss-col-xl-<N>`, `.ss-col-lg-<N>`, `.ss-col-md-<N>`.

Пример: `.ss-col-4.ss-col-lg-6.ss-col-md-12` — 3 в ряд на xl+, 2 на lg (1024–1199), 1 на md и ниже.

### Родительский модификатор «N в ряду»

Быстрый способ для однородной раскладки (все дети одинаковой ширины) без классов на детях:

- `.ss-grid--row-<N>`, где N ∈ {1, 2, 3, 4, 6, 12} (делители 12).
- Адаптивные: `.ss-grid--xxl-row-<N>`, `.ss-grid--xl-row-<N>`, `.ss-grid--lg-row-<N>`, `.ss-grid--md-row-<N>`.

Пример:
```pug
.ss-grid.ss-grid--row-3.ss-grid--md-row-1
    div …
    div …
    div …
```
3 в ряд от 768 и выше, 1 в ряд ниже 768.

### Каталог `src/pug/ui/grid.pug`

Типовые раскладки для справки: `.ss-col-N`, адаптивные, `.ss-grid--row-N`, `.ss-grid--10`.

## Фоны секций и блоков (утилиты)

Утилиты `.ss-bg-<name>` в `src/scss/base/_global.scss` — задают фон и парой дефолтный цвет текста (чтобы контрастность не терялась).

| Класс             | background        | text (default) |
|-------------------|-------------------|----------------|
| `.ss-bg-white`    | `--white`         | `--primary`    |
| `.ss-bg-gray`     | `--secondary3`    | `--primary`    |
| `.ss-bg-primary1` | `--primary1`      | `--white`      |
| `.ss-bg-primary`  | `--primary`       | `--white`      |

**Специфика с `!important`:**
- `background-color` — с `!important`. Фон утилиты всегда перебивает фон компонента.
- `color` — **без** `!important`. Это default для читаемости; можно точечно переопределить через `.ss-txt-*` (у которых `color !important`).

Пример:
```pug
section.ss-bg-primary
    p Белый текст по default

section.ss-bg-primary
    p.ss-txt-accent3 Аквамариновый — переопределили через .ss-txt-*

section.ss-bg-gray
    // тёмный текст по default
```
  ## Grid структура

  
## SECTION HEADER
1. Делаем .ss-kicker со стилями
```scss
на больших экранах
{font-family: var(--font-family);
font-weight: 500;
font-size: 18px;
line-height: 140%;
text-transform: uppercase;
color: var(--accent1);}
на моб версии: font-size: 14px;
от 768 до 1200 можем сделать: font-size: 16px;

2.Переходим к ss-section-header
стили заголовка те же, что у .ss-h2
{
  font-family: var(--font-family);
font-weight: 600;
font-size: 50px;
line-height: 120%;
color: var(--primary);
}
на моб версии 
{
  font-size: 28px;
  line-height: 130%
}

3. .ss-section-intro
- Заголовок такой же, как .ss-h2
- текст описание
{
  font-family: var(--font-family);
font-weight: 400;
font-size: 24px;
line-height: 130%;
color: var(--primary);
}
на моб версии 
{
  font-size: 16px;

}
между заголовокм и описанием 10пкс
- ссылка со стрелкой - такой компонент уже есть
{
  font-family: var(--font-family);
font-weight: 500;
font-size: 18px;
line-height: 140%;
color: var(--accent1);
}
на моб версии 
{
  font-size: 18px;
}
```
## TAGS-LABELS
ширина по контенту,
- стили компонента на белом фоне
{
  background: var(--white);
  border-radius: 10px;
  padding: 8px 16px;
  height: 38px;

  font-family: var(--font-family);
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  color: var(--accent1)
}
На моб версии стили те же
- на темном фоне
{
  background: var(--primary);
  color: var(--white);
}
-для группы компонентов: флекс родитель с wrap:wrap; и gap: 10px;
```
### Дополнения
В папку temps/tags-ui.png И дополни ui  с тегами. На картинке теги с фоном
- background: var(--accent1);
- background: var(--accent3);
- background: var(--primary);
- background: var(--white); color: var(--accent1);
- background: var(--white); color: var(--accent3);

## Секция задачи
-просмотри картинку в папке Temps task-cards.png для анализа одной карточки
-Как лучше добавиь картинку: img  или из спрайта. Я думаю лучше png, так как там спрайт будет с градиентами, он сложнее
- Стили карточки:
{
  background: var(--white);
  border: 1px solid var(--secondary2);
  border-radius: 10px;
  padding: 0 0 40px;
  height:534px;
}
Размеры заголовка, текста такие же, как и в карточке feature. Расстояние между картинкой и текстовой частью 20пикс. Расстояние между заголовком и текстом 10пикс
Стили ссылки{
  font-family: var(--font-family);
font-weight: 500;
font-size: 18px;
line-height: 140%;
color: var(--accent3);
}
Ссылка отодвинута к низу карточки. Можно, наверное, в карточке создать три ряда: картинка+текстовая часть + ссылка. row-gap 20 пикс и текстовой части задать flex-grow:1;

На моб версии row-gap 10 пикс

Секцию из всех карточек, пока, не надо верстать, так как эти 4 карточки на меньших экранах переходят в слайдер. Это видно на картинке task-cards-mobile.png

## Списки
В папку temps добавила картинки вариантов списков:list1.png и такой же, когда на темном фоне list1-on-dark.png  и еще один список с декоративными маркерами. Сделай анализ и скажи, каким образом будешь работать для создания такого компонента? Для простого списка с точкой, думаю не подойдет дефолтный тип circle для list-type-style , так как в этом случае текст, при переходе на вторую строку, он пойдет под точку. А на макете не так, текст под текстом.
```

## Карточки — поведение текста внутри

Правило распространяется на **любую карточку с текстовым контентом** (заголовок + описание + опциональная ссылка/кнопка): категория, продукт, статья, задача, кейс, преимущество. Ширина карточки в сетке меняется от десктопа к мобилке — типографика внутри должна тянуться и корректно ломаться, чтобы длинное слово (напр. «свободноплавающим») не выпадало за границы и не «резалось» об `overflow: hidden`.

**Заголовок карточки — fluid font-size + автоперенос по словарю.**

```scss
.ss-<component>-card .ss-semi-22 {
    font-size: clamp(<mob>px, ..., <desk>px);  // узкий диапазон под конкретную карточку
    overflow-wrap: break-word;                  // рвём слово только если физически не влезает
    hyphens: auto;                              // авто-переносы по языку из <html lang="ru">
}
```

Что даёт:
- `font-size: clamp(...)` — размер плавает от мобильного к десктопному в диапазоне viewport 744↔1920 (те же брейкпоинты, что у `.ss-fs-*`). Заголовок в узкой карточке никогда не оказывается слишком крупным.
- `overflow-wrap: break-word` — если слово всё же не помещается ни при какой ширине, браузер рвёт по букве (без дефиса). Страховка последней инстанции.
- `hyphens: auto` — браузер ставит перенос со `-` по русским правилам (Chrome / Firefox / Safari все поддерживают, требует `lang="ru"` на `<html>` — есть в наших layouts). Заголовок «свободно­плавающим» разобьётся аккуратно, а не рубанком.

**Описание карточки** — то же самое: `overflow-wrap: break-word` + `hyphens: auto`. Часто описание — регулярный body-текст (напр. `.ss-reg-14`), fluid font-size ему обычно не нужен, только правила переноса.

**Ссылка/кнопка в футере карточки** — не нуждаются в переносах (одна короткая строка + иконка). Не применять к ним.

**Почему это карточное правило, а не глобальное на весь сайт.** Для широких текстов (лид под H2 в секции, статья) `hyphens: auto` уместен, но `overflow-wrap: break-word` там мешает — длинные URL/названия деталей ломаются посреди слова без надобности. В карточках же ширина малая и постоянно меняется — правило безопасно и необходимо.

**То же правило — для `h1` в hero внутренних страниц.** Заголовки категорий часто одно длинное слово (`Конденсатоотводчики`, `Пароконденсатные`), а колонка hero на мобилке — узкая. Прописано в `.ss-hero-inner__body-inner .ss-h1`: `overflow-wrap: break-word; hyphens: auto;` — браузер сам ставит перенос по русскому словарю (нужен `lang="ru"` на `<html>` — есть). На широком десктопе правило не срабатывает (слово помещается), на мобилке аккуратно переносит с дефисом вместо горизонтального скролла.

## Изображения

По умолчанию — 2 файла на картинку:
- `name.png` — 1x
- `name@2x.png` — для retina

Gulp конвертит в WebP. В pug ссылка через `<picture>` + `srcset`:

```pug
picture
    source(srcset='/img/name.webp 1x, /img/name@2x.webp 2x')
    img(src='/img/name.webp' alt='')
```

**Если размер картинки на mobile сильно отличается от desktop** (более чем в ~2 раза — типичный кейс: hero-фон, background карточек во всю ширину), добавляем ещё пару мобильных вариантов:
- `name-mob.png` — 1x
- `name-mob@2x.png` — для retina

Разметка с двумя `<source media>`:

```pug
picture
    source(media='(max-width: 767px)' srcset='/img/name-mob.webp 1x, /img/name-mob@2x.webp 2x')
    source(media='(min-width: 768px)' srcset='/img/name.webp 1x, /img/name@2x.webp 2x')
    img(src='/img/name.webp' alt='')
```

Точка перехода — `$md` (768px).

**Зачем.** PageSpeed Insights → аудит «Properly size images». На мобильной сети лишние сотни kB картинки бьют в LCP (Core Web Vitals) — SEO-фактор.

**Когда достаточно 2 файлов (без mob-вариантов):**
- Иконки, аватары, логотипы (небольшие сами по себе).
- Картинки, чья ширина в рендере мало меняется между mobile и desktop.
- Всё, где экономия от мобильной версии < ~30 kB.

**`alt`-текст:**
- Декоративная фоновая картинка → `alt=""`.
- Смысловая (иллюстрация, схема, фото продукта) → короткое описание.

### Атрибуты `width` и `height` на `<img>`

Всегда прописываем интринзик-размеры (в пикселях 1x-исходника) прямо на теге:

```pug
picture
    source(srcset='/img/name.webp 1x, /img/name@2x.webp 2x')
    img(src='/img/name.webp' width='400' height='300' alt='')
```

**Зачем.** До загрузки картинки браузер по `width/height` резервирует под неё коробку правильных пропорций → нет прыжка макета при подгрузке (Cumulative Layout Shift, CLS — Core Web Vitals / SEO-фактор). Без атрибутов PageSpeed Insights ругается на аудит «Image elements do not have explicit width and height».

Указываем **настоящие пиксели 1x-варианта** (например `800` и `600`) — не CSS-размеры и не размеры retina. Итоговые визуальные габариты в компоненте задаём через CSS.

### Устойчивость к смене пропорций (админ загрузил другую картинку)

Админ (или редактор Битрикса в CMS) может подгрузить картинку с соотношением сторон, отличным от макетного. Верстка компонента не должна ехать. Правило: **коробка под картинку задаётся родителем, а сама картинка её заполняет через `object-fit`**.

```scss
.ss-card__img {
    width: 100%;
    aspect-ratio: 4 / 3;   // или фиксированная height — по макету
    overflow: hidden;       // страховка от вылета — см. подправило ниже

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
}
```

Что бы админ ни загрузил — 16:9, 1:1, вертикальный портрет — коробка `.ss-card__img` останется того же размера, соседи по сетке не съедут, а картинка внутри подстроится по `object-fit`.

### Коробка под картинку — всегда `overflow: hidden`

Если у div-обёртки картинки задан `aspect-ratio` / фиксированная `height` (и внутри `img` с `object-fit`) — на обёртке **обязательно** `overflow: hidden`. Иначе картинка может вылезти за границы коробки: браузер сначала применяет intrinsic-размер `<img>` (из атрибутов `width`/`height` или natural size), потом уже CSS `width:100%;height:100%` — и в пограничных случаях (нестандартный aspect админской картинки, отсутствие явных атрибутов, специфика `contain`) успевает нарисовать overflow. `overflow: hidden` — дешёвая страховка.

**Не делаем это глобальным правилом** (`div:has(img) { overflow: hidden }`) — глобально это ломает focus-outline, тултипы/поповеры и намеренно «выпирающий» декор. Ставим точечно, на конкретный класс-коробку картинки в каждом компоненте.

### Как выбрать `object-fit`

| Значение   | Когда использовать                                                                                                                      |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `cover`    | Дефолт для фонов, hero-картинок, галерей, карточек с картинкой во всю плашку. Заполняет коробку, лишнее обрезается по краям.             |
| `contain`  | Логотипы, иконки продуктов, схемы, диаграммы — где важно показать картинку **целиком** без обрезки (по краям появятся пустые поля).      |
| `fill`     | Практически не используем — картинка растянется без сохранения пропорций (деформация).                                                  |
| `none`     | Практически не используем — картинка не масштабируется, лишнее обрезается по коробке.                                                   |

`object-position` — куда сдвинуть картинку при обрезке (по умолчанию `center`). Для фото людей часто нужен `top` или `50% 25%`, чтобы не срезать голову.

### Проверка компонента на устойчивость

В `temps/` лежат три тестовых картинки разных пропорций — `1.webp`, `2.webp`, `3.webp`. Когда собираем новый компонент с картинкой «от админа», подставляем эти три подряд и убеждаемся, что:
- коробка компонента сохраняет заданные габариты;
- соседи по сетке не съезжают;
- выбранный `object-fit` даёт визуально приемлемый результат на всех трёх пропорциях.

## Производительность JS — ленивая загрузка Swiper

Swiper.js (~140 КБ) — самая тяжёлая внешняя зависимость на сайте. Он **не грузится на первом рендере** публичной страницы, а подтягивается только когда первый `.swiper` приближается к вьюпорту. Убирает предупреждение «Reduce unused JavaScript» в PageSpeed и снижает Total Blocking Time на мобилке.

### Как это устроено

- **`src/js/00-swiper-loader.js`** — определяет `window.whenSwiperReady(cb)` и через `IntersectionObserver` (rootMargin 200px) ждёт, пока первый элемент `.swiper` приблизится к вьюпорту. Тогда динамически добавляет `<script src="./libs/swiper/swiper.js">`. После загрузки — разбирает очередь колбэков.
- **Инициализаторы (`src/js/*-swiper.js`)** обёрнуты в `whenSwiperReady(function() { ... })` — тело выполняется только когда Swiper реально доступен.
- **URL swiper.js** лоадер вычисляет по трёхступенчатой схеме (см. ниже «Ключевое правило: путь до lazy-подгружаемых ассетов на Битриксе») — так работает и в чистой статике (`build/*.html`, `build/ui/*.html`), и когда верстка посажена в шаблон Битрикса.
- **CSS Swiper** (`libs/swiper/swiper.min.css`) грузится обычным `<link>` в `<head>` — он маленький (~18 КБ) и нужен сразу, иначе слайдер мигнёт неоформленным.
- **Только для public-сайта** (`layout.pug`). В UI-каталоге (`layout-ui.pug`) Swiper по-прежнему грузится сразу через `<script>` — там PageSpeed не важен, а eager-загрузка даёт мгновенно работающие слайдеры.

### Ключевое правило: путь до lazy-подгружаемых ассетов на Битриксе

Когда JS/CSS-ассет из `src/libs/**` подгружается динамически (через `document.createElement('script')` / `link`) — **нельзя** брать за основу относительный путь вида `./libs/…`. Причина: на боевом Битриксе верстка живёт в `/local/templates/<theme>/…`, а не в корне домена, и относительный путь резолвится в `https://site/libs/…` — где файлов нет. Даже если `<link>` на CSS «того же» ассета есть в исходной pug-разметке, Битрикс может склеить его в общий CSS-бандл (`BX.setCSSList([...])`) и отдельного `<link href="…swiper.min.css">` в DOM уже не будет — вытащить `href` неоткуда.

Алгоритм построения URL — трёхступенчатый фолбэк, реализован в `findBitrixTemplateBase()` / `loadSwiper()` в `src/js/00-swiper-loader.js`. Тем же порядком повторять для любого нового lazy-подгружаемого ассета:

1. **Ищем `<link>` парного CSS того же ассета** (напр. `link[href*="libs/swiper/swiper.min.css"]`) и меняем расширение — самый надёжный вариант, работает и для чистой статики, и для Битрикса, если `<link>` уцелел.
2. **Если `<link>` склеен в бандл** — определяем корень шаблона Битрикса по любому уже загруженному ассету вида `/local/templates/<theme>/…` (regex `/^(.*\/local\/templates\/[^\/]+\/)/` по `document.querySelectorAll('link[href], script[src]')`) и строим URL от него: `<base> + 'libs/<lib>/<file>'`.
3. **Фолбэк — относительный путь** `./libs/<lib>/<file>` — для чистой статики (`build/*.html`, `build/ui/*.html`), где `/local/templates/…` не бывает.

Никогда не хардкодить абсолютные пути (`/local/templates/xxx/libs/…`) — имя темы отличается между окружениями (dev/prod) и не должно попадать в исходники. Всегда вычислять base на рантайме.

### Как добавить новый слайдер

Разметка — обычный `.swiper` + класс-триггер (напр. `.js-my-slider`). Инициализатор — новый файл `src/js/my-slider.js` по шаблону:

```js
(function () {
    'use strict';
    var els = document.querySelectorAll('.js-my-slider');
    if (!els.length) return;
    whenSwiperReady(function () {
        els.forEach(function (el) {
            new Swiper(el, { /* config */ });
        });
    });
})();
```

Лоадер сам увидит `.swiper` элемент, дождётся приближения к вьюпорту, загрузит Swiper и вызовет колбэк.

### Как откатить на eager-загрузку (если что-то сломалось)

1. В `src/pug/layouts/layout.pug` перед `script(src="./js/main.js")` вернуть строку:
   ```pug
   script(defer src="./libs/swiper/swiper.js")
   ```
2. Инициализаторы (`src/js/*-swiper.js`) переписывать не нужно — при eager-загрузке `Swiper` определён к моменту вызова `whenSwiperReady()`, и колбэки выполняются сразу.
3. Файл `src/js/00-swiper-loader.js` можно удалить или оставить: при eager-загрузке он сам себя выключает (видит определённый `Swiper` и сразу выходит, не создавая observer).

## Swiper — CSS и разметка (правила верстки слайдеров)

### Чеклист нового слайдера

При добавлении каждого нового слайдера ответить на 4 вопроса:

1. **Карточка с тенью?** → добавить `padding: 5px` на `.swiper-slide` (см. «Тень карточки»)
2. **Карточки разной высоты?** → добавить equal-height стили (см. «Равная высота»)
3. **Какая навигация?** → выбрать один из 3 паттернов (см. «Навигация»)
4. **Есть пагинация?** → добавить `.swiper-pb` на `.swiper`; скрыть её на breakpoints, где достаточно стрелок

### Тень карточки — padding на слайд

Swiper по умолчанию ставит `overflow: hidden` на контейнер — `box-shadow` карточки обрезается по краю слайда.

**Фикс:** задать `padding` на `.swiper-slide` равный «разлёту» тени. Для теней вида `0 2px 15px 0 rgba(0,0,0,0.03)` достаточно `padding: 5px`.

Правило пишется в SCSS обёртки слайдера (не в файл карточки):

```scss
.js-my-slider .swiper-slide {
    padding: 5px;
}
```

Карточки с тенью в проекте (требуют padding):

| Карточка | box-shadow | padding нужен |
|---|---|---|
| `.ss-case-card` | `0 2px 15px 0 rgba(0,0,0,0.03)` | да |
| `.ss-partner-card` | `0 2px 15px 0 rgba(0,0,0,0.03)` | да |
| `.ss-product-card` | нет | нет |

> Если тень крайних слайдов (первого/последнего) всё равно обрезается — дополнительно поставить `overflow: visible` на `.swiper` и скомпенсировать ширину отрицательными отступами у родителя.

### Равная высота слайдов

Когда текст в карточках разной длины, Swiper ставит `height: 100%` каждому слайду — все слайды по высоте самого высокого. Но сама карточка не растягивается на всю высоту слайда.

```scss
.my-section .swiper-slide {
    height: unset;     // снимает height: 100% от Swiper
    min-height: 100%;  // слайд не меньше высоты самого высокого
    display: flex;
}

.my-section .ss-some-card {
    flex: 1;
    min-height: 0;
}
```

Применять, если карточки содержат переменный текст (заголовок, аннотация). Не нужно для слайдеров с фиксированным контентом (картинки, логотипы).

### Навигация — 3 паттерна

**1. Стрелки над слайдером** — паттерн по умолчанию  
Обёртка `.ss-slider-nav` (+ `.ss-slider-nav--accent` для акцентного цвета кнопок) в блоке `.ss-section-header`. Стрелки позиционируются абсолютно относительно header.

```pug
.ss-section-header
    .ss-section-header__title
        h2.ss-h2 Заголовок
    .ss-slider-nav.ss-slider-nav--accent
        button.ss-swiper-btn.ss-swiper-btn--prev(type='button' aria-label='Предыдущий')
            +svgIcon('chevron-left')
        button.ss-swiper-btn.ss-swiper-btn--next(type='button' aria-label='Следующий')
            +svgIcon('chevron-right')
.swiper.js-my-slider
    .swiper-wrapper
        .swiper-slide ...
```

**2. Стрелки по бокам слайдера** — `.ss-slider-side-nav`  
Ghost-стрелки снаружи `.swiper` как flex-siblings. На `< $lg`: слайдер 100% вверх, кнопки центрируются строкой ниже. Стрелки всегда видимы (не скрываются на мобильном в отличие от паттерна 1).

```pug
.ss-slider-side-nav
    button.ss-swiper-btn.ss-swiper-btn--ghost.ss-swiper-btn--prev(type='button' aria-label='Предыдущий')
        +svgIcon('chevron-left')
    .swiper.js-my-slider
        .swiper-wrapper
            .swiper-slide ...
    button.ss-swiper-btn.ss-swiper-btn--ghost.ss-swiper-btn--next(type='button' aria-label='Следующий')
        +svgIcon('chevron-right')
```

**3. Только пагинация, без стрелок**  
Добавить `.swiper-bars` (полоска-пагинация) и `.swiper-pb` (нижний отступ под пагинацию) на `.swiper`, внутри — `.swiper-pagination`.

```pug
.swiper.swiper-bars.swiper-pb.js-my-slider
    .swiper-wrapper
        .swiper-slide ...
    .swiper-pagination
```

### Пагинация и отступ `.swiper-pb`

`.swiper-pb` задаёт `padding-bottom` под пагинацию. Когда на определённом breakpoint пагинация скрыта (например, на desktop достаточно стрелок) — там же обнуляем padding:

```scss
@include down($md) {
    .my-section .swiper.swiper-pb {
        padding-bottom: 0;
    }
    .my-section .swiper-pagination {
        display: none;
    }
}
```

### Стрелки — передача в Swiper config

Стрелки всегда передаём через `el.parentElement.querySelector()` — не через глобальный CSS-класс. Это позволяет использовать несколько слайдеров одного типа на одной странице без конфликтов:

```js
new Swiper(el, {
    navigation: {
        prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
        nextEl: el.parentElement.querySelector('.ss-swiper-btn--next'),
    }
});
```

## Doc-layout — раскладка «документной» страницы

Универсальная двухколоночная раскладка для длинного контента (статья, кейс, описание системы). Левая колонка — основной `<main>` с секциями `.ss-content`, правая — sticky-sidebar с TOC/метаданными/CTA. На `<$lg` переходит в один стек.

Используется в `single-article`, `single-case`, задумана для `single-system` и подобных. Собрана в блок `blocks/_doc-layout.scss` + `blocks/_sticky-side.scss`, JS mobile-reflow — `src/js/doc-layout.js`.

### Разметочный скелет

```pug
section.ss-doc-layout__crumbs            //- полоса крошек с paddings под fixed-шапку
  .ss-container.ss-container--narrow.ss-wrapper
    nav.ss-breadcrumbs ...

section.ss-doc-layout.ss-single-<page>   //- + модификатор --with-toc, если нужен TOC
  .ss-container.ss-container--narrow.ss-wrapper
    .ss-doc-layout__grid
      header.ss-doc-layout__header       //- заголовок страницы (h1, теги, метрики)
      .ss-doc-layout__main
        .ss-content                      //- основной текст: h2 + p + ul + таблицы
      aside.ss-sticky-side.ss-doc-layout__aside
        //- для --with-toc сверху — nav.ss-toc.js-toc (остаётся виден на мобиле)
        //- остальные блоки — .ss-help-card / .ss-case-details / .ss-solutions-list
        //- все с атрибутом data-doc-extra → переносятся на мобиле вниз
      .ss-doc-layout__mobile-extras(data-doc-mobile-extras)  //- целевой контейнер переноса
```

### Два режима — выбор модификатором на корне

**1. Без TOC (дефолт)** — `section.ss-doc-layout` без модификатора. Пример — `single-case`.

Все sidebar-блоки помечены `data-doc-extra`. На `<$lg` JS переносит их в `.ss-doc-layout__mobile-extras` под контент; `aside` остаётся пустым и **скрывается** (`display: none`). Grid-template-areas на мобиле — без ряда `sidebar`:
```
'header'
'content'
'extras'
```

**2. С TOC** — `section.ss-doc-layout.ss-doc-layout--with-toc`. Пример — `single-article`.

В `aside` сверху — `nav.ss-toc.js-toc` **без** `data-doc-extra` (остаётся в sidebar). Остальные блоки с `data-doc-extra` переезжают вниз, но aside **не скрывается** — он содержит TOC. Grid-template-areas на мобиле — с рядом `sidebar` сверху:
```
'sidebar'   //- TOC с collapsible-toggle
'header'
'content'
'extras'
```

Линии-разделители у `.ss-sticky-side` на `<$lg` рисуются автоматически — обрамляют TOC-блок сверху/снизу.

### JS

Единый inliner — `src/js/doc-layout.js`. Ищет все `[data-doc-extra]` и переносит их в `[data-doc-mobile-extras]` на `<$lg`, возвращает обратно на resize ≥$lg. Матчит оба режима.

### Чеклист для новой страницы на `.ss-doc-layout`

1. Решить, нужен ли TOC. Если да → добавить `.ss-doc-layout--with-toc` на корневой `<section>` + `nav.ss-toc.js-toc` в aside.
2. Все sidebar-блоки, которые должны переехать на мобилу → пометить `data-doc-extra`.
3. В `main`-колонке обязательно оставить `.ss-doc-layout__mobile-extras(data-doc-mobile-extras)` — целевой контейнер.
4. `.ss-content` рассчитан на HTML из WYSIWYG админки: h2/h3/p/ul/ol/strong/em/blockquote/table стилизуются по тегу (`blocks/_content.scss`). Для спец-блоков использовать BEM-примитивы: `.ss-callout`, `.ss-fact-card`, `.ss-simple-table`, `.ss-metrics--light`, `.ss-cta-row`, `.ss-info-pair`.
5. Для `.ss-section-header` внутри `.ss-doc-layout__main` margin-bottom автоматически укорачивается до 20px (узкая колонка).
