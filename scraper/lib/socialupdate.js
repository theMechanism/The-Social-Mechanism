var _ = require('underscore');
var db = require('./db');
var lib = require('./lib');

var facebookupdate = require('./facebookupdate');
var twitterupdate = require('./twitterupdate');
var instaupdate = require('./instaupdate');

module.exports = {
	init: function(socialIDs, next) {
		var collection_name = socialIDs.collection_name;
		db.open(function(err) {
			if (err) throw err;
			checkWhenDone(socialIDs.networks, function(network, doneCallback) {
				switch (network.type) {
					case 'Facebook':
						checkWhenDone(network.ids, function(id, doneCallback) {
							facebookupdate.getFacebook(id, function(fbPosts) {
								lib.saveData(collection_name, fbPosts, function() {
									console.log('Facebook data saved for ' + id);
									doneCallback();
								});
							});
						}, function() {
							lib.loggit('Facebook call finished for ' + collection_name, doneCallback);
						});
						break;
					case 'Twitter':
						checkWhenDone(network.ids, function(id, doneCallback) {
							twitterupdate.getTwitter(id, function(tweets) {
								lib.saveData(collection_name, tweets, function() {
									console.log('Twitter data saved for ' + id);
									doneCallback();
								});
							});
						}, function() {
							lib.loggit('Twitter call finished for ' + collection_name, doneCallback);
						});					
						break;
					case 'Instagram':
						checkWhenDone(network.ids, function(id, doneCallback) {
							instaupdate.getInsta(id, function(grams) {
								lib.saveData(collection_name, grams, function() {
									console.log('Instagram data saved for ' + id);
									doneCallback();
								});
							});
						}, function() {
							lib.loggit('Instagram call finished for ' + collection_name, doneCallback);
						});
						break;
					default:
						break;
				}
			}, next);
		});
	},
};

function checkWhenDone(array, toDo, whenDone) {
	var length = _.size(array);
	var counter = 0;
	array.forEach(function(element) {
		toDo(element, function() {
			counter++;
			if (counter === length) {
				whenDone();
			}
		});
	});
}
