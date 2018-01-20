const GroupConfiguration = require('../models/groupConfiguration');
const util = require('../utils/util');

const self = module.exports = {
	updateConfiguration: function (groupConfigurationObj) {
		return GroupConfiguration.findOneAndUpdate({_id: groupConfigurationObj._id}, groupConfigurationObj, util.updateSettings);
	},
	getConfigurationValue: function (configurationId, key) {
		return GroupConfiguration.findOne({_id: configurationId}).then(function (config) {
			return Promise.resolve(config[key]);
		});
	},
	byId: function (configurationId) {
		return GroupConfiguration.findOne({_id: configurationId});
	},
	byIds: function (configurationIdArr) {
		return GroupConfiguration.find({_id: {$in: configurationIdArr}});
	},
	removeById: function (id) {
		return GroupConfiguration.findOneAndRemove({_id: id});
	},
	filterById: function (configurations, id) {
		return configurations.filter(function (groupConfiguration) {
			return groupConfiguration._id.toString() === id;
		});
	}
};