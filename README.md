#The-Social-Mechanism

Node.js/Mongo API for caching online social activity

This simple node.js/mongo based web application aims to cache social activity from a specified set of users and then cache this info in a sanitized fashion in a mongo database. This information is then served up by a corresponding API to be used on web-enabled devices. Currently, the app can pull from any number of Twitter, Instagram, and Youtube playlist feeds as well as a singlular Wordpress blog (with the JSON API plugin installed found at http://wordpress.org/extend/plugins/json-api/).

##Use:

When coupled with a cron job, this can be used to create a singular permanent social timeline of the given users. The regular structure of the database and the extendibility of the API provided by node.js make this a perfect foundation for a social-based web or mobile display of social network activities.

To get started, alter the private.js file (configuration file) to contain information relavent to your program. Namely your Instragram API access token, an array of Twitter usernames, an array of Instagram user IDs, and an array of Youtube plaaylist IDs.

See the cron_jobs.txt and script.sh for ideas of how to keep your database up to date automatically (replacing paths as appropriate). These examples are from a CentOS Linux server.

Also consider running your API via any handy node.js script. We use Nodejitsu's Forever.

##Dependencies:

To accomadate the latest Twitter update to version 2.0 of their API, be sure to require **ntwitter**. This fantastic module makes the new Twitter authentication a breeze. Be sure to generate all neccessary keys and secrets via their developer portal here https://dev.twitter.com/

The lib files which manage adding social items to the database require **mongodb** and **express**. The API is built using express and so requires **express, jade, mongodb** and **stylus**. Currently no views are used but future revisions may add an admin portal to allow management of the social entries via a view.

##Limitations:

Since the app currently uses non-authenticated Twitter calls, it is limited by Twitter to around 100 calls per hour so be sure to lower the count argument for Twitter during testing. Authenticated posting would be an easy future addition. Similarly, ensure that if used with a cron job, you won't go over your limit per hour (I keep mine running every three hours pulling 20 tweets per user).

The Youtube gdata API is somewhat limited. In this script, we're sorting in reverse playlist order but that doesn't guarantee we'll get the latest additions since users can reorder playlists at will and there's no "sort by date added" option we're aware of. NB: it appears not all Youtube accounts are stored similarly on their end, most likely due to the age of the site.

##TODO:
* Facebook Integration: Adding Facebook integration would obviously be huge. I roughed out how the results would be added in a commented out section at the bottom of socialupdate.js. However upcoming changes to the Facebook API will make constant server listening impossible as all API access will require a user generated authentication token that expires every few hours making an automated process difficult.
* Hootsuite Integration: Hootsuite integration would similarly be great. However their API requires one to get a key directly from them and I'm still waiting on a request I put in months ago (Hootsuite could be a potential work around the Facebook problem above as well as possibly eliminating the need for a separate Twitter call)
* Admin backend: Adding an Express/Jade based admin back end would be a nice addition. Such a portal would allow admins to manage promoted or existing content.
* Update Repeated Entries: since entries are cached they're never updated after being pulled initially. This severly limits the usefullness of the "likes" field since its never updated after future retweets/likes are noted in their respective APIs.
* Since IDs: Both Twitter and Instagram support a "since" argument in their API calls which will return results since a particular datestamp or ID. Older versions of the code looked for the most recent entry (based on api_date) and fed that as this argument to ensure no intervening intervening entries were missed. However this caused callback bugs (not to mention the headache of then paging through such results in the case of large numbers of entries). If added back, this could be hugely useful for systems that run on more infrequent intervals and increase efficieny in terms of number of calls made on the external APIs.
* Pull all appropriate related info for Youtube playlist authors i.e. profile page, image, etc. Will require separate API call.