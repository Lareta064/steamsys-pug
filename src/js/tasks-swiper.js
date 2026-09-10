// ==============================
// Инициализация Swiper для секции «Какие задачи решаем».
// Триггер — класс .js-tasks-slider.
//
// Логика: Swiper активен только ниже 1200px. На ≥1200 слайдер
// не инициализируется, а его разметка через CSS превращается в
// статичную сетку (4-в-один на ≥1700, 2×2 на 1440-1699,
// 1-колонка × 4 на 1200-1439; см. src/scss/sections/_section-tasks.scss).
// Переключение — по matchMedia change (нативный breakpoint listener,
// без ручной подписки на resize).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-tasks-slider');
	if (!els.length) return;

	var mql = window.matchMedia('(max-width: 1199px)');

	els.forEach(function (el) {
		var instance = null;

		function sync() {
			if (mql.matches && !instance) {
				// Swiper может ещё не загрузиться (lazy-loader ждёт скролла) —
				// откладываем создание инстанса до его готовности.
				whenSwiperReady(function () {
					// Guard: matchMedia могла успеть переключиться, пока грузили.
					if (!mql.matches || instance) return;
					instance = new Swiper(el, {
						slidesPerView: 'auto',
						spaceBetween: 10,
						speed: 800,
						pagination: {
							el: el.querySelector('.swiper-pagination'),
							clickable: true
						}
					});
				});
			} else if (!mql.matches && instance) {
				instance.destroy(true, true);
				instance = null;
			}
		}

		sync();

		// Совместимость: современные браузеры — addEventListener,
		// Safari <14 / старые — addListener.
		if (mql.addEventListener) mql.addEventListener('change', sync);
		else mql.addListener(sync);
	});
})();
