// ==============================
// .ss-filters-drawer — открытие/закрытие мобильной шторки фильтров.
//
// Триггер (.js-filters-trigger) виден только на <$xl (1200). Клик по нему
// открывает drawer + блокирует скролл body. Закрытие: клик по overlay,
// крестик (.js-filters-close), Escape или ресайз через порог 1200 вверх.
//
// Классы состояний:
//   .ss-filters-drawer.is-open — панель выехала, overlay виден.
//   body.lock — блокировка скролла (общий класс, тот же, что у мобильного меню).
// ==============================
(function () {
	'use strict';

	var drawer = document.querySelector('.ss-filters-drawer');
	var trigger = document.querySelector('.js-filters-trigger');
	if (!drawer || !trigger) return;

	var overlay = drawer.querySelector('.ss-filters-drawer__overlay');
	var closeBtn = drawer.querySelector('.js-filters-close');

	function open() {
		drawer.classList.add('is-open');
		trigger.setAttribute('aria-expanded', 'true');
		document.body.classList.add('lock');
	}

	function close() {
		drawer.classList.remove('is-open');
		trigger.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('lock');
	}

	trigger.addEventListener('click', function () {
		if (drawer.classList.contains('is-open')) close();
		else open();
	});

	if (overlay) overlay.addEventListener('click', close);
	if (closeBtn) closeBtn.addEventListener('click', close);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
	});

	// При ресайзе через порог $xl (1200) вверх — закрываем, чтобы на десктопе
	// не осталось .lock у body и state «is-open» на drawer.
	var mq = window.matchMedia('(min-width: 1200px)');
	var onBreakpointChange = function (e) {
		if (e.matches && drawer.classList.contains('is-open')) close();
	};
	if (mq.addEventListener) mq.addEventListener('change', onBreakpointChange);
	else if (mq.addListener) mq.addListener(onBreakpointChange);
})();
