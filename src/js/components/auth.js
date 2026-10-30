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

export default function authInit() {
	document.querySelectorAll('.js-auth').forEach((root) => tabsInit(root, '.js-auth-tab'));
	passwordsInit();
}
