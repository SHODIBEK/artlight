/**
* Лента логотипов «Наши клиенты» — бегущая строка: едет влево с постоянной скоростью без остановок,
* пауза при наведении, можно протянуть мышью / пальцем. Набор логотипов копируется, пока лента
* не станет шире двух экранов, и сдвиг зацикливается на ширину одного набора.
*/
const SPEED = 50; // px в секунду

export default function clientsSliderInit() {
	document.querySelectorAll('.js-clients-slider').forEach((element) => {
		const track = element.querySelector('.clients__track');
		const slides = [...track.children];

		if (!slides.length) {
			return;
		}

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let setWidth = 0;
		let offset = 0;
		let lastTime = 0;
		let isHover = false;
		let drag = null;

		// ширина одного набора — по позиции первой копии (с учётом отступов между логотипами);
		// копий — пока лента не шире набора + двух экранов (хватает на сдвиг на целый набор)
		const addCopies = () => {
			slides.forEach((slide) => {
				const copy = slide.cloneNode(true);

				copy.classList.add('clients__slide--copy');
				copy.setAttribute('aria-hidden', 'true');
				track.append(copy);
			});
		};

		const measure = () => {
			track.querySelectorAll('.clients__slide--copy').forEach((copy) => copy.remove());
			addCopies();
			setWidth = track.children[slides.length].offsetLeft - slides[0].offsetLeft;

			while (track.scrollWidth < setWidth + window.innerWidth * 2) {
				addCopies();
			}
		};

		const render = () => {
			offset = (offset % setWidth + setWidth) % setWidth;
			track.style.transform = `translate3d(${-offset}px, 0, 0)`;
		};

		const tick = (time) => {
			const delta = lastTime ? Math.min(time - lastTime, 100) : 0;

			lastTime = time;

			if (!isHover && !drag && !reducedMotion.matches) {
				offset += SPEED * delta / 1000;
				render();
			}

			window.requestAnimationFrame(tick);
		};

		// пауза — только под мышью (на тач-экранах mouseenter остаётся после тапа)
		element.addEventListener('pointerenter', (event) => {
			isHover = event.pointerType === 'mouse';
		});

		element.addEventListener('pointerleave', () => {
			isHover = false;
		});

		element.addEventListener('pointerdown', (event) => {
			drag = {
				x: event.clientX,
				offset,
			};
			element.classList.add('is-dragging');
			element.setPointerCapture(event.pointerId);
		});

		element.addEventListener('pointermove', (event) => {
			if (drag) {
				offset = drag.offset - (event.clientX - drag.x);
				render();
			}
		});

		const stopDrag = () => {
			drag = null;
			element.classList.remove('is-dragging');
		};

		element.addEventListener('pointerup', stopDrag);
		element.addEventListener('pointercancel', stopDrag);

		measure();
		render();
		window.addEventListener('resize', () => {
			measure();
			render();
		});
		window.requestAnimationFrame(tick);
	});
}
