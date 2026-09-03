// ==============================
// .ss-header — логика меню в шапке.
//
// Фаза 2 (desktop menubar):
//   - hover на .ss-menu__item открывает подменю (mega / simple)
//   - позиционирование подменю через inline-стили (mega — по container-inner)
//   - закрытие: mouseleave с задержкой 200ms (курсор успеет спуститься в подменю);
//     Escape / клик вне шапки / scroll — закрывают.
//
// Фаза 3 (мобильное меню):
//   - клик на .menu-toggle (бургер) открывает .ss-mobile-menu (sheet слева, ПОД шапкой).
//   - клик на overlay / Escape / повторный клик по бургеру — закрывают.
//   - body получает .lock (блокирует скролл).
//   - аккордеон 2-го уровня — CSS-only (checkbox pattern), JS сбрасывает при закрытии.
//   - --header-height CSS-переменная — для позиционирования меню под шапкой.
//   - matchMedia на 1200 — если ресайз через границу вверх при открытом меню, закрываем.
//
// Фаза 4 (sticky):
//   - шапка всегда fixed. При scrollY > 0 добавляется .ss-header--sticky.
//     Плавный CSS transition — шапка сжимается по высоте, лого уменьшается.
//   - --header-height обновляется после перехода — чтобы мобильное меню
//     позиционировалось корректно и в sticky-состоянии.
//
// Фаза 5 (overflow «…»):
//   - при переполнении menubar пункты, не поместившиеся, скрываются и добавляются
//     в дропдаун-триггер «…» (в конце списка).
//   - пересчёт: на resize (debounced) + на смену sticky-класса (мало ли).
// ==============================
(function () {
	'use strict';

	// ============================================================
	// Desktop menubar submenu hover behavior
	// ============================================================
	var header = document.querySelector('.ss-header');
	if (header) {
		var container = header.querySelector('.ss-container');
		var menuItems = header.querySelectorAll('.ss-menu__item');

		var activeItem = null;
		var closeTimer = null;
		var CLOSE_DELAY = 200;

		var positionSubmenu = function (item, submenu) {
			var headerRect = header.getBoundingClientRect();
			var containerRect = container.getBoundingClientRect();
			var itemRect = item.getBoundingClientRect();

			var topOffset = (headerRect.bottom - itemRect.top) + 6;
			submenu.style.top = topOffset + 'px';

			if (submenu.classList.contains('ss-menu__submenu--mega')) {
				var containerStyle = getComputedStyle(container);
				var padLeft = parseFloat(containerStyle.paddingLeft) || 0;
				var padRight = parseFloat(containerStyle.paddingRight) || 0;
				var innerLeft = containerRect.left + padLeft;
				var innerWidth = containerRect.width - padLeft - padRight;

				submenu.style.left = (innerLeft - itemRect.left) + 'px';
				submenu.style.width = innerWidth + 'px';
			} else {
				submenu.style.left = '0';
				submenu.style.width = '';
			}
		};

		var closeItem = function (item) {
			if (!item) return;
			var submenu = item.querySelector('.ss-menu__submenu');
			var link = item.querySelector('.ss-menu__link');
			if (submenu) submenu.classList.remove('is-open');
			if (link && link.hasAttribute('aria-expanded')) link.setAttribute('aria-expanded', 'false');
			item.classList.remove('is-open');
			if (activeItem === item) activeItem = null;
		};

		var openItem = function (item) {
			clearTimeout(closeTimer);
			if (activeItem && activeItem !== item) closeItem(activeItem);
			var submenu = item.querySelector('.ss-menu__submenu');
			var link = item.querySelector('.ss-menu__link');
			if (!submenu) return;
			positionSubmenu(item, submenu);
			submenu.classList.add('is-open');
			if (link && link.hasAttribute('aria-expanded')) link.setAttribute('aria-expanded', 'true');
			item.classList.add('is-open');
			activeItem = item;
		};

		var scheduleClose = function (item) {
			clearTimeout(closeTimer);
			closeTimer = setTimeout(function () { closeItem(item); }, CLOSE_DELAY);
		};

		var cancelClose = function () { clearTimeout(closeTimer); };

		menuItems.forEach(function (item) {
			var submenu = item.querySelector('.ss-menu__submenu');
			if (!submenu) return;

			item.addEventListener('mouseenter', function () { openItem(item); });
			item.addEventListener('mouseleave', function () { scheduleClose(item); });

			submenu.addEventListener('mouseenter', cancelClose);
			submenu.addEventListener('mouseleave', function () { scheduleClose(item); });
		});

		window.addEventListener('scroll', function () {
			if (activeItem) closeItem(activeItem);
		}, { passive: true });

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && activeItem) closeItem(activeItem);
		});

		document.addEventListener('click', function (e) {
			if (activeItem && !header.contains(e.target)) closeItem(activeItem);
		});

		// ============================================================
		// Фаза 5 — overflow «…»
		// ============================================================
		var mainList = header.querySelector('.ss-menu__list');
		var moreItem = mainList && mainList.querySelector('.ss-menu__item--more');
		var moreSubmenuInner = moreItem && moreItem.querySelector('.ss-menu__submenu-inner');

		if (mainList && moreItem && moreSubmenuInner) {
			var GAP = 20;
			// Кэшируем все ПОСТОЯННЫЕ пункты (не триггер «…»).
			var allItems = Array.prototype.slice.call(
				mainList.querySelectorAll('.ss-menu__item:not(.ss-menu__item--more)')
			);

			var updateOverflow = function () {
				// На <$xl (1200) menubar скрыт — работа не нужна.
				if (window.innerWidth < 1200) return;

				// Сброс: показать все пункты, очистить копии в дропдауне триггера, спрятать триггер.
				allItems.forEach(function (it) { it.style.display = ''; });
				moreSubmenuInner.innerHTML = '';
				moreItem.hidden = true;

				// Есть ли переполнение при всех видимых?
				var nav = header.querySelector('.ss-header__nav');
				var navWidth = nav.clientWidth;

				var totalAll = 0;
				allItems.forEach(function (it, i) {
					totalAll += it.getBoundingClientRect().width + (i > 0 ? GAP : 0);
				});

				if (totalAll <= navWidth) return; // всё влезает

				// Есть переполнение — показываем триггер, замеряем его ширину.
				moreItem.hidden = false;
				var triggerWidth = moreItem.getBoundingClientRect().width;
				var effectiveWidth = navWidth - triggerWidth - GAP;

				// Определяем, с какого индекса не помещаются пункты.
				var accumulated = 0;
				var overflowStart = allItems.length;
				for (var i = 0; i < allItems.length; i++) {
					var w = allItems[i].getBoundingClientRect().width;
					var add = w + (i > 0 ? GAP : 0);
					if (accumulated + add > effectiveWidth) {
						overflowStart = i;
						break;
					}
					accumulated += add;
				}

				// Прячем переполненные пункты и создаём simple-копии в submenu триггера.
				for (var j = overflowStart; j < allItems.length; j++) {
					var item = allItems[j];
					item.style.display = 'none';

					var origLink = item.querySelector('.ss-menu__link');
					var span = origLink && origLink.querySelector('span');
					var text = span ? span.textContent : (origLink ? origLink.textContent : '');
					var href = origLink ? origLink.getAttribute('href') : '#';

					var copy = document.createElement('a');
					copy.className = 'ss-menu__submenu-link';
					copy.setAttribute('href', href);
					copy.textContent = text;
					moreSubmenuInner.appendChild(copy);
				}
			};

			// Debounced resize
			var resizeTimer;
			window.addEventListener('resize', function () {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(updateOverflow, 100);
			});

			// Сразу (минимизировать flash), плюс ещё раз на load — когда
			// шрифты и SVG-лого подтянутся, размеры пунктов могут уточниться.
			updateOverflow();
			if (document.readyState !== 'complete') {
				window.addEventListener('load', updateOverflow);
			}
		}
	}

	// ============================================================
	// --header-height CSS-переменная — используется мобильным меню
	// для позиционирования под шапкой (top). Пересчитывается на resize
	// и после переключения sticky-класса.
	// ============================================================
	var updateHeaderHeight = function () {
		if (!header) return;
		var h = header.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--header-height', h + 'px');
	};
	updateHeaderHeight();
	window.addEventListener('resize', updateHeaderHeight);

	// ============================================================
	// Фаза 4 — Sticky-шапка. Шапка всегда position: fixed. При scrollY > 0
	// добавляется класс .ss-header--sticky, который сжимает шапку по высоте
	// и уменьшает лого (плавный transition из CSS).
	// ============================================================
	if (header) {
		var isSticky = false;

		var updateSticky = function () {
			var scrollY = window.pageYOffset || document.documentElement.scrollTop;
			var shouldBeSticky = scrollY > 0;
			if (shouldBeSticky === isSticky) return;
			isSticky = shouldBeSticky;
			header.classList.toggle('ss-header--sticky', isSticky);
			// Пересчитываем --header-height после окончания CSS-transition (250ms).
			setTimeout(updateHeaderHeight, 270);
		};

		window.addEventListener('scroll', updateSticky, { passive: true });
		updateSticky();
	}

	// ============================================================
	// Мобильное меню (sheet slide-in). Своей копии лого/close-кнопки нет —
	// бургер в шапке трансформируется в X (через .active) и работает как toggle.
	// ============================================================
	var burger = document.querySelector('#menu-toggle');
	var mobileMenu = document.querySelector('.ss-mobile-menu');

	if (burger && mobileMenu) {
		var overlay = mobileMenu.querySelector('.ss-mobile-menu__overlay');

		var openMobile = function () {
			mobileMenu.classList.add('is-open');
			burger.classList.add('active');
			document.body.classList.add('lock');
		};

		var closeMobile = function () {
			mobileMenu.classList.remove('is-open');
			burger.classList.remove('active');
			document.body.classList.remove('lock');
			// Сбрасываем состояние аккордеонов + aria-expanded, чтобы при повторном
			// открытии меню все подменю были закрыты.
			mobileMenu.querySelectorAll('.ss-mobile-menu__toggle:checked').forEach(function (cb) {
				cb.checked = false;
			});
			mobileMenu.querySelectorAll('.ss-mobile-menu__title[aria-expanded]').forEach(function (l) {
				l.setAttribute('aria-expanded', 'false');
			});
		};

		burger.addEventListener('click', function () {
			if (mobileMenu.classList.contains('is-open')) closeMobile();
			else openMobile();
		});

		if (overlay) overlay.addEventListener('click', closeMobile);

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMobile();
		});

		// Клавиатурная поддержка для аккордеона: Enter / Space по label
		// переключают чекбокс и обновляют aria-expanded.
		var accordionLabels = mobileMenu.querySelectorAll('.ss-mobile-menu__title');
		accordionLabels.forEach(function (label) {
			var toggleId = label.getAttribute('for');
			var input = toggleId ? document.getElementById(toggleId) : null;
			if (!input) return;

			var syncAria = function () {
				label.setAttribute('aria-expanded', input.checked ? 'true' : 'false');
			};

			// Клик на label — родная семантика (чекбокс переключается).
			// После этого синхронизируем aria-expanded.
			label.addEventListener('click', function () {
				// setTimeout — чтобы прочитать актуальное состояние ПОСЛЕ toggle.
				setTimeout(syncAria, 0);
			});

			// Клавиатура: Enter / Space toggle чекбокс + sync aria.
			label.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					input.checked = !input.checked;
					syncAria();
				}
			});
		});

		// При пересечении брейкпоинта $xl (1200) вверх — если меню открыто,
		// закрываем (иначе на десктопе останется .lock у body и застревающий state).
		var desktopMQ = window.matchMedia('(min-width: 1200px)');
		var handleBreakpointChange = function (e) {
			if (e.matches && mobileMenu.classList.contains('is-open')) closeMobile();
		};
		if (desktopMQ.addEventListener) {
			desktopMQ.addEventListener('change', handleBreakpointChange);
		} else if (desktopMQ.addListener) {
			// Fallback для Safari <14
			desktopMQ.addListener(handleBreakpointChange);
		}
	}
})();
