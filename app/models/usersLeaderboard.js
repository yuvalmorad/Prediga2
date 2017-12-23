// load the things we need
let mongoose = require('mongoose');

// define the schema for our user score model
let usersLeaderboardSchema = mongoose.Schema({
    leagueId: String,
    userId: String,
    score: Number,
    strikes: Number,
    placeCurrent: Number,
    placeBeforeLastGame: Number
});

usersLeaderboardSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('UsersLeaderboard', usersLeaderboardSchema);