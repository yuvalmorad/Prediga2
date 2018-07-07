const schedule = require('node-schedule');
const http = require('http');
const htmlparser = require("htmlparser2");
const socketIo = require('./socketIo');
const utils = require('./util');
const matchService = require("../services/matchService");
const clubService = require("../services/clubService");
const leagueService = require("../services/leagueService");
const matchResultService = require("../services/matchResultService");
const pushSubscriptionService = require("../services/pushSubscriptionService");
const userScoreService = require("../services/userScoreService");
const userLeaderboardService = require("../services/usersLeaderboardService");

const self = module.exports = {
    run: function (isFirstRun) {
        console.log('Automatic update (run job) wake up');
        return matchService.getNextMatch(-10).then(function (match) {
            if (!match) {
                console.log('No more matches in the future! going to sleep for one day.');
                schedule.scheduleJob(self.getNextDayDate(), function () {
                    self.run();
                });
                return Promise.resolve({});
            }
            if (isFirstRun) {
                return self.getResultsJob();
            } else {
                console.log('[Automatic Updater] - Next automatic update at - ' + match.kickofftime);
                schedule.scheduleJob(match.kickofftime, function () {
                    self.getResultsJob();
                });

                return Promise.resolve({});
            }
        });
    },
    getResultsJob: function (activeLeagues) {
        console.log('Automatic update (getResults Job) wake up');
        return leagueService.getActiveLeagues(activeLeagues).then(function (leagues) {
            if (!leagues || leagues.length < 1) {
                schedule.scheduleJob(self.getNextJobDate(), function () {
                    self.run();
                });
                return Promise.resolve({});
            }
            return self.getResults(leagues).then(function (hasInProgressGames) {
                if (hasInProgressGames) {
                    console.log('[Automatic Updater] - There are more games in progress...');
                    schedule.scheduleJob(self.getNextJobDate(), function () {
                        self.getResultsJob(leagues)
                    });
                } else {
                    console.log('[Automatic Updater] - No games to update...');
                    schedule.scheduleJob(self.getNextJobDate(), function () {
                        self.run();
                    });
                }

                return Promise.resolve({});
            });
        });
    },
    getResults: function (activeLeagues) {
        console.log('[Automatic Updater] - Start to get results...');
        return self.getLatestData().then(function (htmlRawData) {
            if (!htmlRawData || htmlRawData.length < 1) {
                console.log('[Automatic Updater] - No content received from remote host');
                return Promise.resolve('getResultsJob');
            } else {
                try {
                    console.log('[Automatic Updater] - Start to parse response...');
                    let soccerContent = self.parseResponse(htmlRawData);
                    return self.getRelevantGames(soccerContent, activeLeagues).then(function (relevantMatches) {
                        if (!relevantMatches || relevantMatches < 1) {
                            console.log('[Automatic Updater] - There are no relevant games.');
                            return Promise.resolve(false);
                        }
                        console.log('[Automatic Updater] - ' + relevantMatches.length + ' relevant matches found...');
                        return self.updateMatchResults(relevantMatches);
                    });
                } catch (err) {
                    console.log('[Automatic Updater] - Error with parsing result. ' + err);
                    return Promise.resolve('getResultsJob'); // trying again.
                }
            }
        });
    },
    updateMatchResults: function (relevantGames) {
        return self.updateMatchResultsMap(relevantGames).then(function (arr) {
            return arr.includes('getResultsJob');
        });
    },
    getLatestData: function () {
        return new Promise(function (resolve, reject) {
            http.get(utils.AUTOMATIC_UPDATE_URL, function (res) {
                let str = '';
                res.on('data', function (chunk) {
                    //console.log('BODY: ' + chunk);
                    str += chunk;
                });

                res.on('end', function () {
                    resolve(str);
                });

                res.on('error', function (err) {
                    resolve({});
                });
            });
        });
    },
    parseResponse: function (htmlRawData) {
        let txt = '';
        const parser = new htmlparser.Parser({
            ontext: function (text) {
                if (text.indexOf('GLOBAL_DATA') !== -1) {
                    txt = text;
                }
            }
        }, {decodeEntities: true});
        parser.write(htmlRawData);
        parser.end();
        const startIdx = txt.indexOf('var GLOBAL_DATA =');
        txt = txt.substr(startIdx);
        txt = txt.substr('var GLOBAL_DATA ='.length);
        const lastIdx = txt.indexOf("Summary");
        txt = txt.substr(0, lastIdx - 2);
        return JSON.parse(txt + "}");
    },
    getRelevantGames: function (soccerContent, competition365Arr) {
        let relevantGames = [];
        soccerContent.Games.forEach(function (game) {
            if (competition365Arr.indexOf(game.Comp) !== -1) {
                relevantGames.push(game);
            }
        });
        return Promise.resolve(relevantGames);
    },
    updateMatchResultsMap: function (relevantGames) {
        const promises = relevantGames.map(function (relevantGame) {
            return self.updateMatchResultsMapInner(relevantGame);
        });
        return Promise.all(promises);
    },
    updateMatchResultsMapInner: function (relevantGame) {
        let isFinished = relevantGame.AutoProgressGT === false && relevantGame.Completion >= 100;
        const isActive = relevantGame.Active === true;
        if (!isActive && !isFinished) {
            // game not yet started
            console.log('[Automatic Updater] - Game is not yet started, for [' + relevantGame.Comps[0].Name + ' - ' + relevantGame.Comps[1].Name + ']');
            return Promise.resolve('getResultsJob'); // not relevant yet.
        }

        return clubService.findClubsBy365Name(relevantGame).then(function (clubsArr) {
            let team1Club = clubsArr.team1;
            let team2Club = clubsArr.team2;
            if (!team1Club || team1Club === null || !team2Club || team2Club === null) {
                console.log('[Automatic Updater] - Error to find clubs by 365 name');
                return Promise.resolve('getResultsJob'); // try again.
            }
            const team1 = team1Club._id;
            const team2 = team2Club._id;

            return matchService.findFirstMatchByTeamsStarted(team1, team2).then(function (match) {
                if (!match || match === null) {
                    console.log('[Automatic Updater] - Game already finished, for [' + team1Club.name + ' vs ' + team2Club.name + ']');
                    return Promise.resolve('getResultsJob'); // not relevant anymore.
                }

                return matchResultService.byMatchId(match._id).then(function (currentMatchResult) {
                    console.log('[Automatic Updater] - Beginning to create new match result, for [' + team1Club.name + ' vs ' + team2Club.name + ']');

                    if (relevantGame.Active === true && !currentMatchResult) {
                        // this is the first update of match result.
                        console.log("[Automatic Updater] - sending push notification about game starts!");
                        pushSubscriptionService.pushToAllRegiseredUsers({
                            text: 'Game started | ' + team1Club.name + ' vs ' + team2Club.name
                        });
                    }
                    // end after 90 minutes.
                    if (relevantGame.Active === true && relevantGame.GT >= 90 && relevantGame.AutoProgressGT === true
                        && relevantGame.Completion < 90){
                        isFinished = true;
                    }
                    if (isFinished && (currentMatchResult && currentMatchResult.active === false)) {
                        return Promise.resolve('getResultsJob'); // not relevant anymore.
                    }

                    return self.calculateNewMatchResult(team1, team2, relevantGame, match._id, isFinished).then(function (newMatchResult) {
                        // send push notification to client
                        const matchResultUpdate = {
                            "matchResult": newMatchResult,
                            "rawGame": relevantGame
                        };

                        if (self.isGoalOccur(currentMatchResult, newMatchResult)) {
                            pushSubscriptionService.pushToAllRegiseredUsers({
                                text: 'Goal!!!! ' + team1Club.name + ' ' + newMatchResult.team1Goals + ' - ' + newMatchResult.team2Goals + ' ' + team2Club.name
                            });
                        }
                        // half-time alerts
                        if (relevantGame.AutoProgressGT === false && relevantGame.Completion === 50
                         && currentMatchResult !== null && typeof(currentMatchResult.autoProgressGT) !== 'undefined' && currentMatchResult.autoProgressGT === true){
                            // half-time started
                            pushSubscriptionService.pushToAllRegiseredUsers({
                                text: 'Half time break | ' + team1Club.name + ' ' + newMatchResult.team1Goals + ' - ' + newMatchResult.team2Goals + ' ' + team2Club.name
                            });
                        }

                        if (relevantGame.AutoProgressGT === true && relevantGame.Completion >= 50
                            && currentMatchResult !== null && typeof(currentMatchResult.autoProgressGT) !== 'undefined' && currentMatchResult.autoProgressGT === false){
                            // half-time started
                            pushSubscriptionService.pushToAllRegiseredUsers({
                                text: 'Second half started | ' + team1Club.name + ' ' + newMatchResult.team1Goals + ' - ' + newMatchResult.team2Goals + ' ' + team2Club.name
                            });
                        }

                        // TODO - used in simulator screen, verify it is relevant for the user, he is in a group with this game
                        socketIo.emit("matchResultUpdate", matchResultUpdate);

                        return matchResultService.updateMatchResult(newMatchResult).then(function () {
                            if (isFinished === false) {
                                return Promise.resolve('getResultsJob'); // in progress
                            } else {
                                console.log('[Automatic Updater] - Game has finished, for [' + team1Club.name + ' vs ' + team2Club.name + ']');
                                const leagueId = match.league;
                                pushSubscriptionService.pushToAllRegiseredUsers({
                                    text: 'Game finished | ' + team1Club.name + ' ' + newMatchResult.team1Goals + ' - ' + newMatchResult.team2Goals + ' ' + team2Club.name});
                                console.log('[Automatic Updater] - Beginning to update user score, for [' + team1Club.name + ' vs ' + team2Club.name + ']');
                                return userScoreService.updateUserScoreByMatchResult(newMatchResult, leagueId).then(function () {
                                    //console.log('[Automatic Updater] - Beginning to update leaderboard from the automatic updater');
                                    return userLeaderboardService.updateLeaderboardByGameIds(leagueId, [newMatchResult.matchId]).then(function () {
                                        return Promise.resolve(false); // not relevant anymore.
                                        // TODO - How to know to emit the right leaderboard to the right user?
                                        /*userLeaderboardService.getLeaderboardWithNewRegisteredUsers(leagueId).then(function (leaderboards) {
                                            socketIo.emit("leaderboardUpdate", leaderboards);
                                        });*/
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    },
    calculateNewMatchResult: function (team1, team2, relevantGame, matchId, isFinished) {
        const newMatchResult = {
            winner: 'Draw',
            team1Goals: relevantGame.Scrs[0],
            team2Goals: relevantGame.Scrs[1],
            goalDiff: Math.abs(relevantGame.Scrs[0] - relevantGame.Scrs[1]),
            firstToScore: 'None', // will be calculated from the first event
            gameTime: relevantGame.GT,
            completion: relevantGame.Completion,
            active: isFinished ? false : relevantGame.Active,
            resultTime: new Date(),
            matchId: matchId,
            autoProgressGT: relevantGame.AutoProgressGT
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
                return Promise.resolve(newMatchResult);
            } else {
                let goalsEvents = relevantGame.Events.filter(function (anEvent) {
                    return anEvent.Type === 0;
                });

                if (goalsEvents && goalsEvents.length > 0) {
                    newMatchResult.firstToScore = goalsEvents[0].Comp === 1 ? team1 : team2;
                }
                return Promise.resolve(newMatchResult);
            }
        } else {
            return Promise.resolve(newMatchResult);
        }
    },
    getNextJobDate: function () {
        const nextJob = new Date();
        const now = new Date();
        nextJob.setSeconds(now.getSeconds() + 30);
        return nextJob;
    },
    getNextDayDate: function () {
        const nextJob = new Date();
        const now = new Date();
        nextJob.setHours(now.getHours() + 24);
        return nextJob;
    },
    isGoalOccur: function (existingMatchResult, newMatchResult) {
        if (existingMatchResult && newMatchResult && ((existingMatchResult.team1Goals !== newMatchResult.team1Goals) ||
            (existingMatchResult.team2Goals !== newMatchResult.team2Goals))) {
            return true;
        } else {
            return false;
        }
    }
};