var https = require('https');
var db = require('./db');
var _ = require('underscore');
var fs = require('fs');

module.exports = {
	loadAPI: function(options, next) {
		var queryResponse = "";
		https.get(options, function(response) {
			// console.log(response.statusCode);
			if (response.statusCode !== 200) next('bad response from API');
			else {
				response.on('data', function(chunk){
					queryResponse += chunk.toString();
				});
				response.on('end', function (chunk) {
					var feed = JSON.parse(queryResponse).data;
					next(false, feed);
				});
			}
		});
	},
	saveData: function(collection, posts, next) {
		posts.forEach(function(post, index) {
			checkDupe(collection, post, function() {
				db.update(collection, {api_id: post.api_id, api_type: post.api_type}, post, function(err, data) {
					if (err) throw err;
					if (index + 1 === _.size(posts)) {
						next();
					}
				})
			}, function() {
				db.insert(collection, post, function(err, data) {
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
}


function checkDupe (collection, post, whenDuplicate, next) {
	db.findOne(collection, {api_id: post.api_id}, function(err, data) {
		if (_.size(data) > 0) {
			whenDuplicate();
		} else {
			next();
		}
	});
}