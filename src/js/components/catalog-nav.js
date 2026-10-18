/**
* Табы-якоря каталога: прокрутка к разделу и подсветка таба раздела, который сейчас на экране.
* Отступ под фиксированную шапку — scroll-margin-top у разделов (_catalog.scss).
*/
export default function catalogNavInit() {
	const nav = document.querySelector('.js-catalog-nav');

	if (!nav) {
		return;
	}

	const tabs = [...nav.querySelectorAll('.js-catalog-nav-tab')];
	const sections = tabs.map((tab) => document.getElementById(tab.dataset.target));

	const setActive = (activeTab) => {
		tabs.forEach((tab) => {
			const isActive = tab === activeTab;

			tab.classList.toggle('is-active', isActive);
			tab.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});
	};

	const scrollOptions = {
		behavior: 'smooth',
		block: 'start',
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			if (sections[index]) {
				sections[index].scrollIntoView(scrollOptions);
			}
		});
	});

	// активный — последний раздел, верх которого уже ушёл под шапку (+ треть экрана)
	let ticking = false;

	const update = () => {
		ticking = false;

		const line = window.innerHeight / 3;
		let active = tabs[0];

		sections.forEach((section, index) => {
			if (section && section.getBoundingClientRect().top <= line) {
				active = tabs[index];
			}
		});

		setActive(active);
	};

	window.addEventListener('scroll', () => {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(update);
		}
	}, {passive: true});
}
