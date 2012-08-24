(function() {
  var Magician, Thumbbot, exec, googleImages;

  Magician = require('magician');

  googleImages = require('google-images');

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
      this.options = {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        method: 'resize',
        position: '00:00:01',
        viewport: {
          width: 1024,
          height: 768
        }
      };
    }

    Thumbbot.prototype.set = function(options) {
      var key, _results;
      _results = [];
      for (key in options) {
        _results.push(this.options[key] = options[key]);
      }
      return _results;
    };

    Thumbbot.prototype.handleImage = function(srcPath, destPath, callback) {
      var image;
      image = new Magician(srcPath, destPath);
      if (this.options.method === 'resize') {
        image.resizeTo(this.options.width, this.options.height, function() {
          if (callback) return callback();
        });
      }
      if (this.options.method === 'crop') {
        return image.cropFrom(this.options.x, this.options.y, this.options.width, this.options.height, function() {
          if (callback) return callback();
        });
      }
    };

    Thumbbot.prototype.snap = function(callback) {
      var cleanFilename, filename, that;
      that = this;
      if (/^http/.test(this.srcPath)) {
        return exec("phantomjs " + __dirname + "/sh/render.js " + this.srcPath + " " + this.options.viewport.width + " " + this.options.viewport.height + " " + this.destPath, function() {
          return that.handleImage(that.destPath, that.destPath, callback);
        });
      }
      switch (this.srcPath.extensionFromFilename()) {
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
          return this.handleImage(this.srcPath, this.destPath, callback);
        case 'mp4':
        case 'avi':
        case '3gp':
          return exec("ffmpeg -ss " + this.options.position + " -vframes 1 -i " + this.srcPath + " -y -f image2 " + this.destPath, function() {
            return that.handleImage(that.destPath, that.destPath, callback);
          });
        case 'mp3':
        case 'aac':
        case 'wav':
          filename = this.srcPath.filename();
          cleanFilename = filename.filenameWithoutExtension();
          return googleImages.search(cleanFilename, function(err, images) {
            if (images[0]) {
              return images[0].writeTo(that.destPath, function() {
                return that.handleImage(that.destPath, that.destPath, callback);
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

}).call(this);
