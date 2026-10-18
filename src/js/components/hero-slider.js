import Swiper from 'swiper';
import {Autoplay, EffectFade} from 'swiper/modules';

/**
* Слайдер первого экрана: затухание, свайп (навигации в макете нет), автопрокрутка
*/
export default function heroSliderInit() {
	document.querySelectorAll('.js-hero-slider').forEach((element) => {
		const slidesCount = element.querySelectorAll('.swiper-slide').length;

		// eslint-disable-next-line no-new
		new Swiper(element, {
			modules: [Autoplay, EffectFade],
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			speed: 800,
			// loop в Swiper 11 не работает с двумя слайдами — после последнего возвращаемся к первому
			rewind: true,
			grabCursor: true,
			autoplay: slidesCount > 1 ? {
				delay: 6000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			} : false,
		});
	});
}
