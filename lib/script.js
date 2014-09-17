var socialUpdate = require('./socialupdate');
var socialIDs = require('./private.js').socialIDs;

socialUpdate.init(socialIDs, function() {
	process.exit(0);
});