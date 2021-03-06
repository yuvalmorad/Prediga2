const Club = require('../models/club');
const utils = require('../utils/util');

const self = module.exports = {
	updateClubs: function (clubs) {
		//console.log('beginning to update clubs, found:' + clubs.length);
		const promises = clubs.map(function (club) {
			return self.updateClub(club);
		});

		return Promise.all(promises);
	},
	findClubsBySport5Name: function (relevantGame) {
		return Promise.all([
			self.bySport5Name(relevantGame.twoPVSI.p1_name), // home
			self.bySport5Name(relevantGame.twoPVSI.p2_name), // away
		]).then(function (arr) {
			return {
				team1: arr[0],
				team2: arr[1],
			}
		});
	},
	byId: function (clubId) {
		return Club.findOne({_id: clubId});
	},
	byIds: function (clubIds) {
		return Club.find({_id: {$in: clubIds}});
	},
	all: function () {
		return Club.find({});
	},
	getClubIdMap: function (leagues) {
		let clubsArr = leagues.map(function (league) {
			return league.clubs;
		});
		return [].concat.apply([], clubsArr);
	},
	updateClub: function (club) {
		return Club.findOneAndUpdate({_id: club._id}, club, utils.updateSettings).then(function (newClub) {
				return Promise.resolve(newClub);
			}
		);
	},
    bySport5Name: function (name) {
		return Club.findOne({nameSport5: name});
	}
};