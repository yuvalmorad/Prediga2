window.component = window.component || {};
component.TeamLogo = (function(){
    return function(props) {
        var leagueName = props.leagueName,
            logoPosition = props.logoPosition,
            onClick = props.onClick,
            isHide = props.isHide,
            sprite = props.sprite || utils.general.leagueNameToIdName(leagueName),
            backgroundImage = utils.general.getLeagueLogoURL(sprite);

        return re("div", {className: "team-logo " + sprite + (isHide ? " hide" : ""), onClick: (!isHide && onClick), style: {backgroundImage: backgroundImage, backgroundPosition: logoPosition}});
    };
})();


