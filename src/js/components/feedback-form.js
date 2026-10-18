import intlTelInput from 'intl-tel-input';

/**
* Форма заявки: проверка перед отправкой (имя, телефон, почта если заполнена, оба согласия)
* и подпись выбранных файлов вместо «Прикрепить файл».
* Ошибка — класс is-error на .input / .checkbox, снимается при вводе.
*/
function isFieldValid(field) {
	if (field.classList.contains('js-phone')) {
		const iti = intlTelInput.getInstance(field);

		return iti ? Boolean(iti.isValidNumber()) : field.value.trim() !== '';
	}

	if (field.type === 'checkbox') {
		return field.checked;
	}

	if (field.required && field.value.trim() === '') {
		return false;
	}

	return field.checkValidity();
}

function setError(field, isError) {
	const wrapper = field.closest('.input, .checkbox');

	if (wrapper) {
		wrapper.classList.toggle('is-error', isError);
	}
}

export default function feedbackFormInit() {
	document.querySelectorAll('.js-feedback-form').forEach((form) => {
		const fields = [...form.querySelectorAll('.input__field, .checkbox__input')];

		fields.forEach((field) => {
			const eventName = field.type === 'checkbox' ? 'change' : 'input';

			field.addEventListener(eventName, () => setError(field, false));
		});

		form.addEventListener('submit', (event) => {
			const invalid = fields.filter((field) => {
				const isError = !isFieldValid(field);

				setError(field, isError);

				return isError;
			});

			if (invalid.length) {
				event.preventDefault();
				invalid[0].focus();
			}
		});

		const fileInput = form.querySelector('.js-feedback-file');
		const fileText = form.querySelector('.js-feedback-file-text');

		if (fileInput && fileText) {
			fileInput.addEventListener('change', () => {
				const names = [...fileInput.files].map((file) => file.name);

				fileText.textContent = names.length ? names.join(', ') : fileText.dataset.empty;
			});
		}
	});
}
