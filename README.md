# Copy Cat - Quickly Copy Title and URL

# About this Chrome Extension

I created this extension because similar extensions are too complicated and a few more clicks 
to do the simple thing for my daily operation. For example, I often copy PR's Title and URL 
in tickets or chat window.

![demo.gif (684×290)](https://raw.githubusercontent.com/kiichi/QuickCopyTitleAndURL/master/resources/demo.gif)

## Chrome Web Store URL - Install it from here 

[Copy Cat - Quick Copy Title and URL - Chrome Web Store](https://chrome.google.com/webstore/detail/copy-cat-quick-copy-title/andlmjmbnlaamloflnelcafcnkiplhkc/)

## For Developers - How to install and test the latest

1. Clone Repository.
```
git clone https://github.com/kiichi/QuickCopyTitleAndURL.git
```
2. Select Extensions from Chrome's menu
3. Turn on Developer mode (top right corner switch)
4. Select LOAD UNPACKED from the middle menu
5. Select src folder within this repository
6. See Cat Icon on Top Right Corner.
7. If you change the code, click reload button to test again.

## Debugging Tips

1. Some of manifest changes requires reloading plugin. Click reload or remove and load unpacked folder again.
2. In order to see console.log, click background page.


## Uploading to app store - Memo for myself

1. Bump the version in manifest.json
2. Run build.sh
3. Upload it to webstore.
4. Tag it in the master branch for the version number.

Reference [Publish in the Chrome Web Store - Google Chrome](https://developer.chrome.com/webstore/publish?hl)

## Credits

### Contributers

[jeske (David Jeske)](https://github.com/jeske) - Thanks for [Notification Prefix Cleaning PR #10](https://github.com/
kiichi/QuickCopyTitleAndURL/pull/10)

[alejandro5042 (Alejandro Barreto)](https://github.com/alejandro5042) - Thanks for Font Size feedback and quick mockup design! #13

[smaragdus](https://github.com/smaragdus) - Thanks for Font Size feedback and extensive review in Windows! #16


### Libraries and Resources

jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license 

Pure v1.0.0
Copyright 2013 Yahoo!
Licensed under the BSD License.
[pure/LICENSE at master · pure-css/pure](https://github.com/pure-css/pure/blob/master/LICENSE)

Icon Credits : M.Y

## Other Issues

I noticed that very similar plugin has been published with same name "Copycat". 
Not sure why I missed it 2 years ago, but I might change the name of this extension 
if this causes some issues. [Version 1.5.0 · Issue #16 · kiichi/QuickCopyTitleAndURL](https://github.com/kiichi/QuickCopyTitleAndURL/issues/16#issuecomment-633143286) . 
I'm still holding decisions at this point.



