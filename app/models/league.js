// load the things we need
const mongoose = require('mongoose');

// define the schema for our leagues model
const leagueSchema = mongoose.Schema({
    name: String,
    logoPosition: String,
    year: String,
    competition365: Number,
    syncResults365: {type: Boolean, default: false},
    clubs: Array
});

leagueSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('League', leagueSchema);