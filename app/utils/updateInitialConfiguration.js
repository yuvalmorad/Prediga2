var Match = require('../models/match');
var MatchResult = require('../models/matchResult');
var Team = require('../models/team');
var TeamService = require('../services/teamService');
var TeamResult = require('../models/teamResult');
var UserScore = require('../models/userScore');
var MatchService = require('../services/matchService');
var MatchResultService = require('../services/matchResultService');
var TeamResultService = require('../services/teamResultService');
var UserScoreService = require('../services/userScoreService');
var PredictionScoreConfigurationService = require('../services/predictionScoreConfigurationService');
var UsersLeaderboardService = require('../services/leaderboardService');
var Q = require('q');

module.exports = {
    loadAll: function () {
        var deferred = Q.defer();
        return Promise.all([
            PredictionScoreConfigurationService.createConfiguration(require('../initialData/scoreConfiguration.json')),
            updateGames(require('../initialData/Tournament_Worldcup_18.json')),
            updateGames(require('../initialData/League_Israel_17-18.json')),
            //loadGames(require('../initialData/League_Champions_18.json'));
        ]).then(function (arr) {
            UserScoreService.removeUserScoreWithoutGames().then(function () {
                UsersLeaderboardService.updateLeaderboard().then(function (obj3) {
                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    }
};

function updateGames(gameJSON) {
    var deferred = Q.defer();
    var league = gameJSON.matches[0].league;

    return Promise.all([
        removeMatches(league),
        removeTeams(league),
    ]).then(function (arr) {
        return Promise.all([
            MatchService.createMatches(gameJSON.matches, league),
            createMatchResults(gameJSON.matchResults, league),
            TeamService.createTeams(gameJSON.teams, league),
            createTeamResults(gameJSON.teamResults, league)
        ]).then(function (arr) {
            deferred.resolve();
        });
    });

    return deferred.promise;
}

function createMatchResults(matchResults, league) {
    var deferred = Q.defer();
    var itemsProcessed = 0;
    console.log('creating ' + matchResults.length + ' matchesResults for ' + league);
    if (matchResults.length == 0){
        deferred.resolve();
        return;
    }
    matchResults.forEach(function (matchResult) {
        MatchResultService.updateMatchResult(matchResult).then(function (obj) {
            if (typeof(obj) === "undefined") {
                deferred.resolve(undefined);
            } else {
                MatchResultService.updateMatchScore(matchResult).then(function (obj2) {
                    itemsProcessed++;
                    if (itemsProcessed === matchResults.length) {
                        deferred.resolve(matchResults);
                    }
                });
            }
        });
    });
    return deferred.promise;
}

function createTeamResults(teamResults, league) {
    var deferred = Q.defer();
    var itemsProcessed = 0;
    console.log('creating ' + teamResults.length + ' teamsResults for ' + league);
    if (teamResults.length == 0){
        deferred.resolve();
        return;
    }
    teamResults.forEach(function (aTeamResult) {
        TeamResultService.updateTeamResult(aTeamResult).then(function (obj) {
            if (typeof(obj) === "undefined") {
                deferred.resolve(undefined);
            } else {
                TeamResultService.updateTeamScore(aTeamResult).then(function (obj2) {
                    itemsProcessed++;
                    if (itemsProcessed === teamResults.length) {
                        deferred.resolve(teamResults);
                    }
                });
            }
        });
    });
    return deferred.promise;
}

function removeMatches(league) {
    var deferred = Q.defer();
    Match.find({league: league}, function (err, leagueMatches) {
        if (err) return console.log(err);
        if (!leagueMatches || !Array.isArray(leagueMatches) || leagueMatches.length === 0) {
            console.log('removing 0 matches for ' + league);
            deferred.resolve();
            return;
        }

        console.log('removing ' + leagueMatches.length + ' matches for ' + league);
        var itemsProcessed = 0;
        leagueMatches.forEach(function (aMatch) {
            aMatch.remove();
            //console.log('removing {} matchResults for {}', aMatch._id);
            MatchResult.remove({matchId: aMatch._id}, function (err, obj) {
                // removing user's scores as well
                //console.log('removing {} userScore', aMatch._id);
                UserScore.remove({gameId: aMatch._id}, function (err, obj) {
                    itemsProcessed++;
                    if (itemsProcessed === leagueMatches.length) {
                        deferred.resolve();
                    }
                });
            });
        });
    });
    return deferred.promise;
}

function removeTeams(league) {
    var deferred = Q.defer();
    Team.find({league: league}, function (err, leagueTeams) {
        if (err) return console.log(err);
        if (!leagueTeams || !Array.isArray(leagueTeams) || leagueTeams.length === 0) {
            console.log('removing 0 teams for ' + league);
            deferred.resolve();
            return;
        }

        console.log('removing ' + leagueTeams.length + ' teams for ' + league);
        var itemsProcessed = 0;
        leagueTeams.forEach(function (aTeam) {
            aTeam.remove();
            TeamResult.remove({teamId: aTeam._id}, function (err, obj) {
                // removing user's scores as well
                UserScore.remove({gameId: aTeam._id}, function (err, obj) {
                    itemsProcessed++;
                    if (itemsProcessed === leagueTeams.length) {
                        deferred.resolve();
                    }
                });
            });
        });
    });
    return deferred.promise;
}