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
						var getThis = facebookupdate.getFacebook;
						break;
					case 'Twitter':
						var getThis = twitterupdate.getTwitter;
						break;
					case 'Instagram':
						var getThis = instaupdate.getInsta;
						break;
					default:
						break;
				}
				checkWhenDone(network.ids, function(id, doneCallback) {
					getThis(id, function(posts) {
						saveData(network.type, collection_name, posts, id, doneCallback);
					});
				}, function() {
					lib.loggit(network.type + ' call finished for ' + collection_name, doneCallback);
				});

			}, next);
		});
	},
};

function saveData(type, collection_name, posts, id, doneCallback) {
	if (!posts.length > 0) {
		console.log('no ' + type + ' found for ' + id);
		doneCallback();
	}
	lib.saveData(collection_name, posts, function() {
		console.log(type + ' data saved for ' + id);
		doneCallback();
	});
}

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
