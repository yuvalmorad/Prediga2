component.SimulatorPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        SimulatorMatch = component.SimulatorMatch;

    function createMatchResult(predictionsSimulated, match) {
        var matchId = match._id;
        var predictionSimulated = utils.general.findItemInArrBy(predictionsSimulated, "matchId", matchId);
        //defaults
        var matchResult = {
            matchId: matchId
        };
        matchResult[GAME.BET_TYPES.TEAM1_GOALS.key] = 0;
        matchResult[GAME.BET_TYPES.TEAM2_GOALS.key] = 0;
        matchResult[GAME.BET_TYPES.FIRST_TO_SCORE.key] = "None";

        Object.assign(matchResult, predictionSimulated || {});

        var team1Goals = matchResult[GAME.BET_TYPES.TEAM1_GOALS.key];
        var team2Goals = matchResult[GAME.BET_TYPES.TEAM2_GOALS.key];

        matchResult[GAME.BET_TYPES.GOAL_DIFF.key] = Math.abs(team1Goals - team2Goals);
        matchResult[GAME.BET_TYPES.WINNER.key] = team1Goals > team2Goals ? match.team1 :
            (team1Goals < team2Goals ? match.team2 : "Draw");

        return matchResult;
    }

    function updateLeaders(leaders, predictions, matchResult, matchId) {
        var predictionsByMatchId = utils.general.findItemsInArrBy(predictions, "matchId", matchId);
        predictionsByMatchId.forEach(function(prediction) {
            var points = utils.general.calculateTotalPoints(prediction, matchResult);
            if (points) {
                var leader = utils.general.findItemInArrBy(leaders, "userId", prediction.userId);
                leader.score += points;
                var isStrike = utils.general.isPointsStrike(points);
                if (isStrike) {
                    leader.strikes += 1;
                }
            }
        });
    }

    var isRequestSent = false;

    var SimulatorPage = React.createClass({
        getInitialState: function() {
            if (!isRequestSent) {
                this.props.loadLeaderBoard();
                this.props.loadGamesPredictions();
                isRequestSent = true;
            }

            return {
                predictionsSimulated: [] //{matchId: "", team1Goals: 1, ...}
            };
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
                predictionsSimulated = state.predictionsSimulated,
                leaders = props.leaders,
                users = props.users,
                matches = props.matches.length ? [utils.general.findItemInArrBy(props.matches, "_id", "6a21a7c1a3f89181074e9865"), utils.general.findItemInArrBy(props.matches, "_id", "6a21a7c1a3f89181074e9871")] : [], //TODO remove
                userPredictions = props.userPredictions,
                otherPredictions = props.otherPredictions;

            if (!leaders.length || !matches.length) {
                return re("div", { className: "content" }, "");
            }

            leaders = JSON.parse(JSON.stringify(leaders)); //copy leaders

            //create matches elements + update leaders points/strikes
            var matchesElems = matches.map(function(match){
                var matchId = match._id;
                var matchResult = createMatchResult(predictionsSimulated, match);
                updateLeaders(leaders, userPredictions, matchResult, matchId);
                updateLeaders(leaders, otherPredictions, matchResult, matchId);

                return re(SimulatorMatch, {game: match, matchResult: matchResult, updateMatchChange: that.updateMatchChange});
            });

            //sort leaders
            leaders.sort(function(leader1, leader2){
               return leader2.score - leader1.score;
            });

            //update place
            leaders.forEach(function(leader, index){
                leader.placeBeforeLastGame = leader.placeCurrent;
                leader.placeCurrent = index + 1;
            });

            return re("div", { className: "content" },
                re("div", {className: "scroll-container"},
                    re("div", { className: "simulator-matches" },
                        matchesElems
                    ),
                    re(LeaderBoardTiles, {leaders: leaders, users: users, disableOpen: true, displayFirstTileByUserId: props.userId})
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            leaders: state.leaderBoard.leaders,
            users: state.leaderBoard.users,
            matches: state.gamesPredictions.matches,
            userPredictions: state.gamesPredictions.userPredictions,
            otherPredictions: state.gamesPredictions.otherPredictions,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadLeaderBoard: function(){dispatch(action.leaderBoard.loadLeaderBoard())},
            loadGamesPredictions: function(){dispatch(action.gamesPredictions.loadGames())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SimulatorPage);
})();


