var Q = require('q');
var Match = require('../models/match');

module.exports = {
    createMatches: function (matches, league) {
        var deferred = Q.defer();
        var itemsProcessed = 0;
        console.log('creating '+ matches.length +' matches for ' + league);
        matches.forEach(function (match) {
            Match.findOneAndUpdate({_id: match._id}, match, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (err, obj) {
                    if (err) {
                        deferred.resolve(util.errorResponse.format(err.message));
                    } else {
                        itemsProcessed++;
                        if (itemsProcessed === matches.length) {
                            deferred.resolve(matches);
                        }
                    }
                }
            );
        });
        return deferred.promise;
    }
};