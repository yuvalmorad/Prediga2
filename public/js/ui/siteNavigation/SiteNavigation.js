component.SiteNavigation = (function(){
    var NavigationTab = component.NavigationTab;
    return function (props) {
        var tabs = routePages.getPages().filter(function(page){
            return page.displayInSiteNavigation;
        }).map(function(page, index){
            return re(NavigationTab, {to: page.path, className: page.name + "-tab", key: index});
        });

        return re("div", { className: "site-navigation" + (props.hide ? " hide" : "") },
            tabs
        );
    };
})();


