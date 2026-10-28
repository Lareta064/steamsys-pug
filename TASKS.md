# STEAMSYS Redesign — Задачи в работе

Оперативный документ для активных задач и переписки по ним. Формат — короткое ТЗ + вопросы-ответы, ссылки на скрины/макеты.

**По завершении задачи:**
- Финальный API компонента и его стили → переносим в `REDESIGN_RULES.md`.
- Черновики, вопросы-ответы, ссылки на референсы → удаляем.

Это позволяет держать `REDESIGN_RULES.md` как чистый справочник, а рабочую переписку — здесь.


## Кейсы и отзывы (в работе)

Секция из двух колонок. Скрины: `temps/cases-section-desktop.png`, `temps/cases-section-mobile.png`.
Ряд с заголовочной частью + ряд из двух колонок равной ширины с просветом 30px, фон секции `--secondary3`.

**Статус подкомпонентов:**
- ✅ **Верхний слайдер партнёров** — готов, см. `/ui/partners-slider.html`.
  Компоненты: `.ss-partner-card` (`src/scss/blocks/_partner-card.scss`),
  `.ss-partners-slider` (`src/scss/blocks/_partners-slider.scss`),
  инициализация — `src/js/partners-swiper.js`.
  Иконки `chevron-left`/`chevron-right` — в спрайте.
- ✅ **Нижний слайдер отзывов** — готов, там же на `/ui/partners-slider.html`.
  Компонент карточки `.ss-review-card` (`src/scss/blocks/_review-card.scss`),
  инициализация — `src/js/reviews-swiper.js`. 1 слайд, пагинация-полоски.
  Многолинейный ellipsis описания через `-webkit-line-clamp` (4 строки десктоп / 3 моб).
- ⏳ **Левая колонка (карточка кейса)** — ждём спецификацию.
- ⏳ **Сборка секции целиком** — после готовности всех подкомпонентов.

**Готовые ассеты в `src/img/`:** `cases.png` + `@2x`, `cases-mob.png` + `@2x`,
`partner1..4.png` + `@2x`, `ava.png` + `@2x`.


## Опросные листы (ждёт обратной связи от программиста)

Хаб + страницы одного опросника. Статус: **2 эталонные страницы готовы**, ждём отзыв программиста до того, как собирать остальные 9.

**Готовые страницы (эталон):**
- ✅ `src/pug/pages/single-survey.pug` — Конденсатоотводчик (прод-схема `опросники-php/index1.php`).
- ✅ `src/pug/pages/single-survey-rou.pug` — РОУ (прод-схема `опросники-php/index8.php`).
- ✅ Хаб: `src/pug/sections/_surveys-list.pug` (карточки `.ss-survey-card`), страница `src/pug/pages/surveys.pug`.

**Оставшиеся 9 PHP → страницы (по порядку хаба):**

| PHP (в `опросники-php/`) | Форма (с `/oprosnye_formy/`) | Статус |
| --- | --- | --- |
| `index.php` | Конденсатный насос / станция возврата конденсата | ⏳ |
| `index2.php` | Регулирующий клапан | ⏳ |
| `index3.php` | Обвязка Калорифера | ⏳ |
| `index4.php` | Охладитель пара | ⏳ |
| `index5.php` | Автоматический паровой тепловой пункт (ИТП) | ⏳ |
| `index6.php` | Паровой теплообменник | ⏳ |
| `index7.php` | Регулятор прямого действия | ⏳ |
| `index9.php` | Эжектор | ⏳ |
| `index10.php` | Техническая экспертиза пароконденсатной системы | ⏳ |
| `index11.php` | Автоматическая станция ГВС SteamAqua | ⏳ |

**Паттерн сборки новой страницы (3 файла + 2 строки правок):**
1. `src/pug/pages/single-survey-<slug>.pug` — скелет (header → hero → body → footer → modal).
2. `src/pug/sections/_single-survey-<slug>-hero.pug` — hero: `ss-hero-inner.ss-hero-inner--dark`, kicker «Опросный лист», h1 = название формы, кнопка `О системе ...` в `__actions`.
3. `src/pug/sections/_single-survey-<slug>-body.pug` — форма по данным из PHP + сайдбар (nav + info-card). Стили переиспользуют `_single-survey.scss` (ничего регистрировать не нужно).
4. Ссылка в `src/pug/pages/index.pug` (строка под единым списком страниц).
5. `href` в `_surveys-list.pug` на соответствующей карточке.

