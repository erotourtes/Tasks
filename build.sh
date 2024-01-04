npm run build

HTML_FILE=$(find . -name index.html | tail -n 1)

echo "add /Tasks/ path" $HTML_FILE

sed -i 's/\/assets\//\/Tasks\/assets\//g' $HTML_FILE

cat $HTML_FILE
