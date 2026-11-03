/**
* Профиль личного кабинета: данные — просто текст (пустые — прочерк из data-empty в placeholder, пароли скрыты);
* «Редактировать данные» открывает поля (data-editable, .is-editing — линии, поля пароля) и меняется на
* «Сохранить изменения» (иконка сохранения); сохранение — проверка совпадения паролей, затем отправка формы на action
* (action="#" — без запроса, снова просмотр). Таблицы «Контрагенты» / «Контактные лица»: «Удалить» убирает строку;
* «Редактировать» подставляет значения строки в форму экрана #<вкладка>/edit (ячейка → поле по data-field),
* «Добавить…» очищает форму #<вкладка>/new (экраны — tabs.js); после сохранения (form:sent от feedback-form.js)
* строка обновляется / добавляется и форма возвращается к таблице.
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

function clearErrors(form) {
	form.querySelectorAll('.profile-field.is-error').forEach((field) => field.classList.remove('is-error'));
}

function profileListInit(table) {
	const panel = table.closest('[role="tabpanel"]');
	const template = panel.querySelector('.js-profile-row');
	const forms = {};
	// строка, открытая на редактирование (прямой заход по #<вкладка>/edit — первая, форма заполнена в разметке)
	let current = table.querySelector('[role="row"]:not(.profile-table__row--head)');

	panel.querySelectorAll('.js-profile-record').forEach((form) => {
		forms[form.dataset.mode] = form;
	});

	// ячейки строки с полем формы (data-field — имя поля)
	const cells = (row) => [...row.querySelectorAll('[data-field]')];
	const field = (form, cell) => form.elements[cell.dataset.field];

	table.addEventListener('click', (event) => {
		const remove = event.target.closest('.js-profile-remove');
		const edit = event.target.closest('.js-profile-edit');

		if (remove) {
			remove.closest('[role="row"]').remove();
		}

		if (edit && forms.edit) {
			current = edit.closest('[role="row"]');
			forms.edit.reset();
			clearErrors(forms.edit);
			cells(current).forEach((cell) => {
				field(forms.edit, cell).value = cell.textContent;
			});

			// поля без колонки (у адреса — «Литера») — из сохранённых в строке значений
			Object.entries(JSON.parse(current.dataset.values || '{}')).forEach(([name, value]) => {
				forms.edit.elements[name].value = value;
			});
		}
	});

	panel.querySelectorAll('.js-profile-add').forEach((link) => {
		link.addEventListener('click', () => {
			if (forms.new) {
				forms.new.reset();
				clearErrors(forms.new);
			}
		});
	});

	panel.addEventListener('form:sent', (event) => {
		const form = event.target;
		let row = current;

		if (form.dataset.mode === 'new') {
			row = template.content.firstElementChild.cloneNode(true);
			table.append(row);
		}

		if (row) {
			const values = {};

			form.querySelectorAll('.profile-field__control').forEach((control) => {
				values[control.name] = control.value.trim();
			});
			row.dataset.values = JSON.stringify(values);
			cells(row).forEach((cell) => {
				cell.textContent = values[cell.dataset.field];
			});
			row.querySelectorAll('[data-label]').forEach((action) => {
				action.setAttribute('aria-label', `${action.dataset.label} ${cells(row)[0].textContent}`);
			});
		}

		if (form.dataset.mode === 'new') {
			form.reset();
		}

		form.querySelector('.js-tab-back').click();
	});
}

export default function profileInit() {
	document.querySelectorAll('.js-profile-form').forEach(profileFormInit);
	document.querySelectorAll('.js-profile-list').forEach(profileListInit);
}
