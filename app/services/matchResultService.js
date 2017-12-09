var Q = require('q');
var MatchResult = require('../models/matchResult');
var util = require('../utils/util');

var self = module.exports = {
    updateMatchResult: function (matchResult) {
        var deferred = Q.defer();
        MatchResult.findOneAndUpdate({matchId: matchResult.matchId}, matchResult, {
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
    updateMatchResults: function (matchResults) {
        if (matchResults.length == 0) {
            return;
        }
        console.log('trying to update ' + matchResults.length + ' matchResults');
        var promises = matchResults.map(function (matchResult) {
            return self.updateMatchResult(matchResult);
        });
        return Promise.all(promises);
    }
};