// ==============================
// Swiper lazy-loader.
//
// Swiper.js весит ~140 КБ. Если грузить его сразу — на mobile
// PageSpeed набирается «Reduce unused JavaScript» + удлиняется
// Total Blocking Time. Этот лоадер:
//   1. Определяет window.whenSwiperReady(cb) — используется инициализаторами.
//   2. Ищет в DOM элементы .swiper. Если нет — просто выходит.
//   3. Через IntersectionObserver ждёт, пока первый .swiper приблизится
//      к вьюпорту (rootMargin 200px — начинаем чуть заранее), и подгружает
//      скрипт. После загрузки — вызывает все накопленные колбэки.
//
// CSS (swiper.min.css) подключён в layout.pug через <link media="print"
// onload="this.media='all'"> — не блокирует Critical Path (PageSpeed
// не считает такой <link> render-blocking), но начинает загружаться сразу
// вместе с остальными ресурсами. К моменту прокрутки до первого .swiper
// CSS уже применён — мигания неоформленным нет.
//
// Если Swiper уже загружен глобально (напр. в UI-каталоге через <script>
// в layout-ui.pug) — очередь сразу разбирается, всё работает как раньше.
//
// URL swiper.js вычисляется из <link> с swiper.min.css — надёжнее, чем
// хардкодить относительный путь: он корректен и для build/*.html,
// и для build/ui/*.html.
// ==============================
(function () {
	'use strict';

	var ready = (typeof Swiper !== 'undefined');
	var loading = false;
	var queue = [];

	window.whenSwiperReady = function (cb) {
		if (ready) { cb(); return; }
		queue.push(cb);
	};

	function markReady() {
		ready = true;
		for (var i = 0; i < queue.length; i++) {
			try { queue[i](); } catch (e) { console.error(e); }
		}
		queue.length = 0;
	}

	// Ищем корень Битрикс-шаблона по любому уже загруженному ассету
	// вида /local/templates/<theme>/…. На dev-хостинге верстка посажена
	// в Битрикс, swiper.min.css склеивается в общий CSS-бандл, отдельного
	// <link>-а на него в DOM нет (виден только в BX.setCSSList([...])) —
	// поэтому href для swiper.js оттуда не вытащить. А `./libs/swiper/…`
	// резолвится в корень домена, где файлов нет (они лежат в шаблоне).
	function findBitrixTemplateBase() {
		var re = /^(.*\/local\/templates\/[^\/]+\/)/;
		var els = document.querySelectorAll('link[href], script[src]');
		for (var i = 0; i < els.length; i++) {
			var u = els[i].href || els[i].src;
			var m = u && u.match(re);
			if (m) return m[1];
		}
		return null;
	}

	function loadSwiper() {
		if (loading || ready) return;
		loading = true;

		// 1. Прямая ссылка на swiper.min.css — самый надёжный вариант,
		//    работает и для статики (build/*.html, build/ui/*.html), и для
		//    Битрикса, если <link> уцелел и не был склеен в бандл.
		var cssLink = document.querySelector('link[href*="libs/swiper/swiper.min.css"]');
		var url;
		if (cssLink) {
			url = cssLink.href.replace(/swiper\.min\.css(\?.*)?$/, 'swiper.js');
		} else {
			// 2. Битрикс склеил swiper.min.css в бандл — определяем корень
			//    шаблона по любому /local/templates/<theme>/… и строим URL.
			var base = findBitrixTemplateBase();
			// 3. Фолбэк — относительный путь (для чистой статики).
			url = base ? base + 'libs/swiper/swiper.js' : './libs/swiper/swiper.js';
		}

		var s = document.createElement('script');
		s.src = url;
		s.async = true;
		s.onload = markReady;
		s.onerror = function () {
			console.error('Swiper failed to load from', url);
			loading = false;
		};
		document.head.appendChild(s);
	}

	// Если Swiper уже глобально доступен — сразу отработать очередь,
	// observer не нужен.
	if (ready) return;

	var els = document.querySelectorAll('.swiper');
	if (!els.length) return;

	// Fallback для старых браузеров без IntersectionObserver.
	if (!('IntersectionObserver' in window)) {
		loadSwiper();
		return;
	}

	var io = new IntersectionObserver(function (entries) {
		for (var i = 0; i < entries.length; i++) {
			if (entries[i].isIntersecting) {
				loadSwiper();
				io.disconnect();
				return;
			}
		}
	}, { rootMargin: '200px' });

	els.forEach(function (el) { io.observe(el); });
})();

