// load the things we need
let mongoose = require('mongoose');

// define the schema for our match predictions model
let matchPredictionSchema = mongoose.Schema({
    matchId: String,
    userId: String,
    winner: String,
    team1Goals: Number,
    team2Goals: Number,
    goalDiff: Number,
    firstToScore: String
});

matchPredictionSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('MatchPrediction', matchPredictionSchema);