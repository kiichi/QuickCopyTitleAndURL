'use strict'
// Background Thread
// Note: 
//   Reload or Uninstall Extension when you change manifest
//   Max number of shortcut is 4.
//   Debug Console - Open extension > click background page link

/////////////////////////////////////////////////////////////////////
// Globals
let notificationId = "copy-0";

/////////////////////////////////////////////////////////////////////
// Key Listener from manifest
chrome.commands.onCommand.addListener((command) => {
    chrome.storage.local.get(['dataType'], (result) => {
        // See manifest file
        // shortcut-z, default is previous selection
        let dataType = result.dataType || 'dash';
        if (command === 'shortcut-x'){
            dataType = 'dash';
        }
        else if (command === 'shortcut-c'){
            dataType = 'rich';
        }
        else if (command === 'shortcut-d'){
            dataType = 'md';
        }
        else if (command === 'shortcut-z'){
            // do nothing
        }
        let dataAction = 'single'; // see manifest shortcut definition
        doCopy(dataType, dataAction, (copiedText) => {
            //let details = (dataAction === 'all') ? 'All Tabs' : copiedText;
            showNotification(dataType, dataAction, copiedText);
        });
    });
});

/////////////////////////////////////////////////////////////////////
// Context Menu
function onContextMenuClickHandler(info, tab) {
    doCopy(info.menuItemId,'single', (copiedText)=>{
        //console.log('copied',copiedText);
    });
    // console.log("item " + info.menuItemId + " was clicked");
    // console.log("info: " + JSON.stringify(info));
    // console.log("tab: " + JSON.stringify(tab));
};

chrome.contextMenus.onClicked.addListener(onContextMenuClickHandler);

chrome.runtime.onInstalled.addListener(()=>{
   initContextMenu(); 
});
// TODO: use .udpate for checked