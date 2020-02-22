const schedule = require('node-schedule');
const https = require('https');
const mockResults = require('./mock');
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
        console.log('[Automatic Updater] (run job) wake up');
        return matchService.getNextMatch(-10).then(function (match) {
            if (!match) {
                console.log('[Automatic Updater] No matches in the near future! going to sleep for one day.');
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
    getResultsJob: function () {
        console.log('[Automatic Updater] (getResults Job) wake up');
        return leagueService.getCompetitionIdForActiveLeagues().then(function (competitionIds) {
            if (!competitionIds || competitionIds.length < 1) {
                schedule.scheduleJob(self.getNextJobDate(), function () {
                    self.run();
                });
                return Promise.resolve({});
            }
            return self.getResults(competitionIds).then(function (hasInProgressGames) {
                if (hasInProgressGames) {
                    console.log('[Automatic Updater] - There are more games in progress...');
                    schedule.scheduleJob(self.getNextJobDate(), function () {
                        self.getResultsJob()
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
    getResults: function (competitionIds) {
        console.log('[Automatic Updater] - Start to get results...');
        return self.getLatestData().then(function (soccerContent) {
            if (!soccerContent || soccerContent.length < 1) {
                console.log('[Automatic Updater] - No content received from remote host');
                return Promise.resolve('getResultsJob');
            } else {
                try {
                    console.log('[Automatic Updater] - Start to parse response...');
                    soccerContent = JSON.parse(soccerContent);
                    return self.getRelevantGames(soccerContent, competitionIds).then(function (relevantMatches) {
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
            try {
                //resolve(JSON.stringify(mockResults));
                https.get("https://www.telesport.co.il/ajaxactions/sportlivepage.ashx?sportLive=updateGamesLive", function (res) {
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
            } catch (e) {
                resolve({});
            }
        });
    },
    getRelevantGames: function (soccerContent, competition365Arr) {
        let relevantGames = [];
        soccerContent.forEach(function (game) {
            if (competition365Arr.indexOf(game.league_id) !== -1) {
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
        let isFinished = relevantGame.active === false && relevantGame.status_name === 'הסתיים';
        if (relevantGame.active === false && isFinished === false) {
            // game not yet started
            console.log('[Automatic Updater] - Game is not yet started, for [' + relevantGame.twoPVSI.p1_name + ' - ' + relevantGame.twoPVSI.p2_name + ']');
            return Promise.resolve('getResultsJob'); // not relevant yet.
        }

        return clubService.findClubsBy365Name(relevantGame).then(function (clubsArr) {
            let team1Club = clubsArr.team1;
            let team2Club = clubsArr.team2;
            if (!team1Club || team1Club === null || !team2Club || team2Club === null) {
                console.log('[Automatic Updater] - Error to find clubs by 365 name. team1Club = ' + team1Club + ',team2Club= ' + team2Club);
                return Promise.resolve('getResultsJob'); // try again.
            }
            const team1 = team1Club._id.toString();
            const team2 = team2Club._id.toString();

            return matchService.findFirstMatchByTeamsStarted(team1, team2).then(function (match) {
                if (!match || match === null) {
                    console.log('[Automatic Updater] - Game already finished or not exist, for [' + team1Club.name + ' vs ' + team2Club.name + ']');
                    return Promise.resolve('getResultsJob'); // not relevant anymore.
                }

                return matchResultService.byMatchId(match._id).then(function (currentMatchResult) {
                    if (isFinished === true && currentMatchResult && currentMatchResult.active === false) {
                        // not relevant anymore, already updated as finished game
                        return Promise.resolve('getResultsJob');
                    }

                    if (relevantGame.active === true && !currentMatchResult) {
                        // this is the first update of match result.
                        console.log("[Automatic Updater] - sending push notification about game starts!");
                        pushSubscriptionService.pushToAllRegiseredUsers({
                            text: 'Game started | ' + team1Club.name + ' vs ' + team2Club.name
                        });
                    }
                    console.log('[Automatic Updater] - update match result, for [' + team1Club.name + ' vs ' + team2Club.name + ']');
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
                        if (relevantGame.status_name === "מחצית" && currentMatchResult && currentMatchResult.status_name !== "מחצית") {
                            // half-time break
                            pushSubscriptionService.pushToAllRegiseredUsers({
                                text: 'Half time break | ' + team1Club.name + ' ' + newMatchResult.team1Goals + ' - ' + newMatchResult.team2Goals + ' ' + team2Club.name
                            });
                        }

                        if (relevantGame.status_name !== "מחצית" && currentMatchResult && currentMatchResult.status_name === "מחצית") {
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
                                    text: 'Game finished | ' + team1Club.name + ' ' + newMatchResult.team1Goals + ' - ' + newMatchResult.team2Goals + ' ' + team2Club.name
                                });
                                console.log('[Automatic Updater] - Beginning to update user score, for [' + team1Club.name + ' vs ' + team2Club.name + ']');
                                return userScoreService.updateUserScoreByMatchResult(newMatchResult, leagueId).then(function () {
                                    console.log('[Automatic Updater] - Beginning to update leaderboard from the automatic updater');
                                    return userLeaderboardService.updateLeaderboardByGameIds(leagueId, [newMatchResult.matchId]).then(function () {
                                        return Promise.resolve(false); // not relevant anymore.
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
            team1Goals: relevantGame.twoPVSI.p1score,
            team2Goals: relevantGame.twoPVSI.p2score,
            goalDiff: Math.abs(relevantGame.twoPVSI.p1score - relevantGame.twoPVSI.p2score),
            firstToScore: 'None', // will be calculated from the first event
            gameTime: relevantGame.minute,
            active: isFinished ? false : relevantGame.active,
            resultTime: new Date(),
            matchId: matchId,
            status_name: relevantGame.status_name
        };

        // fix for half time
        if (relevantGame.status_name === "מחצית") {
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
            if ((!relevantGame.twoPVSI.p1_events || relevantGame.twoPVSI.p1_events.length < 1) &&
                (!relevantGame.twoPVSI.p2_events || relevantGame.twoPVSI.p2_events.length < 1)) {
                return Promise.resolve(newMatchResult);
            } else {
                var p1Scored = 999;
                var p2Scored = 999;
                let p1GoalsEvents = relevantGame.twoPVSI.p1_events.filter(function (anEvent) {
                    return anEvent.type === 1;
                });
                let p2GoalsEvents = relevantGame.twoPVSI.p2_events.filter(function (anEvent) {
                    return anEvent.type === 1;
                });
                if (p1GoalsEvents && p1GoalsEvents.length > 0) {
                    p1Scored = p1GoalsEvents[0].extraParam;
                }
                if (p2GoalsEvents && p2GoalsEvents.length > 0) {
                    p2Scored = p2GoalsEvents[0].extraParam;
                }

                if (p1Scored < p2Scored) {
                    newMatchResult.firstToScore = team1;
                } else if (p2Scored < p1Scored) {
                    newMatchResult.firstToScore = team2;
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
