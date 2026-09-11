// ==============================================================
// Страница «База знаний» — мобильная адаптация.
//
// 1. Аккордеон «Разделы» ([data-blog-accordion]) — toggle по клику
//    на .ss-section-blog__accordion-toggle. Синхронизирует aria-expanded
//    на кнопке и [hidden] на body. Работает только на мобилке — на
//    десктопе кнопка скрыта CSS'ом, body всегда видим.
//
// 2. Reflow тегов + CTA. На мобилке (< 1024) блоки с [data-blog-extra]
//    переносятся из aside в [data-blog-mobile-extras] — под пагинацию.
//    Возвращаются в aside при resize обратно на десктоп.
// ==============================================================
(function () {
	'use strict';

	// ---- Accordion toggle ----
	var accordions = document.querySelectorAll('[data-blog-accordion]');
	accordions.forEach(function (acc) {
		var toggle = acc.querySelector('.ss-section-blog__accordion-toggle');
		var body = acc.querySelector('.ss-section-blog__accordion-body');
		if (!toggle || !body) return;

		toggle.addEventListener('click', function () {
			var open = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!open));
			if (open) body.setAttribute('hidden', '');
			else body.removeAttribute('hidden');
		});
	});

	// ---- Reflow tags + cta on mobile ----
	var mobileExtras = document.querySelector('[data-blog-mobile-extras]');
	var extras = document.querySelectorAll('[data-blog-extra]');
	if (!mobileExtras || !extras.length) return;

	// Запоминаем исходного родителя (aside) — вернём туда при resize на десктоп.
	var originalParent = extras[0].parentElement;
	var mql = window.matchMedia('(max-width: 1023px)');

	function reflow() {
		var target = mql.matches ? mobileExtras : originalParent;
		extras.forEach(function (el) {
			target.appendChild(el);
		});
	}

	reflow();

	// matchMedia.addEventListener — современный API; fallback на addListener для старых Safari.
	if (mql.addEventListener) {
		mql.addEventListener('change', reflow);
	} else if (mql.addListener) {
		mql.addListener(reflow);
	}
})();
