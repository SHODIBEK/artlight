import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';

/**
* Попапы: кнопка/ссылка с data-modal="<id>" открывает .js-modal[data-modal-id="<id>"].
* Закрытие — крестик (.js-modal-close), клик по затемнению, Esc. Открытое мобильное меню закрывается.
* Фокус переносится в окно и возвращается на кнопку после закрытия.
*/
export default function modalInit() {
	const modals = document.querySelectorAll('.js-modal');

	if (!modals.length) {
		return;
	}

	let current = null;
	let opener = null;

	const close = () => {
		if (!current) {
			return;
		}

		current.classList.remove('is-open');
		current.setAttribute('aria-hidden', 'true');
		enableBodyScroll(current);
		current = null;

		if (opener) {
			opener.focus({preventScroll: true});
			opener = null;
		}
	};

	const open = (modal, trigger) => {
		close();

		const menu = document.querySelector('.js-mobile-menu.is-open');

		if (menu) {
			menu.querySelector('.js-mobile-menu-close').click();
		}

		current = modal;
		opener = trigger;
		modal.scrollTop = 0;
		modal.classList.add('is-open');
		modal.setAttribute('aria-hidden', 'false');
		disableBodyScroll(modal, {reserveScrollBarGap: true});
		modal.querySelector('.modal__dialog').focus({preventScroll: true});
	};

	document.addEventListener('click', (event) => {
		const trigger = event.target.closest('[data-modal]');

		if (!trigger) {
			return;
		}

		const modal = document.querySelector(`.js-modal[data-modal-id="${trigger.dataset.modal}"]`);

		if (modal) {
			event.preventDefault();
			open(modal, trigger);
		}
	});

	modals.forEach((modal) => {
		modal.querySelector('.modal__dialog').setAttribute('tabindex', '-1');

		modal.addEventListener('click', (event) => {
			// клик по затемнению (вне окна) или по крестику
			if (event.target === modal || event.target.closest('.js-modal-close')) {
				close();
			}
		});
	});

	document.addEventListener('keydown', (event) => {
		// Esc в открытом списке стран телефона закрывает только список
		const inCountryList = event.target instanceof Element && event.target.closest('.iti__dropdown-content');

		if (event.key === 'Escape' && current && !inCountryList) {
			close();
		}
	});
}
