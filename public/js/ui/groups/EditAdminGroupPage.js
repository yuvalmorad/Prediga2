window.component = window.component || {};
component.EditAdminGroupPage = (function(){
    var connect = ReactRedux.connect;
    var EditAdminGroupTile = component.EditAdminGroupTile;
    var SelectGroupIcon = component.SelectGroupIcon;
    var Secret = component.Secret;
    var AvailableLeaguesList = component.AvailableLeaguesList;

    var EditAdminGroupPage = React.createClass({
        getInitialState: function() {
            if (!this.props.allAvailableLeagues.length) {
                //no available leagues yet-> load all
                this.props.loadAllAvailableLeagues();
            }

			this.props.loadLeaderBoard(this.props.match.params.groupId);

            var group = this.getGroup(this.props.groups);
            return this.createInitState(group);
        },

        componentWillReceiveProps: function(nextProps) {
            var groups = nextProps.groups;
            if (groups.length && groups !== this.props.groups) {
                var group = this.getGroup(groups);
                if (group) {
                    var state = this.createInitState(group);
                    this.setState(state);
                }
            }
        },

        createInitState: function(group) {
            var state = {
                group: group,
                displaySelectGroupIconPage: false,
                groupName: group ? group.name : "",
                groupIcon: group ? group.icon : "",
                groupIconColor: group ? group.iconColor : "",
                leagueIds: group ? group.leagueIds : [],
                isDirty: false
            };

            if (group && group.secret) {
                this.addSecretToState(state, group);
            }

            return state;
        },

        addSecretToState: function(state, group) {
            for (var i = 0; i < group.secret.length; i++) {
                state["secret" + i] = group.secret.charAt(i);
            }
        },

        getGroup: function(groups) {
            var groupId = this.props.match.params.groupId;
            return utils.general.findItemInArrBy(groups, "_id", groupId);
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
            var stateToUpdate = {
                name: state.groupName,
                icon: state.groupIcon,
                iconColor: state.groupIconColor,
                leagueIds: state.leagueIds,
                secret: ""
            };

            for (var i = 0; i < SECRET_LENGTH; i++) {
                stateToUpdate.secret += state["secret" + i];
            }

            var groupToUpdate = Object.assign({}, state.group, stateToUpdate);

            groupToUpdate.configuration = groupConfiguration;

            props.updateGroupConfiguration(groupToUpdate);
            this.setState({
                isDirty: false
            });
        },

        onCancel: function() {
            var group = this.state.group;
            var stateToUpdate = {
                isDirty: false,
                groupName: group.name,
                groupIcon: group.icon,
                groupIconColor: group.iconColor,
                leagueIds: group.leagueIds
            };

            this.addSecretToState(stateToUpdate, group);

            this.setState(stateToUpdate);
        },

        onLeagueClicked: function(leagueId) {
            var selectedLeagueIdsCopy = this.state.leagueIds.slice(0);
            var index = selectedLeagueIdsCopy.indexOf(leagueId);
            if (index >= 0) {
                selectedLeagueIdsCopy.splice(index, 1);
            } else {
                selectedLeagueIdsCopy.push(leagueId);
            }

            this.setState({leagueIds: selectedLeagueIdsCopy, isDirty: true});
        },

        selectAllLeaguesChanged: function(event) {
            var selectedLeagueIdsCopy;
            var isSelectedAll = event.target.checked;
            if (isSelectedAll) {
                selectedLeagueIdsCopy = this.props.allAvailableLeagues.map(function(league){
                    return league._id;
                });
            } else {
                selectedLeagueIdsCopy = [];
            }

            this.setState({leagueIds: selectedLeagueIdsCopy, isDirty: true});
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

        onSecretNumberChanged: function(name, num) {
            var newState = {isDirty: true};
            newState[name] = num;
            this.setState(newState);
        },

        render: function() {
            var that = this;
            var props = this.props;
            var state = this.state;
            var group = state.group;
            var isDirty = state.isDirty;
            var users = props.users;
            var allAvailableLeagues = props.allAvailableLeagues;
            var leaders = props.leaders[0] || [];
            var usersInGroup = [];
            var isFormValid = true;
            var groupNameClassName = "group-name";
            var groupIconClassName = "group-icon";
            var selectLeaguesClassName = "sub-title";
            var mainElement;
            var secretProps = {
                onNumberChanged: this.onSecretNumberChanged
            };

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

                    if (!state.leagueIds.length) {
                        isFormValid = false;
                        selectLeaguesClassName += " invalid";
                    }

                    for (var i = 0; i < SECRET_LENGTH; i++) {
                        secretProps["secret" + i] = state["secret" + i];
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
                    if (!user1.name || user2.name) {
                        return -1;
                    }

                    if (user1.isAdmin) {
                        return -1;
                    }

                    if (user2.isAdmin) {
                        return 1;
                    }

                    return user1.name.localeCompare(user2.name);
                }).map(function(user){
                    var userId = user._id;
                    var leader = utils.general.findItemInArrBy(leaders, "userId", userId);
                    return re(EditAdminGroupTile, {user: user, onRemoveUserFromGroup: that.onRemoveUserFromGroup.bind(that, userId), groupId: group._id, key: userId});
                });

                mainElement = re("div", {className: "scroll-container"},
                    re("div", {className: "title"}, "Group Details"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Name:"),
                        re("div", {className: "small-text"}, "Max 64 Characters")
                    ),
                    re("input", {type: "text", className: groupNameClassName, value: state.groupName, onChange: this.onGroupNameChange}),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Access Code:"),
                        re("div", {className: "small-text"}, "Only Numbers")
                    ),
                    re(Secret, secretProps),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: "sub-title"}, "Group Icon:")
                    ),
                    re("div", {className: "select-icon-row"},
                        re("div", {className: groupIconClassName, style: {color: state.groupIconColor}}, state.groupIcon),
                        re("button", {onClick: this.openSelectIconPage}, "Select Icon")
                    ),
                    re("div", {className: "title"}, "Competitions"),
                    re("div", {className: "sub-title-container"},
                        re("div", {className: selectLeaguesClassName}, "Choose the leagues and tournaments to be contested in your group"),
                        re("div", {className: "select-all-container"},
                            re("label", {className: "small-text", htmlFor: "selectAllCheckbox"}, "Select All"),
                            re("input", {type: "checkbox", id: "selectAllCheckbox", onChange: this.selectAllLeaguesChanged})
                        )
                    ),
                    re(AvailableLeaguesList, {leagues: allAvailableLeagues, selectedLeagueIds: state.leagueIds, onLeagueClicked: this.onLeagueClicked}),
                    re("div", {className: "row-buttons"},
                        re("button", {disabled: !isDirty, onClick: this.onCancel}, "Cancel"),
                        re("button", {disabled: !isDirty || !isFormValid, onClick: this.onSave}, "Submit")
                    ),
                    re("div", {className: "title"}, "Users"),
                    usersTiles,
                    re("button", {className: "delete-group-button", onClick: this.deleteGroup}, "Delete Group")
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
			selectedGroupId: state.groups.selectedGroupId,
            users: state.users.users,
            groupsConfiguration: state.groupsConfiguration.groupsConfiguration,
            allAvailableLeagues: state.leagues.allAvailableLeagues,
			leaders: state.leaderBoard.leaders
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            updateGroup: function(group){dispatch(action.groups.updateGroup(group))},
            updateGroupConfiguration: function(group){dispatch(action.groups.updateGroupConfiguration(group))},
            removeGroup: function(group){dispatch(action.groups.removeGroup(group))},
            loadAllAvailableLeagues: function(group){dispatch(action.leagues.loadAllAvailableLeagues())},
			loadLeaderBoard: function(groupId){dispatch(action.leaderBoard.loadLeaderBoard(groupId))}
        };
    }

    return connect(mapStateToProps, mapDispatchToProps)(EditAdminGroupPage);
})();


