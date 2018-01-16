const Q = require('q');
const MatchResult = require('../models/matchResult');
const util = require('../utils/util');

const self = module.exports = {
	updateMatchResult: function (matchResult) {
		const deferred = Q.defer();
		MatchResult.findOneAndUpdate({matchId: matchResult.matchId}, matchResult, util.updateSettings).then(function (obj) {
				deferred.resolve(obj);
			}
		);
		return deferred.promise;
	},
	updateMatchResults: function (matchResults) {
		if (matchResults.length === 0) {
			return;
		}
		console.log('beginning to update ' + matchResults.length + ' matchResults');
		const promises = matchResults.map(function (matchResult) {
			return self.updateMatchResult(matchResult);
		});
		return Promise.all(promises);
	}
};