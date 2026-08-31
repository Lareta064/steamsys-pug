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
