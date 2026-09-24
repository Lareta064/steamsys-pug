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
