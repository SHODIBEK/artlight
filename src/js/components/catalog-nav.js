/**
* Табы-якоря каталога: прокрутка к разделу и подсветка таба раздела, который сейчас на экране.
* Пока на экране разделы каталога, табы зафиксированы под шапкой (is-fixed; место держит .js-catalog-nav-holder),
* после последнего раздела уезжают под шапку (is-away). Отступ под шапку и табы — scroll-margin-top у разделов.
*/
export default function catalogNavInit() {
	const nav = document.querySelector('.js-catalog-nav');

	if (!nav) {
		return;
	}

	const holder = document.querySelector('.js-catalog-nav-holder');
	const bar = document.querySelector('.js-catalog-nav-bar');
	const header = document.querySelector('.js-header');
	const tabs = [...nav.querySelectorAll('.js-catalog-nav-tab')];
	const sections = tabs.map((tab) => document.getElementById(tab.dataset.target));

	let currentTab = null;
	let clickedTab = null; // пока страница едет к разделу по клику — подсвечен он, промежуточные не мигают
	let clickTimer = 0;

	// активный таб — в видимую часть полосы. Без плавности: плавная прокрутка полосы
	// во время плавной прокрутки страницы на мобильных обрывает прокрутку страницы
	const revealTab = (tab) => {
		if (!bar.classList.contains('is-fixed') || nav.scrollWidth <= nav.clientWidth) {
			return;
		}

		const padding = parseFloat(getComputedStyle(nav).paddingLeft) || 0;

		nav.scrollLeft = tab.offsetLeft - nav.offsetLeft - padding;
	};

	const setActive = (activeTab) => {
		if (activeTab === currentTab) {
			return;
		}

		currentTab = activeTab;
		revealTab(activeTab);

		tabs.forEach((tab) => {
			const isActive = tab === activeTab;

			tab.classList.toggle('is-active', isActive);
			tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});
	};

	const releaseClick = () => {
		clickedTab = null;
		window.clearTimeout(clickTimer);
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			const section = sections[index];

			if (!section) {
				return;
			}

			// scrollTo вместо scrollIntoView: тот прокручивает и полосу табов, а старый Safari — без плавности.
			// Отступ — как scroll-margin-top раздела (шапка + табы + 20)
			const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;

			clickedTab = tab;
			window.clearTimeout(clickTimer);
			clickTimer = window.setTimeout(releaseClick, 1500); // если scrollend не придёт
			setActive(tab);
			window.scrollTo({top: section.getBoundingClientRect().top + window.scrollY - margin,
				behavior: 'smooth'});
		});
	});

	window.addEventListener('scrollend', releaseClick);

	// касание или колесо — прокрутку ведёт пользователь, подсветка снова по разделам
	['touchstart', 'wheel'].forEach((type) => window.addEventListener(type, releaseClick, {passive: true}));

	const updateFixed = () => {
		const top = header ? header.offsetHeight : 0;
		const lastSection = sections[sections.length - 1];
		const isFixed = holder.getBoundingClientRect().top < top;
		const isAway = isFixed && lastSection && lastSection.getBoundingClientRect().bottom < top + bar.offsetHeight;

		// место под табы — их высота в обычном состоянии, замеренная перед фиксацией
		if (isFixed && !bar.classList.contains('is-fixed')) {
			holder.style.height = `${bar.offsetHeight}px`;
		} else if (!isFixed && bar.classList.contains('is-fixed')) {
			holder.style.height = '';
		}

		bar.classList.toggle('is-fixed', isFixed);
		bar.classList.toggle('is-away', isAway);
	};

	// активный — последний раздел, верх которого поднялся выше трети экрана
	let ticking = false;

	const update = () => {
		ticking = false;

		updateFixed();

		if (clickedTab) {
			return;
		}

		const line = window.innerHeight / 3;
		let active = tabs[0];

		sections.forEach((section, index) => {
			if (section && section.getBoundingClientRect().top <= line) {
				active = tabs[index];
			}
		});

		setActive(active);
	};

	const requestUpdate = () => {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(update);
		}
	};

	window.addEventListener('scroll', requestUpdate, {passive: true});

	// resize на мобильных приходит и при скрытии адресной строки — пересчёт только при смене ширины
	let width = window.innerWidth;

	window.addEventListener('resize', () => {
		if (window.innerWidth === width) {
			return;
		}

		width = window.innerWidth;

		// высоту места замеряем заново: табы могли перестроиться в другое число строк
		if (bar.classList.contains('is-fixed')) {
			bar.classList.remove('is-fixed');
			holder.style.height = `${bar.offsetHeight}px`;
			bar.classList.add('is-fixed');
		}

		requestUpdate();
	});

	update();
}
