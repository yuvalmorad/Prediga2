const Team = require('../models/team');
const util = require('../utils/util');

const self = module.exports = {
	updateTeams: function (teams) {
		if (!teams) {
			return;
		}

		console.log('beginning to update ' + teams.length + ' teams');
		const promises = teams.map(function (team) {
			return Team.findOneAndUpdate({_id: team._id}, team, util.overrideSettings, function (err, obj) {
					if (err) {
						return Promise.reject('general error');
					}
				}
			);
		});

		return Promise.all(promises);
	},
	getNextTeamDate: function () {
		const now = new Date();
		const before = new Date();
		before.setMinutes(now.getMinutes() - 105);
		return Promise.all([
			Team.findOne({deadline: {$gte: before}}).sort({'deadline': 1}).limit(1)
		]).then(function (arr) {
			return arr[0]
		});
	}
};