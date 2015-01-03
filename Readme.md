# Thumbbot

Create thumbnails from images, videos and web pages.

[![Circle CI](https://circleci.com/gh/vdemedes/thumbbot.svg?style=svg)](https://circleci.com/gh/vdemedes/thumbbot)

## Installation

```npm install thumbbot --save```

## Requirements

- PhantomJS - web page snapshots
- ImageMagick - image thumbnails
- ffmpeg - video snapshots

## Usage

```javascript
var Thumbbot = require('thumbbot');
```

### Images

#### Resize

```javascript
var image = new Thumbbot('image.png');
image.resize(200, 200); // width, height

// or

image.width(200);
     .height(200);

var thumbnail = yield image.save();
```

#### Crop

```javascript
var image = new Thumbbot('image.png');
image.crop(0, 0, 200, 200); // x, y, width, height

var thumbnail = yield image.save();
```
	
### Videos

```javascript
var video = new Thumbbot('video.mp4');
video.seek('00:01:24'); // take a snapshot at 01:24

var thumbnail = yield video.save();
```

### Web pages

```javascript
var page = new Thumbbot('http://smashingmagazine.com');
page.window(1024, 768) // specify browser window size, optional
    .crop(100, 100, 400, 400) // specify an area to capture, x, y, width & height, optional
    .disable('javascript') // disable javascript, optional
    .disable('images'); // disable loading images, optional

var thumbnail = yield page.save();
```

## Tests

To run tests execute:

```npm test```

## License

Thumbbot is released under the MIT License.
