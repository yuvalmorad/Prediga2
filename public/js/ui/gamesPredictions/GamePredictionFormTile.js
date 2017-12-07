component.GamePredictionFormTile = (function(){
    var RadioGroup = component.RadioGroup;
    var InputNumber = component.InputNumber;

    function mapToMutualFriends(otherUsers, reverse) {
        return otherUsers.map(function(user, index){
            var transform = 0.75;
            var style = {
                zIndex: (reverse ? index : otherUsers.length - index),
                transform: "translateX(" + (reverse ? (otherUsers.length - index - 1) * transform : "-" + (index * transform)) + "rem)"
            };
            return re("img", {src: user.photo, style: style, key: index});
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
                otherMatchPredictions = props.otherMatchPredictions,
                users = props.users,
                otherPredictionByWinner = utils.general.getOtherPredictionsUserIdsByWinner(otherMatchPredictions),
                otherPredctionsTeam1 = utils.general.mapUsersIdsToUsersObjects(otherPredictionByWinner[game.team1] || [], users),
                otherPredctionsTeam2 = utils.general.mapUsersIdsToUsersObjects(otherPredictionByWinner[game.team2] || [], users),
                team1MutualFriends = mapToMutualFriends(otherPredctionsTeam1),
                team2MutualFriends = mapToMutualFriends(otherPredctionsTeam2, true),
                result = props.result,
                teams = models.leagues.getTeamsByLeagueName(game.league),
                team1 = teams[game.team1],
                team2 = teams[game.team2],
                isFormDisabled = false,
                team1Name = team1.name,
                team2Name = team2.name,
                team1Color = team1.color,
                team2Color = team2.color,
                team1SecondColor = team1.secondColor,
                team2SecondColor = team2.secondColor,

                predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
                predictionFirstToScore = prediction && prediction[GAME.BET_TYPES.FIRST_TO_SCORE.key],
                predictionTeam1Goals = prediction && prediction[GAME.BET_TYPES.TEAM1_GOALS.key],
                predictionTeam2Goals = prediction && prediction[GAME.BET_TYPES.TEAM2_GOALS.key],
                predictionGoalDiff = prediction && prediction[GAME.BET_TYPES.GOAL_DIFF.key],
                points = {};

            if (result) {//(game.status === GAME.STATUS.POST_GAME){ //TODO
                //POST_GAME
                points = utils.general.calculatePoints(prediction, result); //TODO
                isFormDisabled = true;
            }

            return re("div", {className: "game-form"},
                re("div", {className: "form-row-title"}, "Game Outcome"),
                re(RadioGroup, {className: "game-outcome", points: points[GAME.BET_TYPES.WINNER.key], onChange: this.onRadioGroupChanged, _id: game._id + "0", name: GAME.BET_TYPES.WINNER.key, isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, name: team1Name, res: predictionWinner},
                        {bgColor: COLORS.DRAW_COLOR, text: "Draw", name: "draw", res: predictionWinner},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, name: team2Name, res: predictionWinner}
                    ]}
                ),
                re("div", {className: "goals-predictions"},
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points[GAME.BET_TYPES.TEAM1_GOALS.key], num: predictionTeam1Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM1_GOALS.key)})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Diff"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points[GAME.BET_TYPES.GOAL_DIFF.key], num: predictionGoalDiff, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.GOAL_DIFF.key)})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points[GAME.BET_TYPES.TEAM2_GOALS.key], num: predictionTeam2Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM2_GOALS.key)})
                    )
                ),
                re("div", {className: "form-row-title"}, "First to Score"),
                re(RadioGroup, {className: "first-score", points: points[GAME.BET_TYPES.FIRST_TO_SCORE.key], onChange: this.onRadioGroupChanged, _id: game._id + "1", name: GAME.BET_TYPES.FIRST_TO_SCORE.key, isDisabled: isFormDisabled, inputs: [
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


