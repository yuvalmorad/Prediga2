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

            onGroupIconClicked: function() {
                routerHistory.push("/group/" + this.props.selectedGroupId + "/rules");
            },

            render: function () {
                var that = this,
                    props = this.props,
                    hide = props.hide,
                    title = props.title,
                    siteHeaderConfig = props.siteHeaderConfig,
                    hideMenuButton = siteHeaderConfig.hideMenuButton,
                    hasBackButton = siteHeaderConfig.hasBackButton,
					displayGroupNameTitle = siteHeaderConfig.displayGroupNameTitle,
                    hideGroupsIcon = siteHeaderConfig.hideGroupsIcon,
                    actions = siteHeaderConfig.actions || [],
                    displayBackButton = hasBackButton,
                    group = utils.general.findItemInArrBy(props.groups, "_id", props.selectedGroupId),
                    league = utils.general.findItemInArrBy(props.leagues, "_id", props.selectedLeagueId),
                    leagueColor = league ? league.color : "";



                var actionsElems = actions.map(function(action) {
                    if (action.icon) {
                        return re("div", {className: "action-icon", onClick: that.onActionClicked.bind(that, action)}, action.icon);
                    } else {
                        return re("button", {className: "action-button", onClick: that.onActionClicked.bind(that, action)}, action.buttonText);
                    }
                });

                if (!window.lastHistoryPath) {
                    //no prev
                    displayBackButton = false;
                }

                return re("div", { className: "site-header" + (hide ? " hide" : ""), style: {color: leagueColor}},
                    re("div", {className: "left"},
                        re("a", {className: "back-button" + (displayBackButton ? "" : " hide"), onClick: this.onBackButtonClicked}, ""),
                        re("a", {
                                    className: "menu-button" + (this.props.isMainMenuOpen ? " selected" : "") + (hideMenuButton ? " hide" : ""),
                                    onClick: props.toggleMainMenu,
                                    style: {backgroundColor: this.props.isMainMenuOpen ? leagueColor : ""}
                                },
                           re("span", {}, "")
                        ),
						re("a", {className: "info-button" + (hideGroupsIcon ? " hide" : ""), onClick: this.onGroupIconClicked}, "")
                    ),
                    re("div", {className: "center"}, displayGroupNameTitle ? (group ? group.name : "") : title),
                    re("div", {className: "right"},
                        re("div", {className: "group-icon" + (hideGroupsIcon ? " hide" : ""), style: {"color": group ? group.iconColor: ""}}, group ? group.icon : ""),
                        actionsElems
                    )
            );
        }
    });

    function mapStateToProps(state){
        return {
            isMainMenuOpen: state.general.isMainMenuOpen,
            groups: state.groups.groups,
            selectedGroupId: state.groups.selectedGroupId,
            selectedLeagueId: state.groups.selectedLeagueId,
            leagues: state.leagues.leagues
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


