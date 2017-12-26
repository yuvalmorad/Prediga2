component.GamePredictionFormTile = (function(){
    var RadioGroup = component.RadioGroup,
        InputNumber = component.InputNumber;

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
                groupConfiguration = props.groupConfiguration,
                team1 = props.team1,
                team2 = props.team2,
                prediction = props.prediction,
                predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
                predictionFirstToScore = prediction && prediction[GAME.BET_TYPES.FIRST_TO_SCORE.key],
                predictionTeam1Goals = prediction && prediction[GAME.BET_TYPES.TEAM1_GOALS.key],
                predictionTeam2Goals = prediction && prediction[GAME.BET_TYPES.TEAM2_GOALS.key],
                predictionGoalDiff = prediction && prediction[GAME.BET_TYPES.GOAL_DIFF.key],
                result = props.result,
                isDialogFormDisabled = props.isDialogFormDisabled,
                team1Name = team1.name,
                team2Name = team2.name,
                team1Id = team1._id,
                team2Id = team2._id,
                team1BgColor = team1.homeButtonColors[0],
                team1Color = team1.homeButtonColors[1],
                team2BgColor = team2.awayButtonColors[0],
                team2Color = team2.awayButtonColors[1],
                points = {},
                team1GoalsPoints,
                diffGoalsPoints,
                team2GoalsPoints;

            if (result) {
                //POST_GAME
                points = utils.general.calculatePoints(prediction, result, groupConfiguration);
                team1GoalsPoints = points[GAME.BET_TYPES.TEAM1_GOALS.key];
                diffGoalsPoints = points[GAME.BET_TYPES.GOAL_DIFF.key];
                team2GoalsPoints = points[GAME.BET_TYPES.TEAM2_GOALS.key];
            }

            return re("div", {className: "game-form"},
                re("div", {className: "form-row-title"}, "Game Outcome"),
                re(RadioGroup, {className: "game-outcome", points: points[GAME.BET_TYPES.WINNER.key], onChange: this.onRadioGroupChanged, _id: game._id + "0", name: GAME.BET_TYPES.WINNER.key, isDisabled: isDialogFormDisabled, inputs: [
                        {bgColor: team1BgColor, textColor: team1Color, text: team1Name, name: team1Id, res: predictionWinner},
                        {bgColor: COLORS.DRAW_COLOR, text: "Draw", name: "Draw", res: predictionWinner},
                        {bgColor: team2BgColor, textColor: team2Color, text: team2Name, name: team2Id, res: predictionWinner}
                    ]}
                ),
                re("div", {className: "goals-predictions"},
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isDialogFormDisabled, points: team1GoalsPoints, num: predictionTeam1Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM1_GOALS.key)}),
                        re("div", {className: "points"}, team1GoalsPoints ? team1GoalsPoints : "")
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Diff"),
                        re(InputNumber, {isDisabled: isDialogFormDisabled, points: diffGoalsPoints, num: predictionGoalDiff, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.GOAL_DIFF.key)}),
                        re("div", {className: "points"}, diffGoalsPoints ? diffGoalsPoints : "")
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isDialogFormDisabled, points: team2GoalsPoints, num: predictionTeam2Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM2_GOALS.key)}),
                        re("div", {className: "points right"}, team2GoalsPoints ? team2GoalsPoints : "")
                    )
                ),
                re("div", {className: "form-row-title"}, "First to Score"),
                re(RadioGroup, {className: "first-score", points: points[GAME.BET_TYPES.FIRST_TO_SCORE.key], onChange: this.onRadioGroupChanged, _id: game._id + "1", name: GAME.BET_TYPES.FIRST_TO_SCORE.key, isDisabled: isDialogFormDisabled, inputs: [
                        {bgColor: team1BgColor, textColor: team1Color, text: team1Name, name: team1Id, res: predictionFirstToScore},
                        {bgColor: COLORS.DRAW_COLOR, text: "None", name: "None", res: predictionFirstToScore},
                        {bgColor: team2BgColor, textColor: team2Color, text: team2Name, name: team2Id, res: predictionFirstToScore}
                    ]}
                )
            );
        }
    });
})();


