rm src.zip
zip -r src.zip src
echo "Done. go to chrome developer site"
ls -ltr src.zip
echo ""
echo "Did you bump the version in src/manifest ? "
echo "Done. Go to the URL below"
echo "https://chrome.google.com/webstore/developer/dashboard"
open .
