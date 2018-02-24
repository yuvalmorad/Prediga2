const Team = require('../models/team');
const util = require('../utils/util');

const self = module.exports = {
	updateTeams: function (teams) {
		if (!teams) {
			return Promise.resolve([]);
		}

		//console.log('beginning to update ' + teams.length + ' teams');
		const promises = teams.map(function (team) {
			return Team.findOneAndUpdate({_id: team._id}, team, util.updateSettings).then(function (newTeam) {
					return Promise.resolve(newTeam);
				}
			);
		});

		return Promise.all(promises);
	},
	getNextTeam: function (min) {
		const time = new Date().setMinutes(new Date().getMinutes() + min);
		return Team.findOne({deadline: {$gte: time}}).sort({'deadline': 1});
	},
	getTeamsOneHourBeforeStart: function () {
		const time1 = new Date().setMinutes(new Date().getMinutes() + 61);
		const time2 = new Date().setMinutes(new Date().getMinutes() + 59);
		return Team.find({deadline: {$gte: time2, $lte: time1}}).sort({'deadline': 1});
	},
	byIdBeforeDate: function (teamId) {
		return Team.findOne({deadline: {$gte: new Date()}, _id: teamId}).sort({'deadline': 1});
	},
	getStartedTeams: function (teamIds) {
		if (typeof(teamIds) === 'undefined') {
			return self.byAfterADate(new Date());
		} else {
			return self.byAfterADateAndIds(new Date(), teamIds);
		}
	},
	byAfterADate: function (date) {
		return Team.find({deadline: {$lt: date}});
	},
	byAfterADateAndIds: function (date, ids) {
		return Team.find({deadline: {$lt: date}, _id: {$in: ids}});
	},
	byId: function (id) {
		return Team.findOne({_id: id});
	},
	byIds: function (ids) {
		return Team.find({_id: {$in: ids}});
	},
	all: function () {
		return Team.find({});
	},
	byLeagueIds: function (leagueIds) {
		return Team.find({league: {$in: leagueIds}});
	},
	getIdsArr: function (teams) {
		return teams.map(function (team) {
			return team._id.toString();
		});
	},
	byLeagueIdAndIds: function (leagueId, ids) {
		return Team.find({_id: {$in: ids}, league: leagueId}).sort({'deadline': -1});
	}
};