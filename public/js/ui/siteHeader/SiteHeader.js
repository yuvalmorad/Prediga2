window.component = window.component || {};
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
                    hasBackButton = siteHeaderConfig.hasBackButton,
                    isDynamicTitle = siteHeaderConfig.isDynamicTitle,
                    hideGroupsIcon = siteHeaderConfig.hideGroupsIcon,
                    siteHeaderTitle = props.siteHeaderTitle;

                return re("div", { className: "site-header" + (hide ? " hide" : "") },
                    re("div", {className: "left"},
                        re("a", {className: "back-button" + (hasBackButton ? "" : " hide"), onClick: this.onBackButtonClicked}, ""),
                        re("a", {className: "menu-button" + (this.props.isMainMenuOpen ? " selected" : "") + (hideMenuButton ? " hide" : ""), onClick: props.toggleMainMenu}, "")
                    ),
                    re("div", {className: "center"}, isDynamicTitle ? siteHeaderTitle: title),
                    re("div", {className: "right"},
                        re("div", {className: "group-icon" + (hideGroupsIcon ? " hide" : "")}, "")
                    )
            );
        }
    });

    function mapStateToProps(state){
        return {
            siteHeaderTitle: state.general.siteHeaderTitle,
            isMainMenuOpen: state.general.isMainMenuOpen
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            toggleMainMenu: function(){dispatch(action.general.toggleMainMenu())}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
})();


