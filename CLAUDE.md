# ARTLIGHT — вёрстка по Figma

Сайт производителя светильников. Вёрстка pixel perfect по Figma, **десктоп (1728) + мобильная (402)** для каждой страницы.

## Стек и команды
- Gulp 4 + Pug + SCSS (dart-sass 1.32) + webpack 5 (через webpack-stream) + Babel. Сборка в `build/`.
- `npx gulp` — сборка, watch и сервер http://localhost:3000 (с телефона — по IP компьютера, порт 3000).
- `npx gulp build` — разовая сборка. Если менялся `gulpfile.js` — перезапустить `npx gulp`.
- Lint: `npx stylelint "src/scss/components/*.scss" --fix`, `npx eslint --fix src/js/components`.

## Структура
- Страницы: `src/*.pug` (extends `src/pug/base.pug`). Данные/тексты — `src/pug/data.pug`.
- Шапка/общие блоки: `src/pug/components/`; секции страниц: `src/pug/sections/`; сборка страницы: `src/pug/pages/`.
- UI-kit миксины: `src/pug/mixins/ui.pug` (`+button`, `+tab`, `+linkBack`, `+checkbox`, `+input`, `+search`, `+pagination`, `+sidebar`). Описание — `docs/ui-kit.md`, демо — `ui-kit.html`.
- Стили: блок = файл `src/scss/components/_<блок>.scss`, подключить в `src/scss/main.scss`. JS-компоненты: `src/js/components/`, init в `src/js/main.js`.
- Иконки: SVG в `src/images/sprites/svg/` → спрайт, `+svg('name')`. Цвет через `currentColor`; у контурных путей `fill="none"` на `<path>`, не на корневом `<svg>` (svgstore/svgo его теряют).
- Картинки: `src/images/home/` (префиксы `service-`, `project-`, `cat-`, `slider-`…), `@2x` для retina.

## Правила вёрстки
- **БЭМ**: блок`__элемент``--модификатор` (вариант). Состояния — классы `is-*` (`is-active`, `is-disabled`, `is-error`, `is-open`).
- Hover/pressed/focus — миксины `state-hover|state-pressed|state-focus` (`src/scss/mixins/_states.scss`). В файлах с ними `// stylelint-disable order/order` — порядок миксинов задаёт каскад, не переупорядочивать.
- Ховер на фото (карточки-ссылки с картинкой) — всегда зум внутри рамки фото + затемнение: `@include photo-hover(".block__image", ".block__picture")` на карточке (рамка = карточка — без 2-го аргумента), у рамки `position: relative; overflow: hidden`, текст внутри рамки — `z-index: 1`. Других ховер-эффектов на фото не добавлять.
- Обводки — `@include stroke($w, $color)` (inset box-shadow = stroke inside в Figma, не сдвигает содержимое).
- Токены цветов/сетки — CSS-переменные в `src/scss/_variables.scss` (`--color-*`, `--gutter`, `--header-height`).
- Контейнер `.container`: max-width 1728, поля 20px (16px < 768).
- Брейкпоинты: `$tablet` 768, `$header-desktop` 1280 (десктопная шапка), `$header-full` 1600 (поле поиска в строке, как в макете). Мобильный макет — < 768.
- Шапка фиксированная; `.site` имеет `padding-top: var(--header-height)` (54 / 86). Логотип на десктопе (≥ 1280) всегда по центру; пункты меню, которые до него не помещаются (зазор 32), JS переносит с правого края в начало «Еще» (`headerNavInit` в `header.js`, копии `.js-header-overflow` в выпадающем списке). Телефоны — с 1280; поле поиска на 1280–1599 свёрнуто в лупу (выпадает под шапкой справа), с 1600 — в строке, как в макете.
- Шрифт LT Superior 400/500/600/700; акцентный Vela Sans 700 (`--font-family-accent`, цифры). Медиум в макете = `font-weight: 500`.
- Шаг строк Figma округляет до целого: 22×1.2 → 26px, 18×1.2 → 22px — задавать `line-height` в px, иначе накапливаются сдвиги на 1px.
- Тексты — через `typo()` (`src/pug/mixins/typo.pug`): неразрывный пробел после коротких предлогов/союзов, как переносы в макете.
- Телефон — `intl-tel-input` 29 (`src/js/components/phone-input.js`, поле `+input({ type: 'tel', attrs: { class: 'js-phone' } })`): выбор страны, формат при вводе, проверка; utils грузятся чанком `phone-utils.js`. Флаги — `src/images/vendor/flags*.webp`, оформление — `_iti.scss`. Плагин на ES2020: собирается только webpack 5 — если в `build/js/vendor.js` `webpackJsonp` (webpack 4), перезапустить `npx gulp`. Симптом: «Module parse failed» в vendor.js — весь main.js не работает (слайдеры, попапы). Старый watch-процесс пересобирает JS webpack 4 при каждой правке JS.
- Слайдеры — Swiper 11 (`swiper`, модули из `swiper/modules`). Навигации в макете нет — свайп. Слайдеры: hero, «реализованные проекты», «отзывы» (автопрокрутка 3 с). «Наши клиенты» — не Swiper, а бегущая строка (`clients-slider.js`: rAF, 50 px/с, пауза под мышью, протягивание, копии набора `.clients__slide--copy`).

