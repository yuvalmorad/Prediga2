var Match = require('../models/match');

module.exports = {
    createMatches: function (matches, league) {
        console.log('creating ' + matches.length + ' matches for ' + league);
        var promises = matches.map(function (match) {
            return Match.findOneAndUpdate({_id: match._id}, match, {
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (err, obj) {
                    if (err) {
                        return Promise.reject('general error');
                    }
                }
            );
        });
        return Promise.all(promises);
    }
};