// ==============================
// Инициализация Swiper для слайдера отзывов клиентов.
// Триггер — класс .js-reviews-slider на .swiper.
// 1 слайд на видимую область, пагинация-полоски внизу (из .swiper-bars).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-reviews-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 30,
				speed: 500,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Стрелки живут на уровне .ss-cases__reviews (parentElement),
					// не внутри .swiper — overflow: hidden у swiper обрезал бы -20px.
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				}
			});
		});
	});
})();
