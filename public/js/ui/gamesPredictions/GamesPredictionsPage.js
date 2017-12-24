component.GamesPredictionsPage = (function(){
    var connect = ReactRedux.connect,
        GamePredictionTile = component.GamePredictionTile,
        ImageButton = component.ImageButton,
        LeaguesSubHeader = component.LeaguesSubHeader;


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
            var isCurrentDateBeforeSome = pages[i].groups.some(function(group){
                var date = group.date;
                var found = currentDate < date || isOnSameDay(currentDate, date);
                if (found) {
                    group.scrollTo = true;
                }
                return found;
            });

            if (isCurrentDateBeforeSome) {
                closestDateIndex = i;
                break;
            }
        }

        if (closestDateIndex === undefined && pages.length) {
            closestDateIndex = pages.length - 1;
        }

        return closestDateIndex;
    }

    var shouldScrollToCurrentDate = false;
    var GamesPredictionsPage = React.createClass({
        getInitialState: function() {
            shouldScrollToCurrentDate = true;

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

        componentWillReceiveProps: function(prevProps) {
            if (prevProps.selectedLeagueId !== this.props.selectedLeagueId) {
                this.setState({offsetPageIndex: 0});
            }
        },

        componentDidUpdate: function(prevProps, prevState) {
            if (this.state.offsetPageIndex !== prevState.offsetPageIndex && this.tilesElem) {
                this.tilesElem.scrollTo(0,0);
            } else {
                this.scrollToCurrentDate();
            }
        },

        componentDidMount: function() {
            this.scrollToCurrentDate();
        },

        scrollToCurrentDate: function() {
            if (shouldScrollToCurrentDate && this.tilesElem){
                var scrollToElem = this.tilesElem.querySelector('.tiles-group-title[data-scrollto="true"]');
                if (scrollToElem && scrollToElem.scrollIntoView) {
                    shouldScrollToCurrentDate = false;
                    scrollToElem.scrollIntoView();
                }
            }
        },

        assignTilesRef: function(tilesElem) {
            this.tilesElem = tilesElem;
        },

        render: function() {
            var props = this.props,
                state = this.state,
                matches = props.matches,
                userPredictions = props.userPredictions,
                results = props.results,
                offsetPageIndex = state.offsetPageIndex,
                pages,
                tilesInPage,
                closestIndex,
                closestPage,
                selectedLeagueId = props.selectedLeagueId,
                leagues = props.leagues,
                clubs = props.clubs,
                groupConfiguration = props.groupConfiguration,
                predictionsCounters = props.predictionsCounters || {};

            if (!matches.length || !clubs.length || !selectedLeagueId || !groupConfiguration) {
                return re("div", { className: "content"});
            }

            //filter matches with selected league id
            matches = matches.filter(function(match){
                return match.league === selectedLeagueId;
            });

            matches.sort(function (game1, game2) {
                return new Date(game1.kickofftime) - new Date(game2.kickofftime);
            });

            var currentDate = new Date();
            pages = getPagesByTypes(matches);
            closestIndex = findClosestPagesIndex(pages, currentDate) + offsetPageIndex;
            closestPage = pages[closestIndex];


            //var wasScroll = false;
            tilesInPage = closestPage.groups.map(function (group, groupIndex) {
                var tilesInGroup = group.matches.map(function (match) {
                    var matchId = match._id;
                    var prediction = utils.general.findItemInArrBy(userPredictions, "matchId", matchId);
                    var result = utils.general.findItemInArrBy(results, "matchId", matchId);
                    var team1 = utils.general.findItemInArrBy(clubs, "_id", match.team1);
                    var team2 = utils.general.findItemInArrBy(clubs, "_id", match.team2);
                    var league = utils.general.findItemInArrBy(leagues, "_id", selectedLeagueId);
                    return re(GamePredictionTile, {
                        game: match,
                        prediction: prediction,
                        result: result,
                        team1: team1,
                        team2: team2,
                        league: league,
                        groupConfiguration: groupConfiguration,
                        predictionCounters: predictionsCounters[matchId] || {},
                        key: matchId
                    });
                });

                var groupProps = {className: "tiles-group-title", key: "tilesGroup" + groupIndex};
                if (group.scrollTo) {
                    groupProps["data-ScrollTo"] = true;
                }

                tilesInGroup.unshift(re("div", groupProps, getTitleDate(group.date)));
                return tilesInGroup;
            });

            tilesInPage = [].concat.apply([], tilesInPage);


            var isLeftButtonDisabled = closestIndex === 0;
            var isRightButtonDisabled = closestIndex === pages.length - 1;

            return re("div", { className: "games-prediction-page content hasTilesHeader hasSubHeader"},
                re(LeaguesSubHeader, {}),
                re("div", {className: "tiles-header"},
                    re(ImageButton, {onClick: this.onPreviousPage, disabled: isLeftButtonDisabled, backgroundPosition: "-19px 0px", backgroundPositionDisabled: "-28px 0px"}),
                    re("div", {className: "title"}, closestPage ? closestPage.type : ""),
                    re(ImageButton, {onClick: this.onNextPage, disabled: isRightButtonDisabled, backgroundPosition: "0 0", backgroundPositionDisabled: "-10px 0px"})
                ),
                re("div", {ref: this.assignTilesRef, className: "tiles" + (props.isShowTileDialog ? " no-scroll" : "")},
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
            predictionsCounters: state.gamesPredictions.predictionsCounters,
            isShowTileDialog: state.general.isShowTileDialog,
            leagues: state.leagues.leagues,
            selectedLeagueId: state.leagues.selectedLeagueId,
            clubs: state.leagues.clubs,
            groupConfiguration: state.groupConfiguration.groupConfiguration
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadGamesPredictions: function(){dispatch(action.gamesPredictions.loadGames())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(GamesPredictionsPage);

})();


