component.SimulatorMatch = (function(){
    var RadioGroup = component.RadioGroup,
        InputNumber = component.InputNumber;

    return React.createClass({
        onRadioGroupChanged: function(groupName, radioName) {
            var prediction = {};
            prediction[groupName] = radioName;
            prediction.matchId = this.props.game._id;

            this.props.updateMatchChange(prediction);
        },

        onInputNumberChanged: function(propertyName, num) {
            var prediction = {};
            prediction[propertyName] = num;
            prediction.matchId = this.props.game._id;

            this.props.updateMatchChange(prediction);
        },

        render: function() {
           var props = this.props,
               game = props.game,
               matchResult = props.matchResult,
               predictionTeam1Goals = matchResult && matchResult[GAME.BET_TYPES.TEAM1_GOALS.key],
               predictionTeam2Goals = matchResult && matchResult[GAME.BET_TYPES.TEAM2_GOALS.key],
               predictionFirstToScore = matchResult && matchResult[GAME.BET_TYPES.FIRST_TO_SCORE.key],
               league = game.league,
               team1 = models.leagues.getTeamByTeamName(game.team1),
               team2 = models.leagues.getTeamByTeamName(game.team2),
               team1Color = team1.color,
               team2Color = team2.color,
               team1SecondColor = team1.secondColor,
               team2SecondColor = team2.secondColor,
               team1LogoPosition = team1.logoPosition,
               team2LogoPosition = team2.logoPosition,
               team1Name = team1.name,
               team2Name = team2.name,
               team1ShortName = team1.shortName,
               team2ShortName = team2.shortName,
               leagueSprite = utils.general.getLeagueLogoURL(league),
               teamLogoClass = "team-logo " + league;

           return re("div", { className: "simulator-match" },
               re("div", {className: "row1"},
                   re("div", {className: "left"},
                       re("div", {className: teamLogoClass, style: {backgroundImage: leagueSprite, backgroundPosition: team1LogoPosition}}),
                       re("div", {className: "team-name"}, team1ShortName)
                   ),
                   re("div", {className: "center"},
                       re(InputNumber, {num: predictionTeam1Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM1_GOALS.key)}),
                       re(InputNumber, {num: predictionTeam2Goals, onChange: this.onInputNumberChanged.bind(this, GAME.BET_TYPES.TEAM2_GOALS.key)})
                   ),
                   re("div", {className: "right"},
                       re("div", {className: teamLogoClass, style: {backgroundImage: leagueSprite, backgroundPosition: team2LogoPosition}}),
                       re("div", {className: "team-name"}, team2ShortName)
                   )
               ),
               re("div", {className: "form-row-title"}, "First to Score"),
               re(RadioGroup, {className: "first-score", onChange: this.onRadioGroupChanged, _id: "simulatorMatch_" + game._id, name: GAME.BET_TYPES.FIRST_TO_SCORE.key, inputs: [//TODO
                       {bgColor: team1Color, textColor: team1SecondColor, text: team1Name, name: team1Name, res: predictionFirstToScore},//TODO
                       {bgColor: COLORS.DRAW_COLOR, text: "None", name: "None", res: predictionFirstToScore, isDefault: true},
                       {bgColor: team2Color, textColor: team2SecondColor, text: team2Name, name: team2Name, res: predictionFirstToScore}//TODO
                   ]}
               )
           );
        }
    });
})();


