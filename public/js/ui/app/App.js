window.component = window.component || {};
component.App = (function(){
    var connect = ReactRedux.connect,
        withRouter = ReactRouterDOM.withRouter,
        SiteHeader = component.SiteHeader,
        SiteNavigation = component.SiteNavigation,
        MainMenu = component.MainMenu,
        TileDialogContainer = component.TileDialogContainer,
        Pages = component.Pages;

    var App = React.createClass({

        componentWillReceiveProps: function() {
            window.lastHistoryPath = routerHistory.location.pathname;
        },

        componentDidMount: function() {
            this.props.loadGroups();
            this.props.loadGroupsConfiguration();
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
                isMainMenuOpen = this.props.isMainMenuOpen,
                scrollSiteClassName = "scroll-site",
                siteCoverClassName = "site-cover";

            if (isMainMenuOpen) {
                scrollSiteClassName += " move-right";
            } else {
                siteCoverClassName += " hide";
            }

            return re("div", {className: "main"},
                re("div", {className: scrollSiteClassName},
                    re("div", {className: "site"},
                        re(SiteHeader, {title: title, hide: hideSiteHeader, siteHeaderConfig: siteHeaderConfig}),
                        re(Pages, {}),
                        re(SiteNavigation, {hide: hideSiteNavigation})
                    ),
                    re(MainMenu, {}),
                    re("div", {className: siteCoverClassName, onClick: this.props.closeAllMenus})
                ),
                re(TileDialogContainer, {})
            )
        }
    });

    function mapStateToProps(state){
        return {
            isMainMenuOpen: state.general.isMainMenuOpen
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadGroups: function(){dispatch(action.groups.load())},
            loadUsers: function(){dispatch(action.users.loadUsers())},
            loadLeaguesAndClubs: function(){dispatch(action.leagues.loadLeaguesAndClubs())},
            loadGroupsConfiguration: function(){dispatch(action.groupsConfiguration.load())},
            closeAllMenus: function(){dispatch(action.general.closeAllMenus())}
        }
    }

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
})();


