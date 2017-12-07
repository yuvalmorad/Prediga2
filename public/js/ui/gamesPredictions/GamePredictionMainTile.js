component.GamePredictionMainTile = (function(){
    var Graph = component.Graph;

    return function(props) {
        var game = props.game,
            prediction = props.prediction,
            otherMatchPredictions = props.otherMatchPredictions,
            result = props.result,
            predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
            resultWinner,
            resultTeam1Goals,
            resultTeam2Goals,
            teams = models.leagues.getTeamsByLeagueName(game.league),
            team1 = teams[game.team1],
            team2 = teams[game.team2],
            team1Logo = team1 ? "url('../images/teamsLogo/" + team1.name + ".png')" : "",
            team2Logo = team2 ? "url('../images/teamsLogo/" + team2.name + ".png')" : "",
            team1ShortName = team1 ? team1.shortName : "",
            team2ShortName = team2 ? team2.shortName : "",
            team1Color = team1 ? team1.color : "",
            team2Color = team2 ? team2.color : "",
            team1LogoClass = "team-logo",
            team2LogoClass = "team-logo",
            gameDate,
            graphParts,
            kickofftime = game.kickofftime,
            dateStr,
            gamePoints;

        if (!result) {//(game.status === GAME.STATUS.PRE_GAME || game.status === GAME.STATUS.CLOSED_GAME) { //TODO
            //PRE GAME
            var dateObj = new Date(kickofftime);
            var minutes = dateObj.getMinutes();
            if (minutes.toString().length === 1) {
                minutes = "0" + minutes;
            }
            dateStr = dateObj.getDate() + "." + (dateObj.getMonth() + 1) + " " + dateObj.getHours() + ":" + minutes;
            gameDate = re("div", {}, dateStr + (game.status === GAME.STATUS.CLOSED_GAME ? " (Closed)" : ""));

            var otherPredictionByWinner = utils.general.getOtherPredictionsUserIdsByWinner(otherMatchPredictions);
            var otherPredictionsTeam1Count = otherPredictionByWinner[game.team1] ? otherPredictionByWinner[game.team1].length : 0;
            var otherPredictionsTeam2Count = otherPredictionByWinner[game.team2] ? otherPredictionByWinner[game.team2].length : 0;
            var otherPredictionsDrawCount = otherPredictionByWinner["draw"] ? otherPredictionByWinner["draw"].length : 0;

            if (predictionWinner) {
                //add this user to the count
                if (predictionWinner === game.team1) {
                    otherPredictionsTeam1Count++;
                } else {
                    team1LogoClass += " grayed";
                }

                if (predictionWinner === game.team2) {
                    otherPredictionsTeam2Count++;
                } else {
                    team2LogoClass += " grayed";
                }

                if (predictionWinner === "draw") {
                    otherPredictionsDrawCount++;
                }
            }

            graphParts = [{color: team1Color, amount: otherPredictionsTeam1Count}, {color: COLORS.DRAW_COLOR, amount: otherPredictionsDrawCount}, {color: team2Color, amount: otherPredictionsTeam2Count}]; //TODO
        } else {// if (game.status === GAME.STATUS.POST_GAME){ //TODO
            //POST GAME
            var points = utils.general.sumObject( utils.general.calculatePoints(prediction, result));
            var maxPoints = utils.general.getMaxPoints();

            resultWinner = result[GAME.BET_TYPES.WINNER.key];
            resultTeam1Goals = result[GAME.BET_TYPES.TEAM1_GOALS.key];
            resultTeam2Goals = result[GAME.BET_TYPES.TEAM2_GOALS.key];

            gameDate = re("div", {className: "final-game"}, "FINAL");
            gamePoints = re("div", {key: 2, className: "game-points"}, points);
            graphParts = [{color: "#7ED321", amount: points}, {color: COLORS.DRAW_COLOR, amount: maxPoints - points}];

            if (resultWinner !== game.team1) {
                team1LogoClass += " grayed";
            }

            if (resultWinner !== game.team2) {
                team2LogoClass += " grayed";
            }
        }

        return re("div", {className: "main"},
                    re("div", {className: "left"},
                        re("div", {className: team1LogoClass, style: {backgroundImage: team1Logo}}),
                        re("div", {className: "team-name"}, team1ShortName)
                    ),
                    re("div", {className: "center"},
                        re("div", {className: "league-name"}, game.league + ' ' +game.type),
                        re("div", {className: "game-date"},
                            gameDate
                        ),
                        re("div", {className: "status"},
                            re("div", {className: "game-score"}, resultTeam1Goals !== undefined ? resultTeam1Goals : ""),
                            gamePoints,
                            re("div", {className: "game-score"}, resultTeam2Goals !== undefined ? resultTeam2Goals : "")
                        ),
                        re("div", {className: "graphContainer"},
                            re(Graph, {parts: graphParts})
                        )
                    ),
                    re("div", {className: "right"},
                        re("div", {className: team2LogoClass, style: {backgroundImage: team2Logo}}),
                        re("div", {className: "team-name"}, team2ShortName)
                    )
                );
    }
})();


