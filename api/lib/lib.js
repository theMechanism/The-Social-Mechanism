var db = require('./db');


module.exports = {
	getSocials: function(collection, count, next) {
		db.find(collection, {}, { api_date: -1 }, parseInt(count) || 20, next);
	}
};
