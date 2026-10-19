/**
* Типы проектов («Реализованные проекты»): табы на странице (≥ 768) и в панели «Выбрать тип проекта» (моб.).
* Выбранный тип — is-active / aria-pressed у всех кнопок с тем же data-value.
*/
export default function projectTypesInit() {
	const buttons = document.querySelectorAll('.js-project-type');

	if (!buttons.length) {
		return;
	}

	document.addEventListener('click', (event) => {
		const button = event.target.closest('.js-project-type');

		if (!button) {
			return;
		}

		buttons.forEach((item) => {
			const isActive = item.dataset.value === button.dataset.value;

			item.classList.toggle('is-active', isActive);
			item.setAttribute('aria-pressed', String(isActive));
		});
	});
}
