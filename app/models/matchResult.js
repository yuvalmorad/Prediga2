// load the things we need
var mongoose = require('mongoose');

// define the schema for our match result model
var matchResultSchema = mongoose.Schema({
    matchId: String,
    winner: String,
    team1Goals: Number,
    team2Goals: Number,
    goalDiff: Number,
    firstToScore: String
});

matchResultSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('MatchResult', matchResultSchema);