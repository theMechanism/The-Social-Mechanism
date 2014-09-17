var _ = require('underscore');
var db = require('./lib/db');
var lib = require('./lib/lib');

var facebookupdate = require('./facebookupdate');
var twitterupdate = require('./twitterupdate');
var instaupdate = require('./instaupdate');

module.exports = {
	init: function(socialIDs, next) {
		db.open(socialIDs.db_name, function(err) {
			if (err) throw err;
			checkWhenDone(socialIDs.networks, function(network, doneCallback) {
				switch (network.type) {
					case 'Facebook':
						checkWhenDone(network.ids, function(id, doneCallback) {
							facebookupdate.getFacebook(id, function() {
								console.log('Facebook data saved for ' + id);
								doneCallback();
							});
						}, function() {
							lib.loggit('Facebook call finished for ' + socialIDs.db_name, doneCallback);
						});
						break;
					case 'Twitter':
						checkWhenDone(network.ids, function(id, doneCallback) {
							twitterupdate.getTwitter(id, function() {
								console.log('Twitter data saved for ' + id);
								doneCallback();
							});
						}, function() {
							lib.loggit('Twitter call finished for ' + socialIDs.db_name, doneCallback);
						});					
						break;
					case 'Instagram':
						checkWhenDone(network.ids, function(id, doneCallback) {
							instaupdate.getInsta(id, function() {
								console.log('Instagram data saved for ' + id);
								doneCallback();
							});
						}, function() {
							lib.loggit('Instagram call finished for ' + socialIDs.db_name, doneCallback);
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
