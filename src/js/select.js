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

		var isMulti = select.classList.contains('ss-select--checkbox');

		options.forEach(function (option) {
			option.addEventListener('click', function (e) {
				e.stopPropagation();
				// Клик по самому input внутри опции даст встроенный toggle —
				// не дублируем, чтобы не отменять его обратно.
				var clickedInput = e.target.closest('.ss-select__input');
				if (isMulti) {
					toggleOption(select, option, !clickedInput);
					// multi-select: dropdown открыт — выбираем несколько.
				} else {
					choose(select, option);
					close(select);
					control.focus();
				}
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
		var isRadio = select.classList.contains('ss-select--radio');

		options.forEach(function (opt) {
			opt.setAttribute('aria-selected', opt === option ? 'true' : 'false');
			// Для --radio синхронизируем нативный input внутри опции.
			if (isRadio) {
				var inp = opt.querySelector('.ss-select__input');
				if (inp) inp.checked = (opt === option);
			}
		});

		if (value) {
			var text = option.querySelector('.ss-select__option-text');
			value.textContent = text ? text.textContent : option.textContent;
			value.classList.remove('ss-select__value--placeholder');
		}

		// Пишем data-value на корень — удобно читать снаружи (фильтры и т.п.).
		var v = option.getAttribute('data-value');
		if (v !== null) select.setAttribute('data-value', v);

		emitChange(select);
	}

	// Публичный хук для внешних модулей (напр. src/js/filter-bar.js).
	// Снимает выбор с одной опции и обновляет control-подпись.
	// Для --radio снимает единственный выбор — возвращает control к placeholder.
	// Для --checkbox — просто ресинкает счётчик.
	window.ssSelect = {
		clearOption: function (option) {
			var select = option.closest('.ss-select');
			if (!select) return;
			var input = option.querySelector('.ss-select__input');
			option.setAttribute('aria-selected', 'false');
			if (input) input.checked = false;
			sync(select);
			emitChange(select);
		},
		clearAll: function (select) {
			if (!select) return;
			select.querySelectorAll('.ss-select__option[aria-selected="true"]').forEach(function (opt) {
				opt.setAttribute('aria-selected', 'false');
				var inp = opt.querySelector('.ss-select__input');
				if (inp) inp.checked = false;
			});
			sync(select);
			emitChange(select);
		},
		sync: function (select) {
			sync(select);
		}
	};

	// Пересчёт текста control на основе текущих aria-selected опций.
	// Универсально работает и для --radio, и для --checkbox.
	function sync(select) {
		var value = select.querySelector('.ss-select__value');
		if (!value) return;
		var placeholder = value.getAttribute('data-placeholder') || '';
		var selected = select.querySelectorAll('.ss-select__option[aria-selected="true"]');

		if (selected.length === 0) {
			if (placeholder) value.textContent = placeholder;
			value.classList.add('ss-select__value--placeholder');
			select.removeAttribute('data-value');
			return;
		}

		value.classList.remove('ss-select__value--placeholder');
		if (selected.length === 1) {
			var only = selected[0];
			var textEl = only.querySelector('.ss-select__option-text');
			value.textContent = textEl ? textEl.textContent : only.textContent.trim();
			select.setAttribute('data-value', only.getAttribute('data-value') || '');
			return;
		}
		value.textContent = 'Выбрано: ' + selected.length;
		var vals = Array.prototype.map.call(selected, function (o) {
			return o.getAttribute('data-value') || '';
		});
		select.setAttribute('data-value', vals.join(','));
	}

	// Диспатчим CustomEvent, чтобы внешние модули могли слушать изменения.
	function emitChange(select) {
		select.dispatchEvent(new CustomEvent('ss-select:change', { bubbles: true }));
	}

	// Multi-select: toggle aria-selected на опции (+ input.checked). Если
	// клик пришёл НЕ по самому input'у — синхронизируем input.checked сами.
	// Текст control пересчитывает общий `sync()`.
	function toggleOption(select, option, syncInput) {
		var input = option.querySelector('.ss-select__input');
		if (syncInput && input) input.checked = !input.checked;
		var checked = input ? input.checked : option.getAttribute('aria-selected') !== 'true';
		option.setAttribute('aria-selected', checked ? 'true' : 'false');
		sync(select);
		emitChange(select);
	}
})();
