import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';

/**
* Фильтры списка товаров (lights.html).
* - Панели .js-panel[data-panel-id]: «Все фильтры» (filters) и сайдбар < 1280 «Все категории» (categories);
*   открываются кнопками [data-open-panel="<id>"], закрываются .js-panel-close, кликом по затемнению, Escape.
* - Экраны панели фильтров: плашка .js-filter-screen-open → экран [data-screen], .js-filter-screen-back — назад.
* - Чекбоксы фильтра есть и в выпадающем списке (десктоп), и в панели: одинаковые name/value отмечаются вместе;
*   плашки фильтра (.js-filter-chip) показывают «Название: N» и выделены (is-selected), крестик сбрасывает фильтр.
* - «Сбросить фильтры» (.js-filters-reset, ≥ 1280) — сброс всех фильтров и переключателей.
* - Переключатели «Хиты продаж» / «Распродажа» (.js-listing-toggle) — aria-pressed.
*/
export default function filtersInit() {
	const panels = document.querySelectorAll('.js-panel');

	if (!panels.length) {
		return;
	}

	const desktop = window.matchMedia('(min-width: 1280px)');
	let current = null;
	let opener = null;

	const showScreen = (panel, id) => {
		panel.querySelectorAll('[data-screen]').forEach((screen) => {
			screen.classList.toggle('is-active', screen.dataset.screen === id);
		});

		const dialog = panel.querySelector('.filter-panel__dialog');

		if (dialog) {
			dialog.scrollTop = 0;
		}
	};

	const close = () => {
		if (!current) {
			return;
		}

		current.classList.remove('is-open');
		current.setAttribute('aria-hidden', 'true');
		enableBodyScroll(current.querySelector('.filter-panel__dialog') || current);
		current = null;

		if (opener) {
			opener.focus({preventScroll: true});
			opener = null;
		}
	};

	const open = (panel, trigger) => {
		close();
		current = panel;
		opener = trigger;
		showScreen(panel, 'main');
		panel.classList.add('is-open');
		panel.setAttribute('aria-hidden', 'false');
		disableBodyScroll(panel.querySelector('.filter-panel__dialog') || panel, {reserveScrollBarGap: true});
	};

	// сайдбар на десктопе — обычная колонка: открытые панели «Все категории» / меню кабинета закрываются
	desktop.addEventListener('change', () => {
		if (desktop.matches && current && ['categories', 'account-menu'].includes(current.dataset.panelId)) {
			close();
		}
	});

	const inputsOf = (filter) => document.querySelectorAll(`[data-filter="${filter}"] .checkbox__input`);

	const updateChips = (filter) => {
		const values = new Set();

		inputsOf(filter).forEach((input) => {
			if (input.checked) {
				values.add(input.value);
			}
		});

		document.querySelectorAll(`.js-filter-chip[data-filter="${filter}"]`).forEach((chip) => {
			const label = chip.querySelector('.js-filter-label');

			chip.classList.toggle('is-selected', values.size > 0);
			label.textContent = values.size ? `${label.dataset.name}: ${values.size}` : label.dataset.name;
		});
	};

	const resetFilter = (filter) => {
		inputsOf(filter).forEach((input) => {
			input.checked = false;
		});
		updateChips(filter);
	};

	document.addEventListener('change', (event) => {
		const input = event.target;
		const holder = input.closest('.filter-options__checkbox');

		if (!holder) {
			return;
		}

		const {filter} = holder.dataset;

		inputsOf(filter).forEach((item) => {
			if (item.value === input.value) {
				item.checked = input.checked;
			}
		});
		updateChips(filter);
	});

	document.addEventListener('click', (event) => {
		const trigger = event.target.closest('[data-open-panel]');

		if (trigger) {
			const panel = document.querySelector(`.js-panel[data-panel-id="${trigger.dataset.openPanel}"]`);

			if (panel) {
				event.preventDefault();
				open(panel, trigger);
			}

			return;
		}

		// «Сбросить фильтры» в тулбаре: все фильтры и переключатели «Хиты» / «Распродажа»
		if (event.target.closest('.js-filters-reset')) {
			document.querySelectorAll('.listing-toolbar .js-filter-chip').forEach((chip) => resetFilter(chip.dataset.filter));
			document.querySelectorAll('.js-listing-toggle').forEach((item) => item.setAttribute('aria-pressed', 'false'));

			return;
		}

		const toggle = event.target.closest('.js-listing-toggle');

		if (toggle) {
			toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));

			return;
		}

		if (!current) {
			return;
		}

		// крестик выбранной плашки — сброс фильтра, не переход на экран
		const reset = event.target.closest('.js-filter-reset');

		if (reset) {
			resetFilter(reset.closest('.js-filter-chip').dataset.filter);

			return;
		}

		if (event.target.closest('.js-filter-reset-all')) {
			current.querySelectorAll('.js-filter-chip').forEach((chip) => resetFilter(chip.dataset.filter));

			return;
		}

		const screenOpen = event.target.closest('.js-filter-screen-open');

		if (screenOpen) {
			showScreen(current, screenOpen.dataset.screenTarget);

			return;
		}

		if (event.target.closest('.js-filter-screen-back')) {
			showScreen(current, 'main');

			return;
		}

		if (event.target.closest('.js-panel-close') || event.target === current) {
			close();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && current) {
			close();
		}
	});
}
