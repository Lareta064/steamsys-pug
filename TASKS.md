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
   Ответ: до `$lg` (1024) — мобильный вариант с бургером; от `$lg` — горизонтальный menubar.
   *(Прим.: раньше был `$laptop: 1200`, после смены брейкпоинтов — `$lg: 1024`. Уточнить у пользователя.)*

4. **Тип второго уровня (mega vs простой dropdown).**
   Задаётся вручную для каждого корневого пункта или по количеству подпунктов (>N → mega)?
   Ответ: —

5. **Клик вне и Escape закрывают подменю?**
   Ответ: —

6. **«Получить КП» — кнопка (модалка) или ссылка (`<a>`)?**
   Ответ: —

7. **Иконки для добавления в спрайт:** `carret-down`, `burger` (mobile). Соцсети (VK, Telegram)?
   Ответ: —

8. **Overlay/затемнение под mega-menu на desktop?**
   Ответ: —

9. **Focus/keyboard nav:** ARIA menubar (Tab по пунктам, arrow-keys внутри) или упрощённо (Tab по всем ссылкам, Escape закрывает)?
   Ответ: —

10. **JS-файл:** `src/js/main.js` или отдельным `src/js/header-menu.js` с concat?
    Ответ: —

## Feedback
Верстаем секцию .ss-Feedback background: var(--primary1);
Скрин в temps/feedback.png и temps/feedback-mobile.png
Правая и левая часть колонки равной ширины с gap 30px( на моб версии row-gap:40px)
На экранах <1023  колонки становятся друг под другом (делаем эту точку переломной)
В правой части элемент контакта
стили верхнего текста
font-family: var(--font-family);
font-weight: 500;
font-size: 18px;(на моб версии 16px)
line-height: 140%;
text-transform: uppercase;
color: var(--secondary);
margin-bottom:10px;

стили нижнего текста:
font-family: var(--font-family);
font-weight: 600;
font-size: 40px; (на моб версии 24px)
line-height: 120%;(на моб версии 1.3px)
color: var(--white);

Текст в пункте Режим работы:
font-family: var(--font-family);
font-weight: 500;
font-size: 20px; (на моб версии 16px)
line-height: 140%;
color: var(--white);

Между элеметами с контактами по 40пикс.

Блок в правой части имеет стили:
border: 1px solid var(--secondary);
border-radius: 10px;
padding: 60px;(на моб версии 20px , на экранах <1919, можно уменьшить до 40px, <1439, можно уменьшить до 30px)

Заголовок над формой:
font-family: var(--font-family);
font-weight: 500;
font-size: 20px;
line-height: 140%;
color: var(--white);
под заголовком отступ до блока формы 40 пикс (на моб версии 20 пикс)
Блок с формой имеет gap 20px (на моб версии 10 пикс)

чек бокс - 20х20 , текст около чекбокса
font-weight: 500;
font-size: 14px;
line-height: 140%;
color: var(--secondary);

цвет ссылки var(--accent3);
