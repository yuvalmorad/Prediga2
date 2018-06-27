window.component = window.component || {};
component.GamePredictionMainTile = (function(){
    var Graph = component.Graph,
        TeamLogo = component.TeamLogo;

    var GamePredictionMainTile = React.createClass({
        getInitialState: function() {
            return {};
        },

        shouldComponentUpdate: function(nextProps, nextState) {
            return  this.props.prediction !== nextProps.prediction ||
                    this.props.result !== nextProps.result ||
                    this.state.timeBeforeGame !== nextState.timeBeforeGame;
        },

        onTeamLogoClicked: function(teamId) {
            if (this.props.isDialogFormDisabled) {
                return;
            }

            var prediction = {};
            prediction[GAME.BET_TYPES.WINNER.key] = teamId;

            this.props.updateGameForm(prediction);
        },

        onTick: function() {
            var currentDate = new Date();
            var kickofftime = new Date(this.props.game.kickofftime);
            var beforeKickoffTime = new Date(kickofftime - currentDate);
            var minutesBeforeKickoffTime = beforeKickoffTime.getTime() / (1000 * 60);

            if (minutesBeforeKickoffTime > 0 && minutesBeforeKickoffTime < 30) {
                this.setState({
                    timeBeforeGame: "Kickoff in " + utils.general.formatMinutesSecondsTime(kickofftime.getTime() - currentDate.getTime())
                })
            } else if (minutesBeforeKickoffTime < 0 && minutesBeforeKickoffTime > -100){ // -100, just in case some game has no result at all
                //game already started
                this.setState({
                    timeBeforeGame: "Game is starting..."
                });
                clearInterval(this.timer);
            } else {
                this.setState({timeBeforeGame: undefined});
                clearInterval(this.timer);
            }
        },

        componentDidMount: function() {
            this.timer = setInterval(this.onTick, 1000);
            this.onTick();
        },

        componentWillUnmount: function() {
            clearInterval(this.timer);
        },

        render: function() {
            var props = this.props,
                state = this.state,
                game = props.game,
                gameId = game._id,
                groupConfiguration = props.groupConfiguration,
                predictionCounters = props.predictionCounters || {},
                league = props.league,
                leagueName = league.name,
                team1 = props.team1,
                team2 = props.team2,
				selectedGroupId = props.selectedGroupId,
                prediction = props.prediction,
                result = props.result,
                isDialogFormDisabled = props.isDialogFormDisabled,
                randomGamePrediction = props.randomGamePrediction,
                displayTeam1Goals,
                displayTeam2Goals,
                team1ShortName = team1 ? team1.shortName : "",
                team2ShortName = team2 ? team2.shortName : "",
                team1LogoPosition = team1 ? team1.logoPosition : "",
                team2LogoPosition = team2 ? team2.logoPosition : "",
                team1Sprite = team1 ? team1.sprite : "",
                team2Sprite = team2 ? team2.sprite : "",
                gameDate,
                graphParts,
                kickofftime = game.kickofftime,
                stadium = game.stadium || "",
                dateStr,
                gamePoints,
                buttonBetweenScore,
                strikeIcon,
                timeBeforeGame = state.timeBeforeGame,
                gameStatus = utils.general.getGameStatus(result),
                className = "main";

            if (gameStatus === GAME.STATUS.POST_GAME) {
                //POST GAME

                className += " post-game";
                var points = utils.general.calculateTotalPoints(prediction, result, groupConfiguration);
                var maxPoints = utils.general.getMaxPoints(groupConfiguration);

                displayTeam1Goals = result[GAME.BET_TYPES.TEAM1_GOALS.key];
                displayTeam2Goals = result[GAME.BET_TYPES.TEAM2_GOALS.key];

                gameDate = re("div", {className: "final-game"}, "FULL-TIME");
                gamePoints = re("div", {key: 2, className: "game-points"}, points);
                graphParts = [{color: "#7ED321", amount: points}, {color: COLORS.DRAW_COLOR, amount: maxPoints - points}];
            } else {
                //before game ended

                displayTeam1Goals = prediction ? prediction[GAME.BET_TYPES.TEAM1_GOALS.key] : "";
                displayTeam2Goals = prediction ? prediction[GAME.BET_TYPES.TEAM2_GOALS.key] : "";

                if (gameStatus === GAME.STATUS.RUNNING_GAME) {
                    //running game
                    className += " running-game";
                    buttonBetweenScore = re(ReactRouterDOM.Link, {to: "/group/" + selectedGroupId + "/simulator/" + gameId, className: "simulation-button"}, "Simulate");
                    dateStr = utils.general.getRunningGameFormat(result);
                    displayTeam1Goals = result[GAME.BET_TYPES.TEAM1_GOALS.key];
                    displayTeam2Goals = result[GAME.BET_TYPES.TEAM2_GOALS.key];
                } else {
                    if (prediction && prediction[GAME.BET_TYPES.WINNER.key]) { //prediction exist
                        var isStrike = utils.general.isPredictionStrike(prediction, game);
						strikeIcon = re("div", {className: isStrike ? "strike-icon" : "no-strike-icon"}, "");
                    }

					if (timeBeforeGame !== undefined) {
						//half hour before game or just started and no result yet
						dateStr = timeBeforeGame;
					} else {
						//more than half hour before game
						dateStr = utils.general.formatHourMinutesTime(kickofftime);
					}
                }

                gameDate = re("div", {}, dateStr);

                var predictionCounterWin1,
                    predictionCounterWin2,
                    predictionCounterDraw,
                    teamsGraphColors = [];

                if (team1 && team2) {
                    predictionCounterWin1 = predictionCounters[team1._id] || 0,
                    predictionCounterWin2 = predictionCounters[team2._id] || 0,
                    predictionCounterDraw = utils.general.getDrawFromObject(predictionCounters) || 0,
                    teamsGraphColors = utils.general.getTeamsUniqueGraphColor(team1, team2);
                }

                graphParts = [{color: teamsGraphColors[0], amount: predictionCounterWin1}, {color: COLORS.DRAW_COLOR, amount: predictionCounterDraw}, {color: teamsGraphColors[1], amount: predictionCounterWin2}];
            }

            if (randomGamePrediction && !buttonBetweenScore && !isDialogFormDisabled) {
                //it is a dialog, simulator is not visible and dialog is not disabled
                buttonBetweenScore = re("a", {className: "random-button", onClick: randomGamePrediction}, "Random");
				strikeIcon = undefined;
            }

            return re("div", {className: className},
                re("div", {className: "left"},
                    re(TeamLogo, {leagueName: leagueName, logoPosition: team1LogoPosition, sprite: team1Sprite, isHide: !team1, onClick: props.updateGameForm && this.onTeamLogoClicked.bind(this, team1._id)}),
                    re("div", {className: "team-name"}, team1ShortName)
                ),
                re("div", {className: "center"},
                    re("div", {className: "league-name"}, stadium),
                    re("div", {className: "game-date"},
                        gameDate
                    ),
                    re("div", {className: "status"},
                        re("div", {className: "game-score"}, displayTeam1Goals !== undefined ? displayTeam1Goals : ""),
                        buttonBetweenScore,
                        gamePoints,
						strikeIcon,
                        re("div", {className: "game-score"}, displayTeam2Goals !== undefined ? displayTeam2Goals : "")
                    ),
                    re("div", {className: "graphContainer"},
                        re(Graph, {parts: graphParts})
                    )
                ),
                re("div", {className: "right"},
                    re(TeamLogo, {leagueName: leagueName, logoPosition: team2LogoPosition, sprite: team2Sprite, isHide: !team2, onClick: props.updateGameForm && this.onTeamLogoClicked.bind(this, team2._id)}),
                    re("div", {className: "team-name"}, team2ShortName)
                )
            );
        }
    });

    return GamePredictionMainTile;
})();


