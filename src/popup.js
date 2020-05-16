'use strict';
// TODO: append mode, // wrap in list, toastr, target=_blank for html, Japanese version
function onClick(e) {
	let dataType = $(this).attr('data-type');
	let dataAction = $(this).attr('data-action');
	//doCopy(dataType,dataAction);
	chrome.runtime.sendMessage({dataType: dataType, dataAction: dataAction}, (response)=>{});
	window.close();
}

function renderMenu(dataTypes, selectedDataType){
	return dataTypes.map((item)=>{
		return `<div class="pure-g">
					<div class="pure-u-17-24">
						<button class="pure-button text-left" 
								data-type="${item.dataType}" 
								data-action="single">Copy ${item.description} ${selectedDataType === item.dataType ? '&#10003;':'&nbsp;'}</button>
					</div>
					<div class="pure-u-7-24">
						<button class="pure-button" data-type="${item.dataType}" data-action="all">All Tabs</button>
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
		$('.container').html(renderMenu(Lookup.DataTypes, lastUsedDataType));
		$('.pure-button').on('click', onClick);
    });
});