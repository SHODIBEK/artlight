import Swiper from 'swiper';

/**
* Слайдер карточек товаров («В проекте использовались»): свайп (навигации в макете нет), карточки фиксированной ширины.
*/
export default function productSliderInit() {
	document.querySelectorAll('.js-product-slider').forEach((element) => {
		// eslint-disable-next-line no-new
		new Swiper(element, {
			slidesPerView: 'auto',
			spaceBetween: 20,
			speed: 600,
			grabCursor: true,
		});
	});
}
