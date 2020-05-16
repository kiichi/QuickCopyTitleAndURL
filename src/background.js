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

/////////////////////////////////////////////////////////////////////
// Common Library
function copyToClip(mime, str) {
	function listener(e) {
		e.clipboardData.setData(mime, str);
		e.preventDefault();
	}
	document.addEventListener("copy", listener);
	document.execCommand("copy");
	document.removeEventListener("copy", listener);
};

function isImage(url){
	return (url.indexOf('.jpg') > -1 || url.indexOf('.png') > -1);
}

// dataType - type of data format to copy e.g. "dash" see popup.html data-type attributes
// dataAction - action when it copies: "single" or "all"
// onSuccess - callback after copied. Copied text is in argument
function doCopy(dataType, dataAction, onSuccess){
    let options = {currentWindow:true};
	if (dataAction == 'single'){
		options['active'] = true;
	}
	let mime = (dataType == 'rich') ? 'text/html': 'text/plain';
	let allText = '';
	chrome.tabs.query(options, (tabs)=>{
		for (let i=0; i<tabs.length; i++){
			let txt = 'ERROR - Sorry something went wrong.';
			let tab_title = tabs[i].title;
			let tab_url = tabs[i].url;
			// remove leading "notification counts" that websites have started to add
			//  For info, watch : https://www.youtube.com/watch?v=bV0QNuhN9fU&t=64s
			let matches = tab_title.match(/^(\([0-9]+\) )?(.*)$/);			
			if (matches) {
				tab_title = matches[2];
			}
			if (dataType === 'dash') {
				txt = tab_title + ' - ' + tab_url;
			}
			else if (dataType == 'bracket') {
				txt = '[' + tab_title + '] ' + tab_url;
			}
			else if (dataType == 'newline') {
				txt = tab_title + '\n' + tab_url;
			}
			else if (dataType == 'html' || dataType == 'rich') {
				txt = '<a href="' + tab_url + '">' + tab_title + '</a>';
			}
			else if (dataType == 'md') {
				let prefix = '';
				if (isImage(tab_url)){
					prefix = '!';
				}
				txt = prefix + '[' + tab_title + '](' + tab_url + ')';
			}
			else if (dataType == 'bb') {
				if (isImage(tab_url)){
					txt = '[img]'+tab_url+'[/img]';
				}
				else {
					txt = '[url='+tab_url+']'+tab_title+'[/url]';
				}
			}
			else if (dataType == 'url') {
				txt = tab_url;
			}
			else if (dataType == 'title') {
				txt = tab_title;
			}
			allText += txt;
			if (tabs.length > 1){
				allText += (dataType == 'html' || dataType == 'rich') ? '<br/>\n' : '\n';
			}
		}

        copyToClip(mime,allText);
        if (onSuccess){
            onSuccess(allText);
        }
    });
    
    // Save the dataType
    chrome.storage.local.set({"dataType": dataType},()=>{});
}

function showNotification(dataType, dataAction, details){
    chrome.notifications.clear(notificationId); 
    notificationId = 'copy-'+(new Date()).getTime();
    let copiedType = 'Single Tab';
    if (dataAction === 'all'){
        copiedType = "All Tabs";
    }
    let desc = Lookup.DataTypes.find(item=>item.dataType===dataType).description;
    let options = {type:"basic", 
                   silent: true, 
                   iconUrl:"icons/icon.png", 
                   title:`Copied ${desc} into your clipboard`, 
                   message:details};

    chrome.notifications.create(notificationId, options, (notificationId)=>{
        //console.log("notification sent",notificationId,options);
    });
}

/////////////////////////////////////////////////////////////////////
// IPC Listener from UI 
chrome.runtime.onMessage.addListener((payload, sender, sendResponse)=>{
	//console.log(payload, sender);
	doCopy(payload.dataType, payload.dataAction);
    return true; // indicate async
});

function sendResponse(){ return true; }
