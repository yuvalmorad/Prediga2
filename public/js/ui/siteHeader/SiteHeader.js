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

            getSelectedGroupIcon: function() {
                var props = this.props;
                var group = props.groups.filter(function(group){
                    return group._id ===  props.selectedGroupId;
                })[0];

                return group ? group.icon : "";
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
                    siteHeaderTitle = props.siteHeaderTitle,
                    displayBackButton = hasBackButton;

                var actionsElems = actions.map(function(action) {
                    return re("div", {className: "action-icon", onClick: that.onActionClicked.bind(that, action)}, action.icon);
                });

                if (!window.lastHistoryPath) {
                    //no prev
                    displayBackButton = false;
                }

                return re("div", { className: "site-header" + (hide ? " hide" : "") },
                    re("div", {className: "left"},
                        re("a", {className: "back-button" + (displayBackButton ? "" : " hide"), onClick: this.onBackButtonClicked}, ""),
                        re("a", {className: "menu-button" + (this.props.isMainMenuOpen ? " selected" : "") + (hideMenuButton ? " hide" : ""), onClick: props.toggleMainMenu}, "")
                    ),
                    re("div", {className: "center"}, isDynamicTitle ? siteHeaderTitle: title),
                    re("div", {className: "right"},
                        re("div", {className: "group-icon" + (hideGroupsIcon ? " hide" : "")}, this.getSelectedGroupIcon()),
                        actionsElems
                    )
            );
        }
    });

    function mapStateToProps(state){
        return {
            siteHeaderTitle: state.general.siteHeaderTitle,
            isMainMenuOpen: state.general.isMainMenuOpen,
            groups: state.groups.groups,
            selectedGroupId: state.groups.selectedGroupId
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


