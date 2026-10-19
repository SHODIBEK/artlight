/**
* Выпадающие списки (.js-dropdown): .js-dropdown-toggle открывает/закрывает (is-open, aria-expanded).
* Закрытие — клик мимо, Escape, открытие другого списка. Вариант .js-dropdown-option (сортировка, количество)
* подставляется в .js-dropdown-value плашки и закрывает список.
* Панель открывается от левого края плашки; если не помещается в экран справа — от правого (is-flipped).
*/
export default function dropdownInit() {
	const dropdowns = document.querySelectorAll('.js-dropdown');

	if (!dropdowns.length) {
		return;
	}

	let current = null;

	const close = () => {
		if (!current) {
			return;
		}

		current.classList.remove('is-open');
		current.querySelector('.js-dropdown-toggle').setAttribute('aria-expanded', 'false');
		current = null;
	};

	// панель скрыта через visibility — размеры уже есть, меряем до показа
	const place = (dropdown) => {
		const panel = dropdown.querySelector('.dropdown__panel');
		const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter')) || 16;
		const viewport = document.documentElement.clientWidth;

		dropdown.classList.remove('is-flipped');

		if (panel.getBoundingClientRect().right > viewport - gutter) {
			dropdown.classList.add('is-flipped');

			if (panel.getBoundingClientRect().left < gutter) {
				dropdown.classList.remove('is-flipped');
			}
		}
	};

	const open = (dropdown) => {
		close();
		current = dropdown;
		place(dropdown);
		dropdown.classList.add('is-open');
		dropdown.querySelector('.js-dropdown-toggle').setAttribute('aria-expanded', 'true');
	};

	document.addEventListener('click', (event) => {
		const toggle = event.target.closest('.js-dropdown-toggle');

		if (toggle) {
			const dropdown = toggle.closest('.js-dropdown');

			if (dropdown === current) {
				close();
			} else {
				open(dropdown);
			}

			return;
		}

		const option = event.target.closest('.js-dropdown-option');

		if (option) {
			const dropdown = option.closest('.js-dropdown');

			dropdown.querySelectorAll('.js-dropdown-option').forEach((item) => item.classList.toggle('is-active', item === option));
			dropdown.querySelector('.js-dropdown-value').textContent = option.textContent;
			close();

			return;
		}

		if (current && !current.contains(event.target)) {
			close();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && current) {
			const toggle = current.querySelector('.js-dropdown-toggle');

			close();
			toggle.focus();
		}
	});
}
