// ==============================================================
// Hide-block — скрытая группа дополнительных полей в форме калькулятора.
// Боевая разметка steamsys.ru:
//   .hide-block-wrapper
//     .calculator-fieldset.is-hide-block   ← display:none по умолчанию
//     button.open-hide-btn
//       i.plus-minus
//       span.hide-btn-txt "Показать дополнительные опции"
//
// Клик по .open-hide-btn → toggle .is-open на .hide-block-wrapper.
// SCSS (в scoped-блоке страницы) переключает display:block у is-hide-block
// и прячет вертикальную полоску у .plus-minus (значок + → −).
//
// Подпись меняется между «Показать…» ↔ «Скрыть…». Если на кнопке есть
// data-text-show / data-text-hide — берём оттуда, иначе fallback-строки.
//
// Делегирование на document — скрытых блоков на странице может быть N.
// ==============================================================
(function () {
	'use strict';

	var DEFAULTS = {
		show: 'Показать дополнительные опции',
		hide: 'Скрыть дополнительные опции'
	};

	document.addEventListener('click', function (e) {
		var btn = e.target.closest('.open-hide-btn');
		if (!btn) return;
		var wrap = btn.closest('.hide-block-wrapper');
		if (!wrap) return;

		e.preventDefault();
		wrap.classList.toggle('is-open');
		var isOpen = wrap.classList.contains('is-open');

		btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

		var txt = btn.querySelector('.hide-btn-txt');
		if (txt) {
			var showText = btn.getAttribute('data-text-show') || DEFAULTS.show;
			var hideText = btn.getAttribute('data-text-hide') || DEFAULTS.hide;
			txt.textContent = isOpen ? hideText : showText;
		}
	});
}());
