The-Social-Mechanism
====================

Node.js/Mongo API for caching online social activity

This simple node.js/mongo based web application aims to cache social activity from a specified set of users and then cache this info in a sanitized fashion in a mongo database. This information is then served up by a corresponding API to be used on web-enabled devices. Currently, the app can pull from any number of Twitter and Instagram feeds as well as a singlular Wordpress blog (with the JSON API plugin installed found at http://wordpress.org/extend/plugins/json-api/).

Use:
When coupled with a cron job, this can be used to create a singular permanent social timeline of the given users. The regular structure of the database and the extendibility of the API provided by node.js make this a perfect foundation for a social-based web or mobile display.

Limitations:
Since the app currently uses non-authenticated Twitter calls, it is limited by Twitter to around 100 calls per hour so be sure to lower the count argument for Twitter during testing. Authenticated posting would be an easy future addition. Similarly, ensure that if used with a cron job, you won't go over your limit per hour (I keep mine running every three hours pulling 20 tweets per user)
