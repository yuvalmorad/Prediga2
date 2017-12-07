component.GamesPredictionsPage = (function(){
    var connect = ReactRedux.connect;
    var GamePredictionTile = component.GamePredictionTile;

    var isGamesPredictionsRequestSent = false;

    function getTitleDate(date) {
        var daysOfWeak = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var dayOfWeek = daysOfWeak[date.getDay()];
        return dayOfWeek + " " + date.getDate() + "." + (date.getMonth() + 1);
    }

    function isOnSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    }

    function getPagesByTypes(matches) {
        var pages = {};

        matches.forEach(function(match){
            var type = match.type;
            var league = match.league;
            var pageKey = league + "_" + type;
            if (!pages[pageKey]) {
                //create page
                pages[pageKey] = {
                    type: type,
                    league: league,
                    groups: [] //each group: {date: new Date() by same day, matches: []}
                }
            }

            var groupFound = null;
            var currentMatchDate = new Date(match.kickofftime);

            pages[pageKey].groups.forEach(function(group){
                if (isOnSameDay(group.date, currentMatchDate)) {
                    groupFound = group;
                }
            });

            if (!groupFound) {
                //create group
                var length = pages[pageKey].groups.push({
                    date: currentMatchDate,
                    matches: []
                });

                groupFound = pages[pageKey].groups[length - 1];
            }

            groupFound.matches.push(match);
        });

        return Object.keys(pages).map(function(pageType){return pages[pageType]}).sort(function(page1, page2){
            return page1.groups[0].date - page2.groups[0].date
        });
    }

    function findClosestPagesIndex(pages, currentDate) {
        var closestDateIndex,
            i;

        for (i = 0; i < pages.length; i++) {
            var iscurrentDateBeforeSome = pages[i].groups.some(function(group){
                var date = group.date;
                return currentDate < date;
            });

            if (iscurrentDateBeforeSome) {
                closestDateIndex = i;
                break;
            }
        }

        if (closestDateIndex === undefined && pages.length) {
            closestDateIndex = pages.length - 1;
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
            var props = this.props,
                matches = props.matches,
                userPredictions = props.userPredictions,
                results = props.results,
                offsetPageIndex = this.state.offsetPageIndex,
                pages = [],
                tilesInPage = [],
                closestIndex,
                closestPage;

            if (matches.length) {
                matches.sort(function (game1, game2) {
                    return new Date(game1.kickofftime) - new Date(game2.kickofftime);
                });

                var currentDate = new Date();
                pages = getPagesByTypes(matches);
                closestIndex = findClosestPagesIndex(pages, currentDate) + offsetPageIndex;
                closestPage = pages[closestIndex];

                tilesInPage = closestPage.groups.map(function (group, groupIndex) {
                    var tilesInGroup = group.matches.map(function (match) {
                        var matchId = match._id;
                        var prediction = utils.general.findItemInArrBy(userPredictions, "matchId", matchId);
                        var result = utils.general.findItemInArrBy(results, "matchId", matchId);
                        return re(GamePredictionTile, {
                            game: match,
                            prediction: prediction,
                            result: result,
                            key: matchId
                        });
                    });

                    tilesInGroup.unshift(re("div", {className: "tiles-group-title", key: "tilesGroup" + groupIndex}, getTitleDate(group.date)));
                    return tilesInGroup;
                });

                tilesInPage = [].concat.apply([], tilesInPage);
            }

            return re("div", { className: "games-prediction-page content hasTilesHeader"},
                re("div", {className: "tiles-header"},
                    re("button", {className: "icon-left-open", onClick: this.onPreviousPage, disabled: closestIndex === 0}),
                    re("div", {className: "title"}, closestPage ? models.leagues.getLeagueName(closestPage.league) + ": " + closestPage.type : ""),
                    re("button", {className: "icon-right-open", onClick: this.onNextPage, disabled: closestIndex === pages.length - 1})
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
            results: state.gamesPredictions.results,
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