// ==============================================================
// Пошаговая навигация по категориям в сайдбаре каталога.
// ==============================================================
(function () {
	'use strict';

	var navigation = document.querySelector('.catalog-page__category-nav');
	if (!navigation) return;

	var panels = navigation.querySelectorAll('.catalog-page__category-nav-panel');

	function showPanel(panelId) {
		var activePanel = null;
		panels.forEach(function (panel) {
			panel.hidden = panel.id !== panelId;
			if (!panel.hidden) activePanel = panel;
		});
		return activePanel;
	}

	function focusPanel(panel) {
		if (!panel) return;
		var target = panel.querySelector('.catalog-page__category-nav-back, .catalog-page__category-nav-button, .catalog-page__category-nav-link');
		if (target) target.focus();
	}

	function selectItem(item) {
		var panel = item.closest('.catalog-page__category-nav-panel');
		if (!panel) return;
		panel.querySelectorAll('.is-selected').forEach(function (selected) {
			selected.classList.remove('is-selected');
			if (selected.tagName === 'BUTTON') selected.setAttribute('aria-pressed', 'false');
			else selected.removeAttribute('aria-current');
		});
		item.classList.add('is-selected');
		if (item.tagName === 'BUTTON') item.setAttribute('aria-pressed', 'true');
		else item.setAttribute('aria-current', 'page');
	}

	navigation.addEventListener('click', function (event) {
		var openButton = event.target.closest('[data-category-open]');
		if (openButton && navigation.contains(openButton)) {
			selectItem(openButton);
			focusPanel(showPanel(openButton.getAttribute('data-category-open')));
			return;
		}

		var backButton = event.target.closest('[data-category-back]');
		if (backButton && navigation.contains(backButton)) {
			focusPanel(showPanel(backButton.getAttribute('data-category-back')));
			return;
		}

		var item = event.target.closest('.catalog-page__category-nav-button, .catalog-page__category-nav-link');
		if (item && navigation.contains(item)) selectItem(item);
	});
})();

// ==============================
// Локальный поиск по опциям фильтра в прототипе каталога.
// ==============================
(function () {
	'use strict';

	document.querySelectorAll('[data-filter-search]').forEach(function (field) {
		var input = field.querySelector('input[type="search"]');
		var list = document.getElementById(field.getAttribute('data-filter-search'));
		if (!input || !list) return;

		input.addEventListener('input', function () {
			var query = input.value.trim().toLocaleLowerCase('ru-RU');
			list.querySelectorAll('li').forEach(function (item) {
				item.hidden = query && item.textContent.toLocaleLowerCase('ru-RU').indexOf(query) === -1;
			});
		});
	});
})();

// ==============================================================
// .ss-accordion — раскрытие/сворачивание item'ов.
//
// Делегирование клика на document: любой клик по .ss-accordion__header
// внутри контейнера [data-accordion] переключает aria-expanded.
// Всё визуальное раскрытие (grid-template-rows: 0fr → 1fr,
// visibility) — на CSS, JS высоту не считает.
//
// Модификатор data-accordion="single" — режим «открыт только один item
// одновременно»: при раскрытии одного остальные внутри того же контейнера
// автоматически закрываются.
// ==============================================================
(function () {
	'use strict';

	document.addEventListener('click', function (e) {
		var header = e.target.closest('.ss-accordion__header');
		if (!header) return;

		var accordion = header.closest('[data-accordion]');
		if (!accordion) return;

		var isOpen = header.getAttribute('aria-expanded') === 'true';

		// Single-open режим — закрываем всё остальное перед раскрытием.
		if (!isOpen && accordion.getAttribute('data-accordion') === 'single') {
			accordion.querySelectorAll('.ss-accordion__header[aria-expanded="true"]').forEach(function (h) {
				h.setAttribute('aria-expanded', 'false');
			});
		}

		header.setAttribute('aria-expanded', String(!isOpen));
	});
})();

// ==============================
// Swiper для секции «Все готовые решения» на странице portfolio-page.
// Триггер — .js-all-solutions-slider. Та же схема, что experience-slider:
// 3 слайда на ≥1200, 2 на ≥768, 1 на <768. Стрелок нет — только пагинация
// в виде полосок (shared .swiper-bars).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-all-solutions-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 800,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Кнопки живут в соседнем .ss-slider-nav над слайдером
					// (не внутри .swiper), поэтому ищем через parent.
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1200: { slidesPerView: 3, spaceBetween: 30 }
				}
			});
		});
	});
})();

// ==============================================================
// Страница одной статьи (single-article) — мобильная адаптация сайдбара.
//
// Reflow help-card + solutions-list. На < 1024 блоки с [data-article-extra]
// переносятся из .ss-sticky-side в [data-article-mobile-extras] — placeholder
// под контентом статьи. TOC остаётся в сайдбаре (свой mobile-toggle встроен).
// Возвращаются в исходный aside при resize обратно на десктоп.
// Тот же паттерн, что в blog.js для data-blog-extra.
// ==============================================================
(function () {
	'use strict';

	var mobileExtras = document.querySelector('[data-article-mobile-extras]');
	var extras = document.querySelectorAll('[data-article-extra]');
	if (!mobileExtras || !extras.length) return;

	// Запоминаем исходного родителя (aside) — вернём туда при resize на десктоп.
	var originalParent = extras[0].parentElement;
	var mql = window.matchMedia('(max-width: 1023px)');

	function reflow() {
		var target = mql.matches ? mobileExtras : originalParent;
		extras.forEach(function (el) {
			target.appendChild(el);
		});
	}

	reflow();

	if (mql.addEventListener) {
		mql.addEventListener('change', reflow);
	} else if (mql.addListener) {
		mql.addListener(reflow);
	}
})();

