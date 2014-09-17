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
			checkWhenDone(socialIDs.networks, function(network, check) {
				switch (network.type) {
					case 'Facebook':
						checkWhenDone(network.ids, function(id, checkNet) {
							facebookupdate.getFacebook(id, function() {
								console.log('Facebook data saved for ' + id);
								checkNet();
							});
						}, function() {
							networkFinish('Facebook call finished for ' + socialIDs.db_name, check);
						});
						break;
					case 'Twitter':
						checkWhenDone(network.ids, function(id, checkNet) {
							twitterupdate.getTwitter(id, function() {
								console.log('Twitter data saved for ' + id);
								checkNet();
							});
						}, function() {
							networkFinish('Twitter call finished for ' + socialIDs.db_name, check);
						});					
						break;
					case 'Instagram':
						checkWhenDone(network.ids, function(id, checkNet) {
							instaupdate.getInsta(id, function() {
								console.log('Instagram data saved for ' + id);
								checkNet();
							});
						}, function() {
							networkFinish('Instagram call finished for ' + socialIDs.db_name, check);
						});
						break;
					default:
						break;
				}
			}, next);
		});
	},
};

function checkWhenDone(array, toDo, next) {
	var length = _.size(array);
	var counter = 0;
	array.forEach(function(element) {
		toDo(element, function() {
			counter++;
			if (counter === length) {
				next();
			}
		});
	});
}

function networkFinish(message, next) {
	lib.loggit(message, function() {
		next();
	});
}

