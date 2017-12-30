component.App = (function(){
    var connect = ReactRedux.connect,
        withRouter = ReactRouterDOM.withRouter,
        SiteHeader = component.SiteHeader,
        SiteNavigation = component.SiteNavigation,
        MainMenu = component.MainMenu,
        GroupsMenu = component.GroupsMenu,
        TileDialogContainer = component.TileDialogContainer,
        Loading = component.Loading,
        Pages = component.Pages;

    var App = React.createClass({
        componentDidMount: function() {
            this.props.loadGroupConfiguration();
            this.props.loadUsers();
            this.props.loadLeaguesAndClubs();
        },

        render: function(){
            var path = utils.general.cutUrlPath(routerHistory.location.pathname),
                currentPage = routePages.getPageByPath(path),
                title = currentPage.title,
                hideSiteHeader = currentPage.hideSiteHeader,
                hideSiteNavigation = currentPage.hideSiteNavigation,
                siteHeaderConfig = currentPage.siteHeaderConfig || {};

            return re("div", {className: "main"},
                re(SiteHeader, {title: title, hide: hideSiteHeader, siteHeaderConfig: siteHeaderConfig}),
                re(Pages, {}),
                re(SiteNavigation, {hide: hideSiteNavigation}),
                re(TileDialogContainer, {}),
                re(MainMenu, {}),
                re(GroupsMenu, {}),
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
            loadUsers: function(){dispatch(action.users.loadUsers())},
            loadLeaguesAndClubs: function(){dispatch(action.leagues.loadLeaguesAndClubs())},
            loadGroupConfiguration: function(){dispatch(action.groupConfiguration.load())}
        }
    }

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
})();


