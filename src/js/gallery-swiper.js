// ==============================================================
// Инициализация Swiper для .ss-gallery.
// Триггер — .js-gallery на корневой обёртке. Внутри: .swiper со slide'ами,
// стрелки .ss-swiper-btn--prev/--next (см. blocks/_swiper-btn.scss),
// .swiper-pagination-gallery (счётчик).
//
// Счётчик работает через штатную Swiper-пагинацию type='fraction' —
// сам обновляется. Элемент пагинации ищем по .swiper-pagination-gallery
// внутри именно этой обёртки (несколько галерей на странице не путаются).
// ==============================================================
(function () {
	'use strict';

	var galleries = document.querySelectorAll('.js-gallery');
	if (!galleries.length) return;

	whenSwiperReady(function () {
		galleries.forEach(function (gallery) {
			var swiperEl = gallery.querySelector('.swiper');
			if (!swiperEl) return;

			var prevEl = gallery.querySelector('.ss-swiper-btn--prev');
			var nextEl = gallery.querySelector('.ss-swiper-btn--next');
			var paginationEl = gallery.querySelector('.swiper-pagination-gallery');

			new Swiper(swiperEl, {
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 500,
				navigation: {
					prevEl: prevEl,
					nextEl: nextEl
				},
				pagination: {
					el: paginationEl,
					type: 'fraction'
				}
			});
		});
	});
})();
