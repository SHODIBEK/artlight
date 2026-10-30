/**
* Профиль личного кабинета: данные — просто текст (пустые — прочерк из data-empty в placeholder, пароли скрыты);
* «Редактировать данные» открывает поля (data-editable, .is-editing — линии, поля пароля) и меняется на
* «Сохранить изменения» (иконка сохранения); сохранение — проверка совпадения паролей, затем отправка формы на action
* (action="#" — без запроса, снова просмотр). Контрагенты: «Удалить» убирает строку.
*/
function setEditing(form, isEditing) {
	const button = form.querySelector('.js-profile-edit');

	form.classList.toggle('is-editing', isEditing);
	form.querySelectorAll('[data-editable]').forEach((field) => {
		if (field.tagName === 'SELECT') {
			field.disabled = !isEditing;
		} else {
			field.readOnly = !isEditing;
			field.placeholder = isEditing ? ' ' : field.dataset.empty;
		}
	});
	button.querySelector('.js-profile-edit-label').textContent = isEditing ? button.dataset.save : button.dataset.edit;
}

function profileFormInit(form) {
	const button = form.querySelector('.js-profile-edit');
	const error = form.querySelector('.js-profile-error');
	const password = form.querySelector('[name="password"]');
	const confirm = form.querySelector('[name="password_confirm"]');
	const confirmField = confirm.closest('.profile-field');

	const passwordsMatch = () => {
		const isMatch = password.value === confirm.value;

		confirmField.classList.toggle('is-error', !isMatch);
		error.hidden = isMatch;

		return isMatch;
	};

	confirm.addEventListener('input', () => {
		if (confirmField.classList.contains('is-error')) {
			passwordsMatch();
		}
	});

	button.addEventListener('click', () => {
		if (!form.classList.contains('is-editing')) {
			setEditing(form, true);
			form.querySelector('[data-editable]').focus();

			return;
		}

		if (!passwordsMatch()) {
			confirm.focus();

			return;
		}

		if (form.getAttribute('action') !== '#') {
			form.submit();

			return;
		}

		password.value = '';
		confirm.value = '';
		setEditing(form, false);
	});
}

export default function profileInit() {
	document.querySelectorAll('.js-profile-form').forEach(profileFormInit);

	document.querySelectorAll('.js-counterparty-remove').forEach((button) => {
		button.addEventListener('click', () => button.closest('[role="row"]').remove());
	});
}
