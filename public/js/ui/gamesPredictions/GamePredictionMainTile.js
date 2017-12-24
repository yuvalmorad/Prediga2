component.GamePredictionMainTile = (function(){
    var Graph = component.Graph;

    var GamePredictionMainTile = React.createClass({
        getInitialState: function() {
            return {
                isGamePlaying: false,
                isGameHalfHourBeforeGame: false
            };
        },

        shouldComponentUpdate: function(nextProps, nextState) {
            return this.props.prediction !== nextProps.prediction ||
                    this.state.timeBeforeGame !== nextState.timeBeforeGame ||
                    this.state.timePlaying !== nextState.timePlaying ||
                    this.state.isGamePlaying !== nextState.isGamePlaying ||
                    this.state.isGameHalfHourBeforeGame !== nextState.isGameHalfHourBeforeGame;
        },

        onTick: function() {
            var currentDate = new Date();
            /*currentDate.setHours(currentDate.getHours() + 9);//TODO remove
            currentDate.setMinutes(currentDate.getMinutes() + 108);//TODO remove
            currentDate.setSeconds(currentDate.getSeconds() + 20);//TODO remove*/
            var kickofftime = new Date(this.props.game.kickofftime);
            var beforeKickoffTime = new Date(kickofftime - currentDate);
            var minutesBeforeKickoffTime = beforeKickoffTime.getTime() / (1000 * 60);
            var afterKickoffTime = new Date(currentDate - kickofftime);
            var minutesAftereKickoffTime = afterKickoffTime.getTime() / (1000 * 60);

            if (minutesBeforeKickoffTime > 0 && minutesBeforeKickoffTime < 30) {
                this.setState({
                    isGamePlaying: false,
                    isGameHalfHourBeforeGame: true,
                    timeBeforeGame: "Starting in - " + utils.general.formatMinutesSecondsTime(kickofftime.getTime() - currentDate.getTime())
                })
            } else if (minutesAftereKickoffTime >= 0 && minutesAftereKickoffTime <= 105) {
                var isHalfTime =  minutesAftereKickoffTime >= 45 && minutesAftereKickoffTime <= 60;
                var isAfterHalfTime = minutesAftereKickoffTime >= 45;
                var decreaseMinutes = isAfterHalfTime ? 15 * 1000 * 60 : 0;
                this.setState({
                    isGamePlaying: true,
                    isGameHalfHourBeforeGame: false,
                    timePlaying: isHalfTime ? "Half Time" : "Running - " + utils.general.formatMinutesSecondsTime(currentDate.getTime() - kickofftime.getTime() - decreaseMinutes)
                })
            } else {
                this.setState({
                    isGamePlaying: false,
                    isGameHalfHourBeforeGame: false
                })
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
                isPostGame = false,
                isGamePlaying = state.isGamePlaying,
                isGameHalfHourBeforeGame = state.isGameHalfHourBeforeGame,
                timeBeforeGame = state.timeBeforeGame,
                timePlaying = state.timePlaying;

            if (!result) {
                //PRE GAME
                if (isGameHalfHourBeforeGame) {
                    dateStr = timeBeforeGame;
                } else if (isGamePlaying) {
                    simulationBtn = re(ReactRouterDOM.Link, {to: "/simulator/" + gameId, className: "simulation-button"}, "Simulation");
                    dateStr = timePlaying;
                } else {
                    dateStr = utils.general.formatHourMinutesTime(kickofftime);
                }

                gameDate = re("div", {}, dateStr);

                displayTeam1Goals = prediction ? prediction[GAME.BET_TYPES.TEAM1_GOALS.key] : "";
                displayTeam2Goals = prediction ? prediction[GAME.BET_TYPES.TEAM2_GOALS.key] : "";

                if (predictionWinner) {
                    //add this user to the count
                    if (predictionWinner !== team1._id) {
                        team1LogoClass += " grayed";
                    }

                    if (predictionWinner !== team2._id) {
                        team2LogoClass += " grayed";
                    }
                }

                graphParts = []//[{color: team1Color, amount: otherPredictionsTeam1Count}, {color: COLORS.DRAW_COLOR, amount: otherPredictionsDrawCount}, {color: team2Color, amount: otherPredictionsTeam2Count}]; //TODO
            } else {
                //POST GAME
                isPostGame = true;
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
            }

            return re("div", {className: "main" + (isPostGame ? " post-game" : "")},
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


