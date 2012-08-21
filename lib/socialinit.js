var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var UpdateSocial = require('./socialupdate.js').UpdateSocial;

var mydb = new Db('node_mongo_social', new Server('localhost', 27017, {auto_reconnect: true}, {}));
mydb.open(function(){});

// Init
console.log("Starting one-off update...");
var UpdateSocial = new UpdateSocial(mydb);

var twitternames = ['themechanism', 'benchirlin', 'antonioortiz', 'davefletcher', 'chazcheadle'];
var twitterloc = 0;

var instaids = ['18740348', '21155652', '18028170'];
var instaloc = 0;

var twitter = function(addthis) {
	//console.log("Updating Twitter");
	UpdateSocial.addResults(
		function(){
			twitterloc++;
			if (twitterloc < twitternames.length) {
				UpdateSocial.updateTwitter(twitternames[twitterloc], function(mess, addthis) {
					//console.log(mess);
					twitter(addthis);
				});
			} else {
				console.log(instaids[instaloc]);
				UpdateSocial.updateInstagram(instaids[instaloc], function(mess, addthis) {
					//console.log(mess);
					instagram(addthis);
				});
			}
		},
		addthis
	);
};

var instagram = function(addthis) {
	//console.log("Updating Instagram");
	UpdateSocial.addResults(
		function(){
			instaloc++;
			if (instaloc < instaids.length) {
				console.log(instaids[instaloc]);
				UpdateSocial.updateInstagram(instaids[instaloc], function(mess, addthis) {
					//console.log(mess);
					instagram(addthis);
				});
			} else {
				//console.log("Updating Voice");
				UpdateSocial.updateVoice(
					function(mess, addthis) {
						UpdateSocial.addResults(
							function(mess, cb){
								if (cb) {
									cb();
								} else {
									process.exit(0);
								}
							},
							addthis
						);
					}
				);
			}
		},
		addthis
	);
};

//console.log("Updating Twitter");
UpdateSocial.updateTwitter(twitternames[twitterloc], function(mess, addthis) {
	//console.log(mess);
	twitter(addthis);
});