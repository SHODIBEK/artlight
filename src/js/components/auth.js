/**
* «Вход и регистрация»: вкладки форм (#register в адресе — сразу регистрация, стрелки ← → между вкладками)
* и кнопки «показать / скрыть пароль» (и в профиле кабинета: поле — .js-password).
*/
import {tabsInit} from './tabs';

function passwordsInit() {
	document.querySelectorAll('.js-password-toggle').forEach((button) => {
		const field = button.closest('.js-password').querySelector('input');

		button.addEventListener('click', () => {
			const isShown = field.type === 'password';

			field.type = isShown ? 'text' : 'password';
			button.setAttribute('aria-pressed', String(isShown));
			button.setAttribute('aria-label', isShown ? button.dataset.hide : button.dataset.show);
		});
	});
}

// регистрация: Физическое / Юридическое лицо — у физ. лица поля компании скрыты и disabled (не проверяются и не уходят)
function personInit() {
	document.querySelectorAll('.js-auth-person').forEach((root) => {
		const form = root.closest('form');
		const toggle = root.querySelector('.js-auth-person-switch');
		const sides = root.querySelectorAll('.js-auth-person-side');
		const fields = form.querySelectorAll('.js-auth-legal');

		const update = () => {
			const isLegal = toggle.checked;

			sides.forEach((side) => side.classList.toggle('is-active', side.dataset.legal === 'true' === isLegal));
			fields.forEach((field) => {
				field.hidden = !isLegal;
				field.querySelectorAll('input, select, textarea').forEach((control) => {
					control.disabled = !isLegal;
				});
			});
		};

		toggle.addEventListener('change', update);
		sides.forEach((side) => side.addEventListener('click', () => {
			toggle.checked = side.dataset.legal === 'true';
			update();
		}));
		form.addEventListener('reset', () => setTimeout(update));
		update();
	});
}

export default function authInit() {
	personInit();
	document.querySelectorAll('.js-auth').forEach((root) => tabsInit(root, '.js-auth-tab'));
	passwordsInit();
}
