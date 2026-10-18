import Swiper from 'swiper';
import {Autoplay} from 'swiper/modules';

/**
* Лента логотипов «Наши клиенты»: бесконечная, свайп (навигации в макете нет), автопрокрутка
*/
export default function clientsSliderInit() {
	document.querySelectorAll('.js-clients-slider').forEach((element) => {
		// eslint-disable-next-line no-new
		new Swiper(element, {
			modules: [Autoplay],
			slidesPerView: 'auto',
			spaceBetween: 56,
			loop: true,
			speed: 800,
			grabCursor: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			},
		});
	});
}
