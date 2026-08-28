// ==============================
// Инициализация Swiper для секции «Опыт в ключевых отраслях».
// Триггер — класс .js-experience-slider. Стрелок нет, только пагинация-полоски.
// 3 слайда на desktop (≥1024) / 1 на mobile. Просвет 30 / 10.
// ==============================
(function () {
	'use strict';

	if (typeof Swiper === 'undefined') return;

	var els = document.querySelectorAll('.js-experience-slider');
	if (!els.length) return;

	els.forEach(function (el) {
		new Swiper(el, {
			slidesPerView: 1,
			spaceBetween: 10,
			pagination: {
				el: el.querySelector('.swiper-pagination'),
				clickable: true
			},
			breakpoints: {
				1024: { slidesPerView: 3, spaceBetween: 30 }
			}
		});
	});
})();
