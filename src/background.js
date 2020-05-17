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
chrome.commands.onCommand.addListener((command)=>{
    //console.log(document);
    //console.log(command);
    chrome.storage.local.get(['dataType'], (result)=>{
        let dataType = result.dataType || 'dash';
        let dataAction = command; // see manifest shortcut definition
        doCopy(dataType,dataAction,(copiedText)=>{
            let details = (dataAction === 'all') ? 'All Tabs' : copiedText;
            showNotification(dataType, dataAction, details);
        });
    });
});

