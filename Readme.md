# Thumbbot

Create thumbnails from images, videos, audio(google images search) and web pages.

# Installation

`npm install thumbbot`

# Requirements

- PhantomJS - web page snapshots
- ImageMagick - image thumbnails
- ffmpeg - video snapshots

# Usage

```coffee-script
Thumbbot = require 'thumbbot'

# Images

bot = new Thumbbot 'image.png', 'image_thumb.png'
bot.set width: 200, height: 150

# Resizing
bot.set method: 'resize'
bot.snap (err) ->
	# done

bot.set method: 'crop', x: 0, y: 0
bot.snap (err) ->
	# done
	
# Videos

bot = new Thumbbot 'video.mp4', 'video_thumb.png'
bot.set width: 200, height: 150
bot.set position: '00:05:04'
bot.snap (err) ->
	# done

# Audio

bot = new Thumbbot 'Great Nas Song.mp3', 'nas.png'
bot.set width: 200, height: 150
bot.snap (err) ->
	# done

# Web pages

bot = new Thumbbot 'http://google.com', 'google.png'
bot.set width: 200, height: 150, viewport: width: 1024, height: 768
# You can apply same techniques here for resizing or cropping the resulting image
bot.snap (err) ->
	# done

```

# License

(The MIT License)

Copyright (c) 2011 Vadim Demedes <sbioko@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.