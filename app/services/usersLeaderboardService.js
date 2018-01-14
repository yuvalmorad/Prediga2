const Group = require('../models/group');
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
		return Promise.all([
			Group.find({leagueIds: leagueId})
		]).then(function (arr) {
			const promises = arr[0].map(function (group) {
				let groupId = group._id;
				console.log('Beginning to update ' + gameIds.length + ' match results for league: ' + leagueId + ' for group: ' + groupId);
				return Promise.all([
					UsersLeaderboard.find({leagueId: leagueId, groupId: groupId})
				]).then(function (arr2) {
					self.proccessGamesArray(arr2[0], leagueId, groupId, gameIds, self.updateLeaderboardForGameId);
					console.log('Finish to process game array');
					return Promise.resolve();
				});
			});
			return Promise.all(promises);
		});
	},
	proccessGamesArray: function (leaderboard, leagueId, groupId, gameIds, fn) {
		let index = -1;

		function next() {
			//console.log('next(' + index + ')');
			if (index < gameIds.length - 1) {
				index = index + 1;
				fn(leaderboard, leagueId, groupId, gameIds[index], index).then(next);
			}
		}

		next();
	},
	updateLeaderboardForGameId: function (leaderboard, leagueId, groupId, gameId, index) {
		console.log('Beginning to update leaderboard game: ' + index);
		return UserScore.find({
			leagueId: leagueId.toString(),
			gameId: gameId.toString(),
			groupId: groupId
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
			groupId: leaderboardItem.groupId,
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
				groupId: userScore.groupId,
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
	getLeaderboardWithNewRegisteredUsers: function (leagueIds, allUsers, groupId) {
		return Promise.all([
			League.find({_id: {$in: leagueIds}})
		]).then(function (arr) {
			const promises = arr[0].map(function (league) {
				const leagueId = league._id;
				return Promise.all([
					UsersLeaderboard.find({leagueId: leagueId, groupId: groupId})
				]).then(function (arr) {
					arr[0].sort(self.compareAggregatedScores);
					return self.amendNewRegisteredUsers(arr[0], allUsers, leagueId, groupId);
				});
			});
			return Promise.all(promises);
		});
	},
	amendNewRegisteredUsers: function (leaderboard, allUsers, leagueId, groupId) {
		const userIdsInLeaderboard = leaderboard.map(a => a.userId.toString());
		const userIdsNotInLeaderboard = allUsers.filter(x => userIdsInLeaderboard.indexOf(x.toString()) === -1);
		if (userIdsNotInLeaderboard && userIdsNotInLeaderboard.length > 0) {
			userIdsNotInLeaderboard.sort(self.compareUserIds);

			userIdsNotInLeaderboard.forEach(function (userIdToAdd) {
				self.amendNewRegisteredUser(leaderboard, userIdToAdd, leagueId, groupId);
			});
			return leaderboard;
		} else {
			return leaderboard;
		}
	},
	amendNewRegisteredUser: function (leaderboard, userId, leagueId, groupId) {
		const leaderboardItem = {
			groupId: groupId,
			leagueId: leagueId,
			userId: userId,
			score: 0,
			strikes: 0,
			placeCurrent: -1,
			placeBeforeLastGame: -1,
		};

		UsersLeaderboard.findOneAndUpdate({
			groupId: groupId,
			userId: userId,
			leagueId: leagueId
		}, leaderboardItem, utils.updateSettings);

		leaderboard.splice(leaderboard.length - 1, 0, leaderboardItem);
	}
};