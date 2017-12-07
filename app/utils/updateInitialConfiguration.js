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
            //loadGames(require('../initialData/League_Champions_17-18.json'));
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
    console.log('creating ' + matchResults.length + ' matchesResults for ' + league);
    if (matchResults.length == 0) {
        return;
    }
    var promises = matchResults.map(function (matchResult) {
        return MatchResultService.updateMatchResult(matchResult).then(function (obj) {
            if (typeof(obj) === "undefined") {
                return Promise.reject('general error');
            } else {
                return MatchResultService.updateMatchScore(matchResult);
            }
        });
    });
    return Promise.all(promises);
}

function createTeamResults(teamResults, league) {
    console.log('creating ' + teamResults.length + ' teamsResults for ' + league);
    if (teamResults.length == 0) {
        return;
    }
    var promises = teamResults.map(function (aTeamResult) {
        return TeamResultService.updateTeamResult(aTeamResult).then(function (obj) {
            if (typeof(obj) === "undefined") {
                return Promise.reject('general error');
            } else {
                return TeamResultService.updateTeamScore(aTeamResult);
            }
        });
    });
    return Promise.all(promises);
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
        removeLeagueMatches(leagueMatches).then(function () {
            deferred.resolve();
        });
    });
    return deferred.promise;
}

function removeLeagueMatches(leagueMatches) {
    var promises = leagueMatches.map(function (aMatch) {
        aMatch.remove();
        return MatchResult.remove({matchId: aMatch._id}, function (err, obj) {
            return UserScore.remove({gameId: aMatch._id});
        });
    });
    return Promise.all(promises);
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
        removeLeagueTeams(leagueTeams).then(function () {
            deferred.resolve();
        });
    });
    return deferred.promise;
}

function removeLeagueTeams(leagueTeams) {
    var promises = leagueTeams.map(function (aTeam) {
        aTeam.remove();
        return TeamResult.remove({teamId: aTeam._id}, function (err, obj) {
            return UserScore.remove({gameId: aTeam._id});
        });
    });
    return Promise.all(promises);
}