let Q = require('q');
let UserScore = require('../models/userScore');
let User = require('../models/user');
let MatchResult = require('../models/matchResult');
let TeamResult = require('../models/teamResult');
let MatchPrediction = require('../models/matchPrediction');
let TeamPrediction = require('../models/teamPrediction');
let Match = require('../models/match');
let Team = require('../models/team');
let groupConfiguration = require('../models/groupConfiguration');
let util = require('../utils/util');

let self = module.exports = {
    updateAllUserScores: function () {
        let deferred = Q.defer();
        console.log('beginning to update all user scores based on all current match/team results');
        // get {score conf, match results, teams results}
        self.getRelevantDataForUserScore().then(function (obj) {
            self.checkUpdateNeeded(obj).then(function (res) {
                if (res.needUpdate === true) {
                    let matchIds = [];
                    if (obj.matchResults) {
                        matchIds = obj.matchResults.map(function (match) {
                            return match._id;
                        });
                    }
                    let teamsIds = [];
                    if (obj.teamResults) {
                        teamsIds = obj.teamResults.map(function (team) {
                            return team._id;
                        });
                    }

                    return Promise.all([
                        Match.find({_id: {$in: matchIds}}),
                        Team.find({_id: {$in: teamsIds}})
                    ]).then(function (arr) {
                        return Promise.all([
                            self.updateUserScoreByMatchResults(obj.configuration, obj.matchResults, arr[0]),
                            self.updateUserScoreByTeamResults(obj.configuration, obj.teamResults, arr[1])
                        ]).then(function (arr) {
                            console.log('Succeed to update all user scores');
                            deferred.resolve(res);
                        });
                    });
                } else {
                    console.log('No need to update all user scores');
                    deferred.resolve(res);
                }
            });
        });
        return deferred.promise;
    },
    checkUpdateNeeded: function (obj) {
        return Promise.all([
            self.checkUpdateNeededForMatches(obj.matchResults),
            self.checkUpdateNeededForTeams(obj.teamResults)
        ]).then(function (arr) {
            let isUpdateNeeded = false;
            if (arr[0].includes(null) || arr[1].includes(null)) {
                isUpdateNeeded = true;
            }

            return {"needUpdate": isUpdateNeeded}
        });
    },
    checkUpdateNeededForMatches: function (matchResults) {
        if (matchResults.length === 0) {
            return Promise.resolve([]);
        }

        let promises = matchResults.map(function (aMatchResult) {
            return UserScore.findOne({gameId: aMatchResult.matchId});
        });
        return Promise.all(promises);
    },
    checkUpdateNeededForTeams: function (teamResults) {
        if (teamResults.length === 0) {
            Promise.resolve([])
        }

        let promises = teamResults.map(function (aTeamResult) {
            return UserScore.findOne({gameId: aTeamResult.teamId}, function (err, userScore) {
                return !(userScore && typeof(userScore) !== 'undefined');
            });
        });
        return Promise.all(promises);
    },
    updateScore: function (userScore) {
        //console.log('beginning to update score:' + userScore.gameId);
        let deferred = Q.defer();
        UserScore.findOneAndUpdate({userId: userScore.userId, gameId: userScore.gameId}, userScore, util.updateSettings, function (err, obj) {
                if (err) {
                    deferred.resolve();
                } else {
                    //console.log('succeed to update score:' + userScore.gameId);
                    deferred.resolve();
                }
            }
        );
        return deferred.promise;
    },
    updateUserScoreByMatchResults: function (configuration, matchResults, matches) {
        if (matchResults.length === 0) {
            return;
        }
        console.log('beginning to update user scores based on ' + matchResults.length + ' matchResults');
        // for each match result, get all matchPredictions
        let promises = matchResults.map(function (aMatchResult) {
            // for each match result,
            // find leagueId
            var leagueId = matches.find(x => x._id === aMatchResult.matchId).leagueId;
            // find all match predictions, update user score
            return self.updateUserScoreByMatchResult(configuration, aMatchResult, leagueId);
        });
        return Promise.all(promises);
    },
    updateUserScoreByMatchResult: function (configuration, matchResult, leagueId) {
        let deferred = Q.defer();
        MatchPrediction.find({matchId: matchResult.matchId}, function (err, anUserMatchPredictions) {
            self.updateUserScoreByMatchResultAndUserPredictions(matchResult, configuration, anUserMatchPredictions, leagueId).then(function () {
                deferred.resolve({});
            });
        });
        return deferred.promise;
    },
    updateUserScoreByMatchResultAndUserPredictions: function (matchResult, configuration, anUserMatchPredictions, leagueId) {
        if (anUserMatchPredictions && anUserMatchPredictions.length > 0) {
            //console.log('found ' + anUserMatchPredictions.length + ' user MatchPredictions');
            let promises = anUserMatchPredictions.map(function (userPrediction) {

                // calculate score for user
                let score = self.calculateUserPredictionScore(userPrediction, matchResult, configuration);
                let isStrikeCount = self.isScoreIsStrike(score, configuration);

                // score to update
                let userScore = {
                    leagueId: leagueId,
                    userId: userPrediction.userId,
                    gameId: userPrediction.matchId,
                    score: score,
                    strikes: isStrikeCount ? 1 : 0
                };

                return self.updateScore(userScore);
            });
            return Promise.all(promises);
        } else {
            return self.updateInitialScoreForAllUsers(matchResult.matchId);
        }
    },
    updateInitialScoreForAllUsers: function (matchId) {
        return User.find({}, function (err, users) {
            return self.updateInitialScoreForUsers(users, matchId);
        });
    },
    updateInitialScoreForUsers: function (users, matchId) {
        let promises = users.map(function (user) {
            return self.updateInitialScoreForUser(user, matchId);
        });
        return Promise.all(promises);
    },
    updateInitialScoreForUser: function (user, matchId) {
        return self.updateScore({
            userId: user._id,
            gameId: matchId,
            score: 0,
            strikes: 0
        });
    },
    updateUserScoreByTeamResults: function (configuration, teamResults) {
        if (teamResults.length === 0) {
            return;
        }
        console.log('beginning to update user scores based on ' + teamResults.length + ' teamResults');
        // for each team result, get all teamPredictions
        let promises = teamResults.map(function (aTeamResult) {
            // for each team result, find all team predictions, update user score
            return self.updateUserScoreByTeamResult(configuration, aTeamResult);
        });
        return Promise.all(promises);
    },
    updateUserScoreByTeamResult: function (configuration, teamResult) {
        let deferred = Q.defer();
        TeamPrediction.find({teamId: teamResult.teamId}, function (err, anUserTeamPredictions) {
            if (anUserTeamPredictions && anUserTeamPredictions.length > 0) {
                self.updateUserScoreByTeamResultAndUserPredictions(teamResult, configuration, anUserTeamPredictions).then(function () {
                    deferred.resolve({});
                });
            } else {
                deferred.resolve({});
            }
        });
        return deferred.promise;
    },
    updateUserScoreByTeamResultAndUserPredictions: function (teamResult, configuration, anUserTeamPredictions) {
        //console.log('found ' + anUserTeamPredictions.length + ' user MatchPredictions');
        let promises = anUserTeamPredictions.map(function (userPrediction) {
            let score = 0;
            let configScore = self.convertTeamTypeToConfigScore(teamResult.type, configuration[0]);
            score += util.calculateResult(userPrediction.team, teamResult.team, configScore);
            return self.updateScore({
                userId: userPrediction.userId,
                gameId: userPrediction.teamId,
                score: score,
                strikes: 0
            });
        });
        return Promise.all(promises);
    },
    getRelevantDataForUserScore: function () {
        return Promise.all([
            groupConfiguration.find({}),
            MatchResult.find({}),
            TeamResult.find({})
        ]).then(function (arr) {
            return {
                configuration: arr[0],
                matchResults: arr[1],
                teamResults: arr[2],
            }
        });
    },
    calculateUserPredictionScore: function (userPrediction, matchResult, configuration) {
        let score = 0;
        score += util.calculateResult(userPrediction.winner, matchResult.winner, configuration[0].winner);
        score += util.calculateResult(userPrediction.team1Goals, matchResult.team1Goals, configuration[0].team1Goals);
        score += util.calculateResult(userPrediction.team2Goals, matchResult.team2Goals, configuration[0].team2Goals);
        score += util.calculateResult(userPrediction.goalDiff, matchResult.goalDiff, configuration[0].goalDiff);
        score += util.calculateResult(userPrediction.firstToScore, matchResult.firstToScore, configuration[0].firstToScore);
        return score;
    },
    isScoreIsStrike: function (score, configuration) {
        let maxScore = (configuration[0].winner + configuration[0].team1Goals + configuration[0].team2Goals + configuration[0].goalDiff + configuration[0].firstToScore);
        return (score === maxScore);
    },
    convertTeamTypeToConfigScore: function (type, configuration) {
        if (!type) {
            return configuration.teamInGroup;
        } else if (type === '1st') {
            return configuration.teamWinner;
        } else if (type === '2nd') {
            return configuration.teamRunnerUp;
        } else if (type === '3rd') {
            return configuration.teamThird;
        } else if (type === '4th') {
            return configuration.teamForth;
        } else if (type === '14th') {
            return configuration.teamLast;
        } else if (type === '13th') {
            return configuration.team2ndLast;
        } else {
            return configuration.teamInGroup;
        }
    }
};