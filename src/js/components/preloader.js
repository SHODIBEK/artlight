/**
* Прелоадер главной: держится 3 с после загрузки страницы (window load), затем плавно исчезает
* (переход в _preloader.scss) и удаляется. Пока виден — прокрутка страницы заблокирована.
*/
const DELAY = 3000;
const FADE = 1200; // длительность исчезновения — как transition в _preloader.scss
const FALLBACK = 10000; // если load не наступит (зависший ресурс) — скрыть всё равно

export default function preloaderInit() {
	const preloader = document.querySelector('.js-preloader');

	if (!preloader) {
		return;
	}

	const html = document.documentElement;
	let isDone = false;

	html.classList.add('is-lock-scroll');

	const hide = () => {
		if (isDone) {
			return;
		}

		isDone = true;
		html.classList.remove('is-lock-scroll');
		preloader.classList.add('is-hidden');
		preloader.addEventListener('transitionend', () => preloader.remove(), {once: true});
		window.setTimeout(() => preloader.remove(), FADE + 300); // transitionend не приходит во фоновой вкладке
	};

	const schedule = () => window.setTimeout(hide, DELAY);

	if (document.readyState === 'complete') {
		schedule();
	} else {
		window.addEventListener('load', schedule, {once: true});
	}

	window.setTimeout(hide, FALLBACK);
}
