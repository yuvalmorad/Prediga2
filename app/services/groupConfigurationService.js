const Q = require('q');
const groupConfiguration = require('../models/groupConfiguration');
const util = require('../utils/util');

module.exports = {
    updateConfiguration: function (groupConfigurationObj) {
        const deferred = Q.defer();
        groupConfiguration.findOneAndUpdate({}, groupConfigurationObj.defaultConfiguration, util.updateSettings, function (err, obj) {
                if (err) {
                    deferred.resolve(util.getErrorResponse('error'));
                } else {
                    deferred.resolve(obj);
                }
            }
        );
        return deferred.promise;
    },
    getConfigurationValue: function (key) {
        const deferred = Q.defer();
        groupConfiguration.find({}, function (err, config) {
            deferred.resolve(config[0][key]);
        });
        return deferred.promise;
    }
};