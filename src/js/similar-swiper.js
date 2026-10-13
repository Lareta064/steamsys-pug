// ==============================
// Слайдер «Похожие товары» на странице карточки товара.
// Триггер — .js-similar-slider. Стрелки живут в соседнем
// .ss-slider-nav над слайдером, ищутся через parentElement.
//
// Брейкпойнты (min-width, Swiper mobile-first):
//   default (<768)  — auto, gap 10
//   768+            — auto, gap 20
//   1440+           — 4 слайда, gap 20
//   1600+           — 4 слайда, gap 30
// Ширина слайда при slidesPerView:'auto' задаётся в CSS (_product-similar.scss).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-similar-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 'auto',
				spaceBetween: 10,
				speed: 500,
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				breakpoints: {
					768: {
						slidesPerView: 'auto',
						spaceBetween: 20
					},
					1440: {
						slidesPerView: 4,
						spaceBetween: 20
					},
					1600: {
						slidesPerView: 4,
						spaceBetween: 30
					}
				}
			});
		});
	});
})();
