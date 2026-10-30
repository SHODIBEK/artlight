# UI-kit Artlight

Источник: [Figma / ui-kit](https://www.figma.com/design/BBlv4Y6Hjn3vuFhWGffGIm/art-light?node-id=2-35861).
Снято через Figma MCP 2026-10-17. Цвета — токены в `src/scss/_variables.scss`, иконки — `src/images/sprites/svg` (`currentColor`, подключать `+svg('name')`).

Общие правила: углы прямые (radius 0), кроме круглых индикаторов-стрелок 40×40. Focus у всех компонентов — рамка 2px `--color-black`. Disabled — `opacity: .6` (если не указано иное).

## Типографика — шрифт LT Superior

| Стиль | Размер | Начертание | line-height | Прочее |
|---|---|---|---|---|
| H1 | 64 | Bold | 1.2 | uppercase |
| H2 | 46 | Bold | 1.2 | uppercase |
| H3 | 16 | Semi-bold | normal | |
| H4 | 15 | Bold | 1.2 | uppercase |
| Поле ввода | 15 | Regular | 1.2 | |
| Кнопка | 15 | Bold | 1.2 | uppercase |
| Меню | 15 | Medium | normal | |
| Текст L | 20 | Regular | 1.4 | text-wrap: balance |
| Текст M | 15 | Regular | 1.2 | |
| Текст S | 12 | Regular | 1.2 | |

## Цвета

| Токен | Значение |
|---|---|
| accent | #7BDE00 |
| black | #1E1E1E |
| light-grey | #F2F2F2 |
| stroke | #D8D8D8 |
| black-60 | rgba(30,30,30,.6) |
| red | #EC1C24 |

Состояния (без имён в Figma): accent hover #A3E635, accent pressed #78C300, accent disabled #DCEBC9, grey hover #E8E8E8, link #0077FF / hover #005FCC / pressed #004799.

## Компоненты

Общее для кнопок: на hover стрелка/шеврон ходит вперёд-назад по своему направлению (`button-nudge`, 0.8s, бесконечно; `arrow-up-right` — по диагонали, `arrow-right`/`chevron-right` — вправо), цвет фона — по состояниям ниже. В макете анимации нет — по просьбе заказчика.

### Button / Main — `все проекты (34)`
h 70, px 56, gap 12, текст «Кнопка», индикатор — белый круг 40 с `arrow-up-right` (#1E1E1E).
- Default: bg accent
- Hover: bg #A3E635, drop-shadow 0 4px 6px rgba(0,0,0,.1)
- Pressed: bg #78C300
- Focus: bg accent + border 2 black
- Disabled: bg stroke, opacity .6, текст #6B7280, стрелка серая

### Button / Secondary — `Войти`
h 70, px 56, gap 12, border 1. Круг 40 со стрелкой `arrow-up-right`.
- Default: bg white, border stroke, круг #F2F2F2
- Hover: bg light-grey, border black-60, круг #E8E8E8
- Pressed: bg stroke, border black-60, круг (темнее)
- Focus: bg white, border 2 black
- Disabled: bg stroke, border stroke, opacity .6, текст black-60

### Button / Tertiary — `Регистрация`
h 70, p 10, только текст.
Default light-grey · Hover #E8E8E8 · Pressed stroke · Focus light-grey + border 2 black · Disabled stroke + opacity .6, текст black-60.

### Button / Stroke — `IES/LDT файлы`
h 48, px 14, gap 10, текст 15 Regular, `chevron-right` 5×8 (black-60).
Default: bg light-grey, border 1 accent · Hover: bg #E8E8E8 · Pressed: bg stroke · Focus: border 2 black · Disabled: bg+border stroke, текст opacity .55.

### Button / Arrow (не снят — лимит Figma MCP)
Круг 64×64, иконка `arrow-right`; по скриншоту: белый круг, состояния как у Secondary.

### Tabs / Main — `35W`
h 40, px 16, py 10, текст 15 Regular (pt 2).
- Не выбран: light-grey → hover #E8E8E8 → pressed stroke → focus +border 2 black → disabled stroke, opacity .6
- Выбран: accent → hover #A3E635 → pressed #78C300 → focus +border 2 black → disabled #DCEBC9, opacity .6

### Link / Back to catalog — `Вернуться в каталог`
gap 8, `arrow-left` 11×9, текст 15/18 Regular, letter-spacing .3px, цвет #0077FF.
Hover #005FCC + underline · Pressed #004799 + underline · Focus outline 2 black с отступом 4 · Disabled black-60, opacity .6.

### Checkbox / Main
30×30. Иконка `check` 24 по центру; indeterminate — полоса 12×2 black.
- Unchecked: bg light-grey, border 1 stroke · hover #E8E8E8 + border black-60 · pressed/disabled stroke · focus border 2 black · error border 2 red
- Checked/Indeterminate: bg accent · hover #A3E635 · pressed #78C300 · focus border 2 black · error border 2 red · disabled bg stroke, иконка black-60

Текст рядом: `+checkbox(...)` с вложенным `span.checkbox__label` (15/18, отступ 12). На тёмном фоне — `.checkbox--dark` (пустой: прозрачный + обводка light-grey, текст белый). На белом (попапы) — `.checkbox--light` (пустой: без заливки, обводка light-grey).

### Input / Name — `Имя`
h 70, px 30, текст 15/1.2, placeholder black-60.
Default: bg light-grey · Hover: #E8E8E8 + border 1 stroke · Focus: border 3 accent · Filled: текст black · Error: border 2 red · Disabled: bg stroke, placeholder opacity .6 · ReadOnly: bg light-grey + border 1 stroke.

Textarea: `+input({ ..., textarea: true })` → `.input--textarea` (текст сверху, h 125, p 30; высоту можно переопределить). `attrs` — атрибуты самого поля.

Подпись: `+input({ ..., label: 'Почта' })` → `.input--label` + `.input__label` — вместо плейсхолдера: у пустого поля по центру, с значением / в фокусе — сверху (15/18 в 13.5), значение 16/19 под ней (ЛК «Обратная связь»).
Select: `+input({ ..., options: [...], placeholder })` → `.input--select` (select на всё поле, шеврон `select-chevron` справа; пустой пункт — серый плейсхолдер). Горизонтальный паддинг — `--input-pad-x` (30 / 20 в мобильных формах).
Попапы: `line: true` → `.input--line` (белое поле, серая линия снизу).

### Input / Email — `Почта` + кнопка
h 70, px 30, space-between; справа круг 40 accent со стрелкой `arrow-right`.
Default: bg white · Hover: light-grey + border 1 stroke · Focus: border 3 accent · Error: border 2 red · Disabled: bg stroke, круг серый · ReadOnly: light-grey + border stroke, круг stroke, стрелка black-60.
Примечание: в Default/Hover/Focus/Error placeholder в макете цвета black (не black-60).

### Search — `Поиск по Artlight`
h 40, px 16, border 2 black, иконка `search` 24 (black-60).
Default: прозрачный · Hover: bg #E8E8E8 · Focus: bg white + border 3 accent · Filled: bg white · Error: border red · Disabled: bg+border stroke, текст opacity .55, иконка .45.

### Pagination / Main
gap 8, ячейки 40×40 (кнопки-стрелки 40×40 bg light-grey, `chevron-right`, prev — зеркально).
Номер: w 41, px 16, текст 15. Активная — accent, остальные — light-grey. Стрелка неактивна (на краю) — opacity ~.1.
Hover/Pressed/Focus относятся к стрелке «вперёд»: hover/pressed темнее фон, focus — border 2 black. Disabled: всё stroke + opacity .6, активная #DCEBC9.

### Sidebar
bg light-grey, py 8. Пункт: h 40, px 15, gap 6, иконка 24 + текст 15 Regular black.
Активный пункт — bg accent. Состояния Sidebar / Item (hover/pressed/focus/disabled) не сняты — лимит MCP; по скриншоту: hover #A3E635, pressed #78C300, focus accent + border 2 black, disabled stroke + opacity.
Пункты и иконки: Главная `cube`, Заказы `list-check`, Профиль `user`, Избранное `heart`, Прайс-лист `table`, Обратная связь / Сервисная служба / Акты сверки и УПД `message`, Материалы для скачивания `download`, Выйти `logout`.

## Вёрстка

Демо всех состояний: `build/ui-kit.html` (исходник `src/ui-kit.pug`).

- Стили: `src/scss/components/_<блок>.scss`, БЭМ: блок `__элемент` `--модификатор` (вариант). Состояния — классы `is-*` (`is-active`, `is-disabled`, `is-error`, `is-readonly`).
- Hover / pressed / focus — псевдоклассы через миксины `state-hover`, `state-pressed`, `state-focus` (`src/scss/mixins/_states.scss`); классы `is-hover` / `is-pressed` / `is-focus` только для демо.
- Обводки — `@include stroke($w, $color)` (inset box-shadow, как stroke inside в Figma — не сдвигает содержимое).
- В компонентах отключено правило stylelint `order/order`: порядок state-миксинов задаёт каскад. Не переупорядочивать.
- Pug-миксины: `src/pug/mixins/ui.pug`

```pug
+button({ view: 'main', label: 'все проекты (34)', href: 'projects.html' })
+button({ view: 'secondary', label: 'Войти', type: 'submit' })
+button({ view: 'stroke', label: 'IES/LDT файлы' })
+button({ view: 'arrow', ariaLabel: 'Далее' })
+tab('35W', { active: true })
+linkBack('Вернуться в каталог', 'catalog.html')
+checkbox({ name: 'agree', checked: true })   //- checked: 'indeterminate'
+input({ name: 'name', placeholder: 'Имя' })
+input({ name: 'email', type: 'email', placeholder: 'Почта', white: true, action: true })
+search({ placeholder: 'Поиск по Artlight', action: 'search.html' })
+pagination(2, 3, { href: '?page=' })
+sidebar([{ label: 'Главная', icon: 'cube', href: '/', active: true }])
```
