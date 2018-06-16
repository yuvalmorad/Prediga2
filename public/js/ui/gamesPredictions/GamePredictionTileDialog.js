window.component = window.component || {};
component.GamePredictionTileDialog = (function(){
    var connect = ReactRedux.connect,
        TileDialog = component.TileDialog,
        GamePredictionMainTile = component.GamePredictionMainTile,
        GamePredictionFormTile = component.GamePredictionFormTile;

    var GamePredictionTileDialog = React.createClass({

        getInitialState: function() {
            var props = this.props,
                predictionCopy = Object.assign({}, {matchId: props.game._id}, props.prediction);

            return {
                prediction: predictionCopy
            };
        },

        componentDidMount: function() {
            this.props.onDialogSave(this.onDialogSave);
            this.props.setSaveButtonEnabled(false);
            this.setShowStrikeIndicationIfNeeded(this.state.prediction);
        },

        onDialogSave: function() {
            this.props.updateGame(this.state.prediction, this.props.selectedGroupId);
        },

        updateGameForm: function(predictionToUpdate) {
            var prediction = Object.assign({}, this.state.prediction, predictionToUpdate);
            this.setState({prediction: prediction});

            if (utils.general.isAllBetTypesExists(prediction)) {
                this.props.setSaveButtonEnabled(true);
            }

            this.setShowStrikeIndicationIfNeeded(prediction);
        },

		setShowStrikeIndicationIfNeeded: function(prediction) {
			if (utils.general.isAllBetTypesExists(prediction)) {
				//all prediction filled -> show indication with relevant strike
				this.props.setShowStrikeIndication(true, utils.general.isPredictionStrike(prediction, this.props.game));
			} else {
				//not all prediction filled -> remove strike indication
				this.props.setShowStrikeIndication(false, false);
            }
        },

        randomGamePrediction: function() {
            var props = this.props;
            var team1Id = props.team1._id;
            var team2Id = props.team2._id;
            var team1Goals = Math.floor(Math.random() * 3); //0,1,2
            var team2Goals = Math.floor(Math.random() * 3); //0,1,2
            var goalDiff = Math.abs(team1Goals - team2Goals);

            var firstToScore;
            if (team1Goals === 0 && team2Goals === 0) {
				firstToScore = "None";
            } else if (team1Goals === 0) {
				firstToScore = team2Id;
            } else if (team2Goals === 0) {
				firstToScore = team1Id;
			} else {
                //both teams has goals
				var firstToScoreOptions = [team1Id, team2Id];
				firstToScore = firstToScoreOptions[Math.floor(Math.random() * 2)];
            }

			var winner;
			if (team1Goals === team2Goals) {
				winner = "Draw";
			} else if (team1Goals > team2Goals) {
				winner = team1Id;
            } else {
				winner = team2Id;
            }

            var prediction = {
				firstToScore: firstToScore,
				goalDiff: goalDiff,
				team1Goals: team1Goals,
				team2Goals: team2Goals,
				winner: winner,
				matchId: this.state.prediction.matchId
			};
            this.setState({
                prediction: prediction
            });
            this.props.setSaveButtonEnabled(true);
			this.setShowStrikeIndicationIfNeeded(prediction);
        },

        render: function() {
            var state = this.state,
                props = this.props,
                prediction = state.prediction,
                game = props.game,
                team1 = props.team1,
                team2 = props.team2,
                league = props.league,
                result = props.result,
                groupConfiguration = utils.general.getGroupConfiguration(props.groups, props.selectedGroupId, props.groupsConfiguration),
                predictionCounters = props.predictionCounters,
                isDialogFormDisabled = props.isDialogFormDisabled,
				selectedGroupId = props.selectedGroupId;

            return re(TileDialog, {/*borderLeftColor: team1.colors[0], borderLeftSecondColor: team1.colors[1], borderRightColor: team2.colors[0], borderRightSecondColor: team2.colors[1],*/ className: "game-prediction-tile"},
                re(GamePredictionMainTile, {game: game, team1: team1, team2: team2, league: league, prediction: prediction, result: result, groupConfiguration: groupConfiguration, predictionCounters: predictionCounters, updateGameForm: this.updateGameForm, randomGamePrediction: this.randomGamePrediction, isDialogFormDisabled: isDialogFormDisabled, selectedGroupId: selectedGroupId}),
                re(GamePredictionFormTile, {game: game, team1: team1, team2: team2, league: league, prediction: prediction, result: result, groupConfiguration: groupConfiguration, updateGameForm: this.updateGameForm, isDialogFormDisabled: isDialogFormDisabled})
            );
        }
    });

    function mapStateToProps(state){
        return {
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration,
            selectedGroupId: state.groups.selectedGroupId,
            groups: state.groups.groups
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(prediction, groupId){dispatch(action.gamesPredictions.updateGame(prediction, groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionTileDialog);
})();


