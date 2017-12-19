component.App = (function(){
    var connect = ReactRedux.connect,
        withRouter = ReactRouterDOM.withRouter,
        SiteHeader = component.SiteHeader,
        SiteNavigation = component.SiteNavigation,
        Menu = component.Menu,
        TileDialogContainer = component.TileDialogContainer,
        Loading = component.Loading,
        Pages = component.Pages;

    var App = React.createClass({
        componentDidMount: function() {
            this.props.loadUsers();
        },

        render: function(){
            var path = routerHistory.location.pathname,
                currentPage = routePages.getPageByPath(path),
                title = currentPage.title,
                hideSiteHeader = currentPage.hideSiteHeader,
                hideSiteNavigation = currentPage.hideSiteNavigation,
                siteHeaderActionButtons = currentPage.siteHeaderActionButtons;

            return re("div", {className: "main"},
                re(SiteHeader, {title: title, hide: hideSiteHeader, siteHeaderActionButtons: siteHeaderActionButtons}),
                re(Pages, {}),
                re(SiteNavigation, {hide: hideSiteNavigation}),
                re(TileDialogContainer, {}),
                re(Menu, {}),
                re(Loading, {})
            )
        }
    });

    function mapStateToProps(state){
        return {
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadUsers: function(){dispatch(action.users.loadUsers())}
        }
    }

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
})();


