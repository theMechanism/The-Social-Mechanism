var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var UpdateSocial = require('./socialupdate.js').UpdateSocial;

var mydb = new Db('node_mongo_social', new Server('localhost', 27017, {auto_reconnect: true}, {}));
mydb.open(function(){});

// Init
console.log("Starting one-off Voice update...");
var UpdateSocial = new UpdateSocial(mydb);

UpdateSocial.updateVoice(
	function(mess, addthis) {
		//console.log(addthis);
		UpdateSocial.addResults(
			function(mess, cb){
				if (cb) {
					cb();
				} else {process.exit(0);}
			},
			addthis
		);
	}
);