var Magician, Thumbbot, exec, fs, googleImages, videoThumb;

Magician = require('magician');

googleImages = require('google-images');

videoThumb = require('video-thumb');

fs = require('fs');

exec = require('child_process').exec;

String.prototype.extensionFromFilename = function() {
  return this.substr(this.split('.')[0].length + 1, this.length).toString();
};

String.prototype.filename = function() {
  return this.replace(/^.*[\/\\]/g, '');
};

String.prototype.filenameWithoutExtension = function() {
  return this.split('.')[0].toString();
};

Thumbbot = (function() {

  function Thumbbot(srcPath, destPath) {
    this.srcPath = srcPath;
    this.destPath = destPath;
    if (!this.destPath) this.destPath = this.srcPath;
  }

  Thumbbot.prototype.set = function(options) {
    this.options = options != null ? options : {};
    if (!this.options.x) this.options.x = 0;
    if (!this.options.y) this.options.y = 0;
    if (!this.options.width) this.options.width = 200;
    if (!this.options.height) this.options.height = 200;
    if (!this.options.method) this.options.method = 'resize';
    if (!this.options.position) return this.options.position = '00:00:01';
  };

  Thumbbot.prototype.snap = function(callback) {
    var cleanFilename, filename, image, that;
    this.set();
    if (/^http/.test(this.srcPath)) {
      that = this;
      return exec("phantomjs " + __dirname + "/sh/render.js " + this.srcPath + " " + this.options.width + " " + this.options.height + " " + this.destPath, function() {
        var image;
        image = new Magician(that.destPath, that.destPath);
        if (that.options.method === 'resize') {
          image.resizeTo(that.options.width, that.options.height, function() {
            return callback();
          });
        }
        if (that.options.method === 'crop') {
          return image.cropFrom(that.options.x, that.options.y, that.options.width, that.options.height, function() {
            return callback();
          });
        }
      });
    }
    switch (this.srcPath.extensionFromFilename()) {
      case 'png':
      case 'jpeg':
      case 'jpg':
      case 'gif':
        image = new Magician(this.srcPath, this.destPath);
        if (this.options.method === 'resize') {
          image.resizeTo(this.options.width, this.options.height, function() {
            return callback();
          });
        }
        if (this.options.method === 'crop') {
          return image.cropFrom(this.options.x, this.options.y, this.options.width, this.options.height, function() {
            return callback();
          });
        }
        break;
      case 'mp4':
      case 'avi':
      case '3gp':
        return videoThumb.extract(this.srcPath, this.destPath, this.options.position, "" + this.options.width + "x" + this.options.height, function() {
          return callback();
        });
      case 'mp3':
      case 'aac':
      case 'wav':
        filename = this.srcPath.filename();
        cleanFilename = filename.filenameWithoutExtension();
        that = this;
        return googleImages.search(cleanFilename, function(err, images) {
          if (images[0]) {
            return images[0].writeTo(that.destPath, function() {
              image = new Magician(that.destPath, that.destPath);
              if (that.options.method === 'resize') {
                image.resizeTo(that.options.width, that.options.height, function() {
                  return callback();
                });
              }
              if (that.options.method === 'crop') {
                return image.cropFrom(that.options.x, that.options.y, that.options.width, that.options.height, function() {
                  return callback();
                });
              }
            });
          } else {
            return callback(true);
          }
        });
      default:
        return callback(true);
    }
  };

  return Thumbbot;

})();

module.exports = Thumbbot;
