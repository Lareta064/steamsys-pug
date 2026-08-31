// ==============================
// .ss-tabs__list — переключение класса .is-active на кнопках таба.
// Работает и без родителя .ss-tabs (одиночный список кнопок),
// и внутри полного компонента. Логика панелей (.ss-tabs__panel) —
// добавим отдельным шагом.
// ==============================
(function () {
	'use strict';

	var lists = document.querySelectorAll('.ss-tabs__list');
	if (!lists.length) return;

	lists.forEach(function (list) {
		list.addEventListener('click', function (e) {
			var btn = e.target.closest('.ss-tabs__tab');
			if (!btn || !list.contains(btn)) return;
			if (btn.disabled || btn.classList.contains('is-disabled')) return;
			if (btn.classList.contains('is-active')) return;

			list.querySelectorAll('.ss-tabs__tab.is-active').forEach(function (t) {
				t.classList.remove('is-active');
			});
			btn.classList.add('is-active');
		});
	});
})();
