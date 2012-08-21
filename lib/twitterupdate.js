var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var UpdateSocial = require('./socialupdate.js').UpdateSocial;

var mydb = new Db('node_mongo_social', new Server('localhost', 27017, {auto_reconnect: true}, {}));

// Init
console.log("Starting one-off Twitter update...");
var UpdateSocial = new UpdateSocial(mydb);

var twitternames = require('./private.js').twitternames;
var twitterloc = 0;

var twitter = function(addthis) {
	UpdateSocial.addResults(
		function(mess){
			//console.log(mess);
			twitterloc++;
			if (twitterloc < twitternames.length) {
				//console.log(twitternames[twitterloc]);
				UpdateSocial.updateTwitter(twitternames[twitterloc], function(mess, addthis) {
					//console.log(mess);
					twitter(addthis);
				});
			} else {process.exit(0);}
		},
		addthis
	);
};

mydb.open(function(){
	UpdateSocial.updateTwitter(twitternames[twitterloc], function(mess, addthis) {
		//console.log(mess);
		twitter(addthis);
	});
});