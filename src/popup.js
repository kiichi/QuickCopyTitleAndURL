'use strict';
// TODO: append mode and toastr
//var queue = []; // use storage?
function onClick(e) {
	var dataType = $(this).attr('data-type');
	var dataAction = $(this).attr('data-action');
	chrome.tabs.query({
		active: (dataAction == 'single'),
		currentWindow: true
	}, function (tabs) {
		var allTxt = '';
		for (var i=0; i<tabs.length; i++){
			var txt = 'ERROR - Sorry something went wrong.';
			var mime = (dataType == 'rich') ? 'text/html': 'text/plain';
			if (dataType === 'dash') {
				txt = tabs[i].title + ' - ' + tabs[i].url;
			}
			else if (dataType == 'bracket') {
				txt = '[' + tabs[i].title + '] ' + tabs[i].url;
			}
			else if (dataType == 'newline') {
				txt = tabs[i].title + '\n' + tabs[i].url;
			}
			else if (dataType == 'html' || dataType == 'rich') {
				txt = '<a href="' + tabs[i].url + '">' + tabs[i].title + '</a>';
			}
			else if (dataType == 'md') {
				var prefix = '';
				if (isImage(tabs[i].url)){
					prefix = '!';
				}
				txt = prefix + '[' + tabs[i].title + '](' + tabs[i].url + ')';
			}
			else if (dataType == 'bb') {
				if (isImage(tabs[i].url)){
					txt = '[img]'+tabs[i].url+'[/img]';
				}
				else {
					txt = '[url='+tabs[i].url+']'+tabs[i].title+'[/url]';
				}
			}
			else if (dataType == 'url') {
				txt = tabs[i].url;
			}
			else if (dataType == 'title') {
				txt = tabs[i].title;
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