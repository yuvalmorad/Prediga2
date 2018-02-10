window.component = window.component || {};
component.EditAdminGroupPage = (function(){
    var connect = ReactRedux.connect;
    var EditAdminGroupTile = component.EditAdminGroupTile;
    var SelectGroupIcon = component.SelectGroupIcon;

    var EditAdminGroupPage = React.createClass({
        getInitialState: function() {
            var group = this.getGroupAndSetHeader(this.props.groups);
            return {
                group: group,
                displaySelectGroupIconPage: false,
                groupName: group ? group.name : "",
                groupIcon: group ? group.icon : "",
                groupIconColor: group ? group.iconColor : "",
                isDirty: false
            };
        },

        componentWillReceiveProps: function(nextProps) {
            var groups = nextProps.groups;
            if (groups.length && groups !== this.props.groups) {
                var group = this.getGroupAndSetHeader(groups);
                if (group) {
                    this.setState({group: group, groupName: group.name, groupIcon: group.icon, groupIconColor: group.iconColor});
                }
            }
        },

        getGroupAndSetHeader: function(groups) {
            var groupId = this.props.match.params.groupId;
            var group = utils.general.findItemInArrBy(groups, "_id", groupId);
            if (group) {
                this.props.setSiteHeaderTitle(group.name);
            }
            return group;
        },

        onRemoveUserFromGroup: function(userId) {
            var that = this;
            var group = this.state.group;
            if (confirm("Are you sure?")) {
                service.groups.kickUser(group._id, userId).then(function(){
                    group.users.splice(group.users.indexOf(userId), 1);
                    that.props.updateGroup(group);
                }, function() {
                    alert("failed remove user");
                });
            }
        },

        onGroupNameChange: function(event) {
            var value = event.target.value;
            this.setState({
                groupName: value,
                isDirty: true
            });
        },

        onSave: function() {
            var props = this.props;
            var state = this.state;
            var groupConfiguration = utils.general.getGroupConfiguration(props.groups, state.group._id, props.groupsConfiguration);
            var groupToUpdate = Object.assign({}, state.group, {
                name: state.groupName,
                icon: state.groupIcon,
                iconColor: state.groupIconColor
            });

            groupToUpdate.configuration = groupConfiguration;

            props.updateGroupConfiguration(groupToUpdate);
            this.setState({
                isDirty: false
            });
        },

        onCancel: function() {
            var group = this.state.group;
            this.setState({
                isDirty: false,
                groupName: group.name,
                groupIcon: group.icon,
                groupIconColor: group.iconColor
            });
        },

        openSelectIconPage: function() {
            this.setState({displaySelectGroupIconPage: true});
        },

        onSelectGroupIconSave: function(selectedIcon, selectedColor) {
            this.setState({displaySelectGroupIconPage: false, groupIcon: selectedIcon, groupIconColor: selectedColor, isDirty: true});
        },

        onSelectGroupIconCancel: function() {
            this.setState({displaySelectGroupIconPage: false});
        },

        deleteGroup: function() {
            var props = this.props;
            var group = this.state.group;

            if (confirm("Are you sure you want to delete this group?")) {
                service.groups.deleteGroup(group._id).then(function(){
                    props.removeGroup(group);
                    routerHistory.goBack();
                }, function() {
                    alert("failed deleting group");
                });
            }
        },

        render: function() {
            var that = this;
            var props = this.props;
            var state = this.state;
            var group = state.group;
            var isDirty = state.isDirty;
            var users = props.users;
            var usersInGroup = [];
            var isFormValid = true;
            var groupNameClassName = "group-name";
            var groupIconClassName = "group-icon";
            var mainElement;

            if (this.state.displaySelectGroupIconPage) {
                mainElement = re(SelectGroupIcon, {selectedIcon: state.groupIcon, selectedIconColor: state.groupIconColor, onSave: this.onSelectGroupIconSave, onCancel: this.onSelectGroupIconCancel});
            } else {
                if (group) {
                    if (!state.groupName) {
                        isFormValid = false;
                        groupNameClassName += " invalid";
                    }

                    if (!state.groupIcon) {
                        isFormValid = false;
                        groupIconClassName += " invalid";
                    }

                    usersInGroup = group.users.map(function(userId){
                        var user = utils.general.findItemInArrBy(users, "_id", userId);
                        return Object.assign({}, user, {
                            isAdmin: userId === group.createdBy,
                            place: "some place", //TODO
                            joinedDate: "some date" //TODO
                        });
                    });
                }

                var usersTiles = usersInGroup.sort(function(user1, user2){
                    if (user1.isAdmin) {
                        return -1;
                    }

                    if (user2.isAdmin) {
                        return 1;
                    }

                    return user1.name.localeCompare(user2.name);
                }).map(function(user){
                    var userId = user._id;
                    return re(EditAdminGroupTile, {user: user, onRemoveUserFromGroup: that.onRemoveUserFromGroup.bind(that, userId), key: userId});
                });

                mainElement = re("div", {className: "scroll-container"},
                    re("div", {className: "title"}, "Group Details"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Name:"),
                        re("div", {className: "small-text"}, "Max 64 Characters")
                    ),
                    re("input", {type: "text", className: groupNameClassName, value: state.groupName, onChange: this.onGroupNameChange}),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Icon:")
                    ),
                    re("div", {className: "select-icon-row"},
                        re("div", {className: groupIconClassName, style: {color: state.groupIconColor}}, state.groupIcon),
                        re("button", {onClick: this.openSelectIconPage}, "Select Icon")
                    ),
                    re("div", {className: "row-buttons"},
                        re("button", {disabled: !isDirty, onClick: this.onCancel}, "Cancel"),
                        re("button", {disabled: !isDirty || !isFormValid, onClick: this.onSave}, "Save")
                    ),
                    re("button", {className: "delete-group-button", onClick: this.deleteGroup}, "Delete Group"),
                    re("div", {className: "title"}, "Users"),
                    usersTiles
                );
            }

            return re("div", { className: "edit-group-page content" },
                mainElement
            );
        }
    });

    function mapStateToProps(state){
        return {
            groups: state.groups.groups,
            users: state.users.users,
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            setSiteHeaderTitle: function(title){dispatch(action.general.setSiteHeaderTitle(title))},
            updateGroup: function(group){dispatch(action.groups.updateGroup(group))},
            updateGroupConfiguration: function(group){dispatch(action.groups.updateGroupConfiguration(group))},
            removeGroup: function(group){dispatch(action.groups.removeGroup(group))}
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditAdminGroupPage);
})();


