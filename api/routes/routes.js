var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');

/* GET home page. */
router.get('/api/v.2/posts/:collection', function(req, res) {
	lib.getSocials(req.params.collection, req.query['count'], function(err, socials) {
		if (err) res.json(404, err);
		if (!socials.length > 0) res.json(404, 'Not Found');
		return res.json(200, socials);				
	});
});

module.exports = router;
