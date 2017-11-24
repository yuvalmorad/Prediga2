component.SiteNavigation = (function(){
    var NavigationTab = component.NavigationTab;
    return function (props) {
        return re("div", { className: "site-navigation" + (props.hide ? " hide" : "") },
            re(NavigationTab, {to: "/", className: "icon-lifebuoy"}),
            re(NavigationTab, {to: "/leaderBoard", className: "icon-trophy"}),
            re(NavigationTab, {to: "/teamsPredictions", className: "icon-credit-card"})
        );
    };
})();


