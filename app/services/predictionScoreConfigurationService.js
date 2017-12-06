var Q = require('q');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');

module.exports = {
    createConfiguration: function (predictionScoreConfiguration) {
        var deferred = Q.defer();
        PredictionScoreConfiguration.findOneAndUpdate({}, predictionScoreConfiguration, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(util.errorResponse.format('error'));
                } else {
                    deferred.resolve(predictionScoreConfiguration);
                }
            }
        );
        return deferred.promise;
    }
};