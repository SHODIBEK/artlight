/**
* Кружок обязательного поля (.input__mark — прозрачная копия плейсхолдера + кружок): ставит копию точно на текст
* плейсхолдера — левый край и шрифт поля (у телефона отступ под флаг задаёт intl-tel-input), у textarea — верх;
* текст — плейсхолдер поля (телефон: пример номера страны меняется — следим за атрибутами), у select — пустой пункт.
*/
function sync(mark, field, text) {
	const block = mark.parentElement;
	const style = getComputedStyle(field);
	const fieldBox = field.getBoundingClientRect();
	const blockBox = block.getBoundingClientRect();

	mark.style.left = `${fieldBox.left - blockBox.left + parseFloat(style.paddingLeft)}px`;
	mark.style.fontSize = style.fontSize;
	mark.style.fontFamily = style.fontFamily;
	mark.style.letterSpacing = style.letterSpacing;

	if (field.tagName === 'TEXTAREA') {
		mark.style.top = `${fieldBox.top - blockBox.top + parseFloat(style.paddingTop)}px`;
	}

	if (field.tagName === 'SELECT') {
		const empty = field.querySelector('option[value=""]');

		text.textContent = empty ? empty.textContent : '';
	} else {
		text.textContent = field.placeholder;
	}
}

export default function inputMarkInit(root = document) {
	root.querySelectorAll('.input__mark').forEach((mark) => {
		const field = mark.parentElement.querySelector('.input__field');
		const text = mark.querySelector('.input__mark-text');

		if (!field || !text) {
			return;
		}

		const update = () => sync(mark, field, text);

		update();
		new MutationObserver(update).observe(field, {attributes: true,
			attributeFilter: ['placeholder', 'style']});
		new ResizeObserver(update).observe(mark.parentElement);
		document.fonts.ready.then(update);
	});
}
