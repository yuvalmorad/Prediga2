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
            this.props.selectGroup(groupId);
            this.props.toggleMenu(); //close menu
            //window.routerHistory.push("/");
        },

        onLogout: function() {
            this.props.toggleMenu(); //close menu
            service.authentication.logout().then(function(){
                window.routerHistory.push("/login");
            });
        },

        renderMenuItems: function(filterProperty) {
            var that = this;
            return routePages.getPages().filter(function(page){
                return page[filterProperty];
            }).map(function(page, index){
                var to = page.path;
                var isSelected = false;
                if (to && utils.general.cutUrlPath(routerHistory.location.pathname) === utils.general.cutUrlPath(to)) {
                    isSelected = true;
                }
                return re(MenuItem, {text: page.title, isSelected: isSelected, onMenuItemClicked: that.onMenuItemClicked.bind(that, to), key: filterProperty + index});
            });
        },

        onGroupSettingsClicked: function(groupId, event) {
            event.stopPropagation();
            this.props.toggleMenu(); //close menu
            window.routerHistory.push("/editGroup/" + groupId);
        },

        renderGroupsMenuItems: function(groups, selectedGroupId) {
            var that = this;
            //icon: "" for none admin
            return groups.map(function(group){
                var groupId = group._id;
                var editActionButton;
                if (group.createdBy === that.props.userId) {
                    editActionButton = {
                        icon: "",
                        onClick: that.onGroupSettingsClicked.bind(that, groupId)
                    };
                } else {
                    editActionButton = {
                        icon: ""
                    }
                }

                return re(MenuItem, {text: group.name, isSelected: selectedGroupId === groupId, onMenuItemClicked: that.onGroupMenuItemClicked.bind(that, groupId), actionButton: editActionButton, key: groupId});
            });
        },

        renderLogoutMenuItem: function() {
            return re(MenuItem, {text: "Log out", icon: "", onMenuItemClicked: this.onLogout, key: "logout1"});
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

            return re(Menu, {topMenuTitle: "My Groups", topMenuItems: topMenuItems, bottomMenuTitle: "Options", bottomMenuItems: bottomMenuItems, toggleMenu: props.toggleMenu, onTopTitleActionClicked: this.onTopTitleActionClicked, className: "main-menu"});
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


