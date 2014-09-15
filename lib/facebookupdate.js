var _ = require('underscore');
var socialUpdate = require('./socialupdate');

var fAppID = require('./private.js').facebookAppID;
var fSecret = require('./private.js').facebookAppSecret;
var fIDs = require('./private.js').facebookids;
var fCount = 10;

module.exports = {
	getFacebook: function(ID, next) {
		var accessToken = fAppID + '|' + fSecret;
		var fbpath = '/' + ID + '/feed?limit=' + fCount + '&access_token=' + accessToken;

		var options = {
			host: 'graph.facebook.com',
			path: fbpath
		};
		var fbPosts = [];
		socialUpdate.loadAPI(options, function(posts) {
			_.each(posts, function(post) {
				if (post.message) {
					var fbPost = {
						title: post.from.name,
						body: post.message,
						link: (post.link) ? post.link : undefined,
						api_type:'Facebook',
						api_id: post.id,
						api_date: new Date(post.created_time),
						likes: post.likes ? _.size(post.likes) : 0,
						comments: post.comments ? post.comments.data : undefined,
						promoted: false,
						created_at: Math.round((new Date()).getTime() / 1000),
						img: (post.picture) ? post.picture : undefined,
						lgimg: (post.object_id) ? post.object_id : undefined,
						getlat: (post.place) ? post.place.location.latitude : undefined,
						geolon: (post.place) ? post.place.location.longitude : undefined,
						author: {
							name: post.from.name,
							id: post.from.id
						},
						type: post.type
					};
					fbPosts.push(fbPost);
				}
			});
			socialUpdate.saveData(fbPosts, function(data) {
				next(fbPosts);
			});
		});
	}
};

socialUpdate.loggit('Facebook call starting');
socialUpdate.init('social_yotd', fIDs, function(ID, checkIt) {
	module.exports.getFacebook(ID, function() {
		console.log('Facebook data saved for ' + ID);
		var isEnd = checkIt();
		if (isEnd) {
			socialUpdate.loggit('Facebook call finished', function() {
				process.exit(0);
			});
		}
	});
});