// ==============================================================
// Страница «База знаний» — мобильная адаптация.
//
// 1. Аккордеон «Разделы» ([data-blog-accordion]) — toggle по клику
//    на .ss-blog__accordion-toggle. Синхронизирует aria-expanded
//    на кнопке и [hidden] на body. Работает только на мобилке — на
//    десктопе кнопка скрыта CSS'ом, body всегда видим.
//
// 2. Reflow тегов + CTA. На мобилке (< 1024) блоки с [data-blog-extra]
//    переносятся из aside в [data-blog-mobile-extras] — под пагинацию.
//    Возвращаются в aside при resize обратно на десктоп.
// ==============================================================
(function () {
	'use strict';

	// ---- Accordion toggle ----
	var accordions = document.querySelectorAll('[data-blog-accordion]');
	accordions.forEach(function (acc) {
		var toggle = acc.querySelector('.ss-blog__accordion-toggle');
		var body = acc.querySelector('.ss-blog__accordion-body');
		if (!toggle || !body) return;

		toggle.addEventListener('click', function () {
			var open = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!open));
			if (open) body.setAttribute('hidden', '');
			else body.removeAttribute('hidden');
		});
	});

	// ---- Reflow tags + cta on mobile ----
	var mobileExtras = document.querySelector('[data-blog-mobile-extras]');
	var extras = document.querySelectorAll('[data-blog-extra]');
	if (!mobileExtras || !extras.length) return;

	// Запоминаем исходного родителя (aside) — вернём туда при resize на десктоп.
	var originalParent = extras[0].parentElement;
	var mql = window.matchMedia('(max-width: 1023px)');

	function reflow() {
		var target = mql.matches ? mobileExtras : originalParent;
		extras.forEach(function (el) {
			target.appendChild(el);
		});
	}

	reflow();

	// matchMedia.addEventListener — современный API; fallback на addListener для старых Safari.
	if (mql.addEventListener) {
		mql.addEventListener('change', reflow);
	} else if (mql.addListener) {
		mql.addListener(reflow);
	}
})();

// ==============================
// Swiper для секции «Выберите подходящий вариант» на странице кейса.
// Конфигурация 1:1 с production-tasks-swiper: 3 слайда на ≥1280,
// 2 на ≥768, 1 на <768. Стрелки живут в соседнем .ss-slider-nav
// внутри .ss-section-header, пагинация-полоски снизу.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-case-variants-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 800,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Кнопки живут в .ss-slider-nav внутри .ss-section-header
					// (не внутри .swiper), ищем через parentElement (.ss-container).
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1280: { slidesPerView: 3, spaceBetween: 30 }
				}
			});
		});
	});
})();

// ==============================
// Swiper слайдера партнёров на cases-page.
// Триггер — .js-cases-partners-slider. slidesPerView:'auto', ширина карточки — из CSS.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-cases-partners-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 1200,
				loop: true,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true
				},
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					425:  { slidesPerView: 2, spaceBetween: 10 },
					768:  { slidesPerView: 3, spaceBetween: 20 },
					1024: { slidesPerView: 4, spaceBetween: 20 },
					1280: { slidesPerView: 5, spaceBetween: 20 },
					1440: { slidesPerView: 6, spaceBetween: 20 }
				}
			});
		});
	});
})();

// ==============================
// Swiper слайдера «Реализованные проекты» на cases-page.
// Триггер — .js-cases-slider. Стрелки в .ss-slider-nav над слайдером.
// 2 слайда на ≥1024, 1 на <1024. gap 30px на desktop, 20px на tablet, 16px на mobile.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-cases-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 16,
				speed: 600,
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				breakpoints: {
					600:  { slidesPerView: 2, spaceBetween: 10 },
					1024: { slidesPerView: 2, spaceBetween: 30 }
				}
			});
		});
	});
})();

// ==============================
// Инициализация Swiper для секции «Опыт в ключевых отраслях».
// Триггер — класс .js-experience-slider. Стрелок нет, только пагинация-полоски.
// 3 слайда на desktop (≥1024) / 1 на mobile. Просвет 30 / 10.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-experience-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 800,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Кнопки живут в соседнем .ss-slider-nav над слайдером
					// (не внутри .swiper), поэтому ищем через parent.
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1200: { slidesPerView: 3, spaceBetween: 30 }
				}
			});
		});
	});
})();

