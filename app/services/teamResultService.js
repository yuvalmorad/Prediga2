let Q = require('q');
let TeamResult = require('../models/teamResult');
let util = require('../utils/util');

let self = module.exports = {
    updateTeamResult: function (teamResult) {
        let deferred = Q.defer();
        TeamResult.findOneAndUpdate({teamId: teamResult.teamId}, teamResult, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(util.errorResponse.format('error'));
                } else {
                    deferred.resolve(obj);
                }
            }
        );
        return deferred.promise;
    },

    // TODO - update only if necessary
    updateTeamResults: function (teamResults) {
        if (teamResults.length === 0) {
            return;
        }
        console.log('beginning to update ' + teamResults.length + ' teamsResults');
        let promises = teamResults.map(function (aTeamResult) {
            return self.updateTeamResult(aTeamResult);
        });
        return Promise.all(promises);
    }
};