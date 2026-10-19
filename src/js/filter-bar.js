// ==============================================================
// .ss-filter-bar — применённые фильтры в виде чипов под формой.
//
// Слушает CustomEvent 'ss-select:change' (диспатчится select.js),
// при изменении любого .ss-select внутри .ss-filter-bar перерисовывает
// .ss-filter-bar__meta (контейнер с data-filter-chips) — список
// .ss-filter-chip + кнопка «Сбросить всё».
//
// Чип = «Placeholder: Значение [×]». При клике по × — вызываем
// window.ssSelect.clearOption(opt). При клике по «Сбросить всё» —
// window.ssSelect.clearAll(select) на всех select'ах панели.
// ==============================================================
(function () {
	'use strict';

	document.querySelectorAll('.ss-filter-bar').forEach(initFilterBar);

	function initFilterBar(bar) {
		var meta = bar.querySelector('[data-filter-chips]');
		if (!meta) return;

		// Первичный рендер (если в разметке уже стоит aria-selected='true').
		render(bar, meta);

		// Любое изменение любого select'а внутри панели → ре-рендер.
		bar.addEventListener('ss-select:change', function () {
			render(bar, meta);
		});

		// Делегирование кликов по чипам внутри meta.
		meta.addEventListener('click', function (e) {
			var removeBtn = e.target.closest('.ss-filter-chip__icon');
			if (removeBtn && removeBtn.dataset.optionIdx) {
				var opt = findOptionByUid(bar, removeBtn.dataset.optionIdx);
				if (opt && window.ssSelect) window.ssSelect.clearOption(opt);
				return;
			}
			var reset = e.target.closest('.ss-filter-chip--reset');
			if (reset) {
				bar.querySelectorAll('.ss-select').forEach(function (s) {
					if (window.ssSelect) window.ssSelect.clearAll(s);
				});
			}
		});
	}

	// Пробегаемся по всем select'ам bar'а, выбираем выбранные опции,
	// генерим чипы. UID опции — её позиция в полном списке bar'а,
	// хранится в data-option-idx на кнопке ×, чтобы потом найти опцию
	// по этому индексу обратно (не привязываем прямые DOM-референсы —
	// при ре-рендере meta они бы утратились).
	function render(bar, meta) {
		meta.innerHTML = '';
		var allOptions = Array.prototype.slice.call(
			bar.querySelectorAll('.ss-select__option')
		);
		var selected = allOptions.filter(function (o) {
			return o.getAttribute('aria-selected') === 'true';
		});

		if (!selected.length) return;

		selected.forEach(function (opt) {
			var idx = allOptions.indexOf(opt);
			var select = opt.closest('.ss-select');
			var valueEl = select.querySelector('.ss-select__value');
			var label = (valueEl && valueEl.getAttribute('data-placeholder')) || '';
			var textEl = opt.querySelector('.ss-select__option-text');
			var val = textEl ? textEl.textContent.trim() : opt.textContent.trim();
			meta.appendChild(makeChip(label, val, idx));
		});

		meta.appendChild(makeReset());
	}

	function findOptionByUid(bar, idx) {
		var all = bar.querySelectorAll('.ss-select__option');
		return all[parseInt(idx, 10)] || null;
	}

	function makeChip(label, value, idx) {
		var chip = document.createElement('span');
		chip.className = 'ss-filter-chip';

		var labelEl = document.createElement('span');
		labelEl.className = 'ss-filter-chip__label';
		labelEl.textContent = label + ':';
		chip.appendChild(labelEl);

		var valueEl = document.createElement('span');
		valueEl.className = 'ss-filter-chip__value';
		valueEl.textContent = value;
		chip.appendChild(valueEl);

		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'ss-filter-chip__icon';
		btn.setAttribute('aria-label', 'Убрать фильтр: ' + label.toLowerCase() + ', ' + value);
		btn.dataset.optionIdx = String(idx);
		// Inline-SVG «×» вместо <use href="#svg-cross"> — путь до спрайта
		// в разметке зависит от уровня страницы (basePath), а JS его не знает.
		// Иконка «×» одна линия + одна наклонная, inline весит <100 байт.
		btn.innerHTML = '<svg class="svg-cross" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><path d="M1 1 L7 7 M7 1 L1 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
		chip.appendChild(btn);

		return chip;
	}

	function makeReset() {
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'ss-filter-chip ss-filter-chip--reset';
		btn.textContent = 'Сбросить всё';
		return btn;
	}
}());
