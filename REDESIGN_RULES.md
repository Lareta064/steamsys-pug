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
  