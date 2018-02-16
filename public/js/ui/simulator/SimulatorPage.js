window.component = window.component || {};
component.SimulatorPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        SimulatorMatch = component.SimulatorMatch;

    function createMatchPrediction(predictionsSimulated, match, matchResult) {
        var matchId = match._id;
        var predictionSimulated = utils.general.findItemInArrBy(predictionsSimulated, "matchId", matchId);
        var resultTeam1Goals = matchResult && matchResult[GAME.BET_TYPES.TEAM1_GOALS.key];
        var resultTeam2Goals = matchResult && matchResult[GAME.BET_TYPES.TEAM2_GOALS.key];
        var resultFirstToScore = matchResult && matchResult[GAME.BET_TYPES.FIRST_TO_SCORE.key];

        //defaults
        var matchPrediction = {
            matchId: matchId
        };
        matchPrediction[GAME.BET_TYPES.TEAM1_GOALS.key] = 0;
        matchPrediction[GAME.BET_TYPES.TEAM2_GOALS.key] = 0;
        matchPrediction[GAME.BET_TYPES.FIRST_TO_SCORE.key] = "None";

        Object.assign(matchPrediction, predictionSimulated || {});

        //check and update predictions against result
        if (resultFirstToScore !== undefined && !utils.general.isFirstScoreNone(resultFirstToScore)) {
            matchPrediction[GAME.BET_TYPES.FIRST_TO_SCORE.key] = resultFirstToScore;
        }

        if (resultTeam1Goals !== undefined && matchPrediction[GAME.BET_TYPES.TEAM1_GOALS.key] < resultTeam1Goals) {
            matchPrediction[GAME.BET_TYPES.TEAM1_GOALS.key] = resultTeam1Goals;
        }

        if (resultTeam2Goals !== undefined && matchPrediction[GAME.BET_TYPES.TEAM2_GOALS.key] < resultTeam2Goals) {
            matchPrediction[GAME.BET_TYPES.TEAM2_GOALS.key] = resultTeam2Goals;
        }

        //update diff and winner
        var team1Goals = matchPrediction[GAME.BET_TYPES.TEAM1_GOALS.key];
        var team2Goals = matchPrediction[GAME.BET_TYPES.TEAM2_GOALS.key];

        matchPrediction[GAME.BET_TYPES.GOAL_DIFF.key] = Math.abs(team1Goals - team2Goals);
        matchPrediction[GAME.BET_TYPES.WINNER.key] = team1Goals > team2Goals ? match.team1 :
            (team1Goals < team2Goals ? match.team2 : "Draw");

        return matchPrediction;
    }

    function getWinnerText(clubId, team1, team2) {
        if (clubId === team1._id) {
            return team1.name + " wins";
        }

        if (clubId === team2._id) {
            return team2.name + " wins";
        }

        return "Match draws";
    }

    function getFirstScoreText(clubId, team1, team2) {
        if (clubId === team1._id) {
            return team1.name + " scores first";
        }

        if (clubId === team2._id) {
            return team2.name + " scores first";
        }

        return "No first scorer";
    }

    function updateLeaders(leaders, clubs, predictions, matchPrediction, matchId, match, groupConfiguration) {
        var predictionsByMatchId = utils.general.findItemsInArrBy(predictions, "matchId", matchId);
        predictionsByMatchId.forEach(function(prediction) {
            var points = utils.general.calculateTotalPoints(prediction, matchPrediction, groupConfiguration);
            var leader = utils.general.findItemInArrBy(leaders, "userId", prediction.userId);
            if (points) {
                leader.score += points;
                var isStrike = utils.general.isPointsStrike(points, groupConfiguration);
                if (isStrike) {
                    leader.strikes += 1;
                }
            }

            var team1 = utils.general.findItemInArrBy(clubs, "_id", match.team1);
            var team2 = utils.general.findItemInArrBy(clubs, "_id", match.team2);

            leader.description = team1.shortName + " " + prediction[GAME.BET_TYPES.TEAM1_GOALS.key] + " - " + prediction[GAME.BET_TYPES.TEAM2_GOALS.key] + " " + team2.shortName + " (Diff: " + prediction[GAME.BET_TYPES.GOAL_DIFF.key] + ")";
            leader.additionalDescription = getWinnerText(prediction[GAME.BET_TYPES.WINNER.key], team1, team2);
            leader.additionalDescription2 = getFirstScoreText(prediction[GAME.BET_TYPES.FIRST_TO_SCORE.key], team1, team2);
        });
    }

    var SimulatorPage = React.createClass({
        getInitialState: function() {
            this.props.loadSimulator(this.props.selectedGroupId);
            this.props.loadLeaderBoard(this.props.selectedGroupId);
            this.props.loadGamesPredictions(this.props.selectedGroupId);

            return {
                predictionsSimulated: [], //{matchId: "", team1Goals: 1, ...}
                selectedMatchId: this.props.match.params.gameId
            };
        },

        componentDidMount: function() {
            this.props.closeTileDialog();
        },

        updateMatchChange: function(predictionToUpdate) {
            var predictionsSimulated = this.state.predictionsSimulated;
            var predictionSimulated = utils.general.findItemInArrBy(predictionsSimulated, "matchId", predictionToUpdate.matchId);

            if (predictionSimulated) {
                Object.assign(predictionSimulated, predictionToUpdate);
            } else {
                predictionsSimulated.push(predictionToUpdate);
            }

            this.forceUpdate();
        },

        render: function() {
            var that = this,
                props = this.props,
                state = this.state,
                selectedMatchId = state.selectedMatchId,
                predictionsSimulated = state.predictionsSimulated,
                leaders = props.leaders,
                users = props.users,
                matches = props.matches,
                clubs = props.clubs,
                predictions = props.predictions,
                userId = props.userId,
                matchElem,
                selectedLeagueId = props.selectedLeagueId,
                selectedGroupId = props.selectedGroupId,
                leagues = props.leagues,
                groupsConfiguration = props.groupsConfiguration,
                groupConfiguration,
                gamesPredictionsResults = props.gamesPredictionsResults;

            if (!leaders.length || !users.length || !matches.length || !clubs.length || !groupsConfiguration.length || this.props.gamesPredictionsStatus === utils.action.REQUEST_STATUS.NOT_LOADED) {
                return re("div", { className: "content" }, "");
            }

            groupConfiguration = utils.general.getGroupConfiguration(props.groups, selectedGroupId, groupsConfiguration);

            leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);
            leaders = JSON.parse(JSON.stringify(leaders)); //copy leaders

            if (selectedMatchId) {
                var match = utils.general.findItemInArrBy(matches, "_id", selectedMatchId);
                var matchResult = utils.general.findItemInArrBy(gamesPredictionsResults, "matchId", selectedMatchId);
                var matchPrediction = createMatchPrediction(predictionsSimulated, match, matchResult);
                updateLeaders(leaders, clubs, predictions, matchPrediction, selectedMatchId, match, groupConfiguration);
                var league = utils.general.findItemInArrBy(leagues, "_id", match.league);
                matchElem = re(SimulatorMatch, {game: match, league: league, clubs:clubs, matchPrediction: matchPrediction, matchResult: matchResult, updateMatchChange: that.updateMatchChange});
            }

            //sort leaders
            leaders.sort(function(leader1, leader2){
               return leader2.score - leader1.score;
            });

            //update place
            leaders.forEach(function(leader, index){
                leader.placeBeforeLastGame = leader.placeCurrent;
                leader.placeCurrent = index + 1;
            });

            return re("div", { className: "content simulator-page" },
                re("div", { className: "simulator-matches" },
                    matchElem
                ),
                re(LeaderBoardTiles, {leaders: leaders, users: users, selectedLeagueId: selectedLeagueId, disableOpen: true, userIdFocus: userId, userId: userId, selectedLeagueId: selectedLeagueId, selectedGroupId: selectedGroupId})
            );
        }
    });

    function mapStateToProps(state){
        return {
            matches: state.simulator.matches,
            predictions: state.simulator.predictions,
            leaders: state.leaderBoard.leaders,
            leadersStatus: state.leaderBoard.status,
            userId: state.authentication.userId,
            users: state.users.users,
            selectedLeagueId: state.groups.selectedLeagueId,
            leagues: state.leagues.leagues,
            clubs: state.leagues.clubs,
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration,
            gamesPredictionsResults: state.gamesPredictions.results,
            gamesPredictionsStatus: state.gamesPredictions.status,
            selectedGroupId: state.groups.selectedGroupId,
            groups: state.groups.groups
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadSimulator: function(groupId){dispatch(action.simulator.loadSimulator(groupId))},
            loadLeaderBoard: function(groupId){dispatch(action.leaderBoard.loadLeaderBoard(groupId))},
            closeTileDialog: function(){dispatch(action.general.closeTileDialog())},
            loadGamesPredictions: function(groupId){dispatch(action.gamesPredictions.loadGames(groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SimulatorPage);
})();


