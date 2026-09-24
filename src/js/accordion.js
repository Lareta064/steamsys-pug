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
