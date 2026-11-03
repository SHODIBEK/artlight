/**
* Корзина: количество (− / +), удаление товара и выбранных, «Выбрать все» (частичный выбор — indeterminate),
* «Итого» — по выбранным товарам: товаров, сумма, скидка (data-discount у .js-cart-summary, %), сумма с учётом
* скидки. Пустая корзина — сообщение со ссылкой в каталог.
* Те же товары на «Оформлении запроса» (без панели «Выбрать все» и кнопки «Оформить»; .js-cart-filled — скрыть,
* когда корзина пуста).
*/
const formatNumber = (value, cents) => value.toLocaleString('ru-RU', {
	minimumFractionDigits: cents ? 2 : 0,
	maximumFractionDigits: cents ? 2 : 0,
}).replace(/\s/g, ' ');
const formatMoney = (value) => `${formatNumber(value)} ₽`;

export default function cartInit() {
	const cart = document.querySelector('.js-cart');

	if (!cart) {
		return;
	}

	const list = cart.querySelector('.js-cart-list');
	const allInput = cart.querySelector('.js-cart-all .checkbox__input');
	const totalCount = cart.querySelector('.js-cart-total-count');
	const sumValue = cart.querySelector('.js-cart-sum');
	const discountValue = cart.querySelector('.js-cart-discount');
	const total = cart.querySelector('.js-cart-total');
	const order = cart.querySelector('.js-cart-order');
	const empty = cart.querySelector('.js-cart-empty');
	const toolbar = cart.querySelector('.cart__toolbar');
	const summary = cart.querySelector('.js-cart-summary');
	const discountPercent = Number(summary.dataset.discount) || 0;

	const getItems = () => [...list.querySelectorAll('.js-cart-item')];
	const getCheck = (item) => item.querySelector('.js-cart-check .checkbox__input');
	const getCount = (item) => Number(item.querySelector('.js-cart-count').textContent);

	const update = () => {
		const items = getItems();
		const selected = items.filter((item) => getCheck(item).checked);
		let count = 0;
		let sum = 0;

		items.forEach((item) => {
			const itemCount = getCount(item);
			const price = Number(item.dataset.price) * itemCount;

			item.querySelector('.js-cart-item-price').textContent = formatMoney(price);
			item.querySelector('.js-cart-minus').disabled = itemCount <= 1;

			if (getCheck(item).checked) {
				count += itemCount;
				sum += price;
			}
		});

		const discount = Math.round(sum * discountPercent) / 100;

		totalCount.textContent = count;
		sumValue.textContent = formatNumber(sum, true);
		discountValue.textContent = formatNumber(discount, true);
		total.textContent = formatNumber(sum - discount, true);
		if (order) {
			order.disabled = !selected.length;
		}

		if (allInput) {
			allInput.checked = items.length > 0 && selected.length === items.length;
			allInput.indeterminate = selected.length > 0 && selected.length < items.length;
		}

		const isEmpty = !items.length;

		empty.hidden = !isEmpty;
		[list, toolbar, summary, ...cart.querySelectorAll('.js-cart-filled')].forEach((el) => {
			if (el) {
				el.hidden = isEmpty;
			}
		});
	};

	// «Оформить» — на страницу оформления запроса
	if (order && order.dataset.href) {
		order.addEventListener('click', () => {
			window.location.href = order.dataset.href;
		});
	}

	cart.addEventListener('click', (event) => {
		const item = event.target.closest('.js-cart-item');

		if (event.target.closest('.js-cart-remove-selected')) {
			getItems().filter((el) => getCheck(el).checked).forEach((el) => el.remove());
			update();

			return;
		}

		if (!item) {
			return;
		}

		const counter = item.querySelector('.js-cart-count');

		if (event.target.closest('.js-cart-plus')) {
			counter.textContent = getCount(item) + 1;
			update();
		} else if (event.target.closest('.js-cart-minus')) {
			counter.textContent = Math.max(1, getCount(item) - 1);
			update();
		} else if (event.target.closest('.js-cart-remove')) {
			item.remove();
			update();
		} else if (event.target.closest('[aria-pressed]')) {
			const button = event.target.closest('[aria-pressed]');

			button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
		}
	});

	cart.addEventListener('change', (event) => {
		if (allInput && event.target === allInput) {
			getItems().forEach((item) => {
				getCheck(item).checked = allInput.checked;
			});
		}

		update();
	});

	update();
}
