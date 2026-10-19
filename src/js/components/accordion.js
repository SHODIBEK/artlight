/**
* Аккордеон (вопрос/ответ, группы сайдбара списка товаров): .js-accordion-toggle переключает is-open
* у ближайшего .js-accordion-item. Высота анимируется в CSS (grid-template-rows 0fr → 1fr у .js-accordion-body).
* .js-accordion[data-accordion-single] — открыт только один пункт: при открытии остальные закрываются.
*/
export default function accordionInit() {
	document.addEventListener('click', (event) => {
		const toggle = event.target.closest('.js-accordion-toggle');

		if (!toggle) {
			return;
		}

		const item = toggle.closest('.js-accordion-item');
		const isOpen = item.classList.toggle('is-open');
		const accordion = item.closest('.js-accordion');

		toggle.setAttribute('aria-expanded', String(isOpen));

		if (isOpen && accordion && accordion.hasAttribute('data-accordion-single')) {
			[...accordion.querySelectorAll(':scope > .js-accordion-item.is-open')].forEach((other) => {
				if (other !== item) {
					other.classList.remove('is-open');
					other.querySelector('.js-accordion-toggle').setAttribute('aria-expanded', 'false');
				}
			});
		}
	});
}
