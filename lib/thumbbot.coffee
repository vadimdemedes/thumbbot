Magician = require 'magician'
googleImages = require 'google-images'
videoThumb = require 'video-thumb'
fs = require 'fs'
exec = require('child_process').exec

String::extensionFromFilename = ->
	@substr(@split('.')[0].length + 1, @length).toString()

String::filename = ->
	@replace /^.*[\/\\]/g, ''

String::filenameWithoutExtension = ->
	@split('.')[0].toString()

class Thumbbot
	constructor: (@srcPath, @destPath) ->
		@destPath = @srcPath if not @destPath
	
	set: (@options = {}) ->
		@options.x = 0 if not @options.x
		@options.y = 0 if not @options.y
		@options.width = 200 if not @options.width
		@options.height = 200 if not @options.height
		@options.method = 'resize' if not @options.method
		@options.position = '00:00:01' if not @options.position
	
	snap: (callback) ->
		do @set
		if /^http/.test @srcPath
			that = @
			return exec "phantomjs #{ __dirname }/sh/render.js #{ @srcPath } #{ @options.width } #{ @options.height } #{ @destPath }", ->
				image = new Magician that.destPath, that.destPath
				if that.options.method is 'resize'
					image.resizeTo that.options.width, that.options.height, ->
						do callback
				if that.options.method is 'crop'
					image.cropFrom that.options.x, that.options.y, that.options.width, that.options.height, ->
						do callback
			
		switch @srcPath.extensionFromFilename()
			when 'png', 'jpeg', 'jpg', 'gif'
				image = new Magician @srcPath, @destPath
				if @options.method is 'resize'
					image.resizeTo @options.width, @options.height, ->
						do callback
				if @options.method is 'crop'
					image.cropFrom @options.x, @options.y, @options.width, @options.height, ->
						do callback
			
			when 'mp4', 'avi', '3gp'
				videoThumb.extract @srcPath, @destPath, @options.position, "#{ @options.width }x#{ @options.height }", ->
					do callback
			
			when 'mp3', 'aac', 'wav'
				filename = @srcPath.filename()
				cleanFilename = filename.filenameWithoutExtension()
				that = @
				googleImages.search cleanFilename, (err, images) ->
					if images[0]
						images[0].writeTo that.destPath, ->
							image = new Magician that.destPath, that.destPath
							if that.options.method is 'resize'
								image.resizeTo that.options.width, that.options.height, ->
									do callback
							if that.options.method is 'crop'
								image.cropFrom that.options.x, that.options.y, that.options.width, that.options.height, ->
									do callback
					else
						callback yes # error, no images found
			else
				callback yes

module.exports = Thumbbot