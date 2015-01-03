/**
 * Test dependencies
 */

require('chai').should();
require('mocha-generators')();

var Thumbbot = require('../');


/**
 * Tests
 */

describe ('Thumbbot', function () {
	describe ('Images', function () {
		it ('should take a thumbnail from image using .crop()', function *() {
			let image = new Thumbbot(__dirname + '/fixtures/image.jpeg');
			image.crop(100, 200, 200, 200);
			
			let thumbnail = yield image.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(200);
			meta.height.should.equal(200);
			meta.format.should.equal('JPEG');
		});
		
		it ('should take a thumbnail from image using .resize()', function *() {
			let image = new Thumbbot(__dirname + '/fixtures/image.jpeg');
			image.resize(200, 200);
			
			let thumbnail = yield image.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(200);
			meta.height.should.equal(200);
			meta.format.should.equal('JPEG');
		});
	});
	
	describe ('Video', function () {
		it ('should take a thumbnail from video', function *() {
			let video = new Thumbbot(__dirname + '/fixtures/video.mp4');
			
			let thumbnail = yield video.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(640);
			meta.height.should.equal(360);
			meta.format.should.equal('JPEG');
		});
	});
	
	describe ('Web Pages', function () {
		it ('should take a screenshot of a web page', function *() {
			this.timeout(10000);
			
			let page = new Thumbbot('http://smashingmagazine.com');
			
			let thumbnail = yield page.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(400);
			meta.height.should.be.above(8000);
			meta.format.should.equal('JPEG');
		});
		
		it ('should take a screenshot of a web page while setting window size', function *() {
			this.timeout(10000);
			
			let page = new Thumbbot('http://smashingmagazine.com');
			page.window(1024, 768);
			
			let thumbnail = yield page.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(1024);
			meta.height.should.be.above(4000);
			meta.format.should.equal('JPEG');
		});
		
		it ('should take a screenshot of web page\'s selected area', function *() {
			this.timeout(10000);
			
			let page = new Thumbbot('http://smashingmagazine.com');
			page.crop(0, 0, 300, 300)
			    .window(1024, 768);
			
			let thumbnail = yield page.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(300);
			meta.height.should.equal(300);
			meta.format.should.equal('JPEG');
		});
		
		it ('should take a screenshot of a web page with javascript disabled', function *() {
			this.timeout(10000);
			
			let page = new Thumbbot('http://smashingmagazine.com');
			page.window(1024, 768)
			    .disable('javascript');
			
			let thumbnail = yield page.save();
			let meta = yield thumbnail.meta();
			meta.width.should.equal(1024);
			meta.height.should.be.above(4000);
			meta.format.should.equal('JPEG');
		});
		
		it ('should take a screenshot of a web page with images disabled', function *() {
			this.timeout(10000);
			
			let page = new Thumbbot('http://smashingmagazine.com');
			page.window(1024, 768)
			    .disable('images');
			
			var thumbnail = yield page.save();
			var meta = yield thumbnail.meta();
			meta.width.should.equal(1024);
			meta.height.should.be.above(4000);
			meta.format.should.equal('JPEG');
		});
	});
});