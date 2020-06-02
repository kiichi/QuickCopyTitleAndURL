'use strict'
/////////////////////////////////////////////////////////////////////
// Globals
const Lookup = {
    DataTypes: [
        { dataType:"dash", description:"Title - URL", ordNum:10 },
        { dataType:"bracket", description:"[Title] URL", ordNum:20 },
        { dataType:"newline", description:"in Two Lines", ordNum:30 },
        { dataType:"rich", description:"Rich Text Link", ordNum:40 },
        { dataType:"html", description:"HTML", ordNum:50 },
        { dataType:"md", description:"Markdown", ordNum:60 },
        { dataType:"bb", description:"BBCode", ordNum:70 },
        { dataType:"title", description:"Title Only", ordNum:80 },
        { dataType:"url", description:"URL Only", ordNum:90 },
	],
	DefaultConfig: {
		size : "md",
		all: "left",
		contextMenu: "on",
		sort:'default' // default, usage, or custom
	}
};

/////////////////////////////////////////////////////////////////////
function copyToClip(mime, str) {
	function listener(e) {
		e.clipboardData.setData(mime, str);
		e.preventDefault();
	}
	document.addEventListener("copy", listener);
	document.execCommand("copy");
	document.removeEventListener("copy", listener);
};

/////////////////////////////////////////////////////////////////////
function isImage(url){
	return (url.indexOf('.jpg') > -1 || url.indexOf('.png') > -1);
}

/////////////////////////////////////////////////////////////////////
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
    
	
	// dataType is user's selection on menu
	getDataTypes('dash', Lookup.DataTypes, Lookup.DefaultConfig, (loadedDataType, loadedDataTypes, loadedSortType)=>{
		setDataTypes(dataType, loadedDataTypes, loadedSortType, ()=>{});	
		initContextMenu(dataType, loadedDataTypes, loadedSortType);
	});
}

/////////////////////////////////////////////////////////////////////
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

function clearContextMenu(){
	chrome.contextMenus.removeAll();
}

// Note: dataTypes has to be provided after getDataTypes
function initContextMenu(dataType, dataTypes, sortType){
	chrome.contextMenus.removeAll(()=>{
		dataTypes.sort((item1,item2)=>item1.ordNum-item2.ordNum)
				.forEach((item)=>{
					chrome.contextMenus.create({
						"title": `Copy ${item.description}`, 
						"type": "radio",
						"id": item.dataType,
						"checked": (item.dataType === dataType)
					});
				});
		chrome.contextMenus.create({
			"title": '', 
			"type": "separator",
			"id": 'sep1'
		});
		chrome.contextMenus.create({
			"title": 'Settings', 
			"type": "normal",
			"id": 'settings'
		});
	});
}

function setConfig(key, val, callback){
	getConfigs((result)=>{
		//console.log('got config',result);
		result[key] = val;
		chrome.storage.local.set({"config":result}, ()=>{
			if (callback){
				callback();
			}
		});
	});
}

// return: if config sort is 'default', force to return defaultDataTypes (via Lookup)
// otherwise, it loads from the storage
function getDataTypes(defaultDataType, defaultDataTypes, defaultConfig, callback){
	if (callback){
		chrome.storage.local.get(['config','dataType','dataTypes'],(result)=>{
			const conf = result.config || defaultConfig;
			const sortType = conf['sort'] || 'default';
			const dataType = result.dataType || defaultDataType;
			let dataTypes = result.dataTypes || defaultDataTypes;
			if (sortType === 'default'){
				dataTypes = defaultDataTypes;
			}
			callback(dataType, dataTypes, sortType);
		});
	}
}

// Set dataTypes order (max ordNum = -tick)
function setDataTypes(dataType, defaultDataTypes, sortType, callback){
	let dataTypes = defaultDataTypes;
	if (sortType === 'usage'){
		dataTypes = defaultDataTypes.map((item)=>{
			if (item.dataType === dataType){
				item["ordNum"] = -(new Date()).getTime();
			}
			return item;
		});
	}
	
	chrome.storage.local.set({"dataType": dataType,
							  "dataTypes": dataTypes},
							  callback);
}

function getConfigs(callback){
	chrome.storage.local.get(["config"],(result) => {
		let conf = Lookup.DefaultConfig;
		// merge key-value pairs
		if (result.config){
			Object.keys(result.config).forEach((key)=>{
					if (result.config[key]){
						conf[key] = result.config[key];
					}
			});
		}
		//console.log('loaded config',conf);
		if (callback){
			callback(conf);
		}
	});
}

function getConfig(key, defaultValue, callback){
	if (callback){
		getConfigs((result)=>{
			callback(result[key] || defaultValue);
		});
	}
}

function openSettings(){
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	}
	else {
		window.open(chrome.runtime.getURL('options.html'));
	}
}