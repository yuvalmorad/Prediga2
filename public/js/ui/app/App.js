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
                siteHeaderConfig = currentPage.siteHeaderConfig || {},
                siteClassName = "site";

            if (this.props.isMainMenuOpen) {
                siteClassName += " move-right";
            }

            if (this.props.isMenuGroupsOpen) {
                siteClassName += " move-left";
            }

            return re("div", {className: "main"},
                re("div", {className: siteClassName},
                    re(SiteHeader, {title: title, hide: hideSiteHeader, siteHeaderConfig: siteHeaderConfig}),
                    re(Pages, {}),
                    re(SiteNavigation, {hide: hideSiteNavigation}),
                    re(MainMenu, {}),
                    re(GroupsMenu, {})
                ),
                re(TileDialogContainer, {}),
                re(Loading, {})
            )
        }
    });

    function mapStateToProps(state){
        return {
            isMainMenuOpen: state.general.isMainMenuOpen,
            isMenuGroupsOpen: state.general.isMenuGroupsOpen
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


