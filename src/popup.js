'use strict';
function onClick(e) {
	let dataType = $(this).attr('data-type');
	let dataAction = $(this).attr('data-action');
	//doCopy(dataType,dataAction);
	//chrome.runtime.sendMessage({dataType: dataType, dataAction: dataAction}, (response)=>{});
	doCopy(dataType,dataAction,(copiedText)=>{
		window.close();
	});
}

function renderMenu(dataTypes, selectedDataType){
	return dataTypes.map((item)=>{
		return `<div class="pure-g">
					<div class="pure-u-8-24">
						<button class="pure-button text-center" 
								data-type="${item.dataType}" 
								data-action="all">All Tabs </button>
					</div>
					<div class="pure-u-16-24">
						<button class="pure-button text-left" 
								data-type="${item.dataType}" 
								data-action="single">Copy ${item.description} <span class="check">${selectedDataType === item.dataType ? '&#10003;':'&nbsp;'}</span></button>
					</div>
				</div>
				`;
	});
}

/////////////////////////////////////////////////////////////////////
// General DOM Listener
document.addEventListener('DOMContentLoaded', ()=>{
	chrome.storage.local.get(['dataType'], (result)=>{
        let lastUsedDataType = result.dataType || 'dash';
		$('#menu').html(renderMenu(Lookup.DataTypes, lastUsedDataType));
		$('.pure-button').on('click', onClick);
    });
});