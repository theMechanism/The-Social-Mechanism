var assert = require("assert");
var should = require("should");
var _ = require('underscore');
var db = require('../lib/db');
var lib = require('../lib/lib');

// describe('DB', function(){
// 	describe('#open()', function(){
// 		it('should open without error', function(done) {
// 			db.open(done);
// 		});
// 	});
// 	describe('#findOne()', function() {
// 		it('should return one record', function(done) {
// 			db.findOne('socials', {}, function(err, data) {
// 				if (err) throw err;
// 				else if(data._id)
// 					done();
// 				else
// 					throw 'no id found';
// 			});
// 		});
// 	});
// 	describe('#find()', function() {
// 		it('should return ten rows', function(done) {
// 			db.find('socials', {}, {}, 10, function(err, data) {
// 				if (err) done(err);
// 				assert.equal(10, _.size(data));
// 				done();
// 			});
// 		});
// 		it('should return ten sorted rows', function(done) {
// 			db.find('socials', {}, { api_date: -1 }, 10, function(err, data) {
// 				if (err) done(err);
// 				data[0].api_date.should.be.above(data[1].api_date);
// 				_.size(data).should.be.exactly(10);
// 				done();
// 			});
// 		});
// 		it('should return 10 facebook results', function(done) {
// 			db.find('socials', {api_type: 'Facebook'}, { api_date: -1 }, 10, function(err, data) {
// 				if (err) done(err);
// 				_.each(data, function(row, i) {
// 					if (row.api_type !== "Facebook")
// 						throw "Row " + i + " does not match Facebook";
// 				});
// 				_.size(data).should.be.exactly(10);
// 				done();
// 			});
// 		});
// 	});
// });

describe('lib', function(){
	describe('#open()', function(){
		it('should open without error', function(done) {
			db.open(done);
		});
	});
	describe('#getSocials()', function(){
		it('should return 20 sorted rows', function(done) {
			lib.getSocials('social_mech', function(err, data) {
				if (err) done(err);
				_.size(data).should.be.exactly(20);
				data[0].api_date.should.be.above(data[1].api_date);
				done();
			});
		});
	});
	// describe('#getXML()', function() {
	// 	it('should return an xml', function(done) {
	// 		lib.getXML('http://artistdata.sonicbids.com//the-mechanism/shows/xml/future', done);
	// 	});
	// 	it('should return an array of shows', function(done) {
	// 		lib.getXML('http://artistdata.sonicbids.com//the-mechanism/shows/xml/future', function(err, data) {
	// 			console.log(data);
	// 			data.should.be.an.instanceOf(Array);
	// 			done();
	// 		});
	// 	});
	// });
});
