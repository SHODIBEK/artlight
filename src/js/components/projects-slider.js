import Swiper from 'swiper';

/**
* Слайдер «Реализованные проекты»: бесконечный, свайп (навигации в макете нет), карточки фиксированной ширины.
* Для loop со slidesPerView: 'auto' Swiper нужно слайдов заметно больше, чем видно на экране
* (на 1728 видно ~4.5 из 5) — недостающие добавляем копиями всего набора.
*/
const MIN_SLIDES = 12;

export default function projectsSliderInit() {
	document.querySelectorAll('.js-projects-slider').forEach((element) => {
		const wrapper = element.querySelector('.swiper-wrapper');
		const slides = [...wrapper.children];

		if (slides.length) {
			while (wrapper.children.length < MIN_SLIDES) {
				slides.forEach((slide) => wrapper.append(slide.cloneNode(true)));
			}
		}

		// eslint-disable-next-line no-new
		new Swiper(element, {
			slidesPerView: 'auto',
			spaceBetween: 16,
			loop: true,
			speed: 600,
			grabCursor: true,
			breakpoints: {
				768: {
					spaceBetween: 20,
				},
			},
		});
	});
}
