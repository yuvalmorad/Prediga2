window.component = window.component || {};
component.SiteHeader = (function(){
    var connect = ReactRedux.connect;

    var SiteHeader = React.createClass({
            onBackButtonClicked: function() {
                routerHistory.goBack();
            },

            onActionClicked: function(action) {
                this.props.fireSiteHeaderEvent(action.eventName);
            },

            render: function () {
                var that = this,
                    props = this.props,
                    hide = props.hide,
                    title = props.title,
                    siteHeaderConfig = props.siteHeaderConfig,
                    hideMenuButton = siteHeaderConfig.hideMenuButton,
                    hasBackButton = siteHeaderConfig.hasBackButton,
                    isDynamicTitle = siteHeaderConfig.isDynamicTitle,
                    hideGroupsIcon = siteHeaderConfig.hideGroupsIcon,
                    actions = siteHeaderConfig.actions || [],
                    siteHeaderTitle = props.siteHeaderTitle;

                var actionsElems = actions.map(function(action) {
                    return re("div", {className: "action-icon", onClick: that.onActionClicked.bind(that, action)}, action.icon);
                });

                return re("div", { className: "site-header" + (hide ? " hide" : "") },
                    re("div", {className: "left"},
                        re("a", {className: "back-button" + (hasBackButton ? "" : " hide"), onClick: this.onBackButtonClicked}, ""),
                        re("a", {className: "menu-button" + (this.props.isMainMenuOpen ? " selected" : "") + (hideMenuButton ? " hide" : ""), onClick: props.toggleMainMenu}, "")
                    ),
                    re("div", {className: "center"}, isDynamicTitle ? siteHeaderTitle: title),
                    re("div", {className: "right"},
                        re("div", {className: "group-icon" + (hideGroupsIcon ? " hide" : "")}, ""),
                        actionsElems
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
            toggleMainMenu: function(){dispatch(action.general.toggleMainMenu())},
            fireSiteHeaderEvent: function(eventName){dispatch(action.general.fireSiteHeaderEvent(eventName))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(SiteHeader);
})();


