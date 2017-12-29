// load the things we need
const mongoose = require('mongoose');

// define the schema for our matches model
const matchSchema = mongoose.Schema({
    team1: String,
    team2: String,
    kickofftime: Date,
    type: String,
    league: String,
    stadium: String
});

matchSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Match', matchSchema);