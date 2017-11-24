component.GamePredictionFormTile = (function(){
    var connect = ReactRedux.connect;
    var RadioGroup = component.RadioGroup;
    var InputNumber = component.InputNumber;

    function mapToMutualFriends(arr, reverse) {
        return arr.map(function(src, index){
            var transform = 0.75;
            var style = {
                zIndex: (reverse ? index : arr.length - index),
                transform: "translateX(" + (reverse ? (arr.length - index - 1) * transform : "-" + (index * transform)) + "rem)"
            };
            return re("img", {src: "../images/facebook/" + src, style: style, key: index});
        });
    }

    var GamePredictionFormTile = React.createClass({
        onRadioGroupChanged: function(groupName, radioIndex) {
            var game = {
                id: this.props.game.id
            };
            game["userPrediction_" + groupName] = radioIndex;

            this.props.updateGame(game);
        },

        onInputNumberChanged: function(propertyName, num) {
            var game = {
                id: this.props.game.id
            };
            game[propertyName] = num;

            this.props.updateGame(game);
        },

        render: function() {
            var props = this.props,
                game = props.game,
                teams = LEAGUE.teams,
                team1 = teams[game.team1Id],
                team2 = teams[game.team2Id],
                isFormDisabled = game.status !== GAME.STATUS.PRE_GAME,
                team1Color = team1.color,
                team2Color = team2.color,
                team1MutualFriends = mapToMutualFriends(game.team1MutualFriends),
                team2MutualFriends = mapToMutualFriends(game.team2MutualFriends, true),
                userPredictionOutcome = game.userPrediction_outcome,
                userPredictionFirstScore = game.userPrediction_firstScore,
                userPredictionTeam1Scores = game.userPrediction_team1Scores,
                userPredictionTeam2Scores = game.userPrediction_team2Scores,
                userPredictionDiffScores = game.userPrediction_diffScores,
                points = {};


            if (game.status === GAME.STATUS.POST_GAME){
                points = utils.general.calculatePoints(game);
            }

            return re("div", {className: "game-form"},
                re(RadioGroup, {className: "game-outcome", points: points["outcome"], onChange: this.onRadioGroupChanged, id: game.id + "0", hasLabelSelected: true, name: "outcome", isDisabled: isFormDisabled, inputs: [
                        {color: team1Color, isChecked: userPredictionOutcome === 0},
                        {color: COLORS.DRAW_COLOR, isChecked: userPredictionOutcome === 1},
                        {color: team2Color, isChecked: userPredictionOutcome === 2}
                    ]}
                ),
                re("div", {className: "goals-predictions"},
                    re(InputNumber, {isDisabled: isFormDisabled, points: points["team1Scores"], num: userPredictionTeam1Scores, onChange: this.onInputNumberChanged.bind(this, "userPrediction_team1Scores")}),
                    re(InputNumber, {label: "Diff", isDisabled: isFormDisabled, points: points["diffScores"], num: userPredictionDiffScores, onChange: this.onInputNumberChanged.bind(this, "userPrediction_diffScores")}),
                    re(InputNumber, {isDisabled: isFormDisabled, position: "right", points: points["team2Scores"], num: userPredictionTeam2Scores, onChange: this.onInputNumberChanged.bind(this, "userPrediction_team2Scores")})
                ),
                re(RadioGroup, {className: "first-score", points: points["firstScore"], onChange: this.onRadioGroupChanged, id: game.id + "1", name: "firstScore", isDisabled: isFormDisabled, inputs: [
                        {color: team1Color, isChecked: userPredictionFirstScore === 0},
                        {label: "First to Score"},
                        {color: team2Color, isChecked: userPredictionFirstScore === 2}
                    ]}
                ),
                re("div", {className: "mutual-friends"},
                    re("div", {className: "first"},
                        team1MutualFriends
                    ),
                    re("div", {className: "second"},
                        team2MutualFriends
                    )
                )
            );
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGame: function(game){dispatch(action.gamesPredictions.updateGame(game))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamePredictionFormTile);
})();


