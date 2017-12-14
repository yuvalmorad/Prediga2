var Q = require('q');
var UserScore = require('../models/userScore');
var User = require('../models/user');
var Match = require('../models/match');
var MatchResult = require('../models/matchResult');
var TeamResult = require('../models/teamResult');
var MatchPrediction = require('../models/matchPrediction');
var TeamPrediction = require('../models/teamPrediction');
var PredictionScoreConfiguration = require('../models/predictionScoreConfiguration');
var util = require('../utils/util');

var self = module.exports = {
    updateAllUserScores: function () {
        var deferred = Q.defer();
        console.log('beginning to update all user scores based on all current match/team results');
        // get {score conf, match results, teams results}
        self.getRelevantDataForUserScore().then(function (obj) {
            self.checkUpdateNeeded(obj).then(function (res) {
                if (res.needUpdate === true) {
                    return Promise.all([
                        self.updateUserScoreByMatchResults(obj.configuration, obj.matchResults),
                        self.updateUserScoreByTeamResults(obj.configuration, obj.teamResults)
                    ]).then(function (arr) {
                        console.log('Succeed to update all user scores');
                        deferred.resolve(res);
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
            var isUpdateNeeded = false;
            if (arr[0].includes(null) || arr[1].includes(null)) {
                isUpdateNeeded = true;
            }

            return {"needUpdate": isUpdateNeeded}
        });
    },
    checkUpdateNeededForMatches: function (matchResults) {
        if (matchResults.length == 0) {
            return Promise.resolve([]);
        }

        var promises = matchResults.map(function (aMatchResult) {
            return UserScore.findOne({gameId: aMatchResult.matchId});
        });
        return Promise.all(promises);
    },
    checkUpdateNeededForTeams: function (teamResults) {
        if (teamResults.length == 0) {
            Promise.resolve([])
        }

        var promises = teamResults.map(function (aTeamResult) {
            return UserScore.findOne({gameId: aTeamResult.teamId}, function (err, userScore) {
                return userScore & typeof(userScore) !== 'undefined' ? false : true;
            });
        });
        return Promise.all(promises);
    },
    updateScore: function (userScore) {
        //console.log('beginning to update score:' + userScore.gameId);
        var deferred = Q.defer();
        UserScore.findOneAndUpdate({userId: userScore.userId, gameId: userScore.gameId}, userScore, {
                upsert: true,
                setDefaultsOnInsert: true
            }, function (err, obj) {
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
    updateUserScoreByMatchResults: function (configuration, matchResults) {
        if (matchResults.length == 0) {
            return;
        }
        console.log('beginning to update user scores based on ' + matchResults.length + ' matchResults');
        // for each match result, get all matchPredictions
        var promises = matchResults.map(function (aMatchResult) {
            // for each match result, find all match predictions, update user score
            return self.updateUserScoreByMatchResult(configuration, aMatchResult);
        });
        return Promise.all(promises);
    },
    updateUserScoreByMatchResult: function (configuration, matchResult) {
        var deferred = Q.defer();
        MatchPrediction.find({matchId: matchResult.matchId}, function (err, anUserMatchPredictions) {
            self.updateUserScoreByMatchResultAndUserPredictions(matchResult, configuration, anUserMatchPredictions).then(function () {
                deferred.resolve({});
            });
        });
        return deferred.promise;
    },
    updateUserScoreByMatchResultAndUserPredictions: function (matchResult, configuration, anUserMatchPredictions) {
        if (anUserMatchPredictions && anUserMatchPredictions.length > 0) {
            //console.log('found ' + anUserMatchPredictions.length + ' user MatchPredictions');
            var promises = anUserMatchPredictions.map(function (userPrediction) {

                // calculate score for user
                var score = self.calculateUserPredictionScore(userPrediction, matchResult, configuration);
                var isStrikeCount = self.isScoreIsStrike(score, configuration);

                // score to update
                var userScore = {
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
        var promises = users.map(function (user) {
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
        if (teamResults.length == 0) {
            return;
        }
        console.log('beginning to update user scores based on ' + teamResults.length + ' teamResults');
        // for each team result, get all teamPredictions
        var promises = teamResults.map(function (aTeamResult) {
            // for each team result, find all team predictions, update user score
            return self.updateUserScoreByTeamResult(configuration, aTeamResult);
        });
        return Promise.all(promises);
    },
    updateUserScoreByTeamResult: function (configuration, teamResult) {
        var deferred = Q.defer();
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
        var promises = anUserTeamPredictions.map(function (userPrediction) {
            var score = 0;
            var configScore = self.convertTeamTypeToConfigScore(teamResult.type, configuration[0]);
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
            PredictionScoreConfiguration.find({}),
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
        var score = 0;
        score += util.calculateResult(userPrediction.winner, matchResult.winner, configuration[0].winner);
        score += util.calculateResult(userPrediction.team1Goals, matchResult.team1Goals, configuration[0].team1Goals);
        score += util.calculateResult(userPrediction.team2Goals, matchResult.team2Goals, configuration[0].team2Goals);
        score += util.calculateResult(userPrediction.goalDiff, matchResult.goalDiff, configuration[0].goalDiff);
        score += util.calculateResult(userPrediction.firstToScore, matchResult.firstToScore, configuration[0].firstToScore);
        return score;
    },
    isScoreIsStrike: function (score, configuration) {
        var maxScore = (configuration[0].winner + configuration[0].team1Goals + configuration[0].team2Goals + configuration[0].goalDiff + configuration[0].firstToScore);
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
    },
    // Not used
    removeUserScoreWithoutGames: function () {
        var deferred = Q.defer();
        UserScore.find({}, function (err, allUserScores) {
            if (allUserScores && allUserScores.length > 0) {
                var promises = allUserScores.map(function (aUserScore) {
                    return Match.find({_id: aUserScore.gameId}, function (err, aMatches) {
                        if (!aMatches || aMatches.length < 1) {
                            // removing all user score of this game
                            //console.log('removing user scores for game ' + aUserScore.gameId);
                            return UserScore.remove({gameId: aUserScore.gameId});
                        }
                    });
                });
                return Promise.all(promises);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
};