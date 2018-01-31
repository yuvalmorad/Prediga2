window.component = window.component || {};
component.LeaguesSubHeader = (function(){
    var connect = ReactRedux.connect;

    var LeaguesSubHeader = function(props) {
        var that = this,
            leagues = props.leagues,
            selectedLeagueId = props.selectedLeagueId,
            groups = props.groups,
            selectedGroupId = props.selectedGroupId;

        var group = utils.general.findItemInArrBy(groups, "_id", selectedGroupId);
        var groupLeagues = leagues.filter(function(league){
            return group.leagueIds.indexOf(league._id) >= 0;
        });

        var leagueItemsElem = groupLeagues.map(function (league) {
            var leagueId = league._id;
            var isSelected = leagueId === selectedLeagueId;
            var leagueColor = isSelected ? league.color : "";
            return re("div", {
                className: "league-item" + (isSelected ? " selected" : ""),
                onClick: props.setSelectedLeagueId.bind(that, leagueId),
                key: leagueId,
                style: {color: leagueColor, borderColor: leagueColor}
            }, league.name);
        });

        return re("div", {className: "subHeader leagues-sub-header"},
            leagueItemsElem
        )
    };

    function mapStateToProps(state){
        return {
            selectedLeagueId: state.groups.selectedLeagueId,
            groups: state.groups.groups,
            selectedGroupId: state.groups.selectedGroupId,
            leagues: state.leagues.leagues
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            setSelectedLeagueId: function(leagueId){dispatch(action.groups.setSelectedLeagueId(leagueId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(LeaguesSubHeader);
})();


