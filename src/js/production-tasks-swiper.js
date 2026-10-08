// ==============================
// Swiper для секции «Выберите по производственной задаче».
// Триггер — .js-production-tasks-slider. Конфигурация 1:1 с
// experience-swiper: 3 слайда на desktop (≥1024) / 1 на mobile,
// пагинация-полоски (shared .swiper-bars), стрелок нет.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-production-tasks-slider');
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
					// Кнопки живут в соседнем .ss-slider-nav над слайдером
					// (не внутри .swiper), поэтому ищем через parent.
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
