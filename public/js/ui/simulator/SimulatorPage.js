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

    function getClubName(clubId, team1, team2) {
        if (clubId === team1._id) {
            return team1.name;
        }

        if (clubId === team2._id) {
            return team2.name;
        }

        return clubId; // "None"/"Draw";
    }
    function updateLeaders(leaders, clubs, predictions, matchResult, matchId, match, groupConfiguration) {
        var predictionsByMatchId = utils.general.findItemsInArrBy(predictions, "matchId", matchId);
        predictionsByMatchId.forEach(function(prediction) {
            var points = utils.general.calculateTotalPoints(prediction, matchResult, groupConfiguration);
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

            leader.description = team1.shortName + " " + prediction[GAME.BET_TYPES.TEAM1_GOALS.key] + " - " + prediction[GAME.BET_TYPES.TEAM2_GOALS.key] + " " + team2.shortName + " (diff: " + prediction[GAME.BET_TYPES.GOAL_DIFF.key] + ")";
            leader.additionalDescription = "Winner - " + getClubName(prediction[GAME.BET_TYPES.WINNER.key], team1, team2);
            leader.additionalDescription2 = "1st Goal - " + getClubName(prediction[GAME.BET_TYPES.FIRST_TO_SCORE.key], team1, team2);
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

        toggleMatchesDropDownMenu: function() {
            this.setState({isMatchesDropDownMenuOpen: !this.state.isMatchesDropDownMenuOpen});
        },

        onDropDownMatchClicked: function(matchId) {
            this.setState({selectedMatchId: matchId, isMatchesDropDownMenuOpen: false, predictionsSimulated: []});
        },

        onBackButtonClicked: function() {
            routerHistory.goBack();
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
                clubs = props.clubs,
                predictions = props.predictions,
                userId = props.userId,
                matchElem,
                selectedLeagueId = props.selectedLeagueId,
                leagues = props.leagues,
                groupConfiguration = props.groupConfiguration;

            if (!leaders.length || !users.length || !matches.length || !clubs.length || !groupConfiguration) {
                return re("div", { className: "content" }, "");
            }

            leaders = utils.general.getLeadersByLeagueId(leaders, selectedLeagueId);
            leaders = JSON.parse(JSON.stringify(leaders)); //copy leaders

            if (selectedMatchId) {
                var match = utils.general.findItemInArrBy(matches, "_id", selectedMatchId);
                var matchResult = createMatchResult(predictionsSimulated, match);
                updateLeaders(leaders, clubs, predictions, matchResult, selectedMatchId, match, groupConfiguration);
                var league = utils.general.findItemInArrBy(leagues, "_id", match.league);
                matchElem = re(SimulatorMatch, {game: match, league: league, clubs:clubs, matchResult: matchResult, updateMatchChange: that.updateMatchChange});
            }

            var dropDownMatchesElems = matches.map(function(match){
                var matchId = match._id;
                var isSelected = selectedMatchId ? selectedMatchId === matchId : false;
                var team1 = utils.general.findItemInArrBy(clubs, "_id", match.team1);
                var team2 = utils.general.findItemInArrBy(clubs, "_id", match.team2);
                return re("div", {className: "match-row" + (isSelected ? " selected": ""), onClick: that.onDropDownMatchClicked.bind(that, matchId), key: "dropdownMatch_" + matchId},
                    re("div", {}, utils.general.formatHourMinutesTime(match.kickofftime)),
                    re("div", {}, team1.name + " - " + team2.name)
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
                re("div", {className: "subHeader"},
                    re("a", {className: "back-button", onClick: this.onBackButtonClicked}, "Back"),
                    re("a", {className: "matches-dropdown-button", onClick: this.toggleMatchesDropDownMenu}, "Select Match"),
                    re("div", {})
                ),
                re("div", {className: "matches-dropdown-menu" + (isMatchesDropDownMenuOpen ? "" : " hide")},
                    re("div", {className: "matches"},
                        dropDownMatchesElems
                    )
                ),
                re("div", { className: "simulator-matches" },
                    matchElem
                ),
                re(LeaderBoardTiles, {leaders: leaders, users: users, selectedLeagueId: selectedLeagueId, disableOpen: true, userIdFocus: userId})
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
            selectedLeagueId: state.leagues.selectedLeagueId,
            leagues: state.leagues.leagues,
            clubs: state.leagues.clubs,
            groupConfiguration: state.groupConfiguration.groupConfiguration
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


