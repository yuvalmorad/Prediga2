const Q = require('q');
const groupConfiguration = require('../models/groupConfiguration');
const Group = require('../models/group');
const util = require('../utils/util');

module.exports = {
	updateConfiguration: function (groupConfigurationObj) {
		const deferred = Q.defer();
		groupConfiguration.findOneAndUpdate({_id: groupConfigurationObj._id}, groupConfigurationObj, util.updateSettings, function (err, obj) {
				if (err) {
					deferred.resolve(util.getErrorResponse('error'));
				} else {
					deferred.resolve(obj);
				}
			}
		);
		return deferred.promise;
	},
	getConfigurationValue: function (groupId, key) {
		return Promise.all([
			Group.findOne({_id: groupId})
		]).then(function (group) {
			if (group[0]) {
				return groupConfiguration.findOne({_id: group[0].configurationId}).then(function(config){
                    return config[key];
				});
			} else {
				return null;
			}
		});
	}
};