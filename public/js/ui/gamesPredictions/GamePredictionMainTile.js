component.GamePredictionMainTile = (function(){
    var Graph = component.Graph;

    return  function(props) {
        var game = props.game,
            prediction = props.prediction,
            predictionWinner = prediction && prediction.winner,
            teams = LEAGUE.teams,
            team1 = teams[game.team1] || {},
            team2 = teams[game.team2] || {},
            resultsOutcome = game.results_outcome,
            team1LogoClass = "team-logo",
            team2LogoClass = "team-logo",
            gameDate,
            graphParts,
            kickofftime = game.kickofftime,
            dateStr,
            gamePoints;

        if (kickofftime.indexOf("Z")) {
            kickofftime = kickofftime.substr(0, kickofftime.indexOf("Z"));
        }

        if (game.status === GAME.STATUS.PRE_GAME || game.status === GAME.STATUS.CLOSED_GAME) {
            //PRE GAME
            var dateObj = new Date(kickofftime);
            dateStr = dateObj.getDate() + "." + (dateObj.getMonth() + 1);
            gameDate = re("div", {}, dateStr + (game.status === GAME.STATUS.CLOSED_GAME ? " (Closed)" : ""));
            graphParts = [{color: team1.color, amount: game.othersPredictions_team1WinCount}, {color: COLORS.DRAW_COLOR, amount: game.othersPredictions_drawCount}, {color: team2.color, amount: game.othersPredictions_team2WinCount}];

            if ( predictionWinner !== game.team1) {
                team1LogoClass += " grayed";
            }

            if ( predictionWinner !== game.team2) {
                team2LogoClass += " grayed";
            }
        } else if (game.status === GAME.STATUS.POST_GAME){
            //POST GAME
            var points = utils.general.sumObject( utils.general.calculatePoints(game));
            var maxPoints = utils.general.getMaxPoints();

            gameDate = re("div", {className: "final-game"}, "FINAL");
            gamePoints = re("div", {key: 2, className: "game-points"}, points);
            graphParts = [{color: "#7ED321", amount: points}, {color: COLORS.DRAW_COLOR, amount: maxPoints - points}];

            if ( resultsOutcome !== 0) {
                team1LogoClass += " grayed";
            }

            if ( resultsOutcome !== 2) {
                team2LogoClass += " grayed";
            }
        }

        return re("div", {className: "main"},
                    re("div", {className: "left"},
                        re("div", {className: team1LogoClass, style: {backgroundImage: "url('../images/teamsLogo/" + team1.name + ".png')"}}),
                        re("div", {className: "team-name"}, team1.shortName)
                    ),
                    re("div", {className: "center"},
                        re("div", {className: "league-name"}, game.league),
                        re("div", {className: "game-date"},
                            gameDate
                        ),
                        re("div", {className: "status"},
                            re("div", {className: "game-score"}, game.results_team1Scores !== undefined ? game.results_team1Scores : ""),
                            gamePoints,
                            re("div", {className: "game-score"}, game.results_team2Scores !== undefined ? game.results_team2Scores : "")
                        ),
                        re("div", {className: "graphContainer"},
                            re(Graph, {parts: graphParts})
                        )
                    ),
                    re("div", {className: "right"},
                        re("div", {className: team2LogoClass, style: {backgroundImage: "url('../images/teamsLogo/" + team2.name + ".png')"}}),
                        re("div", {className: "team-name"}, team2.shortName)
                    )
                );
    }
})();


