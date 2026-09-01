// ==============================
// Инициализация Swiper для слайдера отзывов клиентов.
// Триггер — класс .js-reviews-slider на .swiper.
// 1 слайд на видимую область, пагинация-полоски внизу (из .swiper-bars).
// ==============================
(function () {
	'use strict';

	if (typeof Swiper === 'undefined') return;

	var els = document.querySelectorAll('.js-reviews-slider');
	if (!els.length) return;

	els.forEach(function (el) {
		new Swiper(el, {
			slidesPerView: 1,
			spaceBetween: 30,
			speed: 500,
			pagination: {
				el: el.querySelector('.swiper-pagination'),
				clickable: true
			}
		});
	});
})();
