component.App = (function(){
    var Route = ReactRouterDOM.Route,
        AuthenticateRoute = component.AuthenticateRoute,
        SiteHeader = component.SiteHeader,
        SiteNavigation = component.SiteNavigation,
        TileDialogContainer = component.TileDialogContainer,
        Loading = component.Loading;

    var pages = routePages.getPages().map(function(page, index){
        var Component;
        if (page.isAuthenticatedPage) {
            Component = AuthenticateRoute;
        } else {
            Component = Route;
        }

        return re(Component, {exact: !!page.exact, path: page.path, component: page.component, key: index});
    });

    return function(){
        var path = routerHistory.location.pathname;
        var currentPage = routePages.getPageByPath(path);
        var title = currentPage.title;
        var hideSiteHeader = currentPage.hideSiteHeader;
        var hideSiteNavigation = currentPage.hideSiteNavigation;
        var pageClassName = "page";

        if (!hideSiteHeader) {
            pageClassName += " hasSiteHeader";
        }

        if (!hideSiteNavigation) {
            pageClassName += " hasSiteNavigation";
        }

        return re("div", {className: "main"},
            re(SiteHeader, {title: title, hide: hideSiteHeader}),
            re("div", {className: pageClassName }, pages),
            re(SiteNavigation, {hide: hideSiteNavigation}),
            re(TileDialogContainer, {}),
            re(Loading, {})
        )
    }
})();


