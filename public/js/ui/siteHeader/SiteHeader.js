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
                        re("a", {className: "menu-button" + (hideMenuButton ? " hide" : ""), onClick: props.toggleMenu})
                    ),
                    re("div", {className: "center"}, title),
                    re("div", {className: "right"},
                        re("a", {className: "menu--groups-button" + (hideMenuGroupsButton ? " hide" : ""), onClick: props.toggleMenuGroups}, "groups")
                    )
            );
        }
    });

    function mapStateToProps(state){
        return {

        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            toggleMenu: function(){dispatch(action.general.toggleMenu())},
            toggleMenuGroups: function(){dispatch(action.general.toggleMenuGroups())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
})();


