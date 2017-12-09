component.SiteNavigation = (function(){
    var NavigationTab = component.NavigationTab;
    return function (props) {
        return re("div", { className: "site-navigation" + (props.hide ? " hide" : "") },
            re(NavigationTab, {to: "/", className: "games-prediction-tab"}),
            re(NavigationTab, {to: "/teamsPredictions", className: "teams-prediction-tab"}),
            re(NavigationTab, {to: "/leaderBoard", className: "leader-board-tab"})
        );
    };
})();


