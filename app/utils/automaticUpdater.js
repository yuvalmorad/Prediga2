var schedule = require('node-schedule');
var http = require('http');
var htmlparser = require("htmlparser2");
var automaticUpdaterConstants = require("./automaticUpdaterConstants");
var matchService = require("../services/matchService");
var matchResultService = require("../services/matchResultService");
var userScoreService = require("../services/userScoreService");
var userLeaderboardService = require("../services/usersLeaderboardService");
var PredictionScoreConfiguration = require("../models/predictionScoreConfiguration");
var MatchResult = require("../models/matchResult");
var Q = require('q');

var self = module.exports = {
    startTask: function () {
        /**
         * Schedule a task that will start every 15 minutes between 17:30 - 00:30 (IL time), otherwise call /api/update as admin.
         */
        schedule.scheduleJob('*/15 15-22 * * *', function () {
            console.log('Start to automatic update match results');
            self.startAutomaticUpdateJob().then(function () {
                console.log('Finish to automatic update match results');
            });
        });

        // start the jon immediately now => disabled as it is not working good with the initialUpdater
        //self.startAutomaticUpdateJob();
    },
    startAutomaticUpdateJob: function () {
        var deferred = Q.defer();

        console.log('Start to get latest data');
        self.getLatestData().then(function (htmlRawData) {
            if (!htmlRawData || htmlRawData.length < 1) {
                console.log('No content received from remote');
                deferred.resolve();
            } else {
                console.log('Start to parse response');
                var soccerContent = self.parseResponse(htmlRawData);
                console.log('Start to get all completed games');
                self.getCompletedGames(soccerContent).then(function (completedGames) {
                    if (completedGames.length > 0) {
                        console.log('Found ' + completedGames.length + ' completed matches to update');
                        PredictionScoreConfiguration.find({}).then(function (configuration) {
                            self.updateCompletedGames(configuration, completedGames).then(function (arr) {
                                if (arr.includes(true)) {
                                    console.log('Start to update leaderboard');
                                    userLeaderboardService.updateLeaderboard().then(function () {
                                        console.log('Finish to update all');
                                        deferred.resolve();
                                    });
                                } else {
                                    console.log('Finish to update all');
                                    deferred.resolve();
                                }
                            });
                        });

                    } else {
                        console.log('Finish to update all');
                        deferred.resolve();
                    }
                });
            }
        });

        return deferred.promise;
    },
    getLatestData: function () {
        var deferred = Q.defer();

        http.get('http://365scores.sport5.co.il:3333?SID=1', function (res) {
            var str = '';
            res.on('data', function (chunk) {
                //console.log('BODY: ' + chunk);
                str += chunk;
            });

            res.on('end', function () {
                deferred.resolve(str);
            });

            res.on('error', function (err) {
                deferred.resolve('');
            });

        });
        return deferred.promise;
    },
    parseResponse: function (htmlRawData) {
        var txt;
        var parser = new htmlparser.Parser({
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

        var startIdx = txt.indexOf('var GLOBAL_DATA =');
        txt = txt.substr(startIdx);
        txt = txt.substr('var GLOBAL_DATA ='.length);
        var lastIdx = txt.indexOf(";");
        txt = txt.substr(0, lastIdx - 1);
        var parsedObj = JSON.parse(txt + "}");
        return parsedObj;
    },
    getCompletedGames: function (soccerContent) {
        var deferred = Q.defer();
        var itemsProcessed = 0;
        var completedGames = [];
        soccerContent.Games.forEach(function (game) {
            itemsProcessed++;
            if (game.Completion >= 100 && game.Comp === automaticUpdaterConstants.COMPETITION.ISRAEL) {
                completedGames.push(game);
            }

            if (itemsProcessed === soccerContent.Games.length) {
                deferred.resolve(completedGames);
            }
        });
        return deferred.promise;
    },
    updateCompletedGames: function (configuration, completedGames) {
        var promises = completedGames.map(function (completedGame) {
            return self.updateCompletedGame(configuration, completedGame);
        });
        return Promise.all(promises);
    },
    updateCompletedGame: function (configuration, completedGame) {
        var deferred = Q.defer();
        var team1 = automaticUpdaterConstants.parseName(completedGame.Comps[1].Name);
        var team2 = automaticUpdaterConstants.parseName(completedGame.Comps[0].Name);
        matchService.findMatchByTeamsToday(team1, team2).then(function (aMatch) {
            if (!aMatch) {
                console.log('Not found relevant match for ' + team1 + ' - ' + team2);
                deferred.resolve(false);
            } else {
                MatchResult.findOne({matchId: aMatch._id}, function (err, aMatchResult) {
                    if (!aMatchResult) {
                        console.log('Beginning to create new match result for ' + team1 + ' - ' + team2);
                        self.calculateNewMatchResult(team1, team2, completedGame.Events).then(function (newMatchResult) {
                            newMatchResult.matchId = aMatch._id;
                            console.log('Beginning to update new match result for ' + team1 + ' - ' + team2);
                            matchResultService.updateMatchResult(newMatchResult).then(function () {
                                console.log('Beginning to update user score for ' + team1 + ' - ' + team2);
                                userScoreService.updateUserScoreByMatchResult(configuration, newMatchResult).then(function () {
                                    console.log('Finish to update all for ' + team1 + ' - ' + team2);
                                    deferred.resolve(true);
                                });
                            });
                        });
                    } else {
                        console.log('Match result already exist for ' + team1 + ' - ' + team2);
                        deferred.resolve(false);
                    }
                });
            }
        });
        return deferred.promise;
    },
    calculateNewMatchResult: function (team1, team2, events) {
        var deferred = Q.defer();
        var newMatchResult = {
            winner: 'Draw',
            team1Goals: 0,
            team2Goals: 0,
            goalDiff: 0,
            firstToScore: 'None',
        };

        if (events.length < 1) {
            deferred.resolve(newMatchResult);
        } else {
            var itemsProcessed = 0;
            events.forEach(function (anEvent) {
                itemsProcessed++;
                if (anEvent.Type === 0) { // type = goal
                    // update firstToScore if is still in initial state
                    if (newMatchResult.firstToScore === 'None') {
                        newMatchResult.firstToScore = anEvent.Comp === 1 ? team2 : team1;
                    }
                    // team2 goals
                    if (anEvent.Comp === 1) {
                        newMatchResult.team2Goals++;
                    } // team1 goals
                    else {
                        newMatchResult.team1Goals++;
                    }
                }
                if (itemsProcessed === events.length) {
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