const User = require('../models/user');
const League = require('../models/league');
const UserScore = require('../models/userScore');
const Match = require('../models/match');
const MatchResult = require('../models/matchResult');
const Team = require('../models/team');
const TeamResult = require('../models/teamResult');
const UsersLeaderboard = require('../models/usersLeaderboard');
const utils = require('../utils/util');

const self = module.exports = {
	resetLeaderboard: function () {
		return Promise.all([
			UsersLeaderboard.remove({})
		]).then(function (arr) {
			return Promise.all([
				League.find({})
			]).then(function (arr2) {
				const promises = arr2[0].map(function (league) {
					const leagueId = league._id;
					return Promise.all([
						Match.find({league: leagueId}),
						Team.find({league: leagueId})
					]).then(function (arr3) {
						const matchIds = arr3[0].map(function (match) {
							return match._id;
						});

						const teamIds = arr3[1].map(function (team) {
							return team._id;
						});

						return Promise.all([
							MatchResult.find({matchId: {$in: matchIds}, active: false}),
							TeamResult.find({teamId: {$in: teamIds}})
						]).then(function (arr4) {
							let combined = [].concat(arr4[0]);
							combined = combined.concat(arr4[1]);
							combined.sort(self.compareResultsAsc);
							const gameIds = combined.map(function (result) {
								return result.matchId || result.teamId;
							});
							if (gameIds.length > 0) {
								return self.updateLeaderboardByGameIds(leagueId, gameIds).then(function () {
									console.log('Finish updateLeaderboardByGameIds');
									return Promise.resolve();
								});
							} else {
								console.log('No game results to this league');
								return Promise.resolve();
							}

						});
					});
				});

				return Promise.all(promises);
			});
		});
	},
	updateLeaderboardByGameIds: function (leagueId, gameIds) {
		console.log('Beginning to update ' + gameIds.length + ' match results for league:' + leagueId);
		return Promise.all([
			UsersLeaderboard.find({leagueId: leagueId})
		]).then(function (arr) {
			self.proccessGamesArray(arr[0], leagueId, gameIds, self.updateLeaderboardForGameId);
			console.log('Finish to process game array');
			return Promise.resolve();
		});
	},
	proccessGamesArray: function (leaderboard, leagueId, gameIds, fn) {
		let index = -1;

		function next() {
			//console.log('next(' + index + ')');
			if (index < gameIds.length - 1) {
				index = index + 1;
				fn(leaderboard, leagueId, gameIds[index], index).then(next);
			}
		}

		next();
	},
	updateLeaderboardForGameId: function (leaderboard, leagueId, gameId, index) {
		console.log('Beginning to update leaderboard game: ' + index);
		return UserScore.find({
			leagueId: leagueId.toString(),
			gameId: gameId.toString()
		}).then(function (newUserScores) {
			if (newUserScores && newUserScores.length > 0) {
				console.log('Beginning to append (step 1) game');
				// append
				newUserScores.forEach(function (newUserScore) {
					self.appendUserScoreToLeaderboard(newUserScore, leaderboard);
				});

				// sort
				console.log('Beginning to sort (step 2) game');
				leaderboard.sort(self.compareAggregatedScores);

				// fix places & update
				console.log('Beginning to update (step 3) game');
				const promises = (leaderboard || []).map(function (leaderboardItem, index2) {
					return self.updateLeaderboardItem(leaderboardItem, index2);
				});

				return Promise.all(promises);

			} else {
				console.log('No user scores');
				return Promise.resolve();
			}
		});
	},
	updateLeaderboardItem: function (leaderboardItem, index) {
		// fix places
		let placeBeforeLastGame = -1;
		if (leaderboardItem && typeof(leaderboardItem.placeCurrent) !== 'undefined') {
			placeBeforeLastGame = leaderboardItem.placeCurrent;
		}

		leaderboardItem.placeCurrent = index + 1;
		leaderboardItem.placeBeforeLastGame = placeBeforeLastGame;

		// update
		return UsersLeaderboard.findOneAndUpdate({
			userId: leaderboardItem.userId,
			leagueId: leaderboardItem.leagueId
		}, leaderboardItem, utils.updateSettings);
	},
	appendUserScoreToLeaderboard: function (userScore, leaderboard) {
		const leaderboardItemForUser = leaderboard.filter(function (leaderboardItem) {
			return leaderboardItem.userId === userScore.userId;
		});

		if (leaderboardItemForUser.length < 1) {
			leaderboard.push({
				leagueId: userScore.leagueId,
				userId: userScore.userId,
				score: userScore.score,
				strikes: userScore.strikes,
				placeCurrent: -1,
				placeBeforeLastGame: -1,
			});
		} else {
			leaderboardItemForUser[0].score += userScore.score;
			leaderboardItemForUser[0].strikes += userScore.strikes;
		}
	},
	compareAggregatedScores: function (a, b) {
		if (a.score < b.score)
			return 1;
		if (a.score > b.score)
			return -1;
		if (a.userId < b.userId)
			return 1;
		if (a.userId > b.userId)
			return -1;
		return 0;
	},
	compareUserIds: function (a, b) {
		if (a < b)
			return 1;
		if (a > b)
			return -1;
		return 0;
	},
	compareResultsAsc: function (a, b) {
		if (a.resultTime > b.resultTime)
			return 1;
		if (a.resultTime < b.resultTime)
			return -1;
		return 0;
	},
	getLeaderboardWithNewRegisteredUsers: function (leagueId) {
		return Promise.all([
			User.find({}), // TODO - only users relevant to this league/group
			typeof(leagueId) === 'undefined' ?
				League.find({}) :
				League.find({_id: leagueId})
		]).then(function (arr) {
			const allUsers = arr[0];
			const promises = arr[1].map(function (league) {
				const leagueId = league._id;
				return Promise.all([
					UsersLeaderboard.find({leagueId: leagueId}).sort({'score': -1})
				]).then(function (arr) {
					return self.amendNewRegisteredUsers(arr[0], allUsers, leagueId);
				});
			});

			return Promise.all(promises);
		});
	}
	,
	amendNewRegisteredUsers: function (leaderboard, allUsers, leagueId) {
		const userIdsInLeaderboard = leaderboard.map(a => a.userId.toString());
		const allUsersIds = allUsers.map(a => a._id.toString());
		const userIdsNotInLeaderboard = allUsersIds.filter(x => userIdsInLeaderboard.indexOf(x) === -1);
		if (userIdsNotInLeaderboard && userIdsNotInLeaderboard.length > 0) {
			userIdsNotInLeaderboard.sort(self.compareUserIds);
			const promises = userIdsNotInLeaderboard.map(function (userId) {
				self.amendNewRegisteredUser(leaderboard, userId, leagueId);
				return leaderboard;
			});
			return Promise.all(promises);
		} else {
			return leaderboard;
		}
	}
	,
	amendNewRegisteredUser: function (leaderboard, userId, leagueId) {
		const leaderboardItem = {
			leagueId: leagueId,
			userId: userId,
			score: 0,
			strikes: 0,
			placeCurrent: -1,
			placeBeforeLastGame: -1,
		};
		return Promise.all([
			UsersLeaderboard.findOneAndUpdate({
				userId: userId,
				leagueId: leagueId
			}, leaderboardItem, utils.updateSettings)
		]).then(function (arr) {
			leaderboard.splice(leaderboard.length - 1, 0, leaderboardItem);
			return {}
		});
	}
};