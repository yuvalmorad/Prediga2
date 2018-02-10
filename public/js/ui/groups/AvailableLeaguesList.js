window.component = window.component || {};
component.AvailableLeaguesList = (function(){
    var TeamLogo = component.TeamLogo;

    return function(props) {
        var that = this;
        return re("div", {className: "available-leagues-list"},
            props.leagues.map(function(league){
                var leagueName = league.name;
                return re("div", {className: props.selectedLeagueIds.indexOf(league._id) >= 0 ? "selected" : "", onClick: props.onLeagueClicked.bind(that, league._id)},
                    re(TeamLogo, {leagueName: leagueName, logoPosition: league.logoPosition}),
                    re("div", {}, leagueName)
                );
            })
        );
    }
})();


