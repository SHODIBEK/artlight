/**
* «Оформление запроса»: «Скрыть / Показать список товаров», вкладки доставки (скрытые — fieldset disabled,
* их поля не отправляются; выбранная — в скрытом поле delivery), «Другие города РФ»: адрес — только при
* «Доставке до адреса».
*/
export default function checkoutInit() {
	const form = document.querySelector('.js-checkout');

	if (!form) {
		return;
	}

	const toggle = form.querySelector('.js-checkout-toggle');
	const list = form.querySelector('.js-cart-list');

	if (toggle && list) {
		const text = toggle.querySelector('.js-checkout-toggle-text');

		toggle.addEventListener('click', () => {
			const isOpen = toggle.getAttribute('aria-expanded') === 'true';

			toggle.setAttribute('aria-expanded', String(!isOpen));
			text.textContent = isOpen ? toggle.dataset.show : toggle.dataset.hide;
			list.classList.toggle('is-collapsed', isOpen);
		});
	}

	const delivery = form.querySelector('.js-checkout-delivery');

	if (delivery) {
		const tabs = [...delivery.querySelectorAll('.js-checkout-tab')];
		const panels = [...delivery.querySelectorAll('[data-panel]')];
		const value = delivery.querySelector('.js-checkout-delivery-value');

		tabs.forEach((tab) => {
			tab.addEventListener('click', () => {
				const id = tab.dataset.tab;

				tabs.forEach((item) => {
					const isActive = item === tab;

					item.classList.toggle('is-active', isActive);
					item.setAttribute('aria-pressed', String(isActive));
				});

				panels.forEach((panel) => {
					const isActive = panel.dataset.panel === id;

					panel.hidden = !isActive;
					panel.disabled = !isActive;
				});

				value.value = id;
			});
		});
	}

	const address = form.querySelector('.js-checkout-address');

	if (address) {
		form.querySelectorAll('.js-checkout-method input').forEach((input) => {
			input.addEventListener('change', () => {
				address.hidden = input.value !== 'address';
			});
		});
	}
}
