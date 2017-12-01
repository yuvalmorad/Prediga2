component.Pages = (function(){
    var Route = ReactRouterDOM.Route,
        AuthenticateRoute = component.AuthenticateRoute;

    return function(props) {
        var pages = routePages.getPages().map(function(page, index){
            var Component;
            if (page.isAuthenticatedPage) {
                Component = AuthenticateRoute;
            } else {
                Component = Route;
            }

            return re(Component, {exact: !!page.exact, path: page.path, component: page.component, key: index});
        });

        var path = routerHistory.location.pathname;
        var currentPage = routePages.getPageByPath(path);
        var hideSiteHeader = currentPage.hideSiteHeader;
        var hideSiteNavigation = currentPage.hideSiteNavigation;
        var pageClassName = "page";

        if (!hideSiteHeader) {
            pageClassName += " hasSiteHeader";
        }

        if (!hideSiteNavigation) {
            pageClassName += " hasSiteNavigation";
        }

        return re("div", {className: pageClassName}, pages);
    };
})();

