/**
* Выставляет состояние indeterminate чекбоксам с атрибутом data-indeterminate
* (в HTML это состояние задать нельзя)
*/
export default function checkboxInit() {
	document.querySelectorAll('.checkbox__input[data-indeterminate]').forEach((input) => {
		input.indeterminate = true;
	});
}
