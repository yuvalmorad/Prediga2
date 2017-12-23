component.LeaguesSubHeader = (function(){
    var connect = ReactRedux.connect;

    var LeaguesSubHeader = function(props) {
        var that = this,
            leagues = props.leagues,
            selectedLeagueId = props.selectedLeagueId;

        var leagueItemsElem = leagues.map(function (league) {
            var leagueId = league._id;
            return re("div", {
                className: "league-item" + (leagueId === selectedLeagueId ? " selected" : ""),
                onClick: props.setSelectedLeagueId.bind(that, leagueId),
                key: leagueId
            }, league.name);
        });

        return re("div", {className: "subHeader leagues-sub-header"},
            leagueItemsElem
        )
    };

    function mapStateToProps(state){
        return {
            selectedLeagueId: state.leagues.selectedLeagueId,
            leagues: state.leagues.leagues
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            setSelectedLeagueId: function(leagueId){dispatch(action.leagues.setSelectedLeagueId(leagueId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaguesSubHeader);
})();


