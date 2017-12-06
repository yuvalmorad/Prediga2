// load the things we need
var mongoose = require('mongoose');

// define the schema for our Prediction Score's Configuration model
var predictionScoreConfiguration = mongoose.Schema({
    winner: Number,
    team1Goals: Number,
    team2Goals: Number,
    goalDiff: Number,
    firstToScore: Number,
    teamInGroup: Number,
    teamWinner: Number,
    teamRunnerUp: Number,
    teamThird: Number,
    teamForth: Number,
    teamLast: Number,
    team2ndLast: Number
});

predictionScoreConfiguration.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('PredictionScoreConfiguration', predictionScoreConfiguration);