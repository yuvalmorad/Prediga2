const TeamResult = require('../models/teamResult');
const util = require('../utils/util');

const self = module.exports = {
	updateTeamResult: function (teamResult) {
		return TeamResult.findOneAndUpdate({teamId: teamResult.teamId}, teamResult, util.updateSettings).then(function (newTeamResult) {
				return Promise.resolve(newTeamResult);
			}
		);
	},
	updateTeamResults: function (teamResults) {
		if (teamResults.length === 0) {
			return Promise.resolve([]);
		}
		//console.log('beginning to update ' + teamResults.length + ' teamsResults');
		const promises = teamResults.map(function (aTeamResult) {
			return self.updateTeamResult(aTeamResult);
		});
		return Promise.all(promises);
	},
	all: function () {
		return TeamResult.find({});
	},
	byTeamId: function (teamId) {
		return TeamResult.findOne({teamId: teamId});
	},
	byTeamIds: function (teamIds) {
		return TeamResult.find({teamId: {$in: teamIds}});
	},
	getTeamIdsArr: function (teamResults) {
		return teamResults.map(function (teamResult) {
			return teamResult.teamId;
		});
	}
};