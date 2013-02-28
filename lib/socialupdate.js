// Node.js script to update social items smartly on a regular basis
// ** Pulls posts from Blog, Instagram, Pinterest, Twitter and Facebook
// ** Update each type of stream on a unique schedule dependent on regularity of updates
// ** On each update, iterate over results until duplicate API ID is found and terminate
// ** Store normalized results in MongoDB

// CRON
// 0 20 * * * node UpdateSocial.js

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var http = require('http');
var https = require('https');
var fs = require('fs');

var instaAccessToken = require('/var/www/vhosts/themechanism.com/httpdocs/playground/thesocialmechanism/lib/private.js').instaAccessToken;

var logit = function(logger) {
	fs.readFile('/var/www/vhosts/themechanism.com/httpdocs/playground/thesocialmechanism/lib/error.log', function (err, data) {
		if (err) {
			fs.writeFile('/var/www/vhosts/themechanism.com/httpdocs/playground/thesocialmechanism/lib/error.log', "\n:: " + new Date() + " ::\n" + logger + "\n", function (err) {
				if (err) throw err;
			});
		} else {
			fs.writeFile('/var/www/vhosts/themechanism.com/httpdocs/playground/thesocialmechanism/lib/error.log', data + "\n:: " + new Date() + " ::\n" + logger + "\n", function (err) {
				if (err) throw err;
			});
		}
	});
}

var tweetCount = 20, instaCount = 5, voiceCount = 10, ytCount = 10;

UpdateSocial = function(db) {
	// Fetch db
	this.db = db;
}

UpdateSocial.prototype.getCollection = function(callback, msg) {
  this.db.collection('socials', function(error, social_collection) {
    if( error ) callback(error);
    else callback(null, social_collection);
  });
};

// Clear database
UpdateSocial.prototype.clear = function(callback) {
	this.getCollection(function(error, social_collection) {
      if( error ) callback(error)
      else {
      	social_collection.remove({});
      	callback();
      }
	});
}

// Save results into database
UpdateSocial.prototype.addResults = function(callback, res) {
	this.getCollection(function(error, social_collection) {
		if( error ) callback(error)
		else {
			addLoop(0, res, social_collection, callback);
			//var nextup = false;
			//callback("Results added", nextup);
		}
	});
};

var addLoop = function(r, res, social_collection, callback) {
	if (!res[r].created_at)
		res[r].created_at = new Date();
	// Safely add results from array to avoid duplicates (uniuqe API ID *and* type required by database)
	social_collection.save(res[r], {safe:true},
		function(error, saved) {
			if(error||!saved) {
				callback("Save error");
			}
			else if (r >= res.length -1) {
				callback("Callback");
			}
			else {
				addLoop(++r, res, social_collection, callback);
			}
		}
	);
}

