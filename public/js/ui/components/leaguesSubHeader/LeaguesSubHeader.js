component.LeaguesSubHeader = (function(){
    return function(props){
        var that = this,
            leagues = props.leagues,
            selectedLeagueId = props.selectedLeagueId;

        var leagueItemsElem = leagues.map(function(league){
            var leagueId = league.id;
            return re("div", {className: "league-item" + (leagueId === selectedLeagueId ? " selected" : ""), onClick: props.onLeagueClicked.bind(that, leagueId), key: leagueId}, league.name);
        });

        return re("div", {className: "subHeader leagues-sub-header"},
            leagueItemsElem
        )
    }
})();


