window.component = window.component || {};
component.TeamLogo = (function(){
    return function(props) {
        var leagueName = props.leagueName,
            logoPosition = props.logoPosition,
            onClick = props.onClick,
            isHide = props.isHide,
            leagueIdName = utils.general.leagueNameToIdName(leagueName),
            backgroundImage = utils.general.getLeagueLogoURL(leagueIdName);

        return re("div", {className: "team-logo " + leagueIdName + (isHide ? " hide" : ""), onClick: (!isHide && onClick), style: {backgroundImage: backgroundImage, backgroundPosition: logoPosition}});
    };
})();


