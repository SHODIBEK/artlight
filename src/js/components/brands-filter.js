/**
* «Продукция других производителей»: табы видов продукции фильтруют логотипы брендов.
* Активный таб — project-types.js; бренд с data-type="all" (подборки) виден всегда.
*/
export default function brandsFilterInit() {
	const tabs = document.querySelectorAll('.js-brands-type');
	const items = document.querySelectorAll('.js-brands-item');

	if (!tabs.length || !items.length) {
		return;
	}

	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			const type = tab.dataset.value;

			items.forEach((item) => {
				item.hidden = type !== 'all' && item.dataset.type !== 'all' && item.dataset.type !== type;
			});
		});
	});
}
