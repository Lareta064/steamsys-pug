// ==============================
// Swiper слайдера логотипов клиентов на about-page.
// Триггер — .js-about-clients-slider. Конфиг идентичен слайдеру
// партнёров на cases-page (адаптивные breakpoints, autoplay, loop).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-about-clients-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 1200,
				loop: true,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true
				},
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					425:  { slidesPerView: 2, spaceBetween: 10 },
					768:  { slidesPerView: 3, spaceBetween: 20 },
					1024: { slidesPerView: 4, spaceBetween: 20 },
					1280: { slidesPerView: 5, spaceBetween: 20 },
					1440: { slidesPerView: 6, spaceBetween: 20 }
				}
			});
		});
	});
})();
