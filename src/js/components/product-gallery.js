/**
* Галерея карточки товара, точки внизу — текущее фото.
* Мышь: фото-блок делится на зоны по числу фото, при наведении на зону показывается её фото, при уходе — первое.
* Мобильные (< 768): свайп влево / вправо по фото листает фото (без зацикливания); вертикальная прокрутка
* страницы остаётся браузеру (touch-action: pan-y), клик по ссылке после свайпа гасится.
*/
const SWIPE_THRESHOLD = 30; // px по горизонтали, чтобы считать жест свайпом

export default function productGalleryInit() {
	const galleries = document.querySelectorAll('.js-product-gallery');

	if (!galleries.length) {
		return;
	}

	const hover = window.matchMedia('(hover: hover)');
	const mobile = window.matchMedia('(max-width: 767px)');

	const show = (gallery, index) => {
		if (gallery.dataset.index === String(index)) {
			return;
		}

		gallery.dataset.index = index;
		gallery.querySelectorAll('.product-card__frame').forEach((frame, i) => frame.classList.toggle('is-active', i === index));
		gallery.querySelectorAll('.product-card__dot').forEach((dot, i) => dot.classList.toggle('is-active', i === index));
	};

	galleries.forEach((gallery) => {
		const count = gallery.querySelectorAll('.product-card__frame').length;
		const card = gallery.closest('.product-card');
		const inSlider = Boolean(gallery.closest('.swiper'));
		let startX = 0;
		let startY = 0;
		let swiped = false;

		gallery.addEventListener('mousemove', (event) => {
			if (!hover.matches) {
				return;
			}

			const rect = gallery.getBoundingClientRect();
			const index = Math.min(count - 1, Math.floor((event.clientX - rect.left) / rect.width * count));

			show(gallery, Math.max(0, index));
		});

		gallery.addEventListener('mouseleave', () => {
			if (hover.matches) {
				show(gallery, 0);
			}
		});

		gallery.addEventListener('touchstart', (event) => {
			const touch = event.touches[0];

			startX = touch.clientX;
			startY = touch.clientY;
			swiped = false;
		}, {passive: true});

		gallery.addEventListener('touchend', (event) => {
			// в слайдере карточек свайп листает слайдер, а не фото
			if (!mobile.matches || inSlider) {
				return;
			}

			const touch = event.changedTouches[0];
			const dx = touch.clientX - startX;
			const dy = touch.clientY - startY;

			if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) {
				return;
			}

			const current = Number(gallery.dataset.index) || 0;
			const next = Math.min(count - 1, Math.max(0, current + (dx < 0 ? 1 : -1)));

			swiped = true;
			show(gallery, next);
		}, {passive: true});

		// после свайпа браузер может прислать click — не переходим по ссылке карточки
		card.addEventListener('click', (event) => {
			if (swiped) {
				event.preventDefault();
				swiped = false;
			}
		});
	});
}
