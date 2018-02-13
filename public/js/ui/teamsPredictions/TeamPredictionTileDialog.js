window.component = window.component || {};
component.TeamPredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        TeamPredictionMainTile = component.TeamPredictionMainTile,
        TeamPredictionFormTile = component.TeamPredictionFormTile;

    var TeamPredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                leagues = props.leagues,
                selectedLeagueId = props.selectedLeagueId,
                prediction = props.prediction,
                team = props.team,
                predictionCopy = Object.assign({}, prediction, {teamId: team._id});

            if (!predictionCopy.team) {
                predictionCopy.team = team.options.length ?
                                        team.options[0] :
                                        utils.general.findItemInArrBy(leagues, "_id", selectedLeagueId).clubs[0]
            }

            return {
                prediction: predictionCopy
            };
        },

        componentDidMount: function() {
            this.props.onDialogSave(this.onDialogSave);
        },

        onSelectedTeamChanged: function(teamId) {
            this.setState({
                prediction: Object.assign({}, this.state.prediction, {team: teamId})
            });
        },

        onDialogSave: function() {
            this.props.updateTeamSelected(this.state.prediction, this.props.selectedGroupId);
        },

        render: function() {
            var props = this.props,
                state = this.state,
                prediction = state.prediction,
                leagues = props.leagues,
                clubs = props.clubs,
                team = props.team,
                predictionCounters = props.predictionCounters,
                usersInGroupCount = props.usersInGroupCount,
                groupConfiguration = props.groupConfiguration,
                selectedTeam,
                borderColor = "gray",
                borderSecondColor = "",
                league = utils.general.findItemInArrBy(leagues, "_id", team.league);

            if (prediction && prediction.team) {
                selectedTeam = utils.general.findItemInArrBy(clubs, "_id", prediction.team);
                borderColor = selectedTeam.colors[0];
                borderSecondColor = selectedTeam.colors[1];
            }

            return re(TileDialog, {borderLeftColor: borderColor, borderLeftSecondColor: borderSecondColor, borderRightColor: borderColor, borderRightSecondColor: borderSecondColor, className: "team-prediction-tile"},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam, league: league, predictionCounters: predictionCounters, usersInGroupCount: usersInGroupCount, groupConfiguration: groupConfiguration}),
                re(TeamPredictionFormTile, {team: team, selectedTeam: selectedTeam, league: league, clubs: clubs, onSelectedTeamChanged: this.onSelectedTeamChanged})
            );
        }
    });

    function mapStateToProps(state){
        return {
            leagues: state.leagues.leagues,
            selectedLeagueId: state.groups.selectedLeagueId,
            clubs: state.leagues.clubs,
            selectedGroupId: state.groups.selectedGroupId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateTeamSelected: function(prediction, groupId){dispatch(action.teamsPredictions.updateTeamSelected(prediction, groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamPredictionTileDialog);
})();


