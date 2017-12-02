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
        onRadioGroupChanged: function(groupName, radioIndex) {
            var game = {
                id: this.props.game.id
            };
            game["userPrediction_" + groupName] = radioIndex;

            this.props.updateGameForm(game);
        },

        onInputNumberChanged: function(propertyName, num) {
            var game = {
                id: this.props.game.id
            };
            game[propertyName] = num;

            this.props.updateGameForm(game);
        },

        render: function() {
            var props = this.props,
                game = props.game,
                teams = LEAGUE.teams,
                team1 = teams['team_3'],
                team2 = teams['team_4'],
                isFormDisabled = game.status !== GAME.STATUS.PRE_GAME,
                team1Name = team1.name,
                team2Name = team2.name,
                team1Color = team1.color,
                team2Color = team2.color,
                team1SecondColor = team1.secondColor,
                team2SecondColor = team2.secondColor,
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
                re("div", {className: "form-row-title"}, "Game Outcome"),
                re(RadioGroup, {className: "game-outcome", points: points["outcome"], onChange: this.onRadioGroupChanged, id: game.id + "0", name: "outcome", isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, isChecked: userPredictionOutcome === 0},
                        {bgColor: COLORS.DRAW_COLOR, text: "Draw", isChecked: userPredictionOutcome === 1},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, isChecked: userPredictionOutcome === 2}
                    ]}
                ),
                re("div", {className: "goals-predictions"},
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points["team1Scores"], num: userPredictionTeam1Scores, onChange: this.onInputNumberChanged.bind(this, "userPrediction_team1Scores")})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Diff"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points["diffScores"], num: userPredictionDiffScores, onChange: this.onInputNumberChanged.bind(this, "userPrediction_diffScores")})
                    ),
                    re("div", {},
                        re("div", {className: "form-row-title"}, "Goals"),
                        re(InputNumber, {isDisabled: isFormDisabled, points: points["team2Scores"], num: userPredictionTeam2Scores, onChange: this.onInputNumberChanged.bind(this, "userPrediction_team2Scores")})
                    )
                ),
                re("div", {className: "form-row-title"}, "First to Score"),
                re(RadioGroup, {className: "first-score", points: points["firstScore"], onChange: this.onRadioGroupChanged, id: game.id + "1", name: "firstScore", isDisabled: isFormDisabled, inputs: [
                        {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, isChecked: userPredictionFirstScore === 0},
                        {bgColor: COLORS.DRAW_COLOR, text: "None", isChecked: userPredictionFirstScore === 1},
                        {bgColor: team2Color, textColor: team2SecondColor, text: team1Name, isChecked: userPredictionFirstScore === 2}
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


