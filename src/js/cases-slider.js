// ==============================
// Swiper слайдера партнёров на cases-page.
// Триггер — .js-cases-partners-slider. slidesPerView:'auto', ширина карточки — из CSS.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-cases-partners-slider');
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

// ==============================
// Swiper слайдера «Реализованные проекты» на cases-page.
// Триггер — .js-cases-slider. Стрелки в .ss-slider-nav над слайдером.
// 2 слайда на ≥1024, 1 на <1024. gap 30px на desktop, 20px на tablet, 16px на mobile.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-cases-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 16,
				speed: 600,
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				breakpoints: {
					600:  { slidesPerView: 2, spaceBetween: 10 },
					1024: { slidesPerView: 2, spaceBetween: 30 }
				}
			});
		});
	});
})();

// ==============================
// Swiper компактного «встраиваемого» слайдера кейсов.
// Используется в single-case (внутри main-колонки документа) и в любом
// другом месте, где слайдер должен уживаться с ограниченной шириной
// контейнера. Триггер — .js-cases-slider-inline.
// 2 слайда на ≥600, фиксированный просвет 15px на всех ширинах.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-cases-slider-inline');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 15,
				speed: 600,
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				breakpoints: {
					600:  { slidesPerView: 2, spaceBetween: 15 },
					1024: { slidesPerView: 2, spaceBetween: 15 }
				}
			});
		});
	});
})();
