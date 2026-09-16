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
//   - --header-height обновляется автоматически через ResizeObserver
//     (см. ниже — реагирует и на CSS-transition высоты, и на resize окна,
//     без forced reflow).
//
// Фаза 5 (overflow «…»):
//   - при переполнении menubar пункты, не поместившиеся, скрываются и добавляются
//     в дропдаун-триггер «…» (в конце списка).
//   - пересчёт разбит на фазы WRITE → rAF → READ → WRITE для избежания
//     принудительной компоновки (forced reflow); throttle через
//     cancelAnimationFrame — resize-storm не даёт накопиться пересчётам.
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
			// Если item ВНУТРИ другого submenu (например перенесён в дропдаун «…»),
			// не позиционируем инлайн-стилями — CSS-правила right-flyout работают.
			// Сбрасываем возможные ранее выставленные inline-стили.
			var parentSubmenu = item.parentElement.closest('.ss-menu__submenu');
			if (parentSubmenu) {
				submenu.style.top = '';
				submenu.style.left = '';
				submenu.style.width = '';
				return;
			}

			var headerRect = header.getBoundingClientRect();
			var containerRect = container.getBoundingClientRect();
			var itemRect = item.getBoundingClientRect();

			// Подтягиваем submenu ближе к пункту меню (было +6, стало -16 →
			// подъём на 22px). Раньше подменю «отваливалось» от родительского
			// пункта, визуально казалось не связанным.
			var topOffset = (headerRect.bottom - itemRect.top) - 16;
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

			// Каскадно закрываем вложенные открытые items (например, nested внутри «…»).
			var nestedOpen = item.querySelectorAll('.ss-menu__item.is-open');
			nestedOpen.forEach(function (nested) {
				var ns = nested.querySelector('.ss-menu__submenu');
				var nl = nested.querySelector('.ss-menu__link');
				if (ns) ns.classList.remove('is-open');
				if (nl && nl.hasAttribute('aria-expanded')) nl.setAttribute('aria-expanded', 'false');
				nested.classList.remove('is-open');
			});

			if (activeItem === item) activeItem = null;
		};

		var openItem = function (item) {
			clearTimeout(closeTimer);
			// Закрываем предыдущий активный, только если он НЕ предок текущего.
			// Иначе при hover на nested-item внутри «…» родитель закрывался бы.
			if (activeItem && activeItem !== item && !activeItem.contains(item)) {
				closeItem(activeItem);
			}
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

			if (submenu) {
				item.addEventListener('mouseenter', function () { openItem(item); });
				item.addEventListener('mouseleave', function () { scheduleClose(item); });

				submenu.addEventListener('mouseenter', cancelClose);
				submenu.addEventListener('mouseleave', function () { scheduleClose(item); });
				return;
			}

			// Пункт БЕЗ submenu (например «Контакты»). В обычном menubar hover
			// ничего не делает. Но если пункт живёт внутри «…»-дропдауна, hover
			// должен отменить pending scheduleClose предыдущего nested-соседа —
			// иначе через 200мс тот закроется, dropdown «…» сожмётся по высоте,
			// курсор выпадет вниз, «…» получит mouseleave и каскадно закроется.
			// СИНХРОННО закрывать nested-соседа НЕЛЬЗЯ: сдвиг layout сразу же
			// выпихнет курсор из «…» — тот же каскад. Оставляем nested открытым;
			// он закроется только когда курсор реально уйдёт с «…» (cascade
			// закрытие уже есть в closeItem).
			item.addEventListener('mouseenter', function () {
				var moreEl = header.querySelector('.ss-menu__item--more');
				if (!moreEl || !moreEl.contains(item)) return;
				clearTimeout(closeTimer);
			});
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
			var nav = header.querySelector('.ss-header__nav');
			// Кэшируем все ПОСТОЯННЫЕ пункты (не триггер «…»).
			var allItems = Array.prototype.slice.call(
				mainList.querySelectorAll('.ss-menu__item:not(.ss-menu__item--more)')
			);

			// Пересчёт переполнения menubar. Всё в одном rAF-callback'е:
			//   - split на два кадра (WRITE → rAF → READ → WRITE) даёт межкадровое
			//     мигание, когда user активно тянет край окна: между reset и recompute
			//     браузер успевает нарисовать «all items in mainList» — items видимо
			//     торчат за пределы nav (у .ss-header__nav нет overflow: hidden).
			//   - Здесь reset + measure + reorg в одном тике: forced reflow есть,
			//     но событие resize — редкое, не в hot-path (перформанс не страдает),
			//     а визуально ни одного промежуточного кадра пользователь не видит.
			//   - Throttle через rAF: множественные resize-события в одном кадре
			//     схлопываются в один пересчёт.
			var overflowRaf = null;
			var recompute = function () {
				overflowRaf = null;

				// Reset: возвращаем items в mainList (перед триггером «…»).
				Array.prototype.slice.call(moreSubmenuInner.children).forEach(function (child) {
					if (child.classList && child.classList.contains('ss-menu__item')) {
						mainList.insertBefore(child, moreItem);
					}
				});
				moreItem.hidden = false;

				// Measure (forced reflow — приемлем, событие редкое).
				var navWidth = nav.clientWidth;
				var widths = allItems.map(function (item) {
					return item.getBoundingClientRect().width;
				});
				var triggerWidth = moreItem.getBoundingClientRect().width;

				var totalAll = widths.reduce(function (sum, w, i) {
					return sum + w + (i > 0 ? GAP : 0);
				}, 0);

				if (totalAll <= navWidth) {
					// Всё влезло — прячем триггер.
					moreItem.hidden = true;
					return;
				}

				var effectiveWidth = navWidth - triggerWidth - GAP;
				var accumulated = 0;
				var overflowStart = allItems.length;
				for (var i = 0; i < widths.length; i++) {
					var add = widths[i] + (i > 0 ? GAP : 0);
					if (accumulated + add > effectiveWidth) {
						overflowStart = i;
						break;
					}
					accumulated += add;
				}

				for (var j = overflowStart; j < allItems.length; j++) {
					moreSubmenuInner.appendChild(allItems[j]);
				}
			};

			var updateOverflow = function () {
				// На <$xl (1200) menubar скрыт — работа не нужна.
				if (window.innerWidth < 1200) return;
				if (overflowRaf) return; // уже запланирован пересчёт в этом кадре
				overflowRaf = requestAnimationFrame(recompute);
			};

			window.addEventListener('resize', updateOverflow);

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
	// для позиционирования под шапкой (top).
	//
	// Реализация — ResizeObserver: браузер сам сообщает актуальную высоту
	// в safe-момент (после layout, но до paint), без forced reflow.
	// Реагирует автоматически на:
	//   - resize окна (шапка меняется по media queries)
	//   - смену класса .ss-header--sticky (CSS-transition высоты)
	//   - загрузку шрифтов / SVG-лого (при финальном раскрое)
	// Поэтому setTimeout после toggle('.ss-header--sticky') больше не нужен.
	//
	// Fallback для очень старых браузеров без RO — getBoundingClientRect
	// на resize (как раньше). Устанавливается разово в rAF, чтобы не форсить
	// reflow во время инициализации.
	// ============================================================
	var setHeaderHeight = function (h) {
		document.documentElement.style.setProperty('--header-height', Math.round(h) + 'px');
	};

	if (header) {
		if ('ResizeObserver' in window) {
			var headerRO = new ResizeObserver(function (entries) {
				var entry = entries[0];
				if (!entry) return;
				var h;
				if (entry.borderBoxSize && entry.borderBoxSize.length) {
					// Актуальный API: borderBoxSize возвращает массив (для fragmented layout).
					h = entry.borderBoxSize[0].blockSize;
				} else {
					// Legacy API — Safari <15.4, старые Chromium.
					h = entry.contentRect.height;
				}
				setHeaderHeight(h);
			});
			headerRO.observe(header);
		} else {
			// Fallback — старые браузеры (IE, очень старые Safari).
			var updateHeaderHeightFallback = function () {
				setHeaderHeight(header.getBoundingClientRect().height);
			};
			requestAnimationFrame(updateHeaderHeightFallback);
			window.addEventListener('resize', updateHeaderHeightFallback);
		}
	}

	// ============================================================
	// Фаза 4 — Sticky-шапка. Шапка всегда position: fixed. При scrollY > 0
	// добавляется класс .ss-header--sticky, который сжимает шапку по высоте
	// и уменьшает лого (плавный transition из CSS).
	//
	// --header-height обновляется ResizeObserver'ом выше — здесь только toggle.
	// ============================================================
	if (header) {
		var isSticky = false;

		var updateSticky = function () {
			var scrollY = window.pageYOffset || document.documentElement.scrollTop;
			var shouldBeSticky = scrollY > 0;
			if (shouldBeSticky === isSticky) return;
			isSticky = shouldBeSticky;
			header.classList.toggle('ss-header--sticky', isSticky);
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
