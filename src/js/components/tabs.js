/**
* Вкладки (role="tab" + панели role="tabpanel" по aria-controls): клик, стрелки ← →,
* хеш в адресе = data-tab (у 1-й вкладки — без хеша), переход по хешу открывает вкладку.
* data-crumbs у корня — селектор «крошек»: у не первой вкладки последний пункт становится ссылкой,
* а название вкладки добавляется текущим пунктом («Профиль / Контрагенты»);
* с data-crumbs-all — и у 1-й вкладки («Избранное / Все товары»).
*/
function crumbsInit(root, tabs) {
	const crumbs = root.dataset.crumbs && document.querySelector(root.dataset.crumbs);

	if (!crumbs) {
		return () => {};
	}

	const always = 'crumbsAll' in root.dataset;
	const base = crumbs.querySelector('.breadcrumbs__item:last-child');
	const current = base.querySelector('.breadcrumbs__current');
	const link = document.createElement('a');
	const tail = base.cloneNode(true);
	const tailCurrent = tail.querySelector('.breadcrumbs__current');

	link.className = 'breadcrumbs__link';
	link.href = location.pathname.split('/').pop() || '#';
	link.textContent = current.textContent;

	return (tab) => {
		const isFirst = tab === tabs[0] && !always;

		if (isFirst) {
			link.replaceWith(current);
			tail.remove();
		} else {
			current.replaceWith(link);
			tailCurrent.textContent = tab.textContent.trim();
			base.after(tail);
		}
	};
}

export function tabsInit(root, selector = '.js-tab') {
	const tabs = [...root.querySelectorAll(selector)];

	if (!tabs.length) {
		return;
	}

	const updateCrumbs = crumbsInit(root, tabs);

	const select = (tab) => {
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

		updateCrumbs(tab);
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			select(tab);
			history.replaceState(null, '', index ? `#${tab.dataset.tab}` : location.pathname + location.search);
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

		return tab;
	};

	// без хеша — крошки по активной вкладке (с data-crumbs-all у 1-й тоже есть название)
	if (!fromHash()) {
		updateCrumbs(tabs.find((item) => item.classList.contains('is-active')) || tabs[0]);
	}

	window.addEventListener('hashchange', fromHash);
}

export default function tabsAllInit() {
	document.querySelectorAll('.js-tabs').forEach((root) => tabsInit(root));
}
