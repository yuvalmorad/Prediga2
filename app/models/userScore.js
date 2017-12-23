// load the things we need
let mongoose = require('mongoose');

// define the schema for our user score model
let userScoreSchema = mongoose.Schema({
    leagueId: String,
    userId: String,
    gameId: String,
    score: Number,
    strikes: Number
});

userScoreSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('UserScore', userScoreSchema);