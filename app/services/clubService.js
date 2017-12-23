let Club = require('../models/club');

let self = module.exports = {
    updateClubs: function (clubs) {
        console.log('beginning to update ' + clubs.length + ' clubs');
        let promises = clubs.map(function (club) {
            return Club.findOneAndUpdate({_id: club._id}, club, {
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
    },
    findClubsBy365Name: function (completedGame) {
        return Promise.all([
            Club.findOne({name365: completedGame.Comps[1].Name}),
            Club.findOne({name365: completedGame.Comps[0].Name}),
        ]).then(function (arr) {
            return {
                team1: arr[0]._id,
                team2: arr[1]._id,
            }
        });
    },
};