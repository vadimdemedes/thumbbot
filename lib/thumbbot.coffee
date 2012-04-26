Magician = require 'magician'
googleImages = require 'google-images'
{exec} = require('child_process')

String::extensionFromFilename = ->
	@substr(@split('.')[0].length + 1, @length).toString()

String::filename = ->
	@replace /^.*[\/\\]/g, ''

String::filenameWithoutExtension = ->
	@split('.')[0].toString()

class Thumbbot
	
	constructor: (@srcPath, @destPath) ->
		@destPath = @srcPath if not @destPath
		@options=
			x: 0
			y: 0
			width: 200
			height: 200
			method: 'resize'
			position: '00:00:01'
			viewport:
				width: 1024
				height: 768
	
	set: (options) ->
		for key of options
			@options[key] = options[key]
	
	handleImage: (srcPath, destPath, callback) ->
		image = new Magician srcPath, destPath
		if @options.method is 'resize'
			image.resizeTo @options.width, @options.height, ->
				do callback if callback
		
		if @options.method is 'crop'
			image.cropFrom @options.x, @options.y, @options.width, @options.height, ->
				do callback if callback
	
	snap: (callback) ->
		that = @
		if /^http/.test @srcPath
			return exec "phantomjs #{ __dirname }/sh/render.js #{ @srcPath } #{ @options.viewport.width } #{ @options.viewport.height } #{ @destPath }", ->
				that.handleImage destPath, destPath, callback
			
		switch @srcPath.extensionFromFilename()
			when 'png', 'jpeg', 'jpg', 'gif'
				@handleImage @srcPath, @destPath, callback
			
			when 'mp4', 'avi', '3gp'
				return exec "ffmpeg -ss #{ @options.position } -vframes 1 -i #{ @srcPath } -y -f image2 #{ @destPath }", ->
					that.handleImage that.destPath, that.destPath, callback
			
			when 'mp3', 'aac', 'wav'
				filename = @srcPath.filename()
				cleanFilename = filename.filenameWithoutExtension()
				googleImages.search cleanFilename, (err, images) ->
					if images[0]
						images[0].writeTo that.destPath, ->
							that.handleImage that.destPath, that.destPath, callback
					else
						callback yes # error, no images found
			else
				callback yes

module.exports = Thumbbot