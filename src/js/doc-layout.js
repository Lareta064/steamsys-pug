// ==============================================================
// .ss-doc-layout — мобильная адаптация sticky-sidebar.
//
// Используется single-article, single-case, single-system и любыми
// другими документными страницами с двухколоночной раскладкой.
//
// Reflow: на < 1024px блоки с [data-doc-extra] переносятся
// из .ss-sticky-side в [data-doc-mobile-extras] — placeholder под
// основным контентом. TOC остаётся в сайдбаре (у него свой toggle).
// На resize обратно на desktop возвращаются в исходный aside.
// ==============================================================
(function () {
	'use strict';

	var mobileExtras = document.querySelector('[data-doc-mobile-extras]');
	var extras = document.querySelectorAll('[data-doc-extra]');
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
