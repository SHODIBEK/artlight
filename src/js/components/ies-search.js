/**
* «IES/LDT файлы»: поиск по списку файлов — скрывает пункты, в названии которых нет запроса.
*/
export default function iesSearchInit() {
	const root = document.querySelector('.js-ies');

	if (!root) {
		return;
	}

	const form = root.querySelector('.js-ies-search');
	const field = form && form.querySelector('input');
	const items = root.querySelectorAll('.js-ies-item');
	const empty = root.querySelector('.js-ies-empty');

	if (!field) {
		return;
	}

	const filter = () => {
		const query = field.value.trim().toLowerCase();
		let found = 0;

		items.forEach((item) => {
			const isMatch = !query || item.dataset.name.includes(query);

			item.hidden = !isMatch;
			found += isMatch ? 1 : 0;
		});

		if (empty) {
			empty.hidden = found > 0;
		}
	};

	field.addEventListener('input', filter);
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		filter();
	});
}
