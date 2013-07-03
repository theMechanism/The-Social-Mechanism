var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var UpdateSocial = require('./socialupdate.js').UpdateSocial;

var mydb = new Db('node_mongo_social', new Server('localhost', 27017, {auto_reconnect: true}, {}));

// Init
console.log("Starting one-off Instagram update...");
var UpdateSocial = new UpdateSocial(mydb);

var instaids = require('./private.js').instaids;
var instaloc = 0;

var instagram = function(addthis) {
	UpdateSocial.addResults(
		function(){
			instaloc++;
			if (instaloc < instaids.length) {
				//console.log(instaids[instaloc]);
				UpdateSocial.updateInstagram(instaids[instaloc], function(mess, addthis) {
					//console.log(mess);
					instagram(addthis);
				});
			} else {process.exit(0);}
		},
		addthis
	);
};

mydb.open(function(){
	UpdateSocial.updateInstagram(instaids[instaloc], function(mess, addthis) {
		//console.log(mess);
		instagram(addthis);
	});
});
