/**
* Выбор периода (.js-date-range — панель выпадающего списка «Дата» в ЛК «Заказы»): календарь, моб. 1 месяц, ≥ 768 — 2.
* 1-й клик — начало, 2-й — конец (раньше начала — меняются местами), до 2-го клика период подсвечивается под мышью.
* Будущие дни недоступны, дальше текущего месяца не листается (стрелка «вперёд» — disabled).
*
* Подключение (бэкенд): панель внутри form method="get" (фильтры заказов). «Применить» — даты (ГГГГ-ММ-ДД) в скрытые
* поля date_from / date_to и отправка формы: страница открывается заново с ?date_from=…&date_to=… (один день —
* обе даты одинаковые). Без выбора поля не отправляются (disabled) — фильтра нет. Бэкенд фильтрует заказы и
* подставляет полученные даты в value скрытых полей — календарь и подпись плашки восстанавливаются из них
* (если value пустые — из адреса страницы, для вёрстки). Без формы — только событие daterange:change на панели
* (detail: {from, to} — Date или null). «Сбросить» очищает выбор (применяется по «Применить»).
*/
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const TABLET = window.matchMedia('(min-width: 768px)');
const KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

const pad = (number) => String(number).padStart(2, '0');
const toKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toLabel = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
const fromKey = (key) => {
	const [year, month, day] = key.split('-').map(Number);

	return new Date(year, month - 1, day);
};
const monthStart = (date, shift = 0) => new Date(date.getFullYear(), date.getMonth() + shift, 1);

function dateRangeItem(panel) {
	const months = panel.querySelector('.js-date-range-months');
	const inputFrom = panel.querySelector('.js-date-range-from');
	const inputTo = panel.querySelector('.js-date-range-to');
	const dropdown = panel.closest('.js-dropdown');
	const toggle = dropdown.querySelector('.js-dropdown-toggle');
	const value = dropdown.querySelector('.js-dropdown-value');
	const prev = panel.querySelector('.js-date-range-prev');
	const next = panel.querySelector('.js-date-range-next');
	const form = panel.closest('form');
	const today = new Date();
	const todayKey = toKey(today);
	const lastMonth = monthStart(today);

	let start = null;
	let end = null;
	let hover = null;
	let view = lastMonth;

	const count = () => {
		return TABLET.matches ? 2 : 1;
	};

	// первый показанный месяц: последний показанный — не позже текущего
	const clampView = (date) => {
		const max = monthStart(lastMonth, 1 - count());

		return date > max ? max : date;
	};

	const monthHtml = (first) => {
		const year = first.getFullYear();
		const month = first.getMonth();
		const offset = (first.getDay() + 6) % 7; // неделя с понедельника
		const days = new Date(year, month + 1, 0).getDate();
		let cells = '';

		for (let i = 0; i < offset; i++) {
			cells += '<span class="date-range__day date-range__day--empty"></span>';
		}

		for (let day = 1; day <= days; day++) {
			const key = toKey(new Date(year, month, day));
			const attrs = (key === todayKey ? ' aria-current="date"' : '') + (key > todayKey ? ' disabled' : '');

			cells += `<button class="date-range__day" type="button" data-date="${key}"${attrs}>${day}</button>`;
		}

		return `<div class="date-range__month">
			<p class="date-range__title">${MONTHS[month]} ${year}</p>
			<div class="date-range__grid">
				${WEEKDAYS.map((name) => `<span class="date-range__weekday">${name}</span>`).join('')}
				${cells}
			</div>
		</div>`;
	};

	// подсветка периода: начало, конец, дни между (до 2-го клика — до дня под мышью)
	const paint = () => {
		const from = start && toKey(start);
		const to = end ? toKey(end) : hover;
		const [min, max] = from && to && to < from ? [to, from] : [from, to];

		months.querySelectorAll('.date-range__day[data-date]').forEach((day) => {
			const key = day.dataset.date;

			day.classList.toggle('is-start', key === min);
			day.classList.toggle('is-end', Boolean(max) && key === max);
			day.classList.toggle('is-in-range', Boolean(min && max) && key > min && key < max);
			day.setAttribute('aria-pressed', String(key === min || key === max));
		});
	};

	const render = () => {
		let html = '';

		view = clampView(view);

		for (let i = 0; i < count(); i++) {
			html += monthHtml(monthStart(view, i));
		}

		months.innerHTML = html;
		next.disabled = monthStart(view, count() - 1) >= lastMonth;
		paint();
	};

	const shift = (step) => {
		view = monthStart(view, step);
		render();
	};

	prev.addEventListener('click', () => shift(-1));
	next.addEventListener('click', () => shift(1));

	months.addEventListener('click', (event) => {
		const day = event.target.closest('.date-range__day[data-date]');

		if (!day) {
			return;
		}

		const date = fromKey(day.dataset.date);

		if (!start || end) {
			start = date;
			end = null;
		} else if (date < start) {
			end = start;
			start = date;
		} else {
			end = date;
		}

		hover = null;
		paint();
	});

	months.addEventListener('mouseover', (event) => {
		const day = event.target.closest('.date-range__day[data-date]');

		if (start && !end && day) {
			hover = day.dataset.date;
			paint();
		}
	});

	// выбранный период → скрытые поля и подпись плашки (без выбора поля disabled — не уходят в запрос)
	const fill = () => {
		const to = end || start;

		inputFrom.value = start ? toKey(start) : '';
		inputTo.value = to ? toKey(to) : '';
		inputFrom.disabled = !start;
		inputTo.disabled = !start;
		value.textContent = start ? `${toLabel(start)} — ${toLabel(to)}` : panel.dataset.placeholder;
		toggle.classList.toggle('is-selected', Boolean(start));
	};

	panel.querySelector('.js-date-range-apply').addEventListener('click', () => {
		fill();

		const detail = {
			from: start,
			to: end || start,
		};

		panel.dispatchEvent(new CustomEvent('daterange:change', {
			bubbles: true,
			detail,
		}));

		if (form) {
			form.submit();

			return;
		}

		toggle.click(); // закрыть панель — через dropdown.js
		toggle.focus();
	});

	panel.querySelector('.js-date-range-reset').addEventListener('click', () => {
		start = null;
		end = null;
		hover = null;
		paint();
	});

	// начальный период — из value полей (бэкенд), иначе из адреса страницы
	const params = new URLSearchParams(window.location.search);
	const initialFrom = inputFrom.value || params.get(inputFrom.name) || '';
	const initialTo = inputTo.value || params.get(inputTo.name) || initialFrom;

	if (KEY_RE.test(initialFrom) && KEY_RE.test(initialTo)) {
		[start, end] = [fromKey(initialFrom), fromKey(initialTo)].sort((a, b) => a - b);
		view = monthStart(end, 1 - count());
	} else {
		view = monthStart(lastMonth, 1 - count());
	}

	fill();
	TABLET.addEventListener('change', render);
	render();
}

export default function dateRangeInit() {
	document.querySelectorAll('.js-date-range').forEach(dateRangeItem);
}
