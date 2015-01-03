/**
 * Module dependencies
 */

var request = require('co-request');
var Image = require('magician');
var exec = require('co-exec');

var util = require('./util');


/**
 * Thumbbot
 */

class Thumbbot {
  constructor (path) {
    this.path = path;
    this.options = {};
  }
  
  format (format) {
    this.options.format = format;
    
    return this;
  }
  
  width (width) {
    if (!this.options.resize) this.options.resize = {};
    
    this.options.resize.width = width;
    
    return this;
  }
  
  height (height) {
    if (!this.options.resize) this.options.resize = {};

  	this.options.resize.height = height;

  	return this;
  }
  
  resize (width, height) {
    this.options.resize = { width, height };

  	return this;
  }
  
  window (width, height) {
    this.options.window = { width, height };
    
    return this;
  }
  
  seek (position) {
    this.options.seek = position;

  	return this;
  }
  
  crop (x, y, width, height) {
    this.options.crop = { x, y, width, height };
    
    return this;
  }
  
  disable (feature) {
    if (!this.options.disable) this.options.disable = {};
    
    this.options.disable[feature] = true;
  }
  
  type () {
    let extension = util.parseExtension(this.path);

  	switch (extension) {
  		case 'mp4':
  		case '3gp':
  		case 'mov':
  		case 'avi':
  			return 'video';

  		case 'jpeg':
  		case 'jpg':
  		case 'png':
  		case 'gif':
  		case 'tiff':
  			return 'image';

  		default:
  			return 'page';
  	}
  }
  
  saveVideo (destPath) {
    var seek = this.options.seek || '00:00:01';

    var command = `ffmpeg -i "${ this.path }" -ss "${ seek }" -vframes 1 "${ destPath }"`;

  	return exec(command);
  }
  
  savePage (destPath) {
    let options = Object.assign({}, this.options);
    
  	options.url = encodeURIComponent(this.path);
  	options.destPath = destPath;
  	options = JSON.stringify(options);

  	let command = ['phantomjs', '--disk-cache=true',
  								              '--ignore-ssl-errors=true',
  								              '--web-security=false',
  								              '--ssl-protocol=TLSv1',
  								              __dirname + '/render.js',
  								              `'${ options }'`].join(' ');
  	
  	return exec(command);
  }
  
  saveImage (destPath) {
    let image = new Image(this.path);

  	let options = this.options;
  	let { resize, crop } = options;

  	if (resize) {
  		image.resize(resize.width, resize.height);
  		image.fit(options.fit || 'clip');
  	}

  	if (crop) {
  		image.crop(crop.x, crop.y, crop.width, crop.height);
  	}

  	return image.save(destPath);
  }
  
  * save (destPath) {
    let type = this.type();

  	if (!destPath) {
  		destPath = util.tmpPath(this.options.format);
  	}

  	switch (type) {
  		case 'video':
  			yield this.saveVideo(destPath);
  			break;

  		case 'image':
  			yield this.saveImage(destPath);
  			break;

  		case 'page':
  			yield this.savePage(destPath);
  			break;

  		default:
  			throw new Error('Uknown file type given to Thumbbot');
  	}

  	return new Image(destPath);
  }
}


/**
 * Module exports
 */

module.exports = Thumbbot;
