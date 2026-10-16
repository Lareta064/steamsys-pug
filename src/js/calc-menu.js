// ==============================================================
// .ss-calc-menu — многоуровневое меню калькуляторов в sticky-сайдбаре
// хаба инструментов (calculators.html).
//
// Клик по .ss-calc-menu__head (level-1 или level-2) переключает .is-open
// на родительском .ss-calc-menu__group. Делегирование клика на обёртку
// .ss-calc-menu — работает с любым уровнем вложенности, без per-item
// bindings. Множественный open: любые группы могут быть одновременно
// раскрыты (не single-open).
//
// На < $lg блок скрыт целиком через CSS — JS всё равно работает,
// но клики по невидимым кнопкам не придут.
// ==============================================================
(function () {
	'use strict';

	var menus = document.querySelectorAll('.ss-calc-menu');
	if (!menus.length) return;

	menus.forEach(function (menu) {
		menu.addEventListener('click', function (e) {
			var head = e.target.closest('.ss-calc-menu__head');
			if (!head || !menu.contains(head)) return;
			var group = head.closest('.ss-calc-menu__group');
			if (!group) return;
			group.classList.toggle('is-open');
		});
	});
})();
