// ==============================
// Якорное меню страницы товара (.ss-product-nav).
// Задачи:
//   1. Smooth-scroll по клику на таб — с учётом высоты фикс-шапки
//      (--header-height) и самого sticky-меню.
//   2. ScrollSpy — расставляем .is-active на таб, в чью секцию
//      попал верх вьюпорта (с offset'ом = header + nav).
// ==============================
(function () {
	'use strict';

	var nav = document.querySelector('.ss-product-nav');
	if (!nav) return;

	var links = Array.prototype.slice.call(nav.querySelectorAll('.ss-product-nav__link'));
	if (!links.length) return;

	var items = links
		.map(function (link) {
			var href = link.getAttribute('href') || '';
			if (href.charAt(0) !== '#') return null;
			var section = document.querySelector(href);
			return section ? { link: link, section: section } : null;
		})
		.filter(Boolean);
	if (!items.length) return;

	function getHeaderHeight() {
		var h = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
		var n = parseFloat(h);
		return isNaN(n) ? 100 : n;
	}

	// Smooth-scroll по клику
	links.forEach(function (link) {
		link.addEventListener('click', function (e) {
			var href = link.getAttribute('href') || '';
			if (href.charAt(0) !== '#') return;
			var section = document.querySelector(href);
			if (!section) return;

			e.preventDefault();
			var offset = getHeaderHeight() + nav.offsetHeight;
			var top = section.getBoundingClientRect().top + window.pageYOffset - offset;
			window.scrollTo({ top: top, behavior: 'smooth' });
		});
	});

	// ScrollSpy. rootMargin сверху = -(header+nav), снизу = -70% —
	// активной считается секция, верх которой пересёк линию «под меню».
	function setActive(id) {
		items.forEach(function (it) {
			it.link.classList.toggle('is-active', ('#' + it.section.id) === id);
		});
	}

	var topOffset = getHeaderHeight() + nav.offsetHeight;

	var observer = new IntersectionObserver(function (entries) {
		var visible = entries
			.filter(function (en) { return en.isIntersecting; })
			.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
		if (visible[0]) setActive('#' + visible[0].target.id);
	}, {
		rootMargin: '-' + topOffset + 'px 0px -70% 0px',
		threshold: 0
	});

	items.forEach(function (it) { observer.observe(it.section); });
})();
