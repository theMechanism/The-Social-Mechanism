var twitter = require('ntwitter');
var lib = require('./lib/lib');

var twitterConsumerKey = require('./private.js').twitterConsumerKey;
var twitterConsumerSecret = require('./private.js').twitterConsumerSecret;
var twitterAccessToken = require('./private.js').twitterAccessToken;
var twitterAccessSecret = require('./private.js').twitterAccessSecret;
var twitternames = require('./private.js').twitternames;
var twitterCount = 10;

module.exports = {
	getTwitter: function(twittername, next) {
		var twit = new twitter({
			consumer_key: twitterConsumerKey,
			consumer_secret: twitterConsumerSecret,
			access_token_key: twitterAccessToken,
			access_token_secret: twitterAccessSecret
		});

		twit.getUserTimeline({
			'screen_name':twittername,
			'include_entities': 'true',
			'exclude_replies': 'true',
			'count': twitterCount
		}, function (err, data) {
			var tweets = data;
			var twees = [];
			tweets.forEach(function(tweet) {
				var tweetPros = {
					title: tweet.user.name,
					body: tweet.text,
					link: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
					api_type: 'Twitter',
					api_id: tweet.id_str,
					api_date: new Date(tweet.created_at),
					likes: tweet.retweet_count.toString(),
					promoted: false,
					author: {"name": tweet.user.name, "slug": tweet.user.screen_name, "img": tweet.user.profile_image_url},
					user_id: tweet.user.id_str,
					created_at: new Date()
				};
				if (tweet.entities.media && tweet.entities.media[0]) {
					tweetPros.img = tweet.entities.media[0].media_url;
				}
				if (tweet.entities.hashtags) {
					var hashes = new Array();
					for (c in tweet.entities.hashtags) {
						hashes.push({"name": tweet.entities.hashtags[c].text, "slug": tweet.entities.hashtags[c].indices});
					}
					tweetPros.type = hashes;
				}
				if (tweet.entities.urls && tweet.entities.urls[0]) {
					tweetPros.extlinks = [];
					for (t in tweet.entities.urls) {
						 tweetPros.extlinks.push(tweet.entities.urls[t].url);
					}
				}
				if (tweet.geo && tweet.geo.type == "Point") {
					tweetPros.geolat = tweet.geo.coordinates[0];
					tweetPros.geolon = tweet.geo.coordinates[1];
				}
				twees.push(tweetPros);
			});
			lib.saveData(twees, function(data) {
				next(twees);
			});

			// logit("Adding tweets for " + twittername);
		});
	}
};

