// API Keys, Tokens, Secrets, etc.
exports.instaClientId = '';
exports.twitterAccessToken = '';
exports.twitterAccessSecret = '';
exports.twitterConsumerKey = '';
exports.twitterConsumerSecret = '';
exports.facebookAppID = '';
exports.facebookAppSecret = '';

// Account names/IDs 
// collection name will be used in the URL when accessing this collection through the API (supports multiple collections)
exports.socialIDs = {
	collection_name: "social_mech",
	networks: [
		{
			type: "Twitter",
			ids: ['themechanism']
		},
		{
			type: "Facebook",
			ids: ['themechanism']
		},
		{
			type: "Instagram",
			ids: ['21155652']
		}
	]
};
