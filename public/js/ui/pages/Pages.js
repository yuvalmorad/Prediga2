window.component = window.component || {};
component.Pages = (function(){
    var Route = ReactRouterDOM.Route,
        Redirect = ReactRouterDOM.Redirect,
		Switch = ReactRouterDOM.Switch,
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

        pages.push(re(Redirect, {from: '/', to: ('/group/' + INITIAL_PUPLIC_GROUP + '/matchPredictions')}));

        var switchPages = re(Switch, {}, pages);

        var path = utils.general.cutUrlPath(routerHistory.location.pathname);
        var currentPage = routePages.getPageByPath(path);
        var hideSiteHeader = currentPage.hideSiteHeader;
        var hideSiteNavigation = currentPage.hideSiteNavigation;
        var pageClassName = "page";

        /*if (props.animatePageDirection) {
            pageClassName += (" animate-" + props.animatePageDirection + "-to-center");
        }*/

        if (!hideSiteHeader) {
            pageClassName += " hasSiteHeader";
        }

        if (!hideSiteNavigation) {
            pageClassName += " hasSiteNavigation";
        }

        return re("div", {className: pageClassName}, switchPages);
    };
})();


