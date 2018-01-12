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
                isMainMenuOpen = this.props.isMainMenuOpen,
                isMenuGroupsOpen = this.props.isMenuGroupsOpen,
                scrollSiteClassName = "scroll-site",
                siteCoverClassName = "site-cover";

            if (isMainMenuOpen) {
                scrollSiteClassName += " move-right";
            }

            if (isMenuGroupsOpen) {
                scrollSiteClassName += " move-left";
            }

            if (!isMainMenuOpen && !isMenuGroupsOpen) {
                siteCoverClassName += " hide";
            }

            if (siteHeaderConfig.actions) {

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
            isMainMenuOpen: state.general.isMainMenuOpen,
            isMenuGroupsOpen: state.general.isMenuGroupsOpen
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            loadUsers: function(){dispatch(action.users.loadUsers())},
            loadLeaguesAndClubs: function(){dispatch(action.leagues.loadLeaguesAndClubs())},
            loadGroupConfiguration: function(){dispatch(action.groupConfiguration.load())},
            closeAllMenus: function(){dispatch(action.general.closeAllMenus())}
        }
    }

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
})();


