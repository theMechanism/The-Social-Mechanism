var http = require('http');
var https = require('https');
var fs = require('fs');
var twitter = require('ntwitter');
var _ = require('underscore');
var db = require('./lib/db');

module.exports = {
	init: function(IDs, next) {
		db.open(function() {
			var saveIndex = 0;
			_.each(IDs, function(ID, index) {
				next(ID, function() {
					saveIndex++;
					if (saveIndex === _.size(IDs))
						return true;
				});
			});
		});
	},
	loadAPI: function(options, next) {
		var queryResponse = "";
		https.get(options, function(response) {
			// console.log(response.statusCode);
			response.on('data', function(chunk){
				queryResponse += chunk.toString();
			});
			response.on('end', function (chunk) {
				var feed = JSON.parse(queryResponse).data;
				next(feed);
			});
		});
	},
	saveData: function(posts, next) {
		_.each(posts, function(post, index) {
			checkDupe(post, function() {
				db.update('socials', {api_id: post.api_id, api_type: post.api_type}, post, function(err, data) {
					if (err) throw err;
					if (index + 1 === _.size(posts)) {
						next();
					}
				})
			}, function() {
				db.insert('socials', post, function(err, data) {
					if (err) throw err;
					if (index + 1 === _.size(posts)) {
						next();
					}
				});
			});
		});
	},
	loggit: function(logger, next) {
		fs.readFile('./error.log', function (err, data) {
			if (err) {
				fs.writeFile('./error.log', "\n:: " + new Date() + " ::\n" + logger + "\n", function (err) {
					if (err) throw err;
					if (next) next();
				});
			} else {
				fs.writeFile('./error.log', data + "\n:: " + new Date() + " ::\n" + logger + "\n", function (err) {
					if (err) throw err;
					if (next) next();
				});
			}
		});
	}
};


function checkDupe (post, whenDuplicate, next) {
	db.findOne('socials', {api_id: post.api_id}, function(err, data) {
		if (_.size(data) > 0) {
			whenDuplicate();
		} else {
			next();
		}
	});
}