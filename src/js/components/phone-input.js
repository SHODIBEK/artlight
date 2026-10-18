import intlTelInput from 'intl-tel-input';
import ru from 'intl-tel-input/locale/ru';

/**
* Поле телефона с выбором страны (intl-tel-input): по умолчанию Россия, номер форматируется при вводе,
* в плейсхолдере — пример номера выбранной страны. Утилиты libphonenumber (~250 КБ) грузятся отдельным чанком.
* В форму уходит и полный номер в формате E.164 — скрытое поле `<name>_full`.
*/
export default function phoneInputInit(root = document) {
	root.querySelectorAll('.js-phone').forEach((input) => {
		if (intlTelInput.getInstance(input)) {
			return;
		}

		intlTelInput(input, {
			initialCountry: 'ru',
			countryOrder: ['ru', 'by', 'kz', 'uz', 'am', 'kg'],
			countryNameLocale: 'ru',
			uiTranslations: ru,
			// номер одной строкой «+7 912 345-67-89», как в макете (без отдельного кода страны у флага)
			separateDialCode: false,
			numberDisplayFormat: 'INTERNATIONAL',
			strictMode: true,
			hiddenInputs: (name) => ({phone: `${name}_full`}),
			loadUtils: () => import(/* webpackChunkName: "phone-utils" */ 'intl-tel-input/utils'),
		});
	});
}
