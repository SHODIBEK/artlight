/**
* Плавающие кнопки: «Написать» раскрывает кнопки мессенджеров и меняется на крестик.
* Закрытие — повторным нажатием, кликом мимо или Escape
*/
export default function floatActionsInit() {
	const root = document.querySelector('.js-float-actions');

	if (!root) {
		return;
	}

	const toggle = root.querySelector('.js-float-actions-toggle');
	const messengers = root.querySelector('.float-actions__messengers');
	const links = [...messengers.querySelectorAll('a')];

	const setOpen = (state) => {
		root.classList.toggle('is-open', state);
		toggle.setAttribute('aria-expanded', String(state));
		toggle.setAttribute('aria-label', state ? 'Закрыть' : 'Написать');
		messengers.setAttribute('aria-hidden', String(!state));
		links.forEach((link) => link.setAttribute('tabindex', state ? '0' : '-1'));
	};

	toggle.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));

	document.addEventListener('click', (event) => {
		if (root.classList.contains('is-open') && !root.contains(event.target)) {
			setOpen(false);
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && root.classList.contains('is-open')) {
			setOpen(false);
			toggle.focus();
		}
	});
}
