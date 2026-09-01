// ==============================
// Инициализация Swiper для слайдера партнёров.
// Триггер — класс .js-partners-slider на корневой обёртке (в неё вложены
// стрелки .ss-partners-slider__nav--prev/next и сам .swiper).
// slidesPerView: 'auto' — количество слайдов определяется по CSS-ширине
// слайда (187px, задано в _partners-slider.scss). Просвет 10.
// На <768 стрелки скрыты стилями, работает пагинация-полоски.
// ==============================
(function () {
	'use strict';

	if (typeof Swiper === 'undefined') return;

	var containers = document.querySelectorAll('.js-partners-slider');
	if (!containers.length) return;

	containers.forEach(function (container) {
		var swiperEl = container.querySelector('.swiper');
		if (!swiperEl) return;

		var prevEl = container.querySelector('.ss-partners-slider__nav--prev');
		var nextEl = container.querySelector('.ss-partners-slider__nav--next');

		new Swiper(swiperEl, {
			slidesPerView: 'auto',
			spaceBetween: 10,
			speed: 500,
			navigation: {
				prevEl: prevEl,
				nextEl: nextEl
			},
			pagination: {
				el: swiperEl.querySelector('.swiper-pagination'),
				clickable: true
			}
		});
	});
})();
