// ==============================================================
// .ss-calc-menu-bar — горизонтальный селектор калькуляторов.
// Поведение (аналогично hover-меню шапки сайта):
//   · mouseenter на .ss-calc-menu-bar__cat → открыть (закрыть другие
//     cat — single-open global).
//   · mouseleave с cat ИЛИ с dropdown → отложенное закрытие
//     (CLOSE_DELAY = 200ms). Переход курсора cat ↔ dropdown без мерцания:
//     mouseenter на dropdown отменяет pending close.
//   · hover по кнопке subcat → .is-active на subcat, показать его
//     .ss-calc-menu-bar__link-group. Для standalone --link (без
//     data-subcat) — сброс активного.
//   · click по кнопке subcat / focus на subcat → то же (для touch
//     и клавиатуры).
//   · click по cat-btn → fallback-toggle (для touch-устройств,
//     где hover не работает).
//   · click вне bar → закрыть все открытые.
//   · ESC → закрыть все открытые.
// Делегирование на document — на странице обычно один bar.
// ==============================================================
(function () {
	'use strict';

	var BAR    = '.ss-calc-menu-bar';
	var CAT    = '.ss-calc-menu-bar__cat';
	var CATBTN = '.ss-calc-menu-bar__cat-btn';
	var DROPDN = '.ss-calc-menu-bar__dropdown';
	var SUBCAT = '.ss-calc-menu-bar__subcat';
	var LGROUP = '.ss-calc-menu-bar__link-group';
	var CLOSE_DELAY = 200;

	var activeCat = null;
	var closeTimer = null;

	function closeCat(cat) {
		if (!cat) return;
		cat.classList.remove('is-open');
		var btn = cat.querySelector(CATBTN);
		if (btn) btn.setAttribute('aria-expanded', 'false');
		if (activeCat === cat) activeCat = null;
	}

	function closeAllCats(exceptCat) {
		document.querySelectorAll(CAT + '.is-open').forEach(function (c) {
			if (c === exceptCat) return;
			closeCat(c);
		});
	}

	function openCat(cat) {
		clearTimeout(closeTimer);
		if (activeCat && activeCat !== cat) closeCat(activeCat);
		closeAllCats(cat);
		cat.classList.add('is-open');
		var btn = cat.querySelector(CATBTN);
		if (btn) btn.setAttribute('aria-expanded', 'true');
		activeCat = cat;
	}

	function scheduleClose(cat) {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(function () { closeCat(cat); }, CLOSE_DELAY);
	}

	function cancelClose() {
		clearTimeout(closeTimer);
	}

	function activateSubcat(subcat) {
		var cat = subcat.closest(CAT);
		if (!cat) return;
		var key = subcat.getAttribute('data-subcat');
		if (!key) return;

		cat.querySelectorAll(SUBCAT + '.is-active').forEach(function (s) {
			if (s !== subcat) s.classList.remove('is-active');
		});
		subcat.classList.add('is-active');

		cat.querySelectorAll(LGROUP).forEach(function (g) {
			if (g.getAttribute('data-subcat') === key) {
				g.classList.add('is-visible');
			} else {
				g.classList.remove('is-visible');
			}
		});
	}

	// Сброс правой колонки — для hover на standalone --link subcat.
	function clearActiveSubcat(cat) {
		cat.querySelectorAll(SUBCAT + '.is-active').forEach(function (s) {
			s.classList.remove('is-active');
		});
		cat.querySelectorAll(LGROUP + '.is-visible').forEach(function (g) {
			g.classList.remove('is-visible');
		});
	}


	// ------- Биндинг hover к каждой cat и её dropdown -------
	// Нужен прямой bind (не делегирование) — mouseenter/mouseleave
	// не всплывают, а их аналоги mouseover/mouseout триггерятся на
	// каждом вложенном элементе, что ломает scheduleClose.
	document.querySelectorAll(CAT).forEach(function (cat) {
		var dropdown = cat.querySelector(DROPDN);

		cat.addEventListener('mouseenter', function () { openCat(cat); });
		cat.addEventListener('mouseleave', function () { scheduleClose(cat); });

		if (dropdown) {
			dropdown.addEventListener('mouseenter', cancelClose);
			dropdown.addEventListener('mouseleave', function () { scheduleClose(cat); });
		}
	});


	// ------- Click (touch / fallback) -------
	document.addEventListener('click', function (e) {
		// Click по кнопке категории — toggle для touch (где нет hover).
		var catBtn = e.target.closest(CATBTN);
		if (catBtn) {
			var cat = catBtn.closest(CAT);
			if (cat) {
				e.preventDefault();
				if (cat.classList.contains('is-open')) closeCat(cat);
				else openCat(cat);
				return;
			}
		}

		// Click по кнопке subcat — активация (для клавиатуры/touch).
		var subcatBtn = e.target.closest(SUBCAT + ' > button');
		if (subcatBtn) {
			var subcat = subcatBtn.closest(SUBCAT);
			if (subcat) {
				e.preventDefault();
				activateSubcat(subcat);
				return;
			}
		}

		// Click вне bar — закрыть всё.
		if (!e.target.closest(BAR)) closeAllCats(null);
	});


	// ------- Hover по subcat (делегирование) -------
	document.addEventListener('mouseover', function (e) {
		var subcat = e.target.closest(SUBCAT);
		if (!subcat) return;
		if (!subcat.closest(BAR)) return;

		var isLink = !subcat.getAttribute('data-subcat');
		if (isLink) {
			var cat = subcat.closest(CAT);
			if (cat) clearActiveSubcat(cat);
			return;
		}

		if (subcat.classList.contains('is-active')) return;
		activateSubcat(subcat);
	});


	// ------- Focus (tab-навигация с клавиатуры) -------
	document.addEventListener('focusin', function (e) {
		var subcatBtn = e.target.closest(SUBCAT + ' > button');
		if (!subcatBtn) return;
		var subcat = subcatBtn.closest(SUBCAT);
		if (!subcat || subcat.classList.contains('is-active')) return;
		activateSubcat(subcat);
	});


	// ------- ESC -------
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			cancelClose();
			closeAllCats(null);
		}
	});
}());
