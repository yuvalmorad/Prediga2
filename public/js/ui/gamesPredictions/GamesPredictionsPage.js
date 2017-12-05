component.GamesPredictionsPage = (function(){
    var connect = ReactRedux.connect;
    var GamePredictionTile = component.GamePredictionTile;

    var isGamesPredictionsRequestSent = false;

    function getDate(date) {
        return date.getDate() + "." + (date.getMonth() + 1);
    }

    function isOnSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    }

    function getPagesByDates(matches) {
        var pagesByDates = [],
            lastDate;

        matches.forEach(function(match){
            var currentMatchDate = new Date(match.kickofftime);
            if (!lastDate || !isOnSameDay(lastDate, currentMatchDate)) {
                lastDate = currentMatchDate;
                pagesByDates.push(lastDate)
            }
        });

        return pagesByDates;
    }

    function findClosestDateIndex(pagesByDates, currentDate) {
        var closestDateIndex,
            i;

        for (i = 0; i < pagesByDates.length; i++) {
            var matchDate = pagesByDates[i];
            if (currentDate < matchDate) {
                closestDateIndex = i;
                break;
            }
        }

        if (closestDateIndex === undefined && pagesByDates.length) {
            closestDateIndex = pagesByDates.length - 1;
        }

        return closestDateIndex;
    }

    var GamesPredictionsPage = React.createClass({
        getInitialState: function() {
            if (!isGamesPredictionsRequestSent) {
                this.props.loadGamesPredictions();
                isGamesPredictionsRequestSent = true;
            }

            return {
                offsetPageIndex: 0
            };
        },

        onPreviousPage: function() {
            this.setState({offsetPageIndex: this.state.offsetPageIndex - 1});
        },

        onNextPage: function() {
            this.setState({offsetPageIndex: this.state.offsetPageIndex + 1});
        },

        render: function() {
            var props = this.props;
            var matches = props.matches;
            var userPredictions = props.userPredictions;
            var offsetPageIndex = this.state.offsetPageIndex;

            matches.sort(function(game1, game2){
                return new Date(game1.kickofftime) - new Date(game2.kickofftime);
            });

            var currentDate = new Date();
            var pagesByDates = getPagesByDates(matches);
            var closestDateIndex = findClosestDateIndex(pagesByDates, currentDate) + offsetPageIndex;
            var closestDate = pagesByDates[closestDateIndex];

            var tilesInPage = matches.filter(function(match, index){
                return isOnSameDay(new Date(match.kickofftime), closestDate);
            }).map(function(match){
                var matchId = match._id;
                var prediction = utils.general.findItemInArrBy(userPredictions, "matchId", matchId);
                return re(GamePredictionTile, {game: match, prediction: prediction, key: matchId});
            });

            return re("div", { className: "games-prediction-page content hasTilesHeader"},
                re("div", {className: "tiles-header"},
                    re("button", {className: "icon-left-open", onClick: this.onPreviousPage, disabled: closestDateIndex === 0}),
                    re("div", {className: "title"}, closestDate ? getDate(closestDate) : ""),
                    re("button", {className: "icon-right-open", onClick: this.onNextPage, disabled: closestDateIndex === pagesByDates.length - 1})
                ),
                re("div", {className: "tiles" + (props.isShowTileDialog ? " no-scroll" : "")},
                    tilesInPage
                )
            );
        }
    });

    function mapStateToProps(state){
        return {
            matches: state.gamesPredictions.matches,
            userPredictions: state.gamesPredictions.userPredictions,
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


