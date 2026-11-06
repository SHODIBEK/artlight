import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

/**
* Фото-слайдеры статьи «Освещение отелей».
* .js-photo-slider — по одному фото, по кругу: свайп, стрелки по краям, точки (текущая — полоса accent).
* .js-photo-strip — бесконечная лента: по центру 3-е фото, стрелки (≥ 768) в зазорах между фото.
* Для loop со slidesPerView: 'auto' недостающие слайды добавляем копиями всего набора.
*/
const MIN_SLIDES = 10;
const STRIP_START = 2;

export default function photoSliderInit() {
	document.querySelectorAll('.js-photo-slider').forEach((slider) => {
		const element = slider.querySelector('.swiper');
		const isSingle = element.querySelectorAll('.swiper-slide').length < 2;

		// eslint-disable-next-line no-new
		new Swiper(element, {
			modules: [Navigation, Pagination],
			slidesPerView: 1,
			loop: !isSingle,
			speed: 600,
			grabCursor: !isSingle,
			navigation: {
				prevEl: slider.querySelector('.js-photo-slider-prev'),
				nextEl: slider.querySelector('.js-photo-slider-next'),
			},
			pagination: {
				el: slider.querySelector('.js-photo-slider-dots'),
				clickable: true,
				bulletElement: 'button',
				bulletClass: 'photo-slider__dot',
				bulletActiveClass: 'is-active',
			},
		});
	});

	document.querySelectorAll('.js-photo-strip').forEach((strip) => {
		const element = strip.querySelector('.swiper');
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
			slidesPerView: 'auto',
			spaceBetween: 20,
			centeredSlides: true,
			initialSlide: STRIP_START,
			loop: true,
			speed: 600,
			grabCursor: true,
			navigation: {
				prevEl: strip.querySelector('.js-photo-strip-prev'),
				nextEl: strip.querySelector('.js-photo-strip-next'),
			},
		});
	});
}
