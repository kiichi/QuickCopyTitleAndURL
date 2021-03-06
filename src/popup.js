'use strict';
function onClick(e) {
	let dataType = $(this).attr('data-type');
	let dataAction = $(this).attr('data-action');
	doCopy(dataType,dataAction,(copiedText)=>{
		window.close();
	});
}

function onSettingsClick(e){
	openSettings();
}

function renderMenu(dataTypes, selectedDataType, config){
	const menuHtml = dataTypes
						.sort((item1,item2)=>item1.ordNum - item2.ordNum)
						.map((item)=>{
		const allCol = `<div class="pure-u-8-24">
							<button class="pure-button text-center pure-button-${config.size}" 
									data-type="${item.dataType}" 
									data-action="all">All Tabs </button>
						</div>
					`;

		const singleCol = `<div class="pure-u-16-24">
								<button class="pure-button text-left pure-button-${config.size}"  
										data-type="${item.dataType}" 
										data-action="single">Copy ${item.description} <span class="check">${selectedDataType === item.dataType ? '&#10003;':'&nbsp;'}</span></button>
							</div>
						   `;
		if (config.all === 'left'){
			return `<div class="pure-g">${allCol}${singleCol}</div>`;
		}
		return `<div class="pure-g">${singleCol}${allCol}</div>`;
	}).join('\n');
	return `<div class="wrapper-${config.size}">
				${menuHtml}
				<button id="settings" class="pure-button text-center pure-button-${config.size}">Settings </button>
			</div>`;
}

/////////////////////////////////////////////////////////////////////
// General DOM Listener
document.addEventListener('DOMContentLoaded', ()=>{
	getConfigs((conf)=>{
		getDataTypes('dash', Lookup.DataTypes, Lookup.DefaultConfig, (dataType, dataTypes)=>{
			$('#menu').html(renderMenu(dataTypes, dataType, conf));
			$('.pure-button').on('click', onClick);
			$('#settings').on('click', onSettingsClick);
		});
	});
});