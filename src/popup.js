'use strict';
// TODO: append mode and toastr
//var queue = []; // use storage?
function onClick(e) {
	var dataType = $(this).attr('data-type');
	var dataAction = $(this).attr('data-action');
	var options = {currentWindow:true};
	if (dataAction == 'single'){
		options['active'] = true;
	}
	chrome.tabs.query(options, function (tabs) {
		var allTxt = '';
		for (var i=0; i<tabs.length; i++){
			var txt = 'ERROR - Sorry something went wrong.';
			var mime = (dataType == 'rich') ? 'text/html': 'text/plain';
			var tab_title = tabs[i].title;
			var tab_url = tabs[i].url;

			// remove leading "notification counts" that websites have started to add
			//  For info, watch : https://www.youtube.com/watch?v=bV0QNuhN9fU&t=64s
			var matches = tab_title.match(/^(\([0-9]+\) )?(.*)$/);			
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
				var prefix = '';
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
			allTxt += txt;
			if (tabs.length > 1){
				allTxt += (dataType == 'html' || dataType == 'rich') ? '<br/>\n' : '\n';
			}
		}

		copyToClip(mime,allTxt);
		window.close();
	});
}

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

document.addEventListener('DOMContentLoaded', function () {
	$('.pure-button').on('click', onClick);
});
