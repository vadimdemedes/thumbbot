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
bot.set width: 200, height: 150
# You can apply same techniques here for resizing or cropping the resulting image
bot.snap (err) ->
	# done

```