// ==============================
// .ss-file — интеграция кастомной кнопки прикрепления файла.
//
// На все .ss-file на странице:
//   · при выборе файла — подменяем текст .ss-file__label на имя файла
//     и вешаем класс .is-attached на корневой label (показывает крестик);
//   · клик по .ss-file__remove — очищаем input, возвращаем дефолтный текст
//     и снимаем .is-attached. e.preventDefault + stopPropagation, чтобы
//     клик по кнопке не бабблился в label и не открывал файловый диалог.
// ==============================
(function () {
	var files = document.querySelectorAll('.ss-file');
	if (!files.length) return;

	files.forEach(function (fileLabel) {
		var input = fileLabel.querySelector('.ss-file__input');
		var labelText = fileLabel.querySelector('.ss-file__label');
		var removeBtn = fileLabel.querySelector('.ss-file__remove');
		if (!input || !labelText) return;

		var defaultText = labelText.textContent;

		input.addEventListener('change', function () {
			if (input.files && input.files.length > 0) {
				labelText.textContent = input.files[0].name;
				fileLabel.classList.add('is-attached');
			} else {
				labelText.textContent = defaultText;
				fileLabel.classList.remove('is-attached');
			}
		});

		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				input.value = '';
				labelText.textContent = defaultText;
				fileLabel.classList.remove('is-attached');
			});
		}
	});
})();

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

// ==============================================================
// Инициализация Swiper для .ss-gallery.
// Триггер — .js-gallery на корневой обёртке. Внутри: .swiper со slide'ами,
// стрелки .ss-swiper-btn--prev/--next (см. blocks/_swiper-btn.scss),
// .swiper-pagination-gallery (счётчик).
//
// Счётчик работает через штатную Swiper-пагинацию type='fraction' —
// сам обновляется. Элемент пагинации ищем по .swiper-pagination-gallery
// внутри именно этой обёртки (несколько галерей на странице не путаются).
// ==============================================================
(function () {
	'use strict';

	var galleries = document.querySelectorAll('.js-gallery');
	if (!galleries.length) return;

	whenSwiperReady(function () {
		galleries.forEach(function (gallery) {
			var swiperEl = gallery.querySelector('.swiper');
			if (!swiperEl) return;

			var prevEl = gallery.querySelector('.ss-swiper-btn--prev');
			var nextEl = gallery.querySelector('.ss-swiper-btn--next');
			var paginationEl = gallery.querySelector('.swiper-pagination-gallery');

			new Swiper(swiperEl, {
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 500,
				navigation: {
					prevEl: prevEl,
					nextEl: nextEl
				},
				pagination: {
					el: paginationEl,
					type: 'fraction'
				}
			});
		});
	});
})();

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


// ==============================
// Mock file-preview для dev-разметки .ss-b24-form.
// В production .ss-b24-form содержит реальный битрикс-DOM, который сам
// обрабатывает выбор файла и рендерит .b24-form-control-filelist с именем,
// размером и кнопкой удаления. В dev-моке (b24-form-light.pug,
// _portfolio-form.pug) этого скрипта нет — поле «мёртвое».
//
// Этот модуль:
//   1. Находит мок file-поля — у label.b24-form-control-file-button
//      есть вложенный <input type="file"> (у битрикса кнопка — <button>
//      без input, поэтому реальная форма не затрагивается).
//   2. При выборе файла прячет label и рендерит .b24-form-control-filelist
//      с .b24-form-control-file-item (стили — в _b24-form.scss).
//   3. На клик по × — удаляет file-item, показывает label обратно,
//      сбрасывает input.value.
// ==============================
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var fields = document.querySelectorAll('.ss-b24-form .b24-form-field-file');
		Array.prototype.forEach.call(fields, initField);
	});

	function initField(field) {
		var fileControl = field.querySelector('.b24-form-control-file');
		if (!fileControl) return;

		var labelBtn = fileControl.querySelector('label.b24-form-control-file-button');
		if (!labelBtn) return;    // Не мок, реальный битрикс — пропускаем.

		var input = labelBtn.querySelector('input[type="file"]');
		if (!input) return;

		input.addEventListener('change', function () {
			if (input.files && input.files.length > 0) {
				renderFileItem(fileControl, labelBtn, input, input.files[0]);
			}
		});
	}

	function renderFileItem(fileControl, labelBtn, input, file) {
		// Скрываем label-кнопку выбора.
		labelBtn.style.display = 'none';

		var filelist = document.createElement('div');
		filelist.className = 'b24-form-control-filelist';
		filelist.innerHTML = ''
			+ '<div class="b24-form-control-file-item">'
			+   '<div class="b24-form-control-file-item-preview">'
			+     '<img class="b24-form-control-file-item-preview-image" alt="">'
			+   '</div>'
			+   '<div class="b24-form-control-file-item-name">'
			+     '<span class="b24-form-control-file-item-name-text"></span>'
			+   '</div>'
			+   '<span class="b24-form-control-file-item-size-text"></span>'
			+   '<button class="b24-form-control-file-item-remove" type="button" aria-label="Удалить файл"></button>'
			+ '</div>';

		filelist.querySelector('.b24-form-control-file-item-name-text').textContent = file.name;
		filelist.querySelector('.b24-form-control-file-item-size-text').textContent = formatSize(file.size);

		var preview = filelist.querySelector('.b24-form-control-file-item-preview');
		var img = preview.querySelector('.b24-form-control-file-item-preview-image');
		if (file.type.indexOf('image/') === 0) {
			img.src = URL.createObjectURL(file);
		} else {
			// Для не-картинок убираем квадрат-миниатюру.
			preview.parentNode.removeChild(preview);
		}

		filelist.querySelector('.b24-form-control-file-item-remove')
			.addEventListener('click', function () {
				input.value = '';
				filelist.parentNode.removeChild(filelist);
				labelBtn.style.display = '';
			});

		fileControl.appendChild(filelist);
	}

	function formatSize(bytes) {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / 1048576).toFixed(1) + ' MB';
	}
})();

