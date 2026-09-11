// ==============================================================
// .ss-select — кастомный select (button + ul[role=listbox]).
//
// Крючок: все элементы с атрибутом data-select инициализируются.
// Механика:
//   · клик по .ss-select__control      — открыть/закрыть список,
//   · клик по .ss-select__option        — выбрать значение, закрыть,
//   · клик вне открытого select'а       — закрыть,
//   · клавиша Escape                    — закрыть + вернуть фокус на control,
//   · aria-expanded на control          — синхронизирован со stateм (CSS слушает).
//
// Данные (для внешних потребителей):
//   · data-value на .ss-select__option  — значение опции
//   · при выборе JS пишет data-value на корневой .ss-select
//     (можно читать снаружи для фильтров/сортировки без имитации <select>).
// ==============================================================
(function () {
	'use strict';

	var selects = document.querySelectorAll('[data-select]');
	if (!selects.length) return;

	selects.forEach(initSelect);

	function initSelect(select) {
		var control = select.querySelector('.ss-select__control');
		var list = select.querySelector('.ss-select__list');
		var options = select.querySelectorAll('.ss-select__option');
		var value = select.querySelector('.ss-select__value');

		if (!control || !list) return;

		control.addEventListener('click', function (e) {
			e.stopPropagation();
			toggle(select);
		});

		options.forEach(function (option) {
			option.addEventListener('click', function (e) {
				e.stopPropagation();
				choose(select, option);
				close(select);
				control.focus();
			});
		});
	}

	// Один глобальный слушатель на «клик мимо» — закрывает все открытые.
	document.addEventListener('click', function (e) {
		selects.forEach(function (select) {
			if (isOpen(select) && !select.contains(e.target)) close(select);
		});
	});

	// Escape — закрыть все открытые, вернуть фокус на control.
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') return;
		selects.forEach(function (select) {
			if (isOpen(select)) {
				close(select);
				select.querySelector('.ss-select__control').focus();
			}
		});
	});

	function isOpen(select) {
		var control = select.querySelector('.ss-select__control');
		return control && control.getAttribute('aria-expanded') === 'true';
	}

	function open(select) {
		select.querySelector('.ss-select__control').setAttribute('aria-expanded', 'true');
		select.querySelector('.ss-select__list').hidden = false;
	}

	function close(select) {
		select.querySelector('.ss-select__control').setAttribute('aria-expanded', 'false');
		select.querySelector('.ss-select__list').hidden = true;
	}

	function toggle(select) {
		if (isOpen(select)) close(select); else open(select);
	}

	function choose(select, option) {
		var options = select.querySelectorAll('.ss-select__option');
		var value = select.querySelector('.ss-select__value');

		options.forEach(function (opt) {
			opt.setAttribute('aria-selected', opt === option ? 'true' : 'false');
		});

		if (value) {
			value.textContent = option.textContent;
			value.classList.remove('ss-select__value--placeholder');
		}

		// Пишем data-value на корень — удобно читать снаружи (фильтры и т.п.).
		var v = option.getAttribute('data-value');
		if (v !== null) select.setAttribute('data-value', v);
	}
})();
