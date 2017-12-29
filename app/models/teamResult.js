// load the things we need
const mongoose = require('mongoose');

// define the schema for our team result model
const teamResultSchema = mongoose.Schema({
    teamId: String,
    team: String,
    type: String // winner, runnerUp, *
});

teamResultSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('TeamResult', teamResultSchema);