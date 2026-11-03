/**
* Вкладки (role="tab" + панели role="tabpanel" по aria-controls): клик, стрелки ← →,
* хеш в адресе = data-tab (у 1-й вкладки — без хеша), переход по хешу открывает вкладку.
* data-crumbs у корня — селектор «крошек»: у не первой вкладки последний пункт становится ссылкой,
* а название вкладки добавляется текущим пунктом («Профиль / Контрагенты»);
* с data-crumbs-all — и у 1-й вкладки («Избранное / Все товары»).
*
* Вложенные экраны вкладки: в панели — блоки .js-tab-screen[data-screen] (список — data-screen="", виден по умолчанию).
* Хеш #<вкладка>/<экран> (#groups/lights, #counterparties/edit) открывает вкладку сразу на экране;
* ссылки на экран — обычные href="#groups/lights" (запись в истории — «назад» браузера вернёт к списку).
* data-screen-title — название экрана в крошках (вкладка становится ссылкой). .js-tab-back — «назад» к списку:
* если экран открыт со списка — history.back(), иначе адрес заменяется на хеш вкладки.
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
	const tailLink = link.cloneNode();
	const screenTail = base.cloneNode(true);

	link.className = 'breadcrumbs__link';
	tailLink.className = 'breadcrumbs__link';
	link.href = location.pathname.split('/').pop() || '#';
	link.textContent = current.textContent;

	return (tab, screenTitle) => {
		const isFirst = tab === tabs[0] && !always && !screenTitle;
		const label = tab.textContent.trim();

		if (isFirst) {
			link.replaceWith(current);
			tail.remove();
		} else {
			current.replaceWith(link);
			tailCurrent.textContent = label;
			base.after(tail);
		}

		if (screenTitle) {
			tailLink.textContent = label;
			tailLink.href = `#${tab.dataset.tab}`;
			tailCurrent.replaceWith(tailLink);
			screenTail.querySelector('.breadcrumbs__current').textContent = screenTitle;
			tail.after(screenTail);
		} else {
			tailLink.replaceWith(tailCurrent);
			screenTail.remove();
		}
	};
}

// экран панели по имени (нет такого — список); возвращает открытый экран или null, если экранов нет
function showScreen(panel, name) {
	const screens = panel ? [...panel.querySelectorAll('.js-tab-screen')] : [];
	const target = screens.find((screen) => screen.dataset.screen === name)
		|| screens.find((screen) => !screen.dataset.screen);

	screens.forEach((screen) => {
		screen.hidden = screen !== target;
	});

	return target || null;
}

export function tabsInit(root, selector = '.js-tab') {
	const tabs = [...root.querySelectorAll(selector)];

	if (!tabs.length) {
		return;
	}

	const updateCrumbs = crumbsInit(root, tabs);
	// экран открыт со списка этой страницы — «назад» к списку = шаг назад в истории
	let fromList = false;

	const select = (tab, screenName = '') => {
		let screen = null;

		tabs.forEach((item) => {
			const isActive = item === tab;
			const panel = document.getElementById(item.getAttribute('aria-controls'));

			item.classList.toggle('is-active', isActive);
			item.setAttribute('aria-selected', String(isActive));
			item.tabIndex = isActive ? 0 : -1;

			if (panel) {
				panel.hidden = !isActive;

				const shown = showScreen(panel, isActive ? screenName : '');

				if (isActive) {
					screen = shown;
				}
			}
		});

		updateCrumbs(tab, screen && screen.dataset.screen ? screen.dataset.screenTitle : '');

		return screen;
	};

	const tabHash = (tab) => {
		if (tab === tabs[0]) {
			return location.pathname + location.search;
		}

		return `#${tab.dataset.tab}`;
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			select(tab);
			fromList = false;
			history.replaceState(null, '', tabHash(tab));
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

	const parseHash = () => {
		const [id, screenName = ''] = decodeURIComponent(location.hash.slice(1)).split('/');

		return {
			tab: tabs.find((item) => item.dataset.tab === id),
			screenName,
		};
	};

	const fromHash = () => {
		const {tab, screenName} = parseHash();

		if (tab) {
			select(tab, screenName);
		}

		return tab;
	};

	// без хеша — крошки по активной вкладке (с data-crumbs-all у 1-й тоже есть название)
	if (!fromHash()) {
		updateCrumbs(tabs.find((item) => item.classList.contains('is-active')) || tabs[0], '');
	}

	window.addEventListener('hashchange', (event) => {
		const prev = new URL(event.oldURL).hash.slice(1);
		const {tab, screenName} = parseHash();

		fromList = Boolean(tab && screenName && !prev.includes('/'));
		fromHash();
	});

	root.addEventListener('click', (event) => {
		const back = event.target.closest('.js-tab-back');

		if (!back) {
			return;
		}

		event.preventDefault();

		if (fromList) {
			history.back();

			return;
		}

		const {tab} = parseHash();

		if (tab) {
			select(tab);
			history.replaceState(null, '', tabHash(tab));
		}
	});
}

export default function tabsAllInit() {
	document.querySelectorAll('.js-tabs').forEach((root) => tabsInit(root));
}
