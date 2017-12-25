// load the things we need
let mongoose = require('mongoose');

// define the schema for our clubs model
let clubSchema = mongoose.Schema({
    name: String,
    name365: String,
    shortName: String,
    homeColors: Array,
    awayColors: Array,
    homeButtonColors: Array,
    awayButtonColors: Array,
    logoPosition: String,
    league: String
});

clubSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Club', clubSchema);