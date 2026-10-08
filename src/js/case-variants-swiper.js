// ==============================
// Swiper для секции «Выберите подходящий вариант» на странице кейса.
// Конфигурация 1:1 с production-tasks-swiper: 3 слайда на ≥1280,
// 2 на ≥768, 1 на <768. Стрелки живут в соседнем .ss-slider-nav
// внутри .ss-section-header, пагинация-полоски снизу.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-case-variants-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 800,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Кнопки живут в .ss-slider-nav внутри .ss-section-header
					// (не внутри .swiper), ищем через parentElement (.ss-container).
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1280: { slidesPerView: 3, spaceBetween: 30 }
				}
			});
		});
	});
})();
