component.GamePredictionMainTile = (function(){
    var Graph = component.Graph;

    var GamePredictionMainTile = React.createClass({
        getInitialState: function() {
            return {};
        },

        shouldComponentUpdate: function(nextProps, nextState) {
            return  this.props.prediction !== nextProps.prediction ||
                    this.props.result !== nextProps.result ||
                    this.state.timeBeforeGame !== nextState.timeBeforeGame;
        },

        onTick: function() {
            var currentDate = new Date();
            var kickofftime = new Date(this.props.game.kickofftime);
            var beforeKickoffTime = new Date(kickofftime - currentDate);
            var minutesBeforeKickoffTime = beforeKickoffTime.getTime() / (1000 * 60);

            if (minutesBeforeKickoffTime > 0 && minutesBeforeKickoffTime < 30) {
                this.setState({
                    timeBeforeGame: "Start in " + utils.general.formatMinutesSecondsTime(kickofftime.getTime() - currentDate.getTime())
                })
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
                leagueIdName = utils.general.leagueNameToIdName(leagueName),
                team1 = props.team1,
                team2 = props.team2,
                prediction = props.prediction,
                result = props.result,
                predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
                resultWinner,
                displayTeam1Goals,
                displayTeam2Goals,
                leagueSprite = utils.general.getLeagueLogoURL(leagueIdName),
                team1ShortName = team1 ? team1.shortName : "",
                team2ShortName = team2 ? team2.shortName : "",
                team1LogoPosition = team1 ? team1.logoPosition : "",
                team2LogoPosition = team2 ? team2.logoPosition : "",
                team1LogoClass = "team-logo " + leagueIdName,
                team2LogoClass = "team-logo " + leagueIdName,
                gameDate,
                graphParts,
                kickofftime = game.kickofftime,
                stadium = game.stadium || "",
                dateStr,
                gamePoints,
                simulationBtn,
                timeBeforeGame = state.timeBeforeGame,
                gameStatus = utils.general.getGameStatus(result),
                className = "main";

            if (gameStatus === GAME.STATUS.POST_GAME) {
                //POST GAME

                className += " post-game";
                var points = utils.general.calculateTotalPoints(prediction, result, groupConfiguration);
                var maxPoints = utils.general.getMaxPoints(groupConfiguration);

                resultWinner = result[GAME.BET_TYPES.WINNER.key];
                displayTeam1Goals = result[GAME.BET_TYPES.TEAM1_GOALS.key];
                displayTeam2Goals = result[GAME.BET_TYPES.TEAM2_GOALS.key];

                gameDate = re("div", {className: "final-game"}, "FINAL");
                gamePoints = re("div", {key: 2, className: "game-points"}, points);
                graphParts = [{color: "#7ED321", amount: points}, {color: COLORS.DRAW_COLOR, amount: maxPoints - points}];

                if (resultWinner !== team1._id) {
                    team1LogoClass += " grayed";
                }

                if (resultWinner !== team2._id) {
                    team2LogoClass += " grayed";
                }
            } else {
                //before game ended

                displayTeam1Goals = prediction ? prediction[GAME.BET_TYPES.TEAM1_GOALS.key] : "";
                displayTeam2Goals = prediction ? prediction[GAME.BET_TYPES.TEAM2_GOALS.key] : "";

                if (gameStatus === GAME.STATUS.RUNNING_GAME) {
                    //running game
                    className += " running-game";
                    simulationBtn = re(ReactRouterDOM.Link, {to: "/simulator/" + gameId, className: "simulation-button"}, "Simulation");
                    dateStr = "Running " + result.gameTime + "'";
                    displayTeam1Goals = result[GAME.BET_TYPES.TEAM1_GOALS.key];
                    displayTeam2Goals = result[GAME.BET_TYPES.TEAM2_GOALS.key];
                } else if (timeBeforeGame !== undefined) {
                    //half hour before game
                    dateStr = timeBeforeGame;
                } else {
                    //more than half hour before game
                    dateStr = utils.general.formatHourMinutesTime(kickofftime);
                }

                gameDate = re("div", {}, dateStr);

                if (predictionWinner) {
                    //add this user to the count
                    if (predictionWinner !== team1._id) {
                        team1LogoClass += " grayed";
                    }

                    if (predictionWinner !== team2._id) {
                        team2LogoClass += " grayed";
                    }
                }

                var predictionCounterWin1 = predictionCounters[team1._id] || 0,
                    predictionCounterWin2 = predictionCounters[team2._id] || 0,
                    predictionCounterDraw = utils.general.getDrawFromObject(predictionCounters) || 0,
                    teamsGraphColors = utils.general.getTeamsUniqueGraphColor(team1, team2);

                graphParts = [{color: teamsGraphColors[0], amount: predictionCounterWin1}, {color: COLORS.DRAW_COLOR, amount: predictionCounterDraw}, {color: teamsGraphColors[1], amount: predictionCounterWin2}];
            }

            return re("div", {className: className},
                re("div", {className: "left"},
                    re("div", {className: team1LogoClass, style: {backgroundImage: leagueSprite, backgroundPosition: team1LogoPosition}}),
                    re("div", {className: "team-name"}, team1ShortName)
                ),
                re("div", {className: "center"},
                    re("div", {className: "league-name"}, stadium),
                    re("div", {className: "game-date"},
                        gameDate
                    ),
                    re("div", {className: "status"},
                        re("div", {className: "game-score"}, displayTeam1Goals !== undefined ? displayTeam1Goals : ""),
                        simulationBtn,
                        gamePoints,
                        re("div", {className: "game-score"}, displayTeam2Goals !== undefined ? displayTeam2Goals : "")
                    ),
                    re("div", {className: "graphContainer"},
                        re(Graph, {parts: graphParts})
                    )
                ),
                re("div", {className: "right"},
                    re("div", {className: team2LogoClass, style: {backgroundImage: leagueSprite, backgroundPosition: team2LogoPosition}}),
                    re("div", {className: "team-name"}, team2ShortName)
                )
            );
        }
    });

    return GamePredictionMainTile;
})();


