const Q = require('q');
const Groups = require('../models/group');
const util = require('../utils/util');

module.exports = {
	updateGroup: function (groupObj) {
		const deferred = Q.defer();
		Groups.findOneAndUpdate({_id: groupObj._id}, groupObj, util.updateSettings).then(function (obj) {
				deferred.resolve(obj);
			}
		);
		return deferred.promise;
	}
};