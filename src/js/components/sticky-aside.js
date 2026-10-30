/**
* Боковое меню списка товаров (≥ 1280) — «двусторонний sticky», как на brandshop.ru: меню выше экрана
* при прокрутке вниз едет со страницей, пока не покажется его низ, и останавливается; при прокрутке вверх —
* едет, пока не покажется верх (под шапкой). Меню ниже экрана просто залипает под шапкой.
* CSS — position: sticky у .js-sticky-aside, здесь только top: от «низ у края экрана» до «верх под шапкой».
*/
const GAP = 20;
const media = window.matchMedia('(min-width: 1280px)');

export default function stickyAsideInit() {
	document.querySelectorAll('.js-sticky-aside').forEach((aside) => {
		let top = null;
		let lastY = window.scrollY;

		const update = () => {
			const y = window.scrollY;
			const delta = y - lastY;

			lastY = y;

			if (!media.matches) {
				aside.style.top = '';
				top = null;

				return;
			}

			const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
			const maxTop = header + GAP;
			const minTop = Math.min(maxTop, window.innerHeight - aside.offsetHeight - GAP);

			top = Math.max(minTop, Math.min(maxTop, (top === null ? maxTop : top) - delta));
			aside.style.top = `${top}px`;
		};

		update();
		window.addEventListener('scroll', update, {passive: true});
		window.addEventListener('resize', update);
		media.addEventListener('change', update);

		// высота меняется — раскрыли/свернули группу
		if ('ResizeObserver' in window) {
			new ResizeObserver(update).observe(aside);
		}
	});
}
