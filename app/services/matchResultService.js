let Q = require('q');
let MatchResult = require('../models/matchResult');
let util = require('../utils/util');

let self = module.exports = {
    updateMatchResult: function (matchResult) {
        let deferred = Q.defer();
        MatchResult.findOneAndUpdate({matchId: matchResult.matchId}, matchResult, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(util.getErrorResponse('error'));
                } else {
                    deferred.resolve(obj);
                }
            }
        );
        return deferred.promise;
    },
    updateMatchResults: function (matchResults) {
        if (matchResults.length === 0) {
            return;
        }
        console.log('beginning to update ' + matchResults.length + ' matchResults');
        let promises = matchResults.map(function (matchResult) {
            return self.updateMatchResult(matchResult);
        });
        return Promise.all(promises);
    }
};