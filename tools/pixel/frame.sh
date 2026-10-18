#!/bin/sh
# Страница в iframe заданной ширины (для 402px): frame.sh PAGE.html WIDTH HEIGHT OUT.png  — нужен запущенный npx gulp (порт 3000)
DIR="$(cd "$(dirname "$0")" && pwd)"; B="$DIR/../../build"
printf '<!doctype html><html><body style="margin:0;background:#fff"><iframe src="%s" style="border:0;display:block;width:%spx;height:%spx"></iframe></body></html>' "$1" "$2" "$3" > "$B/__frame.html"
sh "$DIR/shot.sh" http://localhost:3000/__frame.html 600 "$3" "$4"
rm -f "$B/__frame.html"
