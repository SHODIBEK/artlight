/**
* ЛК «Акты сверки и УПД»: вид документа (радио type) показывает свои поля (.js-documents-panel[data-panel]),
* у скрытых — disabled (не проверяются feedback-form.js и не отправляются). Сброс формы возвращает 1-й вид.
* Обязательная дата (скрытое поле data-required, «Счёт от») — проверка до feedback-form.js (submit в фазе захвата):
* не выбрана — плашка is-error, отправка останавливается.
*/
export default function accountDocumentsInit() {
	document.querySelectorAll('.js-documents').forEach((form) => {
		const radios = [...form.querySelectorAll('[name="type"]')];
		const panels = [...form.querySelectorAll('.js-documents-panel')];

		const sync = () => {
			const checked = radios.find((radio) => radio.checked);

			panels.forEach((panel) => {
				const isActive = panel.dataset.panel === checked.value;

				panel.hidden = !isActive;
				panel.querySelectorAll('input, select, textarea, button').forEach((field) => {
					field.disabled = !isActive;
				});
			});
		};

		const dates = [...form.querySelectorAll('[data-required]')];

		form.addEventListener('submit', (event) => {
			const invalid = dates.filter((date) => {
				const isError = !date.disabled && date.value === '';

				date.closest('.dropdown').querySelector('.input').classList.toggle('is-error', isError);

				return isError;
			});

			if (invalid.length) {
				event.preventDefault();
				event.stopImmediatePropagation();
				invalid[0].closest('.dropdown').querySelector('.js-dropdown-toggle').focus();
			}
		}, true);

		// выбрана дата — ошибка снимается
		dates.forEach((date) => {
			date.closest('.js-date-range').addEventListener('click', () => {
				requestAnimationFrame(() => {
					if (date.value) {
						date.closest('.dropdown').querySelector('.input').classList.remove('is-error');
					}
				});
			});
		});

		radios.forEach((radio) => radio.addEventListener('change', sync));
		// после reset радио ещё не сброшены — синхронизируем следующим кадром
		form.addEventListener('reset', () => requestAnimationFrame(sync));
		sync();
	});
}