// ==============================
// .ss-modal — открытие / закрытие модалок сайта.
//
// Триггеры открытия: любые [data-modal="<id>"]. По клику находим
// .ss-modal#modal-<id>, снимаем hidden, вешаем .is-open + блокируем
// прокрутку body через класс .is-modal-open на <html>.
//
// Триггеры закрытия:
//   · клик по [data-modal-close] (X-кнопка внутри модалки),
//   · клик по overlay (мимо .ss-modal__inner — по самой .ss-modal),
//   · клавиша Escape.
//
// После закрытия — возвращаем фокус на элемент, который открывал модалку.
// ==============================
(function () {
	var triggers = document.querySelectorAll('[data-modal]');
	var modals = document.querySelectorAll('.ss-modal');
	if (!triggers.length || !modals.length) return;

	var activeModal = null;
	var lastFocusedTrigger = null;

	function openModal(modal, triggerEl) {
		if (!modal) return;
		activeModal = modal;
		lastFocusedTrigger = triggerEl || null;
		modal.hidden = false;
		modal.classList.add('is-open');
		document.documentElement.classList.add('is-modal-open');
		// Первая кнопка/поле для клавиатурного фокуса — X-кнопка (безопасный дефолт).
		var closeBtn = modal.querySelector('[data-modal-close]');
		if (closeBtn) closeBtn.focus();
	}

	function closeModal() {
		if (!activeModal) return;
		activeModal.classList.remove('is-open');
		activeModal.hidden = true;
		document.documentElement.classList.remove('is-modal-open');
		if (lastFocusedTrigger) lastFocusedTrigger.focus();
		activeModal = null;
		lastFocusedTrigger = null;
	}

	triggers.forEach(function (trigger) {
		trigger.addEventListener('click', function (e) {
			e.preventDefault();
			var id = trigger.getAttribute('data-modal');
			var modal = document.getElementById('modal-' + id);
			openModal(modal, trigger);
		});
	});

	modals.forEach(function (modal) {
		modal.addEventListener('click', function (e) {
			// Клик по overlay (по самой .ss-modal, но не по её потомкам).
			if (e.target === modal) {
				closeModal();
				return;
			}
			// Клик по элементу с data-modal-close (X-кнопка) — тоже закрывает.
			var closeEl = e.target.closest('[data-modal-close]');
			if (closeEl && modal.contains(closeEl)) {
				closeModal();
			}
		});
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && activeModal) {
			closeModal();
		}
	});
})();

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

	var containers = document.querySelectorAll('.js-partners-slider');
	if (!containers.length) return;

	whenSwiperReady(function () {
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
	});
})();

// ==============================
// Галерея товара: 2 связанных Swiper'а через модуль Thumbs
// (встроен в Swiper 8). Триггер — .js-product-gallery на корневой обёртке.
// Внутри ожидаются 2 .swiper: .ss-product-gallery__main и
// .ss-product-gallery__thumbs.
// Инициализация в порядке thumbs → main, т.к. main получает ссылку
// на thumbs-инстанс.
// ==============================
(function () {
	'use strict';

	var containers = document.querySelectorAll('.js-product-gallery');
	if (!containers.length) return;

	whenSwiperReady(function () {
		containers.forEach(function (container) {
			var mainEl = container.querySelector('.ss-product-gallery__main');
			var thumbsEl = container.querySelector('.ss-product-gallery__thumbs');
			if (!mainEl || !thumbsEl) return;

			var thumbsSwiper = new Swiper(thumbsEl, {
				slidesPerView: 'auto',
				spaceBetween: 10,
				freeMode: true,
				watchSlidesProgress: true
			});

			new Swiper(mainEl, {
				spaceBetween: 10,
				speed: 400,
				thumbs: {
					swiper: thumbsSwiper
				}
			});
		});
	});
})();

