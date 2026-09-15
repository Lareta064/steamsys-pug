// ==============================================================
// .ss-toc — «Содержание» статьи.
//
// 1. Mobile accordion toggle — на < $lg (CSS-стороне) отображается
//    кнопка .ss-toc__toggle + body[hidden]. Логика идентична
//    _section-blog.__accordion — синхронизируем aria-expanded ↔ [hidden].
//
// 2. Scroll-spy — активная ссылка меняется по мере скролла статьи.
//    Алгоритм: находим самую нижнюю секцию, чей top уже перекатился под
//    header (учитываем --header-height + небольшой offset). Работает
//    предсказуемо для длинных секций (в отличие от чистого
//    IntersectionObserver, где легко «залипнуть» между двумя).
//    rAF-троттлинг + пассивный scroll listener.
// ==============================================================
(function () {
	'use strict';

	var tocs = document.querySelectorAll('.js-toc');
	if (!tocs.length) return;

	tocs.forEach(function (toc) {
		// ---- Mobile accordion toggle ----
		var toggle = toc.querySelector('.ss-toc__toggle');
		var body = toc.querySelector('.ss-toc__body');
		if (toggle && body) {
			toggle.addEventListener('click', function () {
				var open = toggle.getAttribute('aria-expanded') === 'true';
				toggle.setAttribute('aria-expanded', String(!open));
				if (open) body.setAttribute('hidden', '');
				else body.removeAttribute('hidden');
			});
		}

		// ---- Scroll-spy ----
		var links = toc.querySelectorAll('.ss-toc__link');
		if (!links.length) return;

		// Собираем пары link ↔ section (только те, где секция реально есть).
		var pairs = [];
		links.forEach(function (link) {
			var href = link.getAttribute('href') || '';
			if (href.charAt(0) !== '#') return;
			var id = href.slice(1);
			var section = id && document.getElementById(id);
			if (section) pairs.push({ link: link, section: section });
		});
		if (!pairs.length) return;

		function getHeaderOffset() {
			// --header-height ставится JS-инициализацией шапки. Fallback 100.
			var v = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
			var n = parseInt(v, 10);
			return isNaN(n) ? 60 : n;
		}

		// Линия активации: 25% высоты вьюпорта ниже шапки. Пункт становится
		// активным, как только его h2 попадает в верхнюю четверть видимой зоны
		// (а не когда почти уезжает под шапку). Так активность идёт «в ногу»
		// с тем, что читатель видит на экране.
		function getActivationLine() {
			return getHeaderOffset() + Math.round(window.innerHeight * 0.25);
		}

		function setActive(activeLink) {
			pairs.forEach(function (p) {
				if (p.link === activeLink) p.link.setAttribute('aria-current', 'location');
				else p.link.removeAttribute('aria-current');
			});
		}

		function update() {
			var line = getActivationLine();
			var current = null;

			// Секции идут по DOM-порядку — как только top секции ниже
			// activation-line, все последующие ещё ниже. Останавливаемся.
			for (var i = 0; i < pairs.length; i++) {
				var top = pairs[i].section.getBoundingClientRect().top;
				if (top <= line) {
					current = pairs[i].link;
				} else {
					break;
				}
			}

			// Если ничего не прошло линию (скроллим над первой секцией) —
			// подсвечиваем первую по умолчанию.
			if (!current) current = pairs[0].link;
			setActive(current);
		}

		var scheduled = false;
		function onScroll() {
			if (scheduled) return;
			scheduled = true;
			requestAnimationFrame(function () {
				scheduled = false;
				update();
			});
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		update();
	});
})();
