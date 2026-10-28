import Swiper from 'swiper';

/**
* Страница новости.
* Лента фото: бесконечная, свайп (навигации в макете нет); центр — 2-е фото слайдера, сам слайдер сдвинут
* на полшага влево (_news.scss), так что по центру экрана — зазор между 2-м и 3-м фото, как в макете.
* Для loop со slidesPerView: 'auto' недостающие слайды добавляем копиями всего набора.
* «Похожие новости»: карточки фиксированной ширины (моб. 320, шаг 16; ≥ 768 — шаг 20).
*/
const MIN_SLIDES = 10;

export default function newsSlidersInit() {
	document.querySelectorAll('.js-news-gallery').forEach((element) => {
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
			spaceBetween: 20,
			centeredSlides: true,
			initialSlide: 1,
			loop: true,
			speed: 600,
			grabCursor: true,
		});
	});

	document.querySelectorAll('.js-news-similar').forEach((element) => {
		// eslint-disable-next-line no-new
		new Swiper(element, {
			slidesPerView: 'auto',
			spaceBetween: 16,
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
