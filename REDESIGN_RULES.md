# Правила работы над редизайном STEAMSYS

Проект представляет собой постепенный редизайн существующего рабочего сайта [STEAMSYS](https://www.steamsys.ru/).

Новая верстка будет внедряться на действующий сайт поэтапно. Поэтому при разработке необходимо учитывать существующую верстку и существующие стили сайта.
Существующие файлы, классы, глобальные стили, утилиты и архитектурные решения в репозитории не следует автоматически считать окончательными или рекомендуемыми для нового дизайна.

Перед переиспользованием существующих глобальных классов, reset-стилей или общих селекторов необходимо оценить риск конфликтов с действующим сайтом.

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

Источник иконок — [UI Kit Figma](https://www.figma.com/design/GNusOAwms0rjIjDfqDHG2o/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B?node-id=5741-15542). Иконки берём поштучно по мере надобности — на текущем этапе только `plus-circle` (используется в ui кнопок).

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
- Цветовые варианты: `.ss-btn--primary`, `--secondary`, `--outline`, `--outline-dark`, `--dark`, `--light`, `--outline-light` (см. таблицу ниже).
- Размер: базовый — big (padding 22×46, gap 24, font 22/1.3). Малый — модификатор `.ss-btn--mini` (padding 20×30, gap 20, font 18/1.4).
- На всю ширину: `.ss-btn--full` (`width: 100%`).
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
- `variant` — `primary` | `secondary` | `outline` | `outline-dark` | `dark` | `light` | `outline-light` (default: `primary`).
- `size` — `big` | `mini` (default: `big`).
- `full` — `true` для `width: 100%`.
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

## Header menu
 Переходим к сложному двух уровневому меню.
 Меню в закрытом виде: https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0
  %9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D
  0%BC%D1%8B--Copy-?node-id=25806-4510&t=GlOxKfyNxbtxbHmU-4

  Отображение второго уровня меню по ховеру - 1:
  https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B--Copy-?node-id=25807-8944&t=GlOxKfyNxbtxbHmU-4

  Отображение второго уровня меню по ховеру - 2:
  https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B--Copy-?node-id=25829-16167&t=GlOxKfyNxbtxbHmU-4

  Отображение второго уровня меню по ховеру - 3:
  https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B--Copy-?node-id=25829-16465&t=GlOxKfyNxbtxbHmU-4

  Отображение меню в моб версии:
  https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B--Copy-?node-id=25807-5564&t=GlOxKfyNxbtxbHmU-4

  Открытое по клику на иконку меню:
  https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B--Copy-?node-id=25807-6729&t=GlOxKfyNxbtxbHmU-4

  Открытие второго уровня меню в моб версии:
  https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/%D0%9F%D0%B0%D1%80%D0%BE%D0%B2%D1%8B%D0%B5-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B--Copy-?node-id=25829-15146&t=GlOxKfyNxbtxbHmU-4

  Есть только макеты для экрана 1920 и для моб версии.
  Сделай анализ макетов, какие первые выводы и вопросы?
  Стили, пока не бери из фигмы, просто анализ: как реализовать такое сложное меню.

  ### Вопросы и ответы
  1. Один DOM или два. Ок мой план — один DOM + CSS + JS для мобильного? Или разделить, чтобыбыло проще?
  Ответ: один DOM + CSS + JS для мобильного
 
  2. Триггер на desktop: только hover / только click / hover + click?
  Ответ: на desktop hover отображает мега меню второго уровня,
                    click переводит на внутреннюю страницу.
  
  3. Точка перехода desktop → mobile. Макетов только 1920 и 428. Что делаем на 744–1200 — уже бургер (mobile-подобное), или на планшете горизонтальный menubar остаётся? В _var.scss у нас: $md:744px;
  $tablet: 1024px; $laptop: 1200px; $desktop: 1440px. Предлагаю: до $laptop (1200) — мобильный вариант с
  бургером; от $laptop — горизонтальный menubar. Ок?
  Ответ: до $laptop (1200) — мобильный вариант с бургером
  
  4. Тип второго уровня (mega vs простой dropdown) — задаётся вручную для каждого корневого пункта в данных
   меню? Или по количеству подпунктов (>N → mega)?
  Ответ:
  
  5. Kлик вне и Escape — закрывают открытое подменю (desktop и mobile)? Обычно да, уточню на всякий.
  Ответ:
  
  6. «Получить КП» — это кнопка (модалка) или ссылка (<a>)? Пока просто визуально — .ss-btn --primary с
  иконкой?
  Ответ:
  
  7. Иконки для добавления в спрайт: carret-down, burger (mobile). Соцсети (VK, Telegram) — как выглядят в
  дизайне, надо ли сейчас добавлять?
  Ответ:
  
  8. Overlay/затемнение под mega-menu на desktop: на скринах panel непрозрачная тёмная, а само меню
  накладывается на страницу — нужен ли backdrop (полупрозрачное затемнение остальной страницы)?
  Ответ:
  
  9. Focus/keyboard nav: делаем ARIA menubar паттерн (Tab по пунктам, arrow-keys внутри) или упрощённо —
  Tab по всем ссылкам подряд, Escape закрывает?
  Ответ:
  
  10. JS-файл: класть в src/js/main.js (сейчас пустой) или отдельным src/js/header-menu.js с последующим
  concat в main.js?
  Ответ:

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

## Grid

Базовая 12-колоночная сетка редизайна. Стили — в `src/scss/base/_grid.scss`.

### Базовый класс

- `.ss-grid` — 12 колонок, `display: grid`, `grid-template-columns: repeat(12, 1fr)`.
- `column-gap` = `row-gap`:
  - **30px** (xl+, база);
  - **20px** (ниже `$xl`, 0–1199);
  - **10px** (ниже `$md`, 0–767).

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
  ## Grid структура

  
  