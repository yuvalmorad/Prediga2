component.GamePredictionMainTile = (function(){
    var Graph = component.Graph;

    return  function(props) {
        var game = props.game,
            teams = LEAGUE.teams,
            team1 = teams[game.team1Id],
            team2 = teams[game.team2Id],
            gameDate,
            graphParts,
            date = game.date,
            dateStr,
            gamePoints;

        if (game.status === GAME.STATUS.PRE_GAME || game.status === GAME.STATUS.CLOSED_GAME) {
            //PRE GAME
            var dateObj = new Date(date);
            dateStr = dateObj.getDate() + "." + (dateObj.getMonth() + 1) + " - " + dateObj.getHours() + ":" + dateObj.getMinutes();
            gameDate = re("div", {}, dateStr + (game.status === GAME.STATUS.CLOSED_GAME ? " (Closed)" : ""));
            graphParts = [{color: team1.color, amount: game.othersPredictions_team1WinCount}, {color: COLORS.DRAW_COLOR, amount: game.othersPredictions_drawCount}, {color: team2.color, amount: game.othersPredictions_team2WinCount}];
        } else if (game.status === GAME.STATUS.POST_GAME){
            //POST GAME
            var points = utils.general.sumObject( utils.general.calculatePoints(game));
            var maxPoints = utils.general.getMaxPoints();

            gameDate = re("div", {className: "final-game"}, "FINAL");
            gamePoints = re("div", {key: 2, className: "game-points"}, points);
            graphParts = [{color: "#7ED321", amount: points}, {color: COLORS.DRAW_COLOR, amount: maxPoints - points}];
        }

        return re("div", {className: "main"},
                    re("div", {className: "left"},
                        re("div", {className: "team-logo", style: {backgroundImage: "url(../images/teamsLogo/" + team1.logo + ")"}}),
                        re("div", {className: "team-name"}, team1.shortName)
                    ),
                    re("div", {className: "center"},
                        re("div", {className: "league-name"}, game.leagueName),
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
                        re("div", {className: "team-logo", style: {backgroundImage: "url(../images/teamsLogo/" + team2.logo + ")"}}),
                        re("div", {className: "team-name"}, team2.shortName)
                    )
                );
    }
})();


