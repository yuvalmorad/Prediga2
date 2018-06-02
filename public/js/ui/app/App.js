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

        componentWillReceiveProps: function(nextProps) {
            window.lastHistoryPath = routerHistory.location.pathname;
            this.selectGroup(nextProps.selectedGroupId);
        },

        componentDidMount: function() {
            this.props.initAll();
            this.selectGroup(this.props.selectedGroupId);
        },

        selectGroup: function(lastGroupIdSelected) {
			var groupId = utils.general.getGroupIdFromUrl(routerHistory.location.pathname);
			if (!groupId) {
                return;
			}

			if (groupId !== lastGroupIdSelected) {
				this.props.selectGroup(groupId);
			}
        },

        render: function(){
            var path = utils.general.cutUrlPath(routerHistory.location.pathname),
                currentPage = routePages.getPageByPath(path),
                title = currentPage.title,
                hideSiteHeader = currentPage.hideSiteHeader,
                hideSiteNavigation = currentPage.hideSiteNavigation,
                siteHeaderConfig = currentPage.siteHeaderConfig || {},
                isMainMenuOpen = this.props.isMainMenuOpen,
                isShowTileDialog = this.props.isShowTileDialog,
                scrollSiteClassName = "scroll-site",
                siteCoverClassName = "site-cover";

            if (isMainMenuOpen) {
                scrollSiteClassName += " move-right";
            } else {
                siteCoverClassName += " hide";
            }

            return re("div", {className: "main" + (isShowTileDialog ? " dialog-open" : "")},
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
            isShowTileDialog: state.general.isShowTileDialog,
			selectedGroupId: state.groups.selectedGroupId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            initAll: function(){dispatch(action.init.initAll())},
            closeAllMenus: function(){dispatch(action.general.closeAllMenus())},
			selectGroup: function(groupId){dispatch(action.groups.selectGroup(groupId))}
        }
    }

    return withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
})();


