/**
* Видео о компании (+videoPlayer — главная и «О компании»): без звука, по кругу.
* Запускается, когда блок на экране, и встаёт на паузу вне экрана
* (не грузит и не крутит видео зря). Клик по видео — пауза / продолжить; после паузы пользователем
* само не возобновляется. На паузе виден «play» (is-paused), «pause» — при наведении и 2 с после касания (is-hinted).
*/
const HINT_TIME = 2000;

export default function videoPlayerInit() {
	document.querySelectorAll('.js-video-player').forEach((player) => {
		const video = player.querySelector('.js-video-player-media');
		const toggle = player.querySelector('.js-video-player-toggle');

		if (!video || !toggle) {
			return;
		}

		let userPaused = false;
		let isVisible = false;
		let hintTimer = 0;

		video.muted = true; // атрибут muted Safari не всегда учитывает для автозапуска

		const updateState = () => {
			player.classList.toggle('is-paused', video.paused);
			toggle.setAttribute('aria-label', video.paused ? 'Воспроизвести видео' : 'Поставить видео на паузу');
		};

		const play = () => {
			const promise = video.play();

			// автозапуск запрещён (режим энергосбережения) — остаётся «play»
			if (promise) {
				promise.catch(updateState);
			}
		};

		video.addEventListener('play', updateState);
		video.addEventListener('pause', updateState);

		toggle.addEventListener('click', () => {
			if (video.paused) {
				userPaused = false;
				play();
			} else {
				userPaused = true;
				video.pause();
			}

			player.classList.add('is-hinted');
			window.clearTimeout(hintTimer);
			hintTimer = window.setTimeout(() => player.classList.remove('is-hinted'), HINT_TIME);
		});

		const observer = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting;

			if (isVisible && !userPaused) {
				play();
			} else if (!isVisible && !video.paused) {
				video.pause();
			}
		}, {threshold: 0.25});

		observer.observe(player);

		// вкладка снова активна — продолжаем, если видео на экране и не на паузе пользователя
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden && isVisible && !userPaused) {
				play();
			}
		});
	});
}
