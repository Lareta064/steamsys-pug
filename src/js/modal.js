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
