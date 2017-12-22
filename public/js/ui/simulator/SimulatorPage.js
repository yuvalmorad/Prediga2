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
                this.props.loadSimulator();
                if (this.props.leadersStatus === utils.action.REQUEST_STATUS.NOT_LOADED) {
                    this.props.loadLeaderBoard();
                }
                isRequestSent = true;
            }

            return {
                predictionsSimulated: [], //{matchId: "", team1Goals: 1, ...}
                isMatchesDropDownMenuOpen: false,
                selectedMatchId: ""
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

        toggleMatchesDropDownMenu: function() {
            this.setState({isMatchesDropDownMenuOpen: !this.state.isMatchesDropDownMenuOpen});
        },

        onDropDownMatchClicked: function(matchId) {
            this.setState({selectedMatchId: matchId, isMatchesDropDownMenuOpen: false, predictionsSimulated: []});
        },

        render: function() {
            var that = this,
                props = this.props,
                state = this.state,
                isMatchesDropDownMenuOpen = state.isMatchesDropDownMenuOpen,
                selectedMatchId = state.selectedMatchId,
                predictionsSimulated = state.predictionsSimulated,
                leaders = props.leaders,
                users = props.users,
                matches = props.matches,
                predictions = props.predictions,
                userId = props.userId,
                matchElem,
                dropDownButton,
                gameIdFromParam = props.match.params.gameId;

            if (!leaders.length || !matches.length) {
                return re("div", { className: "content" }, "");
            }

            if (!selectedMatchId && gameIdFromParam) {
                selectedMatchId = gameIdFromParam;
            }

            leaders = JSON.parse(JSON.stringify(leaders)); //copy leaders

            if (selectedMatchId) {
                var match = utils.general.findItemInArrBy(matches, "_id", selectedMatchId);
                var matchResult = createMatchResult(predictionsSimulated, match);
                updateLeaders(leaders, predictions, matchResult, selectedMatchId);
                matchElem = re(SimulatorMatch, {game: match, matchResult: matchResult, updateMatchChange: that.updateMatchChange});
            }

            dropDownButton = re("div", {className: "matches-dropdown-button"},
                re("a", {onClick: this.toggleMatchesDropDownMenu}, "Select Match")
            );

            var dropDownMatchesElems = matches.map(function(match){
                var matchId = match._id;
                var isSelected = selectedMatchId ? selectedMatchId === matchId : false;
                return re("div", {className: "match-row" + (isSelected ? " selected": ""), onClick: that.onDropDownMatchClicked.bind(that, matchId), key: "dropdownMatch_" + matchId},
                    re("div", {}, utils.general.formatHourMinutesTime(match.kickofftime)),
                    re("div", {}, match.team1 + " - " + match.team2)
                );
            });

            dropDownMatchesElems.unshift(
                re("div", {className: "match-row" + (selectedMatchId ? "": " selected"), onClick: that.onDropDownMatchClicked.bind(that, ""), key: "dropdownMatch_NONE"},
                    re("div", {}, "None")
                )
            );

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
                re("div", {className: "matches-dropdown-menu" + (isMatchesDropDownMenuOpen ? "" : " hide")},
                    re("div", {className: "matches"},
                        dropDownMatchesElems
                    )
                ),
                re("div", { className: "simulator-matches" },
                    dropDownButton,
                    matchElem
                ),
                re(LeaderBoardTiles, {leaders: leaders, users: users, disableOpen: true, userIdFocus: userId})
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
            users: state.users.users
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadSimulator: function(){dispatch(action.simulator.loadSimulator())},
            loadLeaderBoard: function(){dispatch(action.leaderBoard.loadLeaderBoard())},
            closeTileDialog: function(){dispatch(action.general.closeTileDialog())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SimulatorPage);
})();


