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
