/**
 * Module dependencies
 */

var system = require('system');


// arguments
var params = JSON.parse(system.args[1]);

var page = require('webpage').create();

// features
var window = params.window;
var disable = params.disable;
var crop = params.crop;

if (window) {
	page.viewportSize = params.window;
}

if (crop) {
	page.clipRect = {
		top: crop.y,
		left: crop.x,
		width: crop.width,
		height: crop.height
	};
}

if (disable) {
	if (disable.javascript) {
		page.settings.javascriptEnabled = false;
	}
	
	if (disable.images) {
		page.settings.loadImages = false;
	}
}

var url = decodeURIComponent(params.url);
page.open(url, function() {
	page.render(params.destPath);
	phantom.exit();
});