// Add Tweets
UpdateSocial.prototype.updateTwitter = function(username, callback) {
	this.getCollection(function(error, social_collection) {
		if( error ) callback(error)
		else {
			// Should check most recent post of this type here to ensure none are missed
			var twitpath = '/1/statuses/user_timeline.json?screen_name='+username+'&include_entities=true&exclude_replies=true&count=' + tweetCount;
			
			var queryResponse = "";
			var options = {
				host: 'api.twitter.com',
				path: twitpath
			};
			http.get(options, function(response) {
				//console.log('Tweets recieved: ' + response.statusCode);
				response.on('data', function(chunk) {
					queryResponse += chunk.toString();
				});
				response.on('end', function (chunk) {
					try {
						var tweets = JSON.parse(queryResponse);
						//console.log('Processing ' + tweets.length + ' Tweets');
						var pros = new Array();
						for (t in tweets) {
							var tweet = tweets[t];
							//console.log('Tweet processing…' + tweet.id);
							var tweetPros = {
								title: tweet.user.screen_name,
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
							pros.push(tweetPros);
						}
						logit("Adding tweets for " + username);
						callback("Adding tweets", pros);
					}
					catch (err) {
						logit("Error adding Tweets: " + err.message);
						process.exit(0);
					}
				});
			});
		}
	});
};

// Add Instagrams
UpdateSocial.prototype.updateInstagram = function(userid, callback) {
    this.getCollection(function(error, social_collection) {
		if( error ) callback(error)
		else {
			var instapath = '/v1/users/'+userid+'/media/recent/?access_token=' + instaAccessToken + '&count=' + instaCount;
			var queryResponse = "";
			var options = {
				host: 'api.instagram.com',
				path: instapath
			};
			https.get(options, function(response) {
				//console.log('Instagrams recieved: ' + response.statusCode);
				response.on('data', function(chunk){
					queryResponse += chunk.toString();
				});
				response.on('end', function (chunk) {
					try {
						var instas = JSON.parse(queryResponse);
						var pros = new Array();
						for (t in instas.data) {
							var insta = instas.data[t];
							var instaPros = {
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
								instaPros.title = insta.caption.text;
							} else {
								instaPros.title = "@" + insta.user.full_name;
							}
							if (insta.location) {
								instaPros.geolat = insta.location.latitude;
								instaPros.geolon = insta.location.longitude;
							}
							pros.push(instaPros);
						}
						logit("Adding instagrams for " + userid);
						callback("Adding instagrams for user " + userid, pros);
					}
					catch (err) {
						logit("Error adding Instagrams: " + err.message + "/n" + instapath);
						process.exit(0);
					}
				});
			});
		}
	});
};

// Add Voice Blog
UpdateSocial.prototype.updateVoice = function(callback) {
    this.getCollection(function(error, social_collection) {
		if( error ) callback(error)
		else {
			var queryResponse = "";
			var options = {
				host: 'www.themechanism.com',
				path: '/voice/api/get_recent_posts/?count=' + voiceCount
			};
			http.get(options, function(response) {
				//console.log('Voices recieved: ' + response.statusCode);
				response.on('data', function(chunk){
					queryResponse += chunk.toString();
				});
				response.on('end', function (chunk) {
					//console.log(queryResponse);
					try {
						var voices = JSON.parse(queryResponse);
						var pros = new Array();
						//console.log('Processing ' + voices.post.length + 'Voices');
						for (t in voices.posts) {
							var voice = voices.posts[t];
							//console.log('Voice processing…' + tweet.id);
							var td = voice.date;
							var dd = new Date();
							dd.setHours(parseInt(td.substring(11, 13), 10), parseInt(td.substring(14, 16), 10), parseInt(td.substring(17, 19), 10));
							dd.setFullYear(parseInt(td.substring(0, 4), 10), parseInt(td.substring(5, 7), 10) - 1, parseInt(td.substring(8, 10), 10));
							
							var voicePro = {
								title: voice.title,
								body: voice.excerpt,
								link: voice.url,
								api_type:'Voice',
								api_id: voice.id.toString(),
								api_date: dd,
								likes: voice.comment_count,
								created_at: new Date()
							};
							if (voice.thumbnail) {
								voicePro.img = voice.thumbnail;
							}
							if (voice.attachments[0] && voice.attachments[0].images && voice.attachments[0].images.full) {
								voicePro.lgimg = voice.attachments[0].images.full.url;
							}
							if (voice.categories) {
								var cats = new Array();
								for (c in voice.categories) {
									if (voice.categories[c].slug == "featured") {
										voicePro.promoted = true;
									} else {
										cats.push({"name": voice.categories[c].title, "slug": voice.categories[c].slug});
									}
								}
								voicePro.type = cats;
							}
							if (voice.author) {
								voicePro.author = {"name": voice.author.first_name + " " + voice.author.last_name, "slug": voice.author.slug};
							}
							pros.push(voicePro);
						}
						logit("Adding Voice");
						callback("Adding voices", pros);
					}
					catch (err) {
						logit("Error adding Voice: " + err.message);
						process.exit(0);
					}
				});
			});
		}
	});
};
// Add Tweets
UpdateSocial.prototype.updateYoutube = function(ytID, callback) {
	this.getCollection(function(error, social_collection) {
		if( error ) callback(error)
		else {
			// Should check most recent post of this type here to ensure none are missed
			var ytpath = '/feeds/api/playlists/' + ytID + '?v=2&orderby=reversedPosition&alt=json&max-results=' + ytCount;
			
			var queryResponse = "";
			var options = {
				host: 'gdata.youtube.com',
				path: ytpath
			};
			http.get(options, function(response) {
				//console.log('Youtube recieved: ' + response.statusCode);
				response.on('data', function(chunk) {
					queryResponse += chunk.toString();
				});
				response.on('end', function (chunk) {
					try {
						var feed = JSON.parse(queryResponse).feed;
						//console.log(feed);
						var authorinfo = feed.author.pop();
						var playlist = {'name': authorinfo.name.$t, 'id': authorinfo.yt$userId.$t, 'playlist': feed.title.$t, 'playlistid': feed.yt$playlistId.$t};
						var userimg = "https://i2.ytimg.com/i/" + authorinfo.yt$userId.$t + "/1.jpg";
						//console.log('Processing ' + feed.entry.length + ' videos');
						var pros = new Array();
						
						for (v in feed.entry) {
							var video = feed.entry[v];
							//console.log('Video processing…' + video.title.$t);
							var vidPros = {
								title: video.title.$t,
								body: video.media$group.media$description.$t,
								link: video.link[0].href,
								api_type: 'Youtube',
								api_id: video.media$group.yt$videoid.$t,
								api_date: new Date(video.published.$t),
								likes: video.yt$rating.numLikes,
								promoted: false,
								author: {"name": video.media$group.media$credit[0].yt$display, "slug": video.media$group.media$credit[0].$t, "img": userimg},
								user_id: video.media$group.yt$uploaderId.$t,
								created_at: new Date(),
								type: playlist,
								img: video.media$group.media$thumbnail[0].url,
								lgimg: video.media$group.media$thumbnail[3].url
							};
							pros.push(vidPros);
						}
						logit("Adding videos for " + ytID);
						callback("Adding videos", pros);
					}
					catch (err) {
						logit("Error adding videos: " + err.message);
						process.exit(0);
					}
				});
			});
		}
	});
};
// Add Facebook
/*
UpdateSocial.prototype.updateFacebook = function(callback) {
	this.getCollection(function(error, social_collection) {
		if( error ) callback(error)
		else {
			// Should check most recent post of this type here to ensure none are missed
			social_collection.findOne({api_type:"Facebook"}, {sort:{api_date:-1}}, function(error, result) {
				if( error ) callback(error)
				else {
					var fbpath = '/128422577569/feed?access_token=' + fbAccessToken;
					if (result)
						fbpath += '&since=' + result.api_date;
					
					var queryResponse = "";
					var options = {
						host: 'graph.facebook.com',
						path: fbpath
					};
					http.get(options, function(response) {
						//console.log('Facebook posts recieved: ' + response.statusCode);
						response.on('data', function(chunk){
							queryResponse += chunk.toString();
						});
						response.on('end', function (chunk) {
							var feed = JSON.parse(queryResponse).data;
							var pros = new Array();
							for (f in feed) {
								var post = feed[f];
								//console.log('Post processing…' + post.id);
								var fbPros = {
									title: post.name,
									link: post.actions[0].link,
									api_type:'Facebook',
									api_id:post.id,
									api_date: Math.round((Date.parse(post.created_time) / 1000)),
									likes: post.likes ? post.likes.count : 0,
									promoted: false,
									created_at: Math.round((new Date()).getTime() / 1000)
								};
								if (post.message) {
									fbPros.body = post.message;
								}
								if (post.picture) {
									var imgurl = post.picture;
									// URL after src
									imgurl = imgurl.slice(imgurl.indexOf("&src=") + 5);
									var r = /\\u([\d\w]{4})/gi;
									imgurl = imgurl.replace(r, function (match, grp) {
									    return String.fromCharCode(s(grp, 16));
									});
									imgurl = unescape(x);

									fbPros.img = imgurl;
								}
								if (post.place && post.place.location) {
									fbPros.geolat = post.place.location.latitude;
									fbPros.geolon = post.place.location.longitude;
								}
								pros.push(fbPros);
							}
							callback("Adding Facebook posts", pros);
						});
					});
				}
	        });
		}
	});
};
*/

exports.UpdateSocial = UpdateSocial;
