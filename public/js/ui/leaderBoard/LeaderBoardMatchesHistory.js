component.LeaderBoardMatchesHistory = (function(){
    var connect = ReactRedux.connect;
    var leaderBoardService = service.leaderBoard;

    var LeaderBoardMatchesHistory = React.createClass({
        getInitialState: function() {
            return {
                isLoading: true
            }
        },

        componentDidMount: function() {
            var that = this;
            leaderBoardService.getUserMatchPredictions(this.props.userId).then(function(res){
                var data = res.data;
                that.setState({
                    matches: data.matches,
                    predictions: data.predictions,
                    results: data.results,
                    isLoading: false
                });
            });
        },

        onLeaderboardMatchClicked: function(matchId, event) {
            var state = this.state,
                props = this.props,
                match = utils.general.findItemInArrBy(state.matches, "_id", matchId),
                dialogComponentProps = {
                    game: match,
                    result: utils.general.findItemInArrBy(state.results, "matchId", matchId),
                    prediction: utils.general.findItemInArrBy(state.predictions, "matchId", matchId),
                    team1: utils.general.findItemInArrBy(props.clubs, "_id", match.team1),
                    team2: utils.general.findItemInArrBy(props.clubs, "_id", match.team2),
                    league: utils.general.findItemInArrBy(props.leagues, "_id", props.selectedLeagueId),
                    hideMutualFriends: true,
                    isDialogFormDisabled: true
                };

            event.stopPropagation();
            this.props.openTileDialog("GamePredictionTileDialog", dialogComponentProps);
        },

        render: function() {
            var that = this,
                state = this.state,
                props = this.props,
                clubs = props.clubs,
                isLoading = state.isLoading,
                matches = state.matches || [],
                predictions = state.predictions || [],
                results = state.results || [];

            if (isLoading) {
                return re("div", {}, "");
            }

            if (!matches.length) {
                return re("div", {className: "no-content"}, "No Predictions Finished");
            }

            matches = matches.filter(function(match){
                var matchId = match._id;
                return utils.general.findItemInArrBy(predictions, "matchId", matchId) &&
                        utils.general.findItemInArrBy(results, "matchId", matchId)
            });
            matches.sort(function(match1, match2){
                return new Date(match2.kickofftime) - new Date(match1.kickofftime);
            });

            var rows = matches.map(function(match){
                var matchId = match._id,
                    dateObj = new Date(match.kickofftime),
                    dateStr = dateObj.getDate() + "/" + (dateObj.getMonth() + 1),
                    matchResult = utils.general.findItemInArrBy(results, "matchId", matchId),
                    matchPrediction = utils.general.findItemInArrBy(predictions, "matchId", matchId),
                    team1 = utils.general.findItemInArrBy(clubs, "_id", match.team1),
                    team2 = utils.general.findItemInArrBy(clubs, "_id", match.team2),
                    team1GoalsResult = matchPrediction && matchPrediction[GAME.BET_TYPES.TEAM1_GOALS.key],
                    team2GoalsResult = matchPrediction && matchPrediction[GAME.BET_TYPES.TEAM2_GOALS.key],
                    score = matchPrediction ? team1GoalsResult + " - " + team2GoalsResult : "(No Prediction)",
                    points = utils.general.calculateTotalPoints(matchPrediction, matchResult);

                return re("div", {className: "leaderboard-match-row", onClick: that.onLeaderboardMatchClicked.bind(that, matchId)},
                    re ("div", {className: "match-date"}, dateStr),
                    re("div", {className: "teams-score"},
                        re("div", {}, team1.name),
                        re("div", {}, score),
                        re("div", {}, team2.name)
                    ),
                    re("div", {},
                        re("div", {className: "points"}, points)
                    )
                );
            });

            return re("div", {className: "leaderboard-match-rows"}, rows);
        }
    });

    function mapStateToProps(state){
        return {
            clubs: state.leagues.clubs,
            leagues: state.leagues.leagues,
            selectedLeagueId: state.leagues.selectedLeagueId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            openTileDialog: function(componentName, componentProps){dispatch(action.general.openTileDialog(componentName, componentProps))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaderBoardMatchesHistory);
})();


