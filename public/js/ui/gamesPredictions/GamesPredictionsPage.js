component.GamesPredictionsPage = (function(){
    var connect = ReactRedux.connect;
    var GamePredictionTile = component.GamePredictionTile;

    var isGamesPredictionsRequestSent = false;

    function getDate(date) {
        var dateObj = new Date(date);
        return dateObj.getDate() + "." + (dateObj.getMonth() + 1);
    }

    function isBetweenDates(date, from, to) {
        var dateObj = new Date(date);
        return dateObj >= new Date(from) && dateObj <= new Date(to);
    }

    var GamesPredictionsPage = React.createClass({
        getInitialState: function() {
            if (!isGamesPredictionsRequestSent) {
                this.props.loadGamesPredictions();
                isGamesPredictionsRequestSent = true;
            }

            return {
                currentPageIndex: 0
            };
        },

        onPreviousPage: function() {
            this.setState({currentPageIndex: this.state.currentPageIndex - 1});
        },

        onNextPage: function() {
            this.setState({currentPageIndex: this.state.currentPageIndex + 1});
        },

        render: function() {
            var props = this.props;
            var games = props.games;
            var gameDates = props.gameDates;
            var currentPageIndex = this.state.currentPageIndex;
            var currentDatePage = gameDates[currentPageIndex];

            var tilesInPage = games.filter(function(game){
                return isBetweenDates(game.date, currentDatePage.from, currentDatePage.to);
            }).sort(function(game1, game2){ //TODO sort also by time
                return game1.date - game2.date;
            }).map(function(game){
                return re(GamePredictionTile, {game: game, key: game.id});
            });

            return re("div", { className: "games-prediction-page content hasTilesHeader"},
                re("div", {className: "tiles-header"},
                    re("button", {className: "icon-left-open", onClick: this.onPreviousPage, disabled: this.state.currentPageIndex === 0}),
                    re("div", {className: "title"}, currentDatePage ? getDate(currentDatePage.from) + " - " + getDate(currentDatePage.to) : "" ),
                    re("button", {className: "icon-right-open", onClick: this.onNextPage, disabled: this.state.currentPageIndex === this.props.gameDates.length - 1})
                ),
                re("div", {className: "tiles" + (props.isShowTileDialog ? " no-scroll" : "")},
                    tilesInPage
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            games: state.gamesPredictions.games,
            gameDates: state.gamesPredictions.gameDates,
            isShowTileDialog: state.general.isShowTileDialog
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadGamesPredictions: function(){dispatch(action.gamesPredictions.loadGames())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamesPredictionsPage);

})();


