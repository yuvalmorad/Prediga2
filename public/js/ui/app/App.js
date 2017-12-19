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