// ==============================
// Якорное меню страницы товара (.ss-product-nav).
// Задачи:
//   1. Smooth-scroll по клику на таб — с учётом высоты фикс-шапки
//      (--header-height) и самого sticky-меню.
//   2. ScrollSpy — расставляем .is-active на таб, в чью секцию
//      попал верх вьюпорта (с offset'ом = header + nav).
// ==============================
(function () {
	'use strict';

	var nav = document.querySelector('.ss-product-nav');
	if (!nav) return;

	var links = Array.prototype.slice.call(nav.querySelectorAll('.ss-product-nav__link'));
	if (!links.length) return;

	var items = links
		.map(function (link) {
			var href = link.getAttribute('href') || '';
			if (href.charAt(0) !== '#') return null;
			var section = document.querySelector(href);
			return section ? { link: link, section: section } : null;
		})
		.filter(Boolean);
	if (!items.length) return;

	function getHeaderHeight() {
		var h = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
		var n = parseFloat(h);
		return isNaN(n) ? 100 : n;
	}

	// Smooth-scroll по клику
	links.forEach(function (link) {
		link.addEventListener('click', function (e) {
			var href = link.getAttribute('href') || '';
			if (href.charAt(0) !== '#') return;
			var section = document.querySelector(href);
			if (!section) return;

			e.preventDefault();
			var offset = getHeaderHeight() + nav.offsetHeight;
			var top = section.getBoundingClientRect().top + window.pageYOffset - offset;
			window.scrollTo({ top: top, behavior: 'smooth' });
		});
	});

	// ScrollSpy. rootMargin сверху = -(header+nav), снизу = -70% —
	// активной считается секция, верх которой пересёк линию «под меню».
	function setActive(id) {
		items.forEach(function (it) {
			it.link.classList.toggle('is-active', ('#' + it.section.id) === id);
		});
	}

	var topOffset = getHeaderHeight() + nav.offsetHeight;

	var observer = new IntersectionObserver(function (entries) {
		var visible = entries
			.filter(function (en) { return en.isIntersecting; })
			.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
		if (visible[0]) setActive('#' + visible[0].target.id);
	}, {
		rootMargin: '-' + topOffset + 'px 0px -70% 0px',
		threshold: 0
	});

	items.forEach(function (it) { observer.observe(it.section); });
})();

// ==============================
// Swiper для секции «Выберите по производственной задаче».
// Триггер — .js-production-tasks-slider. Конфигурация 1:1 с
// experience-swiper: 3 слайда на desktop (≥1024) / 1 на mobile,
// пагинация-полоски (shared .swiper-bars), стрелок нет.
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-production-tasks-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 10,
				speed: 800,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Кнопки живут в соседнем .ss-slider-nav над слайдером
					// (не внутри .swiper), поэтому ищем через parent.
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				breakpoints: {
					768:  { slidesPerView: 2, spaceBetween: 20 },
					1280: { slidesPerView: 3, spaceBetween: 30 }
				}
			});
		});
	});
})();

// ==============================
// Инициализация Swiper для слайдера отзывов клиентов.
// Триггер — класс .js-reviews-slider на .swiper.
// 1 слайд на видимую область, пагинация-полоски внизу (из .swiper-bars).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-reviews-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: 30,
				speed: 500,
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				navigation: {
					// Стрелки живут на уровне .ss-cases__reviews (parentElement),
					// не внутри .swiper — overflow: hidden у swiper обрезал бы -20px.
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				}
			});
		});
	});
})();

// ==============================
// .ss-role-card-group — прокрутка стрипа карточек-ролей мышкой (click & drag).
// От 1200+ карточки шире контейнера и уезжают в overflow-x. Тачскрин работает
// нативным свайпом; мышке даём drag: зажал ЛКМ, тянешь — блок скроллится.
// Клик по ссылке после протяжки подавляется (moved-флаг).
// ==============================
(function () {
	'use strict';

	var groups = document.querySelectorAll('.ss-role-card-group');
	if (!groups.length) return;

	groups.forEach(function (group) {
		var isDown = false;
		var moved = false;
		var startX = 0;
		var startScroll = 0;

		group.addEventListener('mousedown', function (e) {
			// ЛКМ только
			if (e.button !== 0) return;
			isDown = true;
			moved = false;
			startX = e.pageX;
			startScroll = group.scrollLeft;
			group.classList.add('is-dragging');
			// без preventDefault — иначе не сфокусируются ссылки при обычном клике
		});

		document.addEventListener('mousemove', function (e) {
			if (!isDown) return;
			var dx = e.pageX - startX;
			if (Math.abs(dx) > 3) moved = true;
			group.scrollLeft = startScroll - dx;
		});

		document.addEventListener('mouseup', function () {
			if (!isDown) return;
			isDown = false;
			group.classList.remove('is-dragging');
		});

		// Если была протяжка — гасим клик, чтобы не сработала ссылка.
		group.addEventListener('click', function (e) {
			if (moved) {
				e.preventDefault();
				e.stopPropagation();
				moved = false;
			}
		}, true);
	});
})();

