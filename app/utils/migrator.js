let MatchResult = require("../models/matchResult");
let TeamResult = require("../models/teamResult");
let MatchPrediction = require("../models/matchPrediction");
let TeamPrediction = require("../models/teamPrediction");
let UserScore = require("../models/userScore");
let UsersLeaderboard = require("../models/usersLeaderboard");
let Club = require("../models/club");

let self = module.exports = {

    run: function () {
        return Promise.all([
            self.updateAllToIds(),
            self.updateUserScoreAndLeaderboardWithIsraeliLeagueId()
        ]).then(function (arr) {
            console.log('migration finished');
        });
    },
    // TODO - can run once and then can be disabled.
    updateUserScoreAndLeaderboardWithIsraeliLeagueId: function () {
        return Promise.all([
            self.migrateUserScoreWithLeagueId(),
            self.migrateLeaderboardWithLeagueId()
        ]).then(function (arr) {
            console.log('updateUserScoreAndLeaderboardWithIsraeliLeagueId finished');
        });
    },
    migrateUserScoreWithLeagueId: function () {
        return UserScore.find({}, function (err, userScores) {
            if (userScores) {
                let promises = userScores.map(function (userScore) {
                    userScore.leagueId = '5a21a7c1a3f89181074e9769';
                    return UserScore.findOneAndUpdate({_id: userScore._id}, userScore,
                        {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        });
                });
                return Promise.all(promises);
            }
        });
    },
    migrateLeaderboardWithLeagueId: function () {
        return UsersLeaderboard.find({}, function (err, usersLeaderboards) {
            if (usersLeaderboards) {
                let promises = usersLeaderboards.map(function (usersLeaderboard) {
                    usersLeaderboard.leagueId = '5a21a7c1a3f89181074e9769';
                    return UsersLeaderboard.findOneAndUpdate({_id: usersLeaderboard._id}, usersLeaderboard,
                        {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        });
                });
                return Promise.all(promises);
            }
        });
    },
    // TODO - can run once and then can be disabled.
    updateAllToIds: function () {
        return Club.find({}, function (err, clubs) {
            return Promise.all([
                self.migrateMatchPredictions(clubs),
                self.migrateTeamPredictions(clubs),
                self.migrateMatchResults(clubs),
                self.migrateTeamResults(clubs),
            ]).then(function (arr) {
                console.log('updateAllToIds finished');
            });
        });
    },
    migrateMatchPredictions: function (clubs) {
        return MatchPrediction.find({}, function (err, matchPredictions) {
            if (matchPredictions) {
                let promises = matchPredictions.map(function (matchPrediction) {
                    let newWinner = self.getClubIdByName(clubs, matchPrediction.winner);
                    if (newWinner) {
                        matchPrediction.winner = newWinner;
                    }

                    let newFirstToScore = self.getClubIdByName(clubs, matchPrediction.firstToScore);
                    if (newFirstToScore) {
                        matchPrediction.firstToScore = newFirstToScore;
                    }
                    return MatchPrediction.findOneAndUpdate({_id: matchPrediction._id}, matchPrediction,
                        {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        });
                });
                return Promise.all(promises);
            }
        });
    },
    migrateMatchResults: function (clubs) {
        return MatchResult.find({}, function (err, matchResults) {
            if (matchResults) {
                let promises = matchResults.map(function (matchResult) {
                    let newWinner = self.getClubIdByName(clubs, matchResult.winner);
                    if (newWinner) {
                        matchResult.winner = newWinner;
                    }

                    let newFirstToScore = self.getClubIdByName(clubs, matchResult.firstToScore);
                    if (newFirstToScore) {
                        matchResult.firstToScore = newFirstToScore;
                    }
                    return MatchResult.findOneAndUpdate({_id: matchResult._id}, matchResult,
                        {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        });
                });
                return Promise.all(promises);
            }
        });
    },
    migrateTeamPredictions: function (clubs) {
        return TeamPrediction.find({}, function (err, teamPredictions) {
            if (teamPredictions) {
                let promises = teamPredictions.map(function (teamPrediction) {
                    let newTeam = self.getClubIdByName(clubs, teamPrediction.team);
                    if (newTeam) {
                        teamPrediction.team = newTeam;
                    }
                    return TeamPrediction.findOneAndUpdate({_id: teamPrediction._id}, teamPrediction, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    });
                });
                return Promise.all(promises);
            }
        });
    },
    migrateTeamResults: function (clubs) {
        return TeamResult.find({}, function (err, teamResults) {
            if (teamResults) {
                let promises = teamResults.map(function (teamResult) {
                    let newTeam = self.getClubIdByName(clubs, teamResult.team);
                    if (newTeam) {
                        teamResult.team = newTeam;
                    }

                    return TeamResult.findOneAndUpdate({_id: teamResult._id}, teamResult,
                        {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        });
                });
                return Promise.all(promises);
            }
        });
    },
    getClubIdByName: function (clubs, name) {
        var clubRequested = clubs.find(x => x.name === name);
        if (clubRequested) {
            return clubRequested._id;
        }
        return name;
    }
};