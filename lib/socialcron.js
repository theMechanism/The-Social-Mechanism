var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var cronJob = require('cron').CronJob;
var UpdateSocial = require('./socialupdate.js').UpdateSocial;

var mydb = new Db('node_mongo_social', new Server('localhost', 27017, {auto_reconnect: true}, {}));
mydb.open(function(){});

// Init
console.log("Starting cron");
var UpdateSocial = new UpdateSocial(mydb);

var twitternames = require('./private.js').twitternames;
var twitterloc = 0;
var instaids = require('./private.js').instaids;
var instaloc = 0;

var twitter = function(addthis) {
	UpdateSocial.addResults(
		function(){
			twitterloc++;
			if (twitterloc < twitternames.length) {
				UpdateSocial.updateTwitter(twitternames[twitterloc], function(mess, addthis) {
					//console.log(mess);
					twitter(addthis);
				});
			} else {process.exit(0);}
		},
		addthis
	);
};

var instagram = function(addthis) {
	UpdateSocial.addResults(
		function(){
			instaloc++;
			if (instaloc < instaids.length) {
				UpdateSocial.updateInstagram(instaids[instaloc], function(mess, addthis) {
					//console.log(mess);
					instagram(addthis);
				});
			} else {
				UpdateSocial.updateTwitter(twitternames[twitterloc], function(mess, addthis) {
					//console.log(mess);
					twitter(addthis);
				});
			}
		},
		addthis
	);
};

var job = new cronJob({
	cronTime:'0 0 */3 * * *',
	onTick: function() {
		//console.log("Starting updates…");
		// Daisychained social updates
		UpdateSocial.updateVoice(
			function(mess, addthis) {
				UpdateSocial.addResults(
					function(mess, cb){
						if (cb) {
							cb();
						} else {
							UpdateSocial.updateInstagram(instaids[instaloc], function(mess, addthis) {
								//console.log(mess);
								instagram(addthis);
							});
						}
					},
					addthis
				);
			}
		);
	},
	start: true
});