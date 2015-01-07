"use strict";

/**
 * Module dependencies
 */

var request = require("co-request");
var Image = require("magician");
var exec = require("co-exec");

var util = require("./util");


/**
 * Thumbbot
 */

var Thumbbot = function Thumbbot(path) {
  this.path = path;
  this.options = {};
};

Thumbbot.prototype.format = function (format) {
  this.options.format = format;

  return this;
};

Thumbbot.prototype.width = function (width) {
  if (!this.options.resize) this.options.resize = {};

  this.options.resize.width = width;

  return this;
};

Thumbbot.prototype.height = function (height) {
  if (!this.options.resize) this.options.resize = {};

  this.options.resize.height = height;

  return this;
};

Thumbbot.prototype.resize = function (width, height) {
  this.options.resize = { width: width, height: height };

  return this;
};

Thumbbot.prototype.window = function (width, height) {
  this.options.window = { width: width, height: height };

  return this;
};

Thumbbot.prototype.seek = function (position) {
  this.options.seek = position;

  return this;
};

Thumbbot.prototype.crop = function (x, y, width, height) {
  this.options.crop = { x: x, y: y, width: width, height: height };

  return this;
};

Thumbbot.prototype.disable = function (feature) {
  if (!this.options.disable) this.options.disable = {};

  this.options.disable[feature] = true;
};

Thumbbot.prototype.type = function () {
  var extension = util.parseExtension(this.path);

  switch (extension) {
    case "mp4":
    case "3gp":
    case "mov":
    case "avi":
      return "video";

    case "jpeg":
    case "jpg":
    case "png":
    case "gif":
    case "tiff":
      return "image";

    default:
      return "page";
  }
};

Thumbbot.prototype.saveVideo = function (destPath) {
  var seek = this.options.seek || "00:00:01";

  var command = "ffmpeg -i \"" + this.path + "\" -ss \"" + seek + "\" -vframes 1 \"" + destPath + "\"";

  return exec(command);
};

Thumbbot.prototype.savePage = function (destPath) {
  var options = Object.assign({}, this.options);

  options.url = encodeURIComponent(this.path);
  options.destPath = destPath;
  options = JSON.stringify(options);

  var command = ["phantomjs", "--disk-cache=true", "--ignore-ssl-errors=true", "--web-security=false", "--ssl-protocol=TLSv1", __dirname + "/render.js", "'" + options + "'"].join(" ");

  return exec(command);
};

Thumbbot.prototype.saveImage = function (destPath) {
  var image = new Image(this.path);

  var options = this.options;
  var _resize = options.resize;
  var _crop = options.crop;


  if (_resize) {
    image.resize(_resize.width, _resize.height);
    image.fit(options.fit || "clip");
  }

  if (_crop) {
    image.crop(_crop.x, _crop.y, _crop.width, _crop.height);
  }

  return image.save(destPath);
};

Thumbbot.prototype.save = function* (destPath) {
  var _type = this.type();

  if (!destPath) {
    destPath = util.tmpPath(this.options.format);
  }

  switch (_type) {
    case "video":
      yield this.saveVideo(destPath);
      break;

    case "image":
      yield this.saveImage(destPath);
      break;

    case "page":
      yield this.savePage(destPath);
      break;

    default:
      throw new Error("Uknown file type given to Thumbbot");
  }

  return new Image(destPath);
};




/**
 * Module exports
 */

module.exports = Thumbbot;
