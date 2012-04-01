Thumbbot = require '../lib/thumbbot'
fs = require 'fs'
assert = require 'assert'

paths= # specify path for your images, video, audios here for testing
	image: [] # sourcePath, destPath
	video: []
	audio: []
	web: [] # link, destPath

if (paths.image.length + paths.video.length + paths.audio.length + paths.web.length) != 8
	console.log 'You should set paths for each of the content types to get correct test results.'

describe 'Thumbbot', ->
	it 'should create thumbnail from image', (done) ->
		bot = new Thumbbot paths.image[0], paths.image[1]
		bot.set width: 200, height: 150
		bot.snap ->
			fs.stat paths.image[1], (err, stat) ->
				assert.ok stat
				do done
	
	it 'should create thumbnail from video', (done) ->
		bot = new Thumbbot paths.video[0], paths.video[1]
		bot.set width: 200, height: 150, position: '00:00:01'
		bot.snap ->
			fs.stat paths.image[1], (err, stat) ->
				assert.ok stat
				do done
	
	it 'should create thumbnail from audio', (done) ->
		bot = new Thumbbot paths.audio[0], paths.audio[1]
		bot.set width: 200, height: 150
		bot.snap ->
			fs.stat paths.image[1], (err, stat) ->
				assert.ok stat
				do done
	
	it 'should create thumbnail from web page', (done) ->
		bot = new Thumbbot paths.web[0], paths.web[1]
		bot.set width: 200, height: 150
		bot.snap ->
			fs.stat paths.image[1], (err, stat) ->
				assert.ok stat
				do done