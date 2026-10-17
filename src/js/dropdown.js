// ==============================================================
// Dropdown: открытие/закрытие и выбор единицы измерения.
//
// Поддерживает ДВА типа контейнеров (одной логикой):
//   1) Наш UI-блок (blocks/_calc-field.scss):
//        .ss-calc-field__units
//          └─ .ss-calc-field__unit-btn (кнопка-переключатель)
//          └─ .ss-calc-field__unit-list
//                 └─ .ss-calc-field__unit-item.is-selected
//                        └─ .ss-calc-field__unit-check (галочка)
//                        └─ label.form-radio-label (optional, для JS бэка)
//                               └─ input[type=radio][hidden]
//                               └─ span.form-radio-name
//                        └─ ИЛИ просто span с текстом единицы
//
//   2) Разметка steamsys.ru (используется в _calc-single.pug и глобальном
//      селекторе ед. измерения .calculator-form__measure):
//        .dropdown
//          └─ .dropdown__button
//          └─ .dropdown__list
//                 └─ ul > li.dropdown__list-item
//                        └─ label.form-radio-label
//                               └─ input[type=radio]
//                               └─ span.form-radio-name
//
// Поведение:
//   · клик по кнопке → toggle .is-open + aria-expanded на контейнере
//   · при открытии контейнера — закрываем ВСЕ другие открытые (single-open)
//   · клик по пункту списка (li или .form-radio-label) → обновляем
//     подпись кнопки, снимаем .is-selected со всех сиблингов, ставим на
//     кликнутый, выставляем checked на input[type=radio] внутри него,
//     закрываем контейнер
//   · клик за пределами всех контейнеров → закрыть открытые
//   · ESC → закрыть открытые
//
// Scope делегирования — document. На странице может быть N контейнеров.
// ==============================================================
(function () {
	'use strict';

	// Два типа контейнеров. btn — селектор кнопки-переключателя;
	// box — селектор родительского контейнера-плашки (устанавливается .is-open).
	var TYPES = [
		{
			box: '.ss-calc-field__units',
			btn: '.ss-calc-field__unit-btn',
			list: '.ss-calc-field__unit-list',
			item: '.ss-calc-field__unit-item',
			btnText: '.ss-calc-field__unit-text'
		},
		{
			box: '.dropdown',
			btn: '.dropdown__button',
			list: '.dropdown__list',
			item: '.dropdown__list-item',
			btnText: null // у них текст лежит прямо в __button
		}
	];

	// Все открытые контейнеры страницы (прямое закрытие при single-open).
	function closeAll(exceptBox) {
		TYPES.forEach(function (t) {
			document.querySelectorAll(t.box + '.is-open').forEach(function (box) {
				if (box === exceptBox) return;
				box.classList.remove('is-open');
				box.classList.remove('is-up');
				var b = box.querySelector(t.btn);
				if (b) b.setAttribute('aria-expanded', 'false');
			});
		});
	}

	// Ищем ближайшего предка, который обрезает содержимое (overflow !==
	// visible). В нашей разметке это .is-hide-block > .form-two-cols
	// (overflow: hidden ради плавной grid-rows анимации) — внутри него
	// поповер снизу обрезается у нижних полей.
	function findClipAncestor(el) {
		var node = el.parentElement;
		while (node && node !== document.body) {
			var cs = getComputedStyle(node);
			var combined = cs.overflow + ' ' + cs.overflowX + ' ' + cs.overflowY;
			if (/hidden|clip|auto|scroll/.test(combined)) return node;
			node = node.parentElement;
		}
		return null;
	}

	// Решает, открывать ли поповер вверх. Класс .is-up ставим ПЕРЕД
	// is-open, чтобы rendering сразу был в правильной позиции (без флика).
	function positionDropdown(box, type) {
		// Снимаем прошлое положение — измерять нужно в дефолтной (вниз) ориентации.
		box.classList.remove('is-up');
		var list = box.querySelector(type.list);
		var btn = box.querySelector(type.btn);
		if (!list || !btn) return;

		// visibility:hidden не мешает измерению — высота у поповера реальная.
		var listH = list.getBoundingClientRect().height;
		var btnRect = btn.getBoundingClientRect();

		var clip = findClipAncestor(box);
		var limitTop = clip ? clip.getBoundingClientRect().top : 0;
		var limitBottom = clip ? clip.getBoundingClientRect().bottom : window.innerHeight;

		var GAP = 6;
		var fitsBelow = (btnRect.bottom + GAP + listH) <= limitBottom;
		var fitsAbove = (btnRect.top - GAP - listH) >= limitTop;

		if (!fitsBelow && fitsAbove) box.classList.add('is-up');
	}

	function toggle(box, type) {
		var isOpen = box.classList.contains('is-open');
		if (isOpen) {
			box.classList.remove('is-open');
			box.classList.remove('is-up');
			var b1 = box.querySelector(type.btn);
			if (b1) b1.setAttribute('aria-expanded', 'false');
		} else {
			closeAll(box);
			positionDropdown(box, type); // ставим .is-up ДО .is-open
			box.classList.add('is-open');
			var b2 = box.querySelector(type.btn);
			if (b2) b2.setAttribute('aria-expanded', 'true');
		}
	}

	// Из элемента списка (li или label.form-radio-label) достаём «текст
	// опции» для подписи кнопки. Приоритет: .form-radio-name → первый span → textContent.
	function pickItemLabel(item) {
		var name = item.querySelector('.form-radio-name');
		if (name) return name.textContent.trim();
		var span = item.querySelector('span');
		if (span) return span.textContent.trim();
		return item.textContent.trim();
	}

	// Обновляем подпись кнопки-переключателя внутри box.
	function setBtnLabel(box, type, label) {
		var btn = box.querySelector(type.btn);
		if (!btn) return;
		if (type.btnText) {
			var span = btn.querySelector(type.btnText);
			if (span) { span.textContent = label; return; }
		}
		// fallback — у steamsys .dropdown__button текст лежит прямо
		// в кнопке первым текстовым узлом; заменяем именно его, чтобы
		// не затронуть вложенные иконки / caret-псевдоэлементы.
		var replaced = false;
		for (var i = 0; i < btn.childNodes.length; i++) {
			var n = btn.childNodes[i];
			if (n.nodeType === 3 && n.textContent.trim()) {
				n.textContent = label;
				replaced = true;
				break;
			}
		}
		if (!replaced) btn.textContent = label;
	}

	// Выбор пункта: подпись + .is-selected + checked на radio + закрыть.
	function selectItem(box, type, item) {
		var label = pickItemLabel(item);
		setBtnLabel(box, type, label);

		// is-selected — на всех соседей по списку.
		var list = box.querySelector(type.list);
		if (list) {
			list.querySelectorAll(type.item + '.is-selected').forEach(function (el) {
				if (el !== item) el.classList.remove('is-selected');
			});
			item.classList.add('is-selected');
		}

		// checked — на radio внутри.
		var radio = item.querySelector('input[type="radio"]');
		if (radio) {
			var name = radio.getAttribute('name');
			if (name) {
				document.querySelectorAll('input[type="radio"][name="' + name + '"]').forEach(function (r) {
					r.checked = (r === radio);
				});
			} else {
				radio.checked = true;
			}
		}

		box.classList.remove('is-open');
		box.classList.remove('is-up');
		var btn = box.querySelector(type.btn);
		if (btn) btn.setAttribute('aria-expanded', 'false');
	}

	document.addEventListener('click', function (e) {
		// Проверяем все типы по очереди.
		for (var i = 0; i < TYPES.length; i++) {
			var t = TYPES[i];

			// 1) Клик по кнопке-переключателю → toggle.
			var btn = e.target.closest(t.btn);
			if (btn) {
				var box = btn.closest(t.box);
				if (box) {
					e.preventDefault();
					toggle(box, t);
					return;
				}
			}

			// 2) Клик по пункту списка (li или label внутри li) → selectItem.
			var item = e.target.closest(t.item);
			if (item) {
				var boxForItem = item.closest(t.box);
				if (boxForItem && boxForItem.classList.contains('is-open')) {
					e.preventDefault();
					selectItem(boxForItem, t, item);
					return;
				}
			}

			// 3) Клик по label.form-radio-label (у them.form-radio-label не
			//    всегда обёрнут в .dropdown__list-item на всех вариациях —
			//    страхуемся).
			if (!item) {
				var label = e.target.closest('.form-radio-label');
				if (label) {
					var boxForLabel = label.closest(t.box);
					if (boxForLabel && boxForLabel.classList.contains('is-open')) {
						e.preventDefault();
						// Используем сам label как «item» — он содержит radio и span.
						selectItem(boxForLabel, t, label);
						return;
					}
				}
			}
		}

		// 4) Клик вне всех контейнеров — закрываем все открытые.
		var insideAny = TYPES.some(function (t) {
			return !!e.target.closest(t.box);
		});
		if (!insideAny) closeAll(null);
	});

	// ESC — закрыть все открытые.
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeAll(null);
	});
}());
