component.App = (function(){
    var SiteHeader = component.SiteHeader,
        SiteNavigation = component.SiteNavigation,
        Menu = component.Menu,
        TileDialogContainer = component.TileDialogContainer,
        Loading = component.Loading,
        Pages = component.Pages;

    var prevIndex = undefined;

    return function() {
        var path = routerHistory.location.pathname;
        var currentPage = routePages.getPageByPath(path);
        var title = currentPage.title;
        var hideSiteHeader = currentPage.hideSiteHeader;
        var hideSiteNavigation = currentPage.hideSiteNavigation;
        var animatePageDirection = "";
        var nextIndex = routePages.getPages().indexOf(currentPage);

        if (prevIndex !== undefined && nextIndex >= 0) {
            if (prevIndex < nextIndex) {
                animatePageDirection = "right";
            } else if (prevIndex > nextIndex){
                animatePageDirection = "left";
            }
        }

        prevIndex = nextIndex;

        return re("div", {className: "main"},
            re(SiteHeader, {title: title, hide: hideSiteHeader}),
            re(Pages, {animatePageDirection: animatePageDirection}),
            re(SiteNavigation, {hide: hideSiteNavigation}),
            re(TileDialogContainer, {}),
            re(Menu, {}),
            re(Loading, {})
        )
    };
})();