// ==============================================================
// .ss-select — кастомный select (button + ul[role=listbox]).
//
// Крючок: все элементы с атрибутом data-select инициализируются.
// Механика:
//   · клик по .ss-select__control      — открыть/закрыть список,
//   · клик по .ss-select__option        — выбрать значение, закрыть,
//   · клик вне открытого select'а       — закрыть,
//   · клавиша Escape                    — закрыть + вернуть фокус на control,
//   · aria-expanded на control          — синхронизирован со stateм (CSS слушает).
//
// Данные (для внешних потребителей):
//   · data-value на .ss-select__option  — значение опции
//   · при выборе JS пишет data-value на корневой .ss-select
//     (можно читать снаружи для фильтров/сортировки без имитации <select>).
// ==============================================================
(function () {
	'use strict';

	var selects = document.querySelectorAll('[data-select]');
	if (!selects.length) return;

	selects.forEach(initSelect);

	function initSelect(select) {
		var control = select.querySelector('.ss-select__control');
		var list = select.querySelector('.ss-select__list');
		var options = select.querySelectorAll('.ss-select__option');
		var value = select.querySelector('.ss-select__value');

		if (!control || !list) return;

		control.addEventListener('click', function (e) {
			e.stopPropagation();
			toggle(select);
		});

		options.forEach(function (option) {
			option.addEventListener('click', function (e) {
				e.stopPropagation();
				choose(select, option);
				close(select);
				control.focus();
			});
		});
	}

	// Один глобальный слушатель на «клик мимо» — закрывает все открытые.
	document.addEventListener('click', function (e) {
		selects.forEach(function (select) {
			if (isOpen(select) && !select.contains(e.target)) close(select);
		});
	});

	// Escape — закрыть все открытые, вернуть фокус на control.
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') return;
		selects.forEach(function (select) {
			if (isOpen(select)) {
				close(select);
				select.querySelector('.ss-select__control').focus();
			}
		});
	});

	function isOpen(select) {
		var control = select.querySelector('.ss-select__control');
		return control && control.getAttribute('aria-expanded') === 'true';
	}

	function open(select) {
		select.querySelector('.ss-select__control').setAttribute('aria-expanded', 'true');
		select.querySelector('.ss-select__list').hidden = false;
	}

	function close(select) {
		select.querySelector('.ss-select__control').setAttribute('aria-expanded', 'false');
		select.querySelector('.ss-select__list').hidden = true;
	}

	function toggle(select) {
		if (isOpen(select)) close(select); else open(select);
	}

	function choose(select, option) {
		var options = select.querySelectorAll('.ss-select__option');
		var value = select.querySelector('.ss-select__value');

		options.forEach(function (opt) {
			opt.setAttribute('aria-selected', opt === option ? 'true' : 'false');
		});

		if (value) {
			value.textContent = option.textContent;
			value.classList.remove('ss-select__value--placeholder');
		}

		// Пишем data-value на корень — удобно читать снаружи (фильтры и т.п.).
		var v = option.getAttribute('data-value');
		if (v !== null) select.setAttribute('data-value', v);
	}
})();

// ==============================
// Слайдер «Похожие товары» на странице карточки товара.
// Триггер — .js-similar-slider. Стрелки живут в соседнем
// .ss-slider-nav над слайдером, ищутся через parentElement.
//
// Брейкпойнты (min-width, Swiper mobile-first):
//   default (<768)  — auto, gap 10
//   768+            — auto, gap 20
//   1440+           — 4 слайда, gap 20
//   1600+           — 4 слайда, gap 30
// Ширина слайда при slidesPerView:'auto' задаётся в CSS (_product-similar.scss).
// ==============================
(function () {
	'use strict';

	var els = document.querySelectorAll('.js-similar-slider');
	if (!els.length) return;

	whenSwiperReady(function () {
		els.forEach(function (el) {
			new Swiper(el, {
				slidesPerView: 'auto',
				spaceBetween: 10,
				speed: 500,
				navigation: {
					prevEl: el.parentElement.querySelector('.ss-swiper-btn--prev'),
					nextEl: el.parentElement.querySelector('.ss-swiper-btn--next')
				},
				pagination: {
					el: el.querySelector('.swiper-pagination'),
					clickable: true
				},
				breakpoints: {
					768: {
						slidesPerView: 'auto',
						spaceBetween: 20
					},
					1440: {
						slidesPerView: 4,
						spaceBetween: 20
					},
					1600: {
						slidesPerView: 4,
						spaceBetween: 30
					}
				}
			});
		});
	});
})();

