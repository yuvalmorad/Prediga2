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
                league = game.league,
                prediction = props.prediction,
                otherMatchPredictions = props.otherMatchPredictions,
                result = props.result,
                predictionWinner = prediction && prediction[GAME.BET_TYPES.WINNER.key],
                resultWinner,
                displayTeam1Goals,
                displayTeam2Goals,
                team1 = models.leagues.getTeamByTeamName(game.team1),
                team2 = models.leagues.getTeamByTeamName(game.team2),
                leagueSprite = team1 && team2 ? "url('../images/sprites/" + league + "_teams.png')" : "",
                team1ShortName = team1 ? team1.shortName : "",
                team2ShortName = team2 ? team2.shortName : "",
                team1Color = team1 ? team1.color : "",
                team2Color = team2 ? team2.color : "",
                team1LogoPosition = team1 ? team1.logoPosition : "",
                team2LogoPosition = team2 ? team2.logoPosition : "",
                team1LogoClass = "team-logo " + league,
                team2LogoClass = "team-logo " + league,
                gameDate,
                graphParts,
                kickofftime = game.kickofftime,
                dateStr,
                gamePoints,
                isPostGame = false;

            if (!result) {
                //PRE GAME
                if (state.isGameHalfHourBeforeGame) {
                    dateStr = state.timeBeforeGame;
                } else if (state.isGamePlaying) {
                    dateStr = state.timePlaying;
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
                    re("div", {className: team1LogoClass, style: {backgroundImage: leagueSprite, backgroundPosition: team1LogoPosition}}),
                    re("div", {className: "team-name"}, team1ShortName)
                ),
                re("div", {className: "center"},
                    re("div", {className: "league-name"}, league + ' ' +game.type),
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
                    re("div", {className: team2LogoClass, style: {backgroundImage: leagueSprite, backgroundPosition: team2LogoPosition}}),
                    re("div", {className: "team-name"}, team2ShortName)
                )
            );
        }
    });

    return GamePredictionMainTile;
})();


