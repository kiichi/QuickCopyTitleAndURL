'use strict';
//var queue = []; // use storage?
function onClick(e) {
	//var tabs = [{title:"hello " + new Date(),url:"http://google.com"}];
	var dataType = $(this).attr('data-type');
	var dataAction = $(this).attr('data-action');
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		var txt = 'ERROR - Sorry something went wrong.';
		var mime = (dataType == 'rich') ? 'text/html': 'text/plain';
		if (dataType === 'dash') {
			txt = tabs[0].title + ' - ' + tabs[0].url;
		}
		else if (dataType == 'bracket') {
			txt = '[' + tabs[0].title + '] ' + tabs[0].url;
		}
		else if (dataType == 'html' || dataType == 'rich') {
			txt = '<a href="' + tabs[0].url + '">' + tabs[0].title + '</a>';
		}
		else if (dataType == 'md') {
			txt = '[' + tabs[0].title + '](' + tabs[0].url + ')';
		}
		else if (dataType == 'url') {
			txt = tabs[0].url;
		}
		else if (dataType == 'title') {
			txt = tabs[0].title;
		}

		copyToClip(mime,txt);
		window.close();
	});
	//chrome.tabs.create({"url": "http://google.com"});
	//chrome.tabs.executeScript(null, {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
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

document.addEventListener('DOMContentLoaded', function () {
	$('.menu-item').on('click', onClick);
});
