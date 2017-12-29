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
               clubs = props.clubs,
               league = props.league,
               matchResult = props.matchResult,
               predictionTeam1Goals = matchResult && matchResult[GAME.BET_TYPES.TEAM1_GOALS.key],
               predictionTeam2Goals = matchResult && matchResult[GAME.BET_TYPES.TEAM2_GOALS.key],
               predictionFirstToScore = matchResult && matchResult[GAME.BET_TYPES.FIRST_TO_SCORE.key],
               team1 = utils.general.findItemInArrBy(clubs, "_id", game.team1),
               team2 = utils.general.findItemInArrBy(clubs, "_id", game.team2),
               team1Id = team1._id,
               team2Id = team2._id,
               team1BgColor = team1.buttonColors[0],
               team1Color = team1.buttonColors[1],
               team2BgColor = team2.buttonColors[0],
               team2Color = team2.buttonColors[1],
               team1LogoPosition = team1.logoPosition,
               team2LogoPosition = team2.logoPosition,
               team1Name = team1.name,
               team2Name = team2.name,
               team1ShortName = team1.shortName,
               team2ShortName = team2.shortName,
               leagueIdName = utils.general.leagueNameToIdName(league.name),
               leagueSprite = utils.general.getLeagueLogoURL(leagueIdName),
               teamLogoClass = "team-logo " + leagueIdName;

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
               re(RadioGroup, {className: "first-score", onChange: this.onRadioGroupChanged, _id: "simulatorMatch_" + game._id, name: GAME.BET_TYPES.FIRST_TO_SCORE.key, inputs: [
                       {bgColor: team1BgColor, textColor: team1Color, text: team1Name, name: team1Id, res: predictionFirstToScore},
                       {bgColor: COLORS.DRAW_COLOR, text: "None", name: "None", res: predictionFirstToScore, isDefault: true},
                       {bgColor: team2BgColor, textColor: team2Color, text: team2Name, name: team2Id, res: predictionFirstToScore}
                   ]}
               )
           );
        }
    });
})();


