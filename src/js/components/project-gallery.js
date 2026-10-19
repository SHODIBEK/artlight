import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';

/**
* Галерея страницы проекта: большое фото + бесконечная лента (стрелки, свайп).
* Моб. — по одному фото на всю ширину, ≥ 768 — фото 431 по центру, соседние по краям (как в макете).
* Клик по фото ленты показывает его в большом (плавная смена).
* Для loop со slidesPerView: 'auto' недостающие слайды добавляем копиями всего набора.
*/
const MIN_SLIDES = 10;
const START_SLIDE = 2; // в макете по центру ленты 3-е фото

export default function projectGalleryInit() {
	document.querySelectorAll('.js-project-gallery').forEach((gallery) => {
		const element = gallery.querySelector('.js-project-gallery-slider');
		const photo = gallery.querySelector('.js-project-gallery-photo');
		const wrapper = element.querySelector('.swiper-wrapper');
		const slides = [...wrapper.children];

		if (slides.length) {
			while (wrapper.children.length < MIN_SLIDES) {
				slides.forEach((slide) => wrapper.append(slide.cloneNode(true)));
			}
		}

		// eslint-disable-next-line no-new
		new Swiper(element, {
			modules: [Navigation],
			slidesPerView: 1,
			spaceBetween: 0,
			centeredSlides: true,
			initialSlide: START_SLIDE,
			loop: true,
			speed: 600,
			grabCursor: true,
			navigation: {
				prevEl: gallery.querySelector('.js-project-gallery-prev'),
				nextEl: gallery.querySelector('.js-project-gallery-next'),
			},
			breakpoints: {
				768: {
					slidesPerView: 'auto',
					spaceBetween: 20,
				},
			},
		});

		let timer = null;

		element.addEventListener('click', (event) => {
			const thumb = event.target.closest('[data-src]');

			if (!thumb || photo.getAttribute('src') === thumb.dataset.src) {
				return;
			}

			clearTimeout(timer);
			photo.classList.add('is-changing');
			timer = setTimeout(() => {
				photo.onload = () => photo.classList.remove('is-changing');
				photo.src = thumb.dataset.src;
			}, 300);
		});
	});
}
