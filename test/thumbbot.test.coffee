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
	do process.exit

describe 'Thumbbot', ->
	it 'should create thumbnail from image', (done) ->
		return do done if paths.image.length is 0
		bot = new Thumbbot paths.image[0], paths.image[1]
		bot.set width: 200, height: 150
		bot.snap ->
			fs.stat paths.image[1], (err, stat) ->
				assert.ok stat
				do done
	
	it 'should create thumbnail from video', (done) ->
		return do done if paths.video.length is 0
		bot = new Thumbbot paths.video[0], paths.video[1]
		bot.set width: 200, height: 150, position: '00:00:35'
		bot.snap ->
			fs.stat paths.video[1], (err, stat) ->
				assert.ok stat
				do done
	
	it 'should create thumbnail from audio', (done) ->
		return do done if paths.audio.length is 0
		bot = new Thumbbot paths.audio[0], paths.audio[1]
		bot.set width: 200, height: 150
		bot.snap ->
			fs.stat paths.audio[1], (err, stat) ->
				assert.ok stat
				do done
	
	it 'should create thumbnail from web page', (done) ->
		return do done if paths.web.length is 0
		bot = new Thumbbot paths.web[0], paths.web[1]
		bot.set width: 200, height: 150, viewport: width: 1024, height: 768
		bot.snap ->
			fs.stat paths.web[1], (err, stat) ->
				assert.ok stat
				do done