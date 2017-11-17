// load the things we need
var mongoose = require('mongoose');

// define the schema for our matches model
var matchSchema = mongoose.Schema({
    team1: String,
    team2: String,
    kickofftime: Date,
    type: String
});

module.exports = mongoose.model('Match', matchSchema);