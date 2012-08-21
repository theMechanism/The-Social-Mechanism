var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ApiProvider = function(host, port) {
  this.db = new Db('node_mongo_social', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


ApiProvider.prototype.getCollection = function(callback) {
  this.db.collection('socials', function(error, social_collection) {
    if( error ) callback(error);
    else callback(null, social_collection);
  });
};

// Find all social items for stream viewing
ApiProvider.prototype.recent = function(count, page, callback) {
    this.getCollection(function(error, social_collection) {
      if( error ) callback(error)
      else {
      	page = page ? page : 0;
      	count = count ? count : 20;
        social_collection.find({}, {sort:{api_date:-1}, skip:count*page, limit:count}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

// Find all social items for stream viewing
ApiProvider.prototype.postsByDate = function(datestart, dateend, order, count, page, callback) {
    this.getCollection(function(error, social_collection) {
      if( error ) callback(error)
      else {
      	page = page ? page : 0;
      	count = count ? count : 20;
      	//console.log("Looking between " + datestart + " and " + dateend );
        social_collection.find({"api_date" : {$gt: datestart, $lt: dateend}}, {sort:{api_date:orderParse(order)}, skip:count*page, limit:count}).toArray(function(error, results) {
          if( error ) callback(error)
          else {callback(null, results);}
        });
      }
    });
};

// Find all social items for current week
ApiProvider.prototype.postsByWeek = function(date, order, count, page, callback) {
    this.getCollection(function(error, social_collection) {
      if( error ) callback(error)
      else {
      	//console.log("Limit = " + count + " Page = " + page);
      	page = page ? page : 0;
      	count = count ? count : 20;
      	// If date argument passed, get all posts in that day's week (Mon - Fri)
      	// Else default to current day's week
      	var lastsun = isValidDate(date) ? date : new Date();
      	lastsun.setHours(0,0,0,0);
      	lastsun.setDate(lastsun.getDate() - lastsun.getDay());
      	var nextsun = new Date(lastsun);
      	nextsun.setDate(nextsun.getDate() + 7);
		
		//console.log("Looking between " + lastsun + " and " + nextsun );
		
        social_collection.find({"api_date" : {$gt: lastsun, $lt: nextsun}}, {sort:{api_date:orderParse(order)}, skip:count*page, limit:count}).toArray(function(error, results) {
          if( error ) callback(error)
          else {
          	callback(null, results);
          }
        });
      }
    });
};

// Find all social items for current week
ApiProvider.prototype.postXdays = function(date, numdays, order, count, page, callback) {
    this.getCollection(function(error, social_collection) {
      if( error ) callback(error)
      else {
      	//console.log("Limit = " + count + " Page = " + page);
      	page = page ? page : 0;
      	count = count ? count : 20;
      	// If date argument passed, get all posts in that day's week (Mon - Fri)
      	// Else default to current day's week
		var today = isValidDate(date) ? date : new Date();
      	today.setHours(23,59,59,999);
      	var lastweek = new Date(today);
      	numdays = numdays ? numdays : 7;
      	lastweek.setDate(today.getDate() - numdays);
		
		//console.log("Looking between " + lastweek + " and " + today);
		
        social_collection.find({"api_date" : {$gt: lastweek, $lt: today}}, {sort:{api_date:orderParse(order)}, skip:count*page, limit:count}).toArray(function(error, results) {
          if( error ) callback(error)
          else {
          	callback(null, results);
          }
        });
      }
    });
};

function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

function orderParse(ord) {
	if (ord) {
		if (ord == "asc")
			return 1;
		if (ord == "dec")
			return -1;
	}
	return 1;
}


// Find a social item by ID (for individual viewing)
ApiProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, social_collection) {
      if (error) callback(error)
      else {
        social_collection.findOne({_id: social_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else {callback(null, result);}
        });
      }
    });
};

exports.ApiProvider = ApiProvider;