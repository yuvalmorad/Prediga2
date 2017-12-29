const Q = require('q');
const TeamResult = require('../models/teamResult');
const util = require('../utils/util');

const self = module.exports = {
    updateTeamResult: function (teamResult) {
        const deferred = Q.defer();
        TeamResult.findOneAndUpdate({teamId: teamResult.teamId}, teamResult, util.updateSettings, function (err, obj) {
                if (err) {
                    deferred.resolve(util.getErrorResponse('error'));
                } else {
                    deferred.resolve(obj);
                }
            }
        );
        return deferred.promise;
    },

    updateTeamResults: function (teamResults) {
        if (teamResults.length === 0) {
            return;
        }
        console.log('beginning to update ' + teamResults.length + ' teamsResults');
        const promises = teamResults.map(function (aTeamResult) {
            return self.updateTeamResult(aTeamResult);
        });
        return Promise.all(promises);
    }
};