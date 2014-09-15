var socialUpdate = require('./socialupdate');

var instaClientId = require('./private.js').instaClientId;
var instaids = require('./private.js').instaids;
var instaCount = 10;

module.exports = {
	getInsta: function(ID, next) {
		var instapath = '/v1/users/' + ID + '/media/recent/?client_id=' + instaClientId + '&count=' + instaCount;
		var options = {
			host: 'api.instagram.com',
			path: instapath
		};
		var instaPosts = [];
		socialUpdate.loadAPI(options, function(posts) {
			posts.forEach(function(insta) {
				var instaPost = {
					title: insta.user.full_name,
					link: insta.link,
					img: insta.images.thumbnail.url,
					lgimg: insta.images.standard_resolution.url,
					api_type:'Instagram',
					api_id: insta.id,
					api_date: new Date(insta.created_time * 1000),
					likes: insta.likes.count,
					promoted: false,
					author: {"name": insta.user.full_name, "slug": insta.user.username, "img": insta.user.profile_picture},
					user_id: insta.user.id,
					created_at: new Date()
				};
				if (insta.caption) {
					instaPost.body = insta.caption.text;
				} else {
					instaPost.body = "@" + insta.user.full_name;
				}
				if (insta.location) {
					instaPost.geolat = insta.location.latitude;
					instaPost.geolon = insta.location.longitude;
				}
				instaPosts.push(instaPost);
			});
			socialUpdate.saveData(instaPosts, function(data) {
				next(instaPosts);
			});
		});
	}
};

socialUpdate.loggit('Instagram call starting');
socialUpdate.init('social_yotd', instaids, function(ID, checkIt) {
	module.exports.getInsta(ID, function() {
		console.log('Instagram data saved for ' + ID);
		var isEnd = checkIt();
		if (isEnd) {
			socialUpdate.loggit('Instagram call finished', function() {
				process.exit(0);
			});
		}
	});
});
