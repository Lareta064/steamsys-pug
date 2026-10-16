// ==============================================================
// .ss-calc-menu — многоуровневое меню калькуляторов в sticky-сайдбаре
// хаба инструментов (calculators.html).
//
// Клик по .ss-calc-menu__head (level-1 или level-2) переключает .is-open
// на родительском .ss-calc-menu__group. Делегирование клика на обёртку
// .ss-calc-menu — работает с любым уровнем вложенности, без per-item
// bindings.
//
// Single-open на каждом уровне: при открытии группы — закрываем всех
// её прямых siblings-группы, которые были раскрыты. Клик на уже
// открытой группе — просто закрывает её, соседей не трогаем.
// Scope ":scope > …" гарантирует, что затронутся только прямые соседи
// (level-1 закрывает level-1 того же parent'а, level-2 закрывает level-2
// внутри своего level-1, глубже не распространяется).
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

			// Если группа закрыта и мы её открываем — закрываем всех
			// открытых siblings-групп того же уровня (прямых детей parent'а).
			if (!group.classList.contains('is-open')) {
				var parent = group.parentElement;
				if (parent) {
					var openSiblings = parent.querySelectorAll(':scope > .ss-calc-menu__group.is-open');
					openSiblings.forEach(function (sib) {
						if (sib !== group) sib.classList.remove('is-open');
					});
				}
			}

			group.classList.toggle('is-open');
		});
	});
})();
