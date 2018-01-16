const Club = require('../models/club');
const utils = require('../utils/util');

const self = module.exports = {
	updateClubs: function (clubs) {
		console.log('beginning to update ' + clubs.length + ' clubs');
		const promises = clubs.map(function (club) {
			Club.findOneAndUpdate({_id: club._id}, club, utils.overrideSettings).then(function (obj) {
					return obj;
				}
			);
		});

		return Promise.all(promises);
	},
	findClubsBy365Name: function (relevantGame) {
		return Promise.all([
			Club.findOne({name365: relevantGame.Comps[0].Name}), // home
			Club.findOne({name365: relevantGame.Comps[1].Name}), // away
		]).then(function (arr) {
			return {
				team1: arr[0],
				team2: arr[1],
			}
		});
	},
};