import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';

/**
* Мобильное меню: открытие/закрытие, переход по подменю
*/
function mobileMenuInit() {
	const menu = document.querySelector('.js-mobile-menu');

	if (!menu) {
		return;
	}

	const body = menu.querySelector('.mobile-menu__body');
	const openButtons = document.querySelectorAll('.js-mobile-menu-open');
	const panels = menu.querySelectorAll('.js-mobile-menu-panel');

	const resetPanels = () => {
		panels.forEach((panel) => {
			if (panel.dataset.panel !== 'main') {
				panel.classList.remove('is-active');
				panel.setAttribute('aria-hidden', 'true');
			}
		});
	};

	const open = () => {
		menu.classList.add('is-open');
		menu.setAttribute('aria-hidden', 'false');
		openButtons.forEach((button) => button.setAttribute('aria-expanded', 'true'));
		disableBodyScroll(body, {reserveScrollBarGap: true});
	};

	const close = () => {
		menu.classList.remove('is-open');
		menu.setAttribute('aria-hidden', 'true');
		openButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
		enableBodyScroll(body);
		setTimeout(resetPanels, 300);
	};

	openButtons.forEach((button) => button.addEventListener('click', open));

	menu.addEventListener('click', (event) => {
		const next = event.target.closest('.js-mobile-menu-next');
		const back = event.target.closest('.js-mobile-menu-back');

		if (event.target.closest('.js-mobile-menu-close')) {
			close();
		} else if (next) {
			const panel = menu.querySelector(`[data-panel="${next.dataset.target}"]`);

			if (panel) {
				panel.scrollTop = 0;
				panel.classList.add('is-active');
				panel.setAttribute('aria-hidden', 'false');
			}
		} else if (back) {
			const panel = back.closest('.js-mobile-menu-panel');

			panel.classList.remove('is-active');
			panel.setAttribute('aria-hidden', 'true');
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menu.classList.contains('is-open')) {
			close();
		}
	});

	// при переходе на десктопную шапку меню закрывается
	window.matchMedia('(min-width: 1280px)').addEventListener('change', (event) => {
		if (event.matches && menu.classList.contains('is-open')) {
			close();
		}
	});
}

/**
* Мобильный поиск — раскрывается под шапкой
*/
function headerSearchInit() {
	const header = document.querySelector('.js-header');
	const toggle = document.querySelector('.js-header-search-toggle');

	if (!header || !toggle) {
		return;
	}

	toggle.addEventListener('click', () => {
		const isOpen = header.classList.toggle('is-search-open');

		toggle.setAttribute('aria-expanded', String(isOpen));

		if (isOpen) {
			header.querySelector('.search__field').focus();
		}
	});
}

/**
* Выпадающее меню «Еще»: открытие по клику (тач, клавиатура), ховер — в CSS
*/
function headerMoreInit() {
	document.querySelectorAll('.header__menu-item--more').forEach((item) => {
		const button = item.querySelector('.header__more');

		const setOpen = (state) => {
			item.classList.toggle('is-open', state);
			button.setAttribute('aria-expanded', String(state));
		};

		button.addEventListener('click', () => setOpen(!item.classList.contains('is-open')));

		document.addEventListener('click', (event) => {
			if (!item.contains(event.target)) {
				setOpen(false);
			}
		});

		item.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				setOpen(false);
				button.focus();
			}
		});
	});
}

export default function headerInit() {
	mobileMenuInit();
	headerSearchInit();
	headerMoreInit();
}
