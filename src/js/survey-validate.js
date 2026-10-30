// ==============================================================
// Валидация обязательных полей опросных форм.
//
// На всех single-survey страницах форма содержит ограниченный набор
// required-полей (NAME, PHONE, EMAIL + legal_top). Используем form
// [novalidate] + свою проверку: при submit собираем пустые required,
// подсвечиваем их через .is-invalid, скроллим и фокусируемся на первом.
//
// Повторный submit после исправления — проходит. При input в
// подсвеченном поле — класс снимается сразу.
// ==============================================================
(function () {
	'use strict';

	var forms = document.querySelectorAll('.ss-single-survey__main');
	if (!forms.length) return;

	forms.forEach(function (form) {
		form.addEventListener('submit', function (e) {
			var invalid = collectInvalid(form);
			if (!invalid.length) return;

			e.preventDefault();
			invalid.forEach(markInvalid);
			focusFirst(invalid[0]);
		});

		// Снимаем .is-invalid сразу после ввода / выбора в поле
		form.addEventListener('input', function (e) {
			var field = e.target.closest('input, textarea, select');
			if (field && isFilled(field)) clearInvalid(field);
		});
		form.addEventListener('change', function (e) {
			var field = e.target.closest('input, textarea, select');
			if (field && isFilled(field)) clearInvalid(field);
		});
	});

	function collectInvalid(form) {
		var fields = form.querySelectorAll('[required]');
		var invalid = [];
		fields.forEach(function (f) {
			if (!isFilled(f)) invalid.push(f);
		});
		return invalid;
	}

	function isFilled(field) {
		if (field.type === 'checkbox') return field.checked;
		if (field.type === 'radio') {
			// Хотя бы один radio с таким name отмечен.
			if (!field.name) return field.checked;
			var any = field.form.querySelector('input[type="radio"][name="' + CSS.escape(field.name) + '"]:checked');
			return !!any;
		}
		return field.value && String(field.value).trim() !== '';
	}

	function markInvalid(field) {
		field.classList.add('is-invalid');
		var wrapper = field.closest('.ss-form-field, .ss-check-opt, .ss-form-submit__consent');
		if (wrapper) wrapper.classList.add('is-invalid');
	}

	function clearInvalid(field) {
		field.classList.remove('is-invalid');
		var wrapper = field.closest('.ss-form-field, .ss-check-opt, .ss-form-submit__consent');
		if (wrapper) wrapper.classList.remove('is-invalid');
	}

	function focusFirst(field) {
		if (!field) return;
		// Scroll так, чтобы поле было по центру экрана (а не под sticky-шапкой).
		try {
			field.scrollIntoView({ behavior: 'smooth', block: 'center' });
		} catch (e) {
			field.scrollIntoView();
		}
		// Фокус с задержкой — чтобы scrollIntoView успел «докрутить».
		setTimeout(function () {
			try { field.focus({ preventScroll: true }); } catch (e) { field.focus(); }
		}, 350);
	}
})();
