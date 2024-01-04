npm run build

HTML_FILE=$(find . -name index.html | head -n 1)

echo "add base url to Tasks" $HTML_FILE

sed -i 's/<head>/<head><base href="\/Tasks\/">/g' $HTML_FILE