## Figma
- Файл `BBlv4Y6Hjn3vuFhWGffGIm`, MCP-сервер `plugin:figma:figma`. Перед `get_design_context` загрузить skill `figma:figma-design-to-code`.
- **Запрашивать только нужный узел**, не `get_metadata` всей страницы (`0:1` ≈ 2.5 МБ).
- Главная, десктоп `2:23` / мобильная `2:13032`:

| Блок | Десктоп | Моб. | Статус |
|---|---|---|---|
| Шапка + hero-слайдер | `2:25` | `2:13034`, `2:13049` | готово (hero — на высоту экрана `100svh`, моб./планшет минус шапка, min 480; в макете 820 / 812) |
| Категории каталога + «весь каталог» | `2:54` | `2:13064` | готово (до «Услуг» по PNG 150 / 100px) |
| Услуги + «все услуги» | `2:80` | `2:13087` | готово (до «Клиентов» по PNG 158 / 106px; ховер — зум фото + текст `--color-black-60`, как пункт меню) |
| Наши клиенты (слайдер логотипов) | `2:121` | `2:13123` | готово (до «Клиентов» 150 / 100px, лента −60px от поля) |
| Реализованные проекты (слайдер) | `2:125` | `2:13127` | готово (1-я карточка в макете — состояние ховер / активный слайд на моб.) |
| О компании | `2:167` | `2:13168` | готово («30+» — Vela Sans Bold, `--font-family-accent`) |
| Отзывы (слайдер) | `2:189` | `2:13190` | готово (карточки 364.4 / 340, шаг 6 / 16; аватары — экспорт узла `review-avatar-N@2x.png`) |
| Форма | `2:280` | `2:13279` | готово (фон `form-bg@2x.jpg` + затемнение 70%; телефон — intl-tel-input; в макете 1-й чекбокс отмечен и номер чёрный — это состояния, у нас по умолчанию пусто) |
| Подвал | `2:331` | `2:13330` | готово (данные `data.footer`, меню «Для покупателя»/«Скачать» — из `data.mobileMenu.submenus`; до 1600 контакты уходят под меню в 2 колонки) |

