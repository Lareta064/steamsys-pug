// ==============================
// Swiper для секции «Все готовые решения» на странице portfolio-page.
// Триггер — .js-all-solutions-slider. Та же схема, что experience-slider:
// 3 слайда на ≥1200, 2 на ≥768, 1 на <768. Стрелок нет — только пагинация
// в виде полосок (shared .swiper-bars).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-all-solutions-slider');
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
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1200: { slidesPerView: 3, spaceBetween: 30 }
				}
			});
		});
	});
})();
