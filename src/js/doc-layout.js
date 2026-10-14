// ==============================================================
// Страница одной статьи (single-article) — мобильная адаптация сайдбара.
//
// Reflow help-card + solutions-list. На < 1024 блоки с [data-article-extra]
// переносятся из .ss-sticky-side в [data-article-mobile-extras] — placeholder
// под контентом статьи. TOC остаётся в сайдбаре (свой mobile-toggle встроен).
// Возвращаются в исходный aside при resize обратно на десктоп.
// Тот же паттерн, что в blog.js для data-blog-extra.
// ==============================================================
(function () {
	'use strict';

	var mobileExtras = document.querySelector('[data-article-mobile-extras]');
	var extras = document.querySelectorAll('[data-article-extra]');
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

	if (mql.addEventListener) {
		mql.addEventListener('change', reflow);
	} else if (mql.addListener) {
		mql.addListener(reflow);
	}
})();
