const TeamCategory = require('../models/teamCategory');
const util = require('../utils/util');

const self = module.exports = {
	updateTeamsCategories: function (teamCategories) {
		if (!teamCategories) {
			return Promise.resolve([]);
		}

		const promises = teamCategories.map(function (teamCategory) {
			return TeamCategory.findOneAndUpdate({_id: teamCategory._id}, teamCategory, util.updateSettings).then(function (newTeamCategory) {
					return Promise.resolve(newTeamCategory);
			}, function(err) {
				debugger;
			});
		});

		return Promise.all(promises);
	},

    byIds: function (ids) {
        return TeamCategory.find({_id: {$in: ids}});
    }
};