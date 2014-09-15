var assert = require("assert");
var should = require("should");
var _ = require('underscore');
var db = require('../lib/db');
var socialUpdate = require('../socialupdate');
var facebookUpdate = require('../facebookupdate');

describe('Update Facebook', function() {
	describe('#open()', function(){
		it('should open without error', function(done) {
			db.open(done);
		});
	});
	describe('#fb getFacebook', function() {
		it('should return the formatted object for DB', function(done) {
			facebookUpdate.getFacebook('yotd12', function(data) {			
				data.should.be.an.Array;
				data[0].should.be.an.Object;
				data[0].api_id.should.be.ok;
				done();
			});
		});
	});
	describe('#db findOne()', function() {
		it('should return records', function(done) {
			db.findOne('socials', {}, function(err, data) {
				if (err) throw err;
				data.should.be.an.Array;
				_.size(data).should.be.eql(1);
				if(data[0].api_id)
					done();
				else
					throw 'no id found';
			});
		});
	});
	// describe('#su saveData', function() {
	// 	it('should return a matching record', function(done) {
	// 		socialUpdate.saveData([{api_id: '128422577569_10152564026257570'}], function(err, data) {
	// 			done();
	// 		});
	// 	});
	// 	it('should attempt to save', function(done) {
	// 		socialUpdate.saveData([{api_id: '128422577569_101525640232370', test: 'hello'}], function(data) {
	// 			done();
	// 		});
	// 	});
	// });
});
// describe('Social Update', function() {
// 	describe('#loadAPI', function() {
// 		it('should get a response from Facebook', function(done) {
// 			socialUpdate.loadAPI({
// 						host: 'graph.facebook.com',
// 						path: '/themechanism/feed?limit=10&access_token=272762356262357|f2a5d6e2611d7ce436a2ef39e43d9847'
// 					}, function(data) {
// 				data.should.be.an.Array;
// 				data[0].should.be.an.Object;
// 				data[0].id.should.be.ok;
// 				_.size(data).should.be.eql(10);
// 				done();
// 			});
// 		});
// 	});
// });
