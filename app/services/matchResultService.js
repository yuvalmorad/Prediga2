const MatchResult = require('../models/matchResult');
const util = require('../utils/util');

const self = module.exports = {
	updateMatchResult: function (matchResult) {
		return MatchResult.findOneAndUpdate({matchId: matchResult.matchId}, matchResult, util.updateSettings).then(function (newMatchResult) {
				return Promise.resolve(newMatchResult);
			}
		);
	},
	updateMatchResults: function (matchResults) {
		if (matchResults.length === 0) {
			return Promise.resolve([]);
		}
		//console.log('beginning to update ' + matchResults.length + ' matchResults');
		const promises = matchResults.map(function (matchResult) {
			return self.updateMatchResult(matchResult);
		});
		return Promise.all(promises);
	},
	byMatchIds: function (matchIds) {
		return MatchResult.find({matchId: {$in: matchIds}});
	},
	byMatchIdsAndAndActiveStatus: function (matchIds, isActive) {
		return MatchResult.find({matchId: {$in: matchIds}, active: isActive}).sort({'resultTime': 1});
	},
	byMatchId: function (matchId) {
		return MatchResult.findOne({matchId: matchId});
	},
	all: function () {
		return MatchResult.find({});
	},
	getMatchIdsArr: function (matchResults) {
		return matchResults.map(function (matchResult) {
			return matchResult.matchId;
		});
	}
};