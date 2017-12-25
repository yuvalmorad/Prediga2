let schedule = require('node-schedule');
let http = require('http');
let htmlparser = require("htmlparser2");
let matchService = require("../services/matchService");
let clubService = require("../services/clubService");
let leagueService = require("../services/leagueService");
let matchResultService = require("../services/matchResultService");
let userScoreService = require("../services/userScoreService");
let userLeaderboardService = require("../services/usersLeaderboardService");
let groupConfiguration = require("../models/groupConfiguration");
let MatchResult = require("../models/matchResult");
let Q = require('q');
let mock365Html = require('../initialData/helpers/365Mock');

let self = module.exports = {
    run: function () {
        console.log('Automatic update (run job) wake up');
        return Promise.all([
            matchService.getNextMatchDate()
        ]).then(function (arr) {
            let aMatch = arr[0];
            if (!aMatch) {
                console.log('No more matches in the future! going to sleep');
                // TODO - schedule job to check again every day
                return {};
            }
            else {
                console.log('Next job will start at ' + aMatch.kickofftime);
                schedule.scheduleJob(aMatch.kickofftime, function () {
                    self.getResultsJob();
                });

                self.getResultsJob();
            }
        });
    },
    getResultsJob: function (activeLeagues) {
        console.log('Automatic update (getResults Job) wake up');

        return Promise.all([
            typeof (activeLeagues) === 'undefined' ? leagueService.getActiveLeagues() : activeLeagues,
            groupConfiguration.find({})
        ]).then(function (arr) {
            let activeLeagues = arr[0];

            if (!activeLeagues && activeLeagues.length < 1) {
                console.log('No active leagues! going to sleep');
                return {};
            }
            let configuration = arr[1];
            return Promise.all([
                self.getResults(activeLeagues, configuration)
            ]).then(function (arr) {
                let hasInProgressGames = arr[0];
                let now = new Date();

                if (hasInProgressGames) {
                    console.log('There are more games in progress');
                    let nextJob = new Date();
                    nextJob.setMinutes(now.getMinutes() + 1);
                    schedule.scheduleJob(nextJob, function () {
                        self.getResultsJob()
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
            let htmlRawData = arr[0];
            if (!htmlRawData || htmlRawData.length < 1) {
                console.log('No content received from remote host');
                return [];
            } else {
                console.log('Start to parse response...');
                let soccerContent = self.parseResponse(htmlRawData);
                console.log('Start to sync all relevant games...');
                return Promise.all([
                    self.getRelevantGames(soccerContent, activeLeagues)
                ]).then(function (arr2) {
                    let relevantGames = arr2[0];
                    if (relevantGames.length > 0) {
                        console.log('Found ' + relevantGames.length + ' relevant games to update.');
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
        let deferred = Q.defer();

        http.get('http://365scores.sport5.co.il:3333?SID=1', function (res) {
            let str = '';
            res.on('data', function (chunk) {
                //console.log('BODY: ' + chunk);
                str += chunk;
            });

            res.on('end', function () {
                //str = mock365Html.getHtml(); // for debugging.
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
        let parser = new htmlparser.Parser({
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

        let startIdx = txt.indexOf('var GLOBAL_DATA =');
        txt = txt.substr(startIdx);
        txt = txt.substr('var GLOBAL_DATA ='.length);
        let lastIdx = txt.indexOf(";");
        txt = txt.substr(0, lastIdx - 1);
        return JSON.parse(txt + "}");
    },
    getRelevantGames: function (soccerContent, competition365Arr) {
        let deferred = Q.defer();
        let itemsProcessed = 0;
        let relevantGames = [];
        soccerContent.Games.forEach(function (game) {
            itemsProcessed++;
            if (competition365Arr.indexOf(game.Comp) !== -1) {
                relevantGames.push(game);
            }

            if (itemsProcessed === soccerContent.Games.length) {
                deferred.resolve(relevantGames);
            }
        });
        return deferred.promise;
    },
    updateMatchResultsMap: function (relevantGames, configuration) {
        let promises = relevantGames.map(function (relevantGame) {
            return self.updateMatchResultsMapInner(relevantGame, configuration);
        });
        return Promise.all(promises);
    },
    updateMatchResultsMapInner: function (relevantGame, configuration) {
        return Promise.all([
            clubService.findClubsBy365Name(relevantGame)
        ]).then(function (arr) {
            let team1 = arr[0].team1;
            let team2 = arr[0].team2;

            return Promise.all([
                matchService.findMatchByTeamsToday(team1, team2)
            ]).then(function (arr1) {
                let aMatch = arr1[0];
                if (!aMatch) {
                    console.log('No match found [' + team1 + ' - ' + team2 + ']');
                    return false;
                }

                return Promise.all([
                    MatchResult.findOne({matchId: aMatch._id})
                ]).then(function (arr2) {
                    let matchResult = arr2[0];
                    // game already ended in db
                    if (matchResult && matchResult.completion >= 100) {
                        return false;
                    }

                    console.log('Beginning to create new match result for [' + team1 + ' - ' + team2 + ']');
                    return Promise.all([
                        self.calculateNewMatchResult(team1, team2, relevantGame)
                    ]).then(function (arr3) {
                        let newMatchResult = arr3[0];
                        newMatchResult.matchId = aMatch._id;

                        return Promise.all([
                            matchResultService.updateMatchResult(newMatchResult)
                        ]).then(function (arr4) {
                            if (newMatchResult.completion < 100) {
                                return 'getResultsJob';
                            } else if (newMatchResult.completion === 100) {
                                let leagueId = aMatch.league;
                                console.log('Beginning to update user score for [' + team1 + ' - ' + team2 + ']');
                                return userScoreService.updateUserScoreByMatchResult(configuration, newMatchResult, leagueId).then(function () {
                                    console.log('Finish to update all for [' + team1 + ' - ' + team2 + ']');
                                    return 'updateLeaderboard';
                                });
                            } else {
                                return false;
                            }
                        });
                    });
                });
            });
        });
    },
    // TODO - refactor this method to more beautify method and not o calculate again all events
    calculateNewMatchResult: function (team1, team2, relevantGame) {
        let deferred = Q.defer();
        let newMatchResult = {
            winner: 'Draw',
            team1Goals: 0,
            team2Goals: 0,
            goalDiff: 0,
            firstToScore: 'None',
            gameTime: relevantGame.GT,
            completion: relevantGame.Completion
        };

        if (relevantGame.Events.length < 1) {
            deferred.resolve(newMatchResult);
        } else {
            let itemsProcessed = 0;
            relevantGame.Events.forEach(function (anEvent) {
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
                if (itemsProcessed === relevantGame.Events.length) {
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