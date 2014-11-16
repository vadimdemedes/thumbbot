# Thumbbot

Create thumbnails from images, videos and web pages.

![NPM stats](https://nodei.co/npm/thumbbot.png?downloads=true)

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

(The MIT License)

Copyright (c) 2014 Vadim Demedes <vdemedes@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.