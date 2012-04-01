page = require('webpage').create()

url = phantom.args[0]
width = phantom.args[1]
height = phantom.args[2]
output = phantom.args[3]

page.viewportSize=
	width: width
	height: height

page.open url, ->
	page.render output
	do phantom.exit