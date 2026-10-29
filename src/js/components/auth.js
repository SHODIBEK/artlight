/**
* «Вход и регистрация»: вкладки форм (#register в адресе — сразу регистрация, стрелки ← → между вкладками)
* и кнопки «показать / скрыть пароль».
*/
function tabsInit(root) {
	const tabs = [...root.querySelectorAll('.js-auth-tab')];

	const select = (tab, focus) => {
		tabs.forEach((item) => {
			const isActive = item === tab;
			const panel = document.getElementById(item.getAttribute('aria-controls'));

			item.classList.toggle('is-active', isActive);
			item.setAttribute('aria-selected', String(isActive));
			item.tabIndex = isActive ? 0 : -1;

			if (panel) {
				panel.hidden = !isActive;
			}
		});

		if (focus) {
			tab.focus();
		}
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			select(tab);
			history.replaceState(null, '', tab.dataset.tab === 'register' ? '#register' : location.pathname + location.search);
		});

		tab.addEventListener('keydown', (event) => {
			const steps = {
				ArrowRight: 1,
				ArrowLeft: -1,
			};

			if (steps[event.key]) {
				const next = tabs[(index + steps[event.key] + tabs.length) % tabs.length];

				event.preventDefault();
				next.click();
				next.focus();
			}
		});
	});

	const fromHash = () => {
		const tab = tabs.find((item) => `#${item.dataset.tab}` === location.hash);

		if (tab) {
			select(tab);
		}
	};

	fromHash();
	window.addEventListener('hashchange', fromHash);
}

function passwordsInit(root) {
	root.querySelectorAll('.js-password-toggle').forEach((button) => {
		const field = button.closest('.input').querySelector('.input__field');

		button.addEventListener('click', () => {
			const isShown = field.type === 'password';

			field.type = isShown ? 'text' : 'password';
			button.setAttribute('aria-pressed', String(isShown));
			button.setAttribute('aria-label', isShown ? button.dataset.hide : button.dataset.show);
		});
	});
}

export default function authInit() {
	document.querySelectorAll('.js-auth').forEach((root) => {
		tabsInit(root);
		passwordsInit(root);
	});
}
