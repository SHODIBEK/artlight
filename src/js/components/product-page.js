import Swiper from 'swiper';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
import {Navigation, Pagination} from 'swiper/modules';

/**
* Лайтбокс: клик по большому фото (не протягивание — событие click Swiper) открывает его на весь экран.
* Стрелки, ← → на клавиатуре, свайп; закрытие — крестик, клик мимо фото, Esc. При закрытии слайдер встаёт на то же фото.
*/
function lightboxInit(gallery, slider) {
	const lightbox = gallery.querySelector('.js-lightbox');

	if (!lightbox) {
		return;
	}

	const image = lightbox.querySelector('.js-lightbox-image');
	const counter = lightbox.querySelector('.js-lightbox-counter');
	const sources = [...gallery.querySelectorAll('.js-product-page-slider .product-page__image')]
		.sort((a, b) => a.closest('[data-swiper-slide-index]').dataset.swiperSlideIndex - b.closest('[data-swiper-slide-index]').dataset.swiperSlideIndex)
		.map((item) => item.getAttribute('src'));
	let current = 0;
	let opener = null;

	const show = (index) => {
		current = (index + sources.length) % sources.length;
		image.src = sources[current];

		if (counter) {
			counter.textContent = `${current + 1} / ${sources.length}`;
		}
	};

	const open = (index) => {
		opener = document.activeElement;
		show(index);
		lightbox.classList.add('is-open');
		lightbox.setAttribute('aria-hidden', 'false');
		disableBodyScroll(lightbox, {reserveScrollBarGap: true});
		lightbox.focus({preventScroll: true});
	};

	const close = () => {
		if (!lightbox.classList.contains('is-open')) {
			return;
		}

		lightbox.classList.remove('is-open');
		lightbox.setAttribute('aria-hidden', 'true');
		enableBodyScroll(lightbox);
		slider.slideToLoop(current, 0);

		if (opener && opener.focus) {
			opener.focus({preventScroll: true});
		}
	};

	slider.on('click', (swiper) => {
		const slide = swiper.clickedSlide;

		if (slide) {
			open(Number(slide.dataset.swiperSlideIndex) || 0);
		}
	});

	lightbox.querySelector('.js-lightbox-close').addEventListener('click', close);
	lightbox.querySelector('.js-lightbox-prev')?.addEventListener('click', () => show(current - 1));
	lightbox.querySelector('.js-lightbox-next')?.addEventListener('click', () => show(current + 1));

	// клик мимо фото и кнопок — закрыть
	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox || event.target.classList.contains('js-lightbox-stage')) {
			close();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (!lightbox.classList.contains('is-open')) {
			return;
		}

		if (event.key === 'Escape') {
			close();
		} else if (event.key === 'ArrowLeft' && sources.length > 1) {
			show(current - 1);
		} else if (event.key === 'ArrowRight' && sources.length > 1) {
			show(current + 1);
		}
	});

	// свайп по фото
	let startX = null;

	lightbox.addEventListener('pointerdown', (event) => {
		startX = event.clientX;
	});

	lightbox.addEventListener('pointerup', (event) => {
		if (startX === null || sources.length < 2) {
			return;
		}

		const delta = event.clientX - startX;

		startX = null;

		if (Math.abs(delta) > 50) {
			show(current + (delta < 0 ? 1 : -1));
		}
	});
}

/**
* Страница товара: слайдер фото (по кругу, свайп, миниатюры), «в избранное» / «поделиться», счётчики «- 1 +»,
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
			modules: [Navigation, Pagination],
			speed: 600,
			loop: true,
			navigation: {
				prevEl: gallery.querySelector('.js-product-page-prev'),
				nextEl: gallery.querySelector('.js-product-page-next'),
			},
			pagination: {
				el: gallery.querySelector('.js-product-page-bullets'),
				clickable: true,
				bulletElement: 'button',
				bulletClass: 'product-page__bullet',
				bulletActiveClass: 'is-active',
			},
			resistanceRatio: 0.6,
			on: {
				slideChange: (swiper) => setActive(swiper.realIndex),
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
			thumb.addEventListener('click', () => slider.slideToLoop(index));
		});

		lightboxInit(gallery, slider);
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
