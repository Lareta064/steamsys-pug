// ==============================
// Инициализация Swiper для слайдера брендов на brands.html.
// Триггер — класс .js-brands-slider.
// Стрелки живут в соседнем .ss-slider-nav над слайдером (как и у
// .js-experience-slider), поэтому ищем prevEl/nextEl через parentElement.
// 4 слайда на ≥1440 / 3 на ≥1200 / 2 на ≥768 / 1 на <768. Просвет 30/20/10.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-brands-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 600,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1200: { slidesPerView: 3, spaceBetween: 20 },
					1440: { slidesPerView: 4, spaceBetween: 30 }
				}
			});
		});
	});
})();
