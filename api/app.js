/**
 * Module dependencies.
 */

var express = require('express');
var ApiProvider = require('./apiprovider').ApiProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var ApiProvider = new ApiProvider('localhost', 27017);


// creates a location in the 'socials' collection
/*
app.post('/v.1/locations', function(req, res){
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection('socials', function(err, coll){
      coll.insert( req.body, {safe:true}, function(err){
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(JSON.stringify(req.body));
      });
    });
  });
 });
*/

// returns list of recent posts
app.get('/v.1/posts', function(req, res){
	ApiProvider.recent(function(err, items) {
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(items));
	});
});

// returns by date limits
app.get('/v.1/postsByDate', function(req, res){
	ApiProvider.postsByDate(new Date(req.query["start-date"]), new Date(req.query["end-date"]), req.query["order"], req.query["count"], req.query["page"], function(err, items) {
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(items));
	});
});

// returns by date limits
app.get('/v.1/postsByWeek', function(req, res){
	ApiProvider.postsByWeek(new Date(req.query["date"]), req.query["order"], req.query["count"], req.query["page"], function(err, items) {
	    res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
	    });
	    res.end(JSON.stringify(items));
	});
});

// returns last X days from given date (defaults to current)
app.get('/v.1/postXdays', function(req, res){
	ApiProvider.postXdays(new Date(req.query["date"]), req.query["days"], req.query["order"], req.query["count"], req.query["page"], function(err, items) {
	    res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
	    });
	    res.end(JSON.stringify(items));
	});
});

// returns a specific location by id
app.get('/v.1/posts/:post_id', function(req, res){

  var ObjectID = require('mongodb').ObjectID;
  
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection('socials', function(err, coll){
      coll.findOne({'_id':new ObjectID(req.params.post_id)}, function(err, document) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(JSON.stringify(document));
      });
    });
  });
  
});

// updates a facility
/*
app.put('/v.1/posts/:location_id/facilities/:facility_id', function(req, res){

  var ObjectID = require('mongodb').ObjectID;
  
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection('facilities', function(err, coll){
      coll.findAndModify({'_id':new ObjectID(req.params.facility_id)}, [['name','asc']], { $set: req.body }, {}, function(err, document) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(JSON.stringify(document));
      });
    });
  });

});
*/

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);