#!/bin/sh
# Скриншот страницы headless Chrome: shot.sh URL WIDTH HEIGHT OUT.png  (окно не уже 500px — для мобилки frame.sh)
# Отдельный профиль: с общим профилем headless зависает, если открыт обычный Chrome
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --user-data-dir="${TMP:-/tmp}/pixel-chrome" --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=$2,$3 --virtual-time-budget=4000 --screenshot="$4" "$1" 2>/dev/null
