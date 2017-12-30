component.SiteHeader = (function(){
    var connect = ReactRedux.connect;

    var SiteHeader = React.createClass({
            onBackButtonClicked: function() {
                routerHistory.goBack();
            },

            render: function () {
                var props = this.props,
                    hide = props.hide,
                    title = props.title,
                    siteHeaderConfig = props.siteHeaderConfig,
                    hideMenuButton = siteHeaderConfig.hideMenuButton,
                    hideMenuGroupsButton = siteHeaderConfig.hideMenuGroupsButton,
                    hasBackButton = siteHeaderConfig.hasBackButton;

                return re("div", { className: "site-header" + (hide ? " hide" : "") },
                    re("div", {className: "left"},
                        re("a", {className: "back-button" + (hasBackButton ? "" : " hide"), onClick: this.onBackButtonClicked}, "<"),
                        re("a", {className: "menu-button" + (this.props.isMainMenuOpen ? " selected" : "") + (hideMenuButton ? " hide" : ""), onClick: props.toggleMainMenu})
                    ),
                    re("div", {className: "center"}, title),
                    re("div", {className: "right"},
                        re("a", {className: "menu-groups-button" + (this.props.isMenuGroupsOpen ? " selected" : "") + (hideMenuGroupsButton ? " hide" : ""), onClick: props.toggleMenuGroups}, "groups")
                    )
            );
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
            toggleMainMenu: function(){dispatch(action.general.toggleMainMenu())},
            toggleMenuGroups: function(){dispatch(action.general.toggleMenuGroups())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
})();


