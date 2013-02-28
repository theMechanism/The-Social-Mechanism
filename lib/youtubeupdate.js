var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var UpdateSocial = require('./socialupdate.js').UpdateSocial;

var mydb = new Db('node_mongo_social', new Server('localhost', 27017, {auto_reconnect: true}, {}));

// Init
console.log("Starting one-off Youtube update...");
var UpdateSocial = new UpdateSocial(mydb);

var youtubeids = require('./private.js').youtubeids;
var youtubeloc = 0;

var youtube = function(addthis) {
	UpdateSocial.addResults(
		function(mess){
			//console.log(mess);
			youtubeloc++;
			if (youtubeloc < youtubeids.length) {
				//console.log(youtubeids[youtubeloc]);
				UpdateSocial.updateYoutube(youtubeids[youtubeloc], function(mess, addthis) {
					//console.log(mess);
					youtube(addthis);
				});
			} else {process.exit(0);}
		},
		addthis
	);
};

mydb.open(function(){
	UpdateSocial.updateYoutube(youtubeids[youtubeloc], function(mess, addthis) {
		//console.log(mess);
		youtube(addthis);
	});
});