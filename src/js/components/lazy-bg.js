/**
* Ленивые фоновые фото (CSS background): класс is-bg-loaded ставится, когда блок .js-lazy-bg
* подходит к экрану (за 600px) — до этого фото не скачивается. Без IntersectionObserver — сразу.
*/
export default function lazyBgInit() {
	const elements = document.querySelectorAll('.js-lazy-bg');

	if (!('IntersectionObserver' in window)) {
		elements.forEach((element) => element.classList.add('is-bg-loaded'));

		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-bg-loaded');
				observer.unobserve(entry.target);
			}
		});
	}, {rootMargin: '600px 0px'});

	elements.forEach((element) => observer.observe(element));
}
