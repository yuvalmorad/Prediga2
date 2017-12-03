component.GamePredictionFormTile = (function(){
    var RadioGroup = component.RadioGroup;
    var InputNumber = component.InputNumber;

    function mapToMutualFriends(arr, reverse) {
        if (!arr){
            return;
        }
        return arr.map(function(src, index){
            var transform = 0.75;
            var style = {
                zIndex: (reverse ? index : arr.length - index),
                transform: "translateX(" + (reverse ? (arr.length - index - 1) * transform : "-" + (index * transform)) + "rem)"
            };
            return re("img", {src: "../images/facebook/" + src, style: style, key: index});
        });
    }

    return React.createClass({
        onRadioGroupChanged: function(groupName, radioName) {
            var prediction = {};
            prediction[groupName] = radioName;

            this.props.updateGameForm(prediction);
        },

        onInputNumberChanged: function(propertyName, num) {
            var prediction = {};
            prediction[propertyName] = num;

            this.props.updateGameForm(prediction);
        },

        render: function() {
            var props = this.props,
                game = props.game,
                prediction = props.prediction,
                teams = LEAGUE.teams,
                team1 = teams[game.team1],
                team2 = teams[game.team2],
                isFormDisabled = game.status !== GAME.STATUS.PRE_GAME,
                team1Name = team1.name,
                team2Name = team2.name,
                team1Color = team1.color,
                team2Color = team2.color,
                team1SecondColor = team1.secondColor,
                team2SecondColor = team2.secondColor,
                team1MutualFriends = mapToMutualFriends(game.team1MutualFriends),
                team2MutualFriends = mapToMutualFriends(game.team2MutualFriends, true),

                predictionOutcome = prediction && prediction.winner,
                predictionFirstToScore = prediction && prediction.firstToScore,
                predictionTeam1Goals = prediction && prediction.team1Goals,
                predictionTeam2Goals = prediction && prediction.team2Goals,
                predictionGoalDiff = prediction && prediction.goalDiff,
                points = {};

            if (game.status === GAME.STATUS.POST_GAME){
                points = utils.general.calculatePoints(game); //TODO
            }

            return re("div", {className: "game-form"},
                re("div", {className: "form-row-title"}, "Game Outcome"),
                re(RadioGroup, {className: "game-outcome", points: points["outcome"], onChange: this.onRadioGroupChanged, _id: game._id + "0", name: "winner", isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, name: team1Name, res: predictionOutcome},
                        {bgColor: COLORS.DRAW_COLOR, text: "Draw", name: "draw", res: predictionOutcome},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, name: team2Name, res: predictionOutcome}
                    ]}
                ),
                re("div", {className: "goals-predictions"},
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points["team1Scores"], num: predictionTeam1Goals, onChange: this.onInputNumberChanged.bind(this, "team1Goals")})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Diff"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points["diffScores"], num: predictionGoalDiff, onChange: this.onInputNumberChanged.bind(this, "goalDiff")})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points["team2Scores"], num: predictionTeam2Goals, onChange: this.onInputNumberChanged.bind(this, "team2Goals")})
                    )
                ),
                re("div", {className: "form-row-title"}, "First to Score"),
                re(RadioGroup, {className: "first-score", points: points["firstScore"], onChange: this.onRadioGroupChanged, _id: game._id + "1", name: "firstToScore", isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, name: team1Name, res: predictionFirstToScore},
                        {bgColor: COLORS.DRAW_COLOR, text: "None", name: "none", res: predictionFirstToScore},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, name: team2Name, res: predictionFirstToScore}
                    ]}
                ),
                re("div", {className: "mutual-friends"},
                    re("div", {className: "first"},
                        team1MutualFriends
                    ),
                    re("div", {className: "form-title"},"Friends"),
                    re("div", {className: "second"},
                        team2MutualFriends
                    )
                )
            );
        }
    });
})();


