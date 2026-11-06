/**
* Типы проектов («Реализованные проекты»): табы на странице (≥ 768) и в панели «Выбрать тип проекта» (моб.);
* рубрики «Блога» — те же табы.
* Выбранный тип — is-active / aria-pressed у всех кнопок с тем же data-value.
* Подтипы (projects-sub.html): ряд .js-project-subtypes[data-type] виден у выбранного типа,
* в ряду выбран один подтип (.js-project-subtype).
*/
function setActive(buttons, value) {
	buttons.forEach((item) => {
		const isActive = item.dataset.value === value;

		item.classList.toggle('is-active', isActive);
		item.setAttribute('aria-pressed', String(isActive));
	});
}

export default function projectTypesInit() {
	const buttons = document.querySelectorAll('.js-project-type');
	const subtypeRows = document.querySelectorAll('.js-project-subtypes');

	if (!buttons.length) {
		return;
	}

	document.addEventListener('click', (event) => {
		const subtype = event.target.closest('.js-project-subtype');

		if (subtype) {
			setActive(subtype.closest('.js-project-subtypes').querySelectorAll('.js-project-subtype'), subtype.dataset.value);

			return;
		}

		const button = event.target.closest('.js-project-type');

		if (!button) {
			return;
		}

		setActive(buttons, button.dataset.value);

		subtypeRows.forEach((row) => {
			row.hidden = row.dataset.type !== button.dataset.value;
		});
	});
}
