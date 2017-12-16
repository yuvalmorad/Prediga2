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
                    this.state.timePlaying !== nextState.timePlaying;
        },

        onTick: function() {
            var currentDate = new Date();
            var kickofftime = new Date(this.props.game.kickofftime);
            var beforeKickoffTime = new Date(kickofftime - currentDate);
            var minutesBeforeKickoffTime = beforeKickoffTime.getTime() / (1000 * 60);
            var afterKickoffTime = new Date(currentDate - kickofftime);
            var minutesAftereKickoffTime = afterKickoffTime.getTime() / (1000 * 60);

            if (minutesBeforeKickoffTime > 0 && minutesBeforeKickoffTime < 30) {
                this.setState({
                    isGamePlaying: false,
                    isGameHalfHourBeforeGame: true,
                    timeBeforeGame: utils.general.formatMinutesSecondsTime(kickofftime.getTime() - currentDate.getTime())
                })
            } else if (minutesAftereKickoffTime >= 0 && minutesAftereKickoffTime <= 90) {
                this.setState({
                    isGamePlaying: true,
                    isGameHalfHourBeforeGame: false,
                    timePlaying: utils.general.formatMinutesSecondsTime(currentDate.getTime() - kickofftime.getTime())
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
        },

        componentWillUnmount: function() {
            clearInterval(this.timer);
        },

        render: function() {
            var props = this.props,
                state = this.state,
                game = props.game,
                prediction = props.prediction,
                otherMatchPredictions = props.otherMatchPredictions,
                result = props.result,
                predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
                resultWinner,
                displayTeam1Goals,
                displayTeam2Goals,
                team1 = models.leagues.getTeamByTeamName(game.team1),
                team2 = models.leagues.getTeamByTeamName(game.team2),
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
                gamePoints,
                isPostGame = false;

            if (!result) {
                //PRE GAME
                if (state.isGameHalfHourBeforeGame) {
                    dateStr = "Starting in - " + state.timeBeforeGame;
                } else if (state.isGamePlaying) {
                    dateStr = "Running - " + state.timePlaying;
                } else {
                    var dateObj = new Date(kickofftime);
                    var minutes = dateObj.getMinutes();
                    if (minutes.toString().length === 1) {
                        minutes = "0" + minutes;
                    }
                    dateStr = dateObj.getHours() + ":" + minutes;
                }

                gameDate = re("div", {}, dateStr);

                var otherPredictionByWinner = utils.general.getOtherPredictionsUserIdsByWinner(otherMatchPredictions);
                var otherPredictionsTeam1Count = otherPredictionByWinner[game.team1] ? otherPredictionByWinner[game.team1].length : 0;
                var otherPredictionsTeam2Count = otherPredictionByWinner[game.team2] ? otherPredictionByWinner[game.team2].length : 0;
                var otherPredictionDraw = utils.general.getDrawFromObject(otherPredictionByWinner);
                var otherPredictionsDrawCount = otherPredictionDraw ? otherPredictionDraw.length : 0;

                displayTeam1Goals = prediction ? prediction[GAME.BET_TYPES.TEAM1_GOALS.key] : "";
                displayTeam2Goals = prediction ? prediction[GAME.BET_TYPES.TEAM2_GOALS.key] : "";

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

                    if (utils.general.isMatchDraw(predictionWinner)) {
                        otherPredictionsDrawCount++;
                    }
                }

                graphParts = [{color: team1Color, amount: otherPredictionsTeam1Count}, {color: COLORS.DRAW_COLOR, amount: otherPredictionsDrawCount}, {color: team2Color, amount: otherPredictionsTeam2Count}]; //TODO
            } else {
                //POST GAME
                isPostGame = true;
                var points = utils.general.sumObject( utils.general.calculatePoints(prediction, result));
                var maxPoints = utils.general.getMaxPoints();

                resultWinner = result[GAME.BET_TYPES.WINNER.key];
                displayTeam1Goals = result[GAME.BET_TYPES.TEAM1_GOALS.key];
                displayTeam2Goals = result[GAME.BET_TYPES.TEAM2_GOALS.key];

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

            return re("div", {className: "main" + (isPostGame ? " post-game" : "")},
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
                        re("div", {className: "game-score"}, displayTeam1Goals !== undefined ? displayTeam1Goals : ""),
                        gamePoints,
                        re("div", {className: "game-score"}, displayTeam2Goals !== undefined ? displayTeam2Goals : "")
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
    });

    return GamePredictionMainTile;
})();


