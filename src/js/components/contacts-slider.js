import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';

/**
* «Контакты»: слайдер фото офиса — свайп и стрелки по краям, по кругу.
* Одно фото — без стрелок (Swiper скрывает их классом swiper-button-disabled).
*/
export default function contactsSliderInit() {
	document.querySelectorAll('.js-contacts-slider').forEach((slider) => {
		const element = slider.querySelector('.swiper');
		const isSingle = element.querySelectorAll('.swiper-slide').length < 2;

		// eslint-disable-next-line no-new
		new Swiper(element, {
			modules: [Navigation],
			slidesPerView: 1,
			loop: !isSingle,
			speed: 600,
			grabCursor: !isSingle,
			navigation: {
				prevEl: slider.querySelector('.js-contacts-slider-prev'),
				nextEl: slider.querySelector('.js-contacts-slider-next'),
			},
		});
	});
}
