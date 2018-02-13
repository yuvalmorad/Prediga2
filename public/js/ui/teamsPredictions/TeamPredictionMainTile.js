window.component = window.component || {};
component.TeamPredictionMainTile = (function(){
    var TeamLogo = component.TeamLogo;
    var Graph = component.Graph;

    return  function(props) {
        var team = props.team,
            selectedTeam = props.selectedTeam,
            league = props.league,
            leagueName = league.name,
            teamName,
            teamShortName,
            predictionCounters = props.predictionCounters,
            usersInGroupCount = props.usersInGroupCount,
            groupConfiguration = props.groupConfiguration,
            points = groupConfiguration ? groupConfiguration[team.type] : "",
            logoPosition,
            graphParts = [],
            isDeadLine = props.isDeadLine, //only for dialog
            result = props.result;

        if (!selectedTeam || (isDeadLine && selectedTeam.isDummySelection)) {
            teamName = "Team";
            logoPosition = league.logoPosition
        } else {
            teamName = selectedTeam.name;
            teamShortName = selectedTeam.shortName;
            logoPosition = selectedTeam.logoPosition;

            var usersSelectedTeamCount = predictionCounters[selectedTeam._id] || 0;
            graphParts = [{color: selectedTeam.graphColors[0], amount: usersSelectedTeamCount}, {color: COLORS.DRAW_COLOR, amount: usersInGroupCount - usersSelectedTeamCount}];
        }

        var numOfPointsEarned = 0;

        if (result) {
            if (selectedTeam && selectedTeam._id === result.team) {
                numOfPointsEarned = points;
                graphParts = [{color: "#7ED321", amount: points}];
            } else {
                graphParts = [{color: COLORS.DRAW_COLOR, amount: points}];
            }
        }

        return re("div", {className: "main"},
            re("div", {className: "left"},
                re(TeamLogo, {leagueName: leagueName, logoPosition: logoPosition}),
                re("div", {className: "team-short-name"}, teamShortName)
            ),
            re("div", {className: "center"},
                re("div", {className: "team-name"}, teamName),
                re("div", {className: "points"}, points + " Points"),
                re("div", {className: "graphContainer"},
                    re("div", {className: "points-win" + (numOfPointsEarned > 0 ? " win" : "")}, result ? numOfPointsEarned : ""),
                    re(Graph, {parts: graphParts})
                )
            ),
            re("div", {className: "right"},
                re("div", {className: "rankTitle"}, team.title)
            )
        );
    }
})();


