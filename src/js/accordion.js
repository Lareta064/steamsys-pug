// ==============================================================
// Пошаговая навигация по категориям в сайдбаре каталога.
// ==============================================================
(function () {
	'use strict';

	var navigation = document.querySelector('.ss-category-nav');
	if (!navigation) return;

	var panels = navigation.querySelectorAll('.ss-category-nav__panel');

	function showPanel(panelId) {
		var activePanel = null;
		panels.forEach(function (panel) {
			panel.hidden = panel.id !== panelId;
			if (!panel.hidden) activePanel = panel;
		});
		return activePanel;
	}

	function focusPanel(panel) {
		if (!panel) return;
		var target = panel.querySelector('.ss-category-nav__back, .ss-category-nav__button, .ss-category-nav__link');
		if (target) target.focus();
	}

	function selectItem(item) {
		var panel = item.closest('.ss-category-nav__panel');
		if (!panel) return;
		panel.querySelectorAll('.is-selected').forEach(function (selected) {
			selected.classList.remove('is-selected');
			if (selected.tagName === 'BUTTON') selected.setAttribute('aria-pressed', 'false');
			else selected.removeAttribute('aria-current');
		});
		item.classList.add('is-selected');
		if (item.tagName === 'BUTTON') item.setAttribute('aria-pressed', 'true');
		else item.setAttribute('aria-current', 'page');
	}

	navigation.addEventListener('click', function (event) {
		var openButton = event.target.closest('[data-category-open]');
		if (openButton && navigation.contains(openButton)) {
			selectItem(openButton);
			focusPanel(showPanel(openButton.getAttribute('data-category-open')));
			return;
		}

		var backButton = event.target.closest('[data-category-back]');
		if (backButton && navigation.contains(backButton)) {
			focusPanel(showPanel(backButton.getAttribute('data-category-back')));
			return;
		}

		var item = event.target.closest('.ss-category-nav__button, .ss-category-nav__link');
		if (item && navigation.contains(item)) selectItem(item);
	});
})();

// ==============================
// Локальный поиск по опциям фильтра в прототипе каталога.
// ==============================
(function () {
	'use strict';

	document.querySelectorAll('[data-filter-search]').forEach(function (field) {
		var input = field.querySelector('input[type="search"]');
		var list = document.getElementById(field.getAttribute('data-filter-search'));
		if (!input || !list) return;

		input.addEventListener('input', function () {
			var query = input.value.trim().toLocaleLowerCase('ru-RU');
			list.querySelectorAll('li').forEach(function (item) {
				item.hidden = query && item.textContent.toLocaleLowerCase('ru-RU').indexOf(query) === -1;
			});
		});
	});
})();

// ==============================================================
// .ss-accordion — раскрытие/сворачивание item'ов.
//
// Делегирование клика на document: любой клик по .ss-accordion__header
// внутри контейнера [data-accordion] переключает aria-expanded.
// Всё визуальное раскрытие (grid-template-rows: 0fr → 1fr,
// visibility) — на CSS, JS высоту не считает.
//
// Модификатор data-accordion="single" — режим «открыт только один item
// одновременно»: при раскрытии одного остальные внутри того же контейнера
// автоматически закрываются.
// ==============================================================
(function () {
	'use strict';

	document.addEventListener('click', function (e) {
		var header = e.target.closest('.ss-accordion__header');
		if (!header) return;

		var accordion = header.closest('[data-accordion]');
		if (!accordion) return;

		var isOpen = header.getAttribute('aria-expanded') === 'true';

		// Single-open режим — закрываем всё остальное перед раскрытием.
		if (!isOpen && accordion.getAttribute('data-accordion') === 'single') {
			accordion.querySelectorAll('.ss-accordion__header[aria-expanded="true"]').forEach(function (h) {
				h.setAttribute('aria-expanded', 'false');
			});
		}

		header.setAttribute('aria-expanded', String(!isOpen));
	});
})();