- Попап «Обратный звонок»: окно десктоп `2:869` (в кадре `2:430`), моб. `2:13838` (в кадре `2:13446`) — готово. Эталоны `design/callback-desktop.png` / `callback-mobile.png`. Попапы: `.modal.js-modal[data-modal-id]` + кнопки `data-modal="<id>"` (`src/js/components/modal.js`); разметка `src/pug/components/modal-callback.pug`.
- UI-kit `2:35861`. Мобильное меню — только PNG `design/home-mobile-menu.png`.
- Плавающие кнопки (`float-actions.pug`, `float-actions.js`): «Написать» раскрывает WhatsApp / Max / Telegram (`data.floatActions.messengers`) и меняется на крестик — макет моб. `56:11070`; на десктопе открытого состояния нет — мессенджеры «таблетками» с подписью по правому краю. Закрытие — повторный клик, клик мимо, Escape.
- Прелоадер (только главная, не в макете): `src/pug/components/preloader.pug` в `index.pug` — чёрный фон, логотип инлайн по центру (`clamp(150px, 20vw, 360px)`); `preloader.js` — через 3 с после `load` плавно исчезает (1.2 с) и удаляется, пока виден — `is-lock-scroll`. Буквы логотипа в `logo.svg` — `currentColor` (в шапке чёрные, в прелоадере белые).
- Каталог `catalog.html`: десктоп `2:2262` / моб. `2:15285` — готово (эталоны `design/catalog-desktop.png` / `catalog-mobile.png`). Разметка `src/pug/pages/catalog.pug`, данные `data.catalog`, стили `_catalog.scss`, табы-якоря `catalog-nav.js`. Картинки — исходники из `get_design_context` в `src/images/catalog/` (CROP-кадры обрезаны заранее); рамка картинки в карточке — `d`/`m` в данных (`[x, y, w, h, ширина карточки]` по макету). Ряды «По типу» ≥ 1280 — `flex-basis` = ширина карточки в макете. В макете 1-е карточки «По статусу» / «По назначению» — состояние ховер. Моб. карточки в макете местами 362 (поля 20) — у нас 370, как весь контейнер. Отзывы/форма/подвал — с главной, на моб. отступ 60 (`compactSections` → `--compact`).
- Фон с `url()` не передавать CSS-переменной из `style`: Chrome считает путь от `css/main.css` — задавать `background` прямо в `style`.

## Проверка pixel perfect
- Эталон — экспорт PNG в `design/` (`home-desktop.png.png` 1728, `home-mobile.png.png` 402). Данные MCP иногда расходятся с PNG на 1–3px — верить PNG.
- Скрипты `tools/pixel/` (нужен запущенный `npx gulp`):
  - `sh tools/pixel/shot.sh http://localhost:3000/index.html 1728 900 out.png`
  - мобильная 402: `sh tools/pixel/frame.sh index.html 402 900 out.png` (headless не даёт окно < 500)
  - `python tools/pixel/diff.py design.png out.png x0 y0 x1 y1 diff.png` — процент пикселей с отличием > 40 (норма — только сглаживание текста, ~0.5–3%)
  - `python tools/pixel/px.py img seg y0 y1 x0 x1 R,G,B` — координаты элементов по фону
- Если headless Chrome виснет на localhost (код 21 / таймаут; остаются процессы с профилем `pixel-chrome`) — снимать `file:///…/build/<page>.html` с отдельным `--user-data-dir` (SVG-спрайт по `file://` не грузится — иконки на снимке пустые). Не запускать `npx gulp build` при работающем `npx gulp` — два процесса пишут `build/` одновременно и ломают `vendor.js`.
- Сверять **цифрами**; картинки смотреть только при реальном расхождении, небольшой вырезкой.
- Известные сдвиги Chrome↔Figma: Bold 15/18 рисуется на 1px выше (компенсация `top: 1px` / паддинги); ширины текстов в Figma чуть больше (ряд ссылок шапки — gap 12.5 вместо 12); центрирование нечётной ширины — `+0.5px`.

## Ждём от заказчика
- Временные иконки моб. меню `close.svg`, `back.svg`. Ссылки соцсетей (`data.socials`) и мессенджеров (`data.floatActions.messengers`) пока `#`.
