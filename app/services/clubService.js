const Club = require('../models/club');
const utils = require('../utils/util');

const self = module.exports = {
    updateClubs: function (clubs) {
        console.log('beginning to update ' + clubs.length + ' clubs');
        const promises = clubs.map(function (club) {
            return Club.findOneAndUpdate({_id: club._id}, club, utils.overrideSettings, function (err, obj) {
                    if (err) {
                        return Promise.reject('general error');
                    }
                }
            );
        });

        return Promise.all(promises);
    },
    findClubsBy365Name: function (completedGame) {
        return Promise.all([
            Club.findOne({name365: completedGame.Comps[0].Name}), // home
            Club.findOne({name365: completedGame.Comps[1].Name}), // away
        ]).then(function (arr) {
            return {
                team1: arr[0]._id,
                team2: arr[1]._id,
            }
        });
    },
};