// ==============================================================
// Прогресс заполнения опросного листа.
//
// Считаем «заполненные» поля формы и выводим % в полоску сверху
// (.ss-single-survey__progress-fill) + в надпись (data-progress-value).
//
// Что считается полем:
//   · <input type="text|tel|email|number"> и <textarea> — зачёт, если value непустой;
//   · группа радио (по name) — зачёт, если любой из radio в группе checked;
//   · required-чекбокс (напр. privacy_consent) — зачёт, если checked.
//
// Что НЕ считается:
//   · необязательные чекбоксы (accessories[]) — они дополнительные, не влияют
//     на «готовность» формы, иначе процент получается перегружен.
//   · hidden/submit/file — специфика, пропускаем.
//
// Процент = round(filled / total * 100). При total=0 — 0%.
//
// Слушаем input+change на форме (один делегат), пересчитываем прогресс.
// ==============================================================
(function () {
	'use strict';

	var form = document.querySelector('.ss-single-survey__main');
	if (!form) return;

	var progressFill = document.querySelector('[data-progress-fill]');
	var progressValue = document.querySelector('[data-progress-value]');
	if (!progressFill || !progressValue) return;

	// Селектор «текстовых» инпутов + textarea
	var TEXT_SELECTOR = [
		'input[type="text"]',
		'input[type="tel"]',
		'input[type="email"]',
		'input[type="number"]',
		'textarea'
	].join(',');

	function countFilled() {
		var textInputs = form.querySelectorAll(TEXT_SELECTOR);
		var radios = form.querySelectorAll('input[type="radio"]');
		var requiredChecks = form.querySelectorAll('input[type="checkbox"][required]');

		// Собираем уникальные name радио-групп
		var radioGroups = {};
		radios.forEach(function (r) {
			if (r.name) radioGroups[r.name] = true;
		});
		var radioGroupNames = Object.keys(radioGroups);

		var total = textInputs.length + radioGroupNames.length + requiredChecks.length;
		var filled = 0;

		textInputs.forEach(function (input) {
			if (input.value && String(input.value).trim() !== '') filled++;
		});

		radioGroupNames.forEach(function (name) {
			// CSS.escape — если в name будут скобки (как accessories[]), работает надёжно.
			var escaped = (window.CSS && CSS.escape) ? CSS.escape(name) : name;
			if (form.querySelector('input[type="radio"][name="' + escaped + '"]:checked')) {
				filled++;
			}
		});

		requiredChecks.forEach(function (cb) {
			if (cb.checked) filled++;
		});

		return { filled: filled, total: total };
	}

	function updateProgress() {
		var counts = countFilled();
		var percent = counts.total === 0 ? 0 : Math.round((counts.filled / counts.total) * 100);
		if (percent > 100) percent = 100;
		progressFill.style.width = percent + '%';
		progressValue.textContent = percent + '%';
	}

	// Один делегат на всю форму — ловит и text-input, и change (радио/чекбокс).
	form.addEventListener('input', updateProgress);
	form.addEventListener('change', updateProgress);

	// Инициализация — на случай предзаполненных браузером (autofill) значений
	// или возврата на страницу через back/forward (bfcache сохраняет value).
	updateProgress();
	window.addEventListener('pageshow', updateProgress);
})();
