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
