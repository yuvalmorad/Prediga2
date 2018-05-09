window.component = window.component || {};
component.MainMenu = (function(){
    var connect = ReactRedux.connect,
        Menu = component.Menu,
        MenuItem = component.MenuItem;

    var MainMenu =  React.createClass({
        onMenuItemClicked: function(to) {
            this.props.toggleMenu(); //close menu
            window.routerHistory.push(utils.general.cutUrlPath(to));
        },

        onGroupMenuItemClicked: function(groupId) {
            this.props.toggleMenu(); //close menu
			var path = utils.general.cutUrlPath(routerHistory.location.pathname);
			window.routerHistory.push("/group/" + groupId + path);
        },

        onLogout: function() {
            this.props.toggleMenu(); //close menu
            service.authentication.logout().then(function(){
                window.routerHistory.push("/login");
            });
        },

        renderMenuItems: function(filterProperty) {
            var that = this;
            var props = this.props;

            return routePages.getPages().filter(function(page){
                return page[filterProperty];
            }).map(function(page, index){
                var to = page.path;
                var isSelected = false;
                var indication;
                if (to && utils.general.cutUrlPath(routerHistory.location.pathname) === utils.general.cutUrlPath(to)) {
                    isSelected = true;
                }

                return re(MenuItem, {text: page.title, icon: page.icon, isSelected: isSelected, onMenuItemClicked: that.onMenuItemClicked.bind(that, to), key: filterProperty + index});
            });
        },

        onGroupAdminSettingsClicked: function(groupId, event) {
            event.stopPropagation();
            this.props.toggleMenu(); //close menu
            window.routerHistory.push("/group/" + groupId + "/editAdminGroup");
        },

        onGroupUserSettingsClicked: function(groupId, event) {
            event.stopPropagation();
            this.props.toggleMenu(); //close menu
            window.routerHistory.push("/group/" + groupId + "/editUserGroup");
        },

        renderGroupsMenuItems: function(groups, selectedGroupId) {
            var that = this;
            return groups
                .sort(function(g1, g2){
                    if (g1._id === INITIAL_PUPLIC_GROUP) {
                        return -1;
                    }
                    if (g2._id === INITIAL_PUPLIC_GROUP) {
                        return 1;
                    }

                    return g1.name.localeCompare(g2.name);
                })
                .map(function(group){
                    var groupId = group._id;
                    var editActionButton;
                    if (group.createdBy === that.props.userId) {
                        //admin
                        editActionButton = {
                            icon: "",
                            onClick: that.onGroupAdminSettingsClicked.bind(that, groupId)
                        };
                    } else if (groupId === INITIAL_PUPLIC_GROUP) {
                        //initial public group
                        editActionButton = {
                            icon: ""
                        }
                    } else {
                        //user member
                        editActionButton = {
                            icon: "",
                            onClick: that.onGroupUserSettingsClicked.bind(that, groupId)
                        }
                    }

                    return re(MenuItem, {text: group.name, isSelected: selectedGroupId === groupId, onMenuItemClicked: that.onGroupMenuItemClicked.bind(that, groupId), actionButton: editActionButton, key: groupId});
            });
        },

        renderLogoutMenuItem: function() {
            return re(MenuItem, {text: "Sign Out", icon: "", onMenuItemClicked: this.onLogout, key: "logout1"});
        },

        onTopTitleActionClicked: function() {
            routerHistory.push("/joinGroup");
            this.props.toggleMenu();
        },

        render: function() {
            var props = this.props,
                groups = props.groups,
                selectedGroupId = props.selectedGroupId,
                topMenuItems = this.renderGroupsMenuItems(groups, selectedGroupId),
                bottomMenuItems = this.renderMenuItems("displayInBottomMenu");

            bottomMenuItems.push(this.renderLogoutMenuItem());

            return re(Menu, {topMenuTitle: "Join Group", topMenuItems: topMenuItems, bottomMenuItems: bottomMenuItems, toggleMenu: props.toggleMenu, onTopTitleActionClicked: this.onTopTitleActionClicked, className: "main-menu"});
        }
    });

    function mapStateToProps(state){
        return {
            isMainMenuOpen: state.general.isMainMenuOpen,
            groups: state.groups.groups,
            selectedGroupId: state.groups.selectedGroupId,
            userId: state.authentication.userId
        }
    }

    function mapDispatchToProps(dispatch) {
        return {
            toggleMenu: function(){dispatch(action.general.toggleMainMenu())},
            selectGroup: function(groupId){dispatch(action.groups.selectGroup(groupId))}
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(MainMenu);
})();


