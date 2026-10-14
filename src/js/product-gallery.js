// ==============================
// Галерея товара: 2 связанных Swiper'а через модуль Thumbs
// (встроен в Swiper 8). Триггер — .js-product-gallery на корневой обёртке.
// Внутри ожидаются 2 .swiper: .ss-product-gallery__main и
// .ss-product-gallery__thumbs.
// Инициализация в порядке thumbs → main, т.к. main получает ссылку
// на thumbs-инстанс.
// ==============================
(function () {
	'use strict';

	var containers = document.querySelectorAll('.js-product-gallery');
	if (!containers.length) return;

	whenSwiperReady(function () {
		containers.forEach(function (container) {
			var mainEl = container.querySelector('.ss-product-gallery__main');
			var thumbsEl = container.querySelector('.ss-product-gallery__thumbs');
			if (!mainEl || !thumbsEl) return;

			var thumbsSwiper = new Swiper(thumbsEl, {
				slidesPerView: 'auto',
				spaceBetween: 10,
				freeMode: true,
				watchSlidesProgress: true
			});

			new Swiper(mainEl, {
				spaceBetween: 10,
				speed: 400,
				thumbs: {
					swiper: thumbsSwiper
				}
			});
		});
	});
})();
