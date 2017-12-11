var Q = require('q');
var TeamResult = require('../models/teamResult');
var util = require('../utils/util');

var self = module.exports = {
    updateTeamResult: function (teamResult) {
        var deferred = Q.defer();
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
        if (teamResults.length == 0) {
            return;
        }
        console.log('beginning to update ' + teamResults.length + ' teamsResults');
        var promises = teamResults.map(function (aTeamResult) {
            return self.updateTeamResult(aTeamResult);
        });
        return Promise.all(promises);
    }
};