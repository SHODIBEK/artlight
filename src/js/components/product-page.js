import Swiper from 'swiper';

/**
* Страница товара: слайдер фото (свайп, миниатюры), «в избранное» / «поделиться», счётчики «- 1 +»,
* отметка модификаций (подсветка строки и число в «Добавить отмеченные N»).
* «Сбросить все» — form reset (варианты возвращаются к выбранным по умолчанию).
*/
function galleryInit() {
	document.querySelectorAll('.js-product-page-gallery').forEach((gallery) => {
		const thumbs = [...gallery.querySelectorAll('.js-product-page-thumb')];

		const setActive = (index) => {
			thumbs.forEach((thumb, i) => {
				thumb.classList.toggle('is-active', i === index);
				if (i === index) {
					thumb.setAttribute('aria-current', 'true');
				} else {
					thumb.removeAttribute('aria-current');
				}
			});
		};

		const slider = new Swiper(gallery.querySelector('.js-product-page-slider'), {
			speed: 600,
			grabCursor: true,
			resistanceRatio: 0.6,
			on: {
				slideChange: (swiper) => setActive(swiper.activeIndex),
			},
		});

		// фото кроме первого — lazy: скрытые слайды догружаем при первом касании галереи, чтобы не мелькали при свайпе
		const preload = () => {
			gallery.querySelectorAll('img[loading="lazy"]').forEach((image) => {
				image.loading = 'eager';
			});
		};

		['pointerenter', 'touchstart', 'focusin'].forEach((type) => {
			gallery.addEventListener(type, preload, {
				once: true,
				passive: true,
			});
		});

		thumbs.forEach((thumb, index) => {
			thumb.addEventListener('click', () => slider.slideTo(index));
		});
	});
}

function actionsInit() {
	document.querySelectorAll('.js-product-favorite').forEach((button) => {
		button.addEventListener('click', () => {
			const isActive = button.classList.toggle('is-active');

			button.setAttribute('aria-pressed', String(isActive));
		});
	});

	document.querySelectorAll('.js-product-share').forEach((button) => {
		button.addEventListener('click', () => {
			const data = {
				title: document.title,
				url: location.href,
			};

			if (navigator.share) {
				navigator.share(data).catch(() => {});
			} else if (navigator.clipboard) {
				navigator.clipboard.writeText(data.url).catch(() => {});
			}
		});
	});
}

function countersInit() {
	document.querySelectorAll('.js-product-counter').forEach((counter) => {
		const value = counter.querySelector('.js-product-counter-value');
		const minus = counter.querySelector('.js-product-counter-minus');

		const update = (step) => {
			const count = Math.max(1, Number(value.textContent) + step);

			value.textContent = count;
			minus.disabled = count <= 1;
		};

		minus.addEventListener('click', () => update(-1));
		counter.querySelector('.js-product-counter-plus').addEventListener('click', () => update(1));
		update(0);
	});
}

function modificationsInit() {
	document.querySelectorAll('.js-product-mods').forEach((root) => {
		const rows = root.querySelectorAll('.js-product-mods-row');
		const count = root.querySelector('.js-product-mods-count');
		const add = root.querySelector('.js-product-mods-add');

		const update = () => {
			let checked = 0;

			rows.forEach((row) => {
				const isChecked = row.querySelector('.js-product-mods-check input').checked;

				row.classList.toggle('is-checked', isChecked);
				checked += Number(isChecked);
			});

			count.textContent = checked;
			add.disabled = !checked;
		};

		root.addEventListener('change', update);
		update();

		// «Показать еще N» — раскрывает скрытые строки, повторно — «Свернуть» (отметки сохраняются)
		const more = root.querySelector('.js-product-mods-more');
		const extra = root.querySelectorAll('.js-product-mods-extra');

		if (more) {
			more.addEventListener('click', () => {
				const isOpen = more.getAttribute('aria-expanded') === 'true';

				extra.forEach((row) => {
					row.hidden = isOpen;
				});
				more.setAttribute('aria-expanded', String(!isOpen));
				more.textContent = isOpen ? more.dataset.label : more.dataset.less;

				if (isOpen && root.getBoundingClientRect().top < 0) {
					root.scrollIntoView({behavior: 'smooth'});
				}
			});
		}
	});
}

// «Напишите нам» — плавно к форме заявки внизу страницы
function questionInit() {
	document.querySelectorAll('.js-product-question').forEach((link) => {
		link.addEventListener('click', (event) => {
			const target = document.querySelector(link.hash);

			if (target) {
				event.preventDefault();
				target.scrollIntoView({behavior: 'smooth'});
				history.replaceState(null, '', link.hash);
			}
		});
	});
}

export default function productPageInit() {
	questionInit();
	galleryInit();
	actionsInit();
	countersInit();
	modificationsInit();
}
