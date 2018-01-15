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
            this.props.updateTeamSelected(this.state.prediction);
        },

        render: function() {
            var props = this.props,
                state = this.state,
                prediction = state.prediction,
                leagues = props.leagues,
                clubs = props.clubs,
                team = props.team,
                selectedTeam,
                borderColor = "gray",
                borderSecondColor = "",
                league = utils.general.findItemInArrBy(leagues, "_id", team.league),
                leagueName = league.name;

            if (prediction && prediction.team) {
                selectedTeam = utils.general.findItemInArrBy(clubs, "_id", prediction.team);
                borderColor = selectedTeam.colors[0];
                borderSecondColor = selectedTeam.colors[1];
            }

            return re(TileDialog, {borderLeftColor: borderColor, borderLeftSecondColor: borderSecondColor, borderRightColor: borderColor, borderRightSecondColor: borderSecondColor, className: "team-prediction-tile"},
                re(TeamPredictionMainTile, {team: team, selectedTeam: selectedTeam, league: league, fixedDescription: leagueName}),
                re(TeamPredictionFormTile, {team: team, selectedTeam: selectedTeam, league: league, clubs: clubs, onSelectedTeamChanged: this.onSelectedTeamChanged})
            );
        }
    });

    function mapStateToProps(state){
        return {
            leagues: state.leagues.leagues,
            selectedLeagueId: state.groups.selectedLeagueId,
            clubs: state.leagues.clubs
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateTeamSelected: function(prediction){dispatch(action.teamsPredictions.updateTeamSelected(prediction))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(TeamPredictionTileDialog);
})();


