let Team = require('../models/team');
let TeamPrediction = require('../models/teamPrediction');

let self = module.exports = {
    creaTeamPredictions(teamPredictions, userId) {
        let now = new Date();
        let promises = teamPredictions.map(function (teamPrediction) {
            // we can update only if the kickofftime is not passed
            return Team.findOne({deadline: {$gte: now}, _id: teamPrediction.teamId}).then(function (aTeam) {
                if (aTeam) {
                    teamPrediction.userId = userId;
                    return TeamPrediction.findOneAndUpdate({
                        teamId: teamPrediction.teamId,
                        userId: userId
                    }, teamPrediction, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    });
                } else {
                    return Promise.reject('general error');
                }
            });
        });

        return Promise.all(promises);
    }
};