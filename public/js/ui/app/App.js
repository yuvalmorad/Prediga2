component.App = (function(){
    var SiteHeader = component.SiteHeader,
        SiteNavigation = component.SiteNavigation,
        TileDialogContainer = component.TileDialogContainer,
        Loading = component.Loading,
        Pages = component.Pages;

    var App = function() {
        var path = routerHistory.location.pathname;
        var currentPage = routePages.getPageByPath(path);
        var title = currentPage.title;
        var hideSiteHeader = currentPage.hideSiteHeader;
        var hideSiteNavigation = currentPage.hideSiteNavigation;

        return re("div", {className: "main"},
            re(SiteHeader, {title: title, hide: hideSiteHeader}),
            re(Pages, {}),
            re(SiteNavigation, {hide: hideSiteNavigation}),
            re(TileDialogContainer, {}),
            re(Loading, {})
        )
    };

    return App;

})();


