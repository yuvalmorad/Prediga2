const schedule = require('node-schedule');
const http = require('http');
const htmlparser = require("htmlparser2");
const matchService = require("../services/matchService");
const clubService = require("../services/clubService");
const leagueService = require("../services/leagueService");
const matchResultService = require("../services/matchResultService");
const userScoreService = require("../services/userScoreService");
const userLeaderboardService = require("../services/usersLeaderboardService");
const MatchResult = require("../models/matchResult");
const Q = require('q');
const mock365Html = require('../initialData/helpers/365Mock');
const isTestingMode = false;
const socketIo = require('../socketIo');
const pushNotificationUtil = require('./pushNotification');

const self = module.exports = {
	run: function (isFirstRun) {
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
				before.setMinutes(now.getMinutes() - 150);
				after.setMinutes(now.getMinutes() + 150);
				// start now
				if (isFirstRun || (aMatch.kickofftime >= before && aMatch.kickofftime <= after)) {
					console.log('start get result now');
					self.getResultsJob(undefined);
				} else {
					schedule.scheduleJob(aMatch.kickofftime, function () {
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

		return Promise.all([
			typeof (activeLeagues) === 'undefined' ? leagueService.getActiveLeagues() : activeLeagues
		]).then(function (arr) {
			const activeLeagues = arr[0];

			if (!activeLeagues && activeLeagues.length < 1) {
				console.log('No active leagues! going to sleep');
				schedule.scheduleJob(self.getNextJobDate(), function () {
					self.run();
				});
			}
			return Promise.all([
				self.getResults(activeLeagues)
			]).then(function (arr) {
				const hasInProgressGames = arr[0];
				if (hasInProgressGames) {
					console.log('There are more games in progress');

					schedule.scheduleJob(self.getNextJobDate(), function () {
						self.getResultsJob(activeLeagues)
					});
				} else {
					console.log('All games in progress are ended');
					schedule.scheduleJob(self.getNextJobDate(), function () {
						self.run();
					});
				}
			});
		});
	},
	getResults: function (activeLeagues) {
		console.log('Start to get results...');
		return Promise.all([
			self.getLatestData()
		]).then(function (arr) {
			const htmlRawData = arr[0];
			if (!htmlRawData || htmlRawData.length < 1) {
				console.log('No content received from remote host');
				return false;
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
						return self.updateMatchResults(relevantGames);
					} else {
						console.log('There are no relevant games.');
						return false;
					}
				});
			}
		});
	},
	updateMatchResults: function (relevantGames) {
		return self.updateMatchResultsMap(relevantGames).then(function (arr) {
			return arr.includes('getResultsJob');
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
	updateMatchResultsMap: function (relevantGames) {
		const promises = relevantGames.map(function (relevantGame) {
			return self.updateMatchResultsMapInner(relevantGame);
		});
		return Promise.all(promises);
	},
	updateMatchResultsMapInner: function (relevantGame) {
		return Promise.all([
			clubService.findClubsBy365Name(relevantGame)
		]).then(function (arr) {
			const team1 = arr[0].team1;
			const team2 = arr[0].team2;

			return Promise.all([
				matchService.findMatchByTeamsToday(team1, team2)
			]).then(function (arr1) {
				const aMatch = arr1[0];
				if (!aMatch || aMatch === null) {
					console.log('No match found or will be in the future, for [' + team1 + ' - ' + team2 + ']');
					return false;
				}
				return Promise.all([
					MatchResult.findOne({matchId: aMatch._id})
				]).then(function (arr2) {
					let currentMatchResult = arr2[0];
					const isRelevantGameFinished = relevantGame.Active === false && relevantGame.AutoProgressGT === false && relevantGame.Completion >= 100;
					// entering update match result if game in progress or game has finished but we don't have match result
					if (relevantGame.Active === true || (!currentMatchResult && isRelevantGameFinished) || (currentMatchResult && currentMatchResult.active === true && isRelevantGameFinished)) {
						console.log('Beginning to create new match result, for [' + team1 + ' - ' + team2 + ']');

						if (relevantGame.Active === true && !currentMatchResult) {
							// this is the first update of match result.
							console.log("sending push notification about game starts!");
							pushNotificationUtil.pushToAllRegisterdUsers({text: relevantGame.Comps[1].Name + ' - ' + relevantGame.Comps[0].Name + ' started', url: "/simulator/" + aMatch._id});
						}

						return Promise.all([
							self.calculateNewMatchResult(team1, team2, relevantGame, aMatch._id)
						]).then(function (arr3) {
							const newMatchResult = arr3[0];

							// send push notification to client
							const matchResultUpdate = {
								"matchResult": newMatchResult,
								"rawGame": relevantGame
							};
							socketIo.emit("matchResultUpdate", matchResultUpdate);

							return Promise.all([
								matchResultService.updateMatchResult(newMatchResult)
							]).then(function (arr4) {
								if (isRelevantGameFinished === false) {
									return 'getResultsJob';
								} else {
									const leagueId = aMatch.league;
									console.log('Beginning to update user score for [' + team1 + ' - ' + team2 + ']');
									return userScoreService.updateUserScoreByMatchResult(newMatchResult, leagueId).then(function () {
										console.log('Beginning to update leaderboard from the automatic updater');
										schedule.scheduleJob(self.getNextJobDate(), function () {
											userLeaderboardService.updateLeaderboardByGameIds(leagueId, [newMatchResult.matchId]).then(function(){
												//send socket with all leader boards
                                                userLeaderboardService.getLeaderboardWithNewRegisteredUsers().then(function (leaderboards) {
                                                    socketIo.emit("leaderboardUpdate", leaderboards);
                                                });
											});
										});
									});

								}
							});
						});
					} else {
						console.log('Game is already finished and we have a match result for it, or it is not started yet.');
						return false;
					}
				});

			});
		});
	},
	// TODO - refactor this method to more beautify method and not to calculate again all events
	calculateNewMatchResult: function (team1, team2, relevantGame, matchId) {
		const deferred = Q.defer();
		const newMatchResult = {
			winner: 'Draw',
			team1Goals: relevantGame.Scrs[0],
			team2Goals: relevantGame.Scrs[1],
			goalDiff: Math.abs(relevantGame.Scrs[0] - relevantGame.Scrs[1]),
			firstToScore: 'None', // will be calculated from the first event
			gameTime: relevantGame.GT,
			completion: relevantGame.Completion,
			active: relevantGame.Active,
			resultTime: new Date(),
			matchId: matchId
		};

		// fix for half time
		if (relevantGame.AutoProgressGT === false && relevantGame.Completion === 50) {
			newMatchResult.gameTime = 45;
		}

		// calculate winner
		if (newMatchResult.team2Goals > newMatchResult.team1Goals) {
			newMatchResult.winner = team2;
		} else if (newMatchResult.team2Goals < newMatchResult.team1Goals) {
			newMatchResult.winner = team1;
		}

		// filter events for goals to calculate first to score
		if (newMatchResult.firstToScore === 'None' && (newMatchResult.team1Goals > 0 || newMatchResult.team2Goals > 0)) {
			if (!relevantGame.Events || relevantGame.Events.length < 1) {
				deferred.resolve(newMatchResult);
			} else {
				let goalsEvents = relevantGame.Events.filter(function (anEvent) {
					return anEvent.Type === 0;
				});

				if (goalsEvents && goalsEvents.length > 0) {
					newMatchResult.firstToScore = goalsEvents[0].Comp === 1 ? team1 : team2;
				}
				deferred.resolve(newMatchResult);
			}
		} else {
			deferred.resolve(newMatchResult);
		}

		return deferred.promise;
	},
	getNextJobDate: function () {
		const nextJob = new Date();
		const now = new Date();
		nextJob.setSeconds(now.getSeconds() + 30);
		return nextJob;
	}
};