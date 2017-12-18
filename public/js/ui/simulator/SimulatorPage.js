component.SimulatorPage = (function(){
    var connect = ReactRedux.connect,
        LeaderBoardTiles = component.LeaderBoardTiles,
        SimulatorMatch = component.SimulatorMatch;

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

            var matchesElems = matches.map(function(match){
                var matchId = match._id;
                var predictionSimulated = utils.general.findItemInArrBy(predictionsSimulated, "matchId", matchId);

                //defaults
                var mtachResult = {
                    matchId: matchId
                };
                mtachResult[GAME.BET_TYPES.TEAM1_GOALS.key] = 0;
                mtachResult[GAME.BET_TYPES.TEAM2_GOALS.key] = 0;
                mtachResult[GAME.BET_TYPES.FIRST_TO_SCORE.key] = "None";

                Object.assign(mtachResult, predictionSimulated || {});

                //update leaders
                var userPrediction = utils.general.findItemInArrBy(userPredictions, "matchId", matchId);
                var leader = utils.general.findItemInArrBy(leaders, "userId", userPrediction.userId);
                //TODO check after update
                leader




                return re(SimulatorMatch, {game: match, mtachResult: mtachResult, updateMatchChange: that.updateMatchChange});
            });

            return re("div", { className: "content" },
                re("div", {className: "scroll-container"},
                    re("div", { className: "simulator-matches" },
                        matchesElems
                    ),
                    re(LeaderBoardTiles, {leaders: leaders, users: users,disableOpen: true})
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
            otherPredictions: state.gamesPredictions.otherPredictions
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


