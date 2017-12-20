let Q = require('q');
let PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
let util = require('../utils/util');

module.exports = {
    updateConfiguration: function (predictionScoreConfiguration) {
        let deferred = Q.defer();
        PredictionScoreConfiguration.findOneAndUpdate({}, predictionScoreConfiguration, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
                if (err) {
                    deferred.resolve(util.getErrorResponse('error'));
                } else {
                    deferred.resolve(predictionScoreConfiguration);
                }
            }
        );
        return deferred.promise;
    }
};