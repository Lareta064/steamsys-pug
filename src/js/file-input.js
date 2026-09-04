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