**Договорённости по разметке (не отступать от них):**
- **name/id/required/radio-value/action** — 1-в-1 с PHP-шаблоном. **Не выдумывать.** Hidden-поля всегда: `save='Y'`, `TITLE='<тайтл из PHP>'`, `PAGE=''`, `rand=''` (PAGE/rand заполняет PHP на сервере).
- **Checkbox vs Radio** — строго по проду. РОУ научил: `kip`/`dopkomp` там radio, не чекбоксы (у меня первый раз был баг от WebFetch).
- **Consent** — всегда `input(type='checkbox' name='legal_top' value='Y' required)` + ссылка `/include/licenses_detail.php`.
- **Submit** — `+ssBtn('Отправить', { variant: 'white', full: true, tag: 'button' })(type='submit')` в `.ss-form-submit`.
- **Единицы измерения** (т/ч, бар, °C) — наши UX-добавки через `.ss-form-field--unit` + `.ss-form-field__unit`. В проде их в HTML нет, но добавляем для читаемости — программист решит, оставить или убрать.
- **File upload** — только если явно есть в PHP (у Конденсатоотводчика и РОУ нет). Не добавлять по умолчанию.
- **Section 0 «Кто заполняет»** — не используем (удалено ранее по правке заказчика).
- **Badge «Обязательно» / «Желательно» / «Необязательно»** — через UI-блок: `span.ss-tag.ss-tag--mini-primary` (синий) / `span.ss-tag.ss-tag--mini` (серый). **Не** через локальный `.ss-form-section__badge` (удалён).
- **Required-кружок номера** — через `.ss-form-section--required` → фон `--accent1`. Опциональные — `--secondary2`.
- **Сайдбар** на `<$md` скрыт целиком через `.ss-single-survey__aside { display: none }`.
- **Прогресс-бар** JS (`src/js/survey-progress.js`) ловит `.ss-single-survey__main` + `[data-progress-fill]` / `[data-progress-value]`. Ничего не трогать — само работает для новых страниц.
- **TOC** в сайдбаре — `nav.ss-form-nav.js-toc` + ссылки с `.ss-toc__link`. Активное состояние ставит `src/js/toc.js` через `[aria-current="location"]`.

**Что в UI framework добавлено за эту задачу (документировать в REDESIGN_RULES при закрытии):**
- `.ss-callout--warning` + `.ss-callout__icon` (base/_callout.scss) — жёлтая urgency-плашка.
- `.ss-survey-card` + `--featured` (blocks/_survey-card.scss) — карточка на хабе.
- `.ss-btn--wrap-sm` (base/_buttons.scss) — узкая wrap-кнопка для сайдбаров.

**Как возобновлять:** читаешь этот блок → открываешь `src/pug/sections/_single-survey-body.pug` или `_single-survey-rou-body.pug` как референс разметки → читаешь нужный `опросники-php/index{N}.php` → собираешь 3 pug-файла по паттерну выше → правишь `index.pug` + `_surveys-list.pug`.


## Header menu (отложено)

Двухуровневое меню. Возобновить, когда дойдём.

**Ссылки на макеты:**
- [Меню в закрытом виде](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25806-4510)
- [Ховер второго уровня — 1](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25807-8944)
- [Ховер второго уровня — 2](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25829-16167)
- [Ховер второго уровня — 3](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25829-16465)
- [Меню в мобилке (закрытое)](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25807-5564)
- [Открытое мобильное меню](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25807-6729)
- [Мобильное меню, второй уровень](https://www.figma.com/design/Emudhe0e8cYVzHudF6TP7e/Паровые-системы--Copy-?node-id=25829-15146)

Есть только макеты 1920 и мобильная версия.

### Вопросы и ответы

1. **Один DOM или два?**
   Ответ: один DOM + CSS + JS для мобильного.

2. **Триггер на desktop: только hover / только click / hover + click?**
   Ответ: на desktop hover открывает мега-меню второго уровня, click ведёт на внутреннюю страницу.

3. **Точка перехода desktop → mobile.**
   Ответ: до `$xl` (1200) — мобильный вариант с бургером; от `$xl` — горизонтальный menubar.
   *(Прим.: раньше был `$laptop: 1200`, после смены брейкпоинтов — `$lg: 1024`. Уточнить у пользователя.)*

4. **Тип второго уровня (mega vs простой dropdown).**
   Задаётся вручную для каждого корневого пункта или по количеству подпунктов (>N → mega)?
   Ответ: — Не поняла вопрос

5. **Клик вне и Escape закрывают подменю?**
   Ответ: — Да

6. **«Получить КП» — кнопка (модалка) или ссылка (`<a>`)?**
   Ответ: — кнопка (модалка)

7. **Иконки для добавления в спрайт:** `carret-down`, `burger` (mobile). Соцсети (VK, Telegram)?
   Ответ: — Уже добавлены, а иконка меню .menu-toggle сверстана через css и добавлен скрипт ее перестроения в крестик

8. **Overlay/затемнение под mega-menu на desktop?**
   Ответ: — Нет

9. **Focus/keyboard nav:** ARIA menubar (Tab по пунктам, arrow-keys внутри) или упрощённо (Tab по всем ссылкам, Escape закрывает)?
   Ответ: — Как правильно

10. **JS-файл:** `src/js/main.js` или отдельным `src/js/header-menu.js` с concat?
    Ответ: — Отдельный файл