// ==============================
// .ss-tabs — переключение табов.
// Обёртка .ss-tabs связывает .ss-tabs__list и .ss-tabs__panels — при клике
// на .ss-tabs__tab снимаем .is-active со всех кнопок этого списка и всех
// панелей этой обёртки, ставим на выбранную кнопку и соответствующую панель
// (по индексу). Если .ss-tabs__list используется вне .ss-tabs (только кнопки,
// без панелей), переключается только состояние кнопок.
// ==============================
(function () {
	'use strict';

	var lists = document.querySelectorAll('.ss-tabs__list');
	if (!lists.length) return;

	lists.forEach(function (list) {
		var scope = list.closest('.ss-tabs');
		var panelsContainer = scope ? scope.querySelector('.ss-tabs__panels') : null;

		list.addEventListener('click', function (e) {
			var btn = e.target.closest('.ss-tabs__tab');
			if (!btn || !list.contains(btn)) return;
			if (btn.disabled || btn.classList.contains('is-disabled')) return;
			if (btn.classList.contains('is-active')) return;

			var tabs = Array.prototype.slice.call(list.querySelectorAll('.ss-tabs__tab'));
			var idx = tabs.indexOf(btn);

			tabs.forEach(function (t) { t.classList.remove('is-active'); });
			btn.classList.add('is-active');

			if (panelsContainer) {
				var panels = panelsContainer.children;
				for (var i = 0; i < panels.length; i++) {
					panels[i].classList.remove('is-active');
				}
				if (panels[idx]) {
					panels[idx].classList.add('is-active');
				}
			}
		});
	});
})();

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

// ==============================================================
// .ss-toc — «Содержание» статьи.
//
// 1. Mobile accordion toggle — на < $lg (CSS-стороне) отображается
//    кнопка .ss-toc__toggle + body[hidden]. Логика идентична
//    _section-blog.__accordion — синхронизируем aria-expanded ↔ [hidden].
//
// 2. Scroll-spy — активная ссылка меняется по мере скролла статьи.
//    Алгоритм: находим самую нижнюю секцию, чей top уже перекатился под
//    header (учитываем --header-height + небольшой offset). Работает
//    предсказуемо для длинных секций (в отличие от чистого
//    IntersectionObserver, где легко «залипнуть» между двумя).
//    rAF-троттлинг + пассивный scroll listener.
// ==============================================================
(function () {
	'use strict';

	var tocs = document.querySelectorAll('.js-toc');
	if (!tocs.length) return;

	tocs.forEach(function (toc) {
		// ---- Mobile accordion toggle ----
		var toggle = toc.querySelector('.ss-toc__toggle');
		var body = toc.querySelector('.ss-toc__body');
		if (toggle && body) {
			toggle.addEventListener('click', function () {
				var open = toggle.getAttribute('aria-expanded') === 'true';
				toggle.setAttribute('aria-expanded', String(!open));
				if (open) body.setAttribute('hidden', '');
				else body.removeAttribute('hidden');
			});
		}

		// ---- Scroll-spy ----
		var links = toc.querySelectorAll('.ss-toc__link');
		if (!links.length) return;

		// Собираем пары link ↔ section (только те, где секция реально есть).
		var pairs = [];
		links.forEach(function (link) {
			var href = link.getAttribute('href') || '';
			if (href.charAt(0) !== '#') return;
			var id = href.slice(1);
			var section = id && document.getElementById(id);
			if (section) pairs.push({ link: link, section: section });
		});
		if (!pairs.length) return;

		function getHeaderOffset() {
			// --header-height ставится JS-инициализацией шапки. Fallback 100.
			var v = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
			var n = parseInt(v, 10);
			return isNaN(n) ? 60 : n;
		}

		// Линия активации: 25% высоты вьюпорта ниже шапки. Пункт становится
		// активным, как только его h2 попадает в верхнюю четверть видимой зоны
		// (а не когда почти уезжает под шапку). Так активность идёт «в ногу»
		// с тем, что читатель видит на экране.
		function getActivationLine() {
			return getHeaderOffset() + Math.round(window.innerHeight * 0.25);
		}

		function setActive(activeLink) {
			pairs.forEach(function (p) {
				if (p.link === activeLink) p.link.setAttribute('aria-current', 'location');
				else p.link.removeAttribute('aria-current');
			});
		}

		function update() {
			var line = getActivationLine();
			var current = null;

			// Секции идут по DOM-порядку — как только top секции ниже
			// activation-line, все последующие ещё ниже. Останавливаемся.
			for (var i = 0; i < pairs.length; i++) {
				var top = pairs[i].section.getBoundingClientRect().top;
				if (top <= line) {
					current = pairs[i].link;
				} else {
					break;
				}
			}

			// Если ничего не прошло линию (скроллим над первой секцией) —
			// подсвечиваем первую по умолчанию.
			if (!current) current = pairs[0].link;
			setActive(current);
		}

		var scheduled = false;
		function onScroll() {
			if (scheduled) return;
			scheduled = true;
			requestAnimationFrame(function () {
				scheduled = false;
				update();
			});
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		update();
	});
})();
