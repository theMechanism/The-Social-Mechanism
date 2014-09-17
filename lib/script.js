var socialUpdate = require('./lib/socialupdate');
var socialIDs = require('./private.js').socialIDs;

socialUpdate.init(socialIDs, function() {
	process.exit(0);
});