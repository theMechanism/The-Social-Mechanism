# The-Social-Mechanism

Node.js/Mongo app for storing and serving social media activity

The purpose of this app is to create a single social timeline of multiple networks and accounts. It stores social activity from a list of users in a database and provides an API. Facebook, Twitter and Instagram are currently supported.

## Use:

1. Alter the private.js file (example included) with the necessary information:
	* your social media API keys
	* identifiers for the social media accounts:
1. Set up a cronjob to run the function at an interval to keep the data current (look at scraper/cron_jobs.txt for an example)
1. Launch the API server (recent posts can be accessed via "/api/v.2/posts/**collection_name**")

## Dependencies:

Be sure to run ```npm install``` to download the necessary dependencies.

## Limitations:

The Social Mechanism does not currently have support for deleting social media posts. Once pulled into the database, a deleted post will lead to bad links and missing images.

## TODO:

* Admin backend: Adding an admin back end would be a nice addition. Such a portal would allow admins to manage promoted or existing content
* Better handling for deleted posts
* Extend the API with more GET request options
