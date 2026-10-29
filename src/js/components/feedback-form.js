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

// отправка формы; кнопка отправки заблокирована, пока ждём ответ
function send(form) {
	const action = form.getAttribute('action');

	if (!action || action === '#') {
		return Promise.resolve();
	}

	const submit = form.querySelector('[type="submit"]');

	if (submit) {
		submit.disabled = true;
	}

	return fetch(action, {
		method: form.getAttribute('method') || 'POST',
		body: new FormData(form),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
		})
		.finally(() => {
			if (submit) {
				submit.disabled = false;
			}
		});
}

export default function feedbackFormInit() {
	document.querySelectorAll('.js-feedback-form').forEach((form) => {
		// data-validate — какие поля проверять («Оформление запроса»: без чекбоксов товаров и резерва)
		const fields = [...form.querySelectorAll(form.dataset.validate || '.input__field, .checkbox__input')];

		fields.forEach((field) => {
			const eventName = field.type === 'checkbox' ? 'change' : 'input';

			field.addEventListener(eventName, () => setError(field, false));
		});

		const fileInput = form.querySelector('.js-feedback-file');
		const fileText = form.querySelector('.js-feedback-file-text');

		form.addEventListener('submit', (event) => {
			const invalid = fields.filter((field) => {
				// поля скрытой вкладки (fieldset disabled) не отправляются — не проверяем
				const isError = !field.disabled && !isFieldValid(field);

				setError(field, isError);

				return isError;
			});

			if (invalid.length) {
				event.preventDefault();
				invalid[0].focus();

				return;
			}

			// data-success — id попапа «Успешная отправка»: форма уходит fetch'ем на action (POST, FormData),
			// при ответе 2xx очищается и открывается попап; action="#" (вёрстка) — без запроса, сразу попап
			if (form.dataset.success) {
				event.preventDefault();
				send(form).then(() => {
					form.reset();

					if (fileText) {
						fileText.textContent = fileText.dataset.empty;
					}

					document.dispatchEvent(new CustomEvent('modal:open', {detail: {id: form.dataset.success}}));
				}).catch((error) => {
					// eslint-disable-next-line no-console
					console.error('Форма не отправлена:', error);
				});
			}
		});

		if (fileInput && fileText) {
			fileInput.addEventListener('change', () => {
				const names = [...fileInput.files].map((file) => file.name);

				fileText.textContent = names.length ? names.join(', ') : fileText.dataset.empty;
			});
		}
	});
}
