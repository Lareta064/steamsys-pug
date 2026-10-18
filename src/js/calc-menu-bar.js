// ==============================================================
// .ss-calc-menu-bar — горизонтальный селектор калькуляторов.
// Поведение:
//   · клик по .ss-calc-menu-bar__cat-btn → toggle .is-open на родителе
//     .ss-calc-menu-bar__cat; закрываем все другие cat (single-open).
//   · клик по кнопке подкатегории в .ss-calc-menu-bar__subcat →
//     .is-active на этом subcat (снимаем с других в рамках своей cat);
//     синхронно показываем соответствующую группу ссылок
//     .ss-calc-menu-bar__link-group (data-subcat у группы = data-subcat
//     у выбранного subcat) и скрываем остальные.
//   · клик по ссылке → не трогаем (переход по href).
//   · клик вне любого .ss-calc-menu-bar → закрыть все открытые.
//   · ESC → закрыть все открытые.
// Делегирование на document — на странице обычно один bar, но на
// всякий случай поддерживаем N.
// ==============================================================
(function () {
	'use strict';

	var BAR   = '.ss-calc-menu-bar';
	var CAT   = '.ss-calc-menu-bar__cat';
	var CATBTN = '.ss-calc-menu-bar__cat-btn';
	var SUBCAT = '.ss-calc-menu-bar__subcat';
	var LGROUP = '.ss-calc-menu-bar__link-group';

	function closeAllCats(exceptBar) {
		document.querySelectorAll(CAT + '.is-open').forEach(function (cat) {
			if (exceptBar && exceptBar.contains(cat)) return;
			cat.classList.remove('is-open');
			var btn = cat.querySelector(CATBTN);
			if (btn) btn.setAttribute('aria-expanded', 'false');
		});
	}

	function toggleCat(cat) {
		var bar = cat.closest(BAR);
		var isOpen = cat.classList.contains('is-open');
		// Закрыть все другие в этом баре И в других барах — single-open global.
		document.querySelectorAll(CAT + '.is-open').forEach(function (c) {
			if (c === cat) return;
			c.classList.remove('is-open');
			var b = c.querySelector(CATBTN);
			if (b) b.setAttribute('aria-expanded', 'false');
		});
		if (isOpen) {
			cat.classList.remove('is-open');
		} else {
			cat.classList.add('is-open');
		}
		var btn = cat.querySelector(CATBTN);
		if (btn) btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
	}

	function activateSubcat(subcat) {
		var cat = subcat.closest(CAT);
		if (!cat) return;
		var key = subcat.getAttribute('data-subcat');
		if (!key) return;

		// is-active на этом subcat (снять с других в рамках этой cat).
		cat.querySelectorAll(SUBCAT + '.is-active').forEach(function (s) {
			if (s !== subcat) s.classList.remove('is-active');
		});
		subcat.classList.add('is-active');

		// Показать соответствующую link-group, скрыть другие (в рамках этой cat).
		cat.querySelectorAll(LGROUP).forEach(function (g) {
			if (g.getAttribute('data-subcat') === key) {
				g.classList.add('is-visible');
			} else {
				g.classList.remove('is-visible');
			}
		});
	}

	document.addEventListener('click', function (e) {
		var catBtn = e.target.closest(CATBTN);
		if (catBtn) {
			var cat = catBtn.closest(CAT);
			if (cat) {
				e.preventDefault();
				toggleCat(cat);
				return;
			}
		}

		// Клик по кнопке subcat — переключаем активный subcat.
		// (hover ниже делает то же — click оставляем для клавиатуры/touch.)
		var subcatBtn = e.target.closest(SUBCAT + ' > button');
		if (subcatBtn) {
			var subcat = subcatBtn.closest(SUBCAT);
			if (subcat) {
				e.preventDefault();
				activateSubcat(subcat);
				return;
			}
		}

		// Клик вне любого bar — закрыть все открытые.
		if (!e.target.closest(BAR)) closeAllCats(null);
	});

	// Hover по subcat — делаем его активным (как на steamsys mega-menu).
	// mouseover + closest вместо mouseenter — работает с делегированием.
	// Защита от повторной активации (if subcat уже .is-active — skip),
	// чтобы не ломать click-handler правой колонки лишними re-renders.
	document.addEventListener('mouseover', function (e) {
		var subcat = e.target.closest(SUBCAT);
		if (!subcat) return;
		if (subcat.classList.contains('is-active')) return;
		if (!subcat.closest(BAR)) return;
		activateSubcat(subcat);
	});

	// Focus — для tab-навигации с клавиатуры: при фокусе на кнопке subcat
	// тоже переключаем активный subcat.
	document.addEventListener('focusin', function (e) {
		var subcatBtn = e.target.closest(SUBCAT + ' > button');
		if (!subcatBtn) return;
		var subcat = subcatBtn.closest(SUBCAT);
		if (!subcat || subcat.classList.contains('is-active')) return;
		activateSubcat(subcat);
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeAllCats(null);
	});
}());
