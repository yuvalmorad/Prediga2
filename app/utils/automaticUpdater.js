const schedule = require('node-schedule');
const http = require('http');
const htmlparser = require("htmlparser2");
const matchService = require("../services/matchService");
const clubService = require("../services/clubService");
const leagueService = require("../services/leagueService");
const matchResultService = require("../services/matchResultService");
const userScoreService = require("../services/userScoreService");
const userLeaderboardService = require("../services/usersLeaderboardService");
const groupConfiguration = require("../models/groupConfiguration");
const MatchResult = require("../models/matchResult");
const Q = require('q');
const mock365Html = require('../initialData/helpers/365Mock');
const isTestingMode = false;
const socketIo = require('../socketIo');
const pushNotificationUtil = require('./pushNotification');

const self = module.exports = {
	run: function () {
		console.log('Automatic update (run job) wake up');
		return Promise.all([
			matchService.getNextMatchDate()
		]).then(function (arr) {
			const aMatch = arr[0];
			if (!aMatch) {
				console.log('No more matches in the future! going to sleep');
				// TODO - schedule job to check again every day
				return {};
			}
			else {
				console.log('Next job will start at ' + aMatch.kickofftime);
				const now = new Date();
				const before = new Date();
				const after = new Date();
				before.setMinutes(now.getMinutes() - 105);
				after.setMinutes(now.getMinutes() + 105);
				// start now
				if (aMatch.kickofftime >= before && aMatch.kickofftime <= after) {
					console.log('start get result now');
					self.getResultsJob(undefined);
				} else {
					schedule.scheduleJob(aMatch.kickofftime, function () {
						//TODO just for fun it will send notification for all users when game starts -> should handle logic to send to specific user if no prediction was made for this match
						pushNotificationUtil.pushToAllRegisterdUsers("Game Has started :)");
						self.getResultsJob(undefined);
					});
				}


				if (isTestingMode) {
					self.getResultsJob(undefined);
				}
			}
		});
	},
	getResultsJob: function (activeLeagues) {
		console.log('Automatic update (getResults Job) wake up');
		const now = new Date();
		return Promise.all([
			typeof (activeLeagues) === 'undefined' ? leagueService.getActiveLeagues() : activeLeagues,
			groupConfiguration.find({})
		]).then(function (arr) {
			const activeLeagues = arr[0];

			if (!activeLeagues && activeLeagues.length < 1) {
				console.log('No active leagues! going to sleep');
				schedule.scheduleJob(now, function () {
					self.run()
				});
			}
			const configuration = arr[1];
			return Promise.all([
				self.getResults(activeLeagues, configuration)
			]).then(function (arr) {
				const hasInProgressGames = arr[0];

				if (hasInProgressGames) {
					console.log('There are more games in progress');
					const nextJob = new Date();
					nextJob.setMinutes(now.getMinutes() + 1);
					schedule.scheduleJob(nextJob, function () {
						self.getResultsJob(activeLeagues)
					});
				} else {
					console.log('All games in progress are ended');
					schedule.scheduleJob(now, function () {
						self.run()
					});
				}
			});
		});
	},
	getResults: function (activeLeagues, configuration) {
		console.log('Start to get results...');
		return Promise.all([
			self.getLatestData()
		]).then(function (arr) {
			const htmlRawData = arr[0];
			if (!htmlRawData || htmlRawData.length < 1) {
				console.log('No content received from remote host');
				return [];
			} else {
				console.log('Start to parse response...');
				const soccerContent = self.parseResponse(htmlRawData);
				console.log('Start to sync all relevant games...');
				return Promise.all([
					self.getRelevantGames(soccerContent, activeLeagues)
				]).then(function (arr2) {
					const relevantGames = arr2[0];
					if (relevantGames.length > 0) {
						console.log('Found ' + relevantGames.length + ' relevant games to update.');
						if (isTestingMode) {
							socketIo.emit("relevantGames", relevantGames);
						}
						return self.updateMatchResults(relevantGames, configuration);
					} else {
						console.log('There are no relevant games.');
						return [];
					}
				});
			}
		});
	},
	updateMatchResults: function (relevantGames, configuration) {
		return self.updateMatchResultsMap(relevantGames, configuration).then(function (arr) {
			if (arr.includes('updateLeaderboard')) {
				console.log('Start to update leaderboard');
				schedule.scheduleJob(new Date(), function () {
					userLeaderboardService.updateLeaderboard()
				});
			}
			if (arr.includes('getResultsJob')) {
				return true;
			} else {
				return false;
			}

		});
	},
	getLatestData: function () {
		const deferred = Q.defer();

		http.get('http://365scores.sport5.co.il:3333?SID=1', function (res) {
			let str = '';
			res.on('data', function (chunk) {
				//console.log('BODY: ' + chunk);
				str += chunk;
			});

			res.on('end', function () {
				if (isTestingMode) {
					str = mock365Html.getHtml(); // for debugging.
				}
				deferred.resolve(str);
			});

			res.on('error', function (err) {
				deferred.resolve('');
			});

		});
		return deferred.promise;
	},
	parseResponse: function (htmlRawData) {
		let txt = '';
		const parser = new htmlparser.Parser({
			onopentag: function (name, attribs) {

			},
			ontext: function (text) {
				if (text.indexOf('GLOBAL_DATA') !== -1) {
					txt = text;
				}
			},
			onclosetag: function (tagname) {

			}
		}, {decodeEntities: true});
		parser.write(htmlRawData);
		parser.end();

		const startIdx = txt.indexOf('var GLOBAL_DATA =');
		txt = txt.substr(startIdx);
		txt = txt.substr('var GLOBAL_DATA ='.length);
		const lastIdx = txt.indexOf(";");
		txt = txt.substr(0, lastIdx - 1);
		return JSON.parse(txt + "}");
	},
	getRelevantGames: function (soccerContent, competition365Arr) {
		const deferred = Q.defer();
		const relevantGames = [];
		soccerContent.Games.forEach(function (game, index) {
			if (competition365Arr.indexOf(game.Comp) !== -1) {
				relevantGames.push(game);
			}

			if (index === soccerContent.Games.length - 1) {
				deferred.resolve(relevantGames);
			}
		});
		return deferred.promise;
	},
	updateMatchResultsMap: function (relevantGames, configuration) {
		const promises = relevantGames.map(function (relevantGame) {
			return self.updateMatchResultsMapInner(relevantGame, configuration);
		});
		return Promise.all(promises);
	},
	updateMatchResultsMapInner: function (relevantGame, configuration) {
		return Promise.all([
			clubService.findClubsBy365Name(relevantGame)
		]).then(function (arr) {
			const team1 = arr[0].team1;
			const team2 = arr[0].team2;

			return Promise.all([
				matchService.findMatchByTeamsToday(team1, team2)
			]).then(function (arr1) {
				const aMatch = arr1[0];
				if (!aMatch) {
					console.log('No match found [' + team1 + ' - ' + team2 + ']');
					return false;
				}

				return Promise.all([
					MatchResult.findOne({matchId: aMatch._id})
				]).then(function (arr2) {
					const matchResult = arr2[0];
					// game already ended in db
					if (matchResult && matchResult.completion >= 100) {
						return false;
					}

					console.log('Beginning to create new match result for [' + team1 + ' - ' + team2 + ']');
					return Promise.all([
						self.calculateNewMatchResult(team1, team2, relevantGame)
					]).then(function (arr3) {
						const newMatchResult = arr3[0];
						newMatchResult.matchId = aMatch._id;

						// send push notification to client
						const matchResultUpdate = {
							"matchResult": newMatchResult,
							"rawGame": relevantGame
						};
						socketIo.emit("matchResultUpdate", matchResultUpdate);

						return Promise.all([
							matchResultService.updateMatchResult(newMatchResult)
						]).then(function (arr4) {
							if (newMatchResult.completion < 100) {
								return 'getResultsJob';
							} else if (newMatchResult.completion >= 100) {
								const leagueId = aMatch.league;
								console.log('Beginning to update user score for [' + team1 + ' - ' + team2 + ']');
								return userScoreService.updateUserScoreByMatchResult(configuration, newMatchResult, leagueId).then(function () {
									console.log('Finish to update all for [' + team1 + ' - ' + team2 + ']');
									return 'updateLeaderboard';
								});
							}
						});
					});
				});
			});
		});
	},
	// TODO - refactor this method to more beautify method and not to calculate again all events
	calculateNewMatchResult: function (team1, team2, relevantGame) {
		const deferred = Q.defer();
		const newMatchResult = {
			winner: 'Draw',
			team1Goals: 0,
			team2Goals: 0,
			goalDiff: 0,
			firstToScore: 'None',
			gameTime: relevantGame.GT,
			completion: relevantGame.Completion
		};

		if (!relevantGame.Events || relevantGame.Events.length < 1) {
			deferred.resolve(newMatchResult);
		} else {
			relevantGame.Events.forEach(function (anEvent, index) {
				if (anEvent.Type === 0) { // type = goal
					// update firstToScore if is still in initial state
					if (newMatchResult.firstToScore === 'None') {
						newMatchResult.firstToScore = anEvent.Comp === 1 ? team2 : team1;
					}
					// team2 goals
					if (anEvent.Comp === 1) { // home goals
						newMatchResult.team1Goals++;
					} // team1 goals
					else if (anEvent.Comp === 2) { // away goals
						newMatchResult.team2Goals++;
					}
				}
				if (index === relevantGame.Events.length - 1) {
					// calculate winner
					if (newMatchResult.team2Goals > newMatchResult.team1Goals) {
						newMatchResult.winner = team2;
					} else if (newMatchResult.team2Goals < newMatchResult.team1Goals) {
						newMatchResult.winner = team1;
					}

					// calculate diff
					newMatchResult.goalDiff = Math.abs(newMatchResult.team1Goals - newMatchResult.team2Goals);

					// return result
					deferred.resolve(newMatchResult);
				}
			});
		}

		return deferred.promise;
	